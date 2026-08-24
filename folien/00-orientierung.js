// Abend 0 – Orientierung und Kennenlernen
//
// Bauen:   node 00-orientierung.js
// Prüfen:  ../.venv/bin/python qa.py dist/00-orientierung.pptx
// Ansehen: ../.venv/bin/python vorschau.py dist/00-orientierung.pptx

const fs = require("fs");
const path = require("path");
const { createDeck } = require("./lib/theme");

// Foto: liegt es unter assets/jacob.jpg, wird es eingebunden – sonst Platzhalter.
const FOTO = path.join(__dirname, "assets", "jacob.jpg");
const fotoPath = fs.existsSync(FOTO) ? FOTO : null;

const deck = createDeck({
  title: "Orientierung – Systemintegration und Vernetzung",
  subject: "Kursstart, Weg bis zur Prüfung, Kennenlernen",
  akzent: "gruen",
});

const { C } = deck.api;

// ============================================================ Titel
deck.title({
  eyebrow: "Kursstart",
  title: "Herzlich willkommen",
  subtitle: "Geprüfter Berufsspezialist für Systemintegration und Vernetzung",
  note: "Orientierungsabend",
});

// ============================================================ Orientierung
deck.abschnitt("Orientierung", "gruen");

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
      ["19:25", "Euer Weg bis zur Prüfung"],
      ["20:10", "Wie wir zusammenarbeiten"],
      ["20:40", "Eure Fragen und Ausblick"],
    ],
    { y: 2.16, rowH: 0.285 }
  );
  api.kicker(s, "Fragen könnt ihr jederzeit dazwischen stellen – dafür ist der Abend da.", { y: 4.46 });
});

deck.content("Wer euch durch den Kurs begleitet", "Vorstellung", (s, api) => {
  api.photo(s, {
    x: 0.62,
    y: 1.62,
    w: 2.15,
    h: 2.15,
    path: fotoPath,
    placeholder: "Foto\nassets/jacob.jpg",
  });
  s.addText("Jacob Menge", {
    x: 3.05, y: 1.5, w: 6.3, h: 0.46,
    fontFace: "Arial", fontSize: 25, color: C.textStark, bold: true,
    valign: "top", margin: 0,
  });
  s.addText("IT-Dozent · DevOps, Cloud und Linux", {
    x: 3.05, y: 2.02, w: 6.3, h: 0.3,
    fontFace: "Courier New", fontSize: 11, color: C.gruen,
    valign: "top", margin: 0,
  });
  api.bullets(
    s,
    [
      "Informatik in Bremerhaven studiert, davor Software-Entwicklung in der Forschung – am Alfred-Wegener-Institut und im KI-Transfer-Zentrum.",
      "Seit 2023 in der IT-Weiterbildung, heute freiberuflich. Schwerpunkte: AWS und Azure, Container, CI/CD und Linux.",
      "Ausbildereignung (AEVO) und AWS-zertifiziert. Ich habe selbst IHK-Prüfungen konzipiert, abgenommen und Teilnehmende vorbereitet.",
    ],
    { x: 3.05, y: 2.56, w: 6.3, h: 1.42, fontSize: 11.5, spaceAfter: 8 }
  );
  api.card(s, {
    x: 0.62, y: 4.06, w: 8.76, h: 0.72,
    body: [
      "Neben der IT: Krav Maga, so oft es geht. Ich wohne mit meinen besten Freunden in einem Haus.",
      "Außerdem mache ich kurze Videos über Themen, die mich gerade faszinieren.",
    ],
    fontSize: 11,
  });
});

