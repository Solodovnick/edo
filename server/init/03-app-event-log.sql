-- Журнал событий по обращению (аудит действий API: назначение, решение ПК, аудит).
BEGIN;

CREATE TABLE IF NOT EXISTS app.event_log (
  id         BIGSERIAL PRIMARY KEY,
  appeal_id  TEXT NOT NULL REFERENCES app.appeal_card (id) ON DELETE CASCADE,
  actor      TEXT NOT NULL DEFAULT 'api',
  action     TEXT NOT NULL,
  details    JSONB,
  at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_log_appeal_at ON app.event_log (appeal_id, at DESC);

COMMIT;
