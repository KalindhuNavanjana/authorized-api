const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("Auth route");
// });

//to generate keys on node shell
// require("crypto").randomBytes(64).toString('hex')

router.post("/login", async (req, res) => {
    //Authenticate user
    const email = req.body.email;
    const password = req.body.password;

    if (email && password) {
        //find user
        const user = User.findOne({ email });

        // if not registeted
        if (!user) {
            res.status(400).json({ message: "Invalid username or password" });
        }

        //validate password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles: user.roles,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } // Token expiration period
        );

        console.log("User logged in:", user.firstName, user.lastName);

        // Send the token to the client
        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles: user.roles,
            },
        });
    } else {
        res.status(400).json({ message: "Invalid username or password" });
    }
});

router.post("/register", async (req, res) => {
    //Authenticate user
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    if (firstName && lastName && email && password) {
        //find user
        const user = User.findOne({ email });

        // if not registeted
        if (user) {
            res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Save user and return response
        try {
            const savedUser = await newUser.save();
            res.json({
                message: "User registered successfully",
                savedUser: savedUser,
            });
        } catch (err) {
            res.json({ message: err });
        }
    } else {
        res.status(400).json({ message: "Invalid request" });
    }
});
module.exports = router;
