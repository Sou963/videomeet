# VideoMeet

VideoMeet is a JavaScript-only full-stack video conferencing app built with Next.js App Router, Express, MongoDB, JWT cookies, Socket.IO, and LiveKit Cloud.

## What works

- Register, login, logout, current-user and password change
- Create, schedule, password-protect, join, list and end meetings
- LiveKit camera, microphone, screen sharing and real participants
- Waiting-room media preview
- Socket.IO meeting chat with MongoDB persistence, reactions and raise-hand events
- Responsive home, dashboard, history and settings pages

## Architecture

Next.js (Vercel) handles UI and calls the Express REST API and Socket.IO server on Railway. Express owns JWT authorization, MongoDB data and LiveKit token creation. LiveKit Cloud carries audio/video/media; Socket.IO carries only application events.

## Local setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set frontend URLs.
3. `npm run dev` (frontend at `http://localhost:3000`).
4. In another terminal: `cd server && npm install`.
5. Copy `server/.env.example` to `server/.env`; add MongoDB Atlas, JWT and LiveKit values.
6. Run `npm run dev` (API at `http://localhost:5000`).

## Environment variables

Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, and optionally `NEXT_PUBLIC_LIVEKIT_URL`.

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL`, `CLIENT_URL`.

Never expose `LIVEKIT_API_SECRET`, `JWT_SECRET`, or `MONGODB_URI` to the frontend.

## Deployment

Deploy the repository root to Vercel and the `server` directory to Railway. Set Railway `CLIENT_URL` to the Vercel origin and set the frontend API/Socket URLs to the Railway URLs. Create a LiveKit Cloud project and use its server URL, API key and secret only on Railway.

## Verification

`npm run build`, `npm run lint`, and backend `node --check` pass locally. LiveKit and MongoDB flows require valid deployment credentials.
