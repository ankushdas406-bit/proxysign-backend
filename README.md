# Proxysign Backend (Node.js + Express + MongoDB)

## What is included
- Express server with CORS & Helmet
- Mongoose models: User (admin), Teacher, Lecture, Attendance
- Auth routes with JWT
- Protected routes for teachers, lectures, attendance
- Setup flow: create initial admin using SETUP_TOKEN

## Quick start (local)

1. Copy `.env.example` to `.env` and fill values:
   - `MONGO_URI` — MongoDB connection string
   - `JWT_SECRET` — a long random string
   - `SETUP_TOKEN` — token used to allow initial admin creation

2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm run dev
```

The server will run on `http://localhost:4000` (or the PORT you set).

## API (summary)

- `POST /api/auth/register` — Create admin (requires header `x-setup-token` matching `SETUP_TOKEN`)
  body: `{ "email": "...", "password": "..." }`
- `POST /api/auth/login` — Login -> returns `{ token }`
  body: `{ "email": "...", "password": "..." }`
- `GET /api/teachers` — list teachers (protected)
- `POST /api/teachers` — add teacher (protected)
- `GET /api/lectures` — list lectures (protected)
- `POST /api/lectures` — create lecture (protected) body: `{ title, lat, lon }`
- `GET /api/attendance` — list attendance (protected)
- `POST /api/attendance` — record attendance (protected) body: `{ name, lectureId, lat, lon, time }`

## Notes
- Use the JWT `Authorization: Bearer <token>` header to access protected endpoints.
- In production secure the SETUP_TOKEN and remove or disable open admin registration once admin created.
