// Vercel serverless entry point. Vercel wraps this Express app as a function;
// no app.listen() here. Routing to this file is handled by vercel.json.
//
// Schema creation is NOT run per-request (that would add latency to every cold
// start and can't run concurrently safely). Run `npm run init-db` once against
// your Supabase database before/after deploying instead.
import app from "../app.js";

export default app;
