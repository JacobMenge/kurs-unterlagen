---
title: "Stolpersteine CI/CD"
description: "Typische Probleme bei GitHub Actions, Container-Builds, Registry-Pushes und Pipeline-Logik mit konkreten Lösungswegen."
---

# Stolpersteine CI/CD

Diese Seite sammelt **CI/CD-spezifische** Probleme. Allgemeine Docker-Probleme findest du im [Docker-Stolpersteine-Abschnitt](../docker/stolpersteine.md), Compose-Probleme im [Compose-Stolpersteine-Abschnitt](../docker-compose/stolpersteine.md).

!!! info "Erste Anlaufstelle: die Logs"
    Im **Actions-Tab** des Repos siehst du jeden Step einzeln. Klick den **roten Step** auf, scrolle in den Logs nach dem ersten roten Eintrag. Der Rest sind oft Folgefehler.

---

## YAML und Workflow-Datei

??? danger "Workflow erscheint gar nicht im Actions-Tab"
    **Häufigste Ursachen:**

    1. **Falscher Pfad**: die Datei muss in `.github/workflows/` liegen, **nicht** in `github/workflows/` oder `.github/workflow/`.
    2. **Falsche Endung**: `.yml` oder `.yaml`, sonst nichts.
    3. **YAML-Parser-Fehler**: GitHub zeigt das oben in **Actions → links neben dem Workflow-Namen**. Wenn dort kein Workflow steht, hast du einen Parse-Fehler.

    **Diagnose:**

    === "macOS / Linux"
        ```bash
        ls -la .github/workflows/
        ```

    === "Windows PowerShell"
        ```powershell
        Get-ChildItem -Force .github\workflows\
        ```

    === "Windows CMD"
        ```cmd
        dir /a .github\workflows\
        ```

    Lokales YAML-Lint mit `yamllint` (oder einem Editor mit Schema-Support) hilft, Fehler früher zu finden.

??? warning "„mapping values are not allowed in this context"
    YAML hat Probleme mit Werten, die selbst Doppelpunkte enthalten. Beispiel:

    ```yaml
    tags: app:1.0       # ❌ YAML denkt, das sei ein neuer Schlüssel
    ```

    Lösung: Anführungszeichen um den Wert legen:

    ```yaml
    tags: "app:1.0"     # ✓
    ```

    Allgemein: **Tag-Strings, Image-Refs, Pfade mit `:`** immer in Anführungszeichen.

??? warning "Tabs statt Leerzeichen"
    YAML erlaubt **keine** Tabs für Einrückung. Editor auf „Leerzeichen statt Tabs" stellen, alle Einrückungen mit **2 Leerzeichen** pro Ebene neu setzen.

    Hilfreich: in VSCode → unten rechts „Spaces" oder „Tabs" anklicken → „Convert Indentation to Spaces".

??? info "Workflow im Branch-Filter, läuft aber bei jedem Push"
    ```yaml
    on:
      push:
        branches: [main]
    ```

    Filtert auf `main`. Aber: **Tags** sind keine Branches und werden nicht gefiltert. Wenn du bei Tag-Push nicht willst, dass der Workflow läuft, brauchst du `branches-ignore` oder genauere `tags:`-Filter.

    ```yaml
    on:
      push:
        branches: [main]
        tags-ignore: ["**"]   # explizit alle Tags ausschließen
    ```

---

## Permissions, Secrets und Tokens

??? danger "„resource not accessible by integration" beim Push in GHCR"
    Drei Dinge müssen zusammenpassen:

    1. **Im Workflow**:
        ```yaml
        permissions:
          contents: read
          packages: write
        ```

    2. **In den Repo-Settings**: Settings → Actions → General → **Workflow permissions** auf **„Read and write permissions"**.
    3. **Image-Pfad** korrekt: `ghcr.io/<owner>/<repo>` mit **Kleinbuchstaben**. GHCR akzeptiert keine Großbuchstaben.

??? danger "„repository name must be lowercase" beim Push in GHCR"
    GHCR akzeptiert **nur Kleinbuchstaben** im Image-Pfad. GitHub-Usernames können aber Großbuchstaben enthalten (z.B. `JacobMenge`). Wenn du `${{ github.repository }}` direkt in den Tag schreibst, bricht der Push mit dieser Fehlermeldung ab.

    **Lösung 1, einfacher Lowercase-Step (empfohlen):**

    ```yaml
    - id: lcrepo
      run: echo "REPO=${GITHUB_REPOSITORY,,}" >> "$GITHUB_OUTPUT"

    - uses: docker/build-push-action@v6
      with:
        push: true
        tags: |
          ghcr.io/${{ steps.lcrepo.outputs.REPO }}:${{ github.sha }}
          ghcr.io/${{ steps.lcrepo.outputs.REPO }}:latest
    ```

    `${VAR,,}` ist Bash-Lowercase-Expansion. Funktioniert auf allen GitHub-gehosteten Linux-Runnern.

    **Lösung 2, `docker/metadata-action` nutzen:**

    Die Action konvertiert Tags und Image-Pfade meist automatisch zu Kleinbuchstaben. In Edge-Cases ist Lösung 1 robuster. Beide kombinieren ist okay.

