/**
 * Нормализация тела POST создания обращения: текст в одном из распространённых полей → `content`
 * (OpenAPI по-прежнему называет поле `content`; интеграции часто шлют `text` / `message`).
 */
export function resolveAppealCreateBody(input) {
  const body = typeof input === "object" && input !== null ? { ...input } : {}
  const pick = (v) => (typeof v === "string" && v.trim() !== "" ? v.trim() : "")
  let c = pick(body.content)
  if (!c) c = pick(body.text) || pick(body.message) || pick(body.complaintText) || pick(body.appealText)
  if (c) body.content = c
  return body
}
