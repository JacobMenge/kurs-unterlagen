// Abend 1 – Netzwerke: Grundlagen, Begriffe und Schichtenmodelle
//
// Bauen:   node 01-netzwerke-grundlagen.js
// Prüfen:  ../.venv/bin/python pruefen.py dist/01-netzwerke-grundlagen.pptx
// Ansehen: ../.venv/bin/python vorschau.py dist/01-netzwerke-grundlagen.pptx
//
// Quellen: docs/netzwerke/warum-netzwerke.md, grundbegriffe.md,
//          osi-und-tcp-ip-modell.md, praxis-schichten-check.md

const path = require("path");
const { createDeck } = require("./lib/theme");
const { iconPng, svgPng } = require("./lib/icons");

const LOGO = {
  cloudhelden: svgPng(
    path.join(__dirname, "assets", "logos", "cloudhelden.svg"),
    "cloudhelden"
  ),
};

const deck = createDeck({
  title: "Netzwerke – Grundlagen, Begriffe und Schichtenmodelle",
  subject: "Abend 1 im Themenblock Planung, Konzeptionierung, Integration",
  akzent: "blau",
});

const { C, T } = deck.api;
const pres = deck.pres;

// ------------------------------------------------------- eigener Baustein

/**
 * Schichtenstapel: eine Zeile je Schicht, mit Nummer, Name und Beispiel.
 * rows: [{ nr, name, beispiel, hervor? }]
 */
function schichten(s, rows, opts = {}) {
  const x = opts.x ?? T.RAND;
  const w = opts.w ?? T.SLIDE_W - 2 * T.RAND;
  const y0 = opts.y ?? 1.75;
  const rowH = opts.rowH ?? 0.38;
  const gap = opts.gap ?? 0.04;
  const nrW = 0.34;

  rows.forEach((r, i) => {
    const y = y0 + i * (rowH + gap);
    const hervor = !!r.hervor;
    s.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w,
      h: rowH,
      fill: { color: hervor ? C.flaecheHell : C.flaeche },
      line: { type: "none" },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x,
      y,
      w: nrW,
      h: rowH,
      fill: { color: hervor ? C.blau : C.textLeise },
      line: { type: "none" },
    });
    s.addText(String(r.nr), {
      x,
      y,
      w: nrW,
      h: rowH,
      fontFace: T.FONT_MONO,
      fontSize: 12,
      color: "FFFFFF",
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
    s.addText(r.name, {
      x: x + nrW + 0.16,
      y,
      w: opts.nameW ?? 2.85,
      h: rowH,
      fontFace: T.FONT_BODY,
      fontSize: opts.fontSize ?? 12,
      color: C.textStark,
      bold: true,
      valign: "middle",
      margin: 0,
    });
    s.addText(r.beispiel, {
      x: x + nrW + 0.16 + (opts.nameW ?? 2.85),
      y,
      w: w - nrW - 0.32 - (opts.nameW ?? 2.85),
      h: rowH,
      fontFace: T.FONT_BODY,
      fontSize: opts.fontSize ?? 12,
      color: C.text,
      valign: "middle",
      margin: 0,
    });
  });
}

/** Zweispaltige Begriffstabelle mit Kopfzeile. */
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
      x: cx + (i === 0 ? 0.1 : 0.1),
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
        fontFace: ci === 0 ? T.FONT_BODY : T.FONT_BODY,
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
  eyebrow: "Thema 1 · Abend 1",
  title: "Netzwerke – das Fundament",
  subtitle: "Grundbegriffe, OSI- und TCP/IP-Modell – und warum Schichten denken alles einfacher macht",
  note: "Mittwoch, 26. August 2026 · 18:00–21:00 Uhr",
  logo: LOGO.cloudhelden,
});

// ============================================================ Einstieg
deck.abschnitt("Einstieg", "blau");

