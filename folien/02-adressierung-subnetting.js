// Abend 2 – Adressierung und Subnetting
//
// Bauen:   node 02-adressierung-subnetting.js
// Prüfen:  ../.venv/bin/python pruefen.py dist/02-adressierung-subnetting.pptx
// Ansehen: ../.venv/bin/python vorschau.py dist/02-adressierung-subnetting.pptx
//
// Quellen: docs/netzwerke/adressierung.md, praxis-subnetting.md
// Grundlage der Gewichtung: Standortbestimmung vom 31.08. – Konzepte sitzen
// (DNS/Gateway 14/14), das Rechnen wackelt (/26 nur 8/14).

const path = require("path");
const { createDeck } = require("./lib/theme");
const { svgPng } = require("./lib/icons");
const D = require("./lib/diagramme");

// Vor dem Unterricht prüfen: Das Ergebnis-Dokument legt Jacob je Termin neu an.
const LINK_UEBUNG = "jacobmenge.github.io/kurs-unterlagen/netzwerke/praxis-subnetting/";
const LINK_DOKUMENT = "<Link zum Ergebnis-Dokument hier eintragen>";

// Mit KURS=parallel entsteht die Fassung für Philipps Kurs (Di, 01.09.):
// ohne Umfrage-Bezüge, ohne Verweise auf unsere Abende, Docker-Anschluss.
const P = process.env.KURS === "parallel";

// ===================== JE KURS ANPASSEN =====================
const TERMIN_HEUTE = "Montag, 31. August 2026";
const TERMIN_NAECHSTER = "Mittwoch, 2. September";
const TERMIN_HEUTE_P = "Dienstag, 1. September 2026";
const TERMIN_NAECHSTER_P = "Donnerstag, 3. September";
// Dazu oben: LINK_DOKUMENT je Termin frisch eintragen.
// ============================================================

const LOGO = {
  cloudhelden: svgPng(
    path.join(__dirname, "assets", "logos", "cloudhelden.svg"),
    "cloudhelden"
  ),
};

const deck = createDeck({
  title: "Adressierung und Subnetting",
  subject: "Abend 2 im Themenblock Planung, Konzeptionierung, Integration",
  akzent: "blau",
});

const { C, T } = deck.api;
const pres = deck.pres;

/** Zweispaltige Begriffstabelle mit Kopfzeile – wie im Satz zu Abend 1. */
function tabelle(s, kopf, rows, opts = {}) {
  const x = opts.x ?? T.RAND;
  const w = opts.w ?? T.SLIDE_W - 2 * T.RAND;
  const y0 = opts.y ?? 1.8;
  const rowH = opts.rowH ?? 0.36;
  const spalten = opts.spalten ?? [2.4, 2.4];
  const rest = w - spalten.reduce((a, b) => a + b, 0);
  const breiten = [...spalten, rest];

  kopf.forEach((k, i) => {
    const cx = x + breiten.slice(0, i).reduce((a, b) => a + b, 0);
    s.addText(k, {
      x: cx + 0.1,
      y: y0,
      w: breiten[i] - 0.2,
      h: 0.3,
      fontFace: T.FONT_BODY,
      fontSize: 10.5,
      color: C.blau,
      bold: true,
      charSpacing: 0.8,
      valign: "middle",
      margin: 0,
    });
  });
  s.addShape(pres.shapes.LINE, {
    x,
    y: y0 + 0.32,
    w,
    h: 0,
    line: { color: C.linie, width: 1 },
  });

  rows.forEach((r, ri) => {
    const y = y0 + 0.4 + ri * rowH;
    if (ri % 2 === 0) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x - 0.1,
        y,
        w: w + 0.2,
        h: rowH,
        fill: { color: C.flaeche },
        line: { type: "none" },
      });
    }
    r.forEach((zelle, ci) => {
      const cx = x + breiten.slice(0, ci).reduce((a, b) => a + b, 0);
      s.addText(zelle, {
        x: cx + 0.1,
        y,
        w: breiten[ci] - 0.2,
        h: rowH,
        fontFace: T.FONT_BODY,
        fontSize: opts.fontSize ?? 11.5,
        color: ci === 0 ? C.textStark : C.text,
        bold: ci === 0,
        valign: "middle",
        margin: 0,
      });
    });
  });
}

