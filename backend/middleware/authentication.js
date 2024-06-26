const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "token is missing" });
        }
        const decoded = jwt.verify(token, process.env.TOKEN);
        const foundUser = await User.findByPk(decoded.userId);
        if (!foundUser) {
            return res.status(401).json({ success: false, message: "user not found" });
        }
        req.user = foundUser;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ success: false, error: "failed to authenticate" });
    }
}

module.exports = {
    authenticate
}