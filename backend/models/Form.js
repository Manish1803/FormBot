const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  type: { type: String, required: true },
  options: [String],
  required: { type: Boolean, default: false },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fields: [fieldSchema],
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Response" }],
  responseLink: { type: String, unique: true },
});

const Form = mongoose.model("Form", formSchema);
