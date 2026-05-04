-- V1: Database schema (docs/er-diagram.md v1.2.0)
CREATE TABLE IF NOT EXISTS appeal_statuses (
    code VARCHAR(80) PRIMARY KEY,
    name_ru VARCHAR(100) NOT NULL,
    sort_order INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS appeals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(30) UNIQUE NOT NULL,
    reg_date DATE NOT NULL,
    deadline DATE NOT NULL,
    appeal_type VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100),
    status VARCHAR(80) NOT NULL DEFAULT 'Зарегистрировано',
    applicant_category VARCHAR(30) NOT NULL,
    applicant_name VARCHAR(300),
    organization_name VARCHAR(300),
    address VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(200),
    cbs VARCHAR(300),
    appeal_category VARCHAR(100),
    appeal_subcategory VARCHAR(100),
    content TEXT NOT NULL,
    solution TEXT,
    response TEXT,
    responsible VARCHAR(200),
    registrar VARCHAR(200),
    created_by VARCHAR(200),
    audit_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'Средний',
    requires_attention BOOLEAN NOT NULL DEFAULT FALSE,
    requires_signature BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER appeals_updated_at BEFORE UPDATE ON appeals FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS attachments (id BIGSERIAL PRIMARY KEY, appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE, name VARCHAR(500) NOT NULL, attach_date VARCHAR(20), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS crm_comments (id BIGSERIAL PRIMARY KEY, appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE, author VARCHAR(200) NOT NULL, comment_date VARCHAR(50), text TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE IF NOT EXISTS history_entries (id BIGSERIAL PRIMARY KEY, appeal_id UUID NOT NULL REFERENCES appeals(id) ON DELETE CASCADE, related_number VARCHAR(30), related_date VARCHAR(20), related_status VARCHAR(100));

CREATE INDEX IF NOT EXISTS idx_appeals_status ON appeals(status);
CREATE INDEX IF NOT EXISTS idx_appeals_reg_date ON appeals(reg_date DESC);
CREATE INDEX IF NOT EXISTS idx_appeals_number ON appeals(number);
