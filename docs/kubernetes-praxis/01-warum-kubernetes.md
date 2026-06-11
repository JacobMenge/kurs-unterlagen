---
title: "Warum Kubernetes?"
description: "Vom einzelnen Container zum Cluster: warum ein Host irgendwann nicht mehr reicht, was Kubernetes für dich übernimmt (Selbstheilung, Skalierung, Rolling Updates) und der zentrale Gedanke des Soll-Zustands."
---

# Warum Kubernetes?

!!! quote "Der Kerngedanke"
    Du sagst Kubernetes **was** laufen soll – nicht **wie** du es startest. „Halte mir drei Kopien dieser App am Laufen.“ Den Rest erledigt es selbst: Stirbt eine Kopie, startet es eine neue. Du beschreibst das **Ziel**, das System hält es.

## Wo wir herkommen

Mit **Docker** hast du einen Container gestartet. Mit **Docker Compose** sogar einen ganzen Stack aus mehreren Containern – mit **einem** Befehl, auf **einem** Rechner. Das ist viel wert. Aber genau da ist auch die Grenze:

- Der Rechner fällt aus → **alles** ist weg. Niemand startet die Container neu.
- Die Last steigt → ein Container reicht nicht mehr, aber von Hand zehn Kopien zu starten und zu verteilen ist mühsam und fehleranfällig.
- Eine neue Version soll raus → du müsstest selbst dafür sorgen, dass nichts ausfällt, während du tauschst.
- Ein Container hängt sich auf → es merkt niemand, bis sich jemand beschwert.

> Compose ist für **einen** Rechner gebaut. Sobald „es muss **immer** laufen“ und „es muss **mehr** werden“ zusammenkommen, brauchst du etwas, das **viele** Rechner als **einen** behandelt und sich selbst kümmert.

---

## Was ist Kubernetes?

**Kubernetes** (oft **K8s** geschrieben – „K“, dann acht Buchstaben, dann „s“) ist ein **Orchestrierungs-System** für Container. Es nimmt einen **Verbund von Rechnern** und behandelt ihn wie einen einzigen großen Computer, auf dem deine Container laufen.

Ein Bild dazu: das **Dirigieren eines Orchesters**. Die einzelnen Container sind die Musiker. Keiner spielt für sich allein – ein Dirigent sorgt dafür, dass die richtige Anzahl spielt, dass jemand einspringt, wenn ein Musiker ausfällt – und dass beim Stückwechsel kein Bruch entsteht. „Kubernetes“ ist griechisch und heißt **Steuermann** – der, der das Schiff auf Kurs hält.

!!! abstract "Orchestrierung in einem Satz"
    Container **starten** kann Docker. Container **am Leben halten, vermehren, verteilen und unterbrechungsfrei erneuern** – über viele Rechner hinweg, automatisch – das ist Orchestrierung. Das ist Kubernetes.

---

## Ein Host gegen einen Cluster

<figure markdown="span">
<svg viewBox="0 0 640 230" width="100%" height="230" role="img" aria-label="Vergleich: ein einzelner Host gegen einen Cluster aus mehreren Knoten">
  <!-- linke Seite: ein Host -->
  <text x="120" y="22" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="13">Ein Host (Docker / Compose)</text>
  <rect x="35" y="38" width="170" height="150" rx="8" fill="rgba(125,255,154,0.05)" stroke="#56c374" stroke-width="2"/>
  <rect x="55" y="70" width="55" height="40" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="125" y="70" width="55" height="40" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="55" y="125" width="55" height="40" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="125" y="125" width="55" height="40" rx="4" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="120" y="210" text-anchor="middle" fill="#e0a05a" font-family="JetBrains Mono, monospace" font-size="12">faellt der Rechner aus → alles weg</text>
  <!-- Pfeil -->
  <text x="320" y="120" text-anchor="middle" fill="#7dff9a" font-size="26">→</text>
  <!-- rechte Seite: Cluster -->
  <text x="480" y="22" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="13">Ein Cluster (Kubernetes)</text>
  <rect x="370" y="38" width="240" height="150" rx="8" fill="rgba(125,255,154,0.04)" stroke="#7dff9a" stroke-width="2" stroke-dasharray="5 4"/>
  <rect x="385" y="60" width="100" height="115" rx="6" fill="rgba(125,255,154,0.05)" stroke="#56c374" stroke-width="2"/>
  <rect x="495" y="60" width="100" height="115" rx="6" fill="rgba(125,255,154,0.05)" stroke="#56c374" stroke-width="2"/>
  <rect x="400" y="82" width="32" height="28" rx="3" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="440" y="82" width="32" height="28" rx="3" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="510" y="82" width="32" height="28" rx="3" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <rect x="550" y="82" width="32" height="28" rx="3" fill="rgba(122,162,255,0.15)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="490" y="210" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="12">faellt ein Knoten aus → Rest macht weiter</text>
</svg>
<figcaption>Links ein einzelner Host: alle Container teilen das Schicksal des Rechners. Rechts ein Cluster: mehrere Knoten (grün), die Container (blau) tragen – fällt einer aus, übernehmen die anderen.</figcaption>
</figure>

---

## Was Kubernetes für dich übernimmt

Das sind die fünf Dinge, die du sonst alle von Hand machen müsstest:

| Aufgabe | Ohne Orchestrierung | Mit Kubernetes |
|---|---|---|
| **Selbstheilung** | Container stürzt ab, jemand muss ihn neu starten | startet automatisch neu, sofort |
| **Skalierung** | von Hand mehr Kopien starten und verteilen | eine Zahl ändern: „statt 3 jetzt 10“ |
| **Verteilung** | du entscheidest, welcher Container auf welchen Rechner kommt | Kubernetes platziert die Container selbst sinnvoll |
| **Rolling Update** | beim Versionstausch droht eine Ausfallzeit | tauscht Pod für Pod, ohne dass der Dienst weg ist |
| **Erreichbarkeit** | Container bekommt eine neue Adresse, alle müssen es wissen | eine **stabile** Adresse vor wechselnden Containern |

!!! tip "Das Zauberwort ist „automatisch“"
    Jede dieser Aufgaben **kannst** du auch ohne Kubernetes erledigen – aber von Hand, jedes Mal, fehleranfällig – und nachts um drei will das niemand. Kubernetes macht sie zu etwas, das **dauerhaft von selbst** passiert.

---

## Der zentrale Gedanke: Soll-Zustand

Das ist die wichtigste Idee des ganzen Blocks – wenn du nur eine Sache mitnimmst, dann diese.

Bei Docker arbeitest du **imperativ**: „starte diesen Container, stoppe jenen“. Du sagst die **Schritte**. Kubernetes arbeitet **deklarativ**: du beschreibst den **Soll-Zustand** – „ich will, dass immer 3 Kopien dieser App laufen“ – und Kubernetes vergleicht das laufend mit dem **Ist-Zustand** und gleicht beides an.

<figure markdown="span">
<svg viewBox="0 0 560 200" width="100%" height="200" role="img" aria-label="Regelkreis: Soll-Zustand mit Ist-Zustand vergleichen und angleichen">
  <rect x="30" y="70" width="150" height="60" rx="8" fill="rgba(125,255,154,0.08)" stroke="#7dff9a" stroke-width="2"/>
  <text x="105" y="95" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">SOLL</text>
  <text x="105" y="114" text-anchor="middle" fill="#e2ece6" font-size="12">"3 Pods"</text>

  <rect x="380" y="70" width="150" height="60" rx="8" fill="rgba(122,162,255,0.08)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="455" y="95" text-anchor="middle" fill="#7aa2ff" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">IST</text>
  <text x="455" y="114" text-anchor="middle" fill="#e2ece6" font-size="12">gerade 2 Pods</text>

  <!-- Vergleich oben -->
  <path d="M180 90 L380 90" fill="none" stroke="#8fa498" stroke-width="2" marker-end="url(#arr)"/>
  <text x="280" y="80" text-anchor="middle" fill="#8fa498" font-size="12">vergleicht laufend</text>
  <!-- Angleichen unten -->
  <path d="M380 112 L180 112" fill="none" stroke="#e0a05a" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="280" y="132" text-anchor="middle" fill="#e0a05a" font-size="12">fehlt einer → startet einen neuen</text>

  <defs>
    <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#8fa498"/></marker>
    <marker id="arr2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#e0a05a"/></marker>
  </defs>
</svg>
<figcaption>Der Regelkreis von Kubernetes: Soll mit Ist vergleichen, Unterschied ausgleichen – immer wieder. Genau das macht die Selbstheilung aus.</figcaption>
</figure>

!!! note "Kurz erklärt: imperativ vs. deklarativ"
    - **Imperativ** heißt: du gibst die **Befehle** Schritt für Schritt. Wie ein Rezept, das du selbst abarbeitest.
    - **Deklarativ** heißt: du beschreibst das **Ergebnis**, das du willst. Wie eine Bestellung im Restaurant – *was* auf den Teller soll, nicht *wie* die Küche es zubereitet.

    Den deklarativen Gedanken kennst du schon von der `compose.yaml`: dort beschreibst du auch einen Zustand, statt Container einzeln zu starten. Kubernetes treibt genau dieses Prinzip auf die Spitze – und überwacht den Zustand **dauerhaft**.

---

## Wann lohnt sich das – und wann nicht?

Kubernetes ist mächtig, aber nicht für alles die richtige Wahl. Ehrlich eingeordnet:

| Situation | Sinnvoll? |
|---|---|
| Ein kleines Tool, das auf einem Server läuft | **Nein** – Docker oder Compose reicht völlig |
| Eine Anwendung, die **immer** verfügbar sein muss | **Ja** – Selbstheilung und Verteilung lohnen sich |
| Last schwankt stark, mal wenig, mal viel | **Ja** – automatisches Skalieren |
| Viele Dienste, die zusammenspielen, häufig aktualisiert | **Ja** – Rolling Updates, einheitliche Verwaltung |
| Du lernst gerade Container | erst **Docker/Compose** sicher beherrschen, dann hierher |

!!! warning "Merksatz"
    **Compose ist für einen Rechner, Kubernetes für viele.** Nimm nicht die Kanone für den Spatz – aber wenn „darf nie ausfallen“ und „muss mitwachsen“ zusammenkommen, ist Kubernetes genau das richtige Werkzeug.

---

## Was du als Nächstes tust

Bevor wir installieren, brauchst du ein paar **Begriffe** – Pod, Deployment, Service, Node. Die klären wir auf der nächsten Seite mit Bildern, dann richten wir einen kleinen Cluster auf deinem Rechner ein und legen los.

---

## Weiter

- [Grundbegriffe](02-grundbegriffe.md) – das Vokabular, das du gleich brauchst
