# kubernetes-praxis – Begleitdateien

Fertige Kubernetes-Manifeste für den Praxis-Block **[Praxis: Kubernetes](https://jacobmenge.github.io/kurs-unterlagen/kubernetes-praxis/)**.
Du schreibst diese Dateien in den Übungen nicht selbst – sie liegen hier fertig zum Anwenden.

## Voraussetzungen

- Ein lokaler Kubernetes-Cluster (z.B. **minikube** mit Docker-Treiber) und **kubectl**.
- Einrichtung Schritt für Schritt: siehe die Seite **Installation** im Block.

## Schnellstart

```bash
# in diesen Ordner wechseln
cd kurs-unterlagen/apps/kubernetes-praxis

# Cluster prüfen
kubectl get nodes

# Deployment (3 Pods) und Service anlegen
kubectl apply -f manifests/webserver-deployment.yaml
kubectl apply -f manifests/webserver-service.yaml

# Zustand ansehen
kubectl get deploy,rs,pods,svc

# im Browser erreichbar machen
kubectl port-forward service/webserver 8080:80
# -> http://localhost:8080
```

## Die Dateien

| Datei | Zweck | Genutzt in |
|-------|-------|-----------|
| `manifests/webserver-pod.yaml` | ein einzelner Pod (die kleinste Einheit) | Praxis 1 |
| `manifests/webserver-deployment.yaml` | Deployment mit 3 Replicas (Soll-Zustand, Selbstheilung) – farbige Demo-App, Version + Pod-Name | Praxis 2, 3 |
| `manifests/webserver-service.yaml` | Service (ClusterIP) als stabile Adresse + Load-Balancing | Praxis 3 |
| `manifests/webserver-service-nodeport.yaml` | Service-Variante für Zugriff von außen (NodePort) | Praxis 3 (Bonus) |
| `manifests/bunt-disco.yaml` | zwei farbige Deployments (blau + grün) hinter **einem** Service – Load-Balancing als Farbe sichtbar | Praxis 3 (Bonus) |

In **Praxis 1** kommt das Image `nginxdemos/hello` zum Einsatz – es zeigt den **Pod-Namen** an,
der die Anfrage beantwortet hat. Ab **Praxis 2** nutzt das Deployment ein schlankes Standard-`nginx`,
das sich beim Start selbst eine **einfarbige Seite** schreibt: groß die Version, darunter
`Server name: <Pod-Name>`. **Version 1 ist blau.** Beim Rolling Update (`kubectl set env … VERSION=2
COLOR="#2e9e5b"`) wird sie **grün** – so siehst du den Versionswechsel und das Load-Balancing direkt
im Browser. Farbe und Version stecken in den Umgebungsvariablen `VERSION` und `COLOR`; ein eigenes
Image ist nicht nötig.

## Aufräumen

```bash
kubectl delete -f manifests/webserver-service.yaml -f manifests/webserver-deployment.yaml
# oder den ganzen Cluster zurücksetzen:
minikube delete
```
