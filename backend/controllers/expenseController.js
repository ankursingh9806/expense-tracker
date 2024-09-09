const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");

const fetchExpense = async (req, res, next) => {
    try {
        const { page = 1 } = req.query;
        const limit = 5;
        const offset = (page - 1) * limit;
        const expenses = await Expense.findAndCountAll({
            where: { userId: req.user.id },
            limit: limit,
            offset: offset
        });
        const totalPages = Math.ceil(expenses.count / limit);
        res.status(200).json({ expenses: expenses.rows, totalPages, message: "expenses fetched" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { date, amount, description, category } = req.body;
        const newExpense = {
            date: date,
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id,
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
        await expense.destroy();
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
            { where: { id: expenseId, userId: req.user.id }, transaction: t }
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
    fetchExpense,
    addExpense,
    deleteExpense,
    updateExpense
}