??? warning "PR aus Fork hat keinen Zugriff auf Secrets"
    Das ist **Absicht** von GitHub. Forks können Repository-Secrets nicht lesen, sonst wäre jeder Fork ein Datendiebstahl-Vektor.

    **Lösung:** Für PRs nur Build und Test ausführen (ohne Secrets). Push/Deploy nur auf `push:` triggern.

    ```yaml
    publish:
      if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    ```

??? warning "Secret in den Logs sichtbar"
    Sollte nicht sein. GitHub maskiert Secrets automatisch. Wenn doch:

    1. Hast du das Secret in **Stücke zerlegt** (z.B. `${SECRET:0:5}`)? GitHub maskiert nur den Gesamt-String.
    2. Hast du es **anders kodiert** (Base64, JSON-Wrap)? Dann ist die kodierte Form nicht erkannt.

    **Reaktion:** Secret als kompromittiert betrachten und an der Quelle rotieren, nicht abwarten.

??? info "Eigene PAT (Personal Access Token) statt `GITHUB_TOKEN`?"
    Brauchst du **selten**. `GITHUB_TOKEN` reicht für:

    - GHCR-Pushes (mit `packages: write`)
    - Releases (mit `contents: write`)
    - Issues/PRs kommentieren

    PAT brauchst du erst, wenn du **Cross-Repo**-Aktionen machen willst (z.B. von Repo A in Repo B pushen).

---

## Docker-Builds in GitHub Actions

