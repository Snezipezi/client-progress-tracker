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
