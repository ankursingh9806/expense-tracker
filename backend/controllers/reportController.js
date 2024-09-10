const Expense = require("../models/expenseModel");
const s3services = require("../services/s3services");
const { Op } = require('sequelize');

const dailyReportView = async (req, res, next) => {
    try {
        const { date } = req.body;
        // const expenses = await Expense.findAll({
        //     where: { date: date, userId: req.user.id }
        // });
        const expenses = await Expense.find({
            date: date, userId: req.user._id
        });
        res.status(200).json({ expenses, message: "daily report sent" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const dailyReportDownload = async (req, res, next) => {
    try {
        const { date } = req.body;
        // const expenses = await Expense.findAll({
        //     where: { date: date, userId: req.user.id }
        // });
        const expenses = await Expense.find({
            date: date, userId: req.user._id
        });
        const fileContent = JSON.stringify(expenses);
        const fileName = `expense-${date}.json`;
        const fileUrl = await s3services.uploadToS3(fileContent, fileName);
        res.status(200).json({ fileUrl: fileUrl.Location, message: "daily report downloaded" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const monthlyReportView = async (req, res, next) => {
    try {
        const { month } = req.body;
        // const expenses = await Expense.findAll({
        //     where: { date: { [Op.like]: `${month}%`, }, userId: req.user.id }
        // });
        const expenses = await Expense.find({
            date: {
                $regex: new RegExp(`^${month}`)
            },
            userId: req.user._id
        });
        res.status(200).json({ expenses, message: "monthly report sent" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const monthlyReportDownload = async (req, res, next) => {
    try {
        const { month } = req.body;
        // const expenses = await Expense.findAll({
        //     where: { date: { [Op.like]: `${month}%`, }, userId: req.user.id }
        // });
        const expenses = await Expense.find({
            date: {
                $regex: new RegExp(`^${month}`)
            },
            userId: req.user._id
        });
        const fileContent = JSON.stringify(expenses);
        const fileName = `expense-${month}.json`;
        const fileUrl = await s3services.uploadToS3(fileContent, fileName);
        res.status(200).json({ fileUrl: fileUrl.Location, message: "monthly report downloaded" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    dailyReportView,
    dailyReportDownload,
    monthlyReportView,
    monthlyReportDownload,
};