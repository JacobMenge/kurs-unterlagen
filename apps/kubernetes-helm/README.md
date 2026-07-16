# Kubernetes – Helm

Das Begleitmaterial zum Block [Kubernetes – Helm](../../docs/kubernetes-helm/index.md).

Dieselbe Demo-App wie in Teil 1 und Teil 2 – diesmal als **Helm-Chart** statt als handgeschriebene
Manifeste.

## Was hier liegt

```text
apps/kubernetes-helm/
+-- webserver/              das Chart
|   +-- Chart.yaml          Steckbrief (version = Paket, appVersion = Software darin)
|   +-- values.yaml         die Standardwerte
|   +-- .helmignore
|   +-- templates/
|       +-- configmap.yaml  VERSION, COLOR, STANDORT aus values.yaml
|       +-- secret.yaml     APP_TOKEN
|       +-- deployment.yaml mit checksum/config-Annotation
|       +-- service.yaml
|       +-- NOTES.txt       wird nach "helm install" ausgegeben
+-- values-dev.yaml         1 Instanz,  blau,   "Entwicklung"
+-- values-test.yaml        2 Instanzen, orange, "Testsystem"
+-- values-prod.yaml        3 Instanzen, grün,   "Rechenzentrum Nord"
```

## Schnellstart

```bash
helm install station ./webserver
kubectl port-forward svc/station 8080:80
```

Dann <http://localhost:8080> öffnen: blaue Seite, Version 1, Standort „Rechenzentrum Nord".

Farbe wechseln und wieder zurück:

```bash
helm upgrade station ./webserver --set color="#2e9e5b" --set version=2
helm history station
helm rollback station 1
```

Drei Umgebungen parallel:

```bash
helm install station ./webserver -f values-dev.yaml  -n dev  --create-namespace
helm install station ./webserver -f values-test.yaml -n test --create-namespace
helm install station ./webserver -f values-prod.yaml -n prod --create-namespace
helm list -A
```

## Hinweise

- Das Chart braucht **Helm 4** (getestet mit v4.2.3) und einen laufenden Cluster (minikube).
- `appToken` steht bewusst im Klartext in `values.yaml`, damit die Übung ohne Umwege läuft.
  Im echten Betrieb gehört dort **kein** Passwort hinein – die Datei liegt im Git.
- Aufräumen: `helm uninstall station` bzw. `helm uninstall station -n dev`.
