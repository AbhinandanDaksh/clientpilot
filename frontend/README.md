# ClientPilot

Next.js App Router frontend with TypeScript, Tailwind CSS, and react-icons.

## Development

```sh
npm install
npm run dev
```

The home route redirects to `/dashboard`. Authentication pages live under `/auth`.

## Structure

```text
app/                     Route pages, layouts, and global styles
  auth/                  Login, register, and password recovery pages
  (workspace)/           Shared workspace layout; URLs stay unchanged
    dashboard/           Overview page and private _components/ (charts, data)
    lead-hunter/         Lead Hunter page and its local component
    ai-writer/           AI Writer page and its local component
    agent-activity/      Agent Activity page and its local component
components/
  layout/                Shared workspace shell, sidebar, footer and loading UI
  ui/                    Reusable UI primitives
common/colors.css        Shared application and dashboard color tokens
utils/                   Reserved for shared utilities when needed
public/                  Static assets
```

Import icons directly from `react-icons/lu`. Use Tailwind utilities for styling and keep colors in `common/colors.css`. Lead Hunter uses the MongoDB-backed backend for CRUD and free OpenStreetMap discovery. Dashboard lead counts and fresh leads are real API data; other charts and agent actions still use demo state. Authentication pages are scaffolds.

Start `backend` on port 4000 with MongoDB configured, then run this frontend. `/api/leads` is proxied to `http://127.0.0.1:4000` by default. Set `BACKEND_URL` in `.env.local` before starting/building if the backend uses another address. No Google Places key or paid service is required. Daily discovery runs at 09:00 IST only while the backend is running; OpenStreetMap coverage and availability vary.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build
```
