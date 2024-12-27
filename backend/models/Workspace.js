const mongoose = require("mongoose");
const User = require("./User");

const collaboratorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  permission: { type: String, enum: ["edit", "view"], default: "view" },
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collaborators: [collaboratorSchema],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
  inviteLinks: [
    {
      token: String,
      permission: { type: String, enum: ["edit", "view"] },
    },
  ],
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
