-- Схема приложения: справочники (словарь) + единая таблица карточек обращений для REST.
-- Отделена от public.* из ERD (01-edo-schema.sql), чтобы UI/API работали без заполнения тяжёлых FK.

BEGIN;

CREATE SCHEMA IF NOT EXISTS app;

-- Статусы жизненного цикла (метки как в UI; code = ключ интеграции)
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

-- Карточка обращения: JSON = контракт AppealDto для фронта; status_code → словарь
CREATE TABLE IF NOT EXISTS app.appeal_card (
  id           TEXT PRIMARY KEY,
  status_code  TEXT NOT NULL REFERENCES app.dict_appeal_status (code) ON UPDATE CASCADE,
  data         JSONB NOT NULL,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appeal_card_status ON app.appeal_card (status_code);
CREATE INDEX IF NOT EXISTS idx_appeal_card_updated ON app.appeal_card (updated_at DESC);

-- Демо-данные (id текстовые, как в REST-моке)
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
