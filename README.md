# Hann

The client portal and back-office application for Hann Wellness — a [Nuxt 4](https://nuxt.com) app backed by PostgreSQL, covering referrals, clinical notes, billing/invoicing, file management, and transactional email.

## Tech stack

- **Framework:** Nuxt 4 / Vue 3 (Nitro server)
- **Database:** PostgreSQL via [Kysely](https://kysely.dev) (typed query builder + migrations)
- **Auth:** [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) with bcrypt password hashing, protected by Cloudflare Turnstile
- **Styling:** Tailwind CSS
- **Email:** Postmark
- **PDF generation:** PDFKit
- **Validation:** Zod + vee-validate
- **Testing:** Vitest + happy-dom

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 10 (this repo pins `packageManager`; run `corepack enable pnpm` to use the pinned version)
- A PostgreSQL database

## Setup

Install dependencies:

```bash
pnpm install
```

Create a `.env` from the example and fill in the values:

```bash
cp .env.example .env
```

Key environment variables (see `nuxt.config.ts` for defaults):

| Variable | Description |
| --- | --- |
| `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_USER` / `DATABASE_PASSWORD` / `DATABASE_NAME` | PostgreSQL connection |
| `DATABASE_CA_CERTIFICATE` | Optional CA cert for TLS database connections |
| `NUXT_SESSION_PASSWORD` | Secret used by nuxt-auth-utils to seal sessions (min 32 chars) |
| `NUXT_TURNSTILE_SITE_KEY` / `NUXT_TURNSTILE_SECRET_KEY` | Cloudflare Turnstile keys |
| `NUXT_TURNSTILE_ENABLED` | Set to `false` to disable Turnstile locally |
| `NUXT_PUBLIC_BASE_URL` | Public base URL of the app |
| `NUXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (see [GOOGLE_MAPS_SETUP.md](GOOGLE_MAPS_SETUP.md)) |
| `POSTMARK_SERVER_API_TOKEN` | Postmark server token (email sending is disabled if unset) |
| `POSTMARK_WEBHOOK_API_KEY` | Key used to authenticate inbound Postmark webhooks |
| `EMAIL_FROM` / `EMAIL_TO` | Default sender / recipient addresses for transactional email |
| `ENCRYPTION_KEY` | Key for encrypting sensitive data at rest |

Run database migrations and create an initial user:

```bash
pnpm db:migrate
pnpm create-user
```

See [AUTH_SETUP.md](AUTH_SETUP.md) and [scripts/README.md](scripts/README.md) for details.

## Development

Start the dev server on `http://localhost:3000`:

```bash
pnpm dev
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build locally |
| `pnpm generate` | Generate a static build |
| `pnpm test` | Run the test suite (watch mode) |
| `pnpm test:run` | Run tests once |
| `pnpm test:ui` | Run tests with the Vitest UI |
| `pnpm lint` / `pnpm lint:fix` | Lint with ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm db:migrate` / `pnpm db:migrate:down` | Run / roll back database migrations |
| `pnpm db:types` | Generate Kysely types from the database schema |
| `pnpm db:import-mysql` | Import data from a legacy MySQL database |
| `pnpm create-user` | Create an application user |
| `pnpm change-password` | Change a user's password |

## Project structure

```
app.vue, error.vue     # Root app + error pages
pages/                 # Routed pages (referrals, clinical-notes, billing, files, ...)
components/            # Vue components
composables/           # Shared client composables
layouts/, middleware/  # Nuxt layouts and route middleware
server/                # Nitro backend (api/, service/, repository/, lib/, templates/)
db/                    # Kysely migrations and schema
scripts/               # CLI utilities (migrations, user management, MySQL import)
tests/                 # Vitest tests
```

See [SERVER_ARCHITECTURE.md](SERVER_ARCHITECTURE.md) for the backend layering, and [RULES.md](RULES.md) for project conventions.

## Production

The application is hosted on [DigitalOcean](https://www.digitalocean.com). Access the
DigitalOcean account by signing in with Google using `jamie@hannpsychologicalservices.com`.

Build and preview locally:

```bash
pnpm build
pnpm preview
```

Refer to the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for hosting options.
