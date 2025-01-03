const mongoose = require("mongoose");
const crypto = require("crypto");

const fieldSchema = new mongoose.Schema({
  type: { type: String, required: true },
  placeholder: { type: String },
  value: { type: String },
  title: { type: String },
  required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [fieldSchema],
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
  responseLink: { type: String, unique: true },
  viewsCount: { type: Number, default: 0 },
  startCount: { type: Number, default: 0 },
  completionsCount: { type: Number, default: 0 },
});

formSchema.pre("save", function (next) {
  if (!this.responseLink) {
    this.responseLink = crypto.randomBytes(16).toString("hex");
  }
  next();
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
