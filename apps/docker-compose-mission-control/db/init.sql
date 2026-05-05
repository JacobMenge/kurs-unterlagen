-- Initialisierung der Mission-Control-Datenbank.
-- Wird vom offiziellen postgres-Image automatisch beim allerersten Start
-- ausgeführt, weil die Datei ins Verzeichnis /docker-entrypoint-initdb.d/
-- gemountet wird (siehe compose.yaml).
--
-- WICHTIG: Das Skript läuft NUR, wenn das Datenverzeichnis leer ist –
-- also nur beim ersten Start eines frischen Volumes. Wer Änderungen
-- testen will, muss das Volume neu anlegen.

CREATE TABLE IF NOT EXISTS modules (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  status      VARCHAR(20)  NOT NULL DEFAULT 'offline',
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO modules (name, status) VALUES
  ('Life Support (LS-01)',     'online'),
  ('Power Grid (PG-02)',       'online'),
  ('Comms Array (CA-03)',      'maintenance'),
  ('Research Lab (RL-04)',     'offline'),
  ('Hydroponics (HY-05)',      'critical'),
  ('Docking Bay (DB-06)',      'online');
