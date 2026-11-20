# Task Manager

A lightweight task board with Pending, Ongoing, and Completed columns. Tasks are stored in MongoDB Atlas.

## Deploy on Vercel

1. Import this GitHub repository in Vercel and keep the project root at the repository root.
2. In Vercel project settings, add `MONGODB_URI` with your MongoDB Atlas connection string. Add `MONGODB_DB` only if you want a database name other than `task_manager`.
3. In MongoDB Atlas, allow network access from Vercel (for a simple setup, Atlas' IP access list can allow access from anywhere; use a dedicated database user with a strong password).
4. Deploy or redeploy the project.

The `api/` directory contains Vercel serverless API functions. `index.html`, `app.js`, and `style.css` are served as static files from the repository root. Do not commit the Atlas connection string.

## Run locally

```sh
npm install
```

Set `MONGODB_URI` in your shell, then run a local Vercel development server with `npx vercel dev` after linking the project. The API functions are designed for Vercel's runtime.
