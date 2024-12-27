const jwt = require("jsonwebtoken");
const User = require("./../models/User");
const Workspace = require("./../models/Workspace");

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      confirmPassword,
    });

    const defaultWorkspace = await Workspace({
      name: `${username}'s Workspace`,
      owner: user._id,
    });
    await defaultWorkspace.save();

    user.workspaces.push(defaultWorkspace._id);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
      userId: user._id,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    const userId = req.user.userId;

    const existingUser = await User.findOne({
      $and: [{ _id: { $ne: userId } }, { $or: [{ email }, { username }] }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already in use" });
    }

    const updatedUser = await User.findOneAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
