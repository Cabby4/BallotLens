
CREATE TABLE IF NOT EXISTS elections (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    election_type VARCHAR(100) NOT NULL,
    election_date DATE,
    country VARCHAR(100) NOT NULL DEFAULT 'Nigeria',
    status VARCHAR(30) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT elections_status_check
        CHECK (
            status IN (
                'planned',
                'ongoing',
                'completed',
                'archived'
            )
        )
);

CREATE TABLE IF NOT EXISTS political_parties (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(200) NOT NULL UNIQUE,
    abbreviation VARCHAR(30) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS candidates (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    election_id BIGINT NOT NULL
        REFERENCES elections(id),
    party_id BIGINT
        REFERENCES political_parties(id),
    full_name VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (election_id, full_name)
);

CREATE TABLE IF NOT EXISTS polling_units (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    election_id BIGINT NOT NULL
        REFERENCES elections(id),
    polling_unit_code VARCHAR(100),
    state_name VARCHAR(100) NOT NULL,
    lga_name VARCHAR(100),
    ward_name VARCHAR(100),
    polling_unit_name VARCHAR(250) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT polling_unit_latitude_check
        CHECK (latitude IS NULL OR latitude BETWEEN -90 AND 90),

    CONSTRAINT polling_unit_longitude_check
        CHECK (longitude IS NULL OR longitude BETWEEN -180 AND 180)
);

CREATE TABLE IF NOT EXISTS candidate_results (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    candidate_id BIGINT NOT NULL
        REFERENCES candidates(id),
    polling_unit_id BIGINT NOT NULL
        REFERENCES polling_units(id),
    votes_count BIGINT NOT NULL CHECK (votes_count >= 0),
    source_description TEXT,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT candidate_result_verification_check
        CHECK (
            verification_status IN (
                'pending',
                'under_review',
                'verified',
                'disputed',
                'rejected'
            )
        ),

    UNIQUE (candidate_id, polling_unit_id)
);
