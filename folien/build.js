// Docker Compose – Block 4
// Schlichter, durchklickbarer Foliensatz auf Deutsch
// Quellen: docs/docker-compose/einfuehrung.md, docs/docker-compose/grundlagen.md

const path = require("path");
const pptxgen = require(path.join(
  process.env.APPDATA || "C:/Users/jacob_arbeit/AppData/Roaming",
  "npm/node_modules/pptxgenjs"
));

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "Jacob Menge";
pres.title = "Docker Compose – Block 4";
pres.subject = "Kurs Virtualisierung & Docker";

// ----- Theme -----
const C = {
  bg: "FFFFFF",
  title: "0F172A", // slate-900
  body: "334155", // slate-700
  muted: "64748B", // slate-500
  accent: "0E7490", // cyan-700
  accentDark: "155E75", // cyan-800
  border: "E2E8F0", // slate-200
  codeBg: "F8FAFC", // slate-50
  codeText: "0F172A",
  highlightBg: "F1F5F9", // slate-100
  goodGreen: "0F766E", // teal-700
  badRed: "B91C1C", // red-700
};

const FONT_BODY = "Calibri";
const FONT_CODE = "Consolas";

// Layout constants (inches)
const SLIDE_W = 10;
const SLIDE_H = 5.625;
const MARGIN_X = 0.5;
const TITLE_Y = 0.4;

// ----- Helpers -----
function addAccentBar(slide) {
  // thin accent strip at top
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: 0.06,
    fill: { color: C.accent },
    line: { type: "none" },
  });
}

function addFooter(slide, sectionLabel, slideNumber, totalSlides) {
  // footer line
  slide.addShape(pres.shapes.LINE, {
    x: MARGIN_X,
    y: SLIDE_H - 0.42,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0,
    line: { color: C.border, width: 0.75 },
  });
  // left: section label
  if (sectionLabel) {
    slide.addText(sectionLabel, {
      x: MARGIN_X,
      y: SLIDE_H - 0.36,
      w: 6,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 9,
      color: C.muted,
      bold: false,
      align: "left",
      valign: "middle",
      margin: 0,
    });
  }
  // right: slide number
  slide.addText(`${slideNumber} / ${totalSlides}`, {
    x: SLIDE_W - MARGIN_X - 1.5,
    y: SLIDE_H - 0.36,
    w: 1.5,
    h: 0.3,
    fontFace: FONT_BODY,
    fontSize: 9,
    color: C.muted,
    align: "right",
    valign: "middle",
    margin: 0,
  });
}

function addTitle(slide, title, eyebrow) {
  if (eyebrow) {
    slide.addText(eyebrow.toUpperCase(), {
      x: MARGIN_X,
      y: TITLE_Y - 0.05,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 11,
      color: C.accent,
      bold: true,
      charSpacing: 4,
      margin: 0,
    });
  }
  slide.addText(title, {
    x: MARGIN_X,
    y: eyebrow ? TITLE_Y + 0.25 : TITLE_Y,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0.85,
    fontFace: FONT_BODY,
    fontSize: 30,
    color: C.title,
    bold: true,
    margin: 0,
  });
}

function addCodeBlock(slide, code, opts = {}) {
  const x = opts.x ?? MARGIN_X;
  const y = opts.y ?? 1.6;
  const w = opts.w ?? SLIDE_W - 2 * MARGIN_X;
  const h = opts.h ?? 3.0;
  const fontSize = opts.fontSize ?? 14;

  // background
  slide.addShape(pres.shapes.RECTANGLE, {
    x,
    y,
    w,
    h,
    fill: { color: C.codeBg },
    line: { color: C.border, width: 0.75 },
  });
  // code text
  slide.addText(code, {
    x: x + 0.15,
    y: y + 0.1,
    w: w - 0.3,
    h: h - 0.2,
    fontFace: FONT_CODE,
    fontSize,
    color: C.codeText,
    valign: "top",
    margin: 0,
    paraSpaceAfter: 0,
  });
}

function addLead(slide, text, opts = {}) {
  const y = opts.y ?? 1.5;
  slide.addText(text, {
    x: MARGIN_X,
    y,
    w: SLIDE_W - 2 * MARGIN_X,
    h: opts.h ?? 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.muted,
    italic: false,
    margin: 0,
  });
}

