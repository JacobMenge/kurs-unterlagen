---
title: "Hilfekarten"
description: "Abgestufte Hinweise fürs Troubleshooting im Aufbau-Block: Config-Änderung greift nicht, Pod startet nicht wegen fehlender ConfigMap/Secret, Pod bleibt in Pending, RESTARTS zählt hoch, OOMKilled. Nutze sie nur, wenn du feststeckst."
---

# Hilfekarten

Gezielte Hilfe für die typischen Stolpersteine dieses Blocks. Jede Karte folgt demselben Muster: **Symptom** erkennen, **Ursache** verstehen, mit ein paar Befehlen **prüfen und beheben**.

!!! tip "Spielregel"
    Nutze die Karten **nur**, wenn du feststeckst. Erst selbst überlegen, einmal `kubectl get pods` und `kubectl describe` lesen – **dann** aufklappen. Beim Troubleshooten lernst du am meisten.

!!! note "Erste Reflexe"
    Wenn etwas hakt, helfen fast immer diese drei Fragen:

    - **Was sagt der Pod selbst?** → `kubectl get pods` und `kubectl describe pod <name>` (die **Events** ganz unten lesen).
    - **Was steht in den Logs?** → `kubectl logs <pod>`.
    - **Rede ich mit dem richtigen Cluster?** → `kubectl config current-context` (Details in [Teil 1, Hilfekarte 1](../kubernetes-praxis/09-hilfekarten.md#hilfekarte-1-falscher-cluster-kontext)).

---

## Hilfekarte 1 – ConfigMap geändert aber die Seite zeigt den alten Wert

??? info "Aufklappen"
    **Symptom:** Du hast die ConfigMap per `kubectl apply` geändert, aber im Browser (oder in `kubectl exec … env`) steht weiter der **alte** Wert.

    **Ursache:** Laufende Pods bekommen ihre Umgebungsvariablen **beim Start**. Ändert sich die ConfigMap, merken sie das **nicht** von selbst. Beim `apply` siehst du deshalb `configmap/... configured`, aber `deployment/... unchanged` – am Deployment hat sich ja nichts geändert.

    **Beheben** – die Pods neu ausrollen, damit sie die neuen Werte lesen:

    ```bash
    kubectl rollout restart deployment/webserver
    kubectl rollout status deployment/webserver
    ```

    Danach hängt dein alter `port-forward` an einem verschwundenen Pod – mit `Ctrl+C` beenden und neu starten. Zur Kontrolle:

    ```bash
    kubectl exec deploy/webserver -- sh -c 'echo STANDORT=$STANDORT'
    ```

    !!! note "Kurz erklärt: warum das Absicht ist"
        Kubernetes trennt **Ändern** (ConfigMap per `apply`) und **Ausrollen** (`rollout restart`) bewusst. So tauscht ein Tippfehler in der ConfigMap nicht sofort alle Pods durch – du bestimmst, wann die neue Konfiguration greift.

---

## Hilfekarte 2 – Pod startet nicht: ConfigMaps & Secrets

??? info "Aufklappen"
    **Symptom:** Nach dem `apply` bleibt der Pod hängen, oft mit Status `CreateContainerConfigError`, statt `Running` zu werden.

    **Ursache:** Das Deployment verweist per `envFrom` auf eine ConfigMap oder ein Secret, die (noch) **nicht existieren** – ein Tippfehler im Namen oder die Datei wurde nicht mit angewendet.

    **Prüfen** – der Grund steht in den Events:

    ```bash
    kubectl get pods -l app=webserver
    kubectl describe pod <pod-name>
    ```

    Achte auf eine Zeile wie `Error: configmap "webserver-config" not found` oder `secret "webserver-secret" not found`.

    **Beheben:**

    - Existieren beide Objekte überhaupt? `kubectl get configmap webserver-config` und `kubectl get secret webserver-secret`.
    - Stimmt der **Name** im `envFrom`-Block Zeichen für Zeichen mit dem `metadata.name` der ConfigMap/des Secrets überein?
    - Die ganze Datei enthält alle drei Objekte – wende sie komplett an, dann ist die Reihenfolge egal:

    ```bash
    kubectl apply -f manifests/webserver-config.yaml
    ```

---

## Hilfekarte 3 – Pod bleibt in Pending

??? info "Aufklappen"
    **Symptom:** Ein Pod steht dauerhaft auf `Pending` und wird nie `Running`.

    **Ursache:** In diesem Block fast immer eine **zu hohe request**: Der Pod verlangt mehr Speicher oder CPU, als ein Node frei hat. Kubernetes findet keinen Platz und lässt ihn warten. (Seltener: Beim allerersten Mal wird noch ein Image geladen – dann steht der Pod kurz auf `ContainerCreating`, nicht `Pending`.)

    **Prüfen** – die Events nennen den Grund:

    ```bash
    kubectl describe pod <pod-name>
    ```

    Eine Zeile wie `0/1 nodes are available: Insufficient memory` (oder `Insufficient cpu`) zeigt es klar: Der Node hat nicht so viel frei, wie die request verlangt.

    **Beheben** – die request auf einen realistischen Wert senken:

    ```yaml
        requests:
          memory: "32Mi"
          cpu: "50m"
    ```

    ```bash
    kubectl apply -f manifests/webserver-probes-limits.yaml
    ```

    !!! note "Kurz erklärt: request steuert das Scheduling"
        Die **request** ist die Menge, die Kubernetes zum Einplanen reserviert. Sie muss auf einem Node **frei** sein, sonst wird der Pod nicht platziert. Auf einem kleinen minikube ist der frei verfügbare Speicher schnell überschritten – gib nur so viel an, wie die App wirklich braucht.

---

## Hilfekarte 4 – RESTARTS zählt hoch (CrashLoopBackOff)

??? info "Aufklappen"
    **Symptom:** Die Spalte `RESTARTS` steigt, irgendwann steht der Pod auf `CrashLoopBackOff`.

    **Ursache – zwei Fälle:**

    - **Zu scharfe liveness-Probe.** Die Probe hält einen eigentlich gesunden Container für tot und startet ihn neu (falscher Pfad, zu kurze `initialDelaySeconds`, zu strenger `failureThreshold`). Genau das hast du in [Praxis-Schritt 4](05-praxis-probes-limits.md#schritt-4-liveness-absichtlich-brechen-neustart) absichtlich ausgelöst.
    - **Die App selbst beendet sich.** Dann liegt es nicht an der Probe, sondern am Container-Inhalt.

    **Prüfen:**

    ```bash
    kubectl describe pod <pod-name>          # Events: steht dort "Liveness probe failed"?
    kubectl logs <pod-name> --previous       # was gab der abgestürzte Vorgänger aus?
    ```

    **Beheben:**

    - Steht in den Events **`Liveness probe failed`** → die liveness-Probe entschärfen: richtigen `path` setzen, `initialDelaySeconds` erhöhen oder `failureThreshold` anheben. Dann neu anwenden.
    - Kein Probe-Fehler, aber die Logs zeigen einen App-Absturz → die Ursache im Container beheben (vgl. [Teil 1, Hilfekarte 5](../kubernetes-praxis/09-hilfekarten.md#hilfekarte-5-crashloopbackoff)).

    !!! warning "liveness mit Bedacht"
        Eine liveness-Probe, die zu früh oder zu streng prüft, startet gesunde Container grundlos neu und macht den Dienst **instabiler** statt stabiler. Im Zweifel großzügiger einstellen als zu knapp.

---

## Hilfekarte 5 – OOMKilled

??? info "Aufklappen"
    **Symptom:** Ein Pod zeigt den Status `OOMKilled` – der Container wurde beendet.

    **Ursache:** Der Container hat sein **Speicher-Limit** überschritten. `OOM` heißt Out Of Memory: Kubernetes beendet den Container gezielt, damit er nicht den ganzen Node mitreißt. Beim `speicherfresser` ist das **gewollt**; bei deiner echten App heißt es entweder **Limit zu niedrig** oder **die App braucht wirklich zu viel** (z.B. ein Speicherleck).

    **Prüfen:**

    ```bash
    kubectl describe pod <pod-name>
    ```

    Unter `State: Terminated` steht `Reason: OOMKilled` und darunter das gesetzte `Limits: memory`.

    **Beheben – abwägen, nicht blind erhöhen:**

    - Ist das Limit **realistisch zu knapp** → moderat anheben und erneut testen.
    - Wächst der Verbrauch dagegen **immer weiter** → das ist ein Hinweis auf ein **Speicherleck** in der App. Dann ist ein höheres Limit nur ein Pflaster; die Ursache liegt im Code.

    !!! note "Kurz erklärt: Speicher wird nicht gedrosselt"
        Anders als CPU (die nur **gebremst** wird) lässt sich Speicher nicht teilen. Überschreitet ein Container sein Memory-Limit, bleibt Kubernetes nur, ihn zu **beenden**. Deshalb ist `OOMKilled` immer ein hartes Ende, kein langsames Ausbremsen.

---

## Hilfekarte 6 – port-forward klappt nicht

??? info "Aufklappen"
    **Symptom:** `kubectl port-forward …` bricht ab oder <http://localhost:8080> bleibt leer.

    **Die drei häufigsten Gründe:**

    - **Der Pod ist nicht bereit.** Nur ein `Running`/`1/1`-Pod nimmt den Tunnel an. Zeigt `kubectl get pods` `0/1`, klemmt eine readiness-Probe ([Praxis-Schritt 3](05-praxis-probes-limits.md#schritt-3-readiness-absichtlich-brechen-rollout-bremse)).
    - **Das Terminal muss offen bleiben.** `port-forward` läuft nur, solange das Fenster offen ist. Nach einem Rollout oder `rollout restart` reißt der Tunnel ab (der alte Pod ist weg) – mit `Ctrl+C` beenden und neu starten.
    - **Port belegt?** Meldung „address already in use" → nimm einen anderen linken Port: `kubectl port-forward deployment/webserver 8081:80`, dann <http://localhost:8081>.

    Ausführlicher steht das in [Teil 1, Hilfekarte 6](../kubernetes-praxis/09-hilfekarten.md#hilfekarte-6-port-forward-klappt-nicht).

---

## Weiter

- Zurück zu den Praxis-Seiten: [Praxis: Config & Secrets](03-praxis-config-secrets.md) · [Praxis: Probes & Limits](05-praxis-probes-limits.md)
- [Rückblick & Ausblick](09-rueckblick.md) – was du mitnimmst und wie es weitergeht
