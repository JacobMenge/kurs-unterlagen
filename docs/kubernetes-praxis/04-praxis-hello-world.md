---
title: "Praxis 1: Hello World – dein erster Pod"
description: "Angeleitete erste Praxis: einen einzelnen Pod starten, seinen Status verfolgen, mit describe und logs hineinschauen, per exec einsteigen, mit port-forward im Browser erreichbar machen und wieder löschen – dazu eine Aufgabe zum Selbermachen mit Lösung."
---

# Praxis 1: Hello World – dein erster Pod

Jetzt fasst du an, was du auf den letzten Seiten gelesen hast. Wir starten den **kleinsten Baustein** von Kubernetes – einen einzelnen **Pod** – schauen hinein, machen ihn im Browser erreichbar und löschen ihn am Ende wieder. Ganz bewusst nehmen wir hier noch **keinen** Manager (kein Deployment), damit du am Ende einen Effekt mit eigenen Augen siehst: ein Pod ohne Manager kommt **nicht** von allein zurück. Das ist der rote Faden zu Praxis 2.

Diese Übung machst du **allein oder zu zweit**, sie dauert rund **60 bis 90 Minuten**. Alles ist komplett angeleitet – Befehl, erwartete Ausgabe, kurze Erklärung. Am Ende kommt eine Aufgabe, die du selbst löst (die Lösung liegt zum Aufklappen dabei).

!!! info "Voraussetzung"
    Dein Cluster läuft und die [Installation](03-installation.md) ist erledigt. Kurzer Beweis – im Terminal:

    ```bash
    kubectl get nodes
    ```

    Du musst **eine** Zeile mit Status `Ready` sehen. Falls nicht – oder falls `kubectl` ins Leere läuft – schau in die [Installation](03-installation.md) zurück bzw. zu den [Hilfekarten](09-hilfekarten.md). Docker Desktop muss laufen, der Cluster ebenfalls (`minikube start --driver=docker`).

    !!! tip "Rechner zwischendurch neu gestartet?"
        Nach einem Neustart ist der Cluster meist **gestoppt** (nicht gelöscht). Ein einfaches `minikube start` holt ihn ohne Datenverlust zurück – du musst nichts neu installieren.

---

## Warm-up: Cluster wach?

Bevor wir starten, zwei kurze Kontrollblicke. Erst der Knoten:

```bash
kubectl get nodes
```

```text
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   8m    v1.xx.x
```

Wichtig ist die Spalte **STATUS** – sie muss `Ready` sein. (Bei Docker Desktop heißt der Knoten `docker-desktop` statt `minikube` – das ist derselbe gute Zustand.)

Dann ein Blick auf die Pods im Standard-Namespace:

```bash
kubectl get pods
```

```text
No resources found in default namespace.
```

Das sieht nach Fehler aus, ist aber genau richtig: Der Cluster ist **leer**, du hast noch nichts gestartet. Gleich steht hier dein erster Pod.

!!! note "Kurz erklärt: Namespace"
    Kubernetes sortiert Objekte in **Namespaces** – das sind getrennte Schubladen im selben Cluster. Ohne weitere Angabe landet alles im Namespace `default` – dort arbeiten wir den ganzen Block. Die System-Pods des Clusters liegen in einer eigenen Schublade (`kube-system`) – die siehst du nur mit `kubectl get pods -A`, sie geht dich hier aber nichts an.

---

## Schritt für Schritt: dein erster Pod

Ab hier wird jeder Schritt vorgemacht. Tipp den Befehl, vergleich die Ausgabe mit dem hier gezeigten Beispiel – und lies danach die kurze Erklärung.

**Schritt 1 – den Pod starten.** Ein einziger Befehl erzeugt einen Pod mit unserem Beispiel-Image:

```bash
kubectl run hello --image=nginxdemos/hello:latest --port=80
```

```text
pod/hello created
```

Das liest sich fast wie ein `docker run`, nur mit `kubectl run`. Was die Teile bedeuten:

- `hello` – der **Name**, den der Pod bekommt.
- `--image=nginxdemos/hello:latest` – das **Container-Image** in der Form `Name:Version` (`:latest` = die neueste). Es ist eine winzige Webseite, die später den **Namen des antwortenden Pods** anzeigt – genau das macht in den nächsten Praxisteilen sichtbar, was Kubernetes für dich tut.
- `--port=80` – sagt Kubernetes, dass der Container intern auf **Port 80** lauscht. Das brauchst du in Schritt 6, um den Pod im Browser zu öffnen.

