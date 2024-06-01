const express = require("express");
const router = express.Router();

router.get("/testingDev", (req, res) => {
    console.log("hello terminal from js");
    res.send("Hello, from devices.js");
} );

module.exports = router;