deck.content("Wofür ihr mich ansprechen könnt", "Meine Rolle", (s, api) => {
  api.lead(s, "Ich unterrichte den fachlichen Schwerpunkt – die Spezialisierung Systemintegration und Vernetzung.");
  api.cardRow(
    s,
    [
      {
        titel: "Fachlich",
        body: "Netzwerke, Virtualisierung, Container, Betrieb, Monitoring und IT-Sicherheit. Fragt lieber einmal zu viel als zu wenig.",
      },
      {
        titel: "Zur Prüfung",
        body: "Was drankommt, wie die Aufgaben aussehen, worauf ihr beim Lernen achten solltet und wie ihr euer Präsentationsthema findet.",
      },
      {
        titel: "Wenn es hakt",
        body: "Wenn ihr im Stoff hängt, etwas verpasst habt oder das Tempo nicht passt: sagt Bescheid. Ich kann nur nachsteuern, wenn ich es weiß.",
      },
    ],
    { y: 2.16, h: 2.05 }
  );
  api.kicker(s, "Organisatorisches läuft über Cloudhelden – dazu später mehr.", { y: 4.5 });
});

// ============================================================ Kennenlernen
deck.abschnitt("Kennenlernen", "amber");

deck.kapitel("Und wer seid ihr?", "In drei Schritten – erst kurz, dann in Ruhe", {
  nummer: "01",
});

deck.content("Erst eine schnelle Runde", "Schritt 1 · etwa 15 Minuten", (s, api) => {
  api.lead(s, "Wir sind über zwanzig – deshalb halten wir es hier bewusst kurz. Ein Satz pro Person genügt:");
  api.card(s, {
    y: 2.16,
    h: 0.9,
    hell: true,
    body: "„Ich bin … , ich sitze in … , und ich arbeite als … \"",
    fontSize: 19,
  });
  api.bullets(
    s,
    [
      "Rund 30 Sekunden pro Person – alles Weitere kommt gleich in den Kleingruppen.",
      "Schreibt euren Namen gern zusätzlich in den Chat, dann kann ich ihn mir merken.",
    ],
    { y: 3.22, h: 0.95, fontSize: 13 }
  );
  api.kicker(s, "Wer nichts sagen möchte, sagt einfach nur den Namen.", { y: 4.5 });
});

deck.content("Dann in Kleingruppen", "Schritt 2 · etwa 20 Minuten", (s, api) => {
  api.lead(s, "Ich teile euch in Gruppen zu viert oder fünft auf. Dort habt ihr Zeit, euch richtig kennenzulernen.");
  api.cardRow(
    s,
    [
      {
        titel: "Erzählt euch gegenseitig",
        body: [
          "Wie sieht dein IT-Alltag aus?",
          "Wie viel hattest du bisher mit Netzwerken, Servern oder Cloud zu tun?",
          "Warum machst du diesen Kurs?",
        ],
      },
      {
        titel: "Und dann: zwei Wahrheiten, eine Lüge",
        body: [
          "Jede Person nennt drei Aussagen über sich – zwei stimmen, eine ist erfunden.",
          "Die anderen raten. Danach wird aufgelöst.",
        ],
      },
    ],
    { y: 2.16, h: 2.02, titleH: 0.3 }
  );
  api.kicker(s, "Sucht euch eine Person, die nachher kurz berichtet, was euch überrascht hat.", { y: 4.5 });
});

deck.content("Und wieder zusammen", "Schritt 3 · etwa 10 Minuten", (s, api) => {
  api.lead(s, "Jede Gruppe erzählt kurz:");
  api.bullets(
    s,
    [
      "Was hat euch in eurer Gruppe am meisten überrascht?",
      "Gab es eine Lüge, die wirklich niemand durchschaut hat?",
      "Habt ihr etwas gemeinsam, das ihr nicht erwartet hättet?",
    ],
    { y: 2.16, h: 1.35, fontSize: 15 }
  );
  api.card(s, {
    y: 3.5,
    h: 1.02,
    titel: "Warum mir das wichtig ist",
    body: "Wir sehen uns bis zur Prüfung zweimal pro Woche. Wer sich kennt, traut sich eher zu fragen – und genau davon lebt der Unterricht.",
    fontSize: 11.5,
  });
});

// ============================================================ Der Weg
deck.abschnitt("Der Weg zur Prüfung", "cyan");

