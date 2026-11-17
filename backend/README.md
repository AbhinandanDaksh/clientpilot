# ClientPilot API

Express 5 + TypeScript backend with MongoDB and Mongoose.
Requires Node.js 22.12+ and MongoDB (local server or Atlas) for database operations.

## Local setup (PowerShell)

```powershell
cd backend
npm ci
# Create backend/.env with the settings below.
npm run dev
```

```dotenv
NODE_ENV=development
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/clientpilot
```

API: `http://localhost:4000/api/v1`.
`GET /health` checks the server; `GET /health/ready` pings MongoDB and returns 503 when unavailable.
The server connects to MongoDB and verifies a ping before listening. The console prints `MongoDB connected successfully` on success. On failure, it prints a credential-free diagnostic and exits; fix the configuration and restart. Importing the app for tests does not require a database.
Local example: `mongodb://127.0.0.1:27017/clientpilot`.
For Atlas, use its `mongodb+srv://` connection string with a database name, create a database user, and allow your server IP in Atlas network access. Keep credentials in `.env` and URL-encode special characters in the username/password.

## Checks and production

```powershell
npm run typecheck
npm run build
npm start
```

Mongoose defines collections through models. Automatic index creation is enabled in development and disabled in production; provision the User email unique index before enabling registration in production. No database data or indexes have been changed by this setup.
Configure FRONTEND_ORIGIN with the exact frontend origin. Requests are limited to 120 per minute per IP; JSON bodies are limited to 1 MB. Configure trusted proxies and a shared rate-limit store before running multiple instances behind a proxy.

## Structure and scope

`src/server.ts` starts and shuts down the server. `src/app.ts` assembles middleware and routes. `src/config` contains validated environment settings and a shared lazy MongoDB connection. `src/modules/users/users.model.ts` defines the initial User model with an ObjectId, normalized unique email, name, password hash and timestamps. The password hash is excluded from queries by default; authentication must explicitly select it when implemented.

Add feature modules when implementing their behavior. Empty placeholder directories are omitted.

## Leads and free discovery

Lead CRUD is available at `/api/leads` (also `/api/v1/leads`). POST creates; GET lists with `search`, `status`, `location`, `category`, `page` and `limit` (maximum 100). GET/PATCH/DELETE `/:id` reads, edits or removes a lead. Required fields: `name`, `category`, `location`. Optional: `website`, `email`, `phone`, `notes`, `status`. Statuses: New, Qualified, Audited, Contacted, Rejected. Invalid input returns 400, missing leads 404, duplicate businesses 409. Name + city normalization and OSM source IDs have unique database indexes, created at server startup.

Example request body:

```json
{"name":"Example Cafe","category":"Cafe","location":"Modinagar","website":"https://example.com"}
```

POST `/api/leads/hunter/run` with `{"location":"Modinagar + Ghaziabad","limit":20}` starts free OpenStreetMap/Overpass discovery. Location may also be Modinagar or Ghaziabad; limit is 1–20. GET `/api/leads/hunter/runs` lists recent results, including partial saves and upstream failures. A persistent lock enforces a ten-minute cooldown across instances. No paid API, AI service or API key is used. Public Overpass availability is best-effort, not a production SLA; use an appropriate hosted/self-hosted data source before scaling.

The in-process scheduler runs daily at 09:00 Asia/Kolkata while the backend is online. There is no catch-up for missed runs. Date keys prevent duplicate scheduled runs across restarts. A run saves at most 20 new leads, not a guaranteed 20. Queries use bounded geographic boxes around each city and named shops, restaurants/cafes, healthcare and hotels. Contacts are only copied when present in OSM. Listings require human review; no business verification or qualification score is claimed. Discovery retains OSM source links and ODbL attribution. See https://dev.overpass-api.de/overpass-doc/en/preface/commons.html and https://www.openstreetmap.org/copyright .

The frontend Lead Hunter uses real CRUD and discovery results. Dashboard lead counts and fresh leads use the API; other dashboard charts/agents remain demos. Next.js proxies `/api/leads` to `http://127.0.0.1:4000`; set frontend `BACKEND_URL` before starting/building for a different backend.

Authentication is pending. The API binds to `127.0.0.1` by default for local development; `HOST` overrides it. Do not expose unauthenticated lead data publicly. MongoDB can run locally for free. No cloud hosting or billing has been provisioned.

Run `npm test` for mapping, HTTP validation, and MongoDB CRUD integration checks. Integration uses uniquely named test records and removes them afterward; it skips explicitly if the configured database is unavailable.

Run `npm run hunt` from `backend` for a one-off live discovery run without starting the HTTP server. It uses the same database lock and cooldown as the UI and scheduler. An upstream failure appears in run history and exits with code 1; allow the cooldown before retrying. The GitHub Actions backend job runs tests against a temporary MongoDB service.