// ============================================================ Titel

deck.title({
  eyebrow: "Thema 1 · Abend 2",
  title: "Adressierung und Subnetting",
  subtitle: "Heute wird gerechnet – Papier und Stift reichen, Taschenrechner braucht ihr nicht",
  note: (P ? TERMIN_HEUTE_P : TERMIN_HEUTE) + " · 18:00–21:00 Uhr",
  logo: LOGO.cloudhelden,
});

// ============================================================ Einstieg
deck.abschnitt("Einstieg", "blau");

deck.content("Was uns heute Abend erwartet", "Ablauf", (s, api) => {
  api.schedule(
    s,
    [
      P ? ["18:00", "Ankommen und Einstieg"] : ["18:00", "Eure Standortbestimmung – die ersten Ergebnisse"],
      ["18:10", "Die Adresse auseinandergenommen: Aufbau, Maske, Präfixe"],
      ["18:25", "Rechnen: Blockgrößen, Netz- und Broadcast-Adresse, drei Aufgaben"],
      ["18:45", "Pause"],
      ["18:55", "Private Adressen und NAT – und IPv6 kompakt"],
      ["19:15", "Briefing für die Breakout-Übung"],
      ["19:25", "Breakout: Subnetz-Architekten"],
      ["20:15", "Auswertung: eure Netzpläne im Vergleich"],
      P ? ["20:50", "Ausblick auf Donnerstag"] : ["20:50", "Ausblick auf Mittwoch"],
    ],
    { y: 1.98, rowH: 0.28, fontSize: 11 }
  );
  api.kicker(s, P
    ? "Am Donnerstag folgt Teil zwei: Routing, VLAN und Sicherheit – das Finale."
    : "Am Mittwoch schließen wir den Netzwerkblock ab – danach geht es in die Virtualisierung.", { y: 4.58 });
});

if (!P) deck.content("Eure Standortbestimmung – danke!", "14 von 14 haben geantwortet", (s, api) => {
  api.lead(s, "Drei Netzwerkfragen aus dem Formular. Zwei davon habt ihr komplett abgeräumt.");
  s.addImage({ path: D.umfrageNetz(), x: T.RAND, y: 2.1, w: T.INHALT_W, h: 2.05 });
  api.kicker(s, "Die dritte Frage ist kein Zufallstreffer – am Ende des Abends beantwortet sie jeder hier im Schlaf.", { y: 4.4 });
});

// ============================================================ Adresse & Maske
deck.abschnitt("Adresse und Maske", "blau");

deck.kapitel("Die Adresse auseinandergenommen", "Was in 192.168.2.33/24 wirklich drinsteckt", {
  nummer: "01",
});

deck.content("Eine Adresse, zwei Hälften", "Aufbau", (s, api) => {
  s.addImage({ path: D.ipAufbau(), x: T.RAND, y: 1.7, w: T.INHALT_W, h: 2.35 });
  api.kicker(s, "Die Maske zieht die Grenze: Alles unter den Einsen ist Netz, der Rest gehört dem Gerät.", { y: 4.4 });
});

