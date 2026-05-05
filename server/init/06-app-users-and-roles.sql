-- Роли и учётные записи (демо) для API / кабинетов. Идемпотентно: CREATE IF NOT EXISTS, ON CONFLICT DO NOTHING.

BEGIN;

CREATE TABLE IF NOT EXISTS app.dict_role (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO app.dict_role (code, name, description) VALUES
  ('REGISTRAR',    'Регистратор',              'Регистрирует входящие обращения'),
  ('RESPONSIBLE',  'Ответственный специалист', 'Обрабатывает и решает обращения'),
  ('AUDITOR',      'Аудитор',                  'Проводит аудит решений'),
  ('MANAGER',      'Руководитель',             'Назначает и контролирует обращения'),
  ('ADMIN',        'Администратор',            'Управляет системой и пользователями')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS app.user_account (
  id            SERIAL PRIMARY KEY,
  login         VARCHAR(50) UNIQUE NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(150) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  department    VARCHAR(100),
  position      VARCHAR(100),
  role_code     VARCHAR(50) REFERENCES app.dict_role (code),
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app.user_account (login, full_name, email, phone, department, position, role_code) VALUES
  ('reg.ivanova',    'Иванова Марина Александровна',  'ivanova.m@edo-bank.ru',    '+7(495)100-01-01', 'ДУКО / Отдел регистрации', 'Специалист по регистрации обращений', 'REGISTRAR'),
  ('reg.petrov',     'Петров Дмитрий Сергеевич',      'petrov.d@edo-bank.ru',     '+7(495)100-01-02', 'ДУКО / Отдел регистрации', 'Специалист по регистрации обращений', 'REGISTRAR'),
  ('reg.sidorova',   'Сидорова Ольга Николаевна',     'sidorova.o@edo-bank.ru',   '+7(495)100-01-03', 'ДУКО / Отдел регистрации', 'Старший специалист по регистрации',   'REGISTRAR'),
  ('reg.kuznetsov',  'Кузнецов Андрей Викторович',    'kuznetsov.a@edo-bank.ru',  '+7(495)100-01-04', 'ДУКО / Отдел регистрации', 'Специалист по регистрации обращений', 'REGISTRAR'),
  ('reg.morozova',   'Морозова Татьяна Юрьевна',      'morozova.t@edo-bank.ru',   '+7(495)100-01-05', 'ДУКО / Отдел регистрации', 'Специалист по регистрации обращений', 'REGISTRAR')
ON CONFLICT (login) DO NOTHING;

COMMIT;
