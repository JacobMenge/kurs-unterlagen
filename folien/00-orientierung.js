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
      ["18:25", "Blitzrunde: alle einmal kurz"],
      ["18:40", "Kleingruppen: richtig kennenlernen"],
      ["19:00", "Zurück im Plenum, danach Pause"],
      ["19:25", "Euer Weg bis zur Prüfung: Ablauf und Prüfungsformat"],
      ["20:10", "Wie wir zusammenarbeiten: Regeln, Materialien, Kontakte"],
      ["20:40", "Eure Fragen und Ausblick auf Mittwoch"],
    ],
    { y: 1.9, rowH: 0.35 }
  );
  api.kicker(s, "Fragen könnt ihr jederzeit dazwischen stellen – dafür ist der Abend da.", { y: 4.78 });
});

// -------------------------------------------------- 3 Wer bin ich
deck.content("Wer euch durch den Kurs begleitet", "Vorstellung", (s, api) => {
  api.photo(s, {
    x: 0.5,
    y: 1.45,
    w: 2.35,
    h: 2.35,
    path: fotoPath,
    placeholder: "Foto\n(assets/jacob.jpg)",
  });
  s.addText("Jacob Menge", {
    x: 3.1,
    y: 1.42,
    w: 6.4,
    h: 0.45,
    fontFace: "Calibri",
    fontSize: 26,
    color: C.title,
    bold: true,
    valign: "top",
    margin: 0,
  });
  s.addText("IT-Dozent · DevOps, Cloud und Linux", {
    x: 3.1,
    y: 1.88,
    w: 6.4,
    h: 0.3,
    fontFace: "Calibri",
    fontSize: 14,
    color: C.accentDark,
    valign: "top",
    margin: 0,
  });
  api.bullets(
    s,
    [
      "Informatik studiert in Bremerhaven, erst Software-Entwicklung in der Forschung – am Alfred-Wegener-Institut und im KI-Transfer-Zentrum.",
      "Seit 2023 in der IT-Weiterbildung: erst als Trainer, heute freiberuflich. Schwerpunkte AWS und Azure, Container, CI/CD und Linux.",
      "Ausbildereignung (AEVO) und AWS-zertifiziert. Habe selbst IHK-Prüfungen konzipiert, abgenommen und Teilnehmende darauf vorbereitet.",
    ],
    { x: 3.1, y: 2.28, w: 6.4, h: 1.55, fontSize: 12.5, color: C.body, spaceAfter: 7 }
  );
  api.card(s, {
    x: 0.5,
    y: 3.88,
    w: 9.0,
    h: 1.06,
    tint: "plain",
    title: "Außerhalb der IT",
    titleH: 0.28,
    body: "Krav Maga, so oft es geht. Ich wohne mit meinen besten Freunden zusammen in einem Haus. Und ich mache kurze Videos über Dinge, die mich gerade faszinieren – meist aus Wissenschaft und Forschung.",
    fontSize: 12,
  });
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

deck.divider("Und wer seid ihr?", "In drei Schritten – erst kurz, dann in Ruhe");

// -------------------------------------------------- 6 Blitzrunde
deck.content("Erst eine schnelle Runde", "Schritt 1 · etwa 15 Minuten", (s, api) => {
  api.lead(s, "Wir sind über zwanzig – deshalb halten wir es hier bewusst kurz. Ein Satz pro Person genügt:");
  api.card(s, {
    y: 2.05,
    h: 1.05,
    tint: "accent",
    body: "„Ich bin … , ich sitze in … , und ich arbeite als … \"",
    fontSize: 20,
  });
  api.bullets(
    s,
    [
      "Rund 30 Sekunden pro Person – alles Weitere kommt gleich in den Kleingruppen.",
      "Schreibt euren Namen gern zusätzlich in den Chat, dann kann ich ihn mir merken.",
    ],
    { y: 3.35, h: 1.0, fontSize: 14 }
  );
  api.kicker(s, "Keine Sorge: Wer nichts sagen möchte, sagt einfach nur den Namen.", { y: 4.5 });
});

// -------------------------------------------------- 7 Breakouts
deck.content("Dann in Kleingruppen", "Schritt 2 · etwa 20 Minuten", (s, api) => {
  api.lead(s, "Ich teile euch in Gruppen zu viert oder fünft auf. Dort habt ihr Zeit, euch richtig kennenzulernen.");
  api.cardRow(
    s,
    [
      {
        title: "Erzählt euch gegenseitig",
        tint: "plain",
        titleH: 0.32,
        body: [
          "Wie sieht dein IT-Alltag aus?",
          "",
          "Wie viel hattest du bisher mit Netzwerken, Servern oder Cloud zu tun?",
          "",
          "Warum machst du diesen Kurs?",
        ],
      },
      {
        title: "Und dann: zwei Wahrheiten, eine Lüge",
        tint: "good",
        titleH: 0.32,
        body: [
          "Jede Person nennt drei Aussagen über sich – zwei stimmen, eine ist erfunden.",
          "",
          "Die anderen raten. Danach wird aufgelöst.",
        ],
      },
    ],
    { y: 2.1, h: 2.3, fontSize: 12 }
  );
  api.kicker(s, "Sucht euch eine Person, die nachher kurz berichtet, was euch überrascht hat.", { y: 4.55 });
});

// -------------------------------------------------- 8 Rückkehr
deck.content("Und wieder zusammen", "Schritt 3 · etwa 10 Minuten", (s, api) => {
  api.lead(s, "Jede Gruppe erzählt kurz:");
  api.bullets(
    s,
    [
      "Was hat euch in eurer Gruppe am meisten überrascht?",
      "Gab es eine Lüge, die wirklich niemand durchschaut hat?",
      "Habt ihr etwas gemeinsam, das ihr nicht erwartet hättet?",
    ],
    { y: 2.05, h: 1.6, fontSize: 16 }
  );
  api.card(s, {
    y: 3.8,
    h: 1.05,
    tint: "accent",
    title: "Warum mir das wichtig ist",
    titleH: 0.28,
    body: "Wir sehen uns bis März zweimal pro Woche. Wer sich kennt, traut sich eher zu fragen – und genau davon lebt der Unterricht.",
    fontSize: 12.5,
  });
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