deck.content("Was uns heute Abend erwartet", "Ablauf", (s, api) => {
  api.lead(s, "Erst bauen wir gemeinsam das Bild auf, dann messt ihr es an eurem eigenen Rechner nach.");
  api.schedule(
    s,
    [
      ["18:00", "Ankommen und Einstieg: eine Frage, die den ganzen Block trägt"],
      ["18:10", "Warum Netzwerke – und die Grundbegriffe, die überall auftauchen"],
      ["18:45", "Das OSI-Modell: sieben Schichten"],
      ["19:00", "Pause"],
      ["19:10", "TCP/IP, Kapselung und Schicht-Denken als Diagnosewerkzeug"],
      ["19:30", "Briefing für die Breakout-Übung"],
      ["19:40", "Breakout: der Schichten-Check am eigenen Rechner"],
      ["20:20", "Auswertung im Plenum – wir tragen eure Ergebnisse zusammen"],
      ["20:50", "Prüfungsbegriffe, Ausblick, offene Fragen"],
    ],
    { y: 2.14, rowH: 0.26, fontSize: 10.5 }
  );
  api.kicker(s, "Fragen jederzeit dazwischen – lieber sofort als drei Folien später.", { y: 4.58 });
});

deck.content("Die Frage, an der wir uns festhalten", "Leitfrage", (s, api) => {
  api.statement(s, "Was passiert technisch,\nwenn ich github.com in den Browser tippe?", {
    y: 1.75,
    h: 1.5,
    fontSize: 24,
  });
  api.card(s, {
    y: 3.45,
    h: 1.0,
    titel: "Am Ende dieses Blocks",
    body: "erklärt ihr das in zehn Minuten am Whiteboard, ohne ins Stocken zu geraten – von der Namensauflösung über die Verbindung bis zur fertigen Seite.",
    fontSize: 11.5,
  });
  api.kicker(s, "Heute legen wir das Raster, in das später jede Antwort einsortiert wird.", { y: 4.6 });
});

deck.content("Wo wir gerade stehen", "Einordnung", (s, api) => {
  api.lead(s, "Netzwerke sind der erste Baustein von Thema 1 – und das Vokabular für alles, was danach kommt.");
  api.timeline(
    s,
    [
      { label: "Netzwerke", sub: "Wie Systeme sich erreichen" },
      { label: "Virtualisierung", sub: "Systeme entkoppeln" },
      { label: "Container", sub: "Anwendungen verpacken" },
      { label: "Infrastruktur", sub: "Alles zusammenbringen" },
    ],
    { y: 3.0, boxW: 1.9 }
  );
  api.kicker(s, "Ohne Netzwerkwissen fehlt euch später die Sprache für Container-Netze, Cloud-Architekturen und Sicherheitszonen.", { y: 4.5 });
});

// ============================================================ Warum
deck.abschnitt("Warum Netzwerke", "blau");

deck.kapitel("Warum Netzwerke zuerst", "Das Querschnittsthema, auf dem der ganze Kurs aufbaut", {
  nummer: "01",
});

deck.content("Was ein Netzwerk im Kern ist", "Definition", (s, api) => {
  api.statement(s, "Zwei oder mehr Geräte, die nach vereinbarten Regeln Daten austauschen.", {
    y: 1.8,
    h: 1.0,
    fontSize: 21,
  });
  api.cardRow(
    s,
    [
      {
        titel: "Verbindung",
        body: "Ein Medium, über das Signale laufen: Kupfer, Glasfaser oder Funk.",
      },
      {
        titel: "Adressen",
        body: "Jedes Gerät braucht eine eindeutige Kennung, sonst weiß niemand, wohin.",
      },
      {
        titel: "Regeln",
        body: "Protokolle legen fest, wie gefragt, geantwortet und quittiert wird.",
      },
    ],
    { y: 3.0, h: 1.45, titleH: 0.28 }
  );
  api.kicker(s, "Fehlt einer der drei Punkte, gibt es keine Kommunikation – nur Rauschen.", { y: 4.6 });
});

