# Telemetrie-API der Aurora Station.
# Bewusst minimal: keine npm-Pakete, nur die Node-Standardbibliothek.
FROM node:20-alpine

WORKDIR /app

# Es gibt keine Abhängigkeiten zu installieren – wir kopieren nur den Code.
COPY package.json ./
COPY server.js ./

EXPOSE 8000

# Als nicht-root-Benutzer laufen (im node-Image bereits vorhanden).
USER node

CMD ["node", "server.js"]
