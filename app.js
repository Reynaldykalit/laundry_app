const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

// Import koneksi database dari db.js
const db = require("./db");

const app = express();

// Membuat db bisa diakses di semua halaman (global)
app.locals.db = db;

// ======================
// 2. SETTING VIEW ENGINE (EJS)
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

// ======================
// 3. MIDDLEWARE
// ======================
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "laundry_secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));

// ======================
// 4. ROUTE LOGIN
// ======================
app.get("/login", (req, res) => {
  res.render("login", { error: null, layout: false });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        req.session.user = result[0];
        res.redirect("/");
      } else {
        res.render("login", {
          error: "Username atau password salah!",
          layout: false,
        });
      }
    }
  );
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// ======================
// 5. ROUTE UTAMA / TRANSAKSI
// ======================
function cekLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

const transaksiRouter = require("./routes/transaksi");
app.use("/", cekLogin, transaksiRouter);

// Error handling global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! " + err.message);
});

// ======================
// 6. JALANKAN SERVER
// ======================
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
