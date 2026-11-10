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

Import icons directly from `react-icons/lu`. Use Tailwind utilities for styling and keep colors in `common/colors.css`. Dashboard data and agent actions currently use local demo state. Authentication pages are scaffolds.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build
```
