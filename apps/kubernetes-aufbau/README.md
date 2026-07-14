# kubernetes-aufbau – Begleitdateien

Fertige Kubernetes-Manifeste für den Aufbau-Block **[Kubernetes – Aufbau](https://jacobmenge.github.io/kurs-unterlagen/kubernetes-aufbau/)** (Teil 2).
Sie machen das Deployment aus [Teil 1](../kubernetes-praxis/) betriebsreif: Konfiguration und Geheimnisse aus dem Image lösen, Gesundheitschecks einbauen und den Ressourcenverbrauch begrenzen.

## Voraussetzungen

- Ein lokaler Kubernetes-Cluster (z.B. **minikube** mit Docker-Treiber) und **kubectl** – wie in Teil 1.
- Einrichtung Schritt für Schritt: siehe die Seite **Installation** im Block [Kubernetes – Hands-on](../kubernetes-praxis/).

## Schnellstart

```bash
# in diesen Ordner wechseln
cd kurs-unterlagen/apps/kubernetes-aufbau

# Cluster prüfen
kubectl get nodes

# 1) Konfiguration & Geheimnisse (ConfigMap + Secret + Deployment)
kubectl apply -f manifests/webserver-config.yaml
kubectl port-forward deployment/webserver 8080:80
# -> http://localhost:8080  (zeigt Version + Standort aus der ConfigMap)

# 2) Betriebsreifes Deployment mit Probes & Limits (ersetzt das Deployment)
kubectl apply -f manifests/webserver-probes-limits.yaml
kubectl describe deploy webserver   # Probes + Limits ansehen

# 3) Ressourcengrenze sichtbar machen: absichtlich OOMKilled
kubectl apply -f manifests/speicherfresser.yaml
kubectl get pod speicherfresser     # STATUS: OOMKilled
```

## Die Dateien

| Datei | Zweck | Genutzt in |
|-------|-------|-----------|
| `manifests/webserver-config.yaml` | ConfigMap (offene Werte) + Secret (Geheimnis) + Deployment, das beide per `envFrom` einzieht | Praxis: Config & Secrets |
| `manifests/webserver-probes-limits.yaml` | betriebsreifes Deployment mit readiness-/liveness-Probes und Requests/Limits | Praxis: Probes & Limits |
| `manifests/speicherfresser.yaml` | Wegwerf-Pod, der sein Speicher-Limit sprengt und `OOMKilled` wird | Praxis: Probes & Limits |

Die Demo-App ist dieselbe wie in Teil 1: ein schlankes `nginx:1.27-alpine`, das sich beim Start eine
einfarbige Seite schreibt (Version, Standort, Pod-Name). Farbe, Version und Standort kommen im
Config-Manifest aus der **ConfigMap**; das Secret liefert ein Beispiel-Token, das bewusst **nicht** auf
der Seite erscheint. Der `speicherfresser` nutzt das Last-Image `polinux/stress`.

## Aufräumen

```bash
kubectl delete -f manifests/webserver-config.yaml --ignore-not-found
kubectl delete -f manifests/webserver-probes-limits.yaml --ignore-not-found
kubectl delete -f manifests/speicherfresser.yaml --ignore-not-found
# oder den ganzen Cluster zuruecksetzen:
minikube delete
```