function addBullets(slide, items, opts = {}) {
  const x = opts.x ?? MARGIN_X;
  const y = opts.y ?? 1.7;
  const w = opts.w ?? SLIDE_W - 2 * MARGIN_X;
  const h = opts.h ?? 3.4;
  const fontSize = opts.fontSize ?? 16;

  const arr = items.map((t, i) => ({
    text: t,
    options: {
      bullet: opts.numbered ? { type: "number" } : true,
      breakLine: i < items.length - 1,
      paraSpaceAfter: 6,
    },
  }));
  slide.addText(arr, {
    x,
    y,
    w,
    h,
    fontFace: FONT_BODY,
    fontSize,
    color: C.body,
    valign: "top",
    margin: 0,
  });
}

// ===== Build slides =====
const TOTAL = 24;
let n = 0;
const SECTION_INTRO = "Einführung";
const SECTION_BASIC = "Grundlagen: compose.yaml";

// ---------- SLIDE 1: Title ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  // big colored block on left for accent
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.35,
    h: SLIDE_H,
    fill: { color: C.accent },
    line: { type: "none" },
  });
  // eyebrow
  s.addText("BLOCK 4 · KURS VIRTUALISIERUNG & DOCKER", {
    x: 0.9,
    y: 1.6,
    w: 8.6,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 12,
    color: C.muted,
    bold: true,
    charSpacing: 4,
    margin: 0,
  });
  // big title
  s.addText("Docker Compose", {
    x: 0.9,
    y: 2.0,
    w: 8.6,
    h: 1.1,
    fontFace: FONT_BODY,
    fontSize: 56,
    color: C.title,
    bold: true,
    margin: 0,
  });
  // subtitle
  s.addText("Multi-Container-Stacks deklarativ", {
    x: 0.9,
    y: 3.15,
    w: 8.6,
    h: 0.6,
    fontFace: FONT_BODY,
    fontSize: 24,
    color: C.accentDark,
    margin: 0,
  });
  // bottom line
  s.addText("2 Stunden Theorie · 45 Minuten Praxis", {
    x: 0.9,
    y: 4.4,
    w: 8.6,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.muted,
    margin: 0,
  });
}

