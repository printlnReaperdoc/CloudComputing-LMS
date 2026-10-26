const crypto = require("crypto");
const { db } = require("../config/db");

// Simple, reliable signed token implementation without external JWT dependencies
const SECRET = process.env.SESSION_SECRET || "cloudcomputinglms_secure_secret_key_2026";

function generateToken(user) {
  const payload = {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
    first_name: user.first_name,
    surname: user.surname,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(str).digest("base64url");
  return `${str}.${signature}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [str, signature] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(str).digest("base64url");
  if (signature !== expected) return null;

  try {
    const payload = JSON.parse(Buffer.from(str, "base64url").toString("utf8"));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Middleware: Authenticate user from Authorization header or cookie
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);
  if (!payload) {
    req.user = null;
    return next();
  }

  const user = await db.findUserById(payload.user_id);
  req.user = user || null;
  next();
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please log in."
    });
  }
  next();
}

function requireFaculty(req, res, next) {
  if (!req.user || req.user.role !== "faculty") {
    return res.status(403).json({
      success: false,
      message: "Access restricted. Faculty/Admin privileges required."
    });
  }
  next();
}

module.exports = {
  generateToken,
  verifyToken,
  authenticate,
  requireAuth,
  requireFaculty
};

