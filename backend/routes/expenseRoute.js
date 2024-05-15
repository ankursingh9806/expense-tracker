const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");

router.get("/expense-page", expenseController.expensePage);
router.get("/expense-fetch", expenseController.fetchExpense);
router.post("/expense-add", expenseController.addExpense);
router.delete("/expense-delete/:expenseId", expenseController.deleteExpense)
router.put("/expense-update/:expenseId", expenseController.updateExpense)

module.exports = router;