---
title: "Praxis: Upgrade & Rollback"
description: "Angeleitete Übung: das Release station per „helm upgrade“ von Blau auf Grün ziehen, dabei sehen, wie die Prüfsumme im Chart den Rollout ganz von selbst auslöst, die History lesen und mit „helm rollback“ in einem einzigen Befehl zurück auf Blau springen – mit eigener Aufgabe und Lösung."
---

# Praxis – hochziehen und zurückrollen

<span class='badge badge-praxis'>Praxis – Pflicht</span> &nbsp; In Teil 2 hast du eine Farbe geändert und die Pods anschließend von Hand ausgetauscht. Heute machst du dasselbe mit **einem** Befehl. Und das Bessere daran: Du machst es mit **einem** Befehl auch wieder rückgängig.

Das hier ist die Übung, für die du Helm gelernt hast. Alles andere – Chart, Templates, Werte – war der Anlauf. Jetzt springt die Farbe zurück.

!!! info "Voraussetzung"
    Du hast die [vorige Praxis](03-praxis-erstes-chart.md) hinter dir: Das Release **station** läuft, die Seite ist blau. Dein Cluster läuft (`kubectl get nodes` zeigt `Ready`) und die Projektdateien liegen lokal:

    ```bash
    git clone https://github.com/JacobMenge/kurs-unterlagen.git
    cd kurs-unterlagen/apps/kubernetes-helm
    ```

    Alle `helm`-Befehle gehen relativ von diesem Ordner aus – `./webserver` ist das Chart.

!!! tip "Zeitrahmen"
    Rund **30 bis 45 Minuten**: erst die angeleitete Übung, dann die Aufgabe zum Selbermachen. Halte zwei Terminals bereit – eines bleibt für den `port-forward`-Tunnel offen.

---

## Schritt für Schritt

### Schritt 1 – Zurück auf Anfang

Auf der vorigen Seite hast du `station` schon umkonfiguriert – Standort, Farbe, Version und die Zahl der Pods. Für diese Übung fangen wir sauber an, damit die Revisionen gleich zu dem passen, was du hier siehst:

```bash
helm uninstall station
helm install station ./webserver
```

Nebenbei siehst du hier schon eine Stärke des Pakets: Ein `helm uninstall` räumt **alles** ab, was zum Release gehört – ConfigMap, Secret, Service und Deployment in einem Zug. Kein Suchen nach vergessenen Objekten.

Jetzt schau nach, wo du stehst:

```bash
helm list
```

In der Zeile für `station` steht **REVISION 1** und **STATUS `deployed`**. Auch die Pods sind wieder zwei:

```bash
kubectl get pods -l app=station
```

```text
NAME                       READY   STATUS    RESTARTS   AGE
station-697cc5d946-t8qr6   1/1     Running   0          30s
station-697cc5d946-zbbmj   1/1     Running   0          30s
```

Und die ConfigMap, die Helm beim Installieren aus deinen Werten gerendert hat:

```bash
kubectl get configmap station-config -o jsonpath='{.data}'
```

```text
{"COLOR":"#2563a8","STANDORT":"Rechenzentrum Nord","VERSION":"1"}
```

Mach den Tunnel auf. **Dieses Terminal bleibt offen**, solange der Tunnel steht:

```bash
kubectl port-forward svc/station 8080:80
```

Öffne <http://localhost:8080>. Du siehst die blaue Seite:

<div class="app-shot app-shot--blau">
  <p class="as-titel">Version 1</p>
  <p class="as-zeile">Standort: Rechenzentrum Nord</p>
  <p class="as-meta">Server name: station-697cc5d946-t8qr6</p>
</div>

Merk dir dieses Bild. Am Ende der Stunde ist es wieder da – nach einem Umweg über Grün.

---

### Schritt 2 – Das Upgrade: von Blau auf Grün

Jetzt ziehst du das Release hoch. Wichtig: Du fasst **keine einzige Datei** an. Du gibst nur andere Werte mit. Nimm dafür dein **zweites** Terminal, der Tunnel bleibt offen:

```bash
helm upgrade station ./webserver --set color="#2e9e5b" --set version=2 --set standort="Rechenzentrum Sued"
```

```text
Release "station" has been upgraded. Happy Helming!
NAME: station
LAST DEPLOYED: Thu Jul 16 15:01:02 2026
NAMESPACE: default
STATUS: deployed
REVISION: 2
```

**REVISION: 2** – das ist die wichtigste Zeile der ganzen Ausgabe. Helm hat die Revision 1 nicht überschrieben, sondern eine zweite **daneben** gelegt. Der alte Stand ist noch da. Merk dir das für Schritt 5.

