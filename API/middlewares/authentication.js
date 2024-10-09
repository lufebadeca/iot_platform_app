const jwt = require('jsonwebtoken');

//checks token obtained during login
let checkAuth = (req, res, next) => {
    let token = req.get('token');

    //checks if token matches, needs to compare decoded token data
    jwt.verify(token, "securePasswordHere", (err, decoded)=> {
        if (err){
            return res.status(401).json({
                status: "error",
                error: err
            });
        }
        //req is initially empty, it passes Userdata to the token
        req.userData = decoded.userData;

        //next passes the data to the arrow funtion in [get]/device
        next();
    });
};

module.exports = { checkAuth };
