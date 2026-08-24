// Abend 0 – Orientierung und Kennenlernen
// Kurs 26.2B "Geprüfter Berufsspezialist für Systemintegration und Vernetzung"
// Montag, 24.08.2026, 18:00–21:00 Uhr, online
//
// Bauen:  node 00-orientierung.js
// Prüfen: python3 qa.py dist/00-orientierung.pptx

const fs = require("fs");
const path = require("path");
const { createDeck } = require("./lib/theme");

// Foto: liegt es unter assets/jacob.jpg, wird es eingebunden – sonst Platzhalter.
const FOTO = path.join(__dirname, "assets", "jacob.jpg");
const fotoPath = fs.existsSync(FOTO) ? FOTO : null;

const deck = createDeck({
  title: "Orientierung – Systemintegration und Vernetzung 26.2B",
  subject: "Kursstart, Ablauf bis zur IHK-Prüfung, Kennenlernen",
});

const { C } = deck.api;

// ============================================================ 1 Titel
deck.title({
  eyebrow: "Kurs 26.2B · Cloudhelden",
  title: "Herzlich willkommen",
  subtitle: "Geprüfter Berufsspezialist für Systemintegration und Vernetzung",
  note: "Montag, 24. August 2026 · Jacob Menge",
});

// ============================================================ Orientierung
deck.section("Orientierung");

// -------------------------------------------------- 2 Agenda
deck.content("Was uns heute Abend erwartet", "Ablauf", (s, api) => {
  api.lead(s, "Heute geht es noch nicht um Technik, sondern um euch, mich und den Weg bis zur Prüfung.");
  api.schedule(
    s,
    [
      ["18:00", "Ankommen, Technik-Check, Begrüßung"],
      ["18:10", "Wer bin ich – und wofür ihr mich ansprechen könnt"],
      ["18:25", "Wer seid ihr? Kennenlernrunde mit kleinem Spiel"],
      ["19:25", "Pause"],
      ["19:35", "Euer Weg bis zur Prüfung: Module, Meilensteine, Prüfungsformat"],
      ["20:15", "Wie wir zusammenarbeiten: Regeln, Materialien, Kontakte"],
      ["20:40", "Eure Fragen und Ausblick auf Mittwoch"],
    ],
    { y: 2.0, rowH: 0.4 }
  );
  api.kicker(s, "Fragen könnt ihr jederzeit dazwischen stellen – dafür ist der Abend da.", { y: 4.85 });
});

// -------------------------------------------------- 3 Wer bin ich
deck.content("Wer euch durch den Kurs begleitet", "Vorstellung", (s, api) => {
  api.photo(s, {
    x: 0.5,
    y: 1.5,
    w: 2.5,
    h: 2.9,
    path: fotoPath,
    placeholder: "Foto\n(assets/jacob.jpg)",
  });
  s.addText("Jacob Menge", {
    x: 3.25,
    y: 1.5,
    w: 6.25,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 26,
    color: C.title,
    bold: true,
    valign: "top",
    margin: 0,
  });
  s.addText("Freiberuflicher Dozent · DevOps, Cloud und IT-Infrastruktur", {
    x: 3.25,
    y: 2.0,
    w: 6.25,
    h: 0.35,
    fontFace: "Calibri",
    fontSize: 14,
    color: C.accentDark,
    valign: "top",
    margin: 0,
  });
  api.bullets(
    s,
    [
      "PLATZHALTER: beruflicher Hintergrund – wo du herkommst, was du gemacht hast",
      "PLATZHALTER: womit du heute arbeitest, welche Themen dich reizen",
      "PLATZHALTER: seit wann du unterrichtest und was dir dabei wichtig ist",
      "PLATZHALTER: etwas Privates – Hobby, Region, was dich ausmacht",
    ],
    { x: 3.25, y: 2.5, w: 6.25, h: 1.9, fontSize: 13, color: C.muted }
  );
  api.kicker(s, "jacob-decoded.de", { y: 4.5, italic: false, fontSize: 13 });
});

