-- Уведомления, CRM-клиенты, заявки на загрузку вложений (демо API / Netlify Postgres).

BEGIN;

CREATE TABLE IF NOT EXISTS app.notification (
  id          TEXT PRIMARY KEY,
  user_sub    TEXT NOT NULL DEFAULT 'default',
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_user_read ON app.notification (user_sub, read, created_at DESC);

CREATE TABLE IF NOT EXISTS app.crm_client (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  inn         TEXT NOT NULL DEFAULT '',
  phone       TEXT NOT NULL DEFAULT '',
  type        TEXT NOT NULL DEFAULT 'individual',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_client_name_lower ON app.crm_client (lower(name));
CREATE INDEX IF NOT EXISTS idx_crm_client_inn ON app.crm_client (inn);

CREATE TABLE IF NOT EXISTS app.attachment_prepare (
  id          TEXT PRIMARY KEY,
  appeal_id   TEXT NOT NULL REFERENCES app.appeal_card (id) ON DELETE CASCADE,
  file_name   TEXT,
  mime_type   TEXT,
  byte_size   BIGINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app.crm_client (id, name, inn, phone, type) VALUES
  ('c-1', 'Иванов Иван Иванович', '', '+79001234567', 'individual'),
  ('c-2', 'ООО "Ромашка"', '7707083893', '+74951234567', 'organization'),
  ('c-3', 'Петров Пётр Петрович', '7701234567', '+79009999999', 'individual')
ON CONFLICT (id) DO NOTHING;

INSERT INTO app.notification (id, user_sub, type, title, read) VALUES
  ('n-seed-1', 'default', 'new_written_appeal', 'Новое письменное обращение', FALSE)
ON CONFLICT (id) DO NOTHING;

COMMIT;
