---
title: "Cheatsheet – Helm"
description: "Die wichtigsten Helm-Befehle als Tabellen – install, upgrade, rollback, Werte und Repositories zum schnellen Nachschlagen."
---

# Cheatsheet – Helm

Helm ist der Paketmanager für Kubernetes: ein **Chart** ist das Paket, ein **Release** ist eine installierte Ausprägung davon. Die Beispiele auf dieser Seite nutzen das Chart `webserver` aus dem Kursordner `apps/kubernetes-helm` und das Release heißt `station`.

!!! info "Helm 4"
    Alle Befehle hier sind mit **Helm 4** geprüft. Viele Tutorials im Netz zeigen noch Helm 3 – für alles auf dieser Seite ist das egal, die Befehle verhalten sich gleich.

## Installieren & prüfen

| Befehl | Bedeutung |
|--------|-----------|
| `helm version` | Installierte Version anzeigen (und damit: ist Helm überhaupt da?) |
| `winget install --id Helm.Helm --exact` | Helm unter **Windows** installieren |
| `brew install helm` | Helm unter **macOS** installieren |

Für **Linux** gibt es je nach Distribution ein eigenes Paket – siehe `helm.sh/docs/intro/install`.

`helm version` sieht so aus:

```text
version.BuildInfo{Version:"v4.2.3", GitCommit:"43e8b7feece8beb0fcba47059ec9b522fd929a64", GitTreeState:"clean", GoVersion:"go1.26.5", KubeClientVersion:"v1.36"}
```

!!! warning "Nach `winget install`: PowerShell schließen und neu öffnen"
    Das **laufende** Fenster kennt `helm` noch nicht – der PATH wird erst beim Start einer Sitzung gelesen. Wenn `helm version` direkt nach der Installation „nicht gefunden" meldet, ist nichts kaputt: neues PowerShell-Fenster, nochmal probieren.

## Chart bauen & prüfen

| Befehl | Bedeutung |
|--------|-----------|
| `helm create <name>` | Gerüst für ein neues Chart anlegen (mit Beispiel-Vorlagen) |
| `helm lint ./<chart>` | Chart auf Syntax- und Struktur-Fehler prüfen |
| `helm template <release> ./<chart>` | Vorlagen rendern und das fertige YAML ausgeben – **ohne** zu installieren |
| `helm template <release> ./<chart> -f werte.yaml` | Dasselbe, aber mit eigener Werte-Datei |
| `helm show values <chart>` | Die Standardwerte (`values.yaml`) eines Charts anzeigen |
| `helm show chart <chart>` | Den Steckbrief (`Chart.yaml`) anzeigen: Name, Version, appVersion |
| `helm package ./<chart>` | Chart zu einer `.tgz`-Datei schnüren (zum Weitergeben) |

`helm lint` bei einem gesunden Chart:

```text
==> Linting ./webserver
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

`[INFO]` ist ein Hinweis, kein Fehler. Entscheidend ist die letzte Zeile: `0 chart(s) failed`.

!!! note "`helm create` legt in Helm 4 mehr an als du brauchst"
    Unter anderem eine `templates/httproute.yaml` für die Gateway API. Für unsere Übungen brauchst du das Beispiel-Gerüst nicht – das Chart `webserver` im Kursordner ist bewusst auf das Nötige abgespeckt.

## Installieren & ändern

| Befehl | Bedeutung |
|--------|-----------|
| `helm install <release> ./<chart>` | Chart als neues Release installieren |
| `helm install <release> ./<chart> -f werte.yaml` | Mit eigener Werte-Datei installieren |
| `helm install <release> ./<chart> --set key=wert` | Einzelnen Wert direkt überschreiben |
| `helm install <release> ./<chart> -n <namespace> --create-namespace` | In eigenen Namespace installieren, Namespace bei Bedarf anlegen |
| `helm upgrade <release> ./<chart>` | Bestehendes Release ändern – erzeugt eine neue Revision |
| `helm upgrade --install <release> ./<chart>` | Beim ersten Mal installieren, danach ändern – der Befehl für Pipelines |

Installieren:

```bash
helm install station ./webserver
```

```text
NAME: station
LAST DEPLOYED: Fri Mar 15 15:00:33 2024
NAMESPACE: default
STATUS: deployed
REVISION: 1
DESCRIPTION: Install complete
TEST SUITE: None
NOTES:
Das Release station ist installiert (Revision 1).
```

Darunter folgt der Rest der `NOTES.txt` aus dem Chart: der passende `port-forward`-Befehl und die Werte, die du auf der Seite erwarten darfst.

Ändern – Farbe, Version und Standort in einem Rutsch:

```bash
helm upgrade station ./webserver --set color="#2e9e5b" --set version=2 --set standort="Rechenzentrum Sued"
```

```text
Release "station" has been upgraded. Happy Helming!
NAME: station
LAST DEPLOYED: Fri Mar 15 15:01:02 2024
NAMESPACE: default
STATUS: deployed
REVISION: 2
```

!!! tip "Kein `kubectl rollout restart` mehr nötig"
    Das Chart trägt in die Pod-Vorlage eine Prüfsumme der ConfigMap ein (`checksum/config`). Ändert sich ein Wert, ändert sich die Prüfsumme – die Vorlage sieht anders aus und Kubernetes rollt von selbst neu aus. Den Handgriff aus [Teil 2](../kubernetes-aufbau/03-praxis-config-secrets.md) kannst du dir sparen.

## Ansehen

| Befehl | Bedeutung |
|--------|-----------|
| `helm list` | Releases im aktuellen Namespace |
| `helm list -A` | Releases in **allen** Namespaces |
| `helm status <release>` | Status, Revision und die NOTES zum Release |
| `helm get values <release>` | Nur die Werte, die **du** gesetzt hast |
| `helm get values <release> --all` | Alle Werte, inklusive der Standardwerte aus `values.yaml` |
| `helm get manifest <release>` | Das YAML, das wirklich im Cluster liegt |
| `helm history <release>` | Alle Revisionen des Releases mit Zeitstempel |

Dasselbe Chart in vier Namespaces:

```bash
helm list -A
```

```text
NAME     NAMESPACE  REVISION  UPDATED                                  STATUS    CHART            APP VERSION
station  default    3         2024-03-15 15:01:20.7176141 +0200 CEST   deployed  webserver-0.1.0  1
station  dev        1         2024-03-15 15:01:41.5624155 +0200 CEST   deployed  webserver-0.1.0  1
station  prod       1         2024-03-15 15:01:42.391452 +0200 CEST    deployed  webserver-0.1.0  1
station  test       1         2024-03-15 15:01:41.9583803 +0200 CEST   deployed  webserver-0.1.0  1
```

Die Historie:

```bash
helm history station
```

```text
REVISION  UPDATED                   STATUS      CHART            APP VERSION  DESCRIPTION
1         Fri Mar 15 15:00:33 2024  superseded  webserver-0.1.0  1            Install complete
2         Fri Mar 15 15:01:02 2024  superseded  webserver-0.1.0  1            Upgrade complete
3         Fri Mar 15 15:01:20 2024  deployed    webserver-0.1.0  1            Rollback to 1
```

!!! note "Drei Zähler, die gern verwechselt werden"
    **Revision** (`3`) zählt, wie oft du an diesem Release gedreht hast. **Chart-Version** (`webserver-0.1.0`) ist der Stand des Pakets. **appVersion** (`1`) ist der Stand der Software darin. Die drei haben nichts miteinander zu tun.

## Zurück & weg

| Befehl | Bedeutung |
|--------|-----------|
| `helm rollback <release> <revision>` | Auf eine frühere Revision zurück |
| `helm uninstall <release>` | Release samt allen erzeugten Objekten entfernen |
| `helm uninstall <release> -n <namespace>` | Release in einem anderen Namespace entfernen |

```bash
helm rollback station 1
```

```text
Rollback was a success! Happy Helming!
```

!!! note "Ein Rollback geht vorwärts"
    Der Rollback auf Revision 1 legt **Revision 3** an (siehe `helm history` oben). Helm löscht nichts aus der Historie, es hängt an. Du kannst dich also auch aus einem Rollback wieder herausrollen.

## Repositories

| Befehl | Bedeutung |
|--------|-----------|
| `helm repo add <name> <url>` | Chart-Quelle eintragen |
| `helm repo update` | Paketlisten aller eingetragenen Quellen aktualisieren |
| `helm repo list` | Eingetragene Quellen anzeigen |
| `helm search repo <begriff>` | In den eingetragenen Quellen suchen |
| `helm repo remove <name>` | Quelle wieder entfernen |

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm search repo prometheus-community/kube-prometheus-stack
```