// -------------------------------------------------- 4 Ansprechbar
deck.content("Wofür ihr mich ansprechen könnt", "Meine Rolle", (s, api) => {
  api.lead(s, "Ich unterrichte den fachlichen Schwerpunkt – die Spezialisierung Systemintegration und Vernetzung.");
  api.cardRow(
    s,
    [
      {
        title: "Fachlich",
        tint: "accent",
        body: "Alles rund um Netzwerke, Virtualisierung, Container, Betrieb, Monitoring und IT-Sicherheit. Fragt lieber einmal zu viel als zu wenig.",
      },
      {
        title: "Zur Prüfung",
        tint: "accent",
        body: "Was drankommt, wie die Aufgaben aussehen, worauf ihr beim Lernen achten solltet und wie ihr euer Präsentationsthema findet.",
      },
      {
        title: "Wenn es hakt",
        tint: "accent",
        body: "Wenn ihr im Stoff hängt, etwas verpasst habt oder das Tempo nicht passt: sagt Bescheid. Ich kann nur nachsteuern, wenn ich es weiß.",
      },
    ],
    { y: 2.1, h: 2.3, fontSize: 12 }
  );
  api.kicker(s, "Organisatorisches läuft über Cloudhelden – dazu später mehr.", { y: 4.6 });
});

// ============================================================ Kennenlernen
deck.section("Kennenlernen");

deck.divider("Und wer seid ihr?", "Die nächste Stunde gehört euch");

// -------------------------------------------------- 6 Steckbrief
deck.content("Kurz vorstellen – in eurem Tempo", "Kennenlernrunde", (s, api) => {
  api.lead(s, "Nehmt euch zwei bis drei Minuten. Diese vier Punkte reichen völlig aus:");
  api.bullets(
    s,
    [
      "Wie heißt du und wo sitzt du gerade?",
      "Was machst du beruflich – und wie sieht dein IT-Alltag aus?",
      "Wie viel Berührung hattest du bisher mit Netzwerken, Servern oder Cloud?",
      "Warum machst du diesen Kurs – was willst du danach können?",
    ],
    { y: 2.0, h: 2.0, fontSize: 16, numbered: true }
  );
  api.card(s, {
    y: 4.1,
    h: 0.75,
    tint: "accent",
    body: "Es gibt keine falschen Antworten. Manche kommen aus der IT, andere steigen gerade erst ein – beides ist genau richtig hier.",
    fontSize: 12,
  });
});

// -------------------------------------------------- 7 Spiel
deck.content("Zwei Wahrheiten, eine Lüge", "Kennenlernspiel", (s, api) => {
  api.lead(s, "Damit es nicht bei einer reinen Vorstellungsrunde bleibt: Hängt drei Aussagen über euch an – zwei stimmen, eine ist erfunden. Die anderen raten.");
  api.cardRow(
    s,
    [
      {
        title: "So läuft es",
        tint: "plain",
        body: [
          "1. Du nennst drei Aussagen über dich.",
          "2. Die Gruppe rät, welche gelogen ist.",
          "3. Du löst auf.",
          "",
          "Gern aus der IT – muss aber nicht.",
        ],
      },
      {
        title: "Zum Beispiel",
        tint: "good",
        body: [
          "„Ich habe schon mal ein Rechenzentrum von innen gesehen.\"",
          "",
          "„Mein erster Computer hatte noch ein Diskettenlaufwerk.\"",
          "",
          "„Ich habe einmal aus Versehen einen Produktivserver gelöscht.\"",
        ],
        fontSize: 11,
      },
    ],
    { y: 2.25, h: 2.25, fontSize: 12 }
  );
  api.kicker(s, "Wer lieber nur den Steckbrief macht, lässt das Spiel einfach weg – alles freiwillig.", { y: 4.7 });
});

// ============================================================ Der Weg
deck.section("Der Weg bis zur Prüfung");

deck.divider("Wo führt das alles hin?", "Euer Weg bis zum 18. März 2027");

// -------------------------------------------------- 9 Der Abschluss
deck.content("Was ihr am Ende in der Hand habt", "Der Abschluss", (s, api) => {
  api.lead(s, "„Geprüfter Berufsspezialist für Systemintegration und Vernetzung\" – ein bundesweit anerkannter IHK-Fortbildungsabschluss.");
  api.cardRow(
    s,
    [
      {
        title: "DQR-Niveau 5",
        tint: "accent",
        body: "Erste Stufe der höherqualifizierenden Berufsbildung – aufbauend auf eurer Ausbildung oder Berufserfahrung.",
      },
      {
        title: "Seit November 2024",
        tint: "accent",
        body: "Ein noch junger Abschluss. Die Verordnung dazu ist am 1. November 2024 in Kraft getreten.",
      },
      {
        title: "Rund 400 Stunden",
        tint: "accent",
        body: "So viel Lernumfang sieht die Verordnung insgesamt vor – Kurszeit und eure eigene Vorbereitung zusammen.",
      },
    ],
    { y: 2.15, h: 2.0, fontSize: 12 }
  );
  api.kicker(s, "Ihr weist damit nach, dass ihr Systeme eigenständig planen, integrieren und betreiben könnt.", { y: 4.4 });
});

