# VideoMeet

VideoMeet is a JavaScript-only full-stack video conferencing app built with Next.js App Router, Express, MongoDB, JWT cookies, and native browser WebRTC with Socket.IO signaling !

## What works

- Register, login, logout, and current-user auth checks
- Create, schedule, password-protect, join, list, and end meetings
- Native WebRTC camera and microphone calls between browser clients
- Screen share support using the browser display media APIs
- Waiting-room media preview
- Socket.IO meeting chat with MongoDB persistence, reactions, and raise-hand events
- Responsive home, dashboard, history, and settings pages

## Architecture

Next.js (Vercel) handles the UI and calls the Express REST API and Socket.IO server on Railway. Express owns JWT authorization and MongoDB persistence. Native WebRTC transports the audio and video streams directly between browsers, while Socket.IO carries the signaling messages and meeting events.

## Local setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and set frontend URLs.
3. `npm run dev` (frontend at `http://localhost:3000`).
4. In another terminal: `cd server && npm install`.
5. Copy `server/.env.example` to `server/.env`; add MongoDB Atlas and JWT values.
6. Run `npm run dev` (API at `http://localhost:5000`).

## Environment variables

Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`, and optionally `NEXT_PUBLIC_TURN_URL`, `NEXT_PUBLIC_TURN_USERNAME`, `NEXT_PUBLIC_TURN_PASSWORD` for a TURN server.

Backend: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.

Never expose `JWT_SECRET` or `MONGODB_URI` to the frontend.

## Deployment

Deploy the repository root to Vercel and the `server` directory to Railway. Set Railway `CLIENT_URL` to the Vercel origin and configure the frontend API and Socket URLs to the Railway endpoints. If you use TURN for connectivity, configure the public TURN credentials in the frontend environment variables only.

## Verification

`npm run build`, `npm run lint`, and backend `node --check` pass locally. MongoDB and browser WebRTC flows require valid deployment credentials and browser permissions.
