const Expense = require("../models/expenseModel");
const path = require("path");

const expensePage = async (req, res, next) => {
    try {
        res.sendFile(path.join(__dirname, "..", "..", "frontend", "html", "expense.html"));
    } catch (err) {
        console.error("error getting expense page", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

const fetchExpense = async (req, res, next) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json({ expenses, success: true, message: "expenses fetched" });
    } catch (err) {
        console.error("error fetching expenses:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
}

const addExpense = async (req, res, next) => {
    try {
        const { amount, description, category } = req.body;
        const newExpense = await Expense.create({
            amount: amount,
            description: description,
            category: category,
        });
        res.status(201).json({ newExpense, success: true, message: "expense added" });
    } catch (err) {
        console.error("error adding expense:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
}

const deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        const expense = await Expense.findByPk(expenseId);
        await expense.destroy();
        res.status(200).json({ success: true, message: "expense deleted" });
    } catch (err) {
        console.error("error deleting expense:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
}

const updateExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.expenseId;
        const { amount, description, category } = req.body;
        const updatedExpense = {
            amount: amount,
            description: description,
            category: category
        };
        await Expense.update(updatedExpense, { where: { id: expenseId } });
        res.status(200).json({ success: true, message: "expense updated" });
    } catch (err) {
        console.error("error updating expense:", err);
        res.status(500).json({ success: false, error: "internal server error" });
    }
};

module.exports = {
    expensePage,
    fetchExpense,
    addExpense,
    deleteExpense,
    updateExpense
}