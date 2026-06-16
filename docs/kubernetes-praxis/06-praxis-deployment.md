---
title: "Praxis 2: Deployment"
description: "Angeleitete Übung mit einer farbigen Demo-App: ein Deployment anlegen, im Browser öffnen, live skalieren, einen Pod-Ausfall heilen lassen, eine neue Version per Rolling Update ausrollen (die Farbe schlägt von Blau auf Grün um) und wieder zurückrollen – Schritt für Schritt, mit Vorgeschmack auf das Load-Balancing, eigener Aufgabe und Lösung."
---

# Praxis 2 – Deployment, Skalierung, Selbstheilung, Rolling Update

In [Praxis 1](04-praxis-hello-world.md) hast du einen einzelnen Pod gestartet – und gesehen, dass er **nicht** zurückkommt, wenn du ihn löschst. Jetzt machst du es richtig: Du legst ein **Deployment** an. Damit beschreibst du nur noch den **Soll-Zustand** („halte mir so viele Kopien am Laufen") – um den Rest kümmert sich Kubernetes.

Damit du dabei nicht nur Befehle tippst, sondern den Effekt mit **eigenen Augen** siehst, nehmen wir in dieser Praxis eine kleine **farbige Demo-App**. Jede Seite zeigt dir zwei Dinge: groß die **Version** und darunter den **Namen des Pods**, der gerade geantwortet hat. **Version 1 ist blau.** Wenn du später eine neue Version ausrollst, wird die Seite **grün** – du siehst den Wechsel also sofort, ganz ohne Logs zu lesen.

<figure>
<svg viewBox="0 0 640 250" width="100%" height="250" role="img" aria-label="Die Demo-App in zwei Versionen: links die blaue Version 1, rechts die gruene Version 2, dazwischen der Rolling Update">
  <!-- Fenster links: Version 1 (blau) -->
  <rect x="30" y="44" width="240" height="150" rx="8" fill="#2563a8" stroke="#1b4a82" stroke-width="1"/>
  <rect x="30" y="44" width="240" height="26" rx="8" fill="#1b4a82"/>
  <circle cx="48" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <circle cx="62" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <circle cx="76" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <text x="150" y="128" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Version 1</text>
  <text x="150" y="158" text-anchor="middle" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="11" opacity="0.92">Server name: hello-...-2xk4p</text>

  <!-- Pfeil + Beschriftung -->
  <text x="320" y="112" text-anchor="middle" fill="#7dff9a" font-size="28">&#8594;</text>
  <text x="320" y="138" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">Rolling</text>
  <text x="320" y="151" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">Update</text>

  <!-- Fenster rechts: Version 2 (gruen) -->
  <rect x="370" y="44" width="240" height="150" rx="8" fill="#2e9e5b" stroke="#1f6e40" stroke-width="1"/>
  <rect x="370" y="44" width="240" height="26" rx="8" fill="#1f6e40"/>
  <circle cx="388" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <circle cx="402" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <circle cx="416" cy="57" r="4" fill="#ffffff" opacity="0.6"/>
  <text x="490" y="128" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="26" font-weight="800">Version 2</text>
  <text x="490" y="158" text-anchor="middle" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="11" opacity="0.92">Server name: hello-...-9fghd</text>

  <text x="320" y="226" text-anchor="middle" fill="#8fa498" font-size="12">Dieselbe App, neue Version – die Farbe macht den Wechsel sichtbar.</text>
</svg>
<figcaption>Unsere Demo-App zeigt Version und Pod-Namen. Beim Rolling Update wechselt sie von Blau (Version 1) auf Grün (Version 2) – Pod für Pod, ohne Ausfall.</figcaption>
</figure>

Du wirst in dieser Übung live sehen, wie ein gelöschter Pod von selbst ersetzt wird, wie aus drei Kopien fünf werden, wie eine neue Version ohne Ausfall ausrollt – und wie du mit einem einzigen Befehl wieder zurückrollst.

!!! info "Voraussetzung"
    Dein Cluster läuft (siehe [Installation](03-installation.md)). Schneller Check:

    ```bash
    kubectl get nodes
    ```

    Erwartet: ein Node mit Status `Ready`. Außerdem brauchst du die Projektdateien lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-praxis
    ```

    Alle `kubectl apply`-Befehle gehen relativ von diesem Ordner aus (`manifests/...`).

!!! tip "Zeitrahmen"
    Plane rund **1,5 bis 2 Stunden** ein: erst die angeleitete Übung Schritt für Schritt, dann die Aufgabe zum Selbermachen. Lass dir Zeit beim Beobachten – das Zusehen *ist* der Lerneffekt. Du brauchst die Schritte nicht in einem Stück zu schaffen; zwischendurch eine Pause ist völlig in Ordnung (das Deployment läuft so lange weiter).

---

## Schritt für Schritt

Arbeite das **allein oder zu zweit** durch. Jeder Schritt schließt mit einer kurzen Einordnung, damit du nicht nur tippst, sondern verstehst, was passiert. Am besten hast du zwei Terminalfenster offen: eines bleibt später für den Tunnel (`port-forward`) reserviert, im anderen tippst du die übrigen Befehle.

### Schritt 1 – Das Deployment anlegen

Schau dir zuerst das Manifest an. Es ist dieselbe Datei, die im Projekt unter `manifests/hello-deployment.yaml` liegt. Du erkennst das **Gerüst** aus [Deployments & Skalierung](05-deployments-skalierung.md) sofort wieder: `apiVersion`, `kind`, `metadata`, `spec` mit `replicas`, `selector` und `template`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello
  labels:
    app: hello
spec:
  replicas: 3                 # gewünschte Anzahl gleicher Pods
  selector:
    matchLabels:
      app: hello              # dieses Deployment verwaltet Pods mit diesem Label
  template:                   # die Vorlage, nach der jeder Pod gebaut wird
    metadata:
      labels:
        app: hello            # jeder erzeugte Pod bekommt dieses Label
    spec:
      containers:
        - name: hello
          image: nginx:1.27-alpine        # schlankes Standard-nginx, kein eigenes Image nötig
          # --- ab hier nur "Anstrich": Version + Farbe für die Demo-Seite ---
          env:
            - name: VERSION
              value: "1"                  # Beschriftung der Seite -> "Version 1"
            - name: COLOR
              value: "#2563a8"            # Hintergrundfarbe: Blau = Version 1
          command: ["/bin/sh", "-c"]      # beim Start die Seite schreiben, dann nginx starten
          args:
            - |
              cat > /usr/share/nginx/html/index.html <<HTML
              <!doctype html><html lang="de"><head><meta charset="utf-8">
              <meta http-equiv="refresh" content="2"><title>Version $VERSION</title>
              <style>html,body{height:100%;margin:0}
              body{display:flex;flex-direction:column;align-items:center;
              justify-content:center;font-family:system-ui,sans-serif;
              background:$COLOR;color:#fff;text-align:center}
              .v{font-size:4rem;font-weight:800}
              .pod{margin-top:1rem;font-family:monospace;font-size:1.2rem;opacity:.92}</style>
              </head><body>
              <div class="v">Version $VERSION</div>
              <div class="pod">Server name: $(hostname)</div>
              </body></html>
              HTML
              exec nginx -g 'daemon off;'
          ports:
            - containerPort: 80           # der Container lauscht auf Port 80
```

Das Wichtige steht oben und kennst du schon: `replicas: 3` ist dein **Soll** – drei Kopien. Der `selector` und die Labels in der `template` müssen zusammenpassen – so weiß das Deployment, **welche** Pods zu ihm gehören.

!!! note "Den `command`-Block darfst du überfliegen"
    Alles unter `# --- ab hier nur "Anstrich" ---` ist nur Kosmetik: Es sagt dem nginx beim Start, dass er sich eine einfarbige Seite mit Versionsnummer und Pod-Namen schreiben soll. **Für das Verständnis eines Deployments brauchst du diese Zeilen nicht.** Wir nehmen diesen Weg nur, damit du keine eigene Anwendung bauen musst und die Version trotzdem **als Farbe** siehst. Wer neugierig ist, klappt die Erklärung auf:

    ??? info "Aufklappen: was die Anstrich-Zeilen tun"
        - **`env`** setzt zwei Umgebungsvariablen: `VERSION` (die Beschriftung) und `COLOR` (die Hintergrundfarbe als Hex-Wert, `#2563a8` ist ein Blau). Genau diese zwei änderst du gleich beim Rolling Update.
        - **`command` und `args`** überschreiben den Start des Containers: Er schreibt zuerst eine winzige HTML-Seite (mit Version, Farbe und `Server name: <Pod-Name>`) und startet dann nginx. Das `<meta http-equiv="refresh" content="2">` lädt die Seite alle zwei Sekunden neu – praktisch, damit du Änderungen siehst, ohne selbst F5 zu drücken.
        - Es ist **kein eigenes Image** nötig: ein Standard-`nginx:1.27-alpine` reicht, die Farbe kommt allein aus der Umgebungsvariablen.

Jetzt anwenden:

```bash
kubectl apply -f manifests/hello-deployment.yaml
```

Erwartete Ausgabe:

```text
deployment.apps/hello created
```

!!! note "Kurz erklärt: was `apply` tut"
    `kubectl apply` schickt den **Soll-Zustand** aus der Datei an den Cluster: „So soll es aussehen." Kubernetes vergleicht das mit dem Ist-Zustand und legt los – hier erzeugt es ein Deployment, dieses ein ReplicaSet und das wiederum drei Pods. Dasselbe `apply` nutzt du auch zum **Ändern**: Datei anpassen, erneut `apply` – Kubernetes gleicht den Unterschied an, statt alles neu zu bauen.

---

### Schritt 2 – Den Baum ansehen: Deployment, ReplicaSet, Pods

Lass dir die drei Ebenen auf einmal zeigen:

```bash
kubectl get deploy,rs,pods
```

Du siehst genau einen Strang: **ein** Deployment, **ein** ReplicaSet, **drei** Pods.

```text
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/hello   3/3     3            3           20s

NAME                               DESIRED   CURRENT   READY   AGE
replicaset.apps/hello-6f7c8d9b5c   3         3         3       20s

NAME                          READY   STATUS    RESTARTS   AGE
pod/hello-6f7c8d9b5c-2xk4p    1/1     Running   0          20s
pod/hello-6f7c8d9b5c-9fghd    1/1     Running   0          20s
pod/hello-6f7c8d9b5c-q7m2t    1/1     Running   0          20s
```

`READY 3/3` heißt: alle drei Pods laufen. Achte auf die **Pod-Namen** – sie beginnen mit `hello-`, dann folgt eine zufällige Kennung. Genau diesen Namen zeigt dir die Web-Seite gleich als „Server name" an.

!!! note "Kurz erklärt: die drei Ebenen"
    - **Deployment** – dein Soll-Zustand plus die Logik fürs Updaten.
    - **ReplicaSet** – das Rädchen darunter, das die Zahl hält („genau 3 Stück").
    - **Pods** – die laufenden Kopien deiner App.

    Du bedienst fast immer nur das **Deployment**. ReplicaSet und Pods entstehen daraus von selbst – darum musst du dich nicht kümmern.

---

### Schritt 3 – Die App im Browser öffnen

Jetzt willst du sehen, was da läuft. Mach das Deployment über `port-forward` erreichbar. **Dieses Terminal bleibt ab jetzt offen** – solange der Tunnel steht:

```bash
kubectl port-forward deployment/hello 8080:80
```

Das Terminal zeigt „Forwarding from 127.0.0.1:8080 -> 80" und bleibt belegt. Öffne im Browser:

> **<http://localhost:8080>**

Du siehst eine **blaue** Seite mit großer Schrift **„Version 1"** und darunter eine Zeile **„Server name: hello-…"** – das ist der Name des Pods, der gerade antwortet.

```text
+-------------------------------------------+
|                                           |
|               Version 1                   |   (blauer Hintergrund)
|                                           |
|      Server name: hello-6f7c8d9b5c-2xk4p  |
|                                           |
+-------------------------------------------+
```

Brauchst du nebenher weitere `kubectl`-Befehle, nimm dafür dein **zweites** Terminal – das erste bleibt für den Tunnel reserviert.

!!! note "Kurz erklärt: port-forward zeigt immer denselben Pod"
    `port-forward` baut einen direkten Tunnel von deinem Rechner (Port 8080) zu **einem** Pod (Port 80). Gibst du ein **Deployment** an, sucht sich Kubernetes einen seiner Pods aus und hält daran fest. Deshalb siehst du beim Neuladen immer **denselben** „Server name" – obwohl drei Pods laufen. Das ist kein Fehler: Das echte Verteilen auf alle Pods (Load-Balancing) kommt in [Praxis 3](08-praxis-service.md) mit dem **Service** – einen kleinen Vorgeschmack gibt es weiter unten in Schritt 9. `port-forward` funktioniert überall gleich (minikube wie Docker Desktop), darum nutzen wir es durchgehend.

!!! tip "Nichts zu sehen im Browser?"
    Wenn `localhost:8080` leer bleibt, ist meist der port-forward nicht (mehr) aktiv – das Terminal muss offen bleiben. Mehr in [Hilfekarte 6](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht).

---

### Schritt 4 – Skalieren: aus drei mach fünf (und zurück)

Jetzt änderst du die Soll-Zahl – ganz ohne die Datei anzufassen. Tipp das im **zweiten** Terminal (der Tunnel im ersten bleibt offen):

```bash
kubectl scale deployment hello --replicas=5
```

Beobachte live, wie zwei neue Pods entstehen:

```bash
kubectl get pods -w
```

Das `-w` (für *watch*) hält die Anzeige offen und aktualisiert sie laufend. Du siehst die neuen Pods von `Pending` über `ContainerCreating` zu `Running` wandern. Wenn alle fünf `Running` sind, beendest du das Zusehen mit **Ctrl+C**.

Dann wieder herunter auf zwei:

```bash
kubectl scale deployment hello --replicas=2
```

Mit `kubectl get pods` siehst du: Kubernetes hat drei Pods beendet, zwei bleiben übrig.

!!! note "Kurz erklärt: Skalieren heißt eine Zahl ändern"
    Skalieren ist in Kubernetes kein Aufwand: Du sagst nur die neue **Soll-Zahl**, den Rest macht das System. Hoch- wie Herunterskalieren – immer dieselbe Bewegung. Genau das nimmt dir Kubernetes ab, was du sonst von Hand mit zehn `docker run`-Befehlen machen müsstest.

---

### Schritt 5 – Selbstheilung: einen Pod „abschießen"

Das ist der Moment, auf den du in Praxis 1 gewartet hast. Lass dir erst die Pods anzeigen und **merke dir einen Namen**:

```bash
kubectl get pods
```

```text
NAME                      READY   STATUS    RESTARTS   AGE
hello-6f7c8d9b5c-2xk4p    1/1     Running   0          5m
hello-6f7c8d9b5c-9fghd    1/1     Running   0          5m
```

Jetzt lösch einen davon (setz deinen echten Namen ein):

```bash
kubectl delete pod hello-6f7c8d9b5c-2xk4p
```

Und sofort wieder nachsehen:

```bash
kubectl get pods
```

Du siehst: Der gelöschte Pod ist weg – aber ein **neuer** mit anderem Namen ist schon da (vielleicht kurz noch `ContainerCreating`). Die Soll-Zahl 2 wird sofort wieder erreicht. Beim **einzelnen Pod** aus Praxis 1 wäre an dieser Stelle nichts nachgekommen – der Unterschied liegt am Deployment.

!!! tip "Hast du gerade den Pod aus dem Tunnel erwischt?"
    Wenn dein `port-forward` zufällig an genau dem gelöschten Pod hing, zeigt der Browser kurz einen Fehler und das Tunnel-Terminal meldet einen Abbruch. Kein Problem: Beende es mit **Ctrl+C** und starte es neu (`kubectl port-forward deployment/hello 8080:80`). Es verbindet sich dann mit einem der lebenden Pods.

!!! note "Kurz erklärt: der Regelkreis in Aktion"
    Das ist die **Selbstheilung** aus der Theorie, live. Das ReplicaSet vergleicht laufend Soll (2) mit Ist. Durch das Löschen war das Ist kurz 1 – also fehlte einer. Kubernetes hat den Unterschied bemerkt und sofort Ersatz gestartet. Niemand musste eingreifen. Genau dafür baut man Deployments statt einzelner Pods.

---

### Schritt 6 – Rolling Update: die neue Version ausrollen

Jetzt kommt das Herzstück. Du rollst **Version 2** aus – und siehst die Seite von Blau auf **Grün** umschlagen, Pod für Pod, ohne dass der Dienst je weg ist.

Lass das `port-forward`-Terminal aus Schritt 3 offen und tipp im **zweiten** Terminal:

```bash
kubectl set env deployment/hello VERSION=2 COLOR="#2e9e5b"
```

Das sagt sinngemäß: „im Deployment `hello` setze die Umgebungsvariablen `VERSION` auf `2` und `COLOR` auf Grün." Beobachte den Austausch:

```bash
kubectl rollout status deployment/hello
```

Du siehst Zeilen wie „Waiting for deployment … 1 out of 2 new replicas have been updated", bis am Ende steht:

```text
deployment "hello" successfully rolled out
```

Jetzt **lade <http://localhost:8080> neu** (oder warte zwei Sekunden – die Seite lädt sich selbst nach): Die Seite ist jetzt **grün** und zeigt **„Version 2"**. Die Änderung ist sichtbar – ohne dass der Dienst je weg war.

??? info "Aufklappen: die Welle live beim Pod-Tausch zusehen"
    Willst du den wellenweisen Austausch in Echtzeit sehen, öffne ein **drittes** Terminal und starte **vor** dem `set env` aus diesem Schritt:

    ```bash
    kubectl get pods -w
    ```

    Beim Ausrollen siehst du dann, wie Pods mit der **alten** Kennung (z.B. `hello-6f7c8d9b5c-…`) beendet werden und Pods mit einer **neuen** Kennung (`hello-<neuer-hash>-…`) hochfahren – einer nach dem anderen. Genau das ist die Welle aus der [Theorie](05-deployments-skalierung.md#rolling-update-und-rollback). Beenden mit **Ctrl+C**.

!!! warning "Ehrlich eingeordnet: warum `set env` und nicht `set image`?"
    Eine neue Version heißt im echten Betrieb fast immer: **ein neues Image** (`kubectl set image deployment/hello hello=meineapp:1.5`). Damit du die Änderung hier aber **sofort als Farbe** siehst, ohne dass wir zwei fertige Images bereitstellen müssen, liest unsere Demo-App ihre Version und Farbe aus zwei Umgebungsvariablen. Sie zu ändern ist für Kubernetes **derselbe Anlass**: Das Pod-Template ändert sich, also rollt es Pod für Pod neu aus – exakt dieselbe Mechanik wie beim Image-Wechsel. Den Befehl `kubectl set image` lernst du gleich in der Aufgabe trotzdem noch kennen.

!!! note "Kurz erklärt: wellenweiser Tausch ohne Ausfall"
    Beim Rolling Update legt das Deployment ein **neues ReplicaSet** mit der neuen Version an und tauscht dann **Pod für Pod**: einen neuen hochfahren, einen alten beenden – so lange, bis alle erneuert sind. Weil dabei immer genug Pods laufen, gibt es **keine Ausfallzeit**. Jede Version bekommt eine **Revision**-Nummer – die brauchst du gleich fürs Zurückrollen.

---

### Schritt 7 – Die Historie ansehen

Jede Änderung am Pod-Template hat eine **Revision** erzeugt. Schau sie dir an:

```bash
kubectl rollout history deployment/hello
```

```text
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

Revision 1 war Blau (Version 1), Revision 2 ist Grün (Version 2). Diese Nummern sind dein Sprungbrett für den nächsten Schritt.

!!! note "Kurz erklärt: was eine Revision ist"
    Bei jeder Änderung am Pod-Template (neues Image, neue Umgebungsvariable, …) merkt sich das Deployment den vorherigen Stand als eigene **Revision** – im Hintergrund als ein ReplicaSet, das nur auf 0 Pods heruntergefahren wurde. Diese Historie ist der Grund, warum ein Rollback so schnell geht: Der alte Stand ist nicht gelöscht, nur „geparkt".

---

### Schritt 8 – Rollback: zurück zur vorigen Version

Angenommen, die neue Version macht Ärger – dann willst du **sofort** zurück. Genau dafür gibt es `rollout undo`:

```bash
kubectl rollout undo deployment/hello
kubectl rollout status deployment/hello
```

**Lade <http://localhost:8080> noch einmal neu**: Die Seite ist wieder **blau** und zeigt **„Version 1"**. Der Rollback lief genauso unterbrechungsfrei wie das Update – wieder Pod für Pod.

!!! note "Kurz erklärt: undo nutzt das alte ReplicaSet"
    `rollout undo` erfindet nichts Neues: Das alte ReplicaSet der Version 1 war noch da (nur auf 0 Pods heruntergefahren). Kubernetes fährt es einfach wieder hoch und das neue herunter. Deshalb ist ein Rollback schnell und sicher. Mit `--to-revision=N` springst du auch gezielt zu einer bestimmten älteren Revision – das probierst du in der Aufgabe. Übrigens: Die zurückgeholte Version bekommt dabei eine **neue, höhere** Revisions-Nummer – `kubectl rollout history` zählt also weiter hoch, statt zur alten Nummer zurückzuspringen.

---

### Schritt 9 (Bonus) – Vorgeschmack: mehrere Pods antworten

Bisher hast du über `port-forward` immer **denselben** Pod gesehen. Jetzt machst du in zwei Minuten sichtbar, dass hinter dem Dienst **mehrere** Pods stecken und Anfragen verteilt werden. Das volle Thema – der **Service** – kommt in [Praxis 3](08-praxis-service.md); hier ist nur der Appetithappen.

Leg kurz eine cluster-interne Adresse vor dein Deployment (mehr dazu in Praxis 3):

```bash
kubectl expose deployment hello --port=80 --name=hello-peek
```

Starte einen winzigen Wegwerf-Pod und lande direkt in seiner Shell:

```bash
kubectl run peek --rm -it --image=curlimages/curl --restart=Never -- sh
```

Nach kurzer Zeit erscheint ein Prompt wie `/ $` – du bist jetzt **im Pod**. Frag dort (nicht in PowerShell) die Adresse zehnmal ab und zieh jeweils den Pod-Namen heraus:

```sh
for i in $(seq 10); do curl -s hello-peek | grep -o "hello-[a-z0-9-]*"; done
```

```text
hello-6f7c8d9b5c-2xk4p
hello-6f7c8d9b5c-q7m2t
hello-6f7c8d9b5c-2xk4p
hello-6f7c8d9b5c-9fghd
...
```

Verschiedene Pod-Namen tauchen auf – die zehn Anfragen wurden über alle Pods verteilt. Verlasse den Pod wieder (`--rm` löscht ihn dabei):

```sh
exit
```

Räum danach auch die kurze Adresse wieder weg (das Deployment bleibt!):

```bash
kubectl delete service hello-peek
```

!!! note "Kurz erklärt: wer hier verteilt"
    Über den Namen `hello-peek` ist dein Deployment **cluster-intern** erreichbar. Ruft der Wegwerf-Pod diese Adresse auf, verteilt **kube-proxy** die Anfragen reihum auf alle Pods. Genau das schauen wir uns in [Praxis 3](08-praxis-service.md) in Ruhe an – samt stabiler Adresse, Labels und Endpoints. Tipp: Lass nebenbei den Rolling Update aus Schritt 6 laufen, dann siehst du in der Schleife sogar **blaue und grüne** Pods gemischt antworten, während getauscht wird.

---

## Übungsaufgabe – selbst skalieren und ausrollen

Jetzt du. Versuch es erst **ohne** zu spicken – die Lösung ist darunter.

#### Aufgabe

1. Skaliere das Deployment auf **4** Replicas.
2. Rolle wieder **Version 2** (grün) aus, falls dein Deployment gerade auf Version 1 steht.
3. Sieh dir mit `kubectl rollout history` die **Revisionen** an.
4. Spring gezielt auf eine **frühere Revision** zurück (`--to-revision=N`) und prüfe im Browser, dass sich die **Farbe** entsprechend ändert.
5. **Kür:** Rolle zusätzlich ein neues **Image** aus (`kubectl set image …`), um den „echten" Versions-Befehl einmal selbst getippt zu haben.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1 – auf 4 skalieren:**

    ```bash
    kubectl scale deployment hello --replicas=4
    kubectl get pods
    ```

    Erwartet: vier Pods mit Status `Running`.

    **Schritt 2 – Version 2 (grün) ausrollen:**

    ```bash
    kubectl set env deployment/hello VERSION=2 COLOR="#2e9e5b"
    kubectl rollout status deployment/hello
    ```

    Bei offenem `port-forward` (`kubectl port-forward deployment/hello 8080:80`) zeigt <http://localhost:8080> nach dem Neuladen die **grüne** Seite mit „Version 2".

    **Schritt 3 – die richtige Revision finden:**

    ```bash
    kubectl rollout history deployment/hello
    ```

    Du siehst eine Liste mit `REVISION`-Nummern. **Wichtig:** Diese Nummern verschieben sich bei jedem Roll – nach dem Zurückrollen aus Schritt 8 ist die ursprüngliche „1" meist schon durch eine höhere Nummer ersetzt. Verlass dich also **nicht** auf eine feste Zahl, sondern schau in **deine** Liste. Welche Revision war blau? Das zeigt dir die Detailansicht (probier die Nummern aus deiner Liste durch):

    ```bash
    kubectl rollout history deployment/hello --revision=3
    ```

    Unter `Environment:` steht je Revision `VERSION` und `COLOR`. Die **blaue** Version 1 erkennst du an `VERSION: 1` und `COLOR: #2563a8`. Merke dir diese Nummer.

    **Schritt 4 – gezielt zurückspringen** (setz für `N` die eben gefundene Nummer der blauen Revision ein):

    ```bash
    kubectl rollout undo deployment/hello --to-revision=N
    kubectl rollout status deployment/hello
    ```

    Lade <http://localhost:8080> neu – die Seite ist jetzt wieder **blau** mit „Version 1".

    !!! warning "Fehlermeldung „unable to find specified revision"?"
        Dann gibt es die gewählte Nummer nicht (mehr) – Kubernetes nummeriert Revisionen beim Zurückrollen um. Ruf einfach noch einmal `kubectl rollout history deployment/hello` auf und nimm eine Nummer, die wirklich in deiner Liste steht.

    **Schritt 5 (Kür) – ein Image ausrollen:**

    ```bash
    kubectl set image deployment/hello hello=nginx:1.26-alpine
    kubectl rollout status deployment/hello
    ```

    Der Befehl heißt sinngemäß: „im Deployment `hello` setze für den Container namens `hello` ein neues Image." Sichtbar ändert sich hier **nichts** (nur die nginx-Version im Hintergrund) – aber in `kubectl rollout history` erscheint eine neue Revision. Genau so rollst du im echten Betrieb eine neue App-Version aus.

??? success "Erwartung"
    Du hast auf 4 Pods skaliert, eine neue Version ausgerollt (Farbe schlägt um) und über `rollout history` und `--to-revision` gezielt zwischen Versionen hin- und hergesprungen – an der Farbe im Browser konntest du jederzeit ablesen, welche Version gerade läuft. Mit `set image` hast du zusätzlich den klassischen Image-Rollout selbst getippt. Damit beherrschst du den kompletten Lebenszyklus eines Deployments: anlegen, skalieren, heilen, updaten, zurückrollen – alles ohne Ausfall.

---

## Lass es laufen

**Lösche das Deployment jetzt noch nicht.** In [Praxis 3](08-praxis-service.md) bauen wir einen **Service** davor – eine stabile Adresse, die die Last auf alle Pods verteilt (genau das Load-Balancing, von dem du in Schritt 9 schon einen Vorgeschmack hattest). Dafür sollen die Pods weiterlaufen.

Falls du eine Pause machst und alles trotzdem abgeräumt hast: kein Problem, du legst das Deployment mit demselben Befehl wie in Schritt 1 wieder an.

```bash
kubectl apply -f manifests/hello-deployment.yaml
```

!!! tip "Forwarding beenden, Cluster behalten"
    Das `port-forward`-Terminal kannst du gefahrlos mit **Ctrl+C** schließen – das beendet nur den Tunnel, nicht die Pods. Der Cluster und dein Deployment laufen weiter.

---

## Wenn etwas hakt

Bleibt ein Pod in `Pending` oder `ContainerCreating` hängen, läuft `port-forward` ins Leere oder zeigt `kubectl` ins Leere? Die abgestuften Hinweise stehen in den [Hilfekarten](09-hilfekarten.md) – besonders [Hilfekarte 3](09-hilfekarten.md#hilfekarte-3-pod-hangt-in-pending-oder-containercreating) (Pod hängt) und [Hilfekarte 6](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht) (port-forward).

!!! tip "Browser zeigt die alte Farbe?"
    Nach einem Rollout zeigt der Browser manchmal noch die alte Seite aus dem Zwischenspeicher. Warte kurz (die Seite lädt sich alle zwei Sekunden selbst nach) oder erzwinge ein hartes Neuladen mit **Ctrl+F5**. Maßgeblich ist immer `kubectl rollout status` – steht dort „successfully rolled out", ist der neue Stand live.

---

## Weiter

- [Services & Netzwerk](07-services-netzwerk.md) – warum Pods eine stabile Adresse davor brauchen und wie sich die Last verteilt
