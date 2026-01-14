const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Koneksi database

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "laundry_db"
// });

const db = mysql.createConnection({
    host: process.env.DB_HOST || "host.docker.internal",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "laundry_db",
    port: 3306
});
db.connect(err => {
    if (err) throw err;
    console.log("Database connected!");
});
app.locals.db = db;

// Setting EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "laundry_secret",
    resave: false,
    saveUninitialized: true
}));
app.use(express.static("public"));

// ======================
// ROUTE LOGIN
// ======================
app.get("/login", (req, res) => {
    res.render("login", { error: null });
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
                res.redirect("/"); // redirect ke transaksi
            } else {
                res.render("login", { error: "Username atau password salah!" });
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
// ROUTE TRANSAKSI
// ======================
const transaksiRouter = require("./routes/transaksi");
app.use("/", transaksiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke! ' + err.message);
});




// Jalankan server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
app.use('/transaksi', require('./routes/transaksi'));