deck.content("Die Präfixe, mit denen ihr rechnen werdet", "Referenz", (s, api) => {
  api.lead(s, "Euer Werkzeug für heute. Blockgröße = 2 hoch Hostbits – jeder Schritt halbiert.", { h: 0.3 });
  tabelle(
    s,
    ["Präfix", "Maske", "Blockgröße · nutzbar"],
    [
      ["/24", "255.255.255.0", "256 · 254 Geräte"],
      ["/25", "255.255.255.128", "128 · 126 Geräte"],
      ["/26", "255.255.255.192", "64 · 62 Geräte"],
      ["/27", "255.255.255.224", "32 · 30 Geräte"],
      ["/28", "255.255.255.240", "16 · 14 Geräte"],
      ["/29", "255.255.255.248", "8 · 6 Geräte"],
      ["/30", "255.255.255.252", "4 · 2 – Router-Kopplung"],
    ],
    { y: 1.95, rowH: 0.31, w: 6.0, spalten: [1.0, 2.1], fontSize: 11 }
  );
  s.addText("SO OFT PASST DER BLOCK INS /24", {
    x: 6.86, y: 1.95, w: 2.52, h: 0.3,
    fontFace: T.FONT_BODY, fontSize: 10.5, color: C.teal, bold: true,
    charSpacing: 0.8, valign: "middle", margin: 0,
  });
  s.addImage({ path: D.praefixBalken(), x: 6.86, y: 2.35, w: 2.52, h: 2.17 });
  api.kicker(s, "Auffällig: nutzbar ist immer Blockgröße minus 2. Warum – nächste Folie.", { y: 4.6 });
});

deck.content("Warum 62 und nicht 64", P ? "Der Klassiker" : "Die Frage aus der Umfrage", (s, api) => {
  s.addImage({ path: D.block26(), x: T.RAND, y: 1.75, w: T.INHALT_W, h: 1.75 });
  api.card(s, {
    y: 3.7,
    h: 1.0,
    hell: true,
    titel: "Und das Gateway?",
    body: "Der Router braucht auch eine Adresse aus dem Block – meist die erste nutzbare. Wer Geräte zählt, plant ihn mit ein: 62 nutzbare heißt 61 für eure Geräte plus das Gateway.",
    fontSize: 11.5,
    titleH: 0.26,
  });
});

// ============================================================ Rechnen
deck.abschnitt("Rechenwerkstatt", "teal");

deck.kapitel("Jetzt rechnet ihr", "Drei Aufgaben, Antworten in den Chat – aufgelöst wird per Klick", {
  nummer: "02",
  akzent: "teal",
});

deck.content("Das Rezept", "In vier Schritten zu jedem Netz", (s, api) => {
  s.addImage({ path: D.rezeptWeg(), x: T.RAND, y: 1.72, w: T.INHALT_W, h: 2.5 });
  api.kicker(s, "Mit diesen vier Schritten löst ihr jede Aufgabe von heute – und jede, die euch draußen begegnet.", { y: 4.5 });
});

// Drei Aufgaben, jeweils Frage-Folie und Auflösungs-Folie – beim Präsentieren
// wirkt der Klick wie eine Animation, solange die Positionen gleich bleiben.
const AUFGABEN = [
  {
    nr: "A",
    frage: "Die Adresse 192.168.10.77 liegt in einem /26-Netz.",
    auftrag: "Netzadresse, erste und letzte nutzbare Adresse, Broadcast?",
    bild: () => D.blockStrahl(),
    merke: "Nutzbar .65 bis .126 – der Blockanfang benennt das Netz, die letzte Adresse ruft alle.",
  },
  {
    nr: "B",
    frage: "Eine Abteilung braucht Platz für 40 Geräte.",
    auftrag: "Welches Präfix nehmt ihr – und warum nicht eins kleiner?",
    loesung: [
      "5 Hostbits: 2⁵ − 2 = 30 nutzbar → reicht nicht für 40",
      "6 Hostbits: 2⁶ − 2 = 62 nutzbar → passt",
      "Präfix = 32 − 6 = /26",
    ],
    merke: "Immer die kleinste Blockgröße, die noch reicht – plus Blick auf morgen: Wächst die Abteilung?",
  },
  {
    nr: "C",
    frage: "Die Adresse 172.16.4.130 liegt in einem /23-Netz.",
    auftrag: "Netzadresse und Broadcast? Vorsicht, hier reicht das letzte Oktett nicht.",
    loesung: [
      "9 Hostbits → Blockgröße 512: das dritte Oktett spielt mit, in Zweierschritten",
      "Netze: 172.16.0.0, 172.16.2.0, 172.16.4.0 … → .4.130 liegt in 172.16.4.0/23",
      "nutzbar 172.16.4.1 bis 172.16.5.254 · Broadcast 172.16.5.255",
    ],
    merke: "Ein Präfix unter /24 heißt: Der Block läuft über mehrere dritte Oktette hinweg.",
  },
];

