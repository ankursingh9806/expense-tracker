const express = require("express");
const router = express.Router();

const purchaseController = require("../controllers/purchaseController");
const authentication = require("../middleware/authentication");

router.get("/purchase-premium", authentication.authenticate, purchaseController.purchasePremium);
router.post("/update-transaction-status", authentication.authenticate, purchaseController.updateTransactionStatus);

module.exports = router;