# Client Progress Tracker

Simple Next.js app for nutrition coach check-ins.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set values:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Admin login

Default password is `admin123` unless you set `ADMIN_PASSWORD`.

## Reminder emails

The app runs a reminder sweep hourly while the server is running. It sends emails to clients inactive for 24+ hours. Configure SMTP settings to enable.

You can also trigger reminders manually:

```bash
curl -X POST http://localhost:3000/api/cron
```

## Deploy na Render

Repo je pripraveny pro Render Blueprint (`render.yaml`).

1. Nahraj posledni zmeny na GitHub (`main`).
2. V Renderu zvol `New +` -> `Blueprint` a vyber tento repozitar.
3. Pri vytvareni sluzby nastav:
   - `ADMIN_PASSWORD` (povinne)
   - SMTP promenne (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) pokud chces posilat pripominky e-mailem
4. Dokonci deploy.

Poznamka:
- Bez SMTP budou pripominky pres e-mail automaticky vypnute.
- Na Free tarifu Render nejsou disky podporovane, takze SQLite data nejsou trvala.
- Pro trvala SQLite data pouzij Starter plan a pridej persistentni disk.