AUFGABEN.forEach((a) => {
  for (const aufgeloest of [false, true]) {
    deck.content(`Aufgabe ${a.nr}`, aufgeloest ? "Auflösung" : "Rechnet – Antwort in den Chat", (s, api) => {
      api.card(s, {
        y: 1.78,
        h: 1.1,
        titel: a.frage,
        body: a.auftrag,
        fontSize: 13,
        titleSize: 14,
        titleH: 0.32,
        akzent: "teal",
      });
      if (aufgeloest && a.bild) {
        s.addImage({ path: a.bild(), x: T.RAND, y: 3.05, w: T.INHALT_W, h: 1.22 });
        api.kicker(s, a.merke, { y: 4.5 });
      } else if (aufgeloest) {
        api.bullets(s, a.loesung, { y: 3.1, h: 1.25, fontSize: 12.5, numbered: true, akzent: "teal" });
        api.kicker(s, a.merke, { y: 4.5 });
      } else {
        api.kicker(s, "Das Rezept: Hostbits → Blockgröße → Block finden → minus zwei.", { y: 4.5, color: C.textLeise });
      }
    });
  }
});

// ============================================================ NAT & IPv6
deck.abschnitt("Privat und v6", "blau");

deck.kapitel("Wem gehört 192.168?", P ? "Warum ihr alle dieselbe private Adresse haben dürft – und der Blick auf IPv6" : "Die Antwort auf die Frage vom Mittwoch – und der Blick auf IPv6", {
  nummer: "03",
});

deck.content("Private Adressen und NAT", "Warum ihr alle dieselbe Adresse haben dürft", (s, api) => {
  s.addImage({ path: D.natWeg(), x: T.RAND, y: 1.7, w: T.INHALT_W, h: 2.35 });
  api.kicker(s, "Drei private Bereiche gehören euch: 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16 – im Internet werden sie nicht geroutet.", { y: 4.4 });
});

deck.content("IPv6 in fünf Minuten", "Der Blick nach vorn", (s, api) => {
  s.addImage({ path: D.ipv6Aufbau(P), x: T.RAND, y: 1.7, w: T.INHALT_W, h: 1.9 });
  api.cardRow(
    s,
    [
      { titel: "Kein Rechnen mehr", body: "Das Netz ist praktisch immer ein /64 – gerechnet wird beim Anbieter." },
      { titel: "Kein Broadcast", body: "Gezielte Gruppenrufe statt Alle-Rufen – das Minus-zwei entfällt." },
      { titel: "Kein NAT-Zwang", body: "Adressen genug für alle – die Trennung übernimmt die Firewall." },
    ],
    { y: 3.7, h: 1.12, titleH: 0.28, fontSize: 10.5 }
  );
});

// ============================================================ Breakout
deck.abschnitt("Breakout", "bernstein");

deck.kapitel("Subnetz-Architekten", "50 Minuten in Gruppen – ihr plant das Netz der Müller GmbH", {
  nummer: "04",
  akzent: "bernstein",
});

