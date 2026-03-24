# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IoT dashboard and device management platform (IoTicos God Level). Full-stack app with a Nuxt.js 2 frontend and Node.js/Express backend, using MongoDB for persistence and MQTT (EMQX broker) for real-time IoT device communication.

## Commands

```bash
npm run dev      # Nuxt dev server (port 3000, SSR disabled)
npm run devn     # API server with nodemon + Babel (api/index.js)
npm run build    # Production build
npm run start    # Serve production build
npm run generate # Static site generation
```

Both frontend and backend must run simultaneously for full functionality. No test suite is configured.

## Architecture

### Frontend (Nuxt 2 / Vue 2)
- **Pages** (`/pages/`): Auto-routed — `dashboard.vue`, `devices.vue`, `alarms.vue`, `templates.vue`, `login.vue`, `register.vue`
- **Layouts** (`/layouts/`): `default.vue` (dashboard shell with sidebar/navbar), `auth.vue` (login/register)
- **Store** (`/store/index.js`): Single Vuex store managing auth (JWT in localStorage), devices, selectedDevice, and notifications
- **Widgets** (`/components/Widgets/`): Four IoT widget types used in dashboard templates — `Rtnumberchart` (sensor value + chart), `Iotindicator` (boolean status), `Iotswitch` (toggle output), `Iotbutton` (action output)
- **Middleware** (`/middleware/`): `authenticated.js` redirects unauthenticated users to login; `notAuthenticated.js` redirects logged-in users away from auth pages
- **UI**: Bootstrap 4 + Element UI + custom SCSS theme (`/assets/sass/black-dashboard.scss`)

### Backend (`/api/`)
- **Entry**: `api/index.js` — Express server with Mongoose connection, CORS, Morgan logging
- **Auth**: JWT tokens (30-day expiry), bcrypt password hashing, `checkAuth` middleware on protected routes
- **Routes**:
  - `/api/login`, `/api/register`, `/api/user` — authentication
  - `/api/device` — CRUD for IoT devices
  - `/api/template` — widget template management
  - `/api/alarm` — alarm rule CRUD
  - `/api/saver-webhook`, `/api/alarm-webhook` — EMQX webhook endpoints for data ingestion and alarm triggers
  - `/api/emqx-auth` — MQTT credential management
  - `/api/data` — historical data for charts
  - `/api/notifications` — device notifications/alarms
- **Models** (`/api/models/`): Mongoose schemas for User, Device, Template, Data, Notifications, EmqxAuth, EmqxAlarmRule, EmqxSaverRule

### Real-time Data Flow
1. IoT device publishes to MQTT topic `{userId}/{deviceId}/{variable}`
2. EMQX broker triggers webhook → `POST /api/saver-webhook` → saved to MongoDB
3. Frontend MQTT client subscribes to same topics → widgets update in real-time via Highcharts
4. Alarm rules evaluated by EMQX → webhook to `/api/alarm-webhook` → notifications stored and displayed

## Environment Variables

### Frontend (in `nuxt.config.js` via `process.env`)
- `AXIOS_BASE_URL` — API base URL for axios
- `MQTT_HOST`, `MQTT_PORT`, `MQTT_PREFIX` — MQTT broker connection

### Backend (via dotenv in `api/index.js`)
- `API_PORT` — Express server port
- `MONGO_USERNAME`, `MONGO_PASSWORD`, `MONGO_HOST`, `MONGO_PORT`, `MONGO_DATABASE`
- `EMQX_API_HOST`, `EMQX_DEFAULT_APPLICATION_SECRET`, `EMQX_API_TOKEN`
- `SSLREDIRECT` — enable HTTPS redirect

## Key Technical Details

- **No TypeScript** — entire codebase is plain JavaScript with Babel for ES6
- **No linter or formatter** configured
- **No test framework** configured
- **SSR is disabled** (`mode: 'spa'` in nuxt.config.js)
- **Commit messages** in this repo are in Spanish
- Dashboard color theme is configured in `/config.js`
