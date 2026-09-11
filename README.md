# Ezin Zahan Spare Parts (Fullstack)

Automobile Spare Parts Trading Web Application with React/Vite Frontend and Express/MongoDB Backend.

## Project Structure

```text
automobile/
├── automobile/           # Frontend React + Vite application
│   ├── src/              # React components, pages, and assets
│   └── package.json
├── backend/              # Node.js + Express API
│   ├── src/              # Routes, controllers, models, config
│   ├── server.js         # Server entry point
│   └── package.json
└── .gitignore            # Root ignore rules for node_modules, .env, dist
```

## Getting Started

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env is configured with PORT, MONGO_URI, and Cloudinary keys
npm run dev
```

### 2. Frontend Setup
```bash
cd automobile
npm install
npm run dev
```
