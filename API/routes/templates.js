import Template from "../models/template";
const express = require("express");
const router = express.Router();

const {checkAuth} = require('../middlewares/authentication');

router.get("/template", checkAuth, async (req, res) => {        //GET TEMPLATES

    try {
  
      const userId = req.userData._id;  //from token
      const templates = await Template.find({ userId: userId });
  
      const toSend = {
        status: "success",
        data: templates
      };
  
      res.json(toSend);
  
    } catch (error) {
        console.log(error);
        
      console.log("ERROR GETTING TEMPLATES");
  
      const toSend = {
        status: "error",
        error: error
      };
  
      return res.status(500).json(toSend);
    }
  });

router.post("/template", checkAuth, async (req, res) => {  //(Create)

    //console.log( req.userData );
    const userId = req.userData._id;    //from token
    var newTemplate = req.body.template; //EXPECTING NAME, DESCRIPTION, WIDGETS

    newTemplate.userId = userId; //adding userId to the device being passed
    newTemplate.createdTime = Date.now();
    console.log( newTemplate );

    try {
        const template = await Template.create( newTemplate );

        const toSend = {
            status: "success"
        }
        res.json( toSend );

    } catch (error) {

        const toSend = {
            status: "error",
            error: error
        }
        console.log( "ERROR CREATING NEW TEMPLATE");
        console.log( error );
        res.status(500).json(toSend);
    }


});

router.delete("/template", checkAuth, async (req, res) => {  //(Delete)
    
    try {
        const userId = req.userData._id;
        const templateId = req.query.templateId;  //delete method uses query too
    
        const result = await Template.deleteOne({ userId: userId, _id: templateId  });
    
        const toSend = {
            status: "success"
        }
    
        return res.json(toSend);

    } catch (error) {
        const toSend = {
            status: "error",
            error: error
        }
        console.log( "ERROR DELETING TEMPLATE");
        console.log( error );
        res.status(500).json(toSend);
    }

});

module.exports = router;        //requires export to connect this endpoint with index

/*
{
    "newTemplate": {
        "name": "Surveilance 32",
        "description": "Surveilance set with ESP32 CAM",
        "widgets": []
    }
}
*/