# My App

This repository includes a React + Vite frontend and an Express backend. Authentication is handled with [Clerk](https://clerk.com) and data is stored in PostgreSQL.

The frontend shows a simple authentication portal and stores report inputs to the backend. The backend persists users, clients, projects, and reports.

## Setup

1. Copy `.env.example` to `.env` and fill in your Clerk keys and database connection string.
2. Install dependencies:
   ```bash
   npm install
   npm --prefix server install
   ```
3. Run the development servers:
   ```bash
   npm run server   # starts the backend on the port in .env
   npm run dev      # starts the frontend
   ```

## Deployment

The project is ready to deploy on [Railway](https://railway.app). Provision a PostgreSQL database and set the environment variables from `.env` in your Railway project.

## Backend overview

- `server/src/index.ts` – Express app with Clerk auth, user route, and report-saving endpoint.
- `server/src/db.ts` – PostgreSQL connection pool.
- `server/schema.sql` – Schema for `users`, `clients`, `projects`, and `reports` tables.

## Environment variables

Refer to `.env.example` for the required variables.
