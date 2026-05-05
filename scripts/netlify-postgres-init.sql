-- =============================================================================
-- ЭДО Банк — инициализация PostgreSQL для Netlify / Neon / любого managed Postgres
-- =============================================================================
-- Контекст: в облаке строка DATABASE_URL уже указывает на существующую БД.
--   CREATE DATABASE здесь не выполняется (часто запрещено или не нужно).
--
-- Порядок совпадает с `node scripts/netlify-db-init.mjs` (без --erd):
--   server/init/01-schema.sql
--   server/init/02-app-dictionary-and-appeals.sql
--   server/init/03-app-event-log.sql
--   server/init/04-app-notifications-crm-attachments.sql
--   server/init/05-dict-cabinet-statuses.sql
--   server/init/05-dict-cabinet-statuses.sql
--
-- Идемпотентность: CREATE IF NOT EXISTS, INSERT … ON CONFLICT DO NOTHING.
-- При изменении init-файлов обновите этот файл или накатывайте через:
--   export DATABASE_URL='postgres://…'
--   node scripts/netlify-db-init.mjs
-- =============================================================================

-- --- server/init/01-schema.sql ------------------------------------------------

CREATE TABLE IF NOT EXISTS schema_migrations (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO schema_migrations (name) VALUES ('001_initial')
ON CONFLICT (name) DO NOTHING;

-- --- server/init/02-app-dictionary-and-appeals.sql ----------------------------

BEGIN;

CREATE SCHEMA IF NOT EXISTS app;

CREATE TABLE IF NOT EXISTS app.dict_appeal_status (
  code         TEXT PRIMARY KEY,
  label_ru     TEXT NOT NULL,
  cabinets     TEXT[] NOT NULL DEFAULT '{}'
);

INSERT INTO app.dict_appeal_status (code, label_ru, cabinets) VALUES
  ('В работе', 'В работе', ARRAY['registrar', 'responsible', 'manager']),
  ('На ответственном, не взято', 'На ответственном, не взято', ARRAY['responsible', 'manager']),
  ('На ответственном, взято', 'На ответственном, взято', ARRAY['responsible', 'manager']),
  ('На БП', 'На БП', ARRAY['responsible', 'manager']),
  ('На ПК', 'На ПК', ARRAY['secretary', 'responsible', 'manager']),
  ('На HD', 'На HD', ARRAY['responsible', 'manager']),
  ('На аудите', 'На аудите', ARRAY['audit', 'manager']),
  ('Аудит', 'Аудит', ARRAY['audit', 'manager']),
  ('Решено', 'Решено', ARRAY['manager', 'registrar'])
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS app.dict_applicant_type (
  code     TEXT PRIMARY KEY,
  label_ru TEXT NOT NULL
);

INSERT INTO app.dict_applicant_type (code, label_ru) VALUES
  ('Физ лицо', 'Физ лицо'),
  ('Юр лицо', 'Юр лицо'),
  ('Физлицо', 'Физ лицо'),
  ('Юрлицо', 'Юр лицо')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS app.dict_appeal_channel (
  code     TEXT PRIMARY KEY,
  label_ru TEXT NOT NULL
);

INSERT INTO app.dict_appeal_channel (code, label_ru) VALUES
  ('Письменное', 'Письменное'),
  ('Устное', 'Устное'),
  ('Устное обращение', 'Устное')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS app.appeal_card (
  id           TEXT PRIMARY KEY,
  status_code  TEXT NOT NULL REFERENCES app.dict_appeal_status (code) ON UPDATE CASCADE,
  data         JSONB NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_card_status ON app.appeal_card (status_code);
CREATE INDEX IF NOT EXISTS idx_appeal_card_updated ON app.appeal_card (updated_at DESC);

INSERT INTO app.appeal_card (id, status_code, data) VALUES
(
  '100001',
  'В работе',
  jsonb_build_object(
    'id', '100001',
    'regDate', to_char(now() AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'category', 'Письменное',
    'subcategory', 'Карты',
    'status', 'В работе',
    'deadline', to_char((now() + interval '12 days') AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'responsible', 'Не назначено',
    'applicantName', 'Иванов Иван Иванович',
    'organizationName', 'N/A',
    'address', 'г. Москва',
    'cbs', 'N/A',
    'type', 'Физ лицо',
    'isMine', false,
    'content', 'Демо-обращение из PostgreSQL',
    'solution', '',
    'response', '',
    'phone', '+79001234567',
    'email', 'client@example.com',
    'appealType', 'Письменное',
    'createdBy', 'seed',
    'updatedAt', to_jsonb(now() AT TIME ZONE 'utc')
  )
),
(
  '100002',
  'В работе',
  jsonb_build_object(
    'id', '100002',
    'regDate', to_char(now() AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'category', 'Письменное',
    'subcategory', 'Кредиты',
    'status', 'В работе',
    'deadline', to_char((now() + interval '10 days') AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'responsible', 'Не назначено',
    'applicantName', 'Петрова Анна Сергеевна',
    'organizationName', 'N/A',
    'address', '',
    'cbs', 'N/A',
    'type', 'Физ лицо',
    'isMine', false,
    'content', 'Второе демо-обращение (БД)',
    'solution', '',
    'response', '',
    'phone', '+79007654321',
    'email', '',
    'appealType', 'Письменное',
    'createdBy', 'seed',
    'updatedAt', to_jsonb(now() AT TIME ZONE 'utc')
  )
),
(
  'a-9',
  'На аудите',
  jsonb_build_object(
    'id', 'a-9',
    'regDate', to_char(now() AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'category', 'Письменное',
    'subcategory', 'Аудит',
    'status', 'На аудите',
    'deadline', to_char((now() + interval '5 days') AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'responsible', 'Расул Рамазанов',
    'applicantName', 'Сидоров Петр Иванович',
    'organizationName', 'N/A',
    'address', 'г. Москва',
    'cbs', 'N/A',
    'type', 'Физ лицо',
    'isMine', true,
    'content', 'Обращение на линии аудита (PostgreSQL)',
    'solution', '',
    'response', '',
    'phone', '+79161112233',
    'email', '',
    'appealType', 'Письменное',
    'createdBy', 'Регистратор',
    'updatedAt', to_jsonb(now() AT TIME ZONE 'utc')
  )
),
(
  's-1',
  'На ПК',
  jsonb_build_object(
    'id', 's-1',
    'regDate', to_char(now() AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'category', 'Устное',
    'subcategory', 'ПК',
    'status', 'На ПК',
    'deadline', to_char((now() + interval '7 days') AT TIME ZONE 'Europe/Moscow', 'DD/MM/YY'),
    'responsible', 'Не назначено',
    'applicantName', 'ООО Претензия',
    'organizationName', 'ООО Претензия',
    'address', 'г. Санкт-Петербург',
    'cbs', 'N/A',
    'type', 'Юр лицо',
    'isMine', false,
    'content', 'Очередь секретаря ПК (PostgreSQL)',
    'solution', '',
    'response', '',
    'phone', '+78121234567',
    'email', 'pk@example.com',
    'appealType', 'Устное',
    'createdBy', 'seed',
    'updatedAt', to_jsonb(now() AT TIME ZONE 'utc')
  )
)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- --- server/init/03-app-event-log.sql -----------------------------------------

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

-- --- server/init/04-app-notifications-crm-attachments.sql ---------------------

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

-- --- server/init/05-dict-cabinet-statuses.sql ---------------------------------

BEGIN;

INSERT INTO app.dict_appeal_status (code, label_ru, cabinets) VALUES
  ('Назначено', 'Назначено', ARRAY['responsible', 'manager', 'registrar']),
  ('Запрос в БП', 'Запрос в БП', ARRAY['responsible', 'manager']),
  ('Готово к подписи', 'Готово к подписи', ARRAY['responsible', 'manager']),
  ('Зарегистрировано', 'Зарегистрировано', ARRAY['registrar', 'manager', 'responsible'])
ON CONFLICT (code) DO NOTHING;

COMMIT;

-- --- server/init/05-dict-cabinet-statuses.sql ---------------------------------

BEGIN;

INSERT INTO app.dict_appeal_status (code, label_ru, cabinets) VALUES
  ('Назначено', 'Назначено', ARRAY['responsible', 'manager', 'registrar']),
  ('Запрос в БП', 'Запрос в БП', ARRAY['responsible', 'manager']),
  ('Готово к подписи', 'Готово к подписи', ARRAY['responsible', 'manager']),
  ('Зарегистрировано', 'Зарегистрировано', ARRAY['registrar', 'manager', 'responsible'])
ON CONFLICT (code) DO NOTHING;

COMMIT;
