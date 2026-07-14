---
title: "Praxis: Probes & Limits"
description: "Angeleitete Übung: readiness- und liveness-Probes und Ressourcengrenzen in ein Deployment einbauen, die Konfiguration im describe wiederfinden, dann absichtlich Schaden anrichten – eine kaputte readiness-Probe stoppt den Rollout, eine kaputte liveness-Probe lässt RESTARTS hochzählen und ein Speicher-Limit wird bis OOMKilled gesprengt. Mit eigener Aufgabe und Lösung."
---

# Praxis – Probes & Limits

Jetzt schließt du die letzten zwei Lücken. Zuerst baust du **Gesundheitschecks** und **Ressourcengrenzen** ein und findest sie im Cluster wieder. Dann machst du etwas, das man selten darf: Du gehst absichtlich kaputt – denn nichts zeigt besser, **wozu** Probes und Limits da sind, als sie einmal fehlschlagen zu sehen.

!!! info "Voraussetzung"
    Dein Cluster läuft (`kubectl get nodes` zeigt `Ready`) und die Projektdateien liegen lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-aufbau
    ```

!!! tip "Zeitrahmen"
    Rund **eine bis anderthalb Stunden**. Ein paar Schritte brauchen etwas **Geduld** – eine liveness-Probe schlägt bewusst erst nach mehreren Fehlversuchen an. Das Warten ist Teil der Lektion: Kubernetes reagiert nicht hektisch auf einen einzelnen Aussetzer.

---

## Schritt für Schritt

### Schritt 1 – Das Manifest ansehen

Öffne `manifests/webserver-probes-limits.yaml`. Es ist unser bekanntes Deployment – erweitert um zwei Blöcke im Container:

```yaml
          readinessProbe:               # ist der Pod BEREIT fuer Anfragen?
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 2
            periodSeconds: 5
          livenessProbe:                # LEBT der Container noch?
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
            failureThreshold: 3
          resources:
            requests:                    # so viel wird fest eingeplant
              memory: "32Mi"
              cpu: "50m"
            limits:                      # so viel darf der Container hoechstens
              memory: "128Mi"
              cpu: "250m"
```

---

### Schritt 2 – Anlegen und die Konfiguration wiederfinden

```bash
kubectl apply -f manifests/webserver-probes-limits.yaml
kubectl rollout status deployment/webserver
```

```text
deployment.apps/webserver configured
deployment "webserver" successfully rolled out
```

Beide Pods sind bereit:

```bash
kubectl get pods -l app=webserver
```

```text
NAME                         READY   STATUS    RESTARTS   AGE
webserver-6bfdddc5b4-bn6k4   1/1     Running   0          11s
webserver-6bfdddc5b4-vtwxw   1/1     Running   0          11s
```

Lass dir Probes und Limits vom Cluster bestätigen:

```bash
kubectl describe deploy webserver
```

Im Ausschnitt findest du:

```text
    Limits:
      cpu:     250m
      memory:  128Mi
    Requests:
      cpu:      50m
      memory:   32Mi
    Liveness:   http-get http://:80/ delay=5s timeout=1s period=10s #success=1 #failure=3
    Readiness:  http-get http://:80/ delay=2s timeout=1s period=5s #success=1 #failure=3
```

Kubernetes prüft ab jetzt selbst alle paar Sekunden, ob der Pod antwortet – und weiß, wie viel er verbrauchen darf.

---

### Schritt 3 – readiness absichtlich brechen (Rollout-Bremse)

Jetzt lässt du die readiness-Probe ins Leere laufen. In `manifests/webserver-probes-limits.yaml` änderst du **nur eine Zeile** – den Pfad der **readinessProbe**:

```yaml
          readinessProbe:
            httpGet:
              path: /gibtsnicht        # diese URL gibt es nicht -> nginx antwortet 404
              port: 80