deck.content("Drei Situationen aus dem Berufsalltag", "Praxisbezug", (s, api) => {
  api.lead(s, "In allen drei Fällen entscheidet Netzwerkwissen darüber, ob das Projekt gelingt.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Filiale anbinden",
        body: "Welches Subnetz? Wie kommt sie sicher an die Zentrale? Wer vergibt die Adressen?",
      },
      {
        nummer: "2",
        titel: "Anlage ans MES",
        body: "Die Maschine spricht Profinet oder OPC UA, die Auswertung erwartet MQTT. Wer übersetzt?",
      },
      {
        nummer: "3",
        titel: "Ab in die Cloud",
        body: "Dieselbe Anwendung, neuer Ort. Latenz, Adressen und Firewall-Regeln ändern sich alle.",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.3 }
  );
  api.kicker(s, "Diese drei Fälle begleiten uns durch den ganzen Kurs.", { y: 4.5 });
});

deck.content("Klassische IT trifft Industrie", "Zwei Welten", (s, api) => {
  api.lead(s, "Die Spezialisierung heißt „Systemintegration und Vernetzung“ – gemeint sind beide Welten.");
  tabelle(
    s,
    ["", "Klassische IT", "Industrie und Anlagen"],
    [
      ["Vorrang hat", "Vertraulichkeit der Daten", "Verfügbarkeit der Anlage"],
      ["Zeitverhalten", "„schnell genug“ reicht", "garantierte Reaktionszeiten"],
      ["Lebensdauer", "3 bis 5 Jahre", "15 bis 25 Jahre"],
      ["Typische Protokolle", "HTTP, SSH, SMB", "Profinet, OPC UA, MQTT"],
      ["Updates", "regelmäßig eingeplant", "nur im Wartungsfenster"],
    ],
    { y: 2.16, rowH: 0.36, spalten: [2.2, 2.6], fontSize: 11.5 }
  );
  api.kicker(s, "Wer beide Welten verbindet, muss die Regeln beider Seiten kennen – genau das prüft die IHK.", { y: 4.56 });
});

// ============================================================ Grundbegriffe
deck.abschnitt("Grundbegriffe", "blau");

deck.kapitel("Die Begriffe des Alltags", "Reichweiten, Topologien, Rollen und Kennzahlen", {
  nummer: "02",
});

deck.content("Netze nach Reichweite", "Begriffe", (s, api) => {
  api.lead(s, "Die Abkürzungen unterscheiden sich nur in einem Buchstaben – und in Kilometern.");
  tabelle(
    s,
    ["Typ", "Reichweite", "Typisches Beispiel"],
    [
      ["PAN", "wenige Meter", "Kopfhörer per Bluetooth am Handy"],
      ["LAN", "Gebäude oder Gelände", "Büronetz, Werkshalle, Heimnetz"],
      ["WLAN", "Gebäude, drahtlos", "dasselbe LAN, nur über Funk"],
      ["MAN", "Stadtgebiet", "Standorte einer Stadtverwaltung"],
      ["WAN", "Land oder weltweit", "Standortkopplung, das Internet"],
    ],
    { y: 2.16, rowH: 0.36, spalten: [1.5, 2.4], fontSize: 11.5 }
  );
  api.kicker(s, "Merksatz: LAN ist das, was euch gehört. WAN ist das, was ihr mietet.", { y: 4.56 });
});

deck.content("Topologien – wie die Geräte verbunden sind", "Begriffe", (s, api) => {
  api.cardRow(
    s,
    [
      {
        titel: "Stern",
        body: [
          "Alle an einen zentralen Switch.",
          "Heute der Normalfall im LAN.",
          "Ausfall des Sterns trifft alle.",
        ],
      },
      {
        titel: "Ring",
        body: [
          "Jeder mit zwei Nachbarn.",
          "In der Industrie verbreitet.",
          "Bruch wird umgeleitet.",
        ],
      },
      {
        titel: "Bus",
        body: [
          "Alle an einer Leitung.",
          "Historisch, heute selten.",
          "Ein Defekt legt alles lahm.",
        ],
      },
      {
        titel: "Masche",
        body: [
          "Viele Wege zum Ziel.",
          "Grundprinzip des Internets.",
          "Teuer, aber ausfallsicher.",
        ],
      },
    ],
    { y: 1.8, h: 2.25, gap: 0.18, titleH: 0.3, fontSize: 11 }
  );
  api.card(s, {
    y: 4.2,
    h: 0.62,
    hell: true,
    body: "Prüfungsrelevant ist nicht das Bild, sondern die Folge: Welcher Ausfall legt wie viel lahm?",
    fontSize: 11.5,
  });
});

