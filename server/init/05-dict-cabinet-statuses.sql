-- Дополнительные статусы жизненного цикла для API и FK app.appeal_card.status_code.
-- Идемпотентно: повторный накат безопасен (ON CONFLICT DO NOTHING).

BEGIN;

INSERT INTO app.dict_appeal_status (code, label_ru, cabinets) VALUES
  ('Назначено', 'Назначено', ARRAY['responsible', 'manager', 'registrar']),
  ('Запрос в БП', 'Запрос в БП', ARRAY['responsible', 'manager']),
  ('Готово к подписи', 'Готово к подписи', ARRAY['responsible', 'manager']),
  ('Зарегистрировано', 'Зарегистрировано', ARRAY['registrar', 'manager', 'responsible'])
ON CONFLICT (code) DO NOTHING;

COMMIT;
