const express = require("express");
const formController = require("./../controllers/formController");
const authenticateToken = require("./../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, formController.createForm);
router.get("/:id", authenticateToken, formController.getForm);
router.put("/:id", authenticateToken, formController.updateForm);
router.delete("/:id", authenticateToken, formController.deleteForm);
router.get(
  "/:id/response-link",
  authenticateToken,
  formController.getFormResponseLink
);
router.post("/respond/:responseLink/field", formController.submitFieldResponse);
router.post("/respond/:responseLink", formController.submitFormResponse);
router.get(
  "/:id/responses",
  authenticateToken,
  formController.getFormResponses
);
router.get("/respond/:responseLink", formController.getFormStructure);
router.post("/view/:responseLink", formController.incrementFormView);

module.exports = router;
