
BEGIN;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash TEXT NOT NULL,

    role VARCHAR(30) NOT NULL DEFAULT 'observer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT users_full_name_check
        CHECK (LENGTH(TRIM(full_name)) > 0),

    CONSTRAINT users_email_check
        CHECK (
            email = LOWER(TRIM(email))
            AND LENGTH(TRIM(email)) > 0
        ),

    CONSTRAINT users_role_check
        CHECK (
            role IN ('observer', 'reviewer', 'admin')
        )
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx
ON users (LOWER(email));

CREATE INDEX IF NOT EXISTS users_role_active_idx
ON users (role, is_active);

COMMIT;
