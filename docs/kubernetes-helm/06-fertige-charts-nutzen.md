---
title: "Fertige Charts nutzen"
description: "Der zweite und viel häufigere Fall im Alltag: Jemand anders hat das Chart schon gebaut und du installierst es nur. Repositories hinzufügen und durchsuchen, ein fremdes Chart vor dem Start prüfen mit „helm show values“ und „helm template“ – und dann die Auflösung: der komplette Monitoring-Stack, den ihr im Monitoring-Block von Hand verdrahtet habt, als ein einziger Befehl."
---

# Fertige Charts nutzen

!!! info "Das läuft im Hauptraum – du musst hier nichts tippen"
    Diese Seite gehört zum Theorieteil: Den Monitoring-Stack rolle ich einmal für alle aus, du schaust zu. Zum Nachlesen ist die Seite da, zum Mitmachen nicht. Deine nächste Aufgabe ist die [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md).

Bis hierher warst du der **Chart-Bauer**. Du hast in [Praxis: Dein erstes Chart](03-praxis-erstes-chart.md) dein eigenes Paket geschnürt und es in [Praxis: Upgrade & Rollback](05-praxis-upgrade-rollback.md) durch Revisionen geschoben. Das ist die eine Hälfte des Alltags – die für **deine eigene Software**.

Die andere Hälfte ist die häufigere. Du brauchst Prometheus, eine Datenbank, einen Ingress-Controller, ein Zertifikats-Werkzeug. Nichts davon schreibst du selbst. Und das Chart dafür hat längst jemand anders gebaut, gepflegt und veröffentlicht. Dein Job ist dann nicht bauen, sondern **auswählen, prüfen, installieren**.

!!! info "Die Faustregel"
    **Für das eigene Haus baust du Charts. Für alles Zugekaufte nimmst du fremde.** In einem echten Cluster laufen selten mehr als eine Handvoll selbstgebauter Charts – daneben aber ein Dutzend fremder. Diese Seite zeigt dir den zweiten Weg.

---

## Repositories – wo fremde Charts liegen

Ein **Chart-Repository** ist nichts Geheimnisvolles: ein Webserver, auf dem verpackte Charts liegen, dazu eine Datei `index.yaml`, die auflistet, was es dort gibt und in welchen Versionen. Mehr ist es nicht. Helm merkt sich die Adresse unter einem kurzen Namen und holt sich die Liste ab.

<svg viewBox="0 0 640 260" width="100%" height="260" role="img" aria-label="Ein fremdes Chart liegt in einem Repository im Internet, wird per helm repo add auf dem Laptop bekannt gemacht und per helm install im eigenen Cluster ausgerollt.">
  <defs>
    <marker id="pfeil-fremd" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" fill="#7dff9a"/>
    </marker>
  </defs>

  <text x="320" y="30" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="15" font-weight="600">Woher ein fremdes Chart kommt</text>

  <rect x="20" y="75" width="140" height="100" rx="8" fill="rgba(122,162,255,0.12)" stroke="#7aa2ff" stroke-width="2"/>
  <text x="90" y="105" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Repository</text>
  <text x="90" y="126" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">im Internet</text>
  <text x="90" y="151" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">prometheus-</text>
  <text x="90" y="164" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">community</text>

  <line x1="162" y1="125" x2="246" y2="125" stroke="#7dff9a" stroke-width="2" marker-end="url(#pfeil-fremd)"/>
  <text x="204" y="114" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">helm repo add</text>

  <rect x="250" y="75" width="140" height="100" rx="8" fill="rgba(143,164,152,0.12)" stroke="#8fa498" stroke-width="2"/>
  <text x="320" y="105" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Dein Laptop</text>
  <text x="320" y="126" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">kennt jetzt die Liste</text>
  <text x="320" y="151" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">helm search repo</text>
  <text x="320" y="164" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">helm show values</text>

  <line x1="392" y1="125" x2="476" y2="125" stroke="#7dff9a" stroke-width="2" marker-end="url(#pfeil-fremd)"/>
  <text x="434" y="114" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">helm install</text>

  <rect x="480" y="75" width="140" height="100" rx="8" fill="rgba(46,158,91,0.12)" stroke="#2e9e5b" stroke-width="2"/>
  <text x="550" y="105" text-anchor="middle" fill="#c9d4e3" font-family="system-ui, sans-serif" font-size="13" font-weight="600">Dein Cluster</text>
  <text x="550" y="126" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="11">Release monitoring</text>
  <text x="550" y="151" text-anchor="middle" fill="#8fa498" font-family="JetBrains Mono, monospace" font-size="10">122 Objekte</text>

  <text x="320" y="215" text-anchor="middle" fill="#8fa498" font-family="system-ui, sans-serif" font-size="12">Zwischen Kennen und Installieren liegt der Blick hinein: helm show values und helm template.</text>