deck.content("Client/Server oder gleichberechtigt?", "Rollen", (s, api) => {
  api.lead(s, "Zwei Modelle, wie Geräte ihre Aufgaben untereinander verteilen.");
  api.cardRow(
    s,
    [
      {
        titel: "Client-Server",
        body: [
          "Ein Dienst wartet, viele fragen an.",
          "Zentral verwaltbar: Rechte, Backup, Updates an einer Stelle.",
          "Der Server ist der Engpass und das Ausfallrisiko.",
          "Beispiele: Webserver, Datenbank, Dateiserver.",
        ],
      },
      {
        titel: "Peer-to-Peer",
        body: [
          "Jeder ist zugleich Anbieter und Nutzer.",
          "Kein zentraler Punkt, der ausfallen kann.",
          "Schwer zu verwalten und abzusichern.",
          "Beispiele: Dateifreigaben im Kleinbüro, Blockchain.",
        ],
      },
    ],
    { y: 2.16, h: 2.2, titleH: 0.3, fontSize: 11.5 }
  );
  api.kicker(s, "Im Unternehmen fast immer Client-Server – wegen Verwaltbarkeit, nicht wegen Technik.", { y: 4.56 });
});

deck.content("Was fließt eigentlich durch das Netz?", "Dateneinheiten", (s, api) => {
  api.lead(s, "Dieselben Daten heißen auf jeder Schicht anders – und das ist kein Zufall.");
  tabelle(
    s,
    ["Einheit", "Schicht", "Was drumherum steht"],
    [
      ["Bit", "1 – physisch", "nichts, nur Signal auf der Leitung"],
      ["Frame", "2 – Sicherung", "MAC-Adressen von Sender und Empfänger"],
      ["Paket", "3 – Vermittlung", "IP-Adressen von Quelle und Ziel"],
      ["Segment", "4 – Transport", "Portnummern und Reihenfolge"],
      ["Daten", "7 – Anwendung", "die eigentliche Nachricht"],
    ],
    { y: 2.16, rowH: 0.36, spalten: [1.6, 2.2], fontSize: 11.5 }
  );
  api.kicker(s, "Wenn jemand von „Paket“ spricht, meint er Layer 3. Bei „Frame“ ist er auf Layer 2.", { y: 4.56 });
});

deck.content("Bandbreite ist nicht gleich Geschwindigkeit", "Kennzahlen", (s, api) => {
  api.lead(s, "Vier Kennzahlen, die im Betrieb ständig durcheinandergeworfen werden.");
  const y = 2.3;
  api.kennzahl(s, { x: 0.62, y, w: 2.05, zahl: "Mbit/s", label: "Bandbreite\nwie viel gleichzeitig durchpasst", fontSize: 21, zahlH: 0.5, align: "center" });
  api.kennzahl(s, { x: 2.87, y, w: 2.05, zahl: "ms", label: "Latenz\nwie lange ein Paket unterwegs ist", fontSize: 21, zahlH: 0.5, align: "center" });
  api.kennzahl(s, { x: 5.12, y, w: 2.05, zahl: "± ms", label: "Jitter\nwie stark die Latenz schwankt", fontSize: 21, zahlH: 0.5, align: "center" });
  api.kennzahl(s, { x: 7.37, y, w: 2.05, zahl: "%", label: "Paketverlust\nwas unterwegs verloren geht", fontSize: 21, zahlH: 0.5, align: "center" });
  api.card(s, {
    y: 3.85,
    h: 1.0,
    hell: true,
    titel: "Das Bild dazu",
    body: "Bandbreite ist die Zahl der Fahrspuren, Latenz die Fahrzeit. Eine zwölfspurige Autobahn hilft nicht, wenn der Weg um die halbe Welt führt.",
    fontSize: 11,
    titleH: 0.26,
  });
});

// ============================================================ OSI
deck.abschnitt("OSI und TCP/IP", "teal");

deck.kapitel("Schichten denken", "Das wichtigste Werkzeug des ganzen Abends", { nummer: "03" });

