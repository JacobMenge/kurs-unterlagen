---
title: "Übungen"
description: "Eigene Hands-on-Übungen zum CI/CD-Block – vier Schwierigkeitsgrade plus Challenge."
---

# Übungen – CI/CD mit GitHub Actions

Diese Übungen vertiefen den [Praxis-Teil](praxis-erste-pipeline.md). Sie sind **aufeinander aufbauend**: jede neue Stufe nimmt etwas mit, das du in der vorigen gelernt hast.

!!! abstract "Die vier Stufen"
    - 🟢 **Einsteiger** – jeder Schritt bis ins Detail
    - 🟡 **Mittel** – weniger Hand-Holding
    - 🔴 **Fortgeschritten** – Hinweise statt Rezepte
    - 🏆 **Challenge** – Aufgabe ohne Anleitung, Musterlösung aufklappbar

## Voraussetzungen für alle Übungen

- Du hast die [Praxis-Übung](praxis-erste-pipeline.md) durchgespielt.
- Dein `cicd-demo`-Repo ist auf GitHub und die Pipeline ist mindestens einmal grün gelaufen.
- Du kannst die GitHub-Actions-**Logs** lesen.

---

## 🟢 Einsteiger

### Übung 6.1 – Mini-Pipeline ohne Build

!!! info "Was du lernst"
    - Workflow-Datei in `.github/workflows/` anlegen
    - Trigger `on: push` und `workflow_dispatch`
    - Ein `run:`-Schritt ohne `uses:`

#### Worum geht's

Bevor du Docker baust, schreibst du den **kleinstmöglichen** Workflow: ein Step, der „Hello World" auf den Runner schreibt. Das ist der Sanity-Check, dass dein Setup überhaupt funktioniert.

#### Aufgabe

Lege im Repo eine Datei `.github/workflows/hello.yml` an, die:

1. Bei jedem Push **und** auf manuellen Knopfdruck startet.
2. Auf `ubuntu-latest` läuft.
3. Einen Step `echo "Hello aus der Pipeline – Commit $GITHUB_SHA"` ausführt.

Push die Datei. Im Actions-Tab klickst du auf den neuen Workflow → den letzten Lauf → den Step → du solltest die Begrüßung mit deinem Commit-SHA sehen.

??? success "Musterlösung"

    ```yaml
    # .github/workflows/hello.yml
    name: Hello

    on:
      push:
      workflow_dispatch:

    jobs:
      say-hello:
        runs-on: ubuntu-latest
        steps:
          - run: echo "Hello aus der Pipeline – Commit $GITHUB_SHA"
    ```

    `$GITHUB_SHA` ist eine vom Runner bereitgestellte Umgebungsvariable. Alternativ in YAML-Syntax: `${{ github.sha }}`.

---

### <span id="uebung-62-tests-in-einem-eigenen-job"></span>Übung 6.2 – Tests in einem eigenen Job

!!! info "Was du lernst"
    - Mehrere Jobs in einem Workflow
    - `needs:` für Abhängigkeiten
    - `actions/setup-python` und `pip install`

#### Aufgabe

Im `cicd-demo`-Repo: schreibe einen Workflow, der Tests **außerhalb** eines Containers laufen lässt – direkt auf dem Runner. Ohne Docker.

Anforderungen:

- Workflow-Datei `tests-only.yml`.
- Trigger: `push` und `pull_request`.
- Job `tests`, läuft auf `ubuntu-latest`.
- Steps:
    1. `actions/checkout@v4`
    2. `actions/setup-python@v5` mit Python 3.12 und `cache: pip`
    3. `pip install -r requirements.txt`
    4. `pytest -v`

Ziel: deutlich **schneller** als der Container-Build, weil weder Docker-Build noch Image gepullt wird.

??? success "Musterlösung"

    ```yaml
    # .github/workflows/tests-only.yml
    name: Tests

    on:
      push:
      pull_request:

    jobs:
      tests:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4

          - uses: actions/setup-python@v5
            with:
              python-version: "3.12"
              cache: pip

          - run: pip install -r requirements.txt

          - run: pytest -v
    ```

    Beim ersten Lauf: vielleicht 30 Sekunden. Bei jedem Folgelauf: Cache trifft, 10–15 Sekunden. Im Vergleich zum Container-Build mit 60–90 Sekunden ist das ein deutlicher Unterschied.

---

## 🟡 Mittel

