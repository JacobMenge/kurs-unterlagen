FROM nginx:1.27-alpine

# Eigene Server-Konfiguration: leitet /api/ an den Backend-Service weiter
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Statische Frontend-Dateien
COPY index.html /usr/share/nginx/html/index.html
COPY style.css  /usr/share/nginx/html/style.css
COPY app.js     /usr/share/nginx/html/app.js

EXPOSE 80
