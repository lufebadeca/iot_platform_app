import Device from "../models/device";
import SaverRule from '../models/emqx_saver_rule.js';
import Template from '../models/template.js';

const express = require("express");
const router = express.Router();
const axios = require("axios");

const {checkAuth} = require('../middlewares/authentication');

/*router.get("/testingDev", (req, res) => {       //from here, instead of app.get you use router.get
    console.log("hello terminal from js");
    console.log(req.query);
    res.send("Hello, from devices.js");
} );

router.post("/testingDev", (req, res) => {       //from here, instead of app.get you use router.get
    console.log("hello terminal from Post");
    const toReturn = {
        status: "OK",
        data: "Hello from Post",
        sent: `${req.body.name} ${req.body.age} ${req.body.pass}` 
    };
    res.json(toReturn);
} );*/

//CRUD (Create, Read, Update, Delete), Get (URL query), Post, Delete (URL query), Put

const auth = {
  auth: {
    username: "admin",
    password: "Luifer94"
  }
};

//GET DEVICES
//localhost:3001/api/device?dId=XXX (URL runs a GET by default)
router.get("/device", checkAuth, async (req, res) => {

  try {

    const userId = req.userData._id;

    //get devices
    var devices = await Device.find({ userId: userId }); //mongoku object not equivalent to array,
    devices = JSON.parse(JSON.stringify(devices)) ;  //not directly mutable, hence decoupling
    //get saver rules
    const saverRules = await getSaverRules(userId);
    //saver rules stored in separate db. We want to append saverrule prop to each device

    //get templates
    const templates = await getTemplates(userId);
    //console.log(templates);

    //saver rules and templates to -> devices
    devices.forEach((device, index) => {    //filter returns an array, but we only need a single result, hence [0]
      devices[index].saverRule = saverRules.filter(saverRule => saverRule.dId == device.dId)[0];
      devices[index].template = templates.filter(template => template._id == device.templateId)[0];
    });

    const toSend = {
      status: "success",
      data: devices
    };

    res.json(toSend);

  } catch (error) {

    console.log("ERROR GETTING DEVICES");
    console.log(error);

    const toSend = {
      status: "error",
      error: error
    };

    return res.status(500).json(toSend);
  }
});

//NEW DEVICE
router.post("/device", checkAuth, async (req, res) => {  //(Create)
  //console.log( req.userData );
  const userId = req.userData._id;    //from token
  var newDevice = req.body.newDevice;

  //console.log( newDevice );

  newDevice.userId = userId; //adding userId to the device being passed
  newDevice.createdTime = Date.now();

  try {
      const device = await Device.create( newDevice );

      await createSaverRule(userId, newDevice.dId, true);  //upon creation, we immediately create and set saving rule to True
      await selectDevice(userId, newDevice.dId);

      const toSend = {
          status: "success"
      }
      res.json( toSend );

  } catch (error) {

      const toSend = {
          status: "error",
          error: error
      }
      console.log( "ERROR CREATING NEW DEVICE");
      console.log( error );
      res.status(500).json(toSend);
  }
});

router.delete("/device", checkAuth, async (req, res) => {  //(Delete)
  try {
      const userId = req.userData._id;
      const dId = req.query.dId;  //delete method uses query too
      
      await deleteSaverRule(dId);  //goes too if device deleted

      const result = await Device.deleteOne({ userId: userId, dId: dId  });
  
      const toSend = {
          status: "success",
          result: result
      }
  
      return res.json(toSend);
  } catch (error) {
      const toSend = {
          status: "error",
          error: error
      }
      console.log( "ERROR DELETING DEVICE");
      console.log( error );
      res.status(500).json(toSend);
  }
});

//UPDATE DEVICE (toggle 'selected' )
router.put("/device", checkAuth, async (req, res) => {    //Updates the 'selected' property
  const dId = req.body.dId;
  const userId = req.userData._id;

  if (await selectDevice(userId, dId)) {  //selectDevice returns true or false
    const toSend = {
      status: "success"
    };

    return res.json(toSend);
  } else {
    const toSend = {
      status: "error"
    };

    return res.json(toSend);
  }
});

