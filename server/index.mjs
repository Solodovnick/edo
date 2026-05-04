import dotenv from "dotenv"
import { createApp } from "./app.mjs"

dotenv.config()

const PORT = Number(process.env.API_PORT) || 3001
const app = createApp()

app.listen(PORT, "0.0.0.0", () => {
  const db = process.env.DATABASE_URL ? "postgres" : "memory"
  console.log(`[edo-api] http://127.0.0.1:${PORT}  mode=${db}`)
})