deck.kapitel("Wo führt das alles hin?", "Der Weg bis zur Prüfung", { nummer: "02" });

deck.content("Was ihr am Ende in der Hand habt", "Der Abschluss", (s, api) => {
  api.lead(s, "Ein bundesweit anerkannter IHK-Fortbildungsabschluss.");
  api.kennzahl(s, {
    x: 0.62, y: 2.16, w: 2.6, zahl: "DQR 5", fontSize: 32,
    label: "Erste Stufe der höher-\nqualifizierenden Berufsbildung",
  });
  api.kennzahl(s, {
    x: 3.55, y: 2.16, w: 2.6, zahl: "400+", fontSize: 32,
    label: "Stunden Lernumfang laut Verordnung –\nKurs und Selbststudium zusammen",
  });
  api.kennzahl(s, {
    x: 6.5, y: 2.16, w: 2.9, zahl: "5", fontSize: 32,
    label: "Qualifikationsschwerpunkte,\ndie in der Prüfung vorkommen",
  });
  api.kicker(s, "Ihr weist nach, dass ihr Systeme eigenständig planen, integrieren und betreiben könnt.", { y: 4.5 });
});

deck.content("Der Kurs besteht aus drei Teilen", "Aufbau", (s, api) => {
  api.lead(s, "Zwei davon unterrichtet eine andere Lehrkraft – ihr habt also nicht nur mich.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Spezialisierung",
        body: [
          "Planung und Integration",
          "Laufender Betrieb",
          "Qualität und IT-Sicherheit",
          "Das machen wir zusammen.",
        ],
      },
      {
        nummer: "2",
        titel: "IT-Recht",
        akzent: "amber",
        body: [
          "Organisatorische und rechtliche Vorgaben",
          "",
          "Datenschutz, Verträge, Compliance.",
        ],
      },
      {
        nummer: "3",
        titel: "Projektmanagement",
        akzent: "cyan",
        body: [
          "Projektunterstützung und -koordination",
          "",
          "Planung, Kalkulation, Controlling.",
        ],
      },
    ],
    { y: 2.16, h: 2.2, fontSize: 11, titleH: 0.32, titleSize: 12.5 }
  );
  api.kicker(s, "In der Prüfung kommen alle drei vor – auch Recht und Projektmanagement.", { y: 4.5 });
});

deck.content("Unser gemeinsamer Teil", "Die Spezialisierung", (s, api) => {
  api.lead(s, "Drei Themen, die aufeinander aufbauen – vom Planen über das Betreiben bis zum Absichern.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Planen und integrieren",
        body: "Netzwerke, Virtualisierung, Container, Architekturen, Speicher, Ressourcen und Lizenzen. Wie entsteht eine Infrastruktur?",
      },
      {
        nummer: "2",
        titel: "Betrieb sicherstellen",
        akzent: "amber",
        body: "Ausfallsicherheit, Backup und Wiederanlauf, Monitoring, Betriebsdaten, Softwareverteilung und Orchestrierung.",
      },
      {
        nummer: "3",
        titel: "Qualität und Sicherheit",
        akzent: "cyan",
        body: "Risiken bewerten, Sicherheitskonzepte, Umgang mit Vorfällen, Tests, Optimierung und die Übergabe an Anwender.",
      },
    ],
    { y: 2.16, h: 2.1, fontSize: 11, titleH: 0.48, titleSize: 12 }
  );
  api.kicker(s, "Viel davon üben wir praktisch – an echten Systemen, nicht nur auf Folien.", { y: 4.5 });
});

