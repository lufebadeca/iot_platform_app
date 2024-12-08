const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');


//API entrypoint to receive data from EMQX according to rule
//first, create a resource in EMQX with this entry URL
//then create a rule that sends data to this entrypoint to be processed
router.post('/saver-webhook', async (req, res) => {     // resource at: http://localhost:3001/api//saver-webhook

    const data = req.body;
    console.log(data.m);

    res.json("{}"); 

});


module.exports = router;