</svg>

Vier Befehle decken den ganzen Umgang mit Repositories ab:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm repo list
helm search repo prometheus-community/kube-prometheus-stack
```

Der Reihe nach: `add` merkt sich die Adresse unter dem Kurznamen `prometheus-community`. `update` holt die aktuelle Liste ab – das machst du, bevor du nach neuen Versionen suchst. `list` zeigt, welche Repositories du kennst. Und `search repo` durchsucht die geholten Listen:

```text
NAME                                      	CHART VERSION	APP VERSION	DESCRIPTION
prometheus-community/kube-prometheus-stack	87.16.1      	v0.92.1    	kube-prometheus-stack collects Kubernetes manif...
```

Zwei Versionsnummern in einer Zeile – und genau die zwei Zähler, die du aus deiner eigenen `Chart.yaml` kennst (siehe [Ein Chart von innen](02-chart-anatomie.md)): **CHART VERSION** `87.16.1` ist der Stand des **Pakets**, **APP VERSION** `v0.92.1` der Stand der **Software** darin. Sie laufen völlig unabhängig voneinander.

!!! note "Kurz erklärt: `repo add` fasst deinen Cluster nicht an"
    `helm repo add`, `helm repo update` und `helm search repo` passieren **komplett auf deinem Laptop**. Es wird nichts installiert, nichts geladen außer einer Liste, nichts im Cluster verändert. Du kannst dir also gefahrlos Repositories hinzufügen und darin stöbern.

---

## Bevor du ein fremdes Chart installierst

Hier kommt die wichtigste Gewohnheit dieser Seite. Ein Chart ist kein harmloses Textdokument – es legt Objekte in **deinem** Cluster an, oft Dutzende, gern auch mit clusterweiten Rechten. Drei Befehle schauen hinein, **bevor** irgendetwas passiert:

| Befehl | Beantwortet die Frage |
|--------|----------------------|
| `helm show chart <chart>` | Was ist das überhaupt? (Steckbrief: Name, Version, appVersion, Beschreibung) |
| `helm show values <chart>` | Welche Stellschrauben hat es? (die vollständige `values.yaml` mit allen Standardwerten) |
| `helm template <name> <chart>` | Was würde es anlegen? (das fertig gerenderte YAML, ohne es auszurollen) |

```bash
helm show chart prometheus-community/kube-prometheus-stack
helm show values prometheus-community/kube-prometheus-stack
helm template monitoring prometheus-community/kube-prometheus-stack
```

`helm show values` ist der Befehl, den du am meisten benutzen wirst. Er zeigt dir die `values.yaml` des fremden Charts – also **die Liste aller Knöpfe, an denen du drehen darfst**, mitsamt der Standardwerte und meist mit Kommentaren des Autors. Bei einem großen Chart wie `kube-prometheus-stack` ist diese Ausgabe lang. Du liest sie nicht von vorn bis hinten, sondern schreibst sie in eine Datei und suchst gezielt nach dem, was du ändern willst:

```bash
helm show values prometheus-community/kube-prometheus-stack > werte.yaml
```

Danach durchsuchst du `werte.yaml` in deinem Editor nach `replicas`, `resources`, `persistence` oder was dich gerade interessiert.

!!! note "Kurz erklärt: `>` unter Windows"
    PowerShell legt die Datei mit `>` als UTF-16 an, nicht als UTF-8. Zum Lesen im Editor ist das egal. Willst du sie später weiterverarbeiten oder an Helm zurückgeben, nimm besser `helm show values <chart> | Out-File -Encoding utf8 werte.yaml`. Was du dort findest, setzt du beim Installieren per `-f` oder `--set` – exakt nach demselben Vorrang wie bei deinem eigenen Chart: **values.yaml des Charts < deine eigene Datei per `-f` < `--set`**.

!!! warning "Merksatz"
    **Ein fremdes Chart ist fremder Code für deinen Cluster. Schau rein, bevor du es laufen lässt.**

    `helm template` ist dafür dein bester Freund: Es rendert alles, was das Chart anlegen würde, auf deinen Bildschirm – und rührt den Cluster dabei mit keinem Finger an. Wer clusterweite Rechte vergeben bekommt, welche Images gezogen werden, was in welchem Namespace landet: alles steht da, bevor du `install` tippst.

---

## Die Demo – der ganze Monitoring-Stack mit einem Befehl

!!! info "Das mache ich im Hauptraum – schau einfach zu"
    Das hier ist **keine Übungsaufgabe** – tipp bitte nicht mit. Der Grund ist ganz praktisch: Der Stack zieht rund sechs Images. Wenn zwanzig Rechner das im selben Moment tun, dauert es ewig und wir laufen in die Rate-Limits der Registry. Also: einmal geteilt, alle schauen zu. Zum Nachlesen steht hier ohnehin alles.

Drei Befehle. Mehr ist es nicht:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace
```