deck.content("Der grobe Fahrplan", "Zeitplan", (s, api) => {
  api.lead(s, "Der genaue Themenplan entsteht unterwegs – der Rahmen steht aber schon:");
  api.timeline(
    s,
    [
      { label: "START", sub: "Grundlagen" },
      { label: "THEMA 1", sub: "Planung und\nIntegration" },
      { label: "THEMA 2", sub: "Laufender\nBetrieb" },
      { label: "THEMA 3", sub: "Qualität und\nSicherheit" },
      { label: "RECHT+PM", sub: "andere\nLehrkraft" },
      { label: "PRÜFUNG", sub: "schriftlich,\ndanach mündlich" },
    ],
    { y: 2.95 }
  );
  api.card(s, {
    y: 4.1,
    h: 0.7,
    akzent: "amber",
    body: "Vor der schriftlichen Prüfung gibt es zusätzlich eine freiwillige, intensive Prüfungsvorbereitung. Die Teilnahme lohnt sich.",
    fontSize: 11.5,
  });
});

deck.content("Womit ihr arbeiten werdet", "Technik", (s, api) => {
  api.lead(s, "Die Werkzeuge, die euch im Kurs begegnen – ihr müsst nichts davon vorher können.");
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Planung und Integration",
        body: [
          "Netzwerkwerkzeuge",
          "Multipass für virtuelle Maschinen",
          "Linux-Kommandozeile",
          "Docker und Compose",
        ],
      },
      {
        nummer: "2",
        titel: "Laufender Betrieb",
        akzent: "amber",
        body: [
          "Prometheus und Grafana",
          "Kubernetes und Helm",
          "Git und GitHub",
          "GitHub Actions",
        ],
      },
      {
        nummer: "3",
        titel: "Qualität und Sicherheit",
        akzent: "cyan",
        body: [
          "Schwachstellen-Scanner",
          "Testverfahren und Testpläne",
          "Risikoanalyse",
          "Vorfallbearbeitung",
        ],
      },
    ],
    { y: 2.16, h: 2.1, fontSize: 11, titleH: 0.48, titleSize: 12 }
  );
  api.kicker(s, "Alles wird gemeinsam installiert – bringt nur euren Rechner mit.", { y: 4.5 });
});

deck.content("Cloud zum Anfassen", "Pluralsight", (s, api) => {
  api.lead(s, "Ihr bekommt einen Zugang zu Pluralsight – dort arbeitet ihr in echten Cloud-Umgebungen.");
  api.cardRow(
    s,
    [
      {
        titel: "Was das ist",
        body: [
          "Eine Lernplattform mit geführten Übungen in einer echten Cloud-Umgebung.",
          "",
          "Ihr bekommt einen Zugang gestellt und arbeitet dort in eurem Tempo.",
        ],
      },
      {
        titel: "Wofür wir es nutzen",
        body: [
          "AWS und andere Cloud-Dienste ausprobieren, ohne eigenes Konto und ohne Kostenrisiko.",
          "",
          "Ideal für Themen, die auf dem eigenen Rechner nicht funktionieren.",
        ],
      },
    ],
    { y: 2.16, h: 2.02, titleH: 0.3 }
  );
  api.kicker(s, "Die Zugangsdaten bekommt ihr über Cloudhelden.", { y: 4.5 });
});

deck.content("Die schriftliche Prüfung", "Prüfungsformat", (s, api) => {
  api.lead(s, "Keine Wissensabfrage, sondern ein Fall aus dem Betrieb, den ihr durchdenkt und löst.");
  api.bullets(
    s,
    [
      "Grundlage ist die Beschreibung einer betrieblichen Situation.",
      "Daraus zwei Aufgaben – je mindestens 90 Minuten, zusammen höchstens 240.",
      "Jede Aufgabe berührt alle fünf Schwerpunkte, auch Recht und Projektmanagement.",
      "Ihr entwickelt eigene Lösungen und begründet sie. Selten gibt es nur einen richtigen Weg.",
    ],
    { y: 2.16, h: 1.72, fontSize: 13.5 }
  );
  api.card(s, {
    y: 4.02,
    h: 0.78,
    body: "Deshalb arbeiten wir im Kurs viel mit Szenarien: „Ein Betrieb hat folgendes Problem – was schlagt ihr vor, und warum?\"",
    fontSize: 11.5,
  });
});

