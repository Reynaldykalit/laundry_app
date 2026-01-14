const express = require("express");
const router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.session.user) next();
    else res.redirect("/login");
}

// Halaman tampil semua transaksi
router.get("/", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const sql = `
        SELECT t.*, j.nama AS jenis_laundry_nama
        FROM transaksi t 
        LEFT JOIN jenis_laundry j ON t.jenis_laundry = j.nama
        ORDER BY t.id ASC
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.render("transaksi", { transaksi: result, user: req.session.user });
    });
});

// Halaman form tambah transaksi (GET)
router.get("/tambah", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    db.query("SELECT * FROM jenis_laundry", (err, jenisResult) => {
        if (err) return res.status(500).send("Database error");
        db.query("SELECT * FROM transaksi ORDER BY id DESC", (err2, transaksiResult) => {
            if (err2) return res.status(500).send("Database error");
            res.render("tambah", { jenis: jenisResult, transaksi: transaksiResult });
        });
    });
});


// Proses tambah transaksi (POST)
router.post("/tambah", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const { nama, alamat, no_hp, jenis_laundry, tanggal, biaya } = req.body;

    // Parsing tanggal ke objek Date
    const tgl = new Date(tanggal);
    const hari = tgl.getDate();
    const bulan = tgl.getMonth() + 1; // bulan mulai dari 0 di JS

    // Cek apakah tanggal kembar (hari == bulan)
    const diskon = (hari === bulan) ? 25 : 0;

    // Hitung total setelah diskon
    const diskonNominal = (biaya * diskon) / 100;
    const total = biaya - diskonNominal;

    const sql = `
        INSERT INTO transaksi 
        (tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).send("Database error saat menambah transaksi");
        res.redirect("/transaksi");
    });
});


router.post("/add", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const { nama, alamat, no_hp, jenis_laundry, tanggal, diskon, biaya, total } = req.body;

    const sql = `
        INSERT INTO transaksi 
        (tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).send("Database error saat menambah transaksi");
        res.redirect("/transaksi");
    });
});

// Halaman edit transaksi (GET)
router.get("/edit/:id", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;

    db.query("SELECT * FROM transaksi WHERE id = ?", [id], (err, transaksiResult) => {
        if (err) return res.status(500).send("Database error");
        db.query("SELECT * FROM jenis_laundry", (err2, jenisResult) => {
            if (err2) return res.status(500).send("Database error");
            res.render("edit", {
                transaksi: transaksiResult[0],
                jenis: jenisResult
            });
        });
    });
});

// Proses update transaksi (POST)
router.post("/edit/:id", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;
    const { tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total } = req.body;

    const sql = `
        UPDATE transaksi SET 
        tanggal = ?, nama = ?, alamat = ?, no_hp = ?, jenis_laundry = ?, biaya = ?, diskon = ?, total = ?
        WHERE id = ?`;
    const values = [tanggal, nama, alamat, no_hp, jenis_laundry, biaya, diskon, total, id];

    db.query(sql, values, (err) => {
        if (err) return res.status(500).send("Database error saat update transaksi");
        res.redirect("/transaksi");
    });
});

// Fungsi hapus transaksi (GET)
router.get("/delete/:id", isLoggedIn, (req, res) => {
    const db = req.app.locals.db;
    const id = req.params.id;

    db.query("DELETE FROM transaksi WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send("Database error saat hapus transaksi");
        res.redirect("/transaksi");
    });
});

module.exports = router;

