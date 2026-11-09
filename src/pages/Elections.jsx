
import { useState } from "react";
import SectionLabel from "../components/SectionLabel";

const electionTypes = [
  "All elections",
  "Presidential",
  "Governorship",
  "National Assembly",
  "State Assembly",
];

const coverageLevels = [
  {
    level: "States",
    description: "State-level election records and source information.",
  },
  {
    level: "Local Government Areas",
    description: "LGA-level records, where available.",
  },
  {
    level: "Wards",
    description: "Ward records linked to their geographic sources.",
  },
  {
    level: "Polling Units",
    description: "Polling-unit records and supporting evidence.",
  },
];

function StatusBadge({ children, type = "neutral" }) {
  return (
    <span className={`election-status election-status-${type}`}>
      {children}
    </span>
  );
}

export default function Elections() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All elections");

  const filteredCoverage = coverageLevels.filter((item) =>
    item.level.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="elections-page">
      <section className="elections-hero">
        <div className="container">
          <SectionLabel>ELECTION RECORDS</SectionLabel>

          <h1>
            Explore Nigeria's <span>elections.</span>
          </h1>

          <p>
            Explore election records, understand where information comes
            from, and see what evidence is available for review.
          </p>

          <div className="elections-notice">
            <span aria-hidden="true">ⓘ</span>
            <p>
              BallotLens is under development. No election results or
              nationwide coverage figures are being presented as verified
              at this stage.
            </p>
          </div>
        </div>
      </section>

      <section className="elections-content">
        <div className="container">
          <div className="elections-section-heading">
            <div>
              <SectionLabel>EXPLORE THE RECORDS</SectionLabel>
              <h2>Find election information</h2>
              <p>
                Choose an election category or explore the geographic
                levels used to organize election evidence.
              </p>
            </div>
          </div>

          <div className="elections-filters">
            <label htmlFor="election-search">
              Search geographic levels
            </label>

            <input
              id="election-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search states, LGAs, wards..."
            />

            <label htmlFor="election-type">Election category</label>

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

          <div className="elections-grid">
            {filteredCoverage.length > 0 ? (
              filteredCoverage.map((item) => (
                <article className="election-card" key={item.level}>
                  <div className="election-card-icon" aria-hidden="true">
                    {item.level === "States"
                      ? "⌖"
                      : item.level === "Local Government Areas"
                        ? "▦"
                        : item.level === "Wards"
                          ? "◇"
                          : "◎"}
                  </div>

                  <StatusBadge type="pending">
                    Data integration pending
                  </StatusBadge>

                  <h3>{item.level}</h3>
                  <p>{item.description}</p>

                  <div className="election-card-footer">
                    <span>Records not yet displayed</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="elections-empty">
                <h3>No matching geographic levels</h3>
                <p>Try another search term.</p>
              </div>
            )}
          </div>

          <div className="election-category-note">
            <h3>Selected category: {selectedType}</h3>
            <p>
              This category selector is a frontend preview. Election
              records will appear here after we connect the database and
              establish the source register.
            </p>
          </div>
        </div>
      </section>

      <section className="elections-method-note">
        <div className="container">
          <div>
            <SectionLabel>OUR STANDARD</SectionLabel>
            <h2>Evidence before conclusions.</h2>
          </div>

          <p>
            A record being available does not automatically make it
            authentic or verified. BallotLens will document sources,
            preserve provenance, and subject significant findings to
            human review before publication.
          </p>
        </div>
      </section>
    </main>
  );
}
