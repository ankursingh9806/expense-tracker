const express = require("express");
const router = express.Router();

const expenseController = require("../controllers/expenseController");
const authentication = require("../middleware/authentication");

router.get("/expense-fetch", authentication.authenticate, expenseController.fetchExpense);
router.post("/expense-add", authentication.authenticate, expenseController.addExpense);
router.delete("/expense-delete/:expenseId", authentication.authenticate, expenseController.deleteExpense)
router.put("/expense-update/:expenseId", authentication.authenticate, expenseController.updateExpense)

module.exports = router;