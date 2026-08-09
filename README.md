# GEU Connect — Backend

Express + MongoDB (Mongoose) + Socket.IO API for the GEU Connect prototype.
Pairs with the React frontend (`GEU-Connect-App.jsx`) but is framework-agnostic —
any client can talk to these REST endpoints and socket events.

## Why Socket.IO for AttendanceHUB

The 5-second QR rotation and proxy-prevention logic needs a live, two-way
channel: the teacher's screen must receive a new code every 5s, and a
student's "capture" must be checked against the *current* code in real time.
REST polling would work but adds latency and load; Socket.IO keeps both
sides in sync instantly. Everything else (notices, assignments, notes,
exams, attendance history) is plain REST since it doesn't need to be live.

## Stack

- Node.js + Express — REST API
- MongoDB + Mongoose — data
- Socket.IO — live QR rotation/capture + chat (class / CR / teacher-query)
- JWT — auth (student logs in with Student ID + official email; no password,
  matching the college's actual account-issuance model for this prototype)

## Setup

```bash
cd geu-backend
npm install
cp .env.example .env        # edit MONGO_URI / JWT_SECRET as needed
npm run seed                 # populates dummy data matching the frontend
npm run dev                  # starts on http://localhost:5000
```

Requires a running MongoDB instance (local `mongod`, Docker, or a free
MongoDB Atlas cluster — just point `MONGO_URI` at it).

## REST API overview

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login/student` | `{ studentId, email }` → JWT + student record |
| POST | `/api/auth/login/teacher` | `{ email, phone }` → JWT + teacher record |
| POST | `/api/auth/login/admin` | `{ studentId, email }` for an admin-role student |
| GET | `/api/auth/me` | current user from token |
| GET | `/api/students/:id` | student profile |
| PATCH | `/api/students/:id/contact` | student self-edit — phone/email only |
| PATCH | `/api/students/:id/hydration` | `{ ml }` log water intake |
| PATCH | `/api/students/:id/admin` | admin-only full edit |
| GET | `/api/teachers` | list, optional `?section=C1` |
| GET | `/api/teachers/:id` | teacher profile |
| GET | `/api/teachers/:id/assignments` \| `/notes` \| `/attendance-log` | teacher sub-resources |
| PATCH | `/api/teachers/:id/admin` | admin-only edit |
| GET/POST | `/api/notices` | Important tab — list / create (teacher, CR, admin) |
| GET/POST | `/api/assignments` | list (`?section=&studentId=`) / create |
| POST | `/api/assignments/:id/submit` | student marks submitted |
| GET/POST | `/api/notes` | subject notes + YouTube references |
| GET | `/api/exams/upcoming` \| `/results` \| `/seating` | Exam tab data |
| GET | `/api/attendance/summary/:studentId` | overall + subject-wise % |
| GET | `/api/attendance/session/:teacherId` | current live-session status (poll fallback) |
| GET | `/api/chat/:room/history` | chat backlog before joining a socket room |
| POST | `/api/ai/reply` | rule-based AI Assistant reply (swap for a real LLM call) |

All routes except the login endpoints require `Authorization: Bearer <token>`.

## Socket.IO events — AttendanceHUB

```
Client → Server
  session:start   { teacherId, section, subject }        (teacher starts broadcasting)
  session:end     { teacherId }
  session:join    { teacherId }                           (both teacher screen & students)
  attendance:capture { teacherId, studentId, code, date, time }

Server → Client
  session:update        { live, code, sessionId, subject, section }   (fires immediately, then every 5s)
  session:studentMarked { studentId, count }
```

A capture is only accepted if: a session is live, the submitted `code`
matches the *current* server-side code (rejects stale/screenshotted codes),
and the student hasn't already been marked for that session.

## Socket.IO events — Chat (class / CR / teacher-query all reuse this)

```
Client → Server
  chat:join   { room }                                    e.g. "class-C1", "cr-<studentId>", "query-<teacherId>-<studentId>"
  chat:send   { room, kind, senderName, senderRole, text }

Server → Client
  chat:message  <ChatMessage>
```

## Project structure

```
geu-backend/
  server.js                 entry point — Express + Socket.IO wiring
  src/
    config/db.js             Mongo connection
    models/                  Mongoose schemas
    middleware/auth.js        JWT guard + role guard
    controllers/              route handlers
    routes/                   Express routers
    sockets/index.js          live QR + chat realtime logic
    seed/seed.js               npm run seed
```

## Taking this to production

- Swap the AI endpoint for a real LLM call (e.g. Anthropic's `/v1/messages`),
  passing the student's live attendance/timetable data in context.
- Replace Student-ID+email login with real college SSO.
- Move `liveSessions` (in `sockets/index.js`) to Redis + the Socket.IO Redis
  adapter if you run more than one server instance.
- Add file upload storage (S3/Cloudinary) for assignment/notes file URLs.
