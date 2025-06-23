const db = require("./db");

async function migrate() {
  const exists = await db.schema.hasTable("users");
  if (!exists) {
    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name");
      table.string("email").unique();
      table.string("password");
      table.string("role");
    });
    console.log("users tablosu oluşturuldu!");
  } else {
    console.log("users tablosu zaten var.");
  }
  process.exit(0);
}

migrate();