// ---------- SLIDE 2: Agenda ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Was du heute lernst", "Agenda");

  // Two columns: Theorie (links), Praxis (rechts)
  // left column
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X,
    y: 1.6,
    w: 4.45,
    h: 3.3,
    fill: { color: C.highlightBg },
    line: { color: C.border, width: 0.75 },
  });
  s.addText("Theorie · 2 Stunden", {
    x: MARGIN_X + 0.2,
    y: 1.7,
    w: 4.1,
    h: 0.35,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.accent,
    bold: true,
    margin: 0,
  });
  s.addText(
    [
      { text: "Einführung", options: { bold: true, breakLine: true } },
      { text: "Warum Compose? Imperativ vs. deklarativ. V1 vs. V2. Wichtigste Befehle.", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 6 } },
      { text: "Grundlagen", options: { bold: true, breakLine: true } },
      { text: "compose.yaml-Syntax: services, image/build, ports, environment, volumes, depends_on, healthcheck, .env, profiles." },
    ],
    {
      x: MARGIN_X + 0.2,
      y: 2.15,
      w: 4.1,
      h: 2.65,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: C.body,
      valign: "top",
      margin: 0,
    }
  );

  // right column
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X + 4.6,
    y: 1.6,
    w: 4.4,
    h: 3.3,
    fill: { color: C.highlightBg },
    line: { color: C.border, width: 0.75 },
  });
  s.addText("Praxis · 45 Minuten", {
    x: MARGIN_X + 4.8,
    y: 1.7,
    w: 4.05,
    h: 0.35,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.accent,
    bold: true,
    margin: 0,
  });
  s.addText(
    [
      { text: "Erste eigene compose.yaml", options: { bold: true, breakLine: true } },
      { text: "Postgres + Adminer als deklarativer Stack.", options: { breakLine: true } },
      { text: " ", options: { breakLine: true, fontSize: 6 } },
      { text: "Was du übst:", options: { bold: true, breakLine: true } },
      { text: "compose.yaml schreiben · up / down / ps / logs / exec · Persistenz mit benanntem Volume.", options: {} },
    ],
    {
      x: MARGIN_X + 4.8,
      y: 2.15,
      w: 4.05,
      h: 2.65,
      fontFace: FONT_BODY,
      fontSize: 12,
      color: C.body,
      valign: "top",
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 3: Das Problem ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Wenn ein Container nicht mehr reicht", "Das Problem");
  addLead(s, "Block 3: Postgres + Adminer manuell zusammengeschraubt – schon mit zwei Services wird es mühsam.");

  addBullets(
    s,
    [
      "Pro Container: viele Flags – Name, Netzwerk, Volume, jede ENV-Variable, jedes Port-Mapping.",
      "Reihenfolge ist deine Verantwortung – falsche Reihenfolge = nichts läuft.",
      "Änderung am Setup heißt: stoppen, entfernen, neu starten.",
      "Setup an Kollegen weitergeben = Shell-Skript oder lange README.",
    ],
    { y: 2.05, h: 2.4, fontSize: 15 }
  );

  // Footer-quote
  s.addText("→ Schreibst du den Setup nicht einmal in eine Datei?", {
    x: MARGIN_X,
    y: 4.55,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0.5,
    fontFace: FONT_BODY,
    fontSize: 15,
    color: C.accentDark,
    italic: true,
    bold: true,
    margin: 0,
  });

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 4: Was ist Compose ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Docker Compose in einem Satz", "Definition");

  s.addText(
    "Werkzeug, das einen Stack aus mehreren Containern aus einer YAML-Datei startet und verwaltet.",
    {
      x: MARGIN_X,
      y: 1.55,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.85,
      fontFace: FONT_BODY,
      fontSize: 17,
      color: C.body,
      margin: 0,
    }
  );

  addBullets(
    s,
    [
      "Datei: compose.yaml (alt: docker-compose.yml).",
      "Befehl: docker compose up -d.",
      "Du beschreibst den Zielzustand – Compose macht den Rest.",
      "Single-Host-Tool. Für mehrere Hosts: Kubernetes oder Swarm.",
    ],
    { y: 2.55, h: 2.4, fontSize: 15 }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 5: Beispiel compose.yaml ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Eine kleine compose.yaml", "Beispiel");

  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: geheim
    volumes:
      - postgres-daten:/var/lib/postgresql/data

  app:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - db

volumes:
  postgres-daten:`,
    { y: 1.55, h: 3.6, fontSize: 11 }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 6: Was Compose automatisch macht ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Was docker compose up automatisch macht", "Magie");

  addBullets(
    s,
    [
      "Netzwerk anlegen – passend zum Projektordner.",
      "Volume anlegen, falls nicht vorhanden.",
      "Image bauen, falls build: angegeben ist.",
      "Container in der richtigen Reihenfolge starten (depends_on).",
      "DNS einrichten – Services finden sich über ihren Namen.",
    ],
    { y: 1.6, h: 2.85, fontSize: 15, numbered: true }
  );

  s.addText(
    "→ Was du in Block 3 mit fünf docker run-Befehlen gebaut hast, läuft jetzt mit einem einzigen.",
    {
      x: MARGIN_X,
      y: 4.5,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.accentDark,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 7: Imperativ vs Deklarativ ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Imperativ vs. deklarativ", "Der zentrale Unterschied");

  const tableData = [
    [
      {
        text: "Imperativ – docker run",
        options: {
          bold: true,
          color: "FFFFFF",
          fill: { color: C.accentDark },
          align: "left",
          valign: "middle",
        },
      },
      {
        text: "Deklarativ – docker compose",
        options: {
          bold: true,
          color: "FFFFFF",
          fill: { color: C.accent },
          align: "left",
          valign: "middle",
        },
      },
    ],
    ["Schritte beschreiben", "Zielzustand beschreiben"],
    ["Reihenfolge: deine Verantwortung", "Reihenfolge: Compose"],
    ["Änderung = alles neu starten", "Änderung = up -d, Compose macht den Rest"],
    ["Befehle merken oder ins README", "Die compose.yaml IST das Setup"],
  ];

  s.addTable(tableData, {
    x: MARGIN_X,
    y: 1.55,
    w: SLIDE_W - 2 * MARGIN_X,
    colW: [4.5, 4.5],
    rowH: [0.45, 0.45, 0.45, 0.45, 0.45],
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.body,
    border: { type: "solid", pt: 0.75, color: C.border },
    valign: "middle",
  });

  s.addText(
    "Deklarativ ist der Standard moderner Tools: Kubernetes, Terraform, Ansible.",
    {
      x: MARGIN_X,
      y: 4.55,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.muted,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 8: V1 vs V2 ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "docker compose vs. docker-compose", "Achtung Bindestrich");

  const tableData = [
    [
      { text: "", options: { fill: { color: "FFFFFF" } } },
      {
        text: "V1 (alt)",
        options: {
          bold: true,
          color: "FFFFFF",
          fill: { color: C.muted },
          align: "center",
          valign: "middle",
        },
      },
      {
        text: "V2 (aktuell)",
        options: {
          bold: true,
          color: "FFFFFF",
          fill: { color: C.accent },
          align: "center",
          valign: "middle",
        },
      },
    ],
    [
      { text: "Schreibweise", options: { bold: true } },
      "docker-compose",
      "docker compose",
    ],
    [
      { text: "Implementierung", options: { bold: true } },
      "Python, separat installiert",
      "Go, als Docker-Plugin",
    ],
    [
      { text: "Status", options: { bold: true } },
      "seit 2023 keine Updates",
      "Standard, mit Docker Desktop",
    ],
  ];

  s.addTable(tableData, {
    x: MARGIN_X,
    y: 1.55,
    w: SLIDE_W - 2 * MARGIN_X,
    colW: [2.4, 3.3, 3.3],
    rowH: [0.45, 0.55, 0.55, 0.55],
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.body,
    border: { type: "solid", pt: 0.75, color: C.border },
    valign: "middle",
  });

  s.addText(
    [
      { text: "Empfehlung: ", options: { bold: true, color: C.accentDark } },
      { text: "immer V2 nutzen. Check mit ", options: { color: C.body } },
      { text: "docker compose version", options: { fontFace: FONT_CODE, color: C.codeText } },
      { text: ".", options: { color: C.body } },
    ],
    {
      x: MARGIN_X,
      y: 4.45,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 14,
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 9: Wichtigste Befehle ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Die wichtigsten Befehle", "Compose-CLI");

  addCodeBlock(
    s,
    `docker compose up -d         # Stack im Hintergrund starten
docker compose down          # Stack stoppen + aufräumen
docker compose down -v       # zusätzlich Volumes löschen (Daten weg!)
docker compose ps            # Status der Services
docker compose logs -f       # Live-Logs aller Services
docker compose exec app sh   # Shell im Container öffnen
docker compose up -d --build # Image neu bauen und starten`,
    { y: 1.55, h: 2.7, fontSize: 12 }
  );

  s.addText(
    "Compose-Befehle wirken nur auf Container dieses Projekts. Andere Container auf dem Host bleiben unberührt.",
    {
      x: MARGIN_X,
      y: 4.4,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.6,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.muted,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 10: Wann Compose, wann nicht ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Wann Compose – wann nicht", "Einsatzbereiche");

  // good column
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X,
    y: 1.55,
    w: 4.45,
    h: 3.3,
    fill: { color: "F0FDFA" }, // teal-50
    line: { color: C.goodGreen, width: 1 },
  });
  s.addText("Gut geeignet", {
    x: MARGIN_X + 0.2,
    y: 1.7,
    w: 4.1,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.goodGreen,
    bold: true,
    margin: 0,
  });
  s.addText(
    [
      { text: "Mehr als ein Container, die zusammen arbeiten.", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Entwicklungsumgebungen für das ganze Team.", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: "CI/CD-Tests: Stack hochfahren, testen, abbauen.", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Self-Hosting (Nextcloud, WordPress, Grafana).", options: { bullet: true } },
    ],
    {
      x: MARGIN_X + 0.2,
      y: 2.15,
      w: 4.1,
      h: 2.55,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      valign: "top",
      margin: 0,
    }
  );

  // bad column
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X + 4.6,
    y: 1.55,
    w: 4.4,
    h: 3.3,
    fill: { color: "FEF2F2" }, // red-50
    line: { color: C.badRed, width: 1 },
  });
  s.addText("Nicht das Richtige", {
    x: MARGIN_X + 4.8,
    y: 1.7,
    w: 4.05,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.badRed,
    bold: true,
    margin: 0,
  });
  s.addText(
    [
      { text: "Einzelne Container – docker run reicht.", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Mehrere Hosts (Cluster) – das macht Kubernetes.", options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: "Produktion mit Lastverteilung über Server hinweg – Compose ist Single-Host.", options: { bullet: true } },
    ],
    {
      x: MARGIN_X + 4.8,
      y: 2.15,
      w: 4.05,
      h: 2.55,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      valign: "top",
      margin: 0,
    }
  );

  addFooter(s, SECTION_INTRO, n, TOTAL);
}