### <span id="uebung-63-multi-arch-image-linuxamd64--linuxarm64"></span>Übung 6.3 – Multi-Arch-Image (linux/amd64 + linux/arm64)

!!! info "Was du lernst"
    - QEMU-Emulation für Multi-Plattform-Builds
    - `platforms:`-Parameter der `build-push-action`

#### Worum geht's

Apple-Silicon-Macs (M1/M2/M3/M4) und viele Server (AWS Graviton) sind ARM. Wenn dein Image nur für `linux/amd64` gebaut ist, schmeißt Docker auf ARM-Maschinen einen `exec format error`. Lösung: **Multi-Arch-Build**.

#### Aufgabe

Erweitere die Pipeline aus dem Praxis-Teil so, dass das Image für **beide** Architekturen gebaut und gepusht wird.

#### Hinweise

- Du brauchst `docker/setup-qemu-action@v3` **vor** dem `setup-buildx-action`.
- Im `build-push-action` zusätzlich `platforms: linux/amd64,linux/arm64`.
- Beim **lokalen** Test (mit `load: true`) geht Multi-Arch nicht – `load:` lädt nur **eine** Architektur in den Daemon. Für den **Push-Job** (mit `push: true`) ist Multi-Arch ohne Probleme.

??? success "Musterlösung – nur die geänderten Stellen"

    ```yaml
    publish:
      runs-on: ubuntu-latest
      needs: build-and-test
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
      steps:
        - uses: actions/checkout@v4

        - uses: docker/setup-qemu-action@v3        # NEU
          with:
            platforms: linux/amd64,linux/arm64

        - uses: docker/setup-buildx-action@v3

        - uses: docker/login-action@v3
          with:
            registry: ghcr.io
            username: ${{ github.actor }}
            password: ${{ secrets.GITHUB_TOKEN }}

        - id: lcrepo
          run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"

        - uses: docker/build-push-action@v6
          with:
            context: .
            push: true
            platforms: linux/amd64,linux/arm64    # NEU
            tags: |
              ghcr.io/${{ steps.lcrepo.outputs.REPO }}:${{ github.sha }}
              ghcr.io/${{ steps.lcrepo.outputs.REPO }}:latest
            cache-from: type=gha
            cache-to: type=gha,mode=max
    ```

    Im GHCR-UI siehst du danach unter dem Tag „Manifest" zwei Architekturen.

    !!! warning "Multi-Arch ist langsamer"
        ARM-Builds laufen unter QEMU – also emuliert. Erwartet 2- bis 5-fache Build-Zeit. Cache-Tuning lohnt sich.

---

### <span id="uebung-64-versionstags-mit-semver"></span>Übung 6.4 – Versions-Tags mit Semver

!!! info "Was du lernst"
    - Git-Tag-Trigger
    - Mehrere `tags:` mit `docker/metadata-action`

#### Szenario

Dein Image soll nicht nur SHA und `latest` haben, sondern auch **Semver-Tags** wie `v1.4.2`. Wenn jemand `git tag v1.4.2 && git push --tags` macht, soll die Pipeline zusätzlich Image-Tags `1.4.2`, `1.4`, `1` und `latest` setzen.

#### Aufgabe

Erweitere den Workflow:

1. Trigger zusätzlich auf `tags: ["v*.*.*"]`.
2. Statt manuelle `tags:`-Liste die Action `docker/metadata-action@v5` nutzen, die aus Trigger und Refs automatisch sinnvolle Tags ableitet.

??? success "Musterlösung"

    ```yaml
    name: CI

    on:
      push:
        branches: [main]
        tags: ["v*.*.*"]
      pull_request:
      workflow_dispatch:

    permissions:
      contents: read
      packages: write

    jobs:
      build-and-push:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4

          - uses: docker/setup-buildx-action@v3

          - uses: docker/login-action@v3
            if: github.event_name != 'pull_request'
            with:
              registry: ghcr.io
              username: ${{ github.actor }}
              password: ${{ secrets.GITHUB_TOKEN }}

          - id: lcrepo
            run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"

          - id: meta
            uses: docker/metadata-action@v5
            with:
              images: ghcr.io/${{ steps.lcrepo.outputs.REPO }}
              tags: |
                type=sha
                type=ref,event=branch
                type=semver,pattern={{version}}
                type=semver,pattern={{major}}.{{minor}}
                type=semver,pattern={{major}}
                type=raw,value=latest,enable={{is_default_branch}}

          - uses: docker/build-push-action@v6
            with:
              context: .
              push: ${{ github.event_name != 'pull_request' }}
              tags: ${{ steps.meta.outputs.tags }}
              labels: ${{ steps.meta.outputs.labels }}
              cache-from: type=gha
              cache-to: type=gha,mode=max
    ```

    !!! info "Warum auch hier `lcrepo`?"
        `docker/metadata-action` lowered Tags meist automatisch. Aber ein vorgeschalteter Lowercase-Step ist die robuste Variante: er funktioniert garantiert auch dann, wenn der GitHub-Username Großbuchstaben enthält oder die Action in einer Edge-Case-Konstellation nicht greift.

    Test: ein Tag setzen und pushen:

    ```bash
    git tag v1.0.0
    git push origin v1.0.0
    ```

    In GHCR landet danach `cicd-demo:1.0.0`, `cicd-demo:1.0`, `cicd-demo:1`, `cicd-demo:latest` und der Branch-Tag.