Nach **rund 22 Sekunden** meldet Helm das Release als `deployed`. Danach dauert es noch **etwa 100 Sekunden**, bis alle **sechs Pods** wirklich `Running` sind – Helm ist fertig, sobald die Objekte im Cluster stehen, aber die Images müssen ja noch geladen werden und die Container starten. Zuschauen kannst du dabei so:

```bash
kubectl get pods -n monitoring -w
```

Und was steht da jetzt eigentlich? Prometheus, Alertmanager, Grafana mit fertigen Dashboards, der node-exporter auf jedem Node, der kube-state-metrics, dazu die Regeln, die das alles miteinander verdrahten.

### Die Auflösung der Schätzfrage

Auf [Warum Helm?](01-warum-helm.md) stand die Schätzfrage, wie viel YAML in so einem Stack eigentlich steckt. Jetzt lassen wir es uns einfach zeigen – ohne zu installieren:

```bash
helm template monitoring prometheus-community/kube-prometheus-stack
```

Das Ergebnis: **rund 6.800 Zeilen YAML** und **122 Objekte**. So verteilen sie sich:

```text
 35  PrometheusRule       (Alarm-Regeln)
 32  ConfigMap
 13  ServiceMonitor       (was Prometheus abfragen soll)
 11  Service
  7  ServiceAccount
  5  ClusterRoleBinding
  5  ClusterRole
  3  Deployment
 11  weitere Objekte in kleineren Arten
---
122  Objekte, rund 6.800 Zeilen
```

Halte einen Moment inne bei dieser Liste. **35 Alarm-Regeln.** Die hat jemand geschrieben, der weiß, wann ein Kubernetes-Cluster in Schwierigkeiten steckt. **5 ClusterRoles.** Die hat jemand so eng geschnitten, dass Prometheus lesen darf, was es lesen muss – und nicht mehr. Nichts davon musst du selbst können, um es zu benutzen.

!!! success "Der Satz, auf den alles hinausläuft"
    **Das habt ihr im [Monitoring-Block](../monitoring-praxis/index.md) von Hand gebaut – hier ist es ein Befehl.**

    Erinnerst du dich? Prometheus-Konfiguration schreiben, das Scrape-Target eintragen, Grafana danebenstellen, die Datenquelle verbinden, ein Dashboard zusammenklicken. Ein Nachmittag Arbeit, drei Dienste, alles selbst verdrahtet. Genau das war **richtig und wichtig**: Du weißt jetzt, was da drin passiert. Aber es war eben auch die Handarbeits-Variante von etwas, das jemand anders schon zu Ende gedacht hat – für 122 Objekte statt für drei.

!!! note "Ehrlich bleiben bei den Zahlen"
    Die 6.800 Zeilen, die 122 Objekte und die Verteilung oben gelten für **Chart-Version 87.16.1** (App-Version `v0.92.1`), gemessen am 16. Juli 2026. Bei dir wird eine neuere Version im Repository liegen und die Zahlen werden anders aussehen. Die Größenordnung bleibt – die genaue Zahl ist eine Momentaufnahme. Deshalb steht die Chart-Version hier immer dabei.

---

## Nicht jedes Chart ist ein gutes Chart

!!! warning "Nicht jedes Chart ist ein gutes Chart"
    Bis vor Kurzem hätte auf dieser Seite ein **bitnami**-Chart gestanden. Bitnami war jahrelang **die** Adresse für fertige Charts – sauber gebaut, für fast jede Software eines da. Praktisch jedes Helm-Tutorial im Netz benutzt bis heute `bitnami/nginx` oder `bitnami/postgresql` als Beispiel.

    Ende August 2025 hat **Broadcom** den Bitnami-Katalog umgestellt. Seitdem sind die **versionierten Images verschwunden**. Konkret:

    ```bash
    docker pull bitnami/nginx:1.27
    ```

    Das zieht nicht mehr – das Image gibt es unter dieser Adresse nicht. Es zieht nur noch `bitnami/nginx:latest` (beziehungsweise `bitnamilegacy/nginx:1.27` im Altbestand). Und das Chart `bitnami/nginx` rendert heute folgerichtig `image: ...bitnami/nginx:latest`.

    **Für diesen Kurs heißt das: keine bitnami-Charts.** Wir nehmen `prometheus-community` (getestet) oder unser eigenes Chart. Wundere dich nicht, wenn Tutorials etwas anderes sagen – die sind älter als diese Umstellung.

