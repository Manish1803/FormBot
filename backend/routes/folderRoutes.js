const express = require("express");
const folderController = require("./../controllers/folderController");
const authenticateToken = require("./../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, folderController.createFolder);
router.get("/:id", authenticateToken, folderController.getFolder);
router.get("/:id", authenticateToken, folderController.deleteFolder);

module.exports = router;