deck.content("Der Auftrag", "Breakout · 50 Minuten", (s, api) => {
  api.lead(s, "Die Müller GmbH zieht um. Ihr bekommt ein /24 und schneidet daraus die Abteilungsnetze – nur mit Stift, Papier und dem Rezept von eben.");
  api.schedule(
    s,
    [
      ["10 min", "Je Abteilung die Hostbits bestimmen – Formel: 2 hoch n minus 2"],
      ["15 min", "Größte zuerst: Präfixe wählen, Blöcke lückenlos schneiden"],
      ["15 min", "Planungstabelle füllen: Netz, erste, letzte, Broadcast"],
      ["10 min", "Selbstcheck im Online-Subnetzrechner – jede Zeile muss exakt passen"],
    ],
    { y: 2.2, rowH: 0.42, labelW: 0.95, fontSize: 12, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.95,
    h: 0.92,
    hell: true,
    titel: "Jetzt öffnen – beides braucht ihr gleich im Raum",
    body: [
      "Aufgabe mit allen Zahlen:  " + LINK_UEBUNG,
      "Ergebnisse eintragen:  " + LINK_DOKUMENT,
    ],
    fontSize: 10.5,
    titleH: 0.24,
    akzent: "bernstein",
  });
});

deck.content("So arbeitet ihr", "Spielregeln", (s, api) => {
  api.bullets(
    s,
    [
      P ? "Gruppen zu dritt oder viert. Eine Person teilt den Bildschirm." : "Gleiche Gruppen wie beim Schichten-Check. Eine Person teilt den Bildschirm.",
      "Öffnet den Link zur Kursseite jetzt – im Breakout-Raum seht ihr diese Folie nicht mehr.",
      "Rechnet laut und gemeinsam. Wer einen anderen Weg hat: sagen, nicht schweigen.",
      "Der Online-Rechner ist der Schiedsrichter – aber erst nach eurer Rechnung, nicht statt ihr.",
      "Wenn es klemmt: in eurem Raum auf „Um Hilfe bitten“ klicken. Dann komme ich rein.",
    ],
    { y: 1.86, h: 2.2, fontSize: 12.5, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.94,
    h: 0.9,
    titel: "Um 20:15 sind alle wieder hier",
    body: "Sprecher wie gehabt. Jede Gruppe zeigt nachher ihre Planungstabelle.",
    fontSize: 11.5,
    titleH: 0.26,
    akzent: "bernstein",
  });
});

// ============================================================ Auswertung
deck.abschnitt("Auswertung", "blau");

deck.kapitel("Eure Netzpläne", "Vier Lösungen, ein Vergleich – und die Probe aufs Exempel", {
  nummer: "05",
});

deck.content("Das gehen wir gemeinsam durch", "Auswertung · 35 Minuten", (s, api) => {
  api.schedule(
    s,
    [
      ["1", "Jede Gruppe zeigt ihre Planungstabelle – kurz, nur die Eckwerte"],
      ["2", "Vergleich: Wo unterscheiden sich die Pläne – und sind beide richtig?"],
      ["3", "Die Probe: Passen alle Blöcke zusammen in das /24?"],
      ["4", "Was bleibt übrig – und warum ist Reserve kein Fehler?"],
      P ? ["5", "Zum Schluss für alle: /26 – wie viele Geräte? Jetzt kann es jeder"] : ["5", "Der Bogen zur Umfrage: die /26-Frage, noch einmal für alle"],
    ],
    { y: 1.9, rowH: 0.42, labelW: 0.45, fontSize: 12 }
  );
  api.card(s, {
    y: 4.15,
    h: 0.6,
    hell: true,
    body: "Es gibt mehrere richtige Pläne. Falsch ist nur, was sich überlappt oder nicht reicht.",
    fontSize: 11.5,
  });
});

deck.content("Eine mögliche Lösung", "Auswertung", (s, api) => {
  tabelle(
    s,
    ["Abteilung", "Präfix", "Netz · nutzbar · Broadcast"],
    [
      ["Büro (100)", "/25", "192.168.10.0 · .1–.126 · .127"],
      ["Gäste-WLAN (50)", "/26", "192.168.10.128 · .129–.190 · .191"],
      ["Produktion (20)", "/27", "192.168.10.192 · .193–.222 · .223"],
      ["Server (10)", "/28", "192.168.10.224 · .225–.238 · .239"],
      ["Reserve", "–", ".240 bis .255 bleiben frei – Platz zum Wachsen"],
    ],
    { y: 1.9, rowH: 0.4, spalten: [1.9, 1.0], fontSize: 11.5 }
  );
  api.kicker(s, "Größte zuerst vermeidet Lücken. Probe: 128 + 64 + 32 + 16 = 240 ≤ 256 – passt.", { y: 4.5 });
});