!!! note "Kurz erklärt: die Anführungszeichen auf der Kommandozeile"
    Drei Kleinigkeiten in diesem Befehl, über die man gern stolpert:

    - **`"Rechenzentrum Sued"` steht in Anführungszeichen.** Ohne sie zerteilt die Shell den Wert am Leerzeichen – Helm bekäme `Rechenzentrum` als Wert und `Sued` als eigenes Argument obendrauf. Mit Anführungszeichen kommt der Text als **ein** Wert an. In PowerShell funktioniert das genauso wie in der bash.
    - **Das `#` in `"#2e9e5b"` ist kein Kommentar.** Mitten in einem Token leitet es nichts ein, der Wert kommt vollständig an. Das kennst du schon aus Teil 1.
    - **Warum „Sued" ohne Umlaut?** Auf der Kommandozeile bleiben wir bei einfachen Zeichen, weil Umlaute je nach Terminal-Einstellung unterschiedlich ankommen können. In einer Werte-Datei (`-f …`) sind Umlaute unproblematisch – in [Teil 2](../kubernetes-aufbau/03-praxis-config-secrets.md) stand in der ConfigMap ja auch „Rechenzentrum Süd".

---

### Schritt 3 – Der Rollout, den niemand gestartet hat

Schau dem Austausch zu:

```bash
kubectl rollout status deployment/station
```

```text
Waiting for deployment "station" rollout to finish: 1 out of 2 new replicas have been updated...
Waiting for deployment "station" rollout to finish: 1 old replicas are pending termination...
deployment "station" successfully rolled out
```

Der `port-forward` aus Schritt 1 hing an einem alten Pod und **reißt beim Austausch ab** – wie immer. **Ctrl+C** in Terminal 1, dann neu aufmachen:

```bash
kubectl port-forward svc/station 8080:80
```

Lade <http://localhost:8080> neu:

<div class="app-shot app-shot--gruen">
  <p class="as-titel">Version 2</p>
  <p class="as-zeile">Standort: Rechenzentrum Sued</p>
  <p class="as-meta">Server name: station-&lt;neuer-pod&gt;</p>
</div>

Und jetzt halt kurz inne. **Hast du irgendwo `kubectl rollout restart` getippt?**

Nein. Genau das musstest du in [Teil 2](../kubernetes-aufbau/03-praxis-config-secrets.md) noch von Hand tun: erst die ConfigMap ändern (`apply`), dann die Pods austauschen (`rollout restart`) – zwei Schritte, den zweiten hat man gern vergessen und wunderte sich dann über die alte Seite. Hier hat ein Befehl gereicht.

!!! info "Warum rollt Kubernetes hier von selbst aus?"
    Der Grund steht im Chart, in einer einzigen Zeile. Öffne `webserver/templates/deployment.yaml` und sieh dir die Pod-Vorlage an:

    ```yaml
        metadata:
          labels:
            app: {{ .Release.Name }}
          annotations:
            checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
    ```

    Übersetzt heißt die letzte Zeile: „Render die ConfigMap, bilde eine **Prüfsumme** über das Ergebnis und heft sie als Notiz an die **Pod-Vorlage**."

    Damit hängt alles an einer Kette:

    ```text
    --set color="#2e9e5b"
      -> die gerenderte ConfigMap sieht anders aus
        -> die Pruefsumme ist eine andere
          -> die Annotation an der Pod-Vorlage aendert sich
            -> die Pod-Vorlage ist nicht mehr dieselbe
              -> Kubernetes rollt aus (das Rolling Update aus Teil 1)
    ```

    Der Punkt in der Mitte ist der entscheidende: Kubernetes tauscht Pods genau dann aus, wenn sich die **Pod-Vorlage** ändert. Eine geänderte ConfigMap allein ändert die Vorlage **nicht** – deshalb der Handgriff in Teil 2. Die Prüfsumme schmuggelt die Änderung in die Vorlage hinein.

    Und hier steckt der eigentliche Gewinn eines Charts: Diesen Handgriff hat jemand **einmal** ins Paket eingebaut. Jeder, der das Chart benutzt, bekommt ihn geschenkt – auch wer nie davon gehört hat.

---

### Schritt 4 – Die History lesen

Helm führt Buch. Frag nach:

```bash
helm history station
```

Du siehst **zwei** Zeilen:

- **Revision 1** mit `STATUS superseded` und der Beschreibung `Install complete` – der blaue Stand, abgelöst.
- **Revision 2** mit `STATUS deployed` und `Upgrade complete` – der grüne Stand, aktuell.

