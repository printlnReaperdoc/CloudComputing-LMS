require("dotenv").config();

const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const password = "0829";

async function resetPasswords() {
  const passwordHash = await bcrypt.hash(password, 10);
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "cloudcomputinglms"
  });

  try {
    const [result] = await connection.execute(
      "UPDATE users SET password_hash = ?",
      [passwordHash]
    );
    console.log(`Updated ${result.affectedRows} user password(s).`);
  } finally {
    await connection.end();
  }
}

resetPasswords().catch((error) => {
  console.error("Password reset failed:", error.message);
  process.exitCode = 1;
});