---

## 🔴 Fortgeschritten

### Übung 6.5 – Parallele Jobs: Lint + Test + Trivy-Scan

!!! info "Was du lernst"
    - Mehrere unabhängige Jobs parallel laufen lassen
    - Build-Output als Artefakt zwischen Jobs
    - Trivy mit Schwellwert

#### Szenario

Dein Pipeline-Lauf ist langsam, weil Build, Test und Scan **sequentiell** laufen. Parallelisierung kann die Gesamtdauer drastisch senken – aber dafür müssen die Jobs unabhängig sein.

#### Aufgabe

Erweitere die Pipeline so:

1. Job `lint`: `actions/setup-python` + `pip install ruff` + `ruff check .` (Linting des Python-Codes).
2. Job `test`: wie bisher, aber **ohne** Docker – direkt auf dem Runner.
3. Job `build-image`: baut das Image, **lädt** es in den Daemon, **scannt** mit Trivy.
4. Job `publish`: `needs: [lint, test, build-image]` – läuft erst, wenn alle drei grün sind, und nur auf `main`.

#### Hinweise

- `ruff` ist mit `pip install ruff` installiert.
- Du kannst dem `build-image`-Job einen `outputs:`-Block geben, der den `image:tag` exportiert. Aber: für **diese Übung** reicht es, wenn `publish` das Image **selbst nochmal baut** – dank GHA-Cache ist der zweite Build sehr schnell.

??? success "Musterlösung"

    ```yaml
    name: CI

    on:
      push:
        branches: [main]
      pull_request:
      workflow_dispatch:

    permissions:
      contents: read
      packages: write

    jobs:
      lint:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-python@v5
            with:
              python-version: "3.12"
              cache: pip
          - run: pip install ruff
          - run: ruff check .

      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-python@v5
            with:
              python-version: "3.12"
              cache: pip
          - run: pip install -r requirements.txt
          - run: pytest -v

      build-image:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - uses: docker/setup-buildx-action@v3

          - uses: docker/build-push-action@v6
            with:
              context: .
              load: true
              tags: cicd-demo:${{ github.sha }}
              cache-from: type=gha
              cache-to: type=gha,mode=max

          - name: Trivy-Scan
            uses: aquasecurity/trivy-action@0.28.0
            with:
              image-ref: cicd-demo:${{ github.sha }}
              format: table
              exit-code: 1
              severity: CRITICAL,HIGH
              ignore-unfixed: true

      publish:
        runs-on: ubuntu-latest
        needs: [lint, test, build-image]
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        steps:
          - uses: actions/checkout@v4
          - uses: docker/setup-buildx-action@v3

          - uses: docker/login-action@v3
            with:
              registry: ghcr.io
              username: ${{ github.actor }}
              password: ${{ secrets.GITHUB_TOKEN }}

          - id: lcrepo
            run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"

          - uses: docker/build-push-action@v6
            with:
              context: .
              push: true
              tags: |
                ghcr.io/${{ steps.lcrepo.outputs.REPO }}:${{ github.sha }}
                ghcr.io/${{ steps.lcrepo.outputs.REPO }}:latest
              cache-from: type=gha
              cache-to: type=gha,mode=max
    ```

    Im Actions-Tab siehst du `lint`, `test`, `build-image` **parallel** laufen – die Gesamtdauer sinkt von „Summe aller Jobs" auf „Maximum aller Jobs".

---

## 🏆 Challenge

### Challenge 6 – Vollständige Release-Pipeline