??? warning "Build dauert immer 5+ Minuten, obwohl wenig sich ändert"
    **Cache wird nicht genutzt.** Prüf:

    1. **`cache-from` und `cache-to`** in der `build-push-action` gesetzt?
        ```yaml
        cache-from: type=gha
        cache-to: type=gha,mode=max
        ```
    2. **Layer-Reihenfolge im Dockerfile** stimmt? Selten geänderte Dinge oben, oft geänderte unten. Mehr dazu: [Dockerfile-Best-Practices](../docker-profi/dockerfile-best-practices.md#1-layer-caching-aktiv-nutzen).

??? warning "„exec format error" beim Run auf einem ARM-Server"
    Du hast nur `linux/amd64` gebaut, aber willst auf `linux/arm64` (Apple Silicon, Graviton) ausführen.

    **Lösung:** Multi-Arch-Build mit `setup-qemu-action` + `platforms: linux/amd64,linux/arm64`. Siehe [Übung 6.3](uebungen.md#uebung-63-multi-arch-image-linuxamd64--linuxarm64).

??? danger "`load: true` und Multi-Arch widersprechen sich"
    `load: true` lädt das Image in den lokalen Daemon, **aber nur eine Architektur**. Wenn du `platforms:` mit zwei Plattformen plus `load: true` setzt, schlägt der Build fehl mit „docker exporter does not currently support exporting manifest lists".

    **Lösung:**

    - Build-Job (lokal, mit Test): `load: true`, **eine** Plattform.
    - Push-Job: `push: true`, mehrere Plattformen.

??? warning "Tests laufen nicht im Container, weil pytest nicht da ist"
    Häufiges Symptom in Multi-Stage-Builds: das **finale Image** (Runtime-Stage) hat `pytest` nicht, weil das nur im Build-Image war.

    **Drei Lösungen:**

    1. **Tests in einer eigenen Phase**, nicht im Runtime-Image. Direkt auf dem Runner mit `pytest` außerhalb von Docker (siehe [Übung 6.2](uebungen.md#uebung-62-tests-in-einem-eigenen-job)).
    2. **Tests im Build-Stage**, als Schritt **innerhalb** des Dockerfile mit `RUN pytest`. Bricht dann den Build, wenn rot.
    3. **Test-Image**, eigene Image-Variante, die Test-Tools enthält (`docker build --target test -t app-test .`).

---

## Pipeline-Logik

??? danger "`publish` läuft, obwohl `test` rot ist"
    Du hast `needs:` vergessen:

    ```yaml
    publish:
      runs-on: ubuntu-latest
      # ohne needs: läuft parallel zu test!
      steps: ...
    ```

    **Richtig:**

    ```yaml
    publish:
      runs-on: ubuntu-latest
      needs: [build-and-test]    # blockt, bis Build + Tests grün sind
      steps: ...
    ```

??? warning "Job läuft, obwohl Vorgänger rot ist"
    Das passiert, wenn `if:` einen `always()`-Operator hat:

    ```yaml
    if: always()
    ```

    `always()` heißt **„läuft immer, egal ob Vorgänger grün oder rot"**. Praktisch für Aufräum-Jobs, aber gefährlich für Publish-Jobs. Standardmäßig ist `if:` so, dass nur bei Erfolg gelaufen wird.

??? warning "Pipeline läuft endlos in einer Schleife"
    Wenn dein Workflow auf `push:` triggert und im Workflow selbst ein Commit zurück ins Repo macht (z.B. mit einem Bot-Token), löst das den Workflow erneut aus.

    **Schutz:**

    - `actions/checkout@v4` mit `persist-credentials: false` und einem **anderen** Token zum Pushen, der **nicht** Workflow-Trigger auslöst.
    - Oder: Trigger einschränken, sodass Bot-Pushes herausfallen (z.B. mit `if: github.actor != 'github-actions[bot]'`).

??? info "Job-Name in `needs:` falsch geschrieben"
    GitHub sagt: „Workflow does not include needs.X". Tippfehler im Job-Namen. Job-Namen sind **case-sensitive** und müssen exakt zum YAML-Schlüssel passen.

---

## Docker-Build im Container vs. auf dem Runner

??? info "`docker run` im Workflow funktioniert, `docker compose up` nicht"
    Der Standard-Runner (`ubuntu-latest`) hat Docker, aber **nicht** Compose Plugin in allen Versionen direkt verfügbar.

    **Test:**

    ```yaml
    - run: docker compose version
    ```

    Wenn das schiefgeht, Compose installieren. Meist reicht:

    ```yaml
    - run: |
        sudo apt-get update
        sudo apt-get install -y docker-compose-plugin
    ```

    Aktuelle GitHub-Runner haben Compose V2 typischerweise dabei. Falls doch nicht, ist der Lauf trivial nachzuinstallieren.

??? warning "Service-Container vs. self-hosted Runner"
    GitHub Actions kann **Service Container** parallel zum Job laufen lassen (z.B. Postgres für Integration-Tests):

    ```yaml
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports: ["5432:5432"]
    ```

    Das funktioniert auf **GitHub-gehosteten Runnern**, aber nicht auf jeder self-hosted Variante. Wenn du einen self-hosted Runner nutzt, prüf zuerst die Doku.

---

## Logs lesen lernen

??? info "Workflow ist rot, ich finde die Stelle nicht"
    Systematisch:

    1. Im Actions-Tab den **roten Lauf** öffnen.
    2. Die **Liste der Jobs** ist links, der rote Job ist mit X markiert.
    3. Den Job öffnen, die **Liste der Steps** durchsehen. Wieder ist der rote Step mit X markiert.
    4. Den **roten Step** aufklappen.
    5. Im Log-Output **nach oben** scrollen, bis du den **ersten** Fehler siehst (oft eine `error: …`-Zeile, oder einen Stacktrace).

    Das untere Ende der Logs ist meist Folgefehler.

??? info "Logs sind kryptisch, viel Rauschen"
    Standardmäßig druckt `actions/checkout` und Co. viele Zeilen. Du kannst **Step-Output gruppieren**:

    ```yaml
    - run: |
        echo "::group::Build logs"
        docker build -t app .
        echo "::endgroup::"
    ```

    `::group::` und `::endgroup::` sind GitHub-Actions-Befehle. Sie machen aufklappbare Sektionen im Log.

??? info "Re-run hilft nicht"
    GitHub erlaubt „Re-run failed jobs". Sinnvoll bei **transienten Fehlern** (Netzwerk-Timeouts beim Image-Pull). Bei **logischen** Fehlern (Test rot) hilft kein Re-run, Code muss repariert werden.

---

## Wenn nichts hilft

??? info "Systematisches Debugging"
    1. **Lokal reproduzieren**: führst du den Build oder Test lokal genau so aus wie in der Pipeline?
    2. **`act`** als lokales Replikat:
        ```bash
        act push -W .github/workflows/ci.yml
        ```
    3. **Debug-Logging einschalten**: Repo → Settings → Secrets → `ACTIONS_RUNNER_DEBUG=true` als Secret. Pipeline neu laufen lassen.
    4. **Workflow auf das Minimum reduzieren**: alles auskommentieren bis auf den problematischen Step. Dann Schritt für Schritt wieder ergänzen.
    5. **Andere Aktion zum Vergleich**: Hat jemand schon ein Beispiel veröffentlicht? GitHub-Marketplace und Awesome-Lists sind voll mit Vorbildern.

!!! tip "Vorbeugend"
    - **Action-Versionen pinnen** (`@v4`, nicht `@main`).
    - **`mkdocs build --strict` lokal**, bevor du pushst.
    - **Cache-Keys auf Datei-Hashes basieren** (`hashFiles('requirements.txt')`).
    - **`if:` für Push-Jobs** stets explizit setzen, nicht implizit darauf vertrauen.
