// const mysql = require("mysql2");

// // Konfigurasi koneksi ke database
// const db = mysql.createConnection({
//   host: "host.docker.internal",
//   user: "root",        // user default XAMPP
//   password: "",        // password default XAMPP kosong
//   database: "laundry_db"
// });

// // Cek koneksi
// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed: " + err.stack);
//     return;
//   }
//   console.log("Connected to MySQL database.");
// });

// module.exports = db;

const mysql = require("mysql2");

// Gunakan environment variable dari docker-compose
// const db = mysql.createConnection({
//   host: process.env.DB_HOST || "laundry-db",
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "root",
//   database: process.env.DB_NAME || "laundry_db",
//   port: 3306
// });

// // Cek koneksi
// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database connection failed:", err.stack);
//     return;
//   }
//   console.log("✅ Connected to MySQL database.");
// });

// module.exports = db;

const mysql = require("mysql2");

const connectWithRetry = () => {
  const db = mysql.createConnection({
    host: process.env.DB_HOST || "laundry-mysql",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "laundry_db",
    port: 3306
  });

  db.connect((err) => {
    if (err) {
      console.error("❌ Database connection failed, retrying in 5s...", err.code);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.log("✅ Connected to MySQL database.");
    }
  });

  module.exports = db;
};

connectWithRetry();
