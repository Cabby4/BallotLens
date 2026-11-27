
import { useEffect, useMemo, useState } from "react";
import SectionLabel from "../components/SectionLabel";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

// Fictional preview data for local development only.
// These are NOT official candidates or election results.
const demoResults = [
  {
    election_id: "demo-election",
    election_name: "Presidential Election",
    election_type: "Presidential",
    election_date: "2023-02-25",
    country: "Nigeria",
    polling_unit_id: "demo-unit",
    polling_unit_code: "DEMO-001",
    polling_unit_name: "Demonstration Polling Unit",
    state_name: "Lagos",
    lga_name: "Ikeja",
    ward_name: "Demo Ward",
    candidate_id: "demo-1",
    candidate_name: "Amina Bello",
    party_name: "National Progress Party",
    party_abbreviation: "NPP",
    image_url:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85",
    votes_count: 6240,
  },
  {
    election_id: "demo-election",
    election_name: "Presidential Election",
    election_type: "Presidential",
    election_date: "2023-02-25",
    country: "Nigeria",
    polling_unit_id: "demo-unit",
    polling_unit_code: "DEMO-001",
    polling_unit_name: "Demonstration Polling Unit",
    state_name: "Lagos",
    lga_name: "Ikeja",
    ward_name: "Demo Ward",
    candidate_id: "demo-2",
    candidate_name: "Chinedu Okafor",
    party_name: "People's Reform Party",
    party_abbreviation: "PRP",
    image_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85",
    votes_count: 3270,
  },
  {
    election_id: "demo-election",
    election_name: "Presidential Election",
    election_type: "Presidential",
    election_date: "2023-02-25",
    country: "Nigeria",
    polling_unit_id: "demo-unit",
    polling_unit_code: "DEMO-001",
    polling_unit_name: "Demonstration Polling Unit",
    state_name: "Lagos",
    lga_name: "Ikeja",
    ward_name: "Demo Ward",
    candidate_id: "demo-3",
    candidate_name: "Tunde Adeyemi",
    party_name: "Citizens Alliance",
    party_abbreviation: "CA",
    image_url:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=85",
    votes_count: 490,
  },
];