deck.content("Die mündliche Prüfung", "Prüfungsformat", (s, api) => {
  api.lead(s, "Sie besteht aus zwei Teilen und folgt auf die schriftliche Prüfung.");
  api.cardRow(
    s,
    [
      {
        titel: "Präsentation · max. 15 Min.",
        body: [
          "Thema wählt ihr selbst.",
          "Es muss alle fünf Schwerpunkte berühren.",
          "",
          "Einzureichen spätestens am Tag der schriftlichen Prüfung.",
        ],
      },
      {
        titel: "Fachgespräch · max. 30 Min.",
        body: [
          "Direkt im Anschluss.",
          "Fragen zu Hintergründen, Vorgehen und euren Vorschlägen.",
          "",
          "Zählt doppelt so stark wie die Präsentation.",
        ],
      },
    ],
    { y: 2.16, h: 2.02, titleH: 0.3 }
  );
  api.kicker(s, "Wir suchen euer Präsentationsthema rechtzeitig gemeinsam.", { y: 4.5 });
});

deck.content("Was zum Bestehen zählt", "Bewertung", (s, api) => {
  api.lead(s, "Jede einzelne Leistung braucht mindestens 50 von 100 Punkten.");
  api.kennzahl(s, {
    x: 0.62, y: 2.16, w: 2.1, zahl: "4", fontSize: 40,
    label: "Einzelleistungen: zwei schriftliche\nAufgaben, Präsentation, Fachgespräch",
  });
  api.kennzahl(s, {
    x: 3.05, y: 2.16, w: 2.1, zahl: "50", fontSize: 40,
    label: "Punkte Mindestmaß –\nin jeder Leistung einzeln",
  });
  api.kennzahl(s, {
    x: 5.5, y: 2.16, w: 2.2, zahl: "50/50", fontSize: 30,
    label: "Gewichtung von schriftlicher\nund mündlicher Prüfung",
  });
  api.card(s, {
    x: 7.95, y: 2.16, w: 1.43, h: 1.5,
    akzent: "rot",
    body: "Ein starkes Ergebnis gleicht ein schwaches nicht aus.",
    fontSize: 10.5,
  });
  api.kicker(s, "Liegt genau eine schriftliche Aufgabe knapp darunter, gibt es eine mündliche Ergänzungsprüfung.", { y: 4.5 });
});

// ============================================================ Zusammenarbeit
deck.abschnitt("Zusammenarbeit", "gruen");

deck.kapitel("Wie wir zusammenarbeiten", "Ein paar Absprachen für die nächsten Monate", {
  nummer: "03",
});

deck.content("Der Rahmen", "Kursregeln", (s, api) => {
  api.bullets(
    s,
    [
      "Live über Google Meet, zweimal pro Woche am Abend.",
      "Der Unterricht wird nicht aufgezeichnet – seid also möglichst dabei.",
      "Für das Aufstiegs-BAföG braucht ihr eine Teilnahmequote von über 70 Prozent.",
      "Ihr müsst euch nicht abmelden – behaltet nur eure Quote im Blick.",
      "Fragen sind ausdrücklich erwünscht, und wir gehen respektvoll miteinander um.",
    ],
    { y: 1.68, h: 2.45, fontSize: 14 }
  );
  api.card(s, {
    y: 4.28,
    h: 0.5,
    body: "Wenn ich einmal ausfalle, erfahrt ihr das rechtzeitig über Cloudhelden.",
    fontSize: 11,
  });
});

