const User = require("../models/userModel");

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
    leaderboardShow
}