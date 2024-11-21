import Device from "../models/device";
const express = require("express");
const router = express.Router();

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

//CRUD -with post only?- (Create, Read, Update, Delete), should use GET/ POST/ Put/ Delete as standard

//localhost:3001/api/device?dId=XXX (URL runs a GET by default)
router.get("/device", checkAuth, async (req, res) => {

    try {
  
      const userId = req.userData._id;
      const devices = await Device.find({ userId: userId });
  
      const toSend = {
        status: "success",
        data: devices
      };
  
      res.json(toSend);
  
    } catch (error) {
  
      console.log("ERROR GETTING DEVICES")
  
      const toSend = {
        status: "error",
        error: error
      };
  
      return res.status(500).json(toSend);
    }
  });

router.post("/device", checkAuth, async (req, res) => {  //(Create)

    console.log( req.userData );
    const userId = req.userData._id;    //from token
    var newDevice = req.body.newDevice;

    //console.log( newDevice );

    newDevice.userId = userId; //adding userId to the device being passed
    newDevice.createdTime = Date.now();

    try {
        const device = await Device.create( newDevice );

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

router.put("/device", checkAuth, (req, res) => {    //Updates the selected property
    const dId = req.body.dId;
    const userId = req.userData._id;
  
    if (selectDevice(userId, dId)) {
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

module.exports = router;        //requires export to connect this endpoint with index

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