//SAVER-RULE STATUS UPDATER
router.put('/saver-rule', checkAuth, async (req, res) => {
  
  const rule = req.body.rule;
  console.log(rule);
  await updateSaverRuleStatus(rule.emqxRuleId, rule.status)
  const toSend = {
    status: "success"
  };
  res.json(toSend);
  
});

/*
AUXILIARY FUNCTIONS
*/

//SELECT DEVICE: sets one to true, rest to false
async function selectDevice(userId, dId) {
  try {
    const result = await Device.updateMany(
      { userId: userId },
      { selected: false }
    );

    const result2 = await Device.updateOne(
      { dId: dId, userId: userId },
      { selected: true }
    );

    return true;

  } catch (error) {
    console.log("ERROR IN 'selectDevice' FUNCTION ");
    console.log(error);
    return false;
  }
}

/*
 SAVER RULES FUNCTIONS: BY MEANS OF EMQX API, WE CREATE RULES AND ASSOCIATE THEM TO DEVICES (dId, userId, state)
 THIS RULES ARE BOTH CREATED IN THE EMQX DASHBOARD AND IN A MONGO COLLECTION FOR PERSISTANCE
*/

//get templates
async function getTemplates(userId) {
  try {
    const templates = await Template.find({ userId: userId });
    return templates;
  } catch (error) {
    return false;
  }
} 

//get saver rules
async function getSaverRules(userId) {
  try {
    const rules = await SaverRule.find({ userId: userId }); //saver rules, all for a single user
    return rules;
  } catch (error) {
    return false;
  }
}

//create saver rule
async function createSaverRule(userId, dId, status) {
  try {
    const url = "http://localhost:8085/api/v4/rules";

    const topic = userId + "/" + dId + "/+/sdata";
    const rawsql = 'SELECT topic, payload FROM "' + topic + '" WHERE payload.save = 1';
    var newRule = {
      rawsql: rawsql,
      actions: [
        {
          name: "data_to_webserver",
          params: {
            $resource: global.saverResource.id,
            // payload_tmpl: '{"userId":"' + userId + '","payload":${payload},"topic":"${topic}"}',
            body: '{"userId":"' + userId + '","payload":${payload},"topic":"${topic}"}',
          }
        }
      ],
      description: "SAVER-RULE",
      enabled: status
    };
    //save rule in emqx - grabamos la regla en emqx
    const res = await axios.post(url, newRule, auth);

    if (res.status === 200 && res.data.data) {
      //console.log(res.data.data);

      await SaverRule.create({
        userId: userId,
        dId: dId,
        emqxRuleId: res.data.data.id,
        status: status
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error creating saver rule");
    console.log(error);
    return false;
  }
}

//update saver rule
async function updateSaverRuleStatus(emqxRuleId, status) {

  try {
    const url = "http://localhost:8085/api/v4/rules/" + emqxRuleId;

    const newRule = {
      enabled: status
    };
  
    const res = await axios.put(url, newRule, auth);
  
    if (res.status === 200 && res.data.data) {
      await SaverRule.updateOne({ emqxRuleId: emqxRuleId }, { status: status });
      console.log("Saver Rule Status Updated...".green);
      return true;
    }else{
      return false;
    }
  } catch (error) {
    return false;
  }
}

//delete saver rule
async function deleteSaverRule(dId) {
  try {
    const mongoRule = await SaverRule.findOne({ dId: dId });

    const url = "http://localhost:8085/api/v4/rules/" + mongoRule.emqxRuleId;

    const emqxRule = await axios.delete(url, auth);
    const deleted = await SaverRule.deleteOne({ dId: dId });

    return true;
  } catch (error) {
    console.log("Error deleting saver rule");
    console.log(error);
    return false;
  }
}

module.exports = router; //requires export to connect this endpoint with index

/* topic -> payload:
userId/dId/temperature -> 
{
  value: 21,
  save: 1
}
*/        

/*  
{
  "newDevice": {
      "userId": "abcde",
      "dId": "121212",
      "name": "HOME",
      "templateName": "esp32 template",
      "templateId": "ababab"
  }
}
*/