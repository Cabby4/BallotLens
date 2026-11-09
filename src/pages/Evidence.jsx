
import { useMemo, useState } from "react";
import SectionLabel from "../components/SectionLabel";

const demoEvidence = [
  {
    id: "DEMO-001",
    title: "Polling unit result sheet",
    election: "Presidential election",
    location: "Location not assigned",
    evidenceType: "Result document",
    status: "Awaiting review",
    description:
      "Demonstration record showing how a result document may be catalogued before its source and authenticity are assessed.",
  },
  {
    id: "DEMO-002",
    title: "Accreditation data record",
    election: "Presidential election",
    location: "Location not assigned",
    evidenceType: "Accreditation data",
    status: "Awaiting review",
    description:
      "Demonstration record for organizing accreditation information and recording its provenance.",
  },
  {
    id: "DEMO-003",
    title: "Election record source reference",
    election: "Election record not assigned",
    location: "Location not assigned",
    evidenceType: "Source reference",
    status: "Source details needed",
    description:
      "Demonstration record showing where a source URL, access route, permission status, and collection date will be documented.",
  },
];

const statusOptions = [
  "All statuses",
  "Awaiting review",
  "Source details needed",
];

const evidenceTypes = [
  "All types",
  "Result document",
  "Accreditation data",
  "Source reference",
];

function EvidenceStatus({ status }) {
  const statusClass =
    status === "Awaiting review" ? "awaiting" : "needs-source";

  return (
    <span className={`evidence-status ${statusClass}`}>
      <span aria-hidden="true">●</span>
      {status}
    </span>
  );
}

export default function Evidence() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [typeFilter, setTypeFilter] = useState("All types");

  const filteredEvidence = useMemo(() => {
    const term = search.trim().toLowerCase();

    return demoEvidence.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.id,
          record.title,
          record.election,
          record.location,
          record.evidenceType,
          record.description,
        ].some((value) => value.toLowerCase().includes(term));

      const matchesStatus =
        statusFilter === "All statuses" ||
        record.status === statusFilter;

      const matchesType =
        typeFilter === "All types" ||
        record.evidenceType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("All statuses");
    setTypeFilter("All types");
  }

  return (
    <main className="evidence-page">
      <section className="evidence-hero">
        <div className="container">
          <SectionLabel>EVIDENCE EXPLORER</SectionLabel>

          <h1>
            Every finding starts with <span>evidence.</span>
          </h1>

          <p>
            Explore how election documents, source references, and
            supporting records can be organized, assessed, and reviewed.
          </p>

          <div className="evidence-disclaimer">
            <span aria-hidden="true">ⓘ</span>
            <div>
              <strong>Demonstration mode</strong>
              <p>
                Every record shown on this page is illustrative interface
                content. These are not actual election records or verified
                findings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="evidence-content">
        <div className="container">
          <div className="evidence-heading">
            <div>
              <SectionLabel>RECORD CATALOGUE</SectionLabel>
              <h2>Explore evidence records</h2>
              <p>
                Search the demonstration catalogue or filter records by
                type and review status.
              </p>
            </div>

            <div className="evidence-count" aria-live="polite">
              <strong>{filteredEvidence.length}</strong>
              <span>
                {filteredEvidence.length === 1
                  ? "record displayed"
                  : "records displayed"}
              </span>
            </div>
          </div>

          <div className="evidence-filters">
            <div className="evidence-search-field">
              <label htmlFor="evidence-search">Search records</label>
              <input
                id="evidence-search"
                type="search"
                placeholder="Search title, ID, election..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div>
              <label htmlFor="evidence-type">Evidence type</label>
              <select
                id="evidence-type"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                {evidenceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="evidence-status">Review status</label>
              <select
                id="evidence-status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="evidence-clear-button"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="evidence-record-list">
            {filteredEvidence.length > 0 ? (
              filteredEvidence.map((record) => (
                <article className="evidence-record" key={record.id}>
                  <div className="evidence-record-icon" aria-hidden="true">
                    {record.evidenceType === "Result document"
                      ? "▤"
                      : record.evidenceType === "Accreditation data"
                        ? "▦"
                        : "⌁"}
                  </div>

                  <div className="evidence-record-main">
                    <div className="evidence-record-meta">
                      <span>{record.id}</span>
                      <EvidenceStatus status={record.status} />
                    </div>

                    <h3>{record.title}</h3>
                    <p>{record.description}</p>

                    <div className="evidence-record-details">
                      <span>
                        <strong>Election:</strong> {record.election}
                      </span>
                      <span>
                        <strong>Location:</strong> {record.location}
                      </span>
                      <span>
                        <strong>Type:</strong> {record.evidenceType}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="evidence-empty">
                <h3>No matching records</h3>
                <p>
                  Try a different search term or change your filters.
                </p>
                <button
                  className="evidence-clear-button"
                  type="button"
                  onClick={clearFilters}
                >
                  Reset search
                </button>
              </div>
            )}
          </div>

          <p className="evidence-demo-footnote">
            These demonstration records are stored in the frontend only.
            They are not submitted evidence, and their statuses do not
            represent actual verification decisions.
          </p>
        </div>
      </section>

      <section className="evidence-process">
        <div className="container">
          <SectionLabel>HOW REVIEW WILL WORK</SectionLabel>
          <h2>From source to reviewed finding</h2>

          <div className="evidence-process-grid">
            <article>
              <span>01</span>
              <h3>Record the source</h3>
              <p>
                Document where a record came from, how it was obtained,
                and any applicable reuse restrictions.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Assess the evidence</h3>
              <p>
                Examine authenticity, provenance, relevance,
                completeness, and corroborating material.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Review before publication</h3>
              <p>
                Route significant or uncertain findings for human review,
                with corrections and appeals handled transparently.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