```

Anwenden und **zuschauen** (nicht auf `rollout status` warten – der bleibt bewusst hängen):

```bash
kubectl apply -f manifests/webserver-probes-limits.yaml
kubectl get pods -l app=webserver
```

```text
NAME                         READY   STATUS    RESTARTS   AGE
webserver-5fdcb476c9-x277d   0/1     Running   0          20s
webserver-6bfdddc5b4-bn6k4   1/1     Running   0          47s
webserver-6bfdddc5b4-vtwxw   1/1     Running   0          54s
```

Sieh genau hin: Ein **neuer** Pod ist da, aber er steht auf **`0/1`** – er läuft (`Running`), ist aber **nicht bereit**. Und genau deshalb bleiben die **beiden alten** Pods (`1/1`) stehen und bedienen weiter. Der Rollout ist **freiwillig blockiert**. Der Grund steht in den Events:

```bash
kubectl get events --field-selector reason=Unhealthy --sort-by=.lastTimestamp
```

```text
2s   Warning   Unhealthy   pod/webserver-5fdcb476c9-x277d   Readiness probe failed: HTTP probe failed with statuscode: 404
```

Das ist die Rollout-Bremse aus der Theorie, live: Eine Version, die nie „bereit" wird, ersetzt die gesunde nicht – der Dienst läuft ununterbrochen weiter.

**Reparieren:** Setz den Pfad wieder auf `/` und wende erneut an:

```bash
kubectl apply -f manifests/webserver-probes-limits.yaml
kubectl rollout status deployment/webserver
```

```text
deployment "webserver" successfully rolled out
```

Der neue, gesunde Pod wird bereit, der kaputte verschwindet – alles wieder `1/1`.

!!! note "Kurz erklärt: `0/1` heißt „läuft, aber nicht bereit""
    Die READY-Spalte zeigt „bereite Container / Container insgesamt". `0/1` bedeutet: der Container läuft, hat aber die readiness-Probe **nicht** bestanden. Ein Service (aus Teil 1) würde so einem Pod **keine** Anfragen schicken – erst wenn er `1/1` meldet, ist er im Verkehr.

---

### Schritt 4 – liveness absichtlich brechen (Neustart)

Jetzt das Gegenstück. Setz den readiness-Pfad wieder korrekt auf `/` (falls noch nicht) und brich stattdessen die **livenessProbe**:

```yaml
          livenessProbe:
            httpGet:
              path: /gibtsnicht        # liveness scheitert dauerhaft
              port: 80
```

Anwenden und **Geduld** – die liveness-Probe schlägt erst nach `failureThreshold: 3` an:

```bash
kubectl apply -f manifests/webserver-probes-limits.yaml
```

Warte etwa eine halbe bis eine Minute, dann:

```bash
kubectl get pods -l app=webserver
```

```text
NAME                         READY   STATUS    RESTARTS      AGE
webserver-6dfdc884c7-j2thn   1/1     Running   1 (25s ago)   55s
webserver-6dfdc884c7-nxxbc   1/1     Running   1 (17s ago)   48s
```

Die Spalte **`RESTARTS`** zählt hoch – Kubernetes hat die Container **neu gestartet**, weil die liveness-Probe dreimal scheiterte. Lässt du es laufen, steigt die Zahl weiter (irgendwann `CrashLoopBackOff`, weil ein Dauer-Neustart nichts bringt). Der Beleg steht in den Events – achte auf die Zeile mit **`Liveness probe failed`**:

```bash
kubectl get events --field-selector reason=Unhealthy --sort-by=.lastTimestamp
```

```text
LAST SEEN   TYPE      REASON      OBJECT                            MESSAGE
7s          Warning   Unhealthy   pod/webserver-6dfdc884c7-nxxbc    Liveness probe failed: HTTP probe failed with statuscode: 404
```

**Reparieren:** liveness-Pfad zurück auf `/`, anwenden:

```bash
kubectl apply -f manifests/webserver-probes-limits.yaml
kubectl rollout status deployment/webserver
```

!!! note "Kurz erklärt: der Unterschied, den du gerade gesehen hast"
    Dieselbe kaputte URL, zwei völlig verschiedene Reaktionen: Bei **readiness** nimmt Kubernetes den Pod nur **aus dem Verkehr** (0/1, kein Neustart). Bei **liveness** hält es den Container für tot und **startet ihn neu** (RESTARTS steigt). Deshalb setzt man liveness vorsichtig – eine zu scharfe liveness-Probe startet gesunde Container grundlos neu.

---

### Schritt 5 – ein Speicher-Limit sprengen (OOMKilled)

Zum Schluss die Ressourcengrenze. Dafür gibt es einen kleinen Extra-Pod, der absichtlich zu viel Speicher greift: `manifests/speicherfresser.yaml`. Er greift zur Laufzeit nach 150 MB Speicher, sein Limit erlaubt aber nur 64 MB.

```yaml
    resources:
      requests:
        memory: "32Mi"
      limits:
        memory: "64Mi"          # harte Obergrenze
    args: ["--vm", "1", "--vm-bytes", "150M", "--vm-hang", "1"]   # will 150 MB
