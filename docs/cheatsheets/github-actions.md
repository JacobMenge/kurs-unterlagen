---
title: "Cheatsheet: GitHub Actions"
description: "Die wichtigsten GitHub-Actions-Bausteine als Tabellen und Snippets zum schnellen Nachschlagen."
---

# Cheatsheet: GitHub Actions

!!! info "Bezug zum Block"
    Die Erklärungen findest du in [Grundlagen von GitHub Actions](../ci-cd/github-actions-grundlagen.md), die Hands-on-Praxis in [Praxis: erste Pipeline](../ci-cd/praxis-erste-pipeline.md).

## Speicherort von Workflows

```text
.github/
└── workflows/
    ├── ci.yml
    └── release.yml
```

Nur `.github/workflows/` wird gelesen. Endung `.yml` oder `.yaml`.

## Grundgerüst

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
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hallo"
```

## Trigger (`on:`)

| Trigger | Beispiel |
|---------|----------|
| Bei jedem Push | `push:` |
| Push auf bestimmten Branch | `push: { branches: [main] }` |
| Push auf Versions-Tag | `push: { tags: ["v*.*.*"] }` |
| Bei Pull-Requests | `pull_request:` |
| Geplant per Cron | `schedule: [{ cron: "0 3 * * *" }]` |
| Manueller Knopf | `workflow_dispatch:` |
| Bei Fertigstellung anderer Workflow | `workflow_run:` |

Mehrere Trigger lassen sich kombinieren:

```yaml
on:
  push:
    branches: [main]
    tags: ["v*.*.*"]
  pull_request:
  workflow_dispatch:
```

## Runner (`runs-on:`)

| Runner | Wofür |
|--------|-------|
| `ubuntu-latest` | Standard für fast alles |
| `ubuntu-22.04` / `ubuntu-24.04` | bestimmte Ubuntu-Version |
| `windows-latest` | Windows-Builds |
| `macos-latest` | iOS-Builds (teurer) |
| `self-hosted` | eigener Runner |

## Steps

| Pattern | Beispiel |
|---------|----------|
| Vorgefertigte Action | `uses: actions/checkout@v4` |
| Action mit Parametern | `with:` |
| Eigener Shell-Befehl | `run: pytest -v` |
| Mehrzeilig | `run: \|` (Pipe + neue Zeile) |
| Mit Schritt-Namen | `name: Tests laufen lassen` |
| Bedingt ausführen | `if: github.ref == 'refs/heads/main'` |

## Häufige Actions

| Action | Zweck |
|--------|-------|
| `actions/checkout@v4` | Repo auf den Runner holen |
| `actions/setup-node@v4` | Node.js installieren |
| `actions/setup-python@v5` | Python installieren |
| `actions/setup-go@v5` | Go installieren |
| `actions/setup-java@v4` | JDK installieren |
| `actions/cache@v4` | Cache zwischen Läufen |
| `actions/upload-artifact@v4` | Artefakt zwischen Jobs teilen |
| `actions/download-artifact@v4` | Artefakt empfangen |
| `docker/setup-qemu-action@v3` | Multi-Arch über QEMU |
| `docker/setup-buildx-action@v3` | BuildKit aktivieren |
| `docker/login-action@v3` | Login zur Container-Registry |
| `docker/build-push-action@v6` | Image bauen und pushen |
| `docker/metadata-action@v5` | Image-Tags + Labels generieren |
| `aquasecurity/trivy-action@0.28.0` | Image-CVE-Scan |
| `anchore/sbom-action@v0` | SBOM generieren |
| `softprops/action-gh-release@v2` | GitHub-Release anlegen |

## Kontext-Variablen

| Variable | Bedeutung |
|----------|-----------|
| `${{ github.sha }}` | aktueller Commit-SHA |
| `${{ github.ref }}` | voller Ref (`refs/heads/main`, `refs/tags/v1.0.0`) |
| `${{ github.ref_name }}` | nur Branch-/Tag-Name (`main`, `v1.0.0`) |
| `${{ github.actor }}` | wer das Event ausgelöst hat |
| `${{ github.repository }}` | `<owner>/<repo>` |
| `${{ github.event_name }}` | `push`, `pull_request`, `workflow_dispatch`, … |
| `${{ runner.os }}` | `Linux`, `Windows`, `macOS` |
| `${{ secrets.NAME }}` | Secret aus Repo-Settings |
| `${{ env.NAME }}` | Workflow- oder Job-ENV-Variable |

## Bedingungen mit `if:`

```yaml
# Nur auf main
if: github.ref == 'refs/heads/main'

# Nur bei Push, nicht bei PR
if: github.event_name == 'push'

# Nicht bei Bot-Pushes
if: github.actor != 'github-actions[bot]'

# Vorheriger Job muss erfolgreich sein (Standard)
# Mit always() läuft auch bei Failure
if: always() && needs.build.result == 'success'
```

## Job-Abhängigkeiten

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "build"

  test:
    runs-on: ubuntu-latest
    needs: build              # erst nach build
    steps:
      - run: echo "test"

  publish:
    runs-on: ubuntu-latest
    needs: [build, test]      # erst nach beiden
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "publish"
```

## Secrets verwenden

Im Repo: **Settings → Secrets and variables → Actions → New repository secret**.

