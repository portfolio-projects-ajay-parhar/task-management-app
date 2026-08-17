# Task Manager

Monorepo for a task management app: Express + Prisma API and a Vite + React client.

```
task-management-app/
├── backend/     # Express, Prisma, PostgreSQL
├── frontend/    # React, Vite, Tailwind, React Query
└── package.json # npm workspaces
```

## Prerequisites

- Node.js 20+
- PostgreSQL (database name: `taskmanager`)

## Install

From the repo root:

```bash
npm install
```

Copy environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update `DATABASE_URL` in `backend/.env` to match your Postgres credentials.

## Database

```bash
# Create the database once (psql)
CREATE DATABASE taskmanager;

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate
```

## Develop

Run API and client together:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
```

Health check: `GET http://localhost:5000/api/health`

## Build

```bash
npm run build
```
