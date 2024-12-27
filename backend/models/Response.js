const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: [
    {
      field: { type: mongoose.Schema.Types.ObjectId, required: true },
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

const Response = mongoose.model("Response", responseSchema);

module.exports = Response;
