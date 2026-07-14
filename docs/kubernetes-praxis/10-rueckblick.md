---
title: "Rückblick & Ausblick"
description: "Was du in diesem Kubernetes-Block mitnimmst – die drei wichtigsten Merksätze und wie es von hier aus weitergeht."
---

# Rückblick & Ausblick

Aus „ich starte einen Container von Hand“ ist „ich beschreibe einen Soll-Zustand und der Cluster hält ihn“ geworden. Das ist der eigentliche Sprung, den du in diesem Block gemacht hast – der Rest sind Werkzeuge dazu.

---

## Was du gelernt hast

Du hast einen echten kleinen Cluster bedient und alle wichtigen Handgriffe einmal selbst gemacht. Konkret hast du:

- einen **lokalen Cluster** eingerichtet (mit minikube, alternativ Docker Desktop) und mit `kubectl get nodes` geprüft, dass er läuft,
- mit **`kubectl`** einen **Pod** gestartet, mit `describe` und `logs` hineingeschaut und ihn per `port-forward` im Browser erreichbar gemacht,
- ein **Deployment** angelegt, es **skaliert** (`--replicas`), die **Selbstheilung** beim Löschen eines Pods beobachtet und ein **Rolling Update** samt **Rollback** erlebt,
- einen **Service** als **stabile Adresse** vor die Pods gestellt und gesehen, wie sich die **Last** cluster-intern auf mehrere Pods verteilt.

Das ist genau das Muster aus echten Betrieben – nur dass dort statt `nginxdemos/hello` deine eigenen Anwendungen über viele Server hinweg laufen. Die Befehle und die Denkweise sind dieselben.

---

## Die drei wichtigsten Merksätze

!!! quote "Mitnehmen"
    1. **Du beschreibst den Soll-Zustand, Kubernetes hält ihn.** Du sagst *was* laufen soll – nicht *wie* du es startest. Den Abgleich von Soll und Ist macht der Cluster dauerhaft von selbst.
    2. **Pods sind sterblich, der Service ist stabil.** Ein Pod kann jederzeit verschwinden und kommt mit neuer IP zurück. Verlass dich nie auf einen einzelnen Pod – verlass dich auf den Service davor.
    3. **Das Deployment heilt und skaliert von selbst.** Stirbt ein Pod, kommt automatisch Ersatz. Brauchst du mehr, änderst du eine Zahl. Beides ohne Handarbeit.

---

## Wie es weitergeht

Du hast den Kern in der Hand. Von hier führen mehrere Wege weiter – jeder ein eigenes Thema für sich:

!!! tip "Direkt weiter: Teil 2 – betriebsreif machen"
    Der nächste Schritt baut genau auf diesem Block auf: [Kubernetes – Aufbau](../kubernetes-aufbau/index.md). Dort machst du dein Deployment **betriebsreif** – Konfiguration und Geheimnisse aus dem Image lösen (**ConfigMap & Secret**), Kubernetes prüfen lassen, ob die App gesund ist (**Health-Probes**) und den Ressourcenhunger begrenzen (**Requests & Limits**). Wieder Hands-on auf demselben minikube.

!!! info "Ab hier: vom Laptop in die Cloud"
    Den Einstieg – Pod, Deployment, Service – hast du komplett auf deinem eigenen **minikube** gemacht – mehr braucht es dafür auch nicht. Die **weiterführende Praxis** verlangt aber mehr Leistung als ein Laptop: mehrere echte Knoten, `LoadBalancer`-Dienste mit echter Adresse, **Ingress** mit echtem DNS oder ein **Managed Kubernetes** in der Cloud. Diese Schritte üben wir nicht mehr lokal, sondern in den **Hands-on-Cloud-Labs der Lernplattform** – dort steht ein echter Cloud-Cluster bereit, ohne lokale Installation und ohne dass jemand eine Cloud-Rechnung riskiert. Den ersten konkreten Schritt dorthin machst du auf der nächsten Seite: [In die Cloud: Kubernetes in den Hands-on-Labs](11-cloud-labs.md).

- **Einordnung & Theorie** – wann sich der Schritt zum Cluster überhaupt lohnt, klärt der Block [Orchestrierung & Verteilung](../orchestrierung/index.md).
- **Helm** – ein Paketmanager für Kubernetes, mit dem du fertige Anwendungen aus vorgefertigten Paketen installierst, statt jedes Manifest einzeln zu schreiben.
- **Ingress** – regelt das HTTP-Routing von außen, damit mehrere Services unter sauberen Adressen und Pfaden erreichbar sind, ohne für jeden ein `port-forward` zu öffnen.
- **[ConfigMaps und Secrets](../kubernetes-aufbau/02-config-und-secrets.md)** – trennen Konfiguration und Geheimnisse (Passwörter, Schlüssel) vom Image, sodass dieselbe App in verschiedenen Umgebungen anders konfiguriert läuft. Direkt zum Anfassen in [Teil 2](../kubernetes-aufbau/index.md).
- **Überwachen** – einen laufenden Cluster im Blick behalten lernst du im Block [Monitoring](../monitoring-praxis/index.md) bzw. unter [Betrieb & Verfügbarkeit](../betrieb/index.md).
- **Automatisch ausrollen** – neue Versionen per CI/CD und GitOps automatisch in den Cluster bringen, statt sie von Hand anzuwenden, zeigt der Block [CI/CD](../ci-cd/index.md).

!!! tip "Eins nach dem anderen"
    Lass dich von der Liste nicht erschlagen. Du musst nichts davon sofort können. Wichtig ist, dass du die **Landkarte** hast und weißt, wofür jeder Begriff steht, wenn er dir begegnet. Pod, Deployment, Service – darauf baut alles andere auf.

---

## Leitfrage – nochmal

> **Mein Container läuft auf meinem Rechner – wie sorge ich dafür, dass er auch dann weiterläuft, wenn etwas abstürzt, die Last steigt oder ich eine neue Version ausrollen will, ohne alles von Hand zu machen?**

Die Antwort hast du selbst gebaut:

- **Stürzt etwas ab?** Das **Deployment** merkt, dass ein Pod zum Soll fehlt und startet sofort Ersatz – Selbstheilung.
- **Steigt die Last?** Ein `kubectl scale ... --replicas=5` und der **Service** verteilt die Anfragen automatisch auf alle Pods.
- **Neue Version?** Ein `kubectl set image ...` rollt Pod für Pod aus, ohne dass der Dienst weg ist – und ein `rollout undo` holt notfalls die alte Version zurück.

Alles über `kubectl`, ohne dass du nachts um drei selbst an die Konsole musst. Genau das ist der Sprung vom einzelnen Container zum orchestrierten Betrieb.

---

## Geschafft

Du hast einen Cluster aufgesetzt, eine App eingespielt, sie skaliert, geheilt, neu ausgerollt und stabil erreichbar gemacht. Das ist ein echtes Fundament – darauf lässt sich aufbauen. Wenn du etwas nachschlagen willst, blättere ruhig zurück zum [Überblick](index.md) oder zu den [Hilfekarten](09-hilfekarten.md).
