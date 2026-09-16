-- Initialisierung der Mission-Control-Datenbank.
-- Wird vom offiziellen postgres-Image automatisch beim allerersten Start
-- ausgeführt, weil die Datei ins Verzeichnis /docker-entrypoint-initdb.d/
-- gemountet wird (siehe compose.yaml).
--
-- WICHTIG: Das Skript läuft NUR, wenn das Datenverzeichnis leer ist,
-- also nur beim ersten Start eines frischen Volumes. Wer Änderungen
-- testen will, muss das Volume neu anlegen.

CREATE TABLE IF NOT EXISTS logbuch (
  id        SERIAL       PRIMARY KEY,
  zeit      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  modul     VARCHAR(100) NOT NULL,
  ereignis  VARCHAR(20)  NOT NULL
);

INSERT INTO logbuch (modul, ereignis) VALUES
  ('Bodenkontrolle', 'angelegt');
