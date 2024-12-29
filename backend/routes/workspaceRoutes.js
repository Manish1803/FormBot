const express = require("express");
const workspaceController = require("./../controllers/workspaceController");
const authenticateToken = require("./../middleware/auth");

const router = express.Router();

router.get("/", authenticateToken, workspaceController.getAllWorkspaces);
router.get("/:id", authenticateToken, workspaceController.getWorkspace);
router.post("/", authenticateToken, workspaceController.createWorkspace);
router.post(
  "/:id/share",
  authenticateToken,
  workspaceController.shareWorkspace
);
router.post(
  "/:id/invite",
  authenticateToken,
  workspaceController.generateInviteLink
);
router.post(
  "/invite/:token",
  authenticateToken,
  workspaceController.acceptInvite
);

module.exports = router;