`superseded` heißt **abgelöst**, nicht gelöscht. Revision 1 ist noch vollständig da: die Werte von damals und die Objekte, die daraus wurden. Helm hat sie beim Upgrade nicht weggeworfen, sondern beiseite gelegt.

!!! note "Wo liegt diese Geschichte eigentlich?"
    Nicht auf deinem Laptop. Helm legt zu **jeder** Revision ein **Secret im Cluster** ab, im Namespace des Releases. Die Namen folgen einem festen Muster: `sh.helm.release.v1.station.v1`, `sh.helm.release.v1.station.v2` und so weiter. Schau selbst nach:

    ```bash
    kubectl get secret
    ```

    Zwischen deinem `station-secret` stehen dort die Einträge von Helm. Deshalb sieht deine Kollegin auf ihrem Rechner exakt dieselbe History wie du – ihr fragt beide denselben Cluster. Die Geschichte deiner Releases hängt nicht an deinem Notebook.

---

### Schritt 5 – Der Rücksprung

Jetzt der Moment, für den du das alles gemacht hast.

Stell dir vor, es ist Freitagnachmittag. Die grüne Version ist seit zehn Minuten draußen, ein Kunde ruft an, irgendetwas stimmt nicht. Du willst zurück – nicht „gleich", sondern **sofort**.

```bash
helm rollback station 1
```

```text
Rollback was a success! Happy Helming!
```

Mehr passiert auf dem Bildschirm nicht. Im Cluster passiert eine Menge. Sieh zu:

```bash
kubectl rollout status deployment/station
```

Der Tunnel reißt wieder ab (die Pods werden ja getauscht) – **Ctrl+C**, neu starten, dann <http://localhost:8080> laden. Die Seite ist **wieder blau**, **Version 1**, **Standort: Rechenzentrum Nord**. Genau das Bild aus Schritt 1.

Ein Befehl. Ein Sprung zurück. Kein Nachschlagen, welche Farbe vorher drin war, kein „welchen Standort hatten wir denn?" – Helm wusste es.

---

### Schritt 6 – Und was sagt die History jetzt?

```bash
helm history station
```

```text
REVISION	UPDATED                 	STATUS    	CHART          	APP VERSION	DESCRIPTION
1       	Thu Jul 16 15:00:33 2026	superseded	webserver-0.1.0	1          	Install complete
2       	Thu Jul 16 15:01:02 2026	superseded	webserver-0.1.0	1          	Upgrade complete
3       	Thu Jul 16 15:01:20 2026	deployed  	webserver-0.1.0	1          	Rollback to 1
```

Lies die letzte Zeile genau. Da steht **nicht** „Revision 2 gelöscht". Da steht: **Revision 3, `Rollback to 1`**.

<svg viewBox="0 0 640 260" width="100%" height="260" role="img" aria-label="Zeitstrahl der Revisionen: Revision 1 Install mit blauer Seite, Revision 2 Upgrade mit grüner Seite, Revision 3 Rollback holt die Werte von Revision 1 zurück und ist wieder blau">
  <defs>
    <marker id="helm-rb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#7dff9a"/>
    </marker>
  </defs>

  <text x="214" y="40" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#7dff9a">helm upgrade</text>
  <text x="425" y="40" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#7dff9a">helm rollback station 1</text>

  <rect x="30" y="50" width="160" height="76" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="110" y="76" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#c9d4e3">Revision 1</text>
  <text x="110" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#8fa498">Install complete</text>
  <text x="110" y="115" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#7aa2ff">blaue Seite</text>

  <rect x="240" y="50" width="160" height="76" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="320" y="76" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#c9d4e3">Revision 2</text>
  <text x="320" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#8fa498">Upgrade complete</text>
  <text x="320" y="115" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#2e9e5b">grüne Seite</text>

  <rect x="450" y="50" width="160" height="76" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="530" y="76" text-anchor="middle" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#c9d4e3">Revision 3</text>
  <text x="530" y="96" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#8fa498">Rollback to 1</text>
  <text x="530" y="115" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#7aa2ff">wieder blau</text>

  <line x1="196" y1="88" x2="232" y2="88" stroke="#7dff9a" stroke-width="2" marker-end="url(#helm-rb-arrow)"/>
  <line x1="406" y1="88" x2="442" y2="88" stroke="#7dff9a" stroke-width="2" marker-end="url(#helm-rb-arrow)"/>

  <path d="M 110 126 C 110 215, 530 215, 530 126" fill="none" stroke="#7dff9a" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#helm-rb-arrow)"/>
  <text x="320" y="172" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#7dff9a">holt die Werte von Revision 1 zurück</text>

  <text x="320" y="244" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#8fa498">Ein Rollback löscht nichts – er stellt einen alten Stand als neue Revision wieder her.</text>