deck.content("Warum überhaupt Schichten?", "Grundidee", (s, api) => {
  api.lead(s, "Ein Netzwerk hat zu viele Aufgaben, um sie an einem Stück zu lösen. Also zerlegt man sie.");
  api.bullets(
    s,
    [
      "Jede Schicht löst genau ein Problem und nutzt die Schicht darunter.",
      "Jede Schicht ist austauschbar: WLAN statt Kabel ändert nichts an eurer Anwendung.",
      "Fehler lassen sich eingrenzen, statt zu raten – das ist der Alltagsnutzen.",
      "Hersteller können unabhängig voneinander entwickeln und bleiben kompatibel.",
    ],
    { y: 2.16, h: 1.7, fontSize: 13.5 }
  );
  api.card(s, {
    y: 3.8,
    h: 1.05,
    titel: "Die Post-Analogie",
    body: "Ihr schreibt den Brief (Schicht 7), steckt ihn in einen Umschlag mit Adresse (Schicht 3), die Post sortiert nach Postleitzahl und der Fahrer kennt nur die nächste Station (Schicht 2).",
    fontSize: 11,
    titleH: 0.26,
  });
});

deck.content("Das OSI-Modell", "Sieben Schichten", (s) => {
  schichten(s, [
    { nr: 7, name: "Anwendung", beispiel: "HTTP, DNS, SSH – was der Nutzer sieht", hervor: true },
    { nr: 6, name: "Darstellung", beispiel: "Verschlüsselung, Kompression, Zeichensatz" },
    { nr: 5, name: "Sitzung", beispiel: "Auf- und Abbau von Sitzungen" },
    { nr: 4, name: "Transport", beispiel: "TCP und UDP, Portnummern", hervor: true },
    { nr: 3, name: "Vermittlung", beispiel: "IP-Adressen, Routing zwischen Netzen", hervor: true },
    { nr: 2, name: "Sicherung", beispiel: "MAC-Adressen, Switch, Frames", hervor: true },
    { nr: 1, name: "Physisch", beispiel: "Kabel, Stecker, Funk, Signalpegel", hervor: true },
  ], { y: 1.72, rowH: 0.37, gap: 0.04 });
  deck.api.kicker(s, "Die fünf hervorgehobenen Schichten braucht ihr täglich. 5 und 6 tauchen in der Praxis kaum getrennt auf.", { y: 4.62 });
});

deck.content("Das TCP/IP-Modell", "Vier Schichten – das echte Internet", (s, api) => {
  api.lead(s, "OSI ist das Lehrmodell, TCP/IP das tatsächlich gebaute. Beide müsst ihr zuordnen können.");
  tabelle(
    s,
    ["TCP/IP", "entspricht OSI", "Was dort passiert"],
    [
      ["Anwendung", "7, 6, 5", "HTTP, DNS, SSH, TLS"],
      ["Transport", "4", "TCP, UDP, Ports"],
      ["Internet", "3", "IP, Routing, ICMP"],
      ["Netzzugang", "2, 1", "Ethernet, WLAN, Kabel"],
    ],
    { y: 2.16, rowH: 0.4, spalten: [1.9, 2.3], fontSize: 12 }
  );
  api.kicker(s, "Faustregel für die Prüfung: OSI zum Erklären, TCP/IP zum Arbeiten.", { y: 4.5 });
});

deck.content("Kapselung – der Umschlag im Umschlag", "Was mit euren Daten passiert", (s, api) => {
  api.lead(s, "Auf dem Weg nach unten bekommt jede Schicht ihren eigenen Kopfteil dazu.");
  api.timeline(
    s,
    [
      { label: "Daten", sub: "„Hallo Server“" },
      { label: "+ Port", sub: "Segment, Layer 4" },
      { label: "+ IP", sub: "Paket, Layer 3" },
      { label: "+ MAC", sub: "Frame, Layer 2" },
      { label: "Signal", sub: "Bits, Layer 1" },
    ],
    { y: 2.95, boxW: 1.55, akzent: "teal" }
  );
  api.card(s, {
    y: 4.02,
    h: 0.78,
    hell: true,
    body: "Beim Empfänger läuft es rückwärts: jede Schicht packt ihren Teil aus und reicht den Rest nach oben. Genau deshalb kann ein Router die IP lesen, ohne die Anwendung zu kennen.",
    fontSize: 11.5,
  });
});

