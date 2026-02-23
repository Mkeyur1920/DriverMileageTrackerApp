# Driver Mileage Tracker App

Driver Mileage Tracker is an Angular 19 web application used to record daily driver mileage, generate month-wise reports, and support admin review workflows.

## What This Project Does

- Allows drivers to register and log in.
- Lets drivers add daily mileage entries (start KM, end KM, total KM, date, visited places).
- Shows driver mileage history with month/year filtering.
- Generates monthly report requests from driver mileage data.
- Allows monthly report PDF export from the mileage table.
- Provides an admin dashboard with KPIs and charts.
- Allows admins to review monthly submissions and mark them as `GENERATED` or `REJECTED`.
- Supports user profile updates (basic details, signature, photo upload).
- Shows user notifications and unread counts.

## Tech Stack

- Angular 19 (standalone components)
- PrimeNG 19 + PrimeIcons
- Tailwind CSS
- RxJS
- Chart.js (dashboard charts)
- jsPDF + jspdf-autotable (PDF report export)

## Project Structure

```text
src/
  app/
    dto/                        # Shared data models
    layout/                     # App shell (topbar, sidebar, menu)
    pages/
      auth/                     # Login, registration, auth routes
      dashboard/                # Driver/Admin dashboards
      screens/                  # Core app screens
        add-driver-mileage/
        view-mileage/
        reports/
        report-review/
        user-profile/
      service/                  # API services
  environments/                 # Dev/prod API configuration
```

## Main User Flows

### Driver flow

1. Sign in from `/auth/login`.
2. Open `Add-Mileage` to create a mileage record.
3. Open `View` to filter records by month and view totals.
4. Generate monthly report status and download monthly PDF.
5. Manage profile via topbar -> Profile.

### Admin flow

1. Sign in with an admin role user.
2. Dashboard shows totals (drivers, monthly records, KM, submission status).
3. Open `Mileage Records` (`/screens/reports`) to inspect driver records by year/user and download monthly PDF.
4. Open `View All Reports` (`/screens/all-monthly-report`) to approve/reject monthly submissions.

## Routing Overview

Top-level routes are defined in `src/app.routes.ts`.

- `/auth/*` -> authentication pages
- `/dashboard` -> role-based dashboard (driver/admin)
- `/screens/add-mileage` -> add driver mileage
- `/screens/view-mileage` -> driver mileage listing and monthly actions
- `/screens/reports` -> admin mileage records view
- `/screens/all-monthly-report` -> admin report review workflow
- `/screens/user-profile/:userId` -> user profile form

## API Configuration

Environment files:

- `src/environments/environment.ts`
  - `apiBaseUrl: http://localhost:8080/api`
- `src/environments/environment.prod.ts`
  - `apiBaseUrl: https://drivermileagetracker-backend.onrender.com/api`

The frontend expects backend endpoints under these modules:

- `auth` (login/register)
- `mileage-records`
- `monthly-reports`
- `users`
- `notifications`

## Local Storage Usage

After successful login, the app stores:

- `authToken`
- `user` (serialized login response)

Logout clears both keys.

## Prerequisites

- Node.js 20 LTS recommended
- npm 10+
- Angular CLI (optional globally; project scripts work without global install)

## Setup and Run

```bash
npm install
npm start
```

App runs at:

- `http://localhost:4200`

Make sure backend API is reachable at `http://localhost:8080/api` in development.

## Available Scripts

- `npm start` -> start dev server (`ng serve -o`)
- `npm run build` -> production build
- `npm run watch` -> development build in watch mode
- `npm test` -> run unit tests with Karma
- `npm run format` -> run Prettier on JS/TS/HTML files

## Key Services (Frontend)

- `LoginService` -> login/register/logout/auth state
- `MileageRecordService` -> create/fetch mileage records
- `MonthlyReportService` -> generate/check/update monthly reports
- `UserService` -> user profile read/update
- `NotificationService` -> list notifications and mark as read

## Dashboard Metrics

Driver dashboard:

- Total kilometers
- Revenue (calculated as total KM x 14.5)

Admin dashboard:

- Total drivers
- Current month mileage record count
- Total kilometers across records
- Pending/generated/rejected submission counts
- Monthly trend and top-driver charts

## Current Notes

- Route guards are not currently enforced in routing; access control is primarily role-driven in UI/menu logic.
- Some placeholder/demo routes from the base template still exist (`/pages/*`, documentation/crud/empty).
- Registration currently exposes only the `DRIVER` role in the UI.

## Deployment

This repo includes `vercel.json` and `static.json`, indicating static hosting deployment support.

Before deploying, ensure:

1. Production backend URL is correct in `environment.prod.ts`.
2. Backend CORS allows the deployed frontend domain.
3. Build command and output directory (`dist/`) match host settings.

## License

MIT (see `LICENSE`).
