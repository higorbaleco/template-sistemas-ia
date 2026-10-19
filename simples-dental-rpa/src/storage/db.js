import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';

const DB_PATH = path.resolve('data/simples-dental.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_name TEXT,
    starts_at TEXT,
    status TEXT,
    raw_json TEXT,
    captured_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    name TEXT,
    raw_json TEXT,
    captured_at TEXT DEFAULT (datetime('now'))
  );

  -- Toda resposta de rede capturada (via scripts/capture-network.js) cai aqui
  -- crua, pra não perder nada enquanto a gente ainda não sabe o schema certo.
  CREATE TABLE IF NOT EXISTS raw_captures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    method TEXT,
    url TEXT,
    status INTEGER,
    request_body TEXT,
    response_body TEXT,
    captured_at TEXT DEFAULT (datetime('now'))
  );
`);

export function upsertAppointment(a) {
  db.prepare(`
    INSERT INTO appointments (id, patient_name, starts_at, status, raw_json)
    VALUES (@id, @patient_name, @starts_at, @status, @raw_json)
    ON CONFLICT(id) DO UPDATE SET
      patient_name = excluded.patient_name,
      starts_at = excluded.starts_at,
      status = excluded.status,
      raw_json = excluded.raw_json,
      captured_at = datetime('now')
  `).run(a);
}

export function upsertPatient(p) {
  db.prepare(`
    INSERT INTO patients (id, name, raw_json)
    VALUES (@id, @name, @raw_json)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      raw_json = excluded.raw_json,
      captured_at = datetime('now')
  `).run(p);
}

export function saveRawCapture(entry) {
  db.prepare(`
    INSERT INTO raw_captures (method, url, status, request_body, response_body)
    VALUES (@method, @url, @status, @request_body, @response_body)
  `).run(entry);
}
