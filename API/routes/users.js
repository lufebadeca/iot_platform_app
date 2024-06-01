const express = require("express");
const router = express.Router();
const jst = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from '../models/user.js';

router.get('/new-user', async (req, res)=>{
    try {
        const user = await User.create(
            {
                name: "James",
                email: "j@gmail.com",
                password: "1234."
            });
            res.json({"status":"success"});
    } catch (error) {
        console.log(error);
        res.json({"status":"failed"});
    }

});

module.exports = router;