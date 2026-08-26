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
const D = require("./lib/diagramme");

// Vor dem Unterricht prüfen: Die Übungsseite steht fest, das Ergebnis-Dokument
// legt Jacob je Termin neu an. Beide erscheinen auf der Auftrags-Folie, weil
// Meet den Hauptraum-Chat in den Breakout-Räumen nicht mitnimmt.
const LINK_UEBUNG = "jacobmenge.github.io/kurs-unterlagen/netzwerke/praxis-schichten-check/";
const LINK_DOKUMENT = "<Link zum Ergebnis-Dokument hier eintragen>";

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
  subtitle: "Auffrischung auf gemeinsamen Stand – und der Blick auf das, was in der Ausbildung nicht vorkam",
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
      ["18:00", "Ankommen, Technik, Einstieg"],
      ["18:10", "Warum Netzwerke – und was in der Ausbildung nicht vorkam"],
      ["18:25", "Auffrischung im Schnellgang: Topologien, Dateneinheiten, Kennzahlen"],
      ["18:45", "Pause"],
      ["18:55", "OSI und TCP/IP, Kapselung, der Werkzeugkasten"],
      ["19:20", "Briefing für die Breakout-Übung"],
      ["19:30", "Breakout: der Schichten-Check am eigenen Rechner"],
      ["20:25", "Auswertung im Plenum"],
      ["20:55", "Ausblick und offene Fragen"],
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
    body: "erklärt ihr das am Stück, ohne ins Stocken zu geraten – von der Namensauflösung über die Verbindung bis zur fertigen Seite.",
    fontSize: 11.5,
  });
  api.kicker(s, "Heute legen wir das Raster, in das später jede Antwort einsortiert wird.", { y: 4.6 });
});

deck.content("Wo wir gerade stehen", "Einordnung", (s, api) => {
  api.lead(s, "Netzwerke sind der erste Baustein von Thema 1 – und das Vokabular für alles, was danach kommt.");
  s.addImage({ path: D.wegThema1(), x: T.RAND, y: 2.1, w: T.INHALT_W, h: 1.9 });
  api.kicker(s, "Container-Netze, Cloud-Subnetze, Sicherheitszonen: dieselben Begriffe, anderer Ort.", { y: 4.28 });
});

// ============================================================ Warum
deck.abschnitt("Warum Netzwerke", "blau");

deck.kapitel("Warum Netzwerke zuerst", "Das Querschnittsthema, auf dem der ganze Kurs aufbaut", {
  nummer: "01",
});

deck.content("Warum wir mit Bekanntem anfangen", "Einordnung", (s, api) => {
  api.lead(s, "Ihr seid ausgebildete Fachinformatiker. Das meiste von heute Abend habt ihr schon einmal gehört – und das ist Absicht.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Gemeinsame Sprache",
        body: "Ihr kommt aus verschiedenen Betrieben und Jahrgängen. Ab Montag rechnen wir – da müssen die Begriffe bei allen gleich sitzen.",
      },
      {
        nummer: "2",
        titel: "Standortbestimmung",
        body: "Nach der Ausbildung liegt vieles ein paar Jahre zurück. Heute merkt jeder selbst, wo es hakt – ohne dass es jemand mitbekommt.",
      },
      {
        nummer: "3",
        titel: "Der neue Teil",
        body: "Die Industrie- und Anlagenvernetzung stand in keiner FISI-Ausbildung. Genau dort liegt der Kern dieser Fortbildung.",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.3 }
  );
  api.kicker(s, "Heute wird es schnell gehen. Sagt Bescheid, wenn ich zu schnell bin – oder zu langsam.", { y: 4.5 });
});

