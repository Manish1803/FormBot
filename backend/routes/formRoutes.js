const express = require("express");
const formController = require("./../controllers/formController");
const authenticateToken = require("./../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, formController.createForm);
router.get("/:id", authenticateToken, formController.getForm);
router.get("/:id", authenticateToken, formController.updateForm);
router.get("/:id", authenticateToken, formController.deleteForm);
router.get(
  "/:id/response-link",
  authenticateToken,
  formController.getFormResponseLink
);
router.post(
  "/respond/:responseLink/field",
  authenticateToken,
  formController.submitFieldResponse
);
router.post(
  "/respond/:responseLink",
  authenticateToken,
  formController.submitFormResponse
);
router.get(
  "/:id/responses",
  authenticateToken,
  formController.getFormResponses
);

module.exports = router;
