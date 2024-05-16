const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");
const path = require("path");

const leaderboardPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "public", "html", "leaderboard.html"));
    } catch (err) {
        console.error("error getting leaderboard page", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const leaderboardShow = async (req, res, next) => {
    try {
        const userLeaderboard = await User.findAll({
            order: [["totalExpenses", "DESC"]]
        });
        res.status(200).json({ userLeaderboard, success: true, message: "leaderboard showed" });
    } catch (err) {
        console.error("error in leaderboard show:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

module.exports = {
    leaderboardPage,
    leaderboardShow
}