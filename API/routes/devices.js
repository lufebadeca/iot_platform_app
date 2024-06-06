const express = require("express");
const router = express.Router();

router.get("/testingDev", (req, res) => {       //from here, instead of app.get you use router.get
    console.log("hello terminal from js");
    res.send("Hello, from devices.js");
} );

module.exports = router;        //requires export to connect this endpoint with index