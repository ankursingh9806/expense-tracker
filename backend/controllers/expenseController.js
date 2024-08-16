const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const path = require("path");
const sequelize = require("../utils/database");

const expensePage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "expense.html"));
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const fetchExpense = async (req, res, next) => {
    try {
        const { page } = req.query;
        const limit = 5;
        const offset = (page - 1) * limit;
        const totalExpenses = await Expense.count({
            where: { UserId: req.user.id }
        });
        const expenses = await Expense.findAndCountAll({
            where: { UserId: req.user.id },
            limit: limit,
            offset: offset
        });
        const totalPages = Math.ceil(totalExpenses / limit);
        res.status(200).json({ expenses, totalPages, message: "expenses fetched" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { date, amount, description, category } = req.body;
        const newExpense = {
            date: date,
            amount: amount,
            description: description,
            category: category,
            UserId: req.user.id,
        };
        await Expense.create(newExpense, { transaction: t });
        // update total expense
        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
        await User.update(
            { totalExpenses: totalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );
        await t.commit();
        res.status(201).json({ newExpense, message: "expense added" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { expenseId } = req.params;
        const expense = await Expense.findByPk(expenseId);
        await expense.destroy({
            where: { UserId: req.user.id }, transaction: t
        }
        );
        // update total expense
        const totalExpenses = Number(req.user.totalExpenses) - Number(expense.amount);
        await User.update(
            { totalExpenses: totalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );
        await t.commit();
        res.status(200).json({ message: "expense deleted" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const updateExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { expenseId } = req.params;
        const { date, amount, description, category } = req.body;
        const expense = await Expense.findByPk(expenseId);
        const updatedExpense = {
            date: date,
            amount: amount,
            description: description,
            category: category
        };
        const totalExpenses = Number(req.user.totalExpenses) - Number(expense.amount) + Number(amount);
        await Expense.update(updatedExpense,
            { where: { id: expenseId, UserId: req.user.id }, transaction: t }
        );
        // update total expense
        await User.update(
            { totalExpenses: totalExpenses },
            { where: { id: req.user.id }, transaction: t }
        );
        await t.commit();
        res.status(200).json({ message: "expense updated" });
    } catch (err) {
        await t.rollback();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

module.exports = {
    expensePage,
    fetchExpense,
    addExpense,
    deleteExpense,
    updateExpense
}