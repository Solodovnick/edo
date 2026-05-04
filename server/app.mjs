import express from "express"
import cors from "cors"
import pg from "pg"
import { createEdoApiRouter } from "./edoApiRouter.mjs"

let pool = null

function getPool() {
  const url = process.env.DATABASE_URL
  if (!url) return null
  if (!pool) {
    const isLambda = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
    /** Облачный Postgres (Neon/Supabase и т.п.): при необходимости задайте в Netlify `PGSSL_REJECT_UNAUTHORIZED=0`. */
    const ssl =
      process.env.PGSSL_REJECT_UNAUTHORIZED === "0"
        ? { rejectUnauthorized: false }
        : undefined
    pool = new pg.Pool({
      connectionString: url,
      connectionTimeoutMillis: 5000,
      max: isLambda ? 2 : 10,
      ...(ssl ? { ssl } : {}),
    })
  }
  return pool
}

export function createApp() {
  const app = express()
  app.disable("x-powered-by")
  app.use(cors({ origin: true }))
  app.use(express.json({ limit: "2mb" }))

  app.get("/api/health", async (_req, res) => {
    const p = getPool()
    if (!p) {
      return res.json({
        ok: true,
        database: "connected",
        db: "memory",
        postgres: "not-configured",
      })
    }
    try {
      const { rows } = await p.query(
        "SELECT 1 AS ok, current_database() AS db, version() AS version",
      )
      return res.json({
        ok: true,
        database: "connected",
        db: rows[0].db,
        postgres: rows[0].version,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      const code = err && typeof err === "object" && "code" in err ? String(err.code) : undefined
      console.error("[edo-api] /api/health postgres failed", { code, message })
      return res.status(503).json({
        ok: false,
        database: "disconnected",
        error: message,
        ...(code ? { errorCode: code } : {}),
      })
    }
  })

  app.use("/api", createEdoApiRouter(getPool))

  app.use((err, req, res, next) => {
    if (!req.path?.startsWith("/api")) {
      next(err)
      return
    }
    console.error("[edo-api]", err)
    res.status(500).json({
      type: "https://edo-bank.example/problems/INTERNAL",
      title: "Внутренняя ошибка API",
      status: 500,
      detail: err instanceof Error ? err.message : String(err),
    })
  })

  return app
}