deck.content("Wofür ihr das wirklich braucht", "Schicht-Denken im Alltag", (s, api) => {
  api.lead(s, "Schichten sind kein Prüfungsstoff zum Auswendiglernen, sondern ein Suchraster.");
  api.cardRow(
    s,
    [
      {
        titel: "Fehlersuche",
        body: "Von unten nach oben prüfen: Kabel, Adresse, Weg, Port, Dienst. Die erste Schicht, die scheitert, ist die Ursache.",
        akzent: "teal",
      },
      {
        titel: "Sicherheit",
        body: "Jede Schicht hat ihre eigene Abwehr: Portsicherheit auf 2, Firewall auf 3 und 4, Web-Filter auf 7.",
        akzent: "bernstein",
      },
      {
        titel: "Leistung",
        body: "Langsam heißt selten „das Netz“. Es ist Latenz, Paketverlust oder eine wartende Anwendung.",
        akzent: "blau",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.3 }
  );
  api.kicker(s, "Genau dieses Vorgehen probt ihr gleich im Breakout.", { y: 4.5 });
});

deck.content("Ein Befehl je Schicht", "Der Werkzeugkasten", (s, api) => {
  tabelle(
    s,
    ["Schicht", "Frage", "Befehl (Windows)"],
    [
      ["1 – physisch", "Ist überhaupt eine Verbindung da?", "ipconfig"],
      ["2 – Sicherung", "Wen sehe ich im lokalen Netz?", "arp -a"],
      ["3 – Vermittlung", "Erreiche ich das Ziel, und wie?", "ping / tracert"],
      ["4 – Transport", "Ist der Port offen?", "Test-NetConnection"],
      ["7 – Anwendung", "Kennt jemand diesen Namen?", "nslookup"],
    ],
    { y: 1.78, rowH: 0.38, spalten: [1.9, 3.9], fontSize: 11.5 }
  );
  api.card(s, {
    y: 4.25,
    h: 0.55,
    hell: true,
    body: "macOS und Linux: ip addr · traceroute · nc -vz host port · dig statt nslookup.",
    fontSize: 11,
    akzent: "teal",
  });
});

// ============================================================ Breakout
deck.abschnitt("Breakout", "bernstein");

deck.kapitel("Der Schichten-Check", "40 Minuten in Gruppen – euer eigener Rechner ist das Labor", {
  nummer: "04",
  akzent: "bernstein",
});

deck.content("Der Auftrag", "Breakout · 40 Minuten", (s, api) => {
  api.lead(s, "Ihr messt an eurem eigenen Rechner nach, was wir gerade an der Tafel hatten. Keine Installation nötig.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Netz-Steckbrief",
        body: "Sechs Werte über euren Rechner heraussuchen – und jedem die richtige Schicht zuordnen.",
      },
      {
        nummer: "2",
        titel: "Schichten live",
        body: "Fünf Befehle ausführen und notieren, welche Schicht jeder davon beweist.",
      },
      {
        nummer: "3",
        titel: "Fehlerbilder",
        body: "Fünf Störungen einsortieren: Welche Schicht ist schuld, welcher Befehl zeigt es?",
      },
    ],
    { y: 2.16, h: 2.05, titleH: 0.3 }
  );
  api.kicker(s, "Station 3 ist die wichtigste – wenn die Zeit knapp wird, kürzt Station 2.", { y: 4.5 });
});

deck.content("So arbeitet ihr", "Spielregeln", (s, api) => {
  api.bullets(
    s,
    [
      "Gruppen zu dritt oder viert. Einer teilt den Bildschirm, alle tippen bei sich mit.",
      "Öffnet unter Windows die PowerShell, nicht die alte Eingabeaufforderung.",
      "Schreibt eure Ergebnisse ins gemeinsame Dokument – wir gehen sie nachher durch.",
      "Eure Werte sehen anders aus als meine Beispiele. Genau das ist der Punkt.",
      "Ich komme in jeden Raum. Wenn es klemmt: ruft mich, oder schreibt in den Chat.",
    ],
    { y: 1.78, h: 2.2, fontSize: 13, akzent: "bernstein" }
  );
  api.card(s, {
    y: 4.05,
    h: 0.8,
    body: "Die Anleitung mit allen Befehlen und Notizfeldern steht auf der Kursseite: Netzwerke → Praxis: Der Schichten-Check.",
    fontSize: 11.5,
    akzent: "bernstein",
  });
});