!!! abstract "Aufgabe"
    Baue eine **echte Release-Pipeline** für die Demo-App. Anforderungen:

    1. **Zwei Workflow-Dateien**: `ci.yml` (Build/Test/Lint auf jeden Push) und `release.yml` (nur auf `v*.*.*`-Tags).
    2. `release.yml` macht:
        - Multi-Arch-Build (`linux/amd64`, `linux/arm64`)
        - Image in GHCR pushen mit Tags: Semver (`1.0.0`, `1.0`, `1`), `latest`
        - **GitHub-Release** anlegen (`softprops/action-gh-release`) mit automatisch generierter Release-Note (Liste aller Commits seit dem letzten Tag)
        - **SBOM** generieren (`anchore/sbom-action`) und als Release-Asset anhängen
    3. **Branch Protection** auf `main`: PRs dürfen nur gemergt werden, wenn `ci.yml` grün ist.

    Bonus:

    - Die Image-Sichtbarkeit in GHCR auf **public** setzen, damit jemand das Image ohne Login pullen kann.
    - Eine Markdown-Tabelle im README, die die letzten 5 Releases mit Image-Tags zeigt – manuell gepflegt.

??? success "Musterlösung – `release.yml`"

    ```yaml
    name: Release

    on:
      push:
        tags: ["v*.*.*"]
      workflow_dispatch:

    permissions:
      contents: write       # für gh-release
      packages: write       # für GHCR

    jobs:
      release:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
            with:
              fetch-depth: 0    # alle Tags + Historie für Release-Notes

          - uses: docker/setup-qemu-action@v3
            with:
              platforms: linux/amd64,linux/arm64

          - uses: docker/setup-buildx-action@v3

          - uses: docker/login-action@v3
            with:
              registry: ghcr.io
              username: ${{ github.actor }}
              password: ${{ secrets.GITHUB_TOKEN }}

          - id: lcrepo
            run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"

          - id: meta
            uses: docker/metadata-action@v5
            with:
              images: ghcr.io/${{ steps.lcrepo.outputs.REPO }}
              tags: |
                type=semver,pattern={{version}}
                type=semver,pattern={{major}}.{{minor}}
                type=semver,pattern={{major}}
                type=raw,value=latest

          - id: build
            uses: docker/build-push-action@v6
            with:
              context: .
              push: true
              platforms: linux/amd64,linux/arm64
              tags: ${{ steps.meta.outputs.tags }}
              labels: ${{ steps.meta.outputs.labels }}
              cache-from: type=gha
              cache-to: type=gha,mode=max

          - name: SBOM erzeugen
            uses: anchore/sbom-action@v0
            with:
              image: ghcr.io/${{ steps.lcrepo.outputs.REPO }}:${{ github.ref_name }}
              format: spdx-json
              output-file: sbom.spdx.json

          - name: GitHub Release
            uses: softprops/action-gh-release@v2
            with:
              generate_release_notes: true
              files: sbom.spdx.json
    ```

    **`ci.yml`** bleibt der einfachere Build/Test/Lint-Workflow für jeden Push und PR.

    **Branch Protection** richtest du im Repo unter Settings → Branches → Add rule für `main` ein:

    - „Require a pull request before merging"
    - „Require status checks to pass before merging" → Status-Check `lint`, `test`, `build-image` aus `ci.yml` auswählen.

    Bonus: **Image public machen** – auf der GHCR-Paket-Seite (rechts neben dem Repo) → Package settings → Change visibility → Public.

    **Was du daraus mitnimmst:** das ist eine Pipeline, mit der Open-Source-Projekte ernsthaft veröffentlichen. Deine Demo-App hat damit dasselbe Release-Niveau wie viele kleine Tools auf GitHub.

---

## Was du nach diesen Übungen kannst

- Workflows von einfach bis fortgeschritten schreiben
- Jobs sauber **trennen** (Lint, Test, Build, Publish, Release)
- **Multi-Arch-Images** bauen
- **Tagging** mit Semver-Logik betreiben
- **Security-Scanning** in die Pipeline einbauen
- Pipelines **debuggen**, ohne in Panik zu geraten

---

## Weiterlesen

- [Stolpersteine](stolpersteine.md) – wenn etwas hakt
- [Ausblick](ausblick.md) – Kubernetes, ArgoCD, GitOps
- [Cheatsheet GitHub Actions](../cheatsheets/github-actions.md)