</svg>

Das ist der Satz, den du dir aus dieser Stunde mitnimmst:

!!! success "Merksatz zum Mitnehmen"
    **Ein Rollback ist kein Löschen. Es ist eine neue Revision, die einen alten Stand wiederherstellt.** Die Geschichte bleibt vollständig – man sieht später noch, dass es einen grünen Stand gab und dass jemand ihn zurückgeholt hat. Der Zähler läuft immer nur vorwärts, auch wenn der Inhalt zurückgeht.

Das hat einen sehr praktischen Nebeneffekt: Weil Revision 2 noch in der Liste steht, kannst du sie **jederzeit wieder holen**. Genau das machst du gleich in der Aufgabe.

!!! tip "Vergleich: `kubectl rollout undo` und `helm rollback`"
    Einen Rückwärtsgang hattest du schon. In [Teil 1](../kubernetes-praxis/06-praxis-deployment.md) hast du `kubectl rollout undo deployment/webserver` benutzt – auch ein guter Befehl. Aber er kennt nur **ein Deployment**.

    Hätte dein Update auch die ConfigMap, das Secret oder den Service angefasst, blieben die auf dem neuen Stand stehen. Das Ergebnis wäre ein halb zurückgerolltes System: alte Pods, neue Konfiguration. Solche Zwischenzustände sind die, bei denen man abends um zehn noch im Büro sitzt.

    `helm rollback` holt das **ganze Paket** zurück – ConfigMap, Secret, Service und Deployment auf einmal, weil Helm alle vier als **ein Release** kennt. Das ist der Unterschied zwischen „ich mache eine Änderung rückgängig" und „ich stelle einen Stand wieder her".

---

## Übungsaufgabe – vor und zurück

Jetzt du. Versuch es erst **ohne** zu spicken – die Lösung ist darunter.

#### Aufgabe

1. **Roll wieder vorwärts** auf den grünen Stand – aber **ohne** die drei `--set`-Flags noch einmal zu tippen.
2. **Bau absichtlich Mist:** Setz die Farbe auf einen leeren Wert (`--set color=""`), schau dir die Seite an und komm dann mit **einem** Befehl auf einen guten Stand zurück.
3. **Kür:** Wie viele Revisionen hebt Helm eigentlich auf? Lass `helm upgrade` ein paarmal mit wechselnden Farben laufen und beobachte dabei `helm history`.

??? tip "Schritt für Schritt (Lösung)"
    **Aufgabe 1 – vorwärts per Rollback.**

    Klingt verdreht, ist aber genau richtig: Ein Rollback kann auch **nach vorn**. Der grüne Stand ist Revision 2, also hol ihn dir:

    ```bash
    helm rollback station 2
    kubectl rollout status deployment/station
    ```

    Helm meldet wieder den erfolgreichen Rollback. Tunnel neu starten, Seite neu laden: grün, Version 2, Standort Rechenzentrum Sued. Du hast die alten Werte nicht getippt – du hast sie **geholt**.

    Und `helm history station` zeigt jetzt eine **vierte** Zeile: Revision 4, wieder ein Rollback, diesmal auf Revision 2. Der Zähler läuft weiter vorwärts, der Inhalt springt hin und her. Genau dafür ist die History da.

    ---

    **Aufgabe 2 – kaputt und zurück.**

    ```bash
    helm upgrade station ./webserver --set color=""
    kubectl rollout status deployment/station
    ```

    Beachte zuerst, was **nicht** passiert: Helm meckert nicht. Ein leerer Text ist ein gültiger Wert. Das `| quote` im Template macht daraus sauberes `COLOR: ""`, die ConfigMap nimmt es an, die Pods starten. Aus Helms Sicht ist alles in bester Ordnung.

    Nur die Seite ist es nicht. Sie kommt **ohne Hintergrundfarbe** hoch – also weiß beziehungsweise das, was der Browser standardmäßig anzeigt. Da die Schrift unserer Demo-Seite weiß ist, ist entsprechend wenig zu erkennen.

    Das ist die Lektion nebenbei: **Helm prüft, ob dein Wert gültig ist – nicht, ob er richtig ist.** Kein Werkzeug der Welt nimmt dir das ab. Aber der Rückweg ist billig – und das ist der Punkt.

    Noch etwas fällt dir auf: Die Seite zeigt wieder **Version 1** und **Rechenzentrum Nord**. Warum? Weil `helm upgrade` die Standardwerte aus `values.yaml` nimmt **plus** das, was du diesmal mitgibst. Die `--set`-Werte vom letzten Mal sammelt es nicht von allein wieder ein.

    Der Rückweg. Erst nachsehen, welcher Stand gut war:

    ```bash
    helm history station
    ```

    Der letzte gute Stand ist die Revision davor. Setz ihre Nummer aus deiner eigenen History ein:

    ```bash
    helm rollback station <nummer>
    ```

    Tunnel neu, Seite neu laden – die Farbe ist wieder da. Ein Befehl.

    ---

    **Aufgabe 3 (Kür) – wie lang ist Helms Gedächtnis?**

    Lass ein paar Upgrades laufen, jedes mit einer anderen Farbe:

    ```bash
    helm upgrade station ./webserver --set color="#7a3fa0"
    helm upgrade station ./webserver --set color="#c2680a"
    helm upgrade station ./webserver --set color="#2563a8"
    helm history station
    ```

    Die Liste wächst mit jedem Aufruf um eine Zeile. Dahinter stecken **zwei** Zahlen, die man auseinanderhalten muss:

    - **Wie viele Revisionen `helm history` anzeigt**, steuert `--max`. Ohne Angabe zeigt der Befehl die letzten **256**.
    - **Wie viele Revisionen Helm überhaupt aufhebt**, steuert `--history-max` bei `helm upgrade`. Standard sind **10**. Ältere fallen hinten raus.

    Im Kurs merkst du davon nichts – so viele Upgrades machst du heute nicht. In einem Cluster, in dem seit Monaten täglich ausgerollt wird, sieht das anders aus: Was älter als die letzten zehn Revisionen ist, holst du nicht mehr per `helm rollback` zurück. Dafür gibt es dann Git – die Werte-Dateien liegen ja dort.

