const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportController");
const authentication = require("../middleware/authentication");

router.post("/daily-report-view", authentication.authenticate, reportController.dailyReportView);
router.post("/daily-report-download", authentication.authenticate, reportController.dailyReportDownload);
router.post("/monthly-report-view", authentication.authenticate, reportController.monthlyReportView);
router.post("/monthly-report-download", authentication.authenticate, reportController.monthlyReportDownload);

module.exports = router;