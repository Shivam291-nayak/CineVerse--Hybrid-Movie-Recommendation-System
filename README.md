# Movie Recommendation System

A full-stack MERN application for browsing movies, managing a personal watchlist, and administering a movie catalog.

## Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT-based authentication with role-based access (user/admin)

## Project Structure

```
Movie-Recommendation-System/
├── client/     # React frontend
└── server/     # Express backend
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Backend Setup
```bash
cd server
npm install
# update .env with your MONGO_URI and JWT_SECRET
npm run seed   # optional: seed sample movies
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` requests to the server on `http://localhost:5000`.

## Features

- User registration/login with JWT auth
- Browse and search movies
- Movie detail pages with ratings and descriptions
- Personal watchlist management
- Admin login, dashboard, and movie management (add/edit/delete)
- Protected routes for authenticated users and admins

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
