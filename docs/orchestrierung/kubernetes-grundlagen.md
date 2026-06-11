---
title: "Container-Orchestrierung (Kubernetes)"
description: "Warum ein einzelner Container irgendwann nicht mehr reicht: die Grundbegriffe von Kubernetes (Pod, Deployment, Service, Node), Skalierung von Container-Workloads und die Abgrenzung von Docker Compose zu Kubernetes."
---

# Container-Orchestrierung (Kubernetes)

<span class='badge badge-vertiefung'>Vertiefung</span> &nbsp; Ein Container auf deinem Laptop ist einfach – aber was, wenn du hundert davon über zehn Server verteilen, überwachen und automatisch neu starten lassen musst?

!!! tip "Lieber gleich anfassen? Der Hands-on-Block"
    Diese Seite gibt den **prüfungsnahen Überblick** zur Einordnung. Wenn du Kubernetes **selbst ausprobieren** willst – einen echten kleinen Cluster auf deinem Rechner einrichten und mit `kubectl` bedienen –, geh in den Praxis-Block **[Praxis: Kubernetes](../kubernetes-praxis/index.md)**. Dort baust du Schritt für Schritt von „Hello World“ bis zum skalierten Service, im Wechsel aus Theorie und Praxis.

!!! note "Status: Überblick <span class='badge badge-wip'>in Arbeit</span>"
    Diese Theorieseite ist noch knapp gehalten – hier siehst du schon, **was behandelt wird** und **worauf es ankommt**. Die ausführliche Praxis steht im [Hands-on-Block](../kubernetes-praxis/index.md) bereit.

## Das wird hier behandelt

- **warum Orchestrierung** überhaupt nötig ist: der Weg **vom einzelnen Container zum Cluster** – mehrere Server, automatischer Neustart bei Ausfall, gleichmäßige Lastverteilung
- die **Kubernetes-Grundbegriffe** im Überblick:
    - **Pod** – die kleinste Einheit, ein oder mehrere eng zusammengehörige Container
    - **Deployment** – beschreibt den **Soll-Zustand**: „halte mir 3 Kopien davon am Laufen“
    - **Service** – die **stabile Adresse**, unter der ein Pod erreichbar bleibt, auch wenn er neu startet
    - **Node** – ein einzelner **Rechner** (Server) im Cluster, auf dem Pods laufen
- **Skalierung und Verwaltung** von Container-Workloads – von einer auf viele Instanzen, automatisch je nach Last
- die **Abgrenzung** von [Docker Compose](../docker-compose/index.md) (ein einzelner Rechner, *Single-Host*) gegenüber **Kubernetes** (ein ganzer Verbund, *Cluster*)

## Worauf es ankommt

Der Kern in einem Satz: **Docker Compose ist für einen Rechner, Kubernetes für viele.** Compose bündelt deine Container auf **einem** Host – fällt dieser Host aus, ist alles weg. Kubernetes verteilt dieselben Container über **viele** Knoten und sorgt selbstständig dafür, dass der gewünschte Zustand erhalten bleibt: Stirbt ein Pod, startet er woanders neu. Du musst Kubernetes nicht bedienen können – du sollst **einordnen**, wann der Schritt vom einzelnen Host zum Cluster Sinn ergibt.

!!! tip "Brücke vom Compose-Block"
    Wenn du die `compose.yaml` aus dem [Compose-Block](../docker-compose/index.md) im Kopf hast, kennst du das Prinzip schon: einen Zustand **deklarativ** beschreiben. Kubernetes macht dasselbe – nur für viele Rechner statt für einen.
