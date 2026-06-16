---
title: "Hilfekarten"
description: "Abgestufte Hinweise fürs Troubleshooting – falscher Kontext, minikube startet nicht, Pod hängt, ImagePullBackOff, CrashLoopBackOff, port-forward, Service liefert nichts und ein sauberes Reset. Nutze sie nur, wenn du feststeckst."
---

# Hilfekarten

Hier findest du gezielte Hilfe für die typischen Stolpersteine. Jede Karte folgt demselben Muster: **Symptom** erkennen, **Ursache** verstehen, mit ein paar Befehlen **prüfen und beheben**.

!!! tip "Spielregel"
    Nutze diese Karten **nur**, wenn du wirklich feststeckst. Erst selbst überlegen, einmal `kubectl get pods` und `kubectl describe` lesen, in die Logs schauen, im Team diskutieren – **dann** aufklappen. Beim Troubleshooten lernst du am meisten.

!!! note "Erste Reflexe – fast immer einer von dreien"
    Wenn etwas hakt, hilft fast immer eine dieser drei Fragen:

    - **Rede ich mit dem richtigen Cluster?** → `kubectl config current-context` ([Karte 1](#hilfekarte-1-falscher-cluster-kontext)).
    - **Was sagt der Pod selbst?** → `kubectl get pods` und `kubectl describe pod <name>` (Events am Ende lesen).
    - **Was steht in den Logs?** → `kubectl logs <pod>`.

---

## Hilfekarte 1 – Falscher Cluster-Kontext

??? info "Aufklappen"
    **Symptom:** Befehle laufen ins Leere – `kubectl get pods` zeigt nichts oder einen Fehler, obwohl du gerade etwas gestartet hast. Oder du findest deine Pods einfach nicht wieder.

    **Ursache:** `kubectl` kann mehrere Cluster kennen (minikube, docker-desktop …). Der aktive heißt **Kontext**. Sehr häufig zeigt `kubectl` auf einen **anderen** Cluster als den, in dem du arbeitest – dann redest du am Ziel vorbei.

    **Prüfen:**

    ```bash
    kubectl config current-context     # welcher Cluster ist gerade aktiv?
    kubectl config get-contexts        # alle bekannten Kontexte
    ```

    **Beheben** – auf den gewünschten Cluster umstellen:

    ```bash
    kubectl config use-context minikube         # zu minikube
    kubectl config use-context docker-desktop   # oder zu Docker Desktop
    ```

    Danach noch einmal `kubectl get pods` – jetzt sollten deine Objekte da sein. Wenn ein Befehl ins Leere läuft: **immer zuerst hier nachsehen.**

---

## Hilfekarte 2 – minikube startet nicht

??? info "Aufklappen"
    **Symptom:** `minikube start --driver=docker` bricht ab oder hängt sehr lange, ohne fertig zu werden.

    **Ursache:** Meist läuft **Docker nicht** (minikube braucht es als Unterbau), der Cluster steckt in einem kaputten Zustand fest, oder es ist zu wenig Arbeitsspeicher frei.

    **Prüfen – läuft Docker überhaupt?**

    ```bash
    docker info        # gibt Infos aus = Docker läuft; Fehler = Docker starten
    ```

    Unter Windows/macOS: **Docker Desktop** öffnen und warten, bis das Wal-Symbol „Engine running" zeigt. Erst dann minikube starten.

    **Beheben – sauberer Neustart:**

    ```bash
    minikube delete
    minikube start --driver=docker
    ```

    **Mehr Ressourcen geben**, falls der Rechner knapp ist:

    ```bash
    minikube start --driver=docker --memory=4096 --cpus=2
    ```

    **Was steckt dahinter?** minikube schreibt seine Diagnose mit:

    ```bash
    minikube logs
    ```

    !!! warning "Genug RAM frei?"
        minikube braucht ein paar Gigabyte für die Cluster-VM. Schließe speicherhungrige Programme, wenn der Start mit einer Speicher-Meldung scheitert.

---

## Hilfekarte 3 – Pod hängt in Pending oder ContainerCreating

??? info "Aufklappen"
    **Symptom:** In `kubectl get pods` steht ein Pod dauerhaft auf `Pending` oder `ContainerCreating`, statt auf `Running`.

    **Ursache:** Häufig ist das **kein Fehler**, sondern Geduld: Beim **ersten Mal** lädt der Cluster das benötigte Image (z.B. `nginxdemos/hello` oder `nginx`) aus dem Internet herunter – das dauert einen Moment. Seltener fehlen dem Cluster Ressourcen, um den Pod zu platzieren.

    **Prüfen** – die wichtigste Frage immer zuerst: **Was sagt der Pod selbst?**

    ```bash
    kubectl get pods
    kubectl describe pod <pod-name>
    ```

    Ganz **unten** bei `describe` stehen die **Events** – sie erzählen in Klartext, was gerade passiert („Pulling image…", „Successfully pulled…", „Scheduled…").

    **Beheben:**

    - Steht dort, dass gerade das Image gezogen wird → einfach **warten** und mit `kubectl get pods` noch einmal nachsehen.
    - Geht es um zu wenig Ressourcen → minikube mit mehr Speicher neu starten ([Karte 2](#hilfekarte-2-minikube-startet-nicht)).
    - Bleibt es bei einem **Image-Fehler** in den Events → weiter zu [Karte 4](#hilfekarte-4-imagepullbackoff-oder-errimagepull).

    !!! tip "Live zusehen"
        Mit `kubectl get pods -w` (Watch) verfolgst du, wie der Pod den Zustand wechselt. Mit `Ctrl+C` beendest du das Beobachten wieder.

---

## Hilfekarte 4 – ImagePullBackOff oder ErrImagePull

??? info "Aufklappen"
    **Symptom:** `kubectl get pods` zeigt `ErrImagePull` oder `ImagePullBackOff`. Der Pod kommt nicht hoch, weil sein **Image nicht geladen** werden kann.

    **Ursache:** Fast immer ein **Tippfehler im Image-Namen oder Tag** – oder gerade **kein Internet**, um das Image herunterzuladen.

    **Prüfen** – der Grund steht wieder in den Events:

    ```bash
    kubectl describe pod <pod-name>
    ```

    Achte auf eine Zeile wie `Failed to pull image "..."`. Dort siehst du genau, **welchen** Namen Kubernetes vergeblich gesucht hat.

    **Beheben:**

    - **Image-Namen genau prüfen.** Je nach Übung ist richtig: `nginxdemos/hello:latest` (Praxis 1) oder `nginx:1.27-alpine` (Praxis 2 und 3). Vergleiche Zeichen für Zeichen mit dem Manifest – ein verrutschter Buchstabe oder ein falscher Tag genügt.
    - **Internet testen:** Lädt sonst etwas? `minikube` braucht eine Verbindung, um das Image beim ersten Mal zu holen.
    - Manifest **korrigiert** und neu anwenden:

    ```bash
    kubectl apply -f manifests/hello-deployment.yaml
    ```

    !!! note "Kurz erklärt: das BackOff"
        Das `…BackOff` heißt: Kubernetes hat es schon mehrfach versucht und wartet jetzt **zwischen** den Versuchen immer länger. Sobald der Name stimmt (oder das Netz wieder da ist), zieht es das Image beim nächsten Versuch von selbst.

---

## Hilfekarte 5 – CrashLoopBackOff

??? info "Aufklappen"
    **Symptom:** `kubectl get pods` zeigt `CrashLoopBackOff`, die Spalte `RESTARTS` zählt nach oben. Der Container **startet, stürzt sofort ab, startet neu** – immer im Kreis.

    **Ursache:** Anders als bei [Karte 4](#hilfekarte-4-imagepullbackoff-oder-errimagepull) ist das Image **da** – aber die **Anwendung darin** beendet sich gleich wieder. Das ist ein **Anwendungsfehler** im Container (falsche Konfiguration, fehlende Datei, ein Befehl, der sofort beendet).

    **Prüfen** – jetzt helfen die **Logs** weiter, nicht `describe`:

    ```bash
    kubectl logs <pod-name>              # was gibt der Container aus, bevor er stirbt?
    kubectl logs <pod-name> --previous   # die Ausgabe des ABGESTÜRZTEN Vorgängers
    ```

    `--previous` ist der Trick: Der aktuelle Container ist vielleicht noch zu jung, aber sein abgestürzter Vorgänger hat die eigentliche Fehlermeldung hinterlassen.

    **Beheben:** Die Logs nennen den Grund (z.B. „config not found", „permission denied"). Behebe die Ursache im Manifest oder Image – danach neu anwenden:

    ```bash
    kubectl apply -f manifests/hello-deployment.yaml
    ```

    !!! tip "In den Übungen selten"
        Unsere Beispiel-Images (`nginxdemos/hello`, `nginx`) laufen stabil. `CrashLoopBackOff` siehst du hier am ehesten, wenn ein eigenes Manifest etwas Falsches startet – die Karte ist fürs echte Leben gedacht, wo es dein häufigster Begleiter wird.

---

## Hilfekarte 6 – port-forward klappt nicht

??? info "Aufklappen"
    **Symptom:** `kubectl port-forward …` bricht ab, oder <http://localhost:8080> zeigt nichts an.

    **Ursache & Lösung** – drei häufige Fälle, der Reihe nach durchgehen:

    **1. Der Pod ist noch nicht bereit.** port-forward funktioniert nur zu einem Pod, der wirklich läuft.

    ```bash
    kubectl get pods
    ```

    Status muss `Running` und `READY` `1/1` sein. Steht er auf `Pending`/`ContainerCreating` → [Karte 3](#hilfekarte-3-pod-hangt-in-pending-oder-containercreating). Steht er auf `…BackOff` → [Karte 4](#hilfekarte-4-imagepullbackoff-oder-errimagepull) bzw. [Karte 5](#hilfekarte-5-crashloopbackoff).

    **2. Falscher Ziel-Port.** Die Reihenfolge ist `LOKAL:ZIEL`. Unser Container lauscht auf **80**, also:

    ```bash
    kubectl port-forward deployment/hello 8080:80
    ```

    `8080:80` heißt: „Schick alles von meinem `localhost:8080` an Port `80` im Pod." Drehst du die Zahlen um, kommt nichts an.

    **3. Das Terminal muss offen bleiben.** port-forward läuft **so lange, wie das Fenster offen ist**. Schließt du es oder drückst `Ctrl+C`, ist die Verbindung weg. Lass es während des Übens einfach laufen und öffne ein **zweites** Terminal für andere Befehle.

    !!! tip "Lokaler Port schon belegt?"
        Meldung wie „address already in use" oder „bind: Only one usage of each socket address"? Dann nutzt ein anderes Programm den Port `8080`. Wähle einfach einen anderen **linken** Port – das Ziel `80` bleibt gleich:

        ```bash
        kubectl port-forward deployment/hello 8081:80
        ```

        Dann im Browser <http://localhost:8081>.

---

## Hilfekarte 7 – Service liefert nichts (Labels und Selektor)

??? info "Aufklappen"
    **Symptom:** Der Pod läuft, aber über den **Service** kommt keine Antwort (z.B. der Load-Test aus [Praxis 3](08-praxis-service.md) bleibt leer).

    **Ursache:** Ein Service findet seine Pods über **Labels**. Sein **Selektor** muss zu den **Labels der Pods** passen. Stimmen sie nicht überein, zeigt der Service ins Leere – er hat schlicht **keinen** Pod, an den er weiterleiten könnte.

    **Prüfen** – die schnellste Diagnose sind die **Endpoints** des Service:

    ```bash
    kubectl get endpoints hello
    ```

    - Stehen dort **IP-Adressen** (z.B. `10.x.x.x:80`) → der Service hat seine Pods gefunden, das Problem liegt woanders.
    - Ist die Spalte **leer** (`<none>`) → **kein** Pod passt zum Selektor. Genau das ist die Ursache.

    **Selektor und Labels vergleichen:**

    ```bash
    kubectl describe service hello       # Zeile "Selector:" lesen – z.B. app=hello
    kubectl get pods --show-labels       # tragen die Pods genau dieses Label?
    ```

    **Beheben:** Beides muss übereinstimmen. In unseren Manifesten ist das durchgehend `app: hello` – im Service unter `selector:` und beim Pod bzw. im Deployment-`template` unter `labels:`. Korrigiere die Abweichung im Manifest und wende es neu an:

    ```bash
    kubectl apply -f manifests/hello-service.yaml
    ```

    !!! note "Kurz erklärt: Endpoints sind der Spiegel"
        Die **Endpoints** sind die Liste der Pods, die hinter einem Service hängen. Kubernetes pflegt sie automatisch: Jeder Pod, dessen Labels zum Selektor passen, taucht hier auf. Eine **leere** Endpoint-Liste ist deshalb das klarste Zeichen, dass Selektor und Labels nicht zueinanderpassen.

---

## Hilfekarte 8 – Sauberes Reset

??? warning "Aufklappen – nur wenn du wirklich aufräumen willst"
    Manchmal ist der schnellste Weg, **alles wegzuwerfen** und neu zu beginnen.

    **Sanft – nur die Übungs-Objekte entfernen** (Cluster bleibt stehen):

    ```bash
    kubectl delete deployment,service hello
    ```

    Das löscht Deployment **und** Service `hello` in einem Rutsch. Einen einzelnen Pod aus Praxis 1 entfernst du mit `kubectl delete pod hello`. Über die Manifeste geht es genauso:

    ```bash
    kubectl delete -f manifests/hello-service.yaml -f manifests/hello-deployment.yaml
    ```

    !!! danger "Vorsicht mit dem großen Besen"
        `kubectl delete all --all` löscht **alle** Objekte im aktuellen Namespace. Das ist nur im **reinen Übungs-Cluster** vertretbar – niemals auf einem Cluster, auf dem noch etwas anderes läuft. Vergewissere dich vorher mit `kubectl config current-context`, dass du auf `minikube` (bzw. `docker-desktop`) bist.

    **Hart – den ganzen Cluster neu** (löscht wirklich alles, inkl. der Cluster-VM):

    ```bash
    minikube delete
    minikube start --driver=docker
    ```

    Danach hast du einen frischen, leeren Cluster – wie nach der Installation. Du musst die Manifeste dann neu anwenden.

---

## Weiter

- Zurück zu den Praxis-Seiten: [Praxis 1: Hello World](04-praxis-hello-world.md) · [Praxis 2: Deployment](06-praxis-deployment.md) · [Praxis 3: Service](08-praxis-service.md)
- [Rückblick & Ausblick](10-rueckblick.md) – was du mitnimmst und wie es weitergeht
