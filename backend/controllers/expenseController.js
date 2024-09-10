const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const mongoose = require("../utils/database");

const fetchExpense = async (req, res, next) => {
    try {
        const { page = 1 } = req.query;
        const limit = 5;
        const offset = (page - 1) * limit;
        // const expenses = await Expense.findAndCountAll({
        //     where: { userId: req.user.id },
        //     limit: limit,
        //     offset: offset
        // });
        const expenses = await Expense.find({ userId: req.user._id })
            .limit(limit)
            .skip(offset);
        const totalPages = Math.ceil(expenses.count / limit);
        res.status(200).json({ expenses, totalPages, message: "expenses fetched" });
    } catch (err) {
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
};

const addExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { date, amount, description, category } = req.body;
        const newExpense = {
            date: date,
            amount: amount,
            description: description,
            category: category,
            // userId: req.user.id,
            userId: req.user._id,
        };
        // await Expense.create(newExpense, { transaction: t });
        await Expense.create([newExpense], { session });
        // update total expense
        const totalExpenses = Number(req.user.totalExpenses) + Number(amount);
        // await User.update(
        //     { totalExpenses: totalExpenses },
        //     { where: { id: req.user.id }, transaction: t }
        // );
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: totalExpenses },
            { session }
        );
        // await t.commit();
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ newExpense, message: "expense added" });
    } catch (err) {
        // await t.rollback();
        await session.abortTransaction();
        session.endSession();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const deleteExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { expenseId } = req.params;
        // const expense = await Expense.findByPk(expenseId);
        const expense = await Expense.findById(expenseId);
        // await expense.destroy();
        await Expense.deleteOne({ userId: req.user._id, _id: expenseId })
        // update total expense
        const totalExpenses = Number(req.user.totalExpenses) - Number(expense.amount);
        // await User.update(
        //     { totalExpenses: totalExpenses },
        //     { where: { id: req.user.id }, transaction: t }
        // );
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: totalExpenses },
            { session }
        );
        // await t.commit();
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "expense deleted" });
    } catch (err) {
        // await t.rollback();
        await session.abortTransaction();
        session.endSession();
        console.error("error:", err);
        res.status(500).json({ error: "internal server error" });
    }
}

const updateExpense = async (req, res, next) => {
    // const t = await sequelize.transaction();
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { expenseId } = req.params;
        const { date, amount, description, category } = req.body;
        // const expense = await Expense.findByPk(expenseId);
        const expense = await Expense.findById(expenseId);
        const updatedExpense = {
            date: date,
            amount: amount,
            description: description,
            category: category
        };
        const totalExpenses = Number(req.user.totalExpenses) - Number(expense.amount) + Number(amount);
        // await Expense.update(updatedExpense,
        //     { where: { id: expenseId, userId: req.user.id }, transaction: t }
        // );
        await Expense.updateOne(
            { _id: expenseId, userId: req.user._id },
            updatedExpense,
            { session }
        );
        // update total expense
        // await User.update(
        //     { totalExpenses: totalExpenses },
        //     { where: { id: req.user.id }, transaction: t }
        // );
        await User.updateOne(
            { _id: req.user._id },
            { totalExpenses: totalExpenses },
            { session }
        );
        // await t.commit();
        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "expense updated" });
    } catch (err) {
        // await t.rollback();
        await session.abortTransaction();
        session.endSession();
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