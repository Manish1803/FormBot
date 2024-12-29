const Workspace = require("./../models/Workspace");
const User = require("./../models/User");
const crypto = require("crypto");

exports.getAllWorkspaces = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "workspaces",
        populate: {
          path: "folders",
          populate: { path: "forms" },
        },
      })
      .populate({
        path: "sharedWorkspaces.workspace",
        populate: {
          path: "folders",
          populate: { path: "forms" },
        },
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ownedWorkspaces = user.workspaces.map((workspace) => ({
      ...workspace.toObject(),
      role: "owner",
    }));

    const sharedWorkspaces = user.sharedWorkspaces.map((sw) => ({
      ...sw.workspace.toObject(),
      role: "shared",
      permission: sw.permission,
    }));

    res.json({
      ownedWorkspaces,
      sharedWorkspaces,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const workspace = await Workspace.findById(id)
      .populate({
        path: "folders",
        populate: { path: "forms" },
      })
      .populate("forms");

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    let userRole = "none";
    let permission = "none";

    if (workspace.owner.toString() === userId) {
      userRole = "owner";
      permission = "edit";
    } else {
      const sharedUser = workspace.sharedWith.find(
        (share) => share.user.toString() === userId
      );
      if (sharedUser) {
        userRole = "shared";
        permission = sharedUser.permission;
      }
    }

    if (userRole === "none") {
      return res
        .status(403)
        .json({ error: "Not authorized to access this workspace" });
    }

    res.json({
      ...workspace.toObject(),
      userRole,
      permission,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;
    const workspace = new Workspace({ name, owner: req.user.userId });
    await workspace.save();
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { workspaces: workspace._id },
    });
    res.status(201).json(workspace);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.shareWorkspace = async (req, res) => {
  try {
    const { email, permission } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await workspace.addSharedUser(user._id, permission);
    res.status(200).json({ message: "Workspace shared successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.generateInviteLink = async (req, res) => {
  try {
    const { permission } = req.body;
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({ error: "Workspace not found" });
    }

    if (workspace.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const inviteLink = `${process.env.BASE_URL}/invite/${token}`;

    workspace.inviteLinks.push({ token, permission, expiresAt });
    await workspace.save();

    res.status(200).json({ inviteLink, expiresAt });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const workspace = await Workspace.findOne({ "inviteLinks.token": token });

    if (!workspace) {
      return res.status(404).json({ error: "Invalid invite link" });
    }

    const invite = workspace.inviteLinks.find((i) => i.token === token);
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ error: "Invite link has expired" });
    }

    await workspace.addSharedUser(req.user.userId, invite.permission);

    workspace.inviteLinks = workspace.inviteLinks.filter(
      (i) => i.token !== token
    );
    await workspace.save();

    res.status(200).json({ message: "Joined workspace successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