??? success "Erwartung"
    Du bist vor und zurück gesprungen, ohne dir dabei einen einzigen Wert merken zu müssen: `helm upgrade` hat eine neue Revision erzeugt, `helm rollback` hat einen alten Stand als **wieder neue** Revision zurückgeholt. Du hast gesehen, dass die Prüfsumme im Chart den Rollout von selbst auslöst – der Handgriff `kubectl rollout restart` aus Teil 2 entfällt, weil ihn jemand ins Paket eingebaut hat. Und du kennst den Unterschied, auf den es ankommt: `kubectl rollout undo` holt **ein Deployment** zurück, `helm rollback` das **ganze Paket**.

---

## Aufräumen oder weiterlaufen lassen

Für die nächste Seite brauchst du `station` nicht – dort holst du dir ein **fremdes** Chart aus dem Netz. Du kannst das Release also abräumen:

```bash
helm uninstall station
```

Das entfernt alles, was zum Release gehört – ConfigMap, Secret, Service und Deployment – und dazu die gespeicherte History. Oder du lässt es einfach laufen: Es stört niemanden und in der [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md) taucht `station` ohnehin wieder auf.

!!! tip "Tunnel beenden, Cluster behalten"
    Das `port-forward`-Terminal schließt du mit **Ctrl+C** – das beendet nur den Tunnel, nicht die Pods. Und wenn für heute Schluss ist, leg den Cluster schlafen: `minikube stop`. Mit `minikube start` ist er später wieder da, samt Releases.

---

## Wenn etwas hakt

Die Seite bleibt blau, obwohl das Upgrade durch ist? `helm upgrade` bricht ab? Die abgestuften Hinweise stehen in den [Stolpersteinen](09-stolpersteine.md). Drei Schnellschüsse vorab:

- **`helm` wird nicht gefunden?** Falls du Helm gerade erst installiert hast: Schließ das PowerShell-Fenster und öffne ein neues. Das laufende Fenster kennt den neuen Befehl noch nicht.
- **Die Seite zeigt noch den alten Stand?** Schau mit `kubectl get pods -l app=station` auf die Spalte `AGE`, ob die Pods wirklich neu sind. Und denk an den Tunnel – er hing am alten Pod und muss neu gestartet werden.
- **`helm upgrade` beschwert sich über das Release?** Dann heißt es womöglich anders, als du denkst. `helm list` zeigt die echten Namen im aktuellen Namespace.

---

## Weiter

- **[Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md)** – deine nächste Pflichtaufgabe: dieselbe App als dev, test und prod, aus einem einzigen Chart
- [Fertige Charts nutzen](06-fertige-charts-nutzen.md) – zum Nachlesen: ein Chart, das jemand anderes gebaut hat. Das zeige ich im Hauptraum, du musst dafür nichts tippen
