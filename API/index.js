//requires sentences
const express = require('express');
const mongoose = require("mongoose");       //interaction with mongo
const morgan = require("morgan");   //gives output even if no result
const cors = require("cors");       //configures access from other sources
const colors = require("colors");     //enables color fonts in terminal

//instances
const app = express();  //app is the var that represents express

//express config
app.use(morgan("tiny"));    //output for all routes extant or not, tiny for small text
app.use(express.json());    //allows json usage
app.use(express.urlencoded({extended: true}));  //enables URL parameters ?userId=111&userName=222
app.use(cors());

//express routes ###IMPORTANT TO ADD EACH ROUTE HERE!!! USE SUB-DOMAIN API
app.use("/api", require("./routes/devices.js"))
app.use("/api", require("./routes/users.js"))

module.exports = app;       //this commands allows to export endpoints or routes in separate files and folder 

//listener
app.listen(3001, () => {console.log('API listening on 3001')});

//endpoint text (address to hit)
app.get("/testing", (req, res) => {     // /testing?Name=xxx&Age=ccc&Pass=sss
    const data = (`Name = ${req.query.name}, Age = ${req.query.age}, Pass= ${req.query.pass}`);
    console.log(data);
    res.send("Hello, web pals. the data is " + data);
} );

//Mongo Connection
const mongoUserName = "Luifer";
const mongoPassword = 1234;
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "ioticos_god_level";

var uri = "mongodb://" + mongoUserName + ":" + mongoPassword + "@" + mongoHost + ";" + mongoPort + "/" + mongoDatabase;

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
};

try {
    mongoose.connect(uri, options).then(
        ()=>{
            console.log("\n");
            console.log("****************************************".green);
            console.log("***** Mongo connected successfully *****".green);
            console.log("****************************************".green);
            console.log("\n");
        },
        (err) => {
            console.log("\n");
            console.log("**********************************".red);
            console.log("***** Mongo connection error *****".red);
            console.log("**********************************".red);
            console.log("\n");
        }
    );
} catch (error) {
    console.log("Error connecting Mongo");
    console.log(error);
}
