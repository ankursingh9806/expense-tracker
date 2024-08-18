const User = require("../models/userModel");
const path = require("path");

const leaderboardPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "public", "html", "leaderboard.html"));
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const leaderboardShow = async (req, res, next) => {
    try {
        // const userLeaderboard = await User.findAll({
        //     order: [["totalExpenses", "DESC"]]
        // });
        const userLeaderboard = await User.find().sort({ totalExpenses: -1 });
        res.status(200).json({ userLeaderboard, message: "leaderboard showed" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    leaderboardPage,
    leaderboardShow
}