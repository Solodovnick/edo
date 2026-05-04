/**
 * Netlify Function: тот же Express API, что и `server/index.mjs`, с доступом к PostgreSQL через `DATABASE_URL`.
 * Rewrite `/api/*` → `/.netlify/functions/api/:splat`; здесь путь снова приводится к `/api/...` для роутера.
 */
import express from "express"
import dotenv from "dotenv"
import serverless from "serverless-http"
import { createApp } from "../../server/app.mjs"

dotenv.config()

const FN_PREFIX = "/.netlify/functions/api"
const inner = createApp()
const app = express()

app.use((req, _res, next) => {
  const u = req.url ?? ""
  if (typeof u === "string" && u.startsWith(FN_PREFIX)) {
    const rest = u.slice(FN_PREFIX.length) || "/"
    req.url = "/api" + (rest.startsWith("/") ? rest : `/${rest}`)
  }
  next()
})

app.use(inner)

export const handler = serverless(app)
