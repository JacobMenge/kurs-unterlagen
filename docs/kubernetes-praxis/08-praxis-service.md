---
title: "Praxis 3: Service"
description: "Angeleitet: einen Service vor dein Deployment legen, die App per port-forward im Browser öffnen, das Load-Balancing über kube-proxy live sehen und die Pods über Labels und Endpoints nachvollziehen – plus eine eigene Aufgabe mit Lösung und Aufräumen."
---

# Praxis 3 – Service: App erreichbar machen und Last verteilen

In [Praxis 2](06-praxis-deployment.md) hattest du ein **Deployment** mit mehreren `hello`-Pods. Die laufen – aber wie erreichst du sie zuverlässig? Jeder Pod hat eine eigene IP, die wechselt, sobald er neu startet. Genau dafür legst du jetzt einen **Service** davor: eine **stabile Adresse**, die immer einen lebenden Pod trifft und die Anfragen automatisch auf alle verteilt.

Wir gehen wieder **komplett angeleitet** vor: erst Schritt für Schritt zusammen, dann eine Aufgabe zum Selbermachen mit Lösung. Am Ende räumst du auf.

!!! info "Voraussetzung"
    Das Deployment `hello` aus [Praxis 2](06-praxis-deployment.md) läuft. Schneller Check:

    ```bash
    kubectl get deployment hello
    ```

    Steht da eine Zeile `hello` mit bereiten Pods (z.B. `3/3`)? Dann bist du startklar. Falls nicht, leg es schnell neu an:

    ```bash
    kubectl apply -f manifests/hello-deployment.yaml
    ```

    Den Ordner mit den Manifesten hast du in der [Installation](03-installation.md#das-projekt-besorgen) geklont – arbeite aus `kurs-unterlagen/apps/kubernetes-praxis`.

!!! tip "Zeitrahmen"
    Plane rund **60 bis 90 Minuten** ein – inklusive der eigenen Aufgabe am Ende.

---

## Schritt für Schritt

Arbeite die sieben Schritte der Reihe nach durch. Schritt 7 ist ein **Bonus nur für minikube** – den kannst du überspringen.

### Schritt 1 – Den Service anlegen

So sieht das Manifest aus. Es liegt fertig unter `manifests/hello-service.yaml`:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  type: ClusterIP            # nur im Cluster erreichbar (Standard)
  selector:
    app: hello              # schickt Anfragen an alle Pods mit diesem Label
  ports:
    - port: 80              # unter diesem Port ist der Service erreichbar
      targetPort: 80        # dorthin leitet er weiter (Container-Port)
```

Wende es an:

```bash
kubectl apply -f manifests/hello-service.yaml
```

Erwartete Ausgabe:

```text
service/hello created
```

!!! tip "Kurzform ohne Datei"
    Du kannst denselben Service auch in einer Zeile erzeugen, ohne ein Manifest – Kubernetes baut es dann aus dem Deployment zusammen:

    ```bash
    kubectl expose deployment hello --port=80 --target-port=80
    ```

    Für die Übung bleiben wir bei der Datei – die ist nachvollziehbar und wiederholbar. Die Kurzform ist gut, um schnell etwas auszuprobieren.

!!! note "Kurz erklärt: wie der Service seine Pods findet"
    Der Service sucht sich seine Pods **nicht** über Namen oder IPs aus, sondern über das **Label** `app: hello`. Sein `selector` sagt: „Schick alles an jeden Pod, der dieses Label trägt.“ Genau dieses Label vergibt das Deployment an jeden Pod, den es startet. So passen die beiden automatisch zusammen – ohne dass du je eine IP einträgst.

---

### Schritt 2 – Was ist da entstanden?

Schau dir den Service an:

```bash
kubectl get svc
```

```text
NAME         TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
hello        ClusterIP   10.96.142.7     <none>        80/TCP    20s
kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP   2d
```

Die Zeile `hello` hat eine feste `CLUSTER-IP` – die bleibt, egal wie oft die Pods dahinter kommen und gehen. (Der Service `kubernetes` ist immer da, der gehört zum Cluster selbst.)

Mehr Details liefert `describe`:

```bash
kubectl describe svc hello
```

Achte auf zwei Zeilen: `Selector: app=hello` und `Endpoints:` – dort stehen die IP-Adressen der Pods. Die holst du dir auch direkt:

```bash
kubectl get endpoints hello
```

```text
NAME    ENDPOINTS                                      AGE
hello   10.244.0.12:80,10.244.0.13:80,10.244.0.14:80   1m
```

Drei Endpoints – das sind genau deine drei `hello`-Pods.

!!! note "Kurz erklärt: was Endpoints sind"
    Die **Endpoints** sind die Liste der aktuell **lebenden** Pods hinter dem Service – mit ihren IPs und Ports. Kubernetes pflegt sie dauerhaft: Stirbt ein Pod, fliegt seine IP raus; kommt ein neuer dazu, wird er aufgenommen. Der Service selbst behält dabei seine eine stabile IP. Die Endpoints sind also der ständig aktualisierte „Verteiler“ dahinter.

---

### Schritt 3 – Im Browser öffnen

Der Service ist vom Typ `ClusterIP` – also nur **innerhalb** des Clusters erreichbar. Damit du ihn von deinem Rechner aus im Browser siehst, baust du wie immer eine Brücke mit `port-forward` – diesmal auf den **Service** statt auf einen einzelnen Pod:

```bash
kubectl port-forward service/hello 8080:80
```

Das Terminal bleibt jetzt belegt und zeigt:

```text
Forwarding from 127.0.0.1:8080 -> 80
```

Öffne im Browser **<http://localhost:8080>**. Du siehst die nginx-Seite mit einer Zeile `Server name: hello-...` – das ist der Pod-Name, der dir geantwortet hat. Zum Beenden im Terminal `Ctrl+C`.

!!! note "Kurz erklärt: port-forward auf einen Service"
    `port-forward service/hello 8080:80` verbindet deinen lokalen Port `8080` mit Port `80` des Service. Du erreichst die App dadurch überall gleich – egal ob minikube oder Docker Desktop, Windows, macOS oder Linux. **Aber:** Diese Brücke hält an **einem** Pod fest, solange sie offen ist. Deshalb siehst du im Browser immer denselben `Server name`, auch beim Neuladen. Das eigentliche Load-Balancing siehst du gleich von innen.

!!! warning "Hängt der Befehl oder kommt nichts?"
    `port-forward` belegt das Terminal absichtlich, solange die Brücke steht – das ist kein Fehler. Kommt eine Fehlermeldung oder bleibt der Browser leer, hilft die [Hilfekarte 6 – port-forward klappt nicht](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht).

---

### Schritt 4 – Load-Balancing sichtbar machen

Weil `port-forward` nur einen Pod trifft, schauen wir uns die Verteilung **von innen** an: Wir starten einen winzigen Wegwerf-Pod im Cluster und fragen den Service von dort mehrfach ab. Das machen wir in zwei Handgriffen – so funktioniert es auf **Windows, macOS und Linux gleich** (ohne dass deine Host-Shell etwas am Befehl verändert).

**Schritt 4a:** Starte den Test-Pod und lande direkt in seiner Shell:

```bash
kubectl run loadtest --rm -it --image=curlimages/curl --restart=Never -- sh
```

Nach kurzer Zeit erscheint ein neuer Prompt wie `/ $` – du bist jetzt **im Test-Pod** drin.

**Schritt 4b:** Frag den Service zehnmal ab und zieh jeweils den Pod-Namen heraus. Tippe diese Zeile an dem `/ $`-Prompt **im Pod** (nicht in PowerShell):

```sh
for i in $(seq 10); do curl -s hello | grep -o "hello-[a-z0-9-]*" | head -1; done
```

Erwartete Ausgabe (deine Namen sehen anders aus, wichtig ist: sie **wechseln**):

```text
hello-7d9c8b6f4-abcde
hello-7d9c8b6f4-fghij
hello-7d9c8b6f4-abcde
hello-7d9c8b6f4-klmno
hello-7d9c8b6f4-fghij
...
```

Verschiedene Pod-Namen tauchen auf – die zehn Anfragen wurden über alle drei Pods verteilt.

**Schritt 4c:** Verlasse den Test-Pod wieder – durch `--rm` wird er dabei automatisch gelöscht:

```sh
exit
```

!!! note "Kurz erklärt: wer hier verteilt"
    Innerhalb des Clusters ist der Service unter seinem Namen `hello` als Adresse erreichbar (das ist der cluster-interne DNS-Name). Wenn der Test-Pod `curl hello` aufruft, übernimmt **kube-proxy** auf dem Knoten: Es verteilt die Anfragen reihum auf alle Pods aus den Endpoints. Genau das ist Load-Balancing – kein extra Gerät, sondern eingebaut.

!!! warning "Warum erst in den Pod und nicht direkt `curl` vom eigenen Rechner?"
    Zwei Gründe. Erstens passiert das Load-Balancing **innerhalb** des Clusters über die Service-Adresse `hello` – von deinem Rechner aus kämst du nur über `port-forward` ran – und das hält an einem Pod fest. Zweitens würde die Schleife `for i in $(seq 10); ...`, in PowerShell unter Windows getippt, **nicht** funktionieren: PowerShell würde `$(seq 10)` selbst auswerten. Im Test-Pod läuft die Zeile dagegen in dessen Linux-Shell – überall gleich.

---

### Schritt 5 – Update im laufenden Betrieb: bleibt es erreichbar?

Jetzt der eigentliche Lohn für den Service. In [Praxis 2](06-praxis-deployment.md) hast du gesehen: Beim Rolling Update **bricht ein `port-forward` ab** – weil er an genau einem Pod klebt und der ja ausgetauscht wird. Mit dem **Service** davor ist das anders: Die Adresse `hello` bleibt stehen und verteilt auf alle lebenden Pods. Das prüfst du jetzt – du rollst eine neue Version aus, **während** du den Dienst ununterbrochen abfragst.

**Schritt 5a:** Starte einen Wegwerf-Pod und lande in seiner Shell:

```bash
kubectl run watch --rm -it --image=curlimages/curl --restart=Never -- sh
```

**Schritt 5b:** Frag den Service an dem `/ $`-Prompt **im Pod** im Halbsekunden-Takt ab. Die Zeile zeigt die gerade ausgelieferte Version – oder `AUSFALL`, falls einmal keine Antwort kommt:

```sh
while true; do R=$(curl -s --max-time 2 hello | grep -o "Version [0-9]" | head -1); echo "${R:-AUSFALL}"; sleep 0.5; done
```

Erst läuft eine ruhige Reihe `Version 1`.

**Schritt 5c:** Öffne ein **zweites** Terminal und rolle dort die neue Version aus (genau wie in Praxis 2):

```bash
kubectl set env deployment/hello VERSION=2 COLOR="#2e9e5b"
```

Schau zurück auf die laufende Abfrage im Pod. Sie hört **nicht** auf – sie kippt nur von `Version 1` über eine kurze Mischung auf `Version 2`:

```text
Version 1
Version 1
Version 1
Version 2
Version 1
Version 2
Version 2
Version 2
```

Blitzt zwischendurch einmal ein `AUSFALL` auf, ist das normal und kein Fehler – woran das liegt, steht im Aufklapp-Kasten unten.

Genau das ist der Unterschied zu Praxis 2: Der Service hat den Tausch **abgefangen**. Kein abgerissener Tunnel, keine Lücke – die stabile Adresse zeigte immer auf einen lebenden Pod. Beende die Abfrage mit **Ctrl+C** und verlasse den Pod:

```sh
exit
```

!!! note "Kurz erklärt: warum der Service das aushält"
    Ein `port-forward` ist eine Brücke zu **einem** Pod – stirbt der, ist die Brücke weg. Der **Service** ist dagegen eine **stabile Adresse vor allen Pods**: Beim Rolling Update nimmt Kubernetes ausgetauschte Pods automatisch aus den Endpoints und neue hinein. Die Adresse bleibt, der Verkehr fließt weiter. Deshalb legt man im echten Betrieb **immer** einen Service (oder etwas darüber) vor ein Deployment – nie greift ein Client direkt auf einen einzelnen Pod zu.

??? info "Aufklappen: den allerletzten Aussetzer wegbekommen (readinessProbe)"
    Vielleicht hast du in der Abfrage ein einzelnes `AUSFALL` aufblitzen sehen. Das ist ein **neuer** Pod, der schon in den Endpoints stand, dessen nginx aber den ersten Sekundenbruchteil noch nicht antwortete. Damit das nie passiert, sagt die App Kubernetes mit einer **`readinessProbe`**, wann sie wirklich bereit ist – und erst dann bekommt sie Verkehr:

    ```yaml
    readinessProbe:
      httpGet:
        path: /
        port: 80
      periodSeconds: 2
    ```

    Diese Zeilen gehören im Manifest in den Container (unter `ports:`). Mit ihnen wartet Kubernetes beim Rollout, bis ein neuer Pod über `http://…:80/` antwortet, bevor er Anfragen erhält – und nimmt erst dann einen alten heraus. Ergebnis: **keine einzige** verlorene Anfrage. Für die Übung brauchst du das nicht – merk dir nur: Im echten Betrieb gehört eine `readinessProbe` zu fast jedem Deployment dazu.

Zum Schluss zurück auf die Ausgangsversion, damit der Rest der Übung sauber startet:

```bash
kubectl rollout undo deployment/hello
```

---

### Schritt 6 – Labels live: hochskalieren und zusehen

Jetzt machst du sichtbar, dass der Service neue Pods **automatisch** aufnimmt. Erst die Labels der aktuellen Pods anschauen:

```bash
kubectl get pods --show-labels
```

```text
NAME                     READY   STATUS    RESTARTS   AGE   LABELS
hello-7d9c8b6f4-abcde    1/1     Running   0          5m    app=hello,pod-template-hash=7d9c8b6f4
hello-7d9c8b6f4-fghij    1/1     Running   0          5m    app=hello,pod-template-hash=7d9c8b6f4
hello-7d9c8b6f4-klmno    1/1     Running   0          5m    app=hello,pod-template-hash=7d9c8b6f4
```

Jeder Pod trägt `app=hello` – genau das Label, auf das der Service-Selektor zielt. Jetzt hochskalieren auf fünf:

```bash
kubectl scale deployment hello --replicas=5
```

Und die Endpoints erneut abfragen:

```bash
kubectl get endpoints hello
```

```text
NAME    ENDPOINTS                                                              AGE
hello   10.244.0.12:80,10.244.0.13:80,10.244.0.14:80 + 2 more...               6m
```

Aus drei sind fünf Endpoints geworden – ohne dass du den Service angefasst hast.

!!! note "Kurz erklärt: der Selektor nimmt neue Pods von selbst auf"
    Du hast nur das **Deployment** skaliert. Die neuen Pods bekommen dasselbe Label `app: hello`. Der Service-Selektor zielt weiter auf dieses Label – also gehören die neuen Pods sofort dazu. Kubernetes trägt sie automatisch in die Endpoints ein. So wächst und schrumpft der „Verteiler“ hinter der stabilen Adresse mit der Pod-Zahl mit, ganz ohne dein Zutun. Das ist die Stärke von Labels: Sie verbinden Deployment und Service lose, ohne feste Namen oder IPs.

??? info "Aufklappen: live zusehen, wie die Pods kommen"
    Wenn du das Hochskalieren in Echtzeit beobachten willst, öffne ein **zweites** Terminal und starte vorher:

    ```bash
    kubectl get pods -w
    ```

    Das `-w` (watch) hält die Anzeige offen und zeigt jede Änderung, sobald sie passiert. Skalierst du im ersten Terminal hoch, siehst du hier die neuen Pods auftauchen. Beenden mit `Ctrl+C`.

Skaliere zum Abschluss wieder auf drei zurück, damit die folgenden Ausgaben wieder zu drei Pods passen:

```bash
kubectl scale deployment hello --replicas=3
```

---

### Schritt 7 (Bonus, nur minikube) – von außen per NodePort

!!! warning "Bonus für minikube"
    Dieser Schritt nutzt einen **NodePort** und den Befehl `minikube service`. Er ist nur für den **minikube**-Weg gedacht. Mit Docker Desktop läuft die App weiterhin am einfachsten über `port-forward` (Schritt 3) – diesen Bonus kannst du dort überspringen.

Bisher war der Service `ClusterIP` – nur intern erreichbar. Ein **NodePort** öffnet zusätzlich einen Port am Cluster-Knoten, sodass du von außen herankommst. Tausche den Service:

```bash
kubectl delete svc hello
kubectl apply -f manifests/hello-service-nodeport.yaml
```

Das NodePort-Manifest:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hello
spec:
  type: NodePort
  selector:
    app: hello
  ports:
    - port: 80
      targetPort: 80
```

minikube gibt dir die passende URL und du öffnest sie im Browser:

```bash
minikube service hello --url
```

Es erscheint eine Adresse wie `http://127.0.0.1:51234`. Öffne sie – wieder die `hello`-Seite mit dem Pod-Namen. Beenden mit `Ctrl+C` (der Befehl hält ein kleines Tunnel-Fenster offen).

!!! note "Kurz erklärt: ClusterIP vs. NodePort"
    - **ClusterIP** (Standard): nur **im** Cluster erreichbar. Von außen brauchst du `port-forward`.
    - **NodePort**: zusätzlich über einen Port **am Knoten** von außen erreichbar (Kubernetes vergibt einen Port im Bereich 30000–32767).

    `minikube service hello --url` baut bei minikube den passenden Tunnel und nennt dir die Adresse. In echten Clustern nimmt man für „von außen“ meist noch eine Stufe höher: einen `LoadBalancer`-Service oder einen Ingress – aber das Prinzip „Service vor die Pods“ bleibt dasselbe.

Stell danach wieder auf den normalen ClusterIP-Service zurück, damit der Rest der Übung wie beschrieben funktioniert:

```bash
kubectl delete svc hello
kubectl apply -f manifests/hello-service.yaml
```

---

## Übungsaufgabe – ein zweiter Dienst

Jetzt du allein. Bisher läuft ein Dienst (`hello`). Bring einen **zweiten** Dienst dazu, der **gleichzeitig** erreichbar ist.

!!! abstract "Deine Aufgabe"
    Leg ein zweites Deployment namens **`web`** an (Image **`nginx:1.27`**) und einen eigenen **Service `web`** davor. Mach ihn per `port-forward` auf einem **anderen** lokalen Port erreichbar: **`8081:80`** → <http://localhost:8081>. Am Ende sollen **beide** Dienste laufen: `hello` (z.B. weiter auf `8080`) und `web` auf `8081`.

    Versuch es zuerst selbst – mit den Befehlen aus den Schritten oben. Die Lösung steht darunter.

??? tip "Schritt für Schritt (Lösung)"
    **Schritt 1:** Das zweite Deployment anlegen (hier per Kurzbefehl, ganz ohne Manifest):

    ```bash
    kubectl create deployment web --image=nginx:1.27
    ```

    **Schritt 2:** Einen Service davor – die Kurzform aus Schritt 1 reicht hier:

    ```bash
    kubectl expose deployment web --port=80
    ```

    **Schritt 3:** Per port-forward erreichbar machen, diesmal auf Port `8081`:

    ```bash
    kubectl port-forward service/web 8081:80
    ```

    Dann <http://localhost:8081> öffnen. Willst du `hello` (auf `8080`) gleichzeitig sehen, starte dessen `port-forward` in einem **zweiten** Terminal – jedes `port-forward` belegt sein eigenes Terminal.

??? success "Erwartung"
    `kubectl get all` zeigt jetzt **zwei** Deployments (`hello`, `web`) und **zwei** Services (`hello`, `web`). Unter <http://localhost:8081> erscheint die Standard-Begrüßungsseite von nginx („Welcome to nginx!“) – unter <http://localhost:8080> weiterhin die `hello`-Seite mit dem Pod-Namen. Zwei Dienste, zwei stabile Adressen, beide gleichzeitig erreichbar. Genau so legt man im echten Betrieb Dienst neben Dienst.

---

## Bonus-Übung: zwei Farben hinter einem Service

Lust auf einen sichtbaren Abschluss? Dann machen wir das Load-Balancing jetzt **bunt**. Bisher hast du das Verteilen an den wechselnden Pod-**Namen** abgelesen – schöner ist es als **Farbe**. Wir stellen zwei Sorten Pods hinter **einen** Service: blaue und grüne, sonst baugleich. Dann schaust du zu, wie der eine Service munter zwischen beiden Farben verteilt.

Das ist genau die farbige Demo-App aus [Praxis 2](06-praxis-deployment.md), nur mit einem Dreh: Statt eine Version durch die nächste zu **ersetzen**, laufen blau und grün **gleichzeitig**. Diese Übung ist ein optionaler Bonus. Dein laufendes `hello` fasst sie nicht an, sie räumt sich am Ende selbst wieder weg.

<figure>
<svg viewBox="0 0 600 240" width="100%" height="240" role="img" aria-label="Ein Service namens bunt verteilt Anfragen auf einen blauen und einen gruenen Pod, dargestellt als zwei farbige Browserfenster">
  <!-- Service -->
  <rect x="30" y="92" width="140" height="56" rx="8" fill="rgba(125,255,154,0.1)" stroke="#7dff9a" stroke-width="2.5"/>
  <text x="100" y="116" text-anchor="middle" fill="#7dff9a" font-family="JetBrains Mono, monospace" font-size="13" font-weight="bold">Service "bunt"</text>
  <text x="100" y="136" text-anchor="middle" fill="#8fa498" font-size="10">selector: demo=bunt</text>

  <!-- blaues Fenster -->
  <rect x="360" y="18" width="210" height="88" rx="8" fill="#2563a8" stroke="#1b4a82" stroke-width="1"/>
  <rect x="360" y="18" width="210" height="22" rx="8" fill="#1b4a82"/>
  <circle cx="378" cy="29" r="3.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="392" cy="29" r="3.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="406" cy="29" r="3.5" fill="#ffffff" opacity="0.6"/>
  <text x="465" y="78" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="800">BLAU</text>
  <text x="465" y="97" text-anchor="middle" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="9" opacity="0.9">Server name: bunt-blau-…</text>

  <!-- gruenes Fenster -->
  <rect x="360" y="132" width="210" height="88" rx="8" fill="#2e9e5b" stroke="#1f6e40" stroke-width="1"/>
  <rect x="360" y="132" width="210" height="22" rx="8" fill="#1f6e40"/>
  <circle cx="378" cy="143" r="3.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="392" cy="143" r="3.5" fill="#ffffff" opacity="0.6"/>
  <circle cx="406" cy="143" r="3.5" fill="#ffffff" opacity="0.6"/>
  <text x="465" y="192" text-anchor="middle" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="800">GRUEN</text>
  <text x="465" y="211" text-anchor="middle" fill="#ffffff" font-family="JetBrains Mono, monospace" font-size="9" opacity="0.9">Server name: bunt-gruen-…</text>

  <path d="M170 108 L356 62" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#bv)"/>
  <path d="M170 132 L356 176" fill="none" stroke="#56c374" stroke-width="2" marker-end="url(#bv)"/>

  <defs><marker id="bv" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#56c374"/></marker></defs>
</svg>
<figcaption>Zwei Sorten Pods – blau und grün – hinter einem einzigen Service. Er verteilt die Anfragen auf beide Farben; gibst du einer Farbe mehr Pods, verschiebt sich das Verhältnis.</figcaption>
</figure>

!!! note "Wie zwei Deployments sich einen Service teilen"
    Der Trick steckt in den Labels. **Jedes** der beiden Deployments hat seinen **eigenen** Selektor (`farbe: blau` bzw. `farbe: gruen`) – nur weil die beiden verschieden sind, streiten sich die Pods nicht. **Zusätzlich** tragen alle Pods dasselbe gemeinsame Label `demo: bunt`. Der Service selektiert nur `demo: bunt` – und erwischt damit **beide** Farben. Wir nehmen bewusst das eigene Label `demo` (nicht `app: hello`), damit nichts mit deinem laufenden `hello`-Service kollidiert.

### Schritt 1 – die zwei Farben anlegen

Das fertige Manifest liegt unter `manifests/bunt-disco.yaml` (zwei kleine Deployments plus ein Service). Wende es an:

```bash
kubectl apply -f manifests/bunt-disco.yaml
```

Erwartete Ausgabe:

```text
deployment.apps/bunt-blau created
deployment.apps/bunt-gruen created
service/bunt created
```

### Schritt 2 – nachsehen, wer dahintersteckt

```bash
kubectl get pods --show-labels -l demo=bunt
```

Du siehst zwei Pods: beide tragen `demo=bunt`, der eine zusätzlich `farbe=blau`, der andere `farbe=gruen`. Und der Verteiler dahinter:

```bash
kubectl get endpoints bunt
```

Zwei IP-Adressen – eine blaue, eine grüne. Der Service `bunt` zielt nur auf `demo=bunt` und nimmt damit beide mit.

### Schritt 3 – das Load-Balancing als Farbe sehen

Wie in Schritt 4 fragen wir den Service **von innen** ab. Starte den Wegwerf-Pod und lande in seiner Shell:

```bash
kubectl run disco --rm -it --image=curlimages/curl --restart=Never -- sh
```

Tippe diese Zeile am `/ $`-Prompt **im Pod** (nicht in PowerShell) – sie fragt den Service zwanzigmal ab und zieht jeweils das Farbwort heraus:

```sh
for i in $(seq 20); do curl -s bunt | grep -oE "BLAU|GRUEN" | head -1; done
```

Die Ausgabe wechselt zwischen `BLAU` und `GRUEN` – mal antwortet der blaue Pod, mal der grüne:

```text
BLAU
GRUEN
BLAU
BLAU
GRUEN
...
```

Willst du es schwarz auf weiß auszählen, lass `sort` und `uniq` mitzählen:

```sh
for i in $(seq 30); do curl -s bunt | grep -oE "BLAU|GRUEN" | head -1; done | sort | uniq -c
```

Bei je einem Pod pro Farbe kommt ungefähr halbe-halbe heraus (etwa 15-mal `BLAU`, 15-mal `GRUEN`).

### Schritt 4 – das Verhältnis verschieben

Jetzt das Spannende: Gib einer Farbe **mehr** Pods und sieh zu, wie sich die Verteilung verschiebt. Öffne ein **zweites** Terminal (der `disco`-Pod darf offen bleiben) und skaliere Grün hoch:

```bash
kubectl scale deployment bunt-gruen --replicas=3
```

Warte kurz, dann lass im `disco`-Pod die Auszähl-Schleife aus Schritt 3 noch einmal laufen. Jetzt kommt deutlich **mehr `GRUEN` als `BLAU`** (etwa 3:1) – weil drei grüne Pods gegen einen blauen antreten. Mehr Pods einer Farbe heißt: mehr Anfragen landen bei dieser Farbe. Genau dieses Verhältnis stellt der Service von selbst ein.

Verlasse danach den `disco`-Pod (`--rm` löscht ihn dabei automatisch):

```sh
exit
```

### Schritt 5 – mehrere Fenster, mehrere Server

Zum Schluss machst du sichtbar, dass du es mit **verschiedenen** Servern zu tun hast. Hol dir die konkreten Pod-Namen:

```bash
kubectl get pods -l demo=bunt -o name
```

Du bekommst Zeilen wie `pod/bunt-blau-…` und `pod/bunt-gruen-…`. Ein `port-forward` klebt immer an **einem** Pod – deshalb gehst du hier gezielt auf je **einen konkreten Pod** (nicht auf den Service, sonst zeigt der Browser immer nur eine Farbe). Öffne zwei Terminals und setze deine echten Pod-Namen ein.

Terminal A – ein blauer Pod auf Port 8080:

```bash
kubectl port-forward pod/bunt-blau-... 8080:80
```

Terminal B – ein grüner Pod auf Port 8081:

```bash
kubectl port-forward pod/bunt-gruen-... 8081:80
```

Jetzt öffne **zwei Browserfenster nebeneinander**: <http://localhost:8080> zeigt eine **blaue** Seite mit `Server name: bunt-blau-…`, <http://localhost:8081> eine **grüne** mit `Server name: bunt-gruen-…`. Zwei Fenster, zwei verschiedene Pods, gleichzeitig – das sind die Server, auf die der Service verteilt. Jeden Tunnel beendest du mit **Ctrl+C** im passenden Terminal.

!!! tip "Tippfehler beim Pod-Namen vermeiden"
    Kopiere die Pod-Namen direkt aus der Ausgabe von `kubectl get pods -l demo=bunt -o name`, statt sie abzutippen – die zufällige Endung verschreibt sich leicht. Fragt Windows beim ersten `port-forward` nach einer Firewall-Freigabe, bestätige sie.

### Aufräumen (Bonus)

Alles aus dieser Bonus-Übung verschwindet in einem Rutsch – dein `hello`-Service bleibt unberührt:

```bash
kubectl delete -f manifests/bunt-disco.yaml
```

Offene `port-forward`-Fenster schließt du mit **Ctrl+C**. Ein Kontrollblick zeigt, dass nichts mehr mit `bunt` im Namen übrig ist:

```bash
kubectl get all
```

---

## Aufräumen

Wenn du fertig bist, beende offene `port-forward`-Fenster mit `Ctrl+C` und entferne, was du angelegt hast.

Den Pflichtteil (`hello`-Service plus Deployment) löschst du in einem Rutsch über die Manifeste:

```bash
kubectl delete -f manifests/hello-service.yaml -f manifests/hello-deployment.yaml
```

Den Übungs-Dienst `web` hast du per Kurzbefehl angelegt – den entfernst du einzeln:

```bash
kubectl delete service web
kubectl delete deployment web
```

Hast du die **Bonus-Übung** gemacht, räum sie separat über ihr eigenes Manifest ab:

```bash
kubectl delete -f manifests/bunt-disco.yaml
```

Prüfen, dass nichts von dir übrig ist:

```bash
kubectl get all
```

!!! tip "Kompletter Reset"
    Willst du den ganzen Cluster sauber zurücksetzen (für einen frischen Start), genügt:

    ```bash
    minikube delete
    ```

    Danach baust du ihn bei Bedarf mit `minikube start --driver=docker` neu auf – siehe [Installation](03-installation.md#cluster-starten).

---

## Wenn etwas hakt

Bleib nicht zu lange hängen. Die häufigsten Stolpersteine bei einem Service sind ein leerer Endpoints-Liste (Label und Selektor passen nicht zusammen) und ein streikendes `port-forward`.

- [Hilfekarte 6 – port-forward klappt nicht](09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht)
- [Hilfekarte 7 – Service liefert nichts (Labels und Selektor)](09-hilfekarten.md#hilfekarte-7-service-liefert-nichts-labels-und-selektor)
- [Alle Hilfekarten](09-hilfekarten.md)

---

## Weiter

Geschafft – du hast einen Service vor dein Deployment gelegt, die App erreichbar gemacht und das Load-Balancing mit eigenen Augen gesehen. Damit hast du die drei Kernstücke beisammen: **Pod**, **Deployment**, **Service**.

Das war der **lokale** Teil – komplett auf deinem eigenen minikube. Die nächsten, größeren Schritte (mehrere echte Knoten, Cloud-`LoadBalancer`, Ingress) brauchst du nicht mehr auf dem Laptop zu stemmen: Die machen wir in den **Hands-on-Cloud-Labs der Lernplattform**. Wie es dort weitergeht, steht im [Rückblick & Ausblick](10-rueckblick.md).

- [Hilfekarten](09-hilfekarten.md) – nachschlagen, wenn etwas hakt
- [Rückblick & Ausblick](10-rueckblick.md) – was du mitnimmst und wie es weitergeht