// -------------------------------------------------- 10 Drei Schwerpunkte
deck.content("Der Kurs besteht aus drei Teilen", "Aufbau", (s, api) => {
  api.lead(s, "Zwei davon unterrichtet ein Kollege oder eine Kollegin – ihr habt also nicht nur mich.");
  api.cardRow(
    s,
    [
      {
        title: "Spezialisierung",
        tint: "accent",
        body: [
          "Planung und Integration",
          "Laufender Betrieb",
          "Qualität und IT-Sicherheit",
          "",
          "Das machen wir zusammen – der größte Teil des Kurses.",
        ],
      },
      {
        title: "IT-Recht",
        tint: "plain",
        body: [
          "Organisatorische und rechtliche Vorgaben",
          "",
          "Datenschutz, Verträge, Compliance.",
          "",
          "Von einem anderen Dozenten.",
        ],
      },
      {
        title: "Projektmanagement",
        tint: "plain",
        body: [
          "Projektunterstützung und -koordination",
          "",
          "Planung, Kalkulation, Controlling.",
          "",
          "Ebenfalls separat.",
        ],
      },
    ],
    { y: 2.1, h: 2.5, fontSize: 11.5 }
  );
});

// -------------------------------------------------- 11 Unser Teil
deck.content("Unser gemeinsamer Teil", "Die Spezialisierung", (s, api) => {
  api.lead(s, "Drei Handlungsbereiche, die aufeinander aufbauen – vom Planen über das Betreiben bis zum Absichern.");
  api.cardRow(
    s,
    [
      {
        title: "1 · Planen und integrieren",
        tint: "accent",
        body: "Netzwerke, Virtualisierung, Container, Architekturen, Speicher, Ressourcen und Lizenzen. Wie entsteht eine Infrastruktur?",
      },
      {
        title: "2 · Betrieb sicherstellen",
        tint: "accent",
        body: "Ausfallsicherheit, Backup und Wiederanlauf, Monitoring, Betriebsdaten, Softwareverteilung und Automatisierung.",
      },
      {
        title: "3 · Qualität und Sicherheit",
        tint: "accent",
        body: "Risiken bewerten, Sicherheitskonzepte, Umgang mit Vorfällen, Tests, Optimierung und die Übergabe an Anwender.",
      },
    ],
    { y: 2.05, h: 2.4, fontSize: 12, titleH: 0.55 }
  );
  api.kicker(s, "Viel davon üben wir praktisch – an echten Systemen, nicht nur auf Folien.", { y: 4.6 });
});

// -------------------------------------------------- 12 Zeitstrahl
deck.content("Der grobe Fahrplan", "Zeitplan", (s, api) => {
  api.lead(s, "Der genaue Themenplan steht noch nicht fest – der Rahmen aber schon:");
  api.timeline(
    s,
    [
      { label: "Aug 2026", sub: "Start\nGrundlagen" },
      { label: "Herbst", sub: "Planung und\nIntegration" },
      { label: "Winter", sub: "Betrieb und\nSicherheit" },
      { label: "Feb 2027", sub: "Wiederholung\nProbeaufgaben" },
      { label: "März 2027", sub: "Prüfungs-\nvorbereitung" },
      { label: "18.03.2027", sub: "Schriftliche\nPrüfung" },
    ],
    { y: 2.75 }
  );
  api.card(s, {
    y: 4.05,
    h: 0.8,
    tint: "warn",
    body: "Vor der schriftlichen Prüfung gibt es zusätzlich eine freiwillige, intensive Prüfungsvorbereitung. Die Teilnahme lohnt sich.",
    fontSize: 12,
  });
});

// -------------------------------------------------- 13 Schriftliche Prüfung
deck.content("Die schriftliche Prüfung", "18. März 2027", (s, api) => {
  api.lead(s, "Keine Wissensabfrage, sondern ein Fall aus dem Betrieb, den ihr durchdenkt und löst.");
  api.bullets(
    s,
    [
      "Grundlage ist die Beschreibung einer betrieblichen Situation.",
      "Daraus werden zwei Aufgaben abgeleitet – je mindestens 90 Minuten, zusammen höchstens 240 Minuten.",
      "Jede Aufgabe berührt alle fünf Themenschwerpunkte – auch Recht und Projektmanagement.",
      "Ihr entwickelt eigene Lösungen und begründet sie. Es gibt selten nur einen richtigen Weg.",
    ],
    { y: 2.0, h: 2.0, fontSize: 15 }
  );
  api.card(s, {
    y: 4.1,
    h: 0.75,
    tint: "accent",
    body: "Deshalb arbeiten wir im Kurs viel mit Szenarien: „Ein Betrieb hat folgendes Problem – was schlagt ihr vor?\"",
    fontSize: 12,
  });
});