deck.content("Drei Situationen aus dem Berufsalltag", "Praxisbezug", (s, api) => {
  api.lead(s, "In allen drei Fällen entscheidet Netzwerkwissen darüber, ob das Projekt gelingt.");
  api.cardRow(
    s,
    [
      {
        titel: "Filiale anbinden",
        body: "Welches Subnetz? Wie kommt sie sicher an die Zentrale? Wer vergibt die Adressen?",
        icon: D.iconDatei("standort", D.F.blau),
        iconGroesse: 0.44,
      },
      {
        titel: "Anlage ans MES",
        body: "Die Maschine spricht Profinet oder OPC UA, die Auswertung erwartet MQTT. Wer übersetzt?",
        icon: D.iconDatei("anlage", D.F.teal),
        iconGroesse: 0.44,
      },
      {
        titel: "Ab in die Cloud",
        body: "Dieselbe Anwendung, neuer Ort. Latenz, Adressen und Firewall-Regeln ändern sich alle.",
        icon: D.iconDatei("cloud", D.F.bernstein),
        iconGroesse: 0.44,
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
  api.kicker(s, "Wer beide Welten verbindet, muss die Regeln von beiden Seiten kennen.", { y: 4.56 });
});

deck.content("Was in der Ausbildung nicht vorkam", "Der Kern dieser Fortbildung", (s, api) => {
  api.lead(s, "Eure Ausbildung hat euch die Office-IT gegeben. Hier kommt die andere Hälfte dazu.");
  api.cardRow(
    s,
    [
      {
        titel: "Kennt ihr schon",
        body: [
          "OSI und TCP/IP",
          "Subnetting und Routing",
          "DNS, DHCP, VLAN, VPN",
          "Switches, Firewalls",
          "Virtualisierung",
        ],
        akzent: "blau",
      },
      {
        titel: "Kommt neu dazu",
        body: [
          "Profinet, OPC UA, MQTT",
          "Cyber-physische Systeme",
          "Container und Orchestrierung",
          "Verfügbarkeit rechnen, BCM",
          "ISMS und Testmanagement",
        ],
        akzent: "teal",
      },
      {
        titel: "Der eigentliche Sprung",
        body: [
          "Vom Ausführen zum Planen.",
          "Ihr habt Systeme betrieben – jetzt konzipiert, bewertet und verantwortet ihr sie.",
        ],
        akzent: "bernstein",
      },
    ],
    { y: 2.16, h: 2.1, titleH: 0.3, fontSize: 11 }
  );
  api.kicker(s, "Die Netzwerkabende sind der einzige größere Wiederholungsteil. Ab Abend 7 wird es für alle neu.", { y: 4.5 });
});

// ============================================================ Grundbegriffe
deck.abschnitt("Grundbegriffe", "blau");

deck.kapitel("Auffrischung", "Die Begriffe, bei denen es gern auseinandergeht", {
  nummer: "02",
});

deck.content("Topologien – nur die eine Frage", "Kurzcheck", (s, api) => {
  s.addImage({ path: D.topologien(), x: T.RAND, y: 1.72, w: T.INHALT_W, h: 1.95 });
  api.card(s, {
    y: 3.85,
    h: 0.95,
    hell: true,
    titel: "Die Frage, auf die es ankommt",
    body: "Nicht wie es aussieht, sondern was ausfällt. Der Ring ist der Grund, warum die Industrie anders baut als das Büro – dort darf ein einzelner Kabelbruch die Linie nicht anhalten.",
    fontSize: 11.5,
    titleH: 0.26,
  });
});

deck.content("Was fließt eigentlich durch das Netz?", "Dateneinheiten", (s, api) => {
  api.lead(s, "Fünf Namen für dieselben Daten. Der Unterschied ist nur, was drumherum steht.");
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
  s.addImage({ path: D.bandbreiteLatenz(), x: T.RAND, y: 1.78, w: T.INHALT_W, h: 1.75 });
  api.cardRow(
    s,
    [
      { titel: "Jitter", body: "Wie stark die Latenz schwankt. Killt Sprache und Video, nicht Downloads." },
      { titel: "Paketverlust", body: "Was unterwegs verloren geht. TCP holt es nach – das kostet Zeit." },
      { titel: "Der Alltagsfall", body: "„Die Leitung ist zu klein\" stimmt selten. Meist wartet etwas anderes." },
    ],
    { y: 3.66, h: 1.2, titleH: 0.26, fontSize: 11 }
  );
});

// ============================================================ OSI
deck.abschnitt("OSI und TCP/IP", "teal");

deck.kapitel("Schichten denken", "Das wichtigste Werkzeug des ganzen Abends", { nummer: "03" });

deck.content("Warum überhaupt Schichten?", "Grundidee", (s, api) => {
  api.lead(s, "Bekannt – aber die wenigsten benutzen es im Alltag wirklich. Genau darum geht es heute.");
  api.bullets(
    s,
    [
      "Jede Schicht löst ein Problem und nutzt die Schicht darunter.",
      "Jede Schicht ist austauschbar: WLAN statt Kabel ändert nichts an eurer Anwendung.",
      "Fehler lassen sich eingrenzen, statt zu raten. Das ist der Alltagsnutzen.",
      "Auch die Abwehr sitzt schichtweise: Portsicherheit auf 2, Firewall auf 3 und 4, Web-Filter auf 7.",
    ],
    { y: 2.16, h: 1.7, fontSize: 13.5 }
  );
  api.card(s, {
    y: 3.85,
    h: 0.95,
    hell: true,
    titel: "Der Nutzen im Alltag",
    body: "Ein Fehler sitzt immer auf einer bestimmten Schicht. Wer die findet, hört auf zu raten. Das ist der ganze Trick – und der Rest des Abends.",
    fontSize: 11.5,
    titleH: 0.26,
  });
});

deck.content("Die beiden Modelle nebeneinander", "Auffrischung", (s, api) => {
  s.addImage({ path: D.osiTcpip(), x: T.RAND, y: 1.66, w: T.INHALT_W, h: 2.75 });
  api.kicker(s, "Faustregel: OSI zum Erklären, TCP/IP zum Arbeiten. Gerechnet und gemessen wird auf 2, 3 und 4.", { y: 4.56 });
});

deck.content("Kapselung – der Umschlag im Umschlag", "Was mit euren Daten passiert", (s, api) => {
  s.addImage({ path: D.kapselung(), x: T.RAND, y: 1.7, w: T.INHALT_W, h: 2.05 });
  api.card(s, {
    y: 3.92,
    h: 0.88,
    hell: true,
    body: "Deshalb kann ein Router die IP lesen, ohne die Anwendung zu kennen: Er packt nur bis Schicht 3 aus, entscheidet, wohin es weitergeht, und verpackt wieder. Was darin steckt, geht ihn nichts an.",
    fontSize: 11.5,
    akzent: "teal",
  });
});

deck.content("Ein Befehl je Schicht", "Der Werkzeugkasten", (s, api) => {
  s.addImage({ path: D.diagnoseLeiter(), x: T.RAND, y: 1.66, w: T.INHALT_W, h: 2.55 });
  api.card(s, {
    y: 4.22,
    h: 0.6,
    hell: true,
    body: [
      "macOS: ifconfig · arp -a · traceroute · dig",
      "Linux: ip -brief addr · ip neigh · tracepath · resolvectl query",
    ],
    fontSize: 10.5,
    akzent: "teal",
  });
});

// ============================================================ Breakout
deck.abschnitt("Breakout", "bernstein");

deck.kapitel("Der Schichten-Check", "55 Minuten in Gruppen – euer eigener Rechner ist das Labor", {
  nummer: "04",
  akzent: "bernstein",
});

deck.content("Der Auftrag", "Breakout · 55 Minuten", (s, api) => {
  api.lead(s, "Jetzt messt ihr an eurem eigenen Rechner nach, was wir eben zusammen aufgebaut haben. Nichts zu installieren.");
  api.schedule(
    s,
    [
      ["8 min", "Netz-Steckbrief: sechs Werte, jeder auf seine Schicht einsortiert"],
      ["12 min", "Fünf Befehle – und die Frage, was ein Erfolg jeweils beweist"],
      ["20 min", "Fünf Störungen einsortieren. Das ist der Kern, dafür ist Zeit"],
      ["15 min", "Eure Wegverfolgungen nebeneinanderlegen und vergleichen"],
    ],
    { y: 2.14, rowH: 0.4, labelW: 0.95, fontSize: 12, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.86,
    h: 0.96,
    hell: true,
    titel: "Jetzt öffnen – beides braucht ihr gleich im Raum",
    body: [
      "Befehle für alle drei Systeme:   " + LINK_UEBUNG,
      "Ergebnisse eintragen:   " + LINK_DOKUMENT,
    ],
    fontSize: 10,
    titleH: 0.24,
    akzent: "bernstein",
  });
});

deck.content("So arbeitet ihr", "Spielregeln", (s, api) => {
  api.bullets(
    s,
    [
      "Gruppen zu dritt oder viert. Eine Person teilt den Bildschirm, alle tippen bei sich mit.",
      "Öffnet den Link zur Kursseite jetzt, bevor die Räume aufgehen – im Breakout-Raum seht ihr diese Folie nicht mehr.",
      "Sprecher und euer Auswertungsfall stehen fest – bearbeitet trotzdem alle fünf Störungen.",
      "Windows: PowerShell, nicht die Eingabeaufforderung. Test-NetConnection gibt es nur dort.",
      "Wenn es klemmt: in eurem Raum auf „Um Hilfe bitten“ klicken. Dann komme ich rein.",
    ],
    { y: 1.86, h: 2.2, fontSize: 12.5, akzent: "bernstein" }
  );
  api.card(s, {
    y: 3.94,
    h: 0.9,
    titel: "Um 20:25 sind alle wieder hier",
    body: "Schreibt mit. Was nicht im Dokument steht, haben wir nachher nicht.",
    fontSize: 11.5,
    titleH: 0.26,
    akzent: "bernstein",
  });
});

deck.content("Die fünf Störungen", "Breakout · Station 3", (s, api) => {
  api.lead(s, "Zu jedem Fall drei Antworten: Welche Schicht? Welcher Befehl weist es nach? Und was steckt wahrscheinlich dahinter?");
  api.bullets(
    s,
    [
      "Das Netzwerksymbol zeigt ein Kreuz, es steckt kein Kabel.",
      "Der Rechner hat die Adresse 169.254.12.7 und kommt nirgends hin.",
      "ping 8.8.8.8 läuft, ping google.de bringt einen Fehler.",
      "Der Server antwortet auf ping, aber die Webseite lädt nicht.",
      "Alles ist erreichbar, aber quälend langsam.",
    ],
    { y: 2.3, h: 1.9, fontSize: 12.5, numbered: true, akzent: "bernstein" }
  );
  api.kicker(s, "Bei mindestens zweien ist die naheliegende Antwort nicht die vollständige.", { y: 4.4 });
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
      ["1", "Ein Steckbrief – und warum fast alle eine 192.168er-Adresse haben"],
      ["2", "Die fe80::-Adresse, die dabei mit aufgetaucht ist"],
      ["3", "Die fünf Befehle: Was beweist ein Erfolg, was beweist er nicht?"],
      ["4", "Die Störungen: jede Gruppe begründet ihren Fall"],
      ["5", "Erst danach die Auflösung – und die Fälle, bei denen es nicht reicht"],
      ["6", "Wer bei der Kür war: zwei Wegverfolgungen nebeneinander"],
      ["7", "Euer Satz: Was hat euch überrascht?"],
    ],
    { y: 1.8, rowH: 0.38, labelW: 0.45, fontSize: 11.5 }
  );
  api.kicker(s, "Die Begründung zählt mehr als die Antwort. Woran habt ihr die Schicht erkannt?", { y: 4.56 });
});

deck.content("Die Auflösung der fünf Störungen", "Auswertung", (s, api) => {
  tabelle(
    s,
    ["Fall", "Schicht", "Nachweis"],
    [
      ["Kein Kabel", "1", "ipconfig: Medium getrennt"],
      ["169.254.x.x", "Symptom auf 3", "Ursache: kein DHCP erreichbar – oder Schicht 1"],
      ["Nur Name geht nicht", "7 – DNS", "nslookup scheitert, ping auf die IP läuft"],
      ["ping ja, Web nein", "4 oder 7", "Test-NetConnection oder nc -vz auf Port 443"],
      ["Alles langsam", "kein Ausfall", "Zeit und Verlust in der ping-Ausgabe"],
    ],
    { y: 1.78, rowH: 0.42, spalten: [2.3, 2.0], fontSize: 11.5 }
  );
  api.kicker(s, "Von unten nach oben. Die unterste stumme Schicht sagt euch, wo ihr weitersucht – nicht immer, woran es liegt.", { y: 4.5 });
});

// ============================================================ Abschluss
deck.abschnitt("Abschluss", "blau");

deck.content("Das nehmt ihr heute mit", "Kern des Abends", (s, api) => {
  api.bullets(
    s,
    [
      { text: "Dieselben Daten heißen je nach Schicht Frame, Paket oder Segment.", bold: true },
      { text: "Kapselung: nichts wird ersetzt, es kommt nur außen etwas dazu.", bold: true },
      { text: "OSI sieben Schichten, TCP/IP vier. Gearbeitet wird auf 2, 3 und 4.", bold: true },
      { text: "Bandbreite ist nicht Geschwindigkeit. Latenz ist die andere Hälfte.", bold: true },
      { text: "Fehlersuche: von unten nach oben, und jeder Befehl beweist nur seine Schicht.", bold: true },
    ],
    { y: 1.85, h: 2.0, fontSize: 13.5 }
  );
  api.card(s, {
    y: 3.9,
    h: 1.05,
    hell: true,
    titel: "Die Begriffe von heute",
    body: "Schichtenmodell · OSI · TCP/IP · Topologie · Latenz · Bandbreite · Jitter · Frame, Paket, Segment · Kapselung. Die Begriffe begleiten euch bis zum Schluss – im Kurs wie in der Prüfung.",
    fontSize: 11,
    titleH: 0.26,
  });
});

deck.content("Bis Montag", "Nacharbeit", (s, api) => {
  api.lead(s, "Eine Bitte und drei Angebote – die Bitte zuerst.");
  api.cardRow(
    s,
    [
      {
        titel: "Standortbestimmung",
        body: "Das Formular aus dem Chat: gut 20 Minuten, bis Montag. Kein Test – es zeigt mir, wo wir gründlich einsteigen müssen.",
        akzent: "bernstein",
      },
      {
        titel: "Nur wenn etwas hakte",
        body: "„Grundbegriffe“ und „OSI- und TCP/IP-Modell“ stehen auf der Kursseite – für die Stellen, an denen ihr heute gestockt habt.",
      },
      {
        titel: "Nachholen",
        body: "Wer nicht bis zu den Störungen kam: Station 3 lohnt sich. Die Auflösungen stehen zum Aufklappen darunter.",
      },
      {
        titel: "Vorbereiten",
        body: "Montag rechnen wir Subnetze. Papier und Stift reichen – Taschenrechner braucht ihr nicht.",
      },
    ],
    { y: 2.16, h: 2.1, gap: 0.18, titleH: 0.42, fontSize: 10.5, titleSize: 12 }
  );
  api.kicker(s, "Nächster Termin: Montag, 31. August, 18:00 Uhr – Adressierung und Subnetting.", { y: 4.5 });
});

deck.schluss({
  title: "Fragen?",
  subtitle: "Alles von heute steht zum Nachlesen auf der Kursseite – der ganze Netzwerk-Block ist schon online.",
  note: "Montag, 31. August · Adressierung und Subnetting · Papier und Stift mitbringen",
});

// ============================================================ Bauen

deck.save(path.join(__dirname, "dist", "01-netzwerke-grundlagen.pptx")).then((r) => {
  console.log(`Fertig: ${r.file} – ${r.slides} Folien`);
});
