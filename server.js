const express = require("express");
require("dotenv").config();
const app = express();
const jwt = require("jsonwebtoken");
const authRouter = require("./routes/auth");
const port = 5000;

require("./db/mongoose");

app.use(express.json());
app.use(logger);
//Public Routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send("Server is up and running");
});

//Private Routes 
app.get("/test", authenticateToken, (req, res) => {
    const user =req.user; 
    res.json({
        message: "This is a private route",
        user: user,
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Server running on url: ${process.env.BASE_URL}:${port}/`);
});

//Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function logger(req, res, next) {
    console.log("Request URL:", req.url);
    next();
}
