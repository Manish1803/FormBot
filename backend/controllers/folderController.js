const Folder = require("./../models/Folder");
const Workspace = require("./../models/Workspace");

const checkWorkspacePermission = async (
  workspaceId,
  userId,
  requiredPermission = "view"
) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.owner.toString() === userId) {
    return true;
  }

  const sharedUser = workspace.sharedWith.find(
    (share) => share.user.toString() === userId
  );
  if (!sharedUser) {
    return false;
  }

  return requiredPermission === "view" || sharedUser.permission === "edit";
};

exports.createFolder = async (req, res) => {
  try {
    const { name, workspaceId } = req.body;

    const hasPermission = await checkWorkspacePermission(
      workspaceId,
      req.user.userId,
      "edit"
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to create folders in this workspace" });
    }

    const folder = new Folder({ name, workspace: workspaceId });
    await folder.save();
    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: { folders: folder._id },
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id).populate("forms");
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      folder.workspace,
      req.user.userId
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this folder" });
    }

    res.json(folder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const hasPermission = await checkWorkspacePermission(
      folder.workspace,
      req.user.userId,
      "edit"
    );
    if (!hasPermission) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this folder" });
    }

    await Workspace.findByIdAndUpdate(folder.workspace, {
      $pull: { folders: folder._id },
    });
    await Folder.findByIdAndDelete(req.params.id);
    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
