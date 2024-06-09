const express = require("express");
const router = express.Router();
const jst = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from '../models/user.js';     //requires babel, since NodeJs does not support these modern imports
                                //create a .babelrc file in the project folder, {"presets": "@babel/preset-env"}
                                //in package.json, scripts, create custom "devn": "nodemon api/index.js --exec babel-node"
                                //runs with npm run devn

//USER AUTH (login and register)
router.post("/register", async (req, res) => {
     //from the user model, check parameters: name, email, password
    

    try {
        const name = req.body.name;
        const email = req.body.email;
        const encryptedPassword = bcrypt.hashSync(req.body.password, 10);
        
        const newUser = {
            name: name,
            email: email,
            password: encryptedPassword
        };
    
        var user = await User.create(newUser);
    
        console.log(user);
    
        const toSend = {
            status: "success"
        };
    
        res.json(toSend);
        
    }
    catch (error) {
        console.log("failed user register");
        console.log(error);

        const toSend = {
            status: "error"
        };
    
        res.status(500).json(toSend);
    }
}); 

router.post("/login", (req, res) => {
});

//USER CRUD
router.delete("/devices", (req, res) => {  //(Delete)
    
});

router.put("/device", (req, res) => {  //Update
    
});


    /*router.get('/new-user', async (req, res)=>{
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
});*/

module.exports = router;