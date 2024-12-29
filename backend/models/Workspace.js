const mongoose = require("mongoose");
const User = require("./User");

const sharedUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permission: { type: String, enum: ["edit", "view"], default: "view" },
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sharedWith: [sharedUserSchema],
  folders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  forms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Form" }],
  inviteLinks: [
    {
      token: String,
      permission: { type: String, enum: ["edit", "view"] },
    },
  ],
});

workspaceSchema.methods.addSharedUser = async function (userId, permission) {
  const existingShare = this.sharedWith.find(
    (share) => share.user.toString() === userId.toString()
  );
  if (existingShare) {
    existingShare.permission = permission;
  } else {
    this.sharedWith.push({ user: userId, permission });
  }
  await this.save();

  await User.findByIdAndUpdate(userId, {
    $addToSet: { sharedWorkspaces: { workspace: this._id, permission } },
  });
};

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
