const { db } = require("../config/db");
const { hashPassword, verifyPassword } = require("../config/hash");
const { generateToken } = require("../middleware/auth");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    const user = await db.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({
      success: true,
      message: `Welcome back, ${safeUser.first_name}!`,
      token,
      user: safeUser
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error during login." });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, first_name, surname, role } = req.body;

    if (!username || !password || !first_name || !surname) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: username, password, first name, and surname."
      });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, message: "Username must be at least 3 characters." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const existing = await db.findUserByUsername(username);
    if (existing) {
      return res.status(409).json({ success: false, message: "Username already exists. Please choose another." });
    }

    const userRole = role === "faculty" ? "faculty" : "student";
    const password_hash = hashPassword(password);

    const newUser = await db.createUser({
      username,
      password_hash,
      first_name,
      surname,
      role: userRole
    });

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: `Registration successful! Account created as ${userRole.toUpperCase()}.`,
      token,
      user: newUser
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message || "Registration failed." });
  }
};

exports.me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  res.json({
    success: true,
    user: req.user
  });
};
