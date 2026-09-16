// Stationsmodul: meldet sich regelmäßig bei der Bodenkontrolle.
// Ein Container = ein Modul. Welches, entscheidet die Umgebungsvariable
// MODUL_NAME. Der Code muss nicht verstanden werden, Fokus der Übung
// ist Compose: gleiches Image, sechs Umgebungen.

const NAME = process.env.MODUL_NAME;
const ZIEL = process.env.BACKEND_ADRESSE || "http://backend:3000";
const TAKT_MS = 3000;

if (!NAME) {
  console.error("[modul] Umgebungsvariable MODUL_NAME fehlt. Ohne Namen keine Meldung.");
  process.exit(1);
}

let verbunden = false;

async function melden() {
  try {
    const res = await fetch(`${ZIEL}/api/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: NAME }),
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!verbunden) {
      console.log(`[modul] ${NAME}: Verbindung zur Bodenkontrolle steht (${ZIEL})`);
      verbunden = true;
    }
  } catch (err) {
    verbunden = false;
    const grund = (err.cause && err.cause.code) || err.message;
    console.log(`[modul] ${NAME}: Bodenkontrolle nicht erreichbar unter ${ZIEL} (${grund})`);
  }
}

console.log(`[modul] ${NAME} gestartet, meldet sich alle ${TAKT_MS / 1000} Sekunden.`);
melden();
setInterval(melden, TAKT_MS);

process.on("SIGTERM", () => {
  console.log(`[modul] ${NAME}: Stopp-Signal empfangen.`);
  process.exit(0);
});