deck.content("Station 1 – der Netz-Steckbrief", "Breakout", (s, api) => {
  api.lead(s, "Findet diese sechs Werte und schreibt daneben, zu welcher Schicht sie gehören.");
  api.code(
    s,
    "PS C:\\> ipconfig /all\n\n# macOS / Linux\n$ ip addr        # oder: ifconfig\n$ ip route       # Zeile \"default via ...\" = Gateway",
    { y: 2.1, h: 1.6, titel: "PowerShell", fontSize: 11 }
  );
  api.bullets(
    s,
    [
      "IPv4-Adresse und Subnetzmaske · Standardgateway · DNS-Server",
      "Physische Adresse (MAC) · DHCP aktiviert ja oder nein",
    ],
    { y: 3.82, h: 0.6, fontSize: 12, akzent: "bernstein" }
  );
  api.kicker(s, "Achtung: Der richtige Adapter ist der mit einem Standardgateway.", { y: 4.5 });
});

deck.content("Station 2 – die Schichten in Aktion", "Breakout", (s, api) => {
  api.code(
    s,
    "ping <euer Gateway>            # kommt ihr bis zum Router?\narp -a                         # wen sieht euer Rechner lokal?\nnslookup github.com            # welche IP steckt hinter dem Namen?\ntracert github.com             # welchen Weg nimmt das Paket?\nTest-NetConnection github.com -Port 443",
    { y: 1.78, h: 1.85, titel: "PowerShell", fontSize: 11 }
  );
  api.card(s, {
    y: 3.78,
    h: 1.0,
    titel: "Eure Aufgabe",
    body: "Notiert zu jedem Befehl: Welche Schicht prüft er, und woran seht ihr das in der Ausgabe? Bei tracert reichen die ersten fünf Zeilen.",
    fontSize: 11.5,
    titleH: 0.26,
    akzent: "bernstein",
  });
});

deck.content("Station 3 – fünf Störungen einsortieren", "Breakout", (s, api) => {
  api.lead(s, "Zu jedem Fall: Welche Schicht ist betroffen, und mit welchem Befehl weist ihr es nach?");
  api.bullets(
    s,
    [
      "Das Netzwerksymbol zeigt ein rotes Kreuz, kein Kabel steckt.",
      "Der Rechner hat die Adresse 169.254.12.7 und kommt nirgendwo hin.",
      "ping 8.8.8.8 funktioniert, ping google.de bringt einen Fehler.",
      "Der Server antwortet auf ping, aber die Webseite lädt nicht.",
      "Alles ist erreichbar, aber quälend langsam.",
    ],
    { y: 2.16, h: 2.0, fontSize: 12.5, numbered: true, akzent: "bernstein" }
  );
  api.kicker(s, "Das ist genau das Aufgabenformat, das euch in der Prüfung begegnet.", { y: 4.5 });
});

// ============================================================ Auswertung
deck.abschnitt("Auswertung", "blau");

deck.kapitel("Zusammentragen", "Was habt ihr gefunden – und was hat euch überrascht?", {
  nummer: "05",
  akzent: "blau",
});

deck.content("Das gehen wir gemeinsam durch", "Auswertung · 30 Minuten", (s, api) => {
  api.schedule(
    s,
    [
      ["1", "Reihum: eine Gruppe zeigt ihren Steckbrief, die anderen ergänzen"],
      ["2", "Warum hat fast jeder eine 192.168er-Adresse? – private Adressbereiche"],
      ["3", "Die fünf Befehle, jeder einer Schicht zugeordnet"],
      ["4", "Die fünf Störungen – auflösen und begründen"],
      ["5", "Was war unerwartet? Woran seid ihr hängengeblieben?"],
    ],
    { y: 1.9, rowH: 0.42, labelW: 0.45, fontSize: 12 }
  );
  api.card(s, {
    y: 4.05,
    h: 0.78,
    hell: true,
    body: "Wichtiger als die richtige Antwort ist die Begründung: Woran habt ihr die Schicht erkannt? Genau danach fragt die Prüfung.",
    fontSize: 11.5,
  });
});

