const express = require("express");
const router = express.Router();
const jst = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from '../models/user.js';     //requires babel, since NodeJs does not support these modern imports
                                //create a .babelrc file in the project folder, {"presets": "@babel/preset-env"}
                                //in package.json, scripts, create custom "devn": "nodemon api/index.js --exec babel-node"
                                //runs with npm run devn

router.get('/new-user', async (req, res)=>{
    try {
        const user = await User.create(     //using the User model, waits for a response
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