```yaml
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

Eingebaute Secrets:

| Secret | Wozu |
|--------|------|
| `GITHUB_TOKEN` | wird automatisch erzeugt; reicht für GHCR, Releases, Issues |
| `secrets.<NAME>` | von dir hinterlegt (Tokens, Cloud-Credentials, …) |

## Permissions im Workflow

```yaml
permissions:
  contents: read       # Code lesen
  packages: write      # GHCR pushen
  contents: write      # Releases anlegen, Tags pushen
  id-token: write      # OIDC für Cloud-Login
  pull-requests: write # PR kommentieren
```

Standardberechtigungen sind seit 2023 schreibgeschützt. `permissions:` explizit setzen, sobald geschrieben werden soll.

## Caching (Standard)

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

Oder bei `setup-*`-Actions:

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: pip          # automatisch
```

## Artefakte zwischen Jobs

```yaml
build:
  steps:
    - run: ./build.sh
    - uses: actions/upload-artifact@v4
      with:
        name: build-output
        path: dist/

test:
  needs: build
  steps:
    - uses: actions/download-artifact@v4
      with:
        name: build-output
        path: dist/
    - run: ./test.sh
```

---

## Docker-Snippets

### Image bauen und pushen (GHCR)

```yaml
- uses: actions/checkout@v4
- uses: docker/setup-buildx-action@v3
- uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

# GHCR akzeptiert nur Kleinbuchstaben, Bash macht das in einer Zeile:
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

### Build lokal in den Runner laden (für Test)

```yaml
- uses: docker/build-push-action@v6
  with:
    context: .
    load: true
    tags: app:${{ github.sha }}
- run: docker run --rm app:${{ github.sha }} pytest -v
```

`load: true` lädt das Image in den Daemon des Runners, statt es zu pushen.

### Multi-Arch (linux/amd64 + linux/arm64)

```yaml
- uses: docker/setup-qemu-action@v3
  with:
    platforms: linux/amd64,linux/arm64
- uses: docker/setup-buildx-action@v3
- id: lcrepo
  run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"
- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    platforms: linux/amd64,linux/arm64
    tags: ghcr.io/${{ steps.lcrepo.outputs.REPO }}:${{ github.sha }}
```

### Tags automatisch generieren

```yaml
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
    push: true
    tags: ${{ steps.meta.outputs.tags }}
    labels: ${{ steps.meta.outputs.labels }}
```

### Trivy-Scan

```yaml
- uses: aquasecurity/trivy-action@0.28.0
  with:
    image-ref: app:${{ github.sha }}
    format: table
    exit-code: 1
    severity: CRITICAL,HIGH
    ignore-unfixed: true
```

---

## Test-Snippets

### Python + pytest

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    cache: pip
- run: pip install -r requirements.txt
- run: pytest -v
```

### Node + Jest

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: "20"
    cache: npm
- run: npm ci
- run: npm test
```

### Service Container (z.B. Postgres für Integration-Tests)

```yaml
jobs:
  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U postgres"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - run: pytest tests/integration
```

---

## Release-Snippet

```yaml
- name: Release
  uses: softprops/action-gh-release@v2
  with:
    generate_release_notes: true
    files: |
      dist/*.whl
      sbom.spdx.json
```

---

## Lokales Testen

| Tool | Was es macht |
|------|--------------|
| [`act`](https://github.com/nektos/act) | Workflows lokal in Docker laufen lassen |
| `yamllint` | YAML-Syntaxprüfung lokal |
| VSCode + GitHub-Actions-Extension | Schema-Hilfe und Inline-Linting |

```bash
# Lokal einen push-Trigger nachstellen
act push -W .github/workflows/ci.yml
```

---

## Häufige Fehler: Express-Lösung

| Fehler | Erste Maßnahme |
|--------|----------------|
| Workflow läuft nicht | Pfad `.github/workflows/`? Endung `.yml`? YAML-Syntax? |
| YAML-Parser-Fehler | Tags und Image-Refs in **Anführungszeichen**, keine Tabs |
| GHCR push verweigert | `permissions: packages: write`, Repo-Setting auf „Read and write" |
| `repository name must be lowercase` | `lcrepo`-Step mit `${GITHUB_REPOSITORY,,}` einbauen |
| Tests grün lokal, rot in CI | Cache-Reste lokal, nicht-deterministische Tests, Pfad-Problem |
| Action-Version veraltet | im Marketplace neueste Version prüfen, Major-Version anheben |
| Cache wird nicht genutzt | `cache-from`/`cache-to` gesetzt? Layer-Reihenfolge im Dockerfile |
| Endlos-Trigger | Bot-Pushes ausschließen mit `if: github.actor != 'github-actions[bot]'` |

---

## Workflow-Patterns

### CI: bauen + testen + pushen (Standard)

```text
build-and-test  →  publish (nur main)
```

### Release: Tag-getrieben

```text
push tag v1.2.3  →  build multi-arch + sbom + release
```

### PR-Validierung

```text
pull_request  →  lint + test (kein push)
```

### Nightly: Security-Scans

```text
schedule '0 3 * * *'  →  trivy + npm audit + Slack
```

---

Für ausführlichere Erklärungen:

- [Warum CI/CD?](../ci-cd/warum-cicd.md)
- [Pipeline-Konzept](../ci-cd/pipeline-konzept.md)
- [Grundlagen von GitHub Actions](../ci-cd/github-actions-grundlagen.md)
- [Stolpersteine](../ci-cd/stolpersteine.md)
