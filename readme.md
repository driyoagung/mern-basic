# 📚 Simple MERN Stack CRUD App

A beginner-friendly CRUD application built with the MERN Stack (MongoDB, Express, React, Node.js). This project is intended as a learning resource to understand how the full-stack JavaScript ecosystem works together.

---

## 🛠 Tech Stack

### Frontend

| Package            | Purpose                   |
| ------------------ | ------------------------- |
| `react`            | UI library                |
| `react-dom`        | DOM rendering             |
| `react-router-dom` | Client-side routing       |
| `axios`            | HTTP requests to API      |
| `tailwindcss`      | Utility-first CSS styling |

### Backend

| Package    | Purpose                             |
| ---------- | ----------------------------------- |
| `express`  | Node.js web framework               |
| `mongoose` | MongoDB ODM                         |
| `dotenv`   | Environment variable management     |
| `cors`     | Cross-Origin Resource Sharing       |
| `nodemon`  | Auto-restart server on file changes |

---

## 📁 Project Structure

```
mern-basic/
├── backend/                    # Express Backend
│   ├── config/                 # Database config
│   ├── controllers/            # Route handler logic
│   ├── middlewares/            # Express middlewares
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── src/                    # Additional source files
│   ├── .env                    # Environment variables (not committed)
│   ├── .env.example            # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Express server entry point
│
├── frontend/                   # React Frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/                    # React source files
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── readme.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository

```bash
git clone git@github.com:driyoagung/mern-basic.git
cd mern-basic
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the server:

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/api/items`     | Get all items        |
| POST   | `/api/items`     | Create a new item    |
| PUT    | `/api/items/:id` | Update an item by ID |
| DELETE | `/api/items/:id` | Delete an item by ID |

> You can test these endpoints using [Postman](https://www.postman.com/).

---

## 📋 Learning Roadmap

- [x] **Part 1** — Project folder structure
- [x] **Part 2** — Install dependencies (Frontend & Backend)
- [ ] **Part 3** — Full Backend
  - [ ] Setup Express server
  - [ ] Connect MongoDB with `.env`
  - [ ] Create Mongoose Model
  - [ ] Build Routes & Controllers (GET, POST, PUT, DELETE)
  - [ ] Test with Postman
- [ ] **Part 4** — Full Frontend
  - [ ] Setup React Router + component structure
  - [ ] Build CRUD pages (Create, List, Update, Delete)
  - [ ] Connect to API using Axios

---

## 📝 Notes

This is a personal learning project. The goal is to understand how each piece of the MERN stack connects:

- **MongoDB** stores the data
- **Express** handles the API routes
- **React** renders the UI
- **Node.js** runs the backend server

---

## 📄 License

This project is open source and available for anyone learning the MERN stack.