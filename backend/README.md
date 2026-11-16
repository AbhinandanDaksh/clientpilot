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

Authentication, feature APIs, AI providers, background workers and frontend integration are not implemented yet. The health endpoints are the only active endpoints.
