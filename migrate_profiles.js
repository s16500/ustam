const db = require("./db");

async function migrateProfiles() {
  const exists = await db.schema.hasTable("profiles");
  if (!exists) {
    await db.schema.createTable("profiles", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("service");      // Ör: Boya Ustası, Çamaşır Makinesi Tamiri
      table.string("description");  // Açıklama
      table.string("city");         // Şehir
      table.timestamps(true, true); // created_at ve updated_at
    });
    console.log("profiles tablosu oluşturuldu!");
  } else {
    console.log("profiles tablosu zaten var.");
  }
  process.exit(0);
}

migrateProfiles();