deck.content("Zwei Bitten an euch", "Miteinander", (s, api) => {
  api.cardRow(
    s,
    [
      {
        titel: "Kamera an, wenn es geht",
        body: [
          "Online zu unterrichten ist wie ein Vortrag in einen dunklen Raum, wenn niemand zu sehen ist.",
          "",
          "Ich sehe an euren Gesichtern, ob etwas angekommen ist – und kann sonst nicht nachsteuern.",
          "",
          "Wenn es mal nicht passt: auch okay.",
        ],
      },
      {
        titel: "Meldet euch",
        body: [
          "Unterbrecht mich, wenn etwas unklar ist. Wer fragt, hilft meist der halben Gruppe mit.",
          "",
          "Nutzt gern den Chat, wenn euch das leichter fällt.",
          "",
          "„Ich hab's nicht verstanden\" ist ein vollständiger Satz.",
        ],
      },
    ],
    { y: 1.72, h: 2.72, titleH: 0.3, fontSize: 11 }
  );
});

deck.content("Womit ihr lernt", "Materialien", (s, api) => {
  api.cardRow(
    s,
    [
      {
        nummer: "1",
        titel: "Die Folien",
        body: "Führen durch den Abend, zum Nacharbeiten.",
      },
      {
        nummer: "2",
        titel: "Die Kursunterlagen",
        body: "Alles im Detail: Erklärungen, Befehle, Übungen mit Lösungen, Glossar.",
      },
      {
        nummer: "3",
        titel: "Die Akademie",
        body: "Die Lernplattform von Cloudhelden mit zusätzlichem Material.",
      },
      {
        nummer: "4",
        titel: "Pluralsight",
        body: "Geführte Übungen in echten Cloud-Umgebungen.",
      },
    ],
    { y: 1.72, h: 2.4, fontSize: 10.5, titleH: 0.46, titleSize: 12 }
  );
  api.kicker(s, "Den Link zu den Kursunterlagen bekommt ihr gleich im Anschluss.", { y: 4.5 });
});

deck.content("Wenn etwas ist", "Kontakt", (s, api) => {
  api.lead(s, "Zwei Wege – je nachdem, worum es geht:");
  api.cardRow(
    s,
    [
      {
        titel: "Fachliche Fragen",
        body: [
          "An mich, am besten direkt im Unterricht.",
          "",
          "Wir haben zweimal pro Woche Zeit – nutzt sie.",
        ],
      },
      {
        titel: "Alles Organisatorische",
        body: [
          "beratung@cloudhelden.org",
          "",
          "Zugänge, Termine, BAföG, Prüfungsanmeldung, persönliche Anliegen.",
        ],
      },
    ],
    { y: 2.16, h: 2.02, titleH: 0.3 }
  );
  api.kicker(s, "Schreibt lieber einmal zu früh als zu spät – gerade bei Formalien.", { y: 4.5 });
});

deck.content("Beim nächsten Mal geht es richtig los", "Ausblick", (s, api) => {
  api.card(s, {
    y: 1.7,
    h: 1.15,
    hell: true,
    titel: "Wir starten mit dem Fundament: Netzwerke",
    titleH: 0.32,
    body: "Ohne Netzwerk kein Server, keine Cloud, kein Container. Deshalb fangen wir dort an – und bauen darauf alles Weitere auf.",
    fontSize: 12,
  });
  api.bullets(
    s,
    [
      "Bringt nichts weiter mit als euren Rechner.",
      "Software installieren wir gemeinsam, wenn wir sie brauchen.",
      "Wer mag, schaut vorher schon in die Kursunterlagen – Pflicht ist das nicht.",
    ],
    { y: 3.15, h: 1.15, fontSize: 13 }
  );
});

deck.schluss({
  title: "Was möchtet ihr noch wissen?",
  subtitle: "Alles darf gefragt werden – zum Kurs, zur Prüfung, zu mir.",
  note: "Schön, dass ihr da seid.",
});

// ============================================================ speichern
const outDir = path.join(__dirname, "dist");
fs.mkdirSync(outDir, { recursive: true });

deck.save(path.join(outDir, "00-orientierung.pptx")).then((r) => {
  console.log(`OK  ${r.slides} Folien (${r.numbered} nummeriert)  ->  ${r.file}`);
  if (!fotoPath) {
    console.log("Hinweis: assets/jacob.jpg fehlt – auf der Vorstellungsfolie steht ein Platzhalter.");
  }
});