function formatDate(date) {
  if (!date) return "Date not recorded";

  const parsed = new Date(`${String(date).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return "Date not recorded";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function CandidateCard({ candidate, percentage, isDemo }) {
  const [imageFailed, setImageFailed] = useState(false);

  const initials = (candidate.candidate_name || "Candidate")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className="candidate-score-card">
      <div className="candidate-score-photo">
        {candidate.image_url && !imageFailed ? (
          <img
            src={candidate.image_url}
            alt={`Illustrative portrait for ${candidate.candidate_name}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="candidate-score-placeholder">
            {initials}
          </div>
        )}
      </div>

      <div className="candidate-score-info">
        <h3>{candidate.candidate_name}</h3>

        <p className="candidate-score-party">
          {candidate.party_name || "Party not recorded"}
          {candidate.party_abbreviation
            ? ` (${candidate.party_abbreviation})`
            : ""}
        </p>

        <div className="candidate-score-percentage">
          {percentage.toFixed(2)}%
        </div>

        <div
          className="candidate-score-track"
          role="progressbar"
          aria-label={`${candidate.candidate_name} vote share`}
          aria-valuenow={Number(percentage.toFixed(2))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="candidate-score-fill"
            style={{
              width: `${Math.min(100, Math.max(0, percentage))}%`,
            }}
          />
        </div>

        <p className="candidate-score-votes">
          {Number(candidate.votes_count).toLocaleString()} votes
        </p>

        {isDemo && (
          <span className="candidate-demo-caption">
            Illustrative demo data
          </span>
        )}
      </div>
    </article>
  );
}

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadResults() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/public-results`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load election results."
          );
        }

        setResults(
          Array.isArray(data.results) ? data.results : []
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Unable to load election results."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadResults();

    return () => controller.abort();
  }, []);

  // Show demo cards only on the local development server,
  // when the API succeeds but returns no published results.
  const isDemo =
    import.meta.env.DEV &&
    !loading &&
    !error &&
    results.length === 0;

  const displayResults = isDemo ? demoResults : results;

  const pollingUnits = useMemo(() => {
    const groups = new Map();

    for (const result of displayResults) {
      const key = `${result.election_id}-${result.polling_unit_id}`;

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          electionName: result.election_name,
          electionDate: result.election_date,
          electionType: result.election_type,
          country: result.country,
          pollingUnitName: result.polling_unit_name,
          pollingUnitCode: result.polling_unit_code,
          state: result.state_name,
          lga: result.lga_name,
          ward: result.ward_name,
          candidates: [],
        });
      }

      groups.get(key).candidates.push(result);
    }

    return Array.from(groups.values()).map((group) => {
      const candidates = group.candidates
        .map((candidate) => ({
          ...candidate,
          votes_count: Math.max(
            0,
            Number(candidate.votes_count) || 0
          ),
        }))
        .sort((a, b) => b.votes_count - a.votes_count);

      const totalVotes = candidates.reduce(
        (sum, candidate) => sum + candidate.votes_count,
        0
      );

      return {
        ...group,
        totalVotes,
        candidates: candidates.map((candidate) => ({
          ...candidate,
          percentage:
            totalVotes > 0
              ? (candidate.votes_count / totalVotes) * 100
              : 0,
        })),
      };
    });
  }, [displayResults]);

  const activeUnit = pollingUnits[0];

  return (
    <main className="results-page">
      {/* Hero section */}
      <section className="results-hero">
        <div className="results-container">
          <SectionLabel>PUBLIC ELECTION DATA</SectionLabel>

          <h1>Election Results</h1>

          <p className="results-hero-subtitle">
            Transparent results. Verified evidence. Every vote matters.
          </p>

          {activeUnit && (
            <div className="results-election-meta">
              <strong>
                {activeUnit.electionType || "Election"} ·{" "}
                {activeUnit.country}
              </strong>

              <span className="results-meta-divider">|</span>

              <span>
                {isDemo ? "Demo preview" : "Published"}:{" "}
                {formatDate(activeUnit.electionDate)}
              </span>
            </div>
          )}

          <div className="results-trust-note">
            <span className="results-trust-dot" />

            {isDemo
              ? "DEMO PREVIEW — fictional candidates, portraits, and vote totals. Not official results."
              : "Only published result sheets with verified candidate results are displayed."}
          </div>

          {isDemo && (
            <div className="results-demo-banner">
              DEMO PREVIEW — NOT OFFICIAL RESULTS
            </div>
          )}
        </div>
      </section>

      {/* Results content */}
      <section className="results-content results-container">
        {loading && (
          <div className="results-state">
            <div className="results-loader" />
            <h2>Loading election results</h2>
            <p>
              Please wait while published results are retrieved.
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="results-state results-error">
            <h2>Results temporarily unavailable</h2>
            <p>{error}</p>

            <button
              type="button"
              className="results-retry-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && pollingUnits.length === 0 && (
          <div className="results-state">
            <div className="results-empty-icon">📊</div>

            <h2>Published results will appear here</h2>

            <p>
              Candidate scorecards will appear once result sheets
              have been published and their candidate results
              verified.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          pollingUnits.map((unit) => (
            <section
              className="polling-result-section"
              key={unit.key}
            >
              <div className="polling-result-heading">
                <div>
                  <span
                    className={
                      isDemo
                        ? "results-status results-status-demo"
                        : "results-status"
                    }
                  >
                    {isDemo ? "DEMO PREVIEW" : "VERIFIED RESULTS"}
                  </span>

                  <h2>{unit.electionName}</h2>

                  <p>
                    {[
                      unit.pollingUnitName,
                      unit.ward,
                      unit.lga,
                      unit.state,
                      unit.country,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  {unit.pollingUnitCode && (
                    <p className="polling-unit-code">
                      Polling unit: {unit.pollingUnitCode}
                    </p>
                  )}
                </div>

                <div className="polling-result-total">
                  <strong>
                    {unit.totalVotes.toLocaleString()}
                  </strong>

                  <span>
                    {isDemo ? "Demo votes" : "Votes recorded"}
                  </span>
                </div>
              </div>

              <div className="candidate-results-layout">
                <div className="candidate-score-grid">
                  {unit.candidates.map((candidate) => (
                    <CandidateCard
                      key={candidate.candidate_id}
                      candidate={candidate}
                      percentage={candidate.percentage}
                      isDemo={isDemo}
                    />
                  ))}
                </div>

                <aside className="results-summary-card">
                  <h3>Election Summary</h3>

                  <dl>
                    <div>
                      <dt>Election date</dt>
                      <dd>{formatDate(unit.electionDate)}</dd>
                    </div>

                    <div>
                      <dt>Coverage</dt>
                      <dd>
                        {[
                          unit.country,
                          unit.state,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "Not recorded"}
                      </dd>
                    </div>

                    <div>
                      <dt>Polling unit</dt>
                      <dd>
                        {unit.pollingUnitCode || "Not recorded"}
                      </dd>
                    </div>

                    <div>
                      <dt>Status</dt>
                      <dd>
                        <span
                          className={
                            isDemo
                              ? "results-summary-status results-summary-status-demo"
                              : "results-summary-status"
                          }
                        >
                          {isDemo ? "Demo only" : "Published"}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </aside>
              </div>

              <p className="results-method-note">
                {isDemo
                  ? "These fictional names, portraits, and vote totals exist only to preview the page design. They are not real candidates or election results."
                  : "Vote percentages are calculated from the candidate votes returned for this polling unit. They may not represent the official valid-vote percentage if candidate records are incomplete."}
              </p>
            </section>
          ))}

        {!loading &&
          !error &&
          !isDemo &&
          pollingUnits.length > 0 && (
            <div className="results-evidence-footer">
              <div>
                <strong>Transparency through evidence</strong>
                <span>
                  Published results are linked to reviewed result sheets.
                </span>
              </div>

              <span className="results-evidence-label">
                Verified publication
              </span>
            </div>
          )}
      </section>
    </main>
  );
}