!!! note "Kurz erklärt: `kubectl run`"
    `kubectl run` ist der schnellste Weg zu **einem einzelnen Pod** – ideal zum Ausprobieren und Lernen. Du gibst direkt auf der Kommandozeile an, was laufen soll, statt eine YAML-Datei zu schreiben. Für den echten Betrieb nimmt man später ein Deployment (Praxis 2) – aber zum Kennenlernen ist der einzelne Pod genau das Richtige.

??? info "Dasselbe als Manifest (zum Wiedererkennen)"
    Derselbe Pod steckt fertig in `manifests/hello-pod.yaml`. Du musst ihn hier nicht anwenden – aber schau ihn dir an, damit du die vier Felder aus den [Grundbegriffen](02-grundbegriffe.md#deklarativ-das-yaml-manifest) wiedererkennst:

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: hello
      labels:
        app: hello
    spec:
      containers:
        - name: hello
          image: nginxdemos/hello:latest   # zeigt den Pod-Namen auf der Seite an
          ports:
            - containerPort: 80
    ```

    `kubectl run` von oben und ein `kubectl apply -f manifests/hello-pod.yaml` führen zum **gleichen** Ergebnis. Mit Manifesten arbeiten wir ab Praxis 2 durchgehend.

---

**Schritt 2 – den Status verfolgen.** Schau gleich nach, was passiert:

```bash
kubectl get pods
```

Direkt nach dem Start steht der Pod oft noch auf `ContainerCreating` – Kubernetes lädt das Image und richtet den Container ein:

```text
NAME    READY   STATUS              RESTARTS   AGE
hello   0/1     ContainerCreating   0          3s
```

Ein paar Sekunden später (Befehl einfach nochmal ausführen) steht er auf `Running`:

```text
NAME    READY   STATUS    RESTARTS   AGE
hello   1/1     Running   0          15s
```

Mehr Details bekommst du mit `-o wide` (kurz für `--output wide`, also „breitere Ausgabe“) – darunter der **Node**, auf dem der Pod läuft, sowie seine **Pod-IP** im Cluster:

```bash
kubectl get pods -o wide
```

```text
NAME    READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
hello   1/1     Running   0          30s   10.244.0.8   minikube   <none>           <none>
```

Statt immer neu zu tippen, kannst du Kubernetes **live** zuschauen – `-w` steht für „watch":

```bash
kubectl get pods -w
```

Jede Statusänderung erscheint als neue Zeile. Beende die Beobachtung mit **`Ctrl+C`**.

!!! note "Kurz erklärt: die Status-Phasen eines Pods"
    Ein Pod durchläuft typische Phasen: **`Pending`** (Kubernetes sucht einen Platz), **`ContainerCreating`** (Image wird geladen, Container eingerichtet), dann **`Running`** (läuft). Die Spalte **READY** sagt zusätzlich, wie viele Container im Pod bereit sind – `1/1` heißt „einer von einem läuft". Bleibt ein Pod lange in `Pending` oder `ContainerCreating` hängen, hilft die [Hilfekarte 3](09-hilfekarten.md#hilfekarte-3-pod-hangt-in-pending-oder-containercreating).

---

**Schritt 3 – Details und Ereignisse lesen.** Wenn du wissen willst, *was genau* mit einem Pod passiert ist, fragst du nach den Details:

```bash
kubectl describe pod hello
```

Das ist eine lange Ausgabe. Interessant ist vor allem das **Ende** – der Abschnitt **`Events`**. Dort steht in Klartext, was Kubernetes Schritt für Schritt getan hat:

```text
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  45s   default-scheduler  Successfully assigned default/hello to minikube
  Normal  Pulling    44s   kubelet            Pulling image "nginxdemos/hello:latest"
  Normal  Pulled     40s   kubelet            Successfully pulled image "nginxdemos/hello:latest"
  Normal  Created    40s   kubelet            Created container hello
  Normal  Started    40s   kubelet            Started container hello
```

Lies das von oben nach unten wie ein Protokoll: **Scheduled** (auf einen Node gelegt) → **Pulling/Pulled** (Image geholt) → **Created/Started** (Container gestartet).

!!! note "Kurz erklärt: `describe` als erste Anlaufstelle"
    `kubectl describe` zeigt **alle Details plus die Ereignisse** zu einem Objekt. Wenn etwas hakt – ein Pod startet nicht, ein Image lässt sich nicht laden – ist `describe` fast immer der erste Griff: die `Events` am Ende verraten den Grund (z.B. `ImagePullBackOff`, wenn der Image-Name falsch ist). Merk dir das Muster `kubectl describe <ressource> <name>`.

---

**Schritt 4 – in die Logs schauen.** Was gibt der Container selbst aus? Genau wie bei Docker fragst du die Logs ab:

```bash
kubectl logs hello
```

```text
/docker-entrypoint.sh: Configuration complete; ready for start up
```

Bei diesem nginx-Image ist die Startausgabe knapp – sobald du den Pod gleich im Browser aufrufst, erscheinen hier zusätzlich die Zugriffszeilen.

!!! note "Kurz erklärt: `logs` wie `docker logs`"
    `kubectl logs <pod>` zeigt die Ausgabe (stdout/stderr) des Containers – das kennst du eins zu eins von `docker logs`. Praktische Zusätze: `kubectl logs -f hello` folgt den Logs live (mit `Ctrl+C` beenden) und `kubectl logs --tail=20 hello` zeigt nur die letzten 20 Zeilen.

---

**Schritt 5 – in den Pod hineingehen.** Du kannst dir eine Shell **im** laufenden Container holen:

```bash
kubectl exec -it hello -- sh
```

Kurz zur Schreibweise: `-it` macht die Sitzung **interaktiv** (du kannst darin tippen). Das `--` trennt die `kubectl`-Optionen von dem Befehl, der **im** Container laufen soll – hier `sh` (eine einfache Shell).

Der Prompt wechselt – jetzt bist du **im** Container. Probier zwei Befehle aus:

```bash
hostname
ls
```

```text
hello
bin   dev   etc   home  ...
```

Der `hostname` ist `hello` – also **genau der Pod-Name**. Genau das macht das Image gleich auch auf der Webseite sichtbar. Verlasse den Container wieder mit:

```bash
exit
```

!!! note "Kurz erklärt: `exec` wie `docker exec`"
    `kubectl exec` öffnet eine Shell **im** laufenden Container – genau wie `docker exec`. Wichtig fürs Verständnis: Der **Hostname im Pod ist der Pod-Name**. Deshalb erkennst du später beim Load-Balancing sofort, welcher Pod geantwortet hat.

!!! warning "Nicht den Pod selbst beenden"
    `exit` verlässt nur die Shell – der Pod läuft weiter. Tippst du dagegen aus Versehen im **Host**-Terminal `exit`, schließt du nur dein Terminalfenster, nicht den Pod. Den Pod löschen wir erst ganz am Ende, ganz bewusst.

---

**Schritt 6 – im Browser erreichbar machen.** Der Pod läuft, hat aber nur eine **cluster-interne** IP. Damit du ihn im Browser siehst, baust du dir mit `port-forward` einen Tunnel von deinem Rechner in den Cluster:

```bash
kubectl port-forward pod/hello 8080:80
```

```text
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

Zwei Dinge zur Schreibweise: `pod/hello` ist die Langform `Ressourcentyp/Name` – sie sagt eindeutig „der **Pod** namens hello“ (kurz `hello` würde meist auch gehen, die Langform ist nur klarer). Und `8080:80` liest sich **lokal:im-Pod** – Port `8080` auf deinem Laptop führt zu Port `80` im Container.

Lass dieses Terminal **offen** – solange es läuft, steht der Tunnel. Öffne im Browser:

> **<http://localhost:8080>**

Du siehst die Hello-Seite. Oben steht **„Server name: hello"** – das ist der Pod-Name, den du eben per `hostname` auch in der Shell gesehen hast.

```text
+-----------------------------------------+
|              Hello World                |
|                                         |
|   Server name:   hello                  |
|   Server address: 10.244.0.8:80         |
|   Date: ...                             |
+-----------------------------------------+
```

Brauchst du nebenher weitere `kubectl`-Befehle, öffne ein **zweites Terminal** – das erste bleibt für den Tunnel reserviert. Den Tunnel beendest du mit **`Ctrl+C`** im port-forward-Terminal.

!!! note "Kurz erklärt: `port-forward` ist ein lokaler Tunnel"
    `kubectl port-forward pod/hello 8080:80` verbindet **Port 8080 auf deinem Rechner** mit **Port 80 im Pod**. Anfragen an `http://localhost:8080` laufen durch diesen Tunnel direkt zum Pod. Das funktioniert auf jedem Rechner gleich – egal ob minikube oder Docker Desktop – und ist deshalb unser Standardweg, um Apps im Browser zu öffnen. Wichtig: Der Tunnel lebt nur, solange das Terminal offen ist.

!!! tip "Nichts zu sehen im Browser?"
    Wenn `localhost:8080` nichts anzeigt, ist meist der port-forward nicht (mehr) aktiv – das Terminal muss offen bleiben. Hilfe dazu in [Hilfekarte 6](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht).

---

**Schritt 7 – den Pod löschen (und der Aha-Moment).** Räum den Pod weg:

```bash
kubectl delete pod hello
```

```text
pod "hello" deleted
```

Jetzt prüf nach:

```bash
kubectl get pods
```

```text
No resources found in default namespace.
```

Der Pod ist weg – **und er bleibt weg**. Niemand startet einen neuen. Genau das ist die Lehre dieses Schritts.

!!! warning "Merksatz: ein einzelner Pod heilt sich NICHT selbst"
    Einen mit `kubectl run` (oder als reines `kind: Pod`) erzeugten Pod ersetzt Kubernetes **nicht**, wenn er stirbt oder du ihn löschst. Es gibt keinen Manager darüber, der einen Soll-Zustand wachhält. Für echten Betrieb ist das zu wenig – darum gibt es das **Deployment**. Was passiert, wenn du einen Pod löschst, der zu einem Deployment gehört? Das probierst du gleich in [Praxis 2](06-praxis-deployment.md) aus – und der Unterschied ist der ganze Kern von Kubernetes.

---

## Übungsaufgabe – noch einmal selbst

Jetzt du. Mach denselben Ablauf noch einmal allein – aber mit einem **anderen Image** und einem **anderen Namen**. So merkst du dir die Handgriffe.

!!! info "Deine Aufgabe"
    Starte einen Pod namens **`web`** mit dem Image **`nginx:1.27`** (ein schlichtes nginx, ohne Pod-Namen-Anzeige). Dann:

    1. starten und prüfen, dass er `Running` ist,
    2. einmal mit `describe` und `logs` hineinschauen,
    3. per `port-forward` auf `8080:80` im Browser erreichbar machen,
    4. mit `exec` eine Shell holen und `hostname` ausführen,
    5. zum Schluss den Pod wieder löschen.

    Versuch es erst selbst – die Befehle ähneln denen von oben, nur Name und Image ändern sich.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – starten und prüfen:**

    ```bash
    kubectl run web --image=nginx:1.27 --port=80
    kubectl get pods
    ```

    Warte, bis `web` auf `1/1 Running` steht (notfalls den `get`-Befehl wiederholen oder `kubectl get pods -w` nehmen, mit `Ctrl+C` beenden).

    **Schritt 2 – hineinschauen:**

    ```bash
    kubectl describe pod web
    kubectl logs web
    ```

    Im `describe` wieder unten die `Events` lesen (Scheduled, Pulled, Started). Die Logs sind bei nginx anfangs knapp.

    **Schritt 3 – im Browser erreichbar machen** (Terminal offen lassen):

    ```bash
    kubectl port-forward pod/web 8080:80
    ```

    Dann <http://localhost:8080> öffnen. Den Tunnel danach mit `Ctrl+C` beenden.

    **Schritt 4 – Shell holen** (am besten in einem zweiten Terminal, während der Tunnel läuft):

    ```bash
    kubectl exec -it web -- sh
    ```

    Im Container:

    ```bash
    hostname
    exit
    ```

    **Schritt 5 – aufräumen:**

    ```bash
    kubectl delete pod web
    kubectl get pods
    ```

    Danach sollte wieder `No resources found` stehen.

??? success "Erwartung"
    `web` lief auf `1/1 Running`, im Browser kam unter <http://localhost:8080> die **nginx-Standard-Willkommensseite** („Welcome to nginx!"). Anders als bei `nginxdemos/hello` zeigt dieses Image **keinen** Pod-Namen an – das ist völlig in Ordnung und sogar lehrreich: nicht jedes Image zeigt, wer geantwortet hat. Der `hostname` im Container war `web`. Nach dem Löschen ist der Pod weg und bleibt weg – genau wie bei `hello`.

---

## Geschafft

Das kannst du jetzt – die Grundhandgriffe für jeden Pod:

- einen **Pod starten** (`kubectl run`) und seinen **Status verfolgen** (`get pods`, `-o wide`, `-w`),
- **hineinschauen**: Details und Ereignisse (`describe`), Ausgabe (`logs`), Shell im Container (`exec -it ... -- sh`),
- den Pod **im Browser erreichbar machen** (`port-forward 8080:80`),
- einen Pod **löschen** – und du weißt: ein einzeln gestarteter Pod kommt nicht von allein zurück.

Damit hast du das Vokabular aus den [Grundbegriffen](02-grundbegriffe.md) zum ersten Mal angefasst. Im nächsten Theorieteil dreht sich alles um den Manager, der genau diese Lücke schließt.

---

## Wenn etwas hakt

Kein Grund zur Sorge – die häufigen Stolpersteine sind abgedeckt. Schau in die [Hilfekarten](09-hilfekarten.md): falscher Cluster-Kontext, Pod hängt in `Pending`/`ContainerCreating`, `ImagePullBackOff`, `port-forward` klappt nicht – für jeden Fall gibt es eine abgestufte Karte.

---

## Weiter

- [Deployments & Skalierung](05-deployments-skalierung.md) – jetzt kommt der Manager, der Pods am Leben hält
