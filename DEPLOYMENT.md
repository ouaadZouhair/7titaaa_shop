# Deployment Guide — 7titaaa shop

Two separate Vercel projects from one repo:

- **Frontend** (`client-side/`) — Vite + React static site
- **Backend** (`serveur-side/`) — Express API as a Vercel serverless function
- **Database** — Supabase (PostgreSQL)

---

## 1. Supabase: create the database

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Project Settings → Database → Connection string**.
3. Copy the **Connection pooling** URI in **Transaction** mode (host ends in
   `pooler.supabase.com`, port **6543**). This is what serverless needs:

   ```
   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres
   ```

   Replace `<password>` with your database password (URL-encode special chars).

> The app uses the standard `pg` driver against this connection string — no
> Supabase client library is required. If you later add Supabase Storage for
> image uploads, you'd add the `@supabase/supabase-js` client then.

---

## 2. Create the database tables (run once)

From your machine, point the backend at Supabase and create the schema:

```bash
cd serveur-side
cp .env.example .env          # then edit .env, set DATABASE_URL + JWT_SECRET
npm install
npm run init-db               # creates all tables, indexes, constraints
```

You should see `Database schema is ready.` You can re-run this safely; it uses
`CREATE TABLE IF NOT EXISTS`.

---

## 3. Deploy the backend (`serveur-side`)

In Vercel: **Add New → Project → import your repo**, then:

| Setting              | Value             |
| -------------------- | ----------------- |
| **Root Directory**   | `serveur-side`    |
| Framework Preset     | Other             |
| Build Command        | *(leave empty)*   |
| Output Directory     | *(leave empty)*   |

**Environment Variables** (Project Settings → Environment Variables):

| Key              | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| `DATABASE_URL`   | your Supabase pooler connection string                       |
| `JWT_SECRET`     | a long random string                                         |
| `JWT_EXPIRES_IN` | `7d`                                                         |
| `CLIENT_ORIGIN`  | your frontend URL, e.g. `https://your-frontend.vercel.app`   |
| `NODE_ENV`       | `production`                                                 |

Deploy. Test:

- `https://your-backend.vercel.app/` → `{"status":"ok","service":"7titaaa-api"}`
- `https://your-backend.vercel.app/api/health` → `{"status":"ok","db":true}`

`vercel.json` rewrites every request to the `api/index.js` function, which
exports the Express app.

---

## 4. Deploy the frontend (`client-side`)

In Vercel: **Add New → Project → import the same repo again**, then:

| Setting            | Value          |
| ------------------ | -------------- |
| **Root Directory** | `client-side`  |
| Framework Preset   | Vite           |
| Build Command      | `npm run build`|
| Output Directory   | `dist`         |

**Environment Variable:**

| Key            | Value                                       |
| -------------- | ------------------------------------------- |
| `VITE_API_URL` | `https://your-backend.vercel.app/api`       |

Deploy. `vercel.json` adds the SPA fallback so React Router deep links work.

---

## 5. Wire the two together

After both are live, make sure:

1. Backend `CLIENT_ORIGIN` = the frontend's Vercel URL (redeploy backend if you
   changed it). For multiple origins, comma-separate them:
   `https://your-frontend.vercel.app,http://localhost:5173`
2. Frontend `VITE_API_URL` = the backend's Vercel URL + `/api` (redeploy
   frontend if changed — Vite env vars are baked in at build time).

---

## Local development

```bash
# Terminal 1 — backend
cd serveur-side
cp .env.example .env   # set DATABASE_URL (can point at Supabase) + JWT_SECRET
npm install
npm run dev            # http://localhost:5000  (auto-runs init-db on boot)

# Terminal 2 — frontend
cd client-side
npm install
npm run dev            # http://localhost:5173
```

---

## Known limitation: image uploads

The `/api/uploads` route writes to local disk. Vercel's serverless filesystem
is read-only except `/tmp`, which is wiped between invocations — **uploaded
images won't persist in production.** This was intentionally left for later.

To make uploads work, switch `serveur-side/middleware/upload.js` to use
**Supabase Storage** (upload the file to a bucket, store the returned public URL
in the DB). The frontend already stores absolute URLs fine
(`resolveImageUrl` in `client-side/src/lib/uploads.js` passes through `http(s)`
URLs unchanged).