```text
NAME                                        CHART VERSION  APP VERSION  DESCRIPTION
prometheus-community/kube-prometheus-stack  87.16.1        v0.92.1      kube-prometheus-stack collects Kubernetes manif...
```

Vor dem Installieren eines fremden Charts immer erst hineinschauen:

```bash
helm show values prometheus-community/kube-prometheus-stack
helm template monitoring prometheus-community/kube-prometheus-stack
```

!!! warning "Keine Bitnami-Charts"
    Sehr viele Tutorials nutzen `bitnami/...`. Seit der Umstellung des Katalogs Ende August 2025 sind die versionierten Images dort verschwunden – `bitnami/nginx:1.27` gibt es nicht mehr, nur noch `latest`. Nimm im Kurs `prometheus-community` oder das eigene Chart.

---

## Werte-Vorrang

Wer gewinnt, wenn derselbe Wert an drei Stellen steht? Merkzeile:

```text
values.yaml  <  -f eigene.yaml  <  --set        (rechts gewinnt)
```

Probe aufs Exempel:

```bash
helm template station ./webserver -f values-prod.yaml --set replicaCount=5
```

`values-prod.yaml` sagt `replicaCount: 3`, gerendert wird trotzdem `replicas: 5`. Das `--set` sticht die Datei, die Datei sticht die Standardwerte.

| Wo steht der Wert? | Wofür du es nutzt |
|--------------------|-------------------|
| `values.yaml` im Chart | Der vernünftige Standard, den das Chart selbst mitbringt |
| `-f werte.yaml` | Eine ganze Umgebung: dev, test, prod |
| `--set key=wert` | Ein einzelner Wert, schnell, für einen Versuch |

---

!!! tip "Zwei Fallen unter Windows"
    **1. Helm ist installiert, aber nicht da.** Nach `winget install --id Helm.Helm --exact` kennt das **laufende** PowerShell-Fenster den Befehl noch nicht – der PATH wird nur beim Start einer Sitzung gelesen. Fenster schließen, neu öffnen, `helm version` nochmal. Das ist kein Fehler, das ist Windows.

    **2. Dein Helm ist neuer als die Tutorials.** Du hast Helm 4, praktisch jede Anleitung im Netz zeigt Helm 3. Für alles auf dieser Seite macht das keinen Unterschied – Charts sind abwärtskompatibel und `install`, `upgrade`, `rollback`, `history`, `template`, `lint` sowie `repo` verhalten sich identisch. Nur ein paar Flags heißen anders: aus `--force` wurde `--force-replace`, aus `--atomic` wurde `--rollback-on-failure`. Die alten Namen gehen noch, warnen aber.

---

Für ausführlichere Erklärungen:

- [Helm – der Paketmanager für Kubernetes](../kubernetes-helm/index.md)
- [Stolpersteine im Helm-Block](../kubernetes-helm/09-stolpersteine.md)
