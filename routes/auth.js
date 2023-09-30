const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("Auth route");
// });

//to generate keys on node shell
// require("crypto").randomBytes(64).toString('hex')

router.post("/login", (req, res) => {
    //Authenticate user
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        //Authenticate user
        User.findOne({ username: username, password: password })
            .then((user) => {
                if (user) {
                    userObj = {
                        id: user._id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        nic: user.nic,
                    };
                    const accessToken = jwt.sign(
                        userObj,
                        process.env.ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "15m",
                        }
                    );
                    res.json({ accessToken: accessToken, user: userObj });
                } else {
                    res.status(400).json({
                        message: "Invalid username or password",
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                res.status(400).json({
                    message: "Invalid username or password",
                });
            });
    } else {
        res.status(400).json({ message: "Invalid username or password" });
    }

    console.log(req.body);

    const user = {
        id: 1,
        username: username,
        //other fields go here
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    res.json({ accessToken: accessToken });
});

router.post("/register", async (req, res) => {
    const {
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
        nic,
    } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        //hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email: email,
            password: hashedPassword, // You should hash and salt the password before saving
            phoneNumber: transformPhoneNumber(phoneNumber),
            nic
        });

        // Save the user to the database
        const saveduser = await newUser.save();

        const printObj = {
            ...saveduser._doc,
            password: "********",
        };

        console.log("User registered successfully");

        //Send SMS
        // const message = `Hello ${username},\n\nThank you for completing the registration process.`;
        // const phoneNumberFormatted = transformPhoneNumber(phoneNumber);
        // await sendSMS([phoneNumberFormatted], message);

        //Send Email
        // const emailSubject =
        //     "Thank You for Registering!";
        // // Render the EJS template with data
        // const emailHTML = await ejs.renderFile("./templates/registration.ejs", {
        //     name: username,
        // });
        // await sendMail(email, emailSubject, emailHTML);

        // console.log(printObj);
        res.status(201).json({
            message: "User registered successfully",
            user: printObj,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = router;
