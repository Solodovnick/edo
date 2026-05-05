#!/usr/bin/env node
/**
 * Накатывает SQL из server/init/ на удалённую PostgreSQL (Neon, Supabase, RDS и т.д.)
 * для деплоя на Netlify: задайте тот же DATABASE_URL, что в Netlify → Environment variables.
 *
 * Один файл для SQL Editor (Neon / Netlify DB): `scripts/netlify-postgres-init.sql`
 * (дублирует минимальный накат ниже — при смене server/init обновляйте и его).
 *
 * Использование (из корня репозитория):
 *   export DATABASE_URL='postgres://...'
 *   export PGSSL_REJECT_UNAUTHORIZED=0   # при необходимости для облачного TLS
 *   node scripts/netlify-db-init.mjs
 *
 * Полная ERD-схема public.* (опционально, повторный запуск может упасть на ENUM):
 *   node scripts/netlify-db-init.mjs --erd
 *
 * Только показать порядок файлов:
 *   node scripts/netlify-db-init.mjs --dry-run
 */
import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import pg from "pg"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "..")
const initDir = path.join(repoRoot, "server", "init")

dotenv.config({ path: path.join(repoRoot, ".env") })

const args = new Set(process.argv.slice(2))
const dry = args.has("--dry-run") || args.has("-n")
const withErd = args.has("--erd")

const FILES_MINIMAL = [
  "01-schema.sql",
  "02-app-dictionary-and-appeals.sql",
  "03-app-event-log.sql",
  "04-app-notifications-crm-attachments.sql",
  "05-dict-cabinet-statuses.sql",
  "06-app-users-and-roles.sql",
]

const FILES_WITH_ERD = ["01-schema.sql", "01-edo-schema.sql", ...FILES_MINIMAL.slice(1)]

function usage() {
  console.error(`Usage: node scripts/netlify-db-init.mjs [--erd] [--dry-run]
  DATABASE_URL   обязательна (или в .env в корне репозитория)
  PGSSL_REJECT_UNAUTHORIZED=0  при ошибках TLS к облачному Postgres (как в Netlify)`)
}

function poolConfig() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    usage()
    console.error("\nОшибка: не задана переменная DATABASE_URL.")
    process.exit(1)
  }
  /** @type {import('pg').PoolConfig} */
  const cfg = {
    connectionString,
    connectionTimeoutMillis: 15_000,
    max: 1,
  }
  if (process.env.PGSSL_REJECT_UNAUTHORIZED === "0") {
    cfg.ssl = { rejectUnauthorized: false }
  }
  return cfg
}

async function main() {
  const files = withErd ? FILES_WITH_ERD : FILES_MINIMAL

  if (args.has("--help") || args.has("-h")) {
    usage()
    process.exit(0)
  }

  if (dry) {
    console.log("Порядок наката (dry-run):")
    for (const f of files) console.log(`  - server/init/${f}`)
    console.log("\nСкопируйте DATABASE_URL в Netlify → Site configuration → Environment variables.")
    process.exit(0)
  }

  for (const name of files) {
    const fp = path.join(initDir, name)
    if (!fs.existsSync(fp)) {
      console.error(`Файл не найден: ${fp}`)
      process.exit(1)
    }
  }

  const pool = new pg.Pool(poolConfig())
  try {
    const { rows } = await pool.query("SELECT current_database() AS db, current_user AS user")
    console.log(`Подключено: db=${rows[0].db} user=${rows[0].user}`)

    for (const name of files) {
      const fp = path.join(initDir, name)
      const sql = fs.readFileSync(fp, "utf8")
      console.log(`\n==> ${name}`)
      await pool.query(sql)
      console.log(`    OK`)
    }

    console.log("\nГотово. В Netlify задайте тот же DATABASE_URL (и при необходимости PGSSL_REJECT_UNAUTHORIZED=0).")
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error("\nОшибка SQL:", msg)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

await main()
