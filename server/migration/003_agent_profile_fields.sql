
-- BallotLens: add agent profile fields
-- Preserve existing users and their records.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS organisation_name VARCHAR(200);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(30);


