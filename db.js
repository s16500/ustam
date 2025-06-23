const knex = require("knex");

const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./data.sqlite3", // veritabanı dosyası
  },
  useNullAsDefault: true, // SQLite için gerekli
});

module.exports = db;