// -------------------------------------------------- 14 Mündliche Prüfung
deck.content("Die mündliche Prüfung", "Danach", (s, api) => {
  api.lead(s, "Sie besteht aus zwei Teilen und folgt auf die schriftliche Prüfung.");
  api.cardRow(
    s,
    [
      {
        title: "Präsentation · max. 15 Minuten",
        tint: "accent",
        body: [
          "Thema wählt ihr selbst.",
          "Es muss alle fünf Schwerpunkte berühren.",
          "",
          "Wichtig: Das Thema muss spätestens am Tag der schriftlichen Prüfung eingereicht sein.",
        ],
      },
      {
        title: "Fachgespräch · max. 30 Minuten",
        tint: "accent",
        body: [
          "Direkt im Anschluss.",
          "Fragen zu Hintergründen, Vorgehen und euren Vorschlägen.",
          "",
          "Zählt doppelt so stark wie die Präsentation.",
        ],
      },
    ],
    { y: 2.1, h: 2.3, fontSize: 12, titleH: 0.32 }
  );
  api.kicker(s, "Wir suchen euer Präsentationsthema rechtzeitig gemeinsam – ihr steht damit nicht allein da.", { y: 4.55 });
});

// -------------------------------------------------- 15 Bestehen
deck.content("Was zum Bestehen zählt", "Bewertung", (s, api) => {
  api.lead(s, "Jede einzelne Leistung braucht mindestens 50 von 100 Punkten – ein starkes Ergebnis gleicht ein schwaches nicht aus.");
  api.cardRow(
    s,
    [
      {
        title: "Vier Einzelleistungen",
        tint: "plain",
        body: [
          "Schriftliche Aufgabe 1",
          "Schriftliche Aufgabe 2",
          "Präsentation",
          "Fachgespräch",
        ],
      },
      {
        title: "Die Gesamtnote",
        tint: "plain",
        body: [
          "Schriftlich und mündlich zählen je zur Hälfte.",
          "",
          "50 Punkte entsprechen der Note 4,4 – 100 Punkte der Note 1,0.",
        ],
      },
      {
        title: "Falls es knapp wird",
        tint: "warn",
        body: [
          "Liegt genau eine schriftliche Aufgabe unter 50 Punkten, gibt es eine mündliche Ergänzungsprüfung.",
          "",
          "Einzelne Leistungen dürfen wiederholt werden.",
        ],
      },
    ],
    { y: 2.15, h: 2.4, fontSize: 11.5 }
  );
});

// ============================================================ Zusammenarbeit
deck.section("Zusammenarbeit");

deck.divider("Wie wir zusammenarbeiten", "Ein paar Absprachen für die nächsten Monate");

// -------------------------------------------------- 17 Regeln
deck.content("Der Rahmen", "Kursregeln", (s, api) => {
  api.bullets(
    s,
    [
      { text: "Live über Google Meet, montags und mittwochs von 18 bis 21 Uhr." },
      { text: "Der Unterricht wird nicht aufgezeichnet – seid also möglichst dabei." },
      { text: "Für das Aufstiegs-BAföG braucht ihr eine Teilnahmequote von über 70 Prozent." },
      { text: "Ihr müsst euch nicht abmelden – behaltet nur eure Quote im Blick." },
      { text: "Fragen sind ausdrücklich erwünscht, und wir gehen respektvoll miteinander um." },
    ],
    { y: 1.7, h: 2.6, fontSize: 15.5 }
  );
  api.card(s, {
    y: 4.35,
    h: 0.6,
    tint: "good",
    body: "Wenn ich einmal ausfalle, erfahrt ihr das rechtzeitig über Cloudhelden.",
    fontSize: 12,
  });
});

// -------------------------------------------------- 18 Kameras
deck.content("Zwei Bitten an euch", "Miteinander", (s, api) => {
  api.cardRow(
    s,
    [
      {
        title: "Kamera an, wenn es geht",
        tint: "accent",
        body: [
          "Online zu unterrichten ist wie ein Vortrag in einen dunklen Raum, wenn niemand zu sehen ist.",
          "",
          "Ich sehe an euren Gesichtern, ob etwas angekommen ist – und kann sonst nicht nachsteuern.",
          "",
          "Wenn es mal nicht passt: auch okay.",
        ],
      },
      {
        title: "Meldet euch",
        tint: "accent",
        body: [
          "Unterbrecht mich, wenn etwas unklar ist. Wer fragt, hilft meist der halben Gruppe mit.",
          "",
          "Nutzt gern den Chat, wenn euch das leichter fällt.",
          "",
          "„Ich hab's nicht verstanden\" ist ein vollständiger Satz.",
        ],
      },
    ],
    { y: 1.75, h: 2.8, fontSize: 12 }
  );
});

