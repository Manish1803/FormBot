const mongoose = require("mongoose");

const fieldResponseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  field: { type: mongoose.Schema.Types.ObjectId, required: true },
  value: mongoose.Schema.Types.Mixed,
  submittedAt: { type: Date, default: Date.now },
});

const FieldResponse = mongoose.model("FieldResponse", fieldResponseSchema);

module.exports = FieldResponse;
