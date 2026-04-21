---
title: "Registry und Docker Hub"
description: "Woher Images kommen: Registry-Konzept, Docker Hub, Image-Namen, Tags und warum :latest ein Anti-Pattern ist."
---

# Registry und Docker Hub

!!! abstract "Lernziel"
    Nach dieser Seite kannst du:

    - erklären, was eine **Registry** ist und wofür sie da ist
    - einen Image-Namen wie `docker.io/library/nginx:1.27` in seine Bestandteile zerlegen
    - die Befehle `docker pull`, `docker push`, `docker login` einordnen
    - begründen, warum **`:latest`** in Produktion problematisch ist

---

## Warum das wichtig ist

Jedes Mal, wenn du `docker run nginx` tippst, passiert im Hintergrund mehr als man denkt. Ohne ein grobes Modell von Registries und Image-Namen sieht man Befehle wie `docker pull` oder Fehler wie „pull access denied" nur als Magie.

---

## Was ist eine Registry?

Eine **Registry** ist ein Server, der Docker-Images speichert. Du kannst dir das wie ein **GitHub für Images** vorstellen: ein zentraler Ort, an dem Images abgelegt, versioniert und wieder heruntergeladen werden.

Es gibt viele Registries. Einige Beispiele:

| Registry | Betreiber | Hinweis |
|----------|-----------|---------|
| **Docker Hub** | Docker Inc. | Der Default, den `docker` nimmt, wenn du nichts anderes angibst |
| **GitHub Container Registry** | GitHub / Microsoft | `ghcr.io` – oft für Open-Source-Projekte |
| **GitLab Container Registry** | GitLab | Teil einer GitLab-Instanz |
| **AWS ECR** | Amazon Web Services | Für AWS-Workloads |
| **Azure Container Registry** | Microsoft Azure | Für Azure-Workloads |
| **Google Artifact Registry** | Google Cloud | Für GCP-Workloads |
| **Harbor** | CNCF-Projekt | Oft on-premises |

Fast alle Registries sprechen dasselbe Protokoll, sodass Docker-Clients mit allen reden können.

---

## Docker Hub – die Standard-Registry

