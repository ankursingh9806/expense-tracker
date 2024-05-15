const User = require("../models/userModel");
const path = require("path");

const signupPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "signup.html"));
    } catch (err) {
        console.error("error getting signup page", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const loginPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "login.html"));
    } catch (err) {
        console.error("error getting login page", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "user already exists" });
        }
        const newUser = await User.create({
            name: name,
            email: email,
            password: password
        });
        res.status(201).json({ success: true, message: "user signed up" });
    } catch (err) {
        console.error("error in signup:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        if (existingUser.password !== password) {
            return res.status(401).json({ success: false, message: "incorrect password" });
        }
        res.status(200).json({ success: true, message: "user logged in" });
    } catch (err) {
        console.error("error in login:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
}

module.exports = {
    signupPage,
    loginPage,
    signup,
    login,
}