// -------------------------------------------------- 19 Materialien
deck.content("Womit ihr lernt", "Materialien", (s, api) => {
  api.cardRow(
    s,
    [
      {
        title: "Die Folien",
        tint: "plain",
        body: [
          "Führen durch den Abend.",
          "",
          "Ihr bekommt sie zum Nacharbeiten.",
        ],
      },
      {
        title: "Die Kursunterlagen",
        tint: "accent",
        body: [
          "Eine Webseite mit allem im Detail: Erklärungen, Befehle, Übungen mit Lösungen, Glossar.",
          "",
          "Dort steht das, was auf den Folien keinen Platz hat.",
        ],
      },
      {
        title: "Die Akademie",
        tint: "plain",
        body: [
          "akademie.cloudhelden.org",
          "",
          "Die Lernplattform von Cloudhelden mit zusätzlichem Material.",
        ],
      },
    ],
    { y: 1.75, h: 2.5, fontSize: 12 }
  );
  api.kicker(s, "Den Link zu den Kursunterlagen bekommt ihr gleich im Anschluss.", { y: 4.5 });
});

// -------------------------------------------------- 20 Kontakt
deck.content("Wenn etwas ist", "Kontakt", (s, api) => {
  api.lead(s, "Zwei Wege – je nachdem, worum es geht:");
  api.cardRow(
    s,
    [
      {
        title: "Fachliche Fragen",
        tint: "accent",
        body: [
          "An mich, am besten direkt im Unterricht.",
          "",
          "Wir haben zweimal pro Woche Zeit – nutzt sie.",
        ],
      },
      {
        title: "Alles Organisatorische",
        tint: "good",
        body: [
          "beratung@cloudhelden.org",
          "",
          "Zugänge, Termine, BAföG, Prüfungsanmeldung, persönliche Anliegen.",
        ],
      },
    ],
    { y: 2.1, h: 2.2, fontSize: 12.5 }
  );
  api.kicker(s, "Schreibt lieber einmal zu früh als zu spät – gerade bei Formalien.", { y: 4.5 });
});

// -------------------------------------------------- 21 Mittwoch
deck.content("Am Mittwoch geht es richtig los", "Ausblick", (s, api) => {
  api.lead(s, "Mittwoch, 26. August, 18 Uhr – erster Fachabend.");
  api.card(s, {
    y: 2.0,
    h: 1.35,
    tint: "accent",
    title: "Wir starten mit dem Fundament: Netzwerke",
    body: "Ohne Netzwerk kein Server, keine Cloud, kein Container. Deshalb fangen wir dort an – und bauen darauf alles Weitere auf.",
    fontSize: 13,
  });
  api.bullets(
    s,
    [
      "Bringt nichts weiter mit als euren Rechner.",
      "Software installieren wir gemeinsam, wenn wir sie brauchen.",
      "Wer mag, schaut vorher schon in die Kursunterlagen – Pflicht ist das nicht.",
    ],
    { y: 3.5, h: 1.1, fontSize: 14 }
  );
});

// -------------------------------------------------- 22 Fragen
deck.blank((s, api) => {
  api.statement(s, "Was möchtet ihr noch wissen?", { y: 1.75, h: 1.1, fontSize: 34 });
  s.addText("Alles darf gefragt werden – zum Kurs, zur Prüfung, zu mir.", {
    x: 0.8,
    y: 3.05,
    w: 8.4,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 16,
    color: C.muted,
    align: "center",
    valign: "top",
    margin: 0,
  });
  s.addText("Schön, dass ihr da seid. Bis Mittwoch!", {
    x: 0.8,
    y: 4.0,
    w: 8.4,
    h: 0.5,
    fontFace: "Calibri",
    fontSize: 18,
    color: C.accentDark,
    bold: true,
    align: "center",
    valign: "top",
    margin: 0,
  });
});

// ============================================================ speichern
const outDir = path.join(__dirname, "dist");
fs.mkdirSync(outDir, { recursive: true });

deck.save(path.join(outDir, "00-orientierung.pptx")).then((r) => {
  console.log(`OK  ${r.slides} Folien (${r.numbered} nummeriert)  ->  ${r.file}`);
  if (!fotoPath) {
    console.log("Hinweis: assets/jacob.jpg fehlt – auf Folie 3 steht ein Platzhalter.");
  }
});
