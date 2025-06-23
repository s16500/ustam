const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware: Token kontrolü (kimlik doğrulama)
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token yok" });

  jwt.verify(token, "gizli_anahtar", (err, user) => {
    if (err) return res.status(403).json({ message: "Token geçersiz" });
    req.user = user;
    next();
  });
}

// Profil oluşturma (sadece giriş yapmış kullanıcılar)
router.post("/", authenticateToken, async (req, res) => {
  const { service, description, city } = req.body;
  const user_id = req.user.id;

  try {
    const [id] = await db("profiles").insert({
      user_id,
      service,
      description,
      city,
    });
    res.status(201).json({ message: "Profil oluşturuldu", id });
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

// Profil listeleme (filtreli)
router.get("/", async (req, res) => {
  const { service, city } = req.query;

  try {
    let query = db("profiles").select("profiles.*", "users.name", "users.email")
      .join("users", "profiles.user_id", "users.id");

    if (service) {
      query = query.where("service", "like", `%${service}%`);
    }
    if (city) {
      query = query.where("city", "like", `%${city}%`);
    }

    const profiles = await query;
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
});

module.exports = router;