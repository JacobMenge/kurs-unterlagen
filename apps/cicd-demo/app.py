"""Kleine Demo-App für den CI/CD-Block.

Zwei HTTP-Endpoints:
  - GET /         → kurzer Begrüßungstext (HTML)
  - GET /api/sum  → addiert ?a= und ?b= als JSON

Wird im Praxis-Teil mit pytest geprüft und in einer GitHub-Actions-Pipeline gebaut.
"""

from flask import Flask, jsonify, request

app = Flask(__name__)


@app.get("/")
def index():
    return (
        "<h1>CI/CD-Demo läuft</h1>"
        "<p>Probier <a href=\"/api/sum?a=2&b=3\">/api/sum?a=2&b=3</a>.</p>"
    )


@app.get("/api/sum")
def api_sum():
    try:
        a = int(request.args.get("a", "0"))
        b = int(request.args.get("b", "0"))
    except ValueError:
        return jsonify(error="a und b müssen Zahlen sein"), 400
    return jsonify(a=a, b=b, sum=a + b)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
