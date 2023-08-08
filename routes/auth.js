const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("Auth route");
// });

router.post("/login", (req, res) => {
    //Authenticate user
    // const user = {
    //     id: 1,
    //     username: "John Doe",
    //     email: req.body.email,
    // };
    // res.json(user);
    console.log("first")
    
    const username = req.body.username;
    // const password = req.body.password;
    console.log(req.body)
    
    const user = {
        id: 1,
        username: username,
        //other fields go here
    }

    const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});

});

module.exports = router;