// ============================================================ Abschluss
deck.abschnitt("Abschluss", "blau");

deck.content("Das nehmt ihr heute mit", "Kern des Abends", (s, api) => {
  api.bullets(
    s,
    [
      { text: "Die Maske zieht die Grenze zwischen Netzanteil und Hostanteil.", bold: true },
      { text: "Blockgröße = 2 hoch Hostbits. Nutzbar = Blockgröße minus zwei.", bold: true },
      { text: "Netzadresse benennt das Netz, Broadcast ruft alle – beide sind reserviert.", bold: true },
      { text: "Privat heißt 10er, 172.16er, 192.168er – NAT übersetzt am Router nach draußen.", bold: true },
      { text: "IPv6 nimmt euch das Rechnen ab – das Netz ist fast immer ein /64.", bold: true },
    ],
    { y: 1.85, h: 2.0, fontSize: 13.5 }
  );
  api.card(s, {
    y: 3.9,
    h: 1.05,
    hell: true,
    titel: "Die Begriffe von heute",
    body: "Oktett · Maske · Präfix (CIDR) · Netzanteil, Hostanteil · Blockgröße · Netzadresse, Broadcast · RFC-1918-Bereiche · NAT · Link-local. Die Begriffe begleiten euch bis zum Schluss – im Kurs wie in der Prüfung.",
    fontSize: 11,
    titleH: 0.26,
  });
});

deck.content(P ? "Bis Donnerstag" : "Bis Mittwoch", "Nacharbeit", (s, api) => {
  api.lead(s, P ? "Zwei Angebote, keine Pflicht – Donnerstag machen wir das Netz fertig." : "Zwei Angebote, keine Pflicht – Mittwoch machen wir den Netzwerkblock fertig.");
  api.cardRow(
    s,
    [
      {
        titel: "Nachrechnen",
        body: "Wer heute noch gestolpert ist: Auf der Seite „Adressierung“ stehen weitere Aufgaben mit Lösungsweg – zwei davon reichen.",
      },
      {
        titel: "Weiterlesen",
        body: "Wer wissen will, wie der Weg eines Aufrufs wirklich aussieht: „Praxis: github.com – die Spurensuche“ auf der Kursseite.",
      },
      P
        ? {
            titel: "Donnerstag",
            body: "Routing, VLAN und Netzwerksicherheit kompakt – und zum Abschluss beantwortet ihr eine Frage, in der alles von heute steckt.",
          }
        : {
            titel: "Mittwoch",
            body: "Routing, VLAN und Netzwerksicherheit kompakt – und zum Abschluss lösen wir die Leitfrage vom ersten Abend ein.",
          },
    ],
    { y: 2.16, h: 2.1, titleH: 0.28 }
  );
  api.kicker(s, P ? "Nächster Termin: " + TERMIN_NAECHSTER_P + ", 18:00 Uhr – Teil zwei und das Finale." : "Nächster Termin: " + TERMIN_NAECHSTER + ", 18:00 Uhr – das Finale des Netzwerkblocks.", { y: 4.5 });
});

deck.schluss({
  title: "Fragen?",
  subtitle: "Aufgaben, Lösungswege und die ganze Theorie stehen zum Nachlesen auf der Kursseite.",
  note: P ? TERMIN_NAECHSTER_P + " · Routing, VLAN und Sicherheit" : TERMIN_NAECHSTER + " · Routing, VLAN und Sicherheit – das Blockfinale",
});

// ============================================================ Bauen

deck.save(path.join(__dirname, "dist", P ? "02-adressierung-subnetting-parallelkurs.pptx" : "02-adressierung-subnetting.pptx")).then((r) => {
  console.log(`Fertig: ${r.file} – ${r.slides} Folien`);
});
