const express = require("express");
const router = express.Router();

/*router.get("/testingDev", (req, res) => {       //from here, instead of app.get you use router.get
    console.log("hello terminal from js");
    console.log(req.query);
    res.send("Hello, from devices.js");
} );*/

router.post("/testingDev", (req, res) => {       //from here, instead of app.get you use router.get
    console.log("hello terminal from Post");
    const toReturn = {
        status: "OK",
        data: "Hello from Post",
        sent: `${req.body.name} ${req.body.age} ${req.body.pass}` 
    };
    res.json(toReturn);
} );

//CRUD -with post only?- (Create, Read, Update, Delete), should use GET/ POST/ Put/ Delete as standard

//localhost:3001/api/device?dId=XXX (URL runs a GET by default)
router.get("/device", (req, res) => { //(read)

});

router.post("/device", (req, res) => {  //(Create)
    
});

router.delete("/devices", (req, res) => {  //(Delete)
    
});

router.put("/device", (req, res) => {  //Update
    
});

module.exports = router;        //requires export to connect this endpoint with index