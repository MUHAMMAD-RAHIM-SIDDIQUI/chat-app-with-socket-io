# Real-Time Chat App - Client

The React frontend for a real-time one-on-one chat application. It talks to the Node/Express/Socket.IO server over a REST API for auth, users and message history, and over a WebSocket for live messages, typing indicators and online presence.

## Features

- Register and log in with JWT based authentication
- Session restore on page reload (token is checked against the server)
- User list with search, online users shown first
- One-on-one real-time messaging
- Online / offline status for every user
- Typing indicator
- Unread message badges per conversation
- Message history loaded from the database
- Reconnect banner when the socket connection drops
- Responsive layout (360px and up): sidebar and chat on desktop, one at a time on mobile
- Light and dark theme that follows the system setting

## Tech stack

| Area | Tools |
| --- | --- |
| UI | React 18, React Router 6 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3, Inter font |
| HTTP | Axios |
| Real-time | Socket.IO client 4 |

## Prerequisites

- Node.js 18 or newer
- npm
- The chat server running and reachable (see the server README)

## Getting started

```bash
# 1. install dependencies
npm install

# 2. create your env file
cp .env.example .env

# 3. start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

## Environment variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Base URL of the server, without a trailing slash and without `/api` | `http://localhost:5000` |

The REST client appends `/api` itself, and the same URL is used for the Socket.IO connection. Vite only exposes variables that start with `VITE_`, and they are read at build time, so restart the dev server after changing `.env`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 5173 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
client/
  index.html
  package.json
  tailwind.config.js        theme extensions: brand gradient, shadows, animations
  postcss.config.js
  vite.config.js
  .env.example
  src/
    main.jsx                providers and router setup
    App.jsx                 routes
    index.css               Tailwind layers, font import, scrollbars, shared classes
    api/
      axios.js              axios instance, token interceptor, error helper
    context/
      AuthContext.jsx       user, login, register, logout
      SocketContext.jsx     socket instance, online users, connection state
    components/
      ProtectedRoute.jsx
      Sidebar.jsx           profile header, search, user list, unread badges
      ChatWindow.jsx        header, message list, typing indicator, error toast
      MessageBubble.jsx
      MessageInput.jsx
      Avatar.jsx            deterministic gradient color per username
    pages/
      Login.jsx
      Register.jsx
      Chat.jsx              chat state and socket listeners
```

## How it talks to the server

### REST (Axios)

Every request goes to `${VITE_API_URL}/api` and carries `Authorization: Bearer <token>` when a token is saved in `localStorage`.

| Method | Endpoint | Used for |
| --- | --- | --- |
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Validate the saved token on load |
| GET | `/users` | Load the user list |
| GET | `/messages/:userId` | Load history with one user |

Errors are read from `response.data.message`, so the server should return `{ message: '...' }` on failure.

### Socket.IO

The socket connects to `VITE_API_URL` and sends the JWT in the handshake as `auth: { token }`.

| Direction | Event | Payload |
| --- | --- | --- |
| Client to server | `send-message` | `{ to, text }`, with an acknowledgement `{ message }` or `{ error }` |
| Client to server | `typing` | `{ to }` |
| Client to server | `stop-typing` | `{ to }` |
| Server to client | `new-message` | the message object |
| Server to client | `typing` | `{ from }` |
| Server to client | `stop-typing` | `{ from }` |
| Server to client | `online-users` | array of user ids |

## Styling notes

- Brand look is a teal to emerald gradient used on primary buttons, your own message bubbles, the logo mark and unread badges.
- Dark mode uses the `dark:` variant with the default `media` strategy, so it follows the operating system. There is no toggle.
- Animations respect `prefers-reduced-motion`.
- The app height uses `100dvh`, so mobile browser toolbars do not cut off the input bar.

## Troubleshooting

**"Cannot reach the server, check your connection"**
The server is not running or `VITE_API_URL` is wrong. Check the URL, then restart `npm run dev`.

**Login works but the "Connection lost" banner stays visible**
The WebSocket cannot connect. Make sure the server allows your client origin in its Socket.IO CORS settings and that the token is valid.

**Blank page after deploy**
If you host the build on a static host, add a fallback rule so all routes serve `index.html`, because the app uses client-side routing.

## Build for production

```bash
npm run build
```

Upload the contents of `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). Set `VITE_API_URL` to your deployed server URL before building, and add that frontend URL to the server's allowed origins.

## License

Built as a final year project. Add your license of choice here.