**Docker Hub** (<https://hub.docker.com>) ist die Default-Registry. Wenn du `docker run nginx` tippst, landet die Anfrage **dort**, es sei denn du gibst eine andere Quelle an.

Auf Docker Hub gibt es zwei Kategorien von Images:

### 1. Offizielle Images (`library`-Namespace)

- Gepflegt von Docker Inc. in Kooperation mit den jeweiligen Projekten.
- Kurze Namen, wie `nginx`, `postgres`, `python`, `node`, `redis`, `alpine`, `ubuntu`.
- Technisch liegen sie im Namespace `library`, aber den darfst du beim Tippen weglassen.

### 2. User- / Organisations-Images

- Von der Community oder Firmen gepflegt.
- Format: `<benutzer-oder-org>/<image-name>`
- Beispiel: `bitnami/postgresql`, `grafana/grafana`, `jenkins/jenkins`.

---

## Einen Image-Namen zerlegen

Nimm dir ein Beispiel:

```
docker.io/library/nginx:1.27-alpine
```

| Teil | Bedeutung |
|------|-----------|
| `docker.io` | **Registry**. Default, wird weggelassen, wenn Docker Hub gemeint ist. |
| `library` | **Namespace**. `library` ist der Namespace für offizielle Images. |
| `nginx` | **Image-Name** (das „Repository"). |
| `1.27-alpine` | **Tag**. Identifiziert eine bestimmte Variante / Version. |

Du darfst also auch kurz schreiben:

```
nginx:1.27-alpine
```

oder

```
nginx            # entspricht docker.io/library/nginx:latest
```

### Registry eines anderen Providers ansteuern

Bei einem Image auf GitHub Container Registry sähe der Name so aus:

```
ghcr.io/<user-or-org>/<image-name>:<tag>
```

Zum Beispiel:

```
ghcr.io/jacob-menge/kursbot:1.0
```

Docker sieht am Präfix `ghcr.io/`, dass es nicht zu Docker Hub gehört, und holt es von dort.

---

## Images holen: `docker pull`

Wenn du ein Image herunter­laden willst, ohne es gleich zu starten:

```bash
docker pull nginx:1.27-alpine
```

Ausgabe (gekürzt):

```text
1.27-alpine: Pulling from library/nginx
abc123: Pull complete
def456: Pull complete
...
Digest: sha256:...
Status: Downloaded newer image for nginx:1.27-alpine
docker.io/library/nginx:1.27-alpine
```

Jede „Pull complete"-Zeile ist ein **Layer**, den Docker sich herunterlädt. Layer, die du schon lokal hast (weil ein anderes Image sie auch nutzt), werden übersprungen.

### Liste aller lokalen Images

```bash
docker images
```

Beispiel:

```text
REPOSITORY    TAG              IMAGE ID       CREATED        SIZE
nginx         1.27-alpine      abc123         2 weeks ago    42MB
nginx         latest           def456         2 weeks ago    192MB
python        3.12-slim        ghi789         1 month ago    160MB
hello-world   latest           xyz999         9 months ago   13.3kB
```

Die **Image ID** ist der kurze SHA-Hash. Unterschiedliche Tags können denselben Inhalt referenzieren.

---

## Images hochladen: `docker push`

Wenn du ein **eigenes Image** in eine Registry hochladen willst, brauchst du:

1. Ein gebautes Image mit einem **registry-fähigen Namen**, z.B. `docker.io/<dein-user>/kursbot:1.0`.
2. Eine **Anmeldung** an der Registry.

### Anmelden

```bash
docker login
```

Der Befehl fragt Benutzer­name und Passwort (bzw. Personal Access Token) für Docker Hub ab. Für andere Registries:

```bash
docker login ghcr.io
docker login registry.gitlab.com
```

### Hochladen

```bash
docker push <dein-user>/kursbot:1.0
```

Docker schiebt dann Layer für Layer zur Registry. Was andere Images schon dort haben, wird nicht erneut hochgeladen.

---

## Tags: das stille Drama

Tags kennzeichnen **Versionen oder Varianten** eines Images. Die Konvention ist locker, aber typisch:

| Tag | Bedeutung |
|-----|-----------|
| `1.27.3` | exakte Version |
| `1.27` | neueste Patch-Version der Minor-Version |
| `1` | neueste Minor-Version der Major-Version |
| `alpine` | Variante auf Alpine-Linux-Basis (klein) |
| `1.27-alpine` | Kombination aus beidem |
| `latest` | „der Default-Tag" |

Technisch ist `:latest` **nichts Besonderes**. Es ist einfach der Tag, der gezogen wird, wenn du gar keinen angibst. Sein Inhalt ist das, was der Publisher des Images gerade für `latest` hält.

---

## Warum `:latest` ein Anti-Pattern ist

Stell dir vor, du baust heute eine Anwendung, die auf `nginx:latest` setzt. Das funktioniert. Vier Monate später stellt jemand den Server neu auf – und zieht wieder `nginx:latest`. Nur: `latest` zeigt inzwischen auf eine **neuere Version** mit **anderem Verhalten**. Deine Anwendung bricht, scheinbar ohne dass sich etwas geändert hat.

!!! warning "Regel für Produktion"
    In Produktion nimmst du **immer** explizite Versionen:

    - `nginx:1.27.3` (sehr präzise)
    - `nginx:1.27` (präzise genug, neue Patches werden gezogen)

    `:latest` nur für **schnelle Tests** und **Experimente**. Nie für etwas, das du später reproduzieren willst.

Noch strikter: produzierende Setups nutzen oft den **Digest** (den SHA-Hash) statt eines Tags, weil Tags **veränderlich** sind und Digests nicht:

```bash
docker pull nginx@sha256:abc123...def
```

Damit ist hundert­prozentig garantiert: **exakt dieses Bitmuster, kein anderes.**

---

## Kosten und Pull-Limits

Docker Hub hat seit 2021 **Pull-Limits**:

- Anonym: 100 Pulls pro 6 Stunden und IP.
- Mit kostenlosem Account: 200 Pulls pro 6 Stunden.
- Bezahlte Accounts: höhere oder keine Limits.

Für den Unterricht ist das kein Problem. In CI/CD-Pipelines kann es stören – eine Abhilfe ist, häufig verwendete Images in eine eigene Registry (z.B. GitHub Container Registry) zu spiegeln.

---

## Offline und private Registries

Falls du Docker offline nutzen willst oder eine private Registry für dein Team brauchst:

- **Eigene Registry starten**: `docker run -d -p 5000:5000 --name registry registry:2`
  Danach ist unter `localhost:5000` eine kleine Registry aktiv. Für den Hausgebrauch nett, für Produktion zu spartanisch.
- **Harbor** (<https://goharbor.io>): produktiv einsetzbare Registry mit Web-UI, Authentifizierung, Vulnerability-Scanning.

Das geht über den heutigen Kurs hinaus, aber gut zu wissen, dass es möglich ist.

---

## Merksatz

!!! success "Merksatz"
    > **Ein Image-Name hat vier Teile: Registry, Namespace, Image-Name, Tag. Fehlt ein Teil, nimmt Docker einen Default. Der Default-Tag ist `:latest` – und genau deshalb ist er in Produktion tabu.**

---

## Weiterlesen

- [Dockerfile – Grundlagen](dockerfile-grundlagen.md) – jetzt bauen wir ein Image selbst
- [Erste Schritte](erste-schritte.md) – erste Container mit `docker run`
