const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  workspaces: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, 10);
    this.confirmPassword = undefined;
  }

  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
