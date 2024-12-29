const jwt = require("jsonwebtoken");
const TokenBlacklist = require("./../models/TokenBlacklist");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  try {
    // Check if the token is blacklisted
    const blacklistedToken = await TokenBlacklist.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({ error: "Token is no longer valid" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.sendStatus(403);
  }
};

module.exports = authenticateToken;
