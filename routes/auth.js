const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Geçici kullanıcı listesi
let users = [];

// Kayıt
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = users.find((u) => u.email === email);
  if (userExists) return res.status(400).json({ message: "Email zaten kayıtlı" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    role, // usta veya kullanıcı
  };

  users.push(newUser);
  res.status(201).json({ message: "Kayıt başarılı" });
});

// Giriş
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ message: "Kullanıcı bulunamadı" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Şifre yanlış" });

  const token = jwt.sign({ id: user.id, email: user.email }, "gizli_anahtar", {
    expiresIn: "1h",
  });

  res.json({ message: "Giriş başarılı", token });
});

module.exports = router;