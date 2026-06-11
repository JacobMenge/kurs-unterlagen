---
title: "Kubernetes – Hands-on von Grund auf"
description: "Kubernetes praktisch von null: warum man Container orchestriert, die Grundbegriffe (Pod, Deployment, Service, Node), Installation für Windows/macOS/Linux und drei angeleitete Praxis-Übungen von Hello World bis zum skalierten Service – im Wechsel aus Theorie und Praxis."
---

# Kubernetes – Hands-on von Grund auf

In diesem Block lernst du **Kubernetes** – das Werkzeug, mit dem man Container nicht mehr auf **einem** Rechner, sondern über einen ganzen **Verbund von Rechnern** laufen lässt, automatisch neu startet, skaliert und erreichbar hält. Es ist der Standard, mit dem heute praktisch jeder größere Online-Dienst betrieben wird.

Du brauchst kein Vorwissen außer **Docker** – Container, Image, Port hast du dort schon kennengelernt. Wir bauen exakt darauf auf und gehen Schritt für Schritt vor: **immer ein kurzer Theorieteil, dann gleich Praxis** – und dann wieder Theorie, wieder Praxis. So sammelt sich der Stoff nicht an, sondern jedes neue Konzept probierst du sofort selbst aus.

!!! info "Womit wir üben"
    Damit wir etwas Sichtbares haben, starten wir eine **winzige Beispiel-Anwendung** im Cluster: ein fertiges Web-Image, das den **Pod-Namen** anzeigt, der eine Anfrage beantwortet hat. Genau das macht später anschaulich, was Kubernetes für dich tut – ein Pod stirbt und kommt von selbst zurück, aus einem werden drei – und Anfragen verteilen sich automatisch über alle. Die Technik dahinter ist exakt die, die man auf echten Servern einsetzt.

---

## Was du in diesem Block lernst

- **warum** ein einzelner Container (oder ein Compose-Stack) irgendwann nicht mehr reicht
- die **Grundbegriffe**: Cluster, Node, **Pod**, **Deployment**, **Service** – einfach erklärt, mit Bildern
- den Kern-Gedanken **Soll-Zustand**: du beschreibst, *was* laufen soll – Kubernetes sorgt dafür, dass es so bleibt
- wie du einen **lokalen Cluster** auf deinem eigenen Rechner einrichtest (Windows, macOS, Linux)
- wie du mit **`kubectl`** Pods startest, in sie hineinschaust und sie erreichbar machst
- wie **Selbstheilung**, **Skalierung** und **Rolling Updates** in der Praxis aussehen
- wie ein **Service** mehrere Pods unter einer stabilen Adresse bündelt und die Last verteilt

---

## So ist dieser Block aufgebaut

Der rote Faden ist ein **Wechsel aus Theorie und Praxis**: erst ein Konzept verstehen, dann sofort anfassen.

```mermaid
flowchart LR
  T1["Theorie<br/>Warum & Grundbegriffe"] --> I["Installation<br/>(Win/Mac/Linux)"]
  I --> P1["Praxis 1<br/>Hello World"]
  P1 --> T2["Theorie<br/>Deployments"]
  T2 --> P2["Praxis 2<br/>Skalieren & Heilen"]
  P2 --> T3["Theorie<br/>Services"]
  T3 --> P3["Praxis 3<br/>Service & Last"]
```

| Seite | Inhalt | Art |
|-------|--------|-----|
| [Warum Kubernetes?](01-warum-kubernetes.md) | Vom einzelnen Container zum Cluster; was Kubernetes abnimmt | Theorie |
| [Grundbegriffe](02-grundbegriffe.md) | Cluster, Node, Pod, Deployment, Service – mit Illustrationen | Theorie |
| [Installation](03-installation.md) | Lokalen Cluster einrichten – Schritt für Schritt für Windows, macOS, Linux | Einrichtung |
| [Praxis 1: Hello World](04-praxis-hello-world.md) | Ersten Pod starten, hineinschauen, erreichbar machen | Praxis |
| [Deployments & Skalierung](05-deployments-skalierung.md) | Soll-Zustand, Selbstheilung, Skalierung, Rolling Update | Theorie |
| [Praxis 2: Deployment](06-praxis-deployment.md) | Deployment anlegen, skalieren, einen Ausfall heilen, neu ausrollen | Praxis |
| [Services & Netzwerk](07-services-netzwerk.md) | Warum Pods sterblich sind; Service, Labels, Load-Balancing | Theorie |
| [Praxis 3: Service](08-praxis-service.md) | Service anlegen, App erreichbar machen, Last auf viele Pods verteilen | Praxis |
| [Hilfekarten](09-hilfekarten.md) | Abgestufte Hinweise, wenn etwas hakt | Referenz |
| [Rückblick & Ausblick](10-rueckblick.md) | Was du mitnimmst und wie es weitergeht | Referenz |

!!! tip "Für heute"
    Wir starten mit den ersten beiden Theorieseiten und der Installation, danach geht es in **Praxis 1**. Jede Praxis-Seite ist so geschnitten, dass sie dich rund **eine bis anderthalb Stunden** beschäftigt – mit einer komplett angeleiteten Übung und einer Aufgabe zum Selbermachen (Lösung ist dabei).

---

## Voraussetzungen

- Ein Rechner mit **Windows, macOS oder Linux**, auf dem du Programme installieren darfst.
- **Docker** sollte laufen – wir nutzen es als Unterbau für den lokalen Cluster. Falls noch nicht: [Docker installieren](../docker/installation.md).
- Internet, um die Werkzeuge und das Beispiel-Image zu laden.
- Alles Weitere richtest du auf der Seite [Installation](03-installation.md) ein.

!!! note "Wie dieser Block zur Theorie passt"
    Den prüfungsnahen Überblick zur Einordnung („wann lohnt sich der Schritt zum Cluster?") findest du im Block [Orchestrierung & Verteilung](../orchestrierung/index.md). **Hier** geht es ums **Anfassen**: einen echten kleinen Cluster auf deinem Rechner, den du selbst bedienst.

---

## Leitfrage

> **Mein Container läuft auf meinem Rechner – wie sorge ich dafür, dass er auch dann weiterläuft, wenn etwas abstürzt, die Last steigt oder ich eine neue Version ausrollen will, ohne alles von Hand zu machen?**

Wer das am Ende mit ein paar `kubectl`-Befehlen beantworten kann, hat den Sprung vom einzelnen Container zum orchestrierten Betrieb verstanden.

---

## Weiter

- [Warum Kubernetes?](01-warum-kubernetes.md) – der Einstieg
