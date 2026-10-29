# Docker packaging and deployment

The Compose stack builds a static React site served by Nginx, a Spring Boot API, MySQL, and Redis. Only the website port is published. Nginx forwards `/nex-cart/` to the private backend service, so the browser uses a same-origin API URL.

## Prepare local or production environment

1. Copy `.env.example` to `.env` in the repository root (`Copy-Item .env.example .env` in PowerShell). The local Docker frontend is published on port 5173 by default.
2. Replace the database passwords, JWT secret, admin credentials, Google OAuth values, and SMTP values. On PowerShell, generate a strong JWT secret with `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))`. Do not commit `.env`.
3. For production, set `PUBLIC_URL` to the real HTTPS website URL, set `COOKIE_SECURE=true`, and set `GOOGLE_REDIRECT_URI` to the matching callback URL, for example `https://shop.example.com/oauth2/callback`.
4. Add that exact callback URL to the OAuth client's authorized redirect URIs in Google Cloud Console. The frontend and backend use the same callback URL.

The current backend requires SMTP environment variables at startup. Supply a valid SMTP account even if email verification is not the first feature being deployed. The optional Groq and S3 integrations can be left blank if the app does not use them.

## Build and run

From the repository root:

```powershell
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

Open `http://localhost:5173` locally, or `https://your-domain` after putting a TLS reverse proxy/load balancer in front of the frontend container. To change the local published port, edit `APP_HTTP_PORT` in `.env`.

The first start creates an empty database and Hibernate creates/updates its schema. If you already have local products and users, export your existing MySQL database and import that backup into the Compose MySQL instance before switching traffic; the named volume does not automatically copy data from your local MySQL installation.

## Useful operations

```powershell
docker compose logs -f frontend
docker compose logs -f mysql
docker compose restart backend
docker compose pull mysql redis
docker compose down
```

`docker compose down` keeps the named database and Redis volumes. `docker compose down -v` deletes those volumes and permanently removes their stored data; do not use it for routine restarts. Back up the MySQL volume/database before upgrading or moving servers.

## Deploy updates

Pull or copy the new code to the server, set `APP_HTTP_PORT=8080` in `.env`, then run `docker compose up -d --build`. Put TLS termination and a domain in front of host port 8080, and forward the original `Host` and HTTPS `X-Forwarded-Proto` headers. Keep MySQL, Redis, and port 2908 private; this Compose file does not publish them to the host.

The application currently uses Hibernate `ddl-auto=update`. Take a database backup before releases that change entities; for production schema evolution, move to versioned Flyway/Liquibase migrations.
