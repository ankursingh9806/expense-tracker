const Expense = require("../models/expenseModel");
const path = require("path");
const s3services = require("../services/s3services");
const { Op } = require('sequelize');

const reportPage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "report.html"));
    } catch (err) {
        console.error("error getting report page", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

// daily report
const dailyReportView = async (req, res, next) => {
    try {
        const { date } = req.body;
        const expenses = await Expense.findAll({
            where: { date: date, UserId: req.user.id }
        });
        res.status(200).json({ expenses, success: true, message: "daily report sent" });
    } catch (err) {
        console.error("error getting daily report:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const dailyReportDownload = async (req, res, next) => {
    try {
        const { date } = req.body;
        const expenses = await Expense.findAll({
            where: { date: date, UserId: req.user.id }
        });
        const expensesToString = JSON.stringify(expenses);
        const formattedDate = new Date().toISOString().split('T')[0];
        const fileName = `expense-${formattedDate}.csv`;
        const fileUrl = await s3services.uploadToS3(expensesToString, fileName);
        res.status(200).json({ fileUrl: fileUrl.Location, success: true, message: "daily report downloaded" });
    } catch (err) {
        console.error("error downloading daily report:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

// monthly report
const monthlyReportView = async (req, res, next) => {
    try {
        const { month } = req.body;
        const expenses = await Expense.findAll({
            where: {
                date: {
                    [Op.like]: `${month}%`,
                },
                UserId: req.user.id
            }
        });
        res.status(200).json({ expenses, success: true, message: "monthly report sent" });
    } catch (err) {
        console.error("error getting monthly report:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const monthlyReportDownload = async (req, res, next) => {
    try {
        const { month } = req.body;
        const expenses = await Expense.findAll({
            where: {
                date: {
                    [Op.like]: `${month}%`,
                },
                UserId: req.user.id
            }
        });
        const expensesToString = JSON.stringify(expenses);
        const formattedDate = new Date().toISOString().split('T')[0];
        const fileName = `expense-${formattedDate}.csv`;
        const fileUrl = await s3services.uploadToS3(expensesToString, fileName);
        res.status(200).json({ fileUrl: fileUrl.Location, success: true, message: "monthly report downloaded" });
    } catch (err) {
        console.error("error downloading monthly report:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

module.exports = {
    reportPage,
    dailyReportView,
    dailyReportDownload,
    monthlyReportView,
    monthlyReportDownload,
};