// ---------- SLIDE 11: Anatomie compose.yaml ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Anatomie einer compose.yaml", "Aufbau");
  addLead(s, "Drei Top-Level-Blöcke. Pflicht ist nur services:.");

  addCodeBlock(
    s,
    `services:
  # die Container
  ...

volumes:
  # benannte Volumes (optional)
  ...

networks:
  # eigene Netzwerke (optional, oft nicht nötig)
  ...`,
    { y: 1.95, h: 2.65, fontSize: 13 }
  );

  s.addText(
    "Das alte version: ganz oben ist in Compose V2 obsolet. Einfach weglassen.",
    {
      x: MARGIN_X,
      y: 4.7,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.muted,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 12: services ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "services: – ein Eintrag = ein Container", "Bausteine");

  addCodeBlock(
    s,
    `services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"`,
    { y: 1.55, h: 1.7, fontSize: 13 }
  );

  s.addText(
    [
      { text: "web", options: { fontFace: FONT_CODE, bold: true } },
      { text: " ist der Service-Name (frei wählbar) – und gleichzeitig der DNS-Name im Compose-Netzwerk.", options: {} },
    ],
    {
      x: MARGIN_X,
      y: 3.45,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      bullet: true,
      margin: 0,
    }
  );
  s.addText(
    [
      { text: "image", options: { fontFace: FONT_CODE, bold: true } },
      { text: " sagt, welches Image gezogen wird.", options: {} },
    ],
    {
      x: MARGIN_X,
      y: 3.95,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      bullet: true,
      margin: 0,
    }
  );
  s.addText(
    [
      { text: "ports", options: { fontFace: FONT_CODE, bold: true } },
      { text: " mappt Host-Port auf Container-Port – Host:Container.", options: {} },
    ],
    {
      x: MARGIN_X,
      y: 4.35,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.4,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      bullet: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 13: image vs build ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "image: vs. build:", "Container-Quelle");

  // left: image
  s.addText("image: – fertiges Image aus Registry", {
    x: MARGIN_X,
    y: 1.55,
    w: 4.45,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16`,
    { x: MARGIN_X, y: 1.95, w: 4.45, h: 1.3, fontSize: 13 }
  );

  // right: build
  s.addText("build: – aus lokalem Dockerfile bauen", {
    x: MARGIN_X + 4.6,
    y: 1.55,
    w: 4.4,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `services:
  app:
    build: .`,
    { x: MARGIN_X + 4.6, y: 1.95, w: 4.4, h: 1.3, fontSize: 13 }
  );

  s.addText(
    "Beides geht auch zusammen: lokal bauen und das Ergebnis unter einem Image-Namen taggen – praktisch für späteren Push in eine Registry.",
    {
      x: MARGIN_X,
      y: 3.7,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.9,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      italic: false,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 14: ports ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "ports: – Port-Mapping", "Bausteine");
  addLead(s, "Format: \"HOST:CONTAINER\" – immer als String.");

  addCodeBlock(
    s,
    `ports:
  - "8080:80"               # Host 8080  →  Container 80
  - "127.0.0.1:8081:80"     # nur auf Localhost binden
  - "3000-3002:3000-3002"   # Port-Bereich`,
    { y: 1.95, h: 1.6, fontSize: 13 }
  );

  s.addText(
    "Service-zu-Service-Kommunikation braucht kein ports:. Services finden sich automatisch über ihren Service-Namen.",
    {
      x: MARGIN_X,
      y: 3.85,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.7,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.body,
      margin: 0,
    }
  );
  s.addText(
    "→ Weniger offene Ports = weniger Angriffsfläche.",
    {
      x: MARGIN_X,
      y: 4.6,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.accentDark,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 15: environment ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "environment: – ENV-Variablen", "Bausteine");
  addLead(s, "Zwei Schreibweisen sind erlaubt – konsistent bleiben.");

  // left: map form
  s.addText("Map-Form (lesbar, empfohlen)", {
    x: MARGIN_X,
    y: 1.85,
    w: 4.45,
    h: 0.35,
    fontFace: FONT_BODY,
    fontSize: 13,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `environment:
  POSTGRES_USER: kurs
  POSTGRES_PASSWORD: geheim
  POSTGRES_DB: kursdaten`,
    { x: MARGIN_X, y: 2.3, w: 4.45, h: 1.6, fontSize: 12 }
  );

  // right: list form
  s.addText("Listen-Form (kompakt)", {
    x: MARGIN_X + 4.6,
    y: 1.85,
    w: 4.4,
    h: 0.35,
    fontFace: FONT_BODY,
    fontSize: 13,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `environment:
  - POSTGRES_USER=kurs
  - POSTGRES_PASSWORD=geheim
  - POSTGRES_DB=kursdaten`,
    { x: MARGIN_X + 4.6, y: 2.3, w: 4.4, h: 1.6, fontSize: 12 }
  );

  s.addText(
    "Statt Variablen einzeln aufzulisten kannst du auch eine ganze Datei laden – mit env_file: app.env.",
    {
      x: MARGIN_X,
      y: 4.3,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.muted,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 16: volumes ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "volumes: – persistente Daten", "Bausteine");
  addLead(s, "Im Service mounten – und im Top-Level-Block deklarieren.");

  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16
    volumes:
      - postgres-daten:/var/lib/postgresql/data

volumes:
  postgres-daten:`,
    { y: 1.85, h: 2.6, fontSize: 14 }
  );

  s.addText(
    "→ Container weg, Volume bleibt. Datenbank überlebt down + up.",
    {
      x: MARGIN_X,
      y: 4.6,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.accentDark,
      italic: true,
      bold: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 17: depends_on ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "depends_on – Startreihenfolge", "Bausteine");

  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16

  app:
    build: .
    depends_on:
      - db`,
    { y: 1.55, h: 2.3, fontSize: 13 }
  );

  // warning box
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X,
    y: 4.0,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 1.05,
    fill: { color: "FEF3C7" }, // amber-100
    line: { color: "F59E0B", width: 0.75 }, // amber-500
  });
  s.addText(
    [
      { text: "Achtung: ", options: { bold: true, color: "92400E" } },
      {
        text: "depends_on wartet nur auf den Container-Start, nicht auf die Bereitschaft des Dienstes. Postgres braucht z.B. 5–15 Sekunden, bis er Anfragen annimmt.",
        options: { color: "78350F" },
      },
    ],
    {
      x: MARGIN_X + 0.2,
      y: 4.07,
      w: SLIDE_W - 2 * MARGIN_X - 0.4,
      h: 0.95,
      fontFace: FONT_BODY,
      fontSize: 13,
      valign: "middle",
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 18: healthcheck ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "healthcheck – Bereitschaft prüfen", "Bausteine");

  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s`,
    { y: 1.55, h: 2.8, fontSize: 12 }
  );

  s.addText(
    "Status sichtbar in docker compose ps: starting → healthy → (oder unhealthy).",
    {
      x: MARGIN_X,
      y: 4.5,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.muted,
      italic: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 19: depends_on + healthy ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "depends_on + condition: service_healthy", "Wirklich warten");

  addCodeBlock(
    s,
    `services:
  db:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy`,
    { y: 1.55, h: 3.1, fontSize: 12 }
  );

  s.addText(
    "→ app startet erst, wenn db als healthy markiert ist.",
    {
      x: MARGIN_X,
      y: 4.7,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.accentDark,
      italic: true,
      bold: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 20: .env ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, ".env – Variablen aus Datei", "Konfiguration");
  addLead(s, "Compose liest .env automatisch aus dem Ordner mit der compose.yaml.");

  // left: .env
  s.addText(".env", {
    x: MARGIN_X,
    y: 1.85,
    w: 4.45,
    h: 0.35,
    fontFace: FONT_CODE,
    fontSize: 13,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `POSTGRES_PASSWORD=geheim
APP_PORT=8080`,
    { x: MARGIN_X, y: 2.25, w: 4.45, h: 1.2, fontSize: 13 }
  );

  // right: compose.yaml
  s.addText("compose.yaml", {
    x: MARGIN_X + 4.6,
    y: 1.85,
    w: 4.4,
    h: 0.35,
    fontFace: FONT_CODE,
    fontSize: 13,
    color: C.accentDark,
    bold: true,
    margin: 0,
  });
  addCodeBlock(
    s,
    `environment:
  POSTGRES_PASSWORD: \${POSTGRES_PASSWORD}
ports:
  - "\${APP_PORT:-8000}:8000"`,
    { x: MARGIN_X + 4.6, y: 2.3, w: 4.4, h: 1.55, fontSize: 11 }
  );

  // danger box
  s.addShape(pres.shapes.RECTANGLE, {
    x: MARGIN_X,
    y: 4.15,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0.7,
    fill: { color: "FEF2F2" },
    line: { color: C.badRed, width: 0.75 },
  });
  s.addText(
    [
      { text: "Wichtig: ", options: { bold: true, color: C.badRed } },
      {
        text: "Secrets gehören in .env – und .env gehört in .gitignore. Nie ins Repo einchecken.",
        options: { color: "7F1D1D" },
      },
    ],
    {
      x: MARGIN_X + 0.2,
      y: 4.2,
      w: SLIDE_W - 2 * MARGIN_X - 0.4,
      h: 0.6,
      fontFace: FONT_BODY,
      fontSize: 13,
      valign: "middle",
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 21: profiles ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "profiles: – optionale Services", "Konfiguration");
  addLead(s, "Services nur dann starten, wenn man sie wirklich will.");

  addCodeBlock(
    s,
    `services:
  app:
    build: .

  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles:
      - debug`,
    { y: 1.9, h: 2.5, fontSize: 12 }
  );

  s.addText(
    [
      { text: "docker compose up -d", options: { fontFace: FONT_CODE, bold: true } },
      { text: "  →  startet nur app", options: {} },
    ],
    {
      x: MARGIN_X,
      y: 4.5,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.body,
      margin: 0,
    }
  );
  s.addText(
    [
      { text: "docker compose --profile debug up -d", options: { fontFace: FONT_CODE, bold: true } },
      { text: "  →  startet zusätzlich adminer", options: {} },
    ],
    {
      x: MARGIN_X,
      y: 4.85,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.3,
      fontFace: FONT_BODY,
      fontSize: 13,
      color: C.body,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 22: docker compose config ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "docker compose config – YAML prüfen", "Werkzeug");

  addCodeBlock(s, `docker compose config`, {
    y: 1.55,
    h: 0.7,
    fontSize: 16,
  });

  s.addText("Zeigt die fertig aufgelöste YAML – nach Einsetzen von .env-Variablen und Defaults.", {
    x: MARGIN_X,
    y: 2.4,
    w: SLIDE_W - 2 * MARGIN_X,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 14,
    color: C.body,
    margin: 0,
  });

  addBullets(
    s,
    [
      "Sind alle ${VAR}-Stellen richtig eingesetzt?",
      "Erkennt Compose deine Service-Struktur?",
      "Syntax-Fehler werden mit Zeilenangabe ausgegeben.",
    ],
    { y: 2.9, h: 1.6, fontSize: 15 }
  );

  s.addText(
    "→ Vor jedem ersten up -d einmal aufrufen.",
    {
      x: MARGIN_X,
      y: 4.6,
      w: SLIDE_W - 2 * MARGIN_X,
      h: 0.35,
      fontFace: FONT_BODY,
      fontSize: 14,
      color: C.accentDark,
      italic: true,
      bold: true,
      margin: 0,
    }
  );

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 23: Drei Merksätze ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addAccentBar(s);
  addTitle(s, "Drei Merksätze", "Zusammenfassung");

  const cardX = [MARGIN_X, MARGIN_X + 3.05, MARGIN_X + 6.1];
  const cards = [
    {
      head: "Imperativ vs. deklarativ",
      body: "docker run beschreibt Schritte. Compose beschreibt den Zielzustand. Ab mehr als einem Container: immer Compose.",
    },
    {
      head: "depends_on allein wartet nicht",
      body: 'Für "warte bis DB bereit" brauchst du condition: service_healthy plus Healthcheck im Ziel-Service.',
    },
    {
      head: "Fünf Befehle reichen",
      body: "up -d, down, ps, logs -f, exec service sh – damit erschlägst du 90 % deines Compose-Alltags.",
    },
  ];

  cards.forEach((c, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: cardX[i],
      y: 1.6,
      w: 2.85,
      h: 3.3,
      fill: { color: C.highlightBg },
      line: { color: C.border, width: 0.75 },
    });
    // number badge
    s.addShape(pres.shapes.OVAL, {
      x: cardX[i] + 0.2,
      y: 1.75,
      w: 0.5,
      h: 0.5,
      fill: { color: C.accent },
      line: { type: "none" },
    });
    s.addText(`${i + 1}`, {
      x: cardX[i] + 0.2,
      y: 1.75,
      w: 0.5,
      h: 0.5,
      fontFace: FONT_BODY,
      fontSize: 18,
      color: "FFFFFF",
      bold: true,
      align: "center",
      valign: "middle",
      margin: 0,
    });
    // headline
    s.addText(c.head, {
      x: cardX[i] + 0.2,
      y: 2.4,
      w: 2.45,
      h: 0.7,
      fontFace: FONT_BODY,
      fontSize: 15,
      color: C.title,
      bold: true,
      valign: "top",
      margin: 0,
    });
    // body
    s.addText(c.body, {
      x: cardX[i] + 0.2,
      y: 3.15,
      w: 2.45,
      h: 1.65,
      fontFace: FONT_BODY,
      fontSize: 12.5,
      color: C.body,
      valign: "top",
      margin: 0,
    });
  });

  addFooter(s, SECTION_BASIC, n, TOTAL);
}

// ---------- SLIDE 24: Übergang zur Praxis ----------
{
  n++;
  const s = pres.addSlide();
  s.background = { color: C.bg };
  // big accent block on left
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0,
    y: 0,
    w: 0.35,
    h: SLIDE_H,
    fill: { color: C.accent },
    line: { type: "none" },
  });

  s.addText("JETZT", {
    x: 0.9,
    y: 1.1,
    w: 8.6,
    h: 0.4,
    fontFace: FONT_BODY,
    fontSize: 12,
    color: C.muted,
    bold: true,
    charSpacing: 4,
    margin: 0,
  });
  s.addText("45 Minuten Hands-on", {
    x: 0.9,
    y: 1.5,
    w: 8.6,
    h: 0.9,
    fontFace: FONT_BODY,
    fontSize: 38,
    color: C.title,
    bold: true,
    margin: 0,
  });
  s.addText("Eure erste eigene compose.yaml – Postgres + Adminer als deklarativer Stack.", {
    x: 0.9,
    y: 2.45,
    w: 8.6,
    h: 0.6,
    fontFace: FONT_BODY,
    fontSize: 18,
    color: C.accentDark,
    margin: 0,
  });

  s.addText(
    [
      { text: "compose.yaml mit zwei Services schreiben", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
      { text: "Stack mit up -d starten, mit down abbauen", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
      { text: "ps / logs / exec praktisch durchspielen", options: { bullet: true, breakLine: true, paraSpaceAfter: 6 } },
      { text: "Persistenz mit benanntem Volume überprüfen", options: { bullet: true } },
    ],
    {
      x: 0.9,
      y: 3.3,
      w: 8.6,
      h: 1.8,
      fontFace: FONT_BODY,
      fontSize: 16,
      color: C.body,
      valign: "top",
      margin: 0,
    }
  );
}

// ===== Save =====
pres
  .writeFile({ fileName: path.join(__dirname, "docker-compose-block4.pptx") })
  .then((f) => console.log("written:", f));
