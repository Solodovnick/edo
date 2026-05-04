import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const PORT = Number(process.env.API_PORT) || 3001;
const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://edo:edo@127.0.0.1:5432/edo";

const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  connectionTimeoutMillis: 5000,
  max: 10,
});

app.get("/api/health", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT 1 AS ok, current_database() AS db, version() AS version",
    );
    res.json({
      ok: true,
      database: "connected",
      db: rows[0].db,
      postgres: rows[0].version,
    });
  } catch (err) {
    res.status(503).json({
      ok: false,
      database: "disconnected",
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[edo-api] http://127.0.0.1:${PORT}  DATABASE_URL=${DATABASE_URL.replace(/:[^:@]+@/, ":****@")}`);
});
