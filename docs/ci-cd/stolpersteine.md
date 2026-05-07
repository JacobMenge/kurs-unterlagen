---
title: "Stolpersteine CI/CD"
description: "Typische Probleme bei GitHub Actions, YAML-Syntax, Permissions, Pipeline-Logik und Logs lesen."
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

    Allgemein: **Strings mit `:`** immer in Anführungszeichen.

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

??? warning "`Run workflow`-Knopf erscheint nicht"
    Der manuelle Knopf für `workflow_dispatch:` ist nur sichtbar, wenn die Workflow-Datei mindestens einmal auf dem Default-Branch (meist `main`) gelandet ist. Erstmal pushen, dann erscheint er.

---

## Permissions, Secrets und Tokens

??? danger "„resource not accessible by integration"
    Der `GITHUB_TOKEN` hat **standardmäßig** keine Schreibrechte. Wenn dein Workflow z.B. Pakete pushen oder Releases anlegen will, muss er explizit Rechte anfordern:

    ```yaml
    permissions:
      contents: read
      packages: write
    ```

    Plus in den **Repo-Settings**: Settings → Actions → General → **Workflow permissions** auf **„Read and write permissions"**.

??? warning "PR aus Fork hat keinen Zugriff auf Secrets"
    Das ist **Absicht** von GitHub. Forks können Repository-Secrets nicht lesen, sonst wäre jeder Fork ein Datendiebstahl-Vektor.

    **Lösung:** Für PRs nur Build und Test ausführen (ohne Secrets). Push und Deploy nur auf `push:` triggern.

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
    - Issues und PRs kommentieren

    PAT brauchst du erst, wenn du **Cross-Repo**-Aktionen machen willst (z.B. von Repo A in Repo B pushen).

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
      needs: [build-and-test]    # blockt, bis Build und Tests grün sind
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
    Standardmäßig drucken `actions/checkout` und andere Actions viele Zeilen. Du kannst **Step-Output gruppieren**:

    ```yaml
    - run: |
        echo "::group::Eigener Block"
        echo "Zeile A"
        echo "Zeile B"
        echo "::endgroup::"
    ```

    `::group::` und `::endgroup::` sind GitHub-Actions-Befehle. Sie machen aufklappbare Sektionen im Log.

??? info "Re-run hilft nicht"
    GitHub erlaubt „Re-run failed jobs". Sinnvoll bei **transienten Fehlern** (Netzwerk-Timeouts beim Image-Pull). Bei **logischen** Fehlern (Test rot) hilft kein Re-run, Code muss repariert werden.

---

## Lokale Probleme

??? info "Push klappt nicht: „authentication failed"
    Beim ersten Push mit HTTPS verlangt Git Anmeldedaten. **Username** ist dein GitHub-Name, **Passwort** ist ein **Personal Access Token**, nicht das normale Passwort.

    PAT erstellen: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token. Mindestens das Recht **`repo`** anhaken, eine sinnvolle Ablaufzeit setzen, **Token kopieren** (du siehst ihn nur einmal).

    Beim nächsten `git push` Username + Token eingeben. Git Credential Manager merkt sich das auf den meisten Systemen.

??? info "Workflow-Datei nicht im Repo nach `git push`"
    Hast du die Datei zum Commit hinzugefügt?

    ```bash
    git status
    ```

    Steht sie unter „Untracked files" oder „Changes not staged for commit"? Dann:

    ```bash
    git add .github/workflows/<datei>.yml
    git commit -m "Workflow hinzugefügt"
    git push
    ```

---

## Wenn nichts hilft

??? info "Systematisches Debugging"
    1. **Workflow auf das Minimum reduzieren**: alles auskommentieren bis auf den problematischen Step. Dann Schritt für Schritt wieder ergänzen.
    2. **Debug-Logging einschalten**: Repo → Settings → Secrets → `ACTIONS_RUNNER_DEBUG=true` als Secret. Pipeline neu laufen lassen.
    3. **`act`** als lokales Replikat (für Fortgeschrittene):
        ```bash
        act push -W .github/workflows/ci.yml
        ```
    4. **Anderen Workflow zum Vergleich**: GitHub-Marketplace und Awesome-Listen sind voll mit Beispielen.

!!! tip "Vorbeugend"
    - **Action-Versionen pinnen** (`@v4`, nicht `@main`).
    - **YAML lokal validieren** mit `yamllint` oder einem Editor mit Schema-Support.
    - **Trigger explizit setzen** (`branches:`, `paths-ignore:`), nicht implizit auf alles laufen lassen.
