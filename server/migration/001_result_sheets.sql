
BEGIN;

CREATE TABLE IF NOT EXISTS result_sheets (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    election_id BIGINT NOT NULL REFERENCES elections(id),
    polling_unit_id BIGINT NOT NULL REFERENCES polling_units(id),
    storage_key TEXT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'submitted',
    accredited_voters BIGINT CHECK (accredited_voters IS NULL OR accredited_voters >= 0),
    total_votes_cast BIGINT CHECK (total_votes_cast IS NULL OR total_votes_cast >= 0),
    valid_votes BIGINT CHECK (valid_votes IS NULL OR valid_votes >= 0),
    rejected_votes BIGINT CHECK (rejected_votes IS NULL OR rejected_votes >= 0),
    reviewer_notes TEXT,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    CONSTRAINT result_sheets_status_check
        CHECK (status IN (
            'submitted', 'under_review', 'verified',
            'disputed', 'rejected', 'published'
        )),
    CONSTRAINT result_sheets_votes_check
        CHECK (
            valid_votes IS NULL
            OR rejected_votes IS NULL
            OR total_votes_cast IS NULL
            OR total_votes_cast >= valid_votes + rejected_votes
        )
);

CREATE UNIQUE INDEX IF NOT EXISTS one_published_sheet_per_polling_unit
ON result_sheets (election_id, polling_unit_id)
WHERE status = 'published';

ALTER TABLE candidate_results
ADD COLUMN IF NOT EXISTS result_sheet_id BIGINT;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'candidate_results_result_sheet_fk'
          AND conrelid = 'candidate_results'::regclass
    ) THEN
        ALTER TABLE candidate_results
        ADD CONSTRAINT candidate_results_result_sheet_fk
        FOREIGN KEY (result_sheet_id)
        REFERENCES result_sheets(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_result_sheets_election_status
ON result_sheets (election_id, status);

CREATE INDEX IF NOT EXISTS idx_polling_units_geography
ON polling_units (election_id, state_name, lga_name, ward_name);

COMMIT;