deck.content("Die Auflösung der fünf Störungen", "Auswertung", (s, api) => {
  tabelle(
    s,
    ["Fall", "Schicht", "Nachweis"],
    [
      ["Kein Kabel", "1 – physisch", "ipconfig: Medium getrennt"],
      ["169.254.x.x", "3 – Adresse", "kein DHCP erreichbar, Selbstvergabe"],
      ["Nur Name geht nicht", "7 – DNS", "nslookup schlägt fehl, ping auf IP klappt"],
      ["ping ja, Web nein", "4 oder 7", "Test-NetConnection auf Port 443"],
      ["Alles langsam", "kein Ausfall", "Latenz und Verlust in ping ansehen"],
    ],
    { y: 1.78, rowH: 0.42, spalten: [2.3, 2.0], fontSize: 11.5 }
  );
  api.kicker(s, "Von unten nach oben prüfen. Die erste Schicht, die nicht antwortet, ist die Ursache.", { y: 4.5 });
});

// ============================================================ Abschluss
deck.abschnitt("Abschluss", "blau");

deck.content("Das nehmt ihr heute mit", "Kern des Abends", (s, api) => {
  api.bullets(
    s,
    [
      { text: "Ein Netz braucht drei Dinge: Verbindung, Adressen, Regeln.", bold: true },
      { text: "Dieselben Daten heißen je nach Schicht Frame, Paket oder Segment.", bold: true },
      { text: "OSI hat sieben Schichten, TCP/IP vier – ihr müsst sie zuordnen können.", bold: true },
      { text: "Bandbreite ist nicht Geschwindigkeit. Latenz ist die andere Hälfte.", bold: true },
      { text: "Fehlersuche heißt: von unten nach oben, Schicht für Schicht.", bold: true },
    ],
    { y: 1.85, h: 2.0, fontSize: 13.5 }
  );
  api.card(s, {
    y: 3.9,
    h: 1.05,
    hell: true,
    titel: "Prüfungsbegriffe von heute",
    body: "Schichtenmodell · OSI · TCP/IP · Topologie · Client-Server · Latenz · Bandbreite · Frame, Paket, Segment.",
    fontSize: 11,
    titleH: 0.26,
  });
});

deck.content("Bis Montag", "Nacharbeit", (s, api) => {
  api.lead(s, "Alles freiwillig – aber der Montag wird deutlich leichter, wenn ihr das gemacht habt.");
  api.cardRow(
    s,
    [
      {
        titel: "Lesen",
        body: "Die Seiten „Grundbegriffe“ und „OSI- und TCP/IP-Modell“ in Ruhe durchgehen, inklusive der Selbstkontrollfragen am Ende.",
      },
      {
        titel: "Nachholen",
        body: "Wer im Breakout nicht bis Station 3 gekommen ist: Der Schichten-Check steht vollständig auf der Kursseite.",
      },
      {
        titel: "Vorbereiten",
        body: "Am Montag rechnen wir Subnetze. Bringt Papier, Stift und einen wachen Kopf mit – Taschenrechner braucht ihr nicht.",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.28 }
  );
  api.kicker(s, "Nächster Termin: Montag, 31. August, 18:00 Uhr – Adressierung und Subnetting.", { y: 4.5 });
});

deck.schluss({
  title: "Fragen?",
  subtitle: "Alles von heute steht zum Nachlesen auf der Kursseite – der ganze Netzwerk-Block ist schon online.",
  note: "Montag, 31. August · Adressierung und Subnetting",
});

// ============================================================ Bauen

deck.save(path.join(__dirname, "dist", "01-netzwerke-grundlagen.pptx")).then((r) => {
  console.log(`Fertig: ${r.file} – ${r.slides} Folien`);
});
