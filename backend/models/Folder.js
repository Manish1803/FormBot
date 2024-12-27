const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
});

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;
