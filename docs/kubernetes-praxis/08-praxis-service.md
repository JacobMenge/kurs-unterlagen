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

Arbeite die sechs Schritte der Reihe nach durch. Schritt 6 ist ein **Bonus nur für minikube** – den kannst du überspringen.

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

### Schritt 5 – Labels live: hochskalieren und zusehen

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

---

### Schritt 6 (Bonus, nur minikube) – von außen per NodePort

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