### Der Lehrmoment

Bleib einen Moment bei dem, was da passiert ist. Ein Anbieter trifft eine Geschäftsentscheidung – und über Nacht ziehen Deployments auf der ganzen Welt ein Image, das es so nicht mehr gibt. Nicht wegen eines Bugs. Nicht wegen eines Angriffs. Weil jemand den Stecker gezogen hat.

**Ein Anbieter zieht den Stecker und deine Deployments stehen.** Das ist kein theoretisches Risiko, das ist letztes Jahr passiert – und zwar dem meistgenutzten Chart-Katalog überhaupt.

Zwei Konsequenzen für dich – beide kennst du eigentlich schon:

- **Pinne Versionen.** Wer `bitnami/nginx:1.27` in seinem Manifest stehen hatte, bekam einen ehrlichen, lauten Fehler: Image nicht gefunden. Wer `:latest` stehen hatte, bekam irgendwann klammheimlich eine andere Software untergeschoben. Der laute Fehler ist der bessere. Genau das ist der Grund, warum wir in [Docker für Profis](../docker-profi/index.md) fixierte Versionen ins `FROM` schreiben und **nie** `:latest`. Bei Charts gilt es genauso: `helm install ... --version 87.16.1` fixiert das Chart, statt beim nächsten `helm repo update` etwas Neues zu erwischen.
- **Schau in fremde Charts hinein.** `helm template` hätte dir das `:latest` gezeigt – vor der Installation, in einer Zeile, schwarz auf weiß. Das ist keine Paranoia, das sind fünf Sekunden Arbeit.

Und die dritte, unbequemere Konsequenz: **Ein fremdes Chart ist eine Abhängigkeit wie jede andere.** Wer es pflegt, wie lange es das noch gibt, wem der Katalog gehört – das sind Fragen, die man **vor** dem `install` stellt, nicht danach.

---

## Wieder abräumen

Ein Release, das du nicht mehr brauchst, verschwindet genauso einfach, wie es kam:

```bash
helm uninstall monitoring -n monitoring
```

Helm räumt alle 122 Objekte weg – die es angelegt hat. Denn genau das ist der Unterschied zum handgeschriebenen YAML: Helm weiß, was zum Release gehört und muss nicht raten. Ein Befehl rein, ein Befehl raus.

!!! note "Der Namespace bleibt"
    `--create-namespace` beim Installieren legt den Namespace an – aber `helm uninstall` löscht ihn **nicht** wieder. Der Namespace `monitoring` bleibt leer stehen. Das ist Absicht: Helm hat ihn nur nebenbei erzeugt, er ist kein Teil des Releases – und in ihm könnte inzwischen etwas anderes liegen. Wenn du ihn loswerden willst, sag es ausdrücklich:

    ```bash
    kubectl delete namespace monitoring
    ```

---

!!! quote "Mitnehmen"
    1. **Der häufigere Fall ist: installieren, nicht bauen.** Für deine eigene Software baust du ein Chart. Für alles andere nimmst du eines, das es schon gibt – `helm repo add`, `helm search repo`, `helm install`.
    2. **Ein fremdes Chart ist fremder Code für deinen Cluster.** `helm show chart` sagt dir, was es ist, `helm show values` zeigt die Stellschrauben und `helm template` zeigt dir alles, was es anlegen würde, bevor es das tut.
    3. **Was ihr im Monitoring-Block von Hand gebaut habt, sind hier drei Befehle** – rund 6.800 Zeilen und 122 Objekte, die jemand anders zu Ende gedacht hat. Die Handarbeit war trotzdem richtig: Nur deshalb weißt du, was in dem Paket steckt.
    4. **Fremde Charts sind Abhängigkeiten.** Bitnami zeigt, wie schnell ein Anbieter den Stecker zieht. Pinne Versionen, schau hinein und wisse, worauf du dich verlässt.

---

## Weiter

- [Praxis: Drei Umgebungen](07-lab-drei-umgebungen.md) – zurück zu deinem eigenen Chart: dieselbe App dreimal, in dev, test und prod
