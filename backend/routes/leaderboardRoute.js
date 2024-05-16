const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderboardController");

router.get("/leaderboard-page", leaderboardController.leaderboardPage);
router.get("/leaderboard-show", leaderboardController.leaderboardShow);

module.exports = router;