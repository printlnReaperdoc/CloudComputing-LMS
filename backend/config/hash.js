// Password hashing utility using Node.js built-in crypto module
const bcrypt = require("bcrypt");
const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function verifyPassword(password, storedHash) {
  if (!storedHash) return false;
  if (/^\$2[aby]\$\d{2}\$/.test(storedHash)) {
    return bcrypt.compare(password, storedHash);
  }
  // Handle fallback if plaintext was somehow entered in dev
  if (!storedHash.includes(":")) {
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(":");
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return testHash === originalHash;
}

module.exports = {
  hashPassword,
  verifyPassword
};
