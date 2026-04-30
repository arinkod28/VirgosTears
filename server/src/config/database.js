const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.dirname(process.env.DB_PATH || './data/cmmc.db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(process.env.DB_PATH || './data/cmmc.db');

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS scan_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    control_id TEXT NOT NULL,
    raw_json TEXT NOT NULL,
    evidence_hash TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pass', 'fail', 'warning', 'error')),
    findings TEXT,
    scanned_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_snapshots_control ON scan_snapshots(control_id);
  CREATE INDEX IF NOT EXISTS idx_snapshots_date ON scan_snapshots(scanned_at);
  CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
`);

module.exports = db;