```

Anwenden und kurz warten (das Last-Image wird beim ersten Mal geladen):

```bash
kubectl apply -f manifests/speicherfresser.yaml
kubectl get pod speicherfresser
```

```text
NAME              READY   STATUS      RESTARTS   AGE
speicherfresser   0/1     OOMKilled   0          36s
```

Da ist es: **`OOMKilled`** – Out Of Memory Killed. Kubernetes hat den Container beendet, als er sein Speicher-Limit überschritt. Das Detail bestätigt es:

```bash
kubectl describe pod speicherfresser
```

```text
    State:          Terminated
      Reason:       OOMKilled
      Exit Code:    1
    Limits:
      memory:  64Mi
    Requests:
      memory:  32Mi
```

Das Entscheidende ist die Zeile **`Reason: OOMKilled`** – sie sagt eindeutig, dass das Speicher-Limit die Ursache war. Der `Exit Code` daneben kann je nach Programm variieren (oft `137`, wenn der Prozess hart abgeschossen wird; unser `stress`-Werkzeug bemerkt die fehlgeschlagene Speicheranforderung selbst und beendet sich mit `1`). Verlass dich auf den **Grund**, nicht auf die Exit-Code-Zahl.

Genau **das** ist der Sinn eines Limits: Der gierige Container trifft es selbst – er wird gezielt beendet, statt den ganzen Node und seine Nachbarn mit in den Speichermangel zu reißen.

Räum den Speicherfresser wieder weg:

```bash
kubectl delete -f manifests/speicherfresser.yaml
```

!!! note "Kurz erklärt: warum genau dieser Container stirbt"
    Ohne Limit würde ein Speicherleck so lange wachsen, bis dem **Node** der Speicher ausgeht – und dann trifft es oft **unbeteiligte** Pods. Mit einem Limit zieht Kubernetes die Grenze **pro Container**: Wer sie reißt, wird beendet, der Rest bleibt verschont. Das Limit ist die Sicherung, die durchbrennt, bevor das ganze Bordnetz schmort.

---

## Übungsaufgabe – die Grenzen selbst austesten

Jetzt du. Versuch es erst **ohne** zu spicken.

#### Aufgabe

1. Setz im `speicherfresser.yaml` das Speicher-**Limit** herunter auf `32Mi` und wende es erneut an. Wird der Pod schneller oder langsamer `OOMKilled`? Prüfe den Status.
2. **Kür:** Fordere im `webserver-probes-limits.yaml` absichtlich mehr Speicher an, als dein Node frei hat – setz dafür **request und limit gemeinsam** auf `memory: "100Gi"` (die request darf nie größer als das limit sein, deshalb beide). Wende an und finde den neuen Pod in `Pending`. Lies mit `kubectl describe pod …` den Grund. Danach beide Werte wieder zurücksetzen und anwenden.

??? tip "Schritt für Schritt (Lösung)"
    **Aufgabe 1 – kleineres Limit:** In `manifests/speicherfresser.yaml`:

    ```yaml
        limits:
          memory: "32Mi"
    ```

    ```bash
    kubectl delete -f manifests/speicherfresser.yaml --ignore-not-found
    kubectl apply -f manifests/speicherfresser.yaml
    kubectl get pod speicherfresser
    ```

    Ergebnis: wieder `OOMKilled` – bei einem noch kleineren Limit trifft es den Container tendenziell **noch früher**, weil er die Grenze schneller erreicht. Die 150 MB Anforderung sprengen 32 MB genauso sicher wie 64 MB.

    **Aufgabe 2 (Kür) – zu hohe Anforderung:** In `manifests/webserver-probes-limits.yaml` ziehst du **request und limit gemeinsam** hoch:

    ```yaml
        requests:
          memory: "100Gi"     # mehr, als der Node frei hat
          cpu: "50m"
        limits:
          memory: "100Gi"     # muss >= request sein
          cpu: "250m"
    ```

    ```bash
    kubectl apply -f manifests/webserver-probes-limits.yaml
    kubectl get pods -l app=webserver
    ```

    Ein neuer Pod bleibt in `Pending` stehen. Der Grund:

    ```bash
    kubectl describe pod <name-des-pending-pods>
    ```

    Im Events-Bereich steht etwas wie `0/1 nodes are available: 1 Insufficient memory`. Kubernetes findet keinen Node mit so viel freiem Speicher – der Pod wird gar nicht erst gestartet.

    !!! note "Warum beide Werte hoch?"
        Änderst du **nur** die request auf `100Gi` und lässt das limit bei `128Mi`, lehnt Kubernetes das Manifest sofort ab: „`must be less than or equal to memory limit`". Die **request muss immer ≤ limit** sein. Deshalb ziehst du beide hoch – erst dann kommt der Pod so weit, dass er mangels Speicher `Pending` bleibt.

    **Danach unbedingt zurücksetzen** (`requests` `memory: "32Mi"`, `limits` `memory: "128Mi"`) und erneut anwenden, sonst bleibt das Deployment hängen:

    ```bash
    kubectl apply -f manifests/webserver-probes-limits.yaml
    kubectl rollout status deployment/webserver
    ```

??? success "Erwartung"
    Du hast gesehen, dass ein zu kleines Limit den Container zuverlässig beendet (OOMKilled) und dass eine zu hoch angesetzte Speicher-Anforderung den Pod unplanbar macht (Pending, `Insufficient memory`). Damit verstehst du beide Fehlerbilder aus der Praxis – und weißt, dass „betriebsreif" heißt, diese Werte **bewusst** zu wählen: hoch genug, dass die App atmen kann, niedrig genug, dass sie planbar bleibt.

---

## Aufräumen

```bash
kubectl delete -f manifests/webserver-probes-limits.yaml --ignore-not-found
kubectl delete -f manifests/speicherfresser.yaml --ignore-not-found
```

Oder den ganzen Cluster für heute schlafen legen (er lässt sich später mit `minikube start` wiederbeleben):

```bash
minikube stop
```

---

## Wenn etwas hakt

Pod hängt in `Pending`, `RESTARTS` zählt unerwartet hoch, `OOMKilled` taucht auf, wo du es nicht willst? Die abgestuften Hinweise stehen in den [Hilfekarten](08-hilfekarten.md) – besonders [Hilfekarte 3](08-hilfekarten.md#hilfekarte-3-pod-bleibt-in-pending) (Pending), [Hilfekarte 4](08-hilfekarten.md#hilfekarte-4-restarts-zahlt-hoch-crashloopbackoff) (Neustarts) und [Hilfekarte 5](08-hilfekarten.md#hilfekarte-5-oomkilled).

---

## Weiter

- [Lab auf der Lernplattform: Config & Secrets](06-lab-config-secrets.md) – dieselben Themen als geführtes Pluralsight-Lab auf gestellter Umgebung
- [Rückblick & Ausblick](09-rueckblick.md) – was du mitnimmst und wie es von hier weitergeht
