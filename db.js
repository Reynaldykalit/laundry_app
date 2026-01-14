const mysql = require("mysql2");

// Debug: Lihat environment variables
console.log("=== DATABASE CONFIG ===");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("======================");

// Konfigurasi untuk Docker Container
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "laundry_db",
  port: process.env.DB_PORT || 3306,
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error("Gagal konek ke database:", err);
    return;
  }
  console.log("✅ Berhasil terhubung ke database MySQL");
});

module.exports = db;
