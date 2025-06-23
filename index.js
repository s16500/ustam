const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ustam API çalışıyor!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API ${PORT} portunda çalışıyor.`);
});
const authRoutes = require("./routes/auth");
app.use("/api", authRoutes);
const profilesRoutes = require("./routes/profiles");
app.use("/api/profiles", profilesRoutes);