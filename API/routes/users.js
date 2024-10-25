const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models import
import User from '../models/user.js';     //requires babel, since NodeJs does not support these modern imports
                                //create a .babelrc file in the project folder, {"presets": "@babel/preset-env"}
                                //in package.json, scripts, create custom "devn": "nodemon api/index.js --exec babel-node"
                                //runs with npm run devn

//USER LOGIN with user auth and token retrieved for session persistance
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
    
        var user = await User.findOne({ email: email });    //retrieves user from mongoDB
        
        if(!user){
            const toSend = {
                status: "error",
                error: "Invalid credentials"
            }
            //401 is authentication error
            return res.status(401).json(toSend);
        };

        if (bcrypt.compareSync(password, user.password)){
            
            user.set('password', undefined, {strict:false});    //sets user.password to undefined to hide in token

            const token = jwt.sign({userData: user}, 'securePasswordHere', {expiresIn: 60*60*24*30});   //signs whole user
            
            const toSend = {
                status: "success",
                token: token,
                userData: user
            }
            //200 is process OK, can be omitted
            return res.status(200).json(toSend);
        }
        else{
            const toSend = {
                status: "error",
                error: "Invalid credentials"
            }
            //401 is authentication error
            return res.status(401).json(toSend);
        }

    } catch (error) {
        console.log("login error");
        console.log(error);
    }


});

//USER REGISTER
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
           status: "error",
           error: error
       };
   
       res.status(500).json(toSend);
   }
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