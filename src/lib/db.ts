import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    start_weight REAL,
    target_weight REAL,
    token TEXT NOT NULL UNIQUE,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL,
    last_reminded_at TEXT
  );

  CREATE TABLE IF NOT EXISTS checkins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    weight REAL NOT NULL,
    water REAL NOT NULL,
    protein INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE INDEX IF NOT EXISTS idx_checkins_client_date ON checkins(client_id, date);
`);

const clientColumns = db
  .prepare("PRAGMA table_info(clients)")
  .all()
  .map((col) => col.name);

if (!clientColumns.includes("phone")) {
  db.exec("ALTER TABLE clients ADD COLUMN phone TEXT");
}
if (!clientColumns.includes("start_weight")) {
  db.exec("ALTER TABLE clients ADD COLUMN start_weight REAL");
}
if (!clientColumns.includes("target_weight")) {
  db.exec("ALTER TABLE clients ADD COLUMN target_weight REAL");
}

export default db;
