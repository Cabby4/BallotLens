
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SectionLabel from "../components/SectionLabel";

const electionTypes = [
  "All elections",
  "Presidential",
  "Governorship",
  "National Assembly",
  "State Assembly",
];

const electionRecords = [
  {
    country: "Nigeria",
    code: "NG",
    title: "National Election Coverage",
    description:
      "The initial focus for organising election information, source records, and evidence for review.",
    type: "Presidential",
    status: "Initial focus",
    statusType: "active",
    date: "Election date to be confirmed",
    featured: true,
  },
  {
    country: "Nigeria",
    code: "NG",
    title: "Governorship Elections",
    description:
      "A planned record of state-level elections, official sources, and supporting evidence.",
    type: "Governorship",
    status: "Planned",
    statusType: "pending",
    date: "Dates to be confirmed",
  },
  {
    country: "Nigeria",
    code: "NG",
    title: "National Assembly Elections",
    description:
      "A planned structure for documenting elections to the Senate and House of Representatives.",
    type: "National Assembly",
    status: "Planned",
    statusType: "pending",
    date: "Dates to be confirmed",
  },
  {
    country: "Nigeria",
    code: "NG",
    title: "State Assembly Elections",
    description:
      "A planned structure for state assembly records and their supporting sources.",
    type: "State Assembly",
    status: "Planned",
    statusType: "pending",
    date: "Dates to be confirmed",
  },
];

const coverageLevels = [
  {
    level: "Countries",
    number: "01",
    description: "Explore elections and election coverage by country.",
    icon: "◎",
  },
  {
    level: "States",
    number: "02",
    description: "Explore state-level election records and sources.",
    icon: "◇",
  },
  {
    level: "Local Government Areas",
    number: "03",
    description: "Organise election records by local government area.",
    icon: "▦",
  },
  {
    level: "Wards",
    number: "04",
    description: "Explore ward-level records and supporting evidence.",
    icon: "⌖",
  },
  {
    level: "Polling Units",
    number: "05",
    description: "Review polling-unit records, result sources, and evidence.",
    icon: "◎",
  },
];

function StatusBadge({ children, type = "neutral" }) {
  return (
    <span className={`election-status election-status-${type}`}>
      <span className="status-dot" aria-hidden="true" />
      {children}
    </span>
  );
}

