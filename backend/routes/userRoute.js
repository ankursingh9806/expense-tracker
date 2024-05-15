const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authentication = require("../middleware/authentication");

router.get("/signup-page", userController.signupPage);
router.get("/login-page", userController.loginPage);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/is-premium-user", authentication.authenticate, userController.isPremiumUser);

module.exports = router;