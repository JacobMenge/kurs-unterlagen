# cicd-demo – Praxis-App für den CI/CD-Block

Kleine Flask-App, die im [CI/CD-Block](../../docs/ci-cd/index.md) als
Vorlage für die Praxis-Pipeline dient.

## Lokal starten

```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Browser: <http://localhost:8000>

## Tests laufen lassen

```bash
pytest -v
```

## Im Container bauen und starten

```bash
docker build -t cicd-demo .
docker run --rm -p 8000:8000 cicd-demo
```

## Wofür ist das?

Diese Mini-App existiert nur, damit du in der Praxis-Übung etwas zum Bauen
und Testen hast. Keine echte Anwendung. Vier Tests in `test_app.py` – einer
davon prüft Fehlerverhalten, sodass eine echte Test-Phase Sinn ergibt.