export default function Elections() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All elections");

  const filteredElections = useMemo(() => {
    const query = search.trim().toLowerCase();

    return electionRecords.filter((election) => {
      const matchesSearch = [
        election.country,
        election.title,
        election.description,
        election.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);

      const matchesType =
        selectedType === "All elections" ||
        election.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [search, selectedType]);

  return (
    <main className="elections-page">
      <section className="elections-hero">
        <div className="container elections-hero-inner">
          <div className="elections-hero-copy">
            <SectionLabel>GLOBAL ELECTION MONITORING</SectionLabel>

            <h1>
              Every election.
              <br />
              <span>Evidence that matters.</span>
            </h1>

            <p>
              Explore election coverage, discover information sources,
              and follow the evidence behind electoral transparency.
            </p>

            <a href="#election-directory" className="elections-primary-btn">
              Explore elections <span aria-hidden="true">↓</span>
            </a>

            <div className="elections-hero-note">
              <span aria-hidden="true">●</span>
              Starting with Nigeria. Built for global coverage.
            </div>
          </div>

          <div className="elections-hero-visual" aria-hidden="true">
            <div className="globe-ring globe-ring-one" />
            <div className="globe-ring globe-ring-two" />

            <div className="globe-center">
              <span className="globe-symbol">◎</span>
              <span className="globe-label">GLOBAL</span>
              <span className="globe-label">PERSPECTIVE</span>
            </div>

            <div className="globe-point globe-point-one" />
            <div className="globe-point globe-point-two" />
            <div className="globe-point globe-point-three" />

            <div className="globe-caption">
              <span className="globe-caption-dot" />
              <span>Transparency without borders</span>
            </div>
          </div>
        </div>
      </section>

      <section className="elections-directory" id="election-directory">
        <div className="container">
          <div className="elections-section-heading">
            <div>
              <SectionLabel>ELECTION DIRECTORY</SectionLabel>
              <h2>Explore election coverage</h2>
              <p>
                Find election categories and see where coverage is
                planned or being developed.
              </p>
            </div>

            <div className="directory-count">
              <span>{filteredElections.length}</span>
              <span>matching records</span>
            </div>
          </div>

          <div className="elections-toolbar">
            <div className="elections-search">
              <label htmlFor="election-search">Search elections</label>
              <div className="elections-search-field">
                <span aria-hidden="true">⌕</span>
                <input
                  id="election-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search country or election..."
                />
              </div>
            </div>

            <div className="elections-type-filter">
              <label htmlFor="election-type">Election type</label>
              <select
                id="election-type"
                value={selectedType}
                onChange={(event) => setSelectedType(event.target.value)}
              >
                {electionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="elections-grid">
            {filteredElections.length > 0 ? (
              filteredElections.map((election) => (
                <article
                  className={`election-card ${
                    election.featured ? "election-card-featured" : ""
                  }`}
                  key={election.title}
                >
                  <div className="election-card-top">
                    <div className="election-country">
                      <span className="country-code">{election.code}</span>
                      <span>{election.country}</span>
                    </div>

                    <StatusBadge type={election.statusType}>
                      {election.status}
                    </StatusBadge>
                  </div>

                  <div className="election-card-body">
                    <span className="election-type-label">
                      {election.type}
                    </span>

                    <h3>{election.title}</h3>
                    <p>{election.description}</p>
                  </div>

                  <div className="election-card-footer">
                    <span>{election.date}</span>
                    <span className="election-card-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="elections-empty">
                <span aria-hidden="true">⌕</span>
                <h3>No matching elections</h3>
                <p>
                  Try another search or choose a different election type.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedType("All elections");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          <div className="elections-data-notice">
            <span className="notice-icon" aria-hidden="true">
              i
            </span>
            <div>
              <strong>Coverage is being developed</strong>
              <p>
                These cards describe planned coverage, not verified
                election records. Official sources, evidence, and
                findings will be displayed as they become available
                and pass the appropriate review.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="election-coverage">
        <div className="container">
          <div className="elections-section-heading">
            <div>
              <SectionLabel>GEOGRAPHIC COVERAGE</SectionLabel>
              <h2>From countries to polling units.</h2>
              <p>
                Follow election information through each geographic
                level, with sources and evidence linked where available.
              </p>
            </div>
          </div>

          <div className="election-coverage-grid">
            {coverageLevels.map((item) => (
              <article className="coverage-card" key={item.level}>
                <div className="coverage-card-top">
                  <span className="coverage-number">{item.number}</span>
                  <span className="coverage-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>

                <h3>{item.level}</h3>
                <p>{item.description}</p>

                <span className="coverage-status">
                  Coverage structure planned
                </span>
              </article>
            ))}
          </div>

          <div className="coverage-hierarchy">
            <span>Country</span>
            <span aria-hidden="true">→</span>
            <span>State</span>
            <span aria-hidden="true">→</span>
            <span>LGA</span>
            <span aria-hidden="true">→</span>
            <span>Ward</span>
            <span aria-hidden="true">→</span>
            <span>Polling Unit</span>
          </div>
        </div>
      </section>

      <section className="observer-submission-section">
        <div className="container">
          <div className="observer-submission-heading">
            <SectionLabel>RESULT SHEET COLLECTION</SectionLabel>
            <h2>Bring polling-unit evidence into the record.</h2>
            <p>
              BallotLens collects original result sheets, records
              their sources, and supports independent examination
              of the figures they contain.
            </p>
          </div>

          <div className="observer-submission-grid">
            <article className="observer-submission-card observer-upload-card">
              <div className="observer-submission-icon">
                <span aria-hidden="true">↑</span>
              </div>

              <span className="observer-card-label">
                FOR ELECTION POLLING-UNIT AGENTS
              </span>

              <h3>Submit a result sheet</h3>

              <p>
                Register or log in to access the agent portal and
                submit a polling-unit result sheet for independent
                review. Each submission must identify the election
                and polling-unit location.
              </p>

              <ul>
                <li>Original result sheet or scan</li>
                <li>Election and polling-unit details</li>
                <li>Manual review before publication</li>
              </ul>

              <div className="observer-access-actions">
                <p>
                  New to BallotLens? Create an account. Already
                  registered? Log in to your agent account.
                </p>

                <div className="observer-auth-buttons">
                  <Link
                    to="/observer/signup"
                    className="observer-signup-button"
                  >
                    Sign Up as an Agent
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link
                    to="/observer/login"
                    className="observer-login-button"
                  >
                    Log In
                  </Link>
                </div>

                <span className="observer-approval-note">
                  Upload access is available only after your account
                  has been reviewed and approved.
                </span>
              </div>
            </article>

            <article className="observer-submission-card observer-tip-card">
              <div className="observer-submission-icon">
                <span aria-hidden="true">!</span>
              </div>

              <span className="observer-card-label">
                FOR THE PUBLIC
              </span>

              <h3>Share election information</h3>

              <p>
                Have information about a polling unit, a missing
                result sheet, or a possible discrepancy? Public
                tips will follow a separate reporting and review
                process.
              </p>

              <ul>
                <li>Report potential discrepancies</li>
                <li>Provide supporting information</li>
                <li>Protect sensitive personal information</li>
              </ul>

              <div className="observer-tip-notice">
                Public tips are leads for investigation, not
                verified election results.
              </div>
            </article>
          </div>

          <div className="observer-review-flow">
            <div className="observer-review-title">
              <span>THE REVIEW PROCESS</span>
              <h3>Every document has a clear trail.</h3>
            </div>

            <div className="observer-review-steps">
              <div>
                <span>01</span>
                <strong>Submission</strong>
                <p>Receive the original result sheet.</p>
              </div>

              <div>
                <span>02</span>
                <strong>Manual entry</strong>
                <p>Record vote totals from the document.</p>
              </div>

              <div>
                <span>03</span>
                <strong>Verification</strong>
                <p>Check figures, sources, and discrepancies.</p>
              </div>

              <div>
                <span>04</span>
                <strong>Publication</strong>
                <p>Publish approved records with their status.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="elections-principles">
        <div className="container elections-principles-inner">
          <div>
            <SectionLabel>OUR COMMITMENT</SectionLabel>
            <h2>Evidence before conclusions.</h2>
          </div>

          <p>
            We aim to make election information easier to examine.
            Sources will be documented, evidence assessed, and
            significant findings reviewed before publication.
          </p>

          <Link to="/methodology" className="elections-method-link">
            Explore our methodology <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
