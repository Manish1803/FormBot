const express = require("express");
const authController = require("./../controllers/authController");
const authenticateToken = require("./../middleware/auth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.put("/update", authenticateToken, authController.updateUser);
router.post("/reset-password", authenticateToken, authController.resetPassword);
router.post("/logout", authenticateToken, authController.logout);

module.exports = router;
