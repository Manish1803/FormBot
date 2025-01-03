const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const workspaceRoutes = require("./routes/workspaceRoutes");
const folderRoutes = require("./routes/folderRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workspaces", workspaceRoutes);
app.use("/folders", folderRoutes);
app.use("/forms", formRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
