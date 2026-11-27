
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/admin-dashboard.css";
import "../styles/admin-result-sheets.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/$/, "");

export default function AdminResultSheets() {
  const navigate = useNavigate();

  const [sheets, setSheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const loadSheets = useCallback(async () => {
    const token = localStorage.getItem("ballotLensToken");
    const savedUser = localStorage.getItem("ballotLensUser");

    if (!token || !savedUser) {
      navigate("/admin/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(savedUser);

      if (user.role !== "admin") {
        navigate("/observer/login", { replace: true });
        return;
      }

      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/result-sheets/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("ballotLensToken");
        localStorage.removeItem("ballotLensUser");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load result-sheet submissions."
        );
      }

      setSheets(
        data.resultSheets || data.sheets || data.results || []
      );
    } catch (err) {
      setError(err.message || "Unable to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  const reviewResultSheet = async (
    sheetId,
    status,
    reviewerNotes = ""
  ) => {
    const token = localStorage.getItem("ballotLensToken");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    setReviewingId(sheetId);
    setActionError("");
    setActionSuccess("");

    try {
      const response = await fetch(
        `${API_URL}/result-sheets/admin/${sheetId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            reviewer_notes: reviewerNotes.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("ballotLensToken");
        localStorage.removeItem("ballotLensUser");
        navigate("/admin/login", { replace: true });
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to review this result sheet."
        );
      }

      setActionSuccess(
        data.message ||
          `Result sheet ${status} successfully.`
      );

      await loadSheets();
    } catch (err) {
      setActionError(
        err.message || "Something went wrong while reviewing."
      );
    } finally {
      setReviewingId(null);
    }
  };

  const handleApprove = (sheet) => {
    const confirmed = window.confirm(
      `Approve result sheet #${sheet.id}?\n\nOnly approve after the evidence has been properly inspected and verified.`
    );

    if (!confirmed) return;

    const notes = window.prompt(
      "Enter review notes (optional):",
      "Evidence reviewed by administrator."
    );

    if (notes === null) return;

    reviewResultSheet(sheet.id, "approved", notes);
  };

  const handleReject = (sheet) => {
    const reason = window.prompt(
      `Enter the reason for rejecting result sheet #${sheet.id}:`
    );

    if (reason === null) return;

    if (!reason.trim()) {
      setActionError(
        "A rejection reason is required before rejecting a result sheet."
      );
      return;
    }

    const confirmed = window.confirm(
      `Reject result sheet #${sheet.id}?\n\nReason: ${reason.trim()}`
    );

    if (!confirmed) return;

    reviewResultSheet(sheet.id, "rejected", reason.trim());
  };

  const filteredSheets =
    filter === "all"
      ? sheets
      : sheets.filter(
          (sheet) =>
            String(sheet.status || "").toLowerCase() === filter
        );

  const statusClass = (status) =>
    `admin-sheet-status status-${String(status || "unknown")
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")}`;

  const canReview = (status) =>
    ["submitted", "pending", "under_review"].includes(
      String(status || "").toLowerCase()
    );

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link to="/admin/dashboard" className="admin-brand">
          <span className="admin-brand-icon">B</span>
          <span>
            <strong>BallotLens</strong>
            <small>ADMINISTRATION</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">WORKSPACE</div>

        <nav className="admin-navigation">
          <Link to="/admin/dashboard" className="admin-nav-link">
            <span>▦</span> Dashboard
          </Link>

          <Link to="/admin/agents" className="admin-nav-link">
            <span>♙</span> Agents
          </Link>

          <Link
            to="/admin/result-sheets"
            className="admin-nav-link active"
          >
            <span>▤</span> Result Sheets
          </Link>

          <Link to="/admin/elections" className="admin-nav-link">
            <span>◉</span> Elections
          </Link>

          <Link
            to="/admin/polling-units"
            className="admin-nav-link"
          >
            <span>⌖</span> Polling Units
          </Link>

          <Link
            to="/admin/candidates"
            className="admin-nav-link"
          >
            <span>♧</span> Candidates & Parties
          </Link>

          <Link to="/admin/results" className="admin-nav-link">
            <span>▥</span> Published Results
          </Link>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-eyebrow">
              BALLOTLENS CONTROL CENTRE
            </span>
            <h1>Result Sheet Review</h1>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={() => {
              localStorage.removeItem("ballotLensToken");
              localStorage.removeItem("ballotLensUser");
              navigate("/admin/login", { replace: true });
            }}
          >
            Log Out
          </button>
        </header>

        <section className="admin-sheets-intro">
          <div>
            <h2>Submitted Evidence</h2>
            <p>
              Review result-sheet submissions and their polling-unit
              details. Record a decision only after the evidence has
              been properly inspected.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadSheets}
            disabled={loading || reviewingId !== null}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </section>

        <section className="admin-sheets-summary">
          <div>
            <span>Total submissions</span>
            <strong>{sheets.length}</strong>
          </div>

          <div>
            <span>Submitted / pending</span>
            <strong>
              {
                sheets.filter((sheet) =>
                  ["submitted", "pending"].includes(
                    String(sheet.status || "").toLowerCase()
                  )
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Published</span>
            <strong>
              {
                sheets.filter(
                  (sheet) =>
                    String(sheet.status || "").toLowerCase() ===
                    "published"
                ).length
              }
            </strong>
          </div>
        </section>

        <section className="admin-sheets-panel">
          <div className="admin-sheets-toolbar">
            <div>
              <h2>All Submissions</h2>
              <p>Filter submissions by their current status.</p>
            </div>

            <select
              aria-label="Filter result sheets by status"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="submitted">Submitted</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under review</option>
              <option value="verified">Verified</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="published">Published</option>
            </select>
          </div>

          {actionSuccess && (
            <div
              className="admin-sheets-success"
              role="status"
              style={{
                margin: "16px 0",
                padding: "12px 16px",
                borderRadius: "8px",
                background: "#e8f7ed",
                color: "#176534",
              }}
            >
              {actionSuccess}
            </div>
          )}

          {actionError && (
            <div
              className="admin-sheets-error"
              role="alert"
              style={{ margin: "16px 0" }}
            >
              <p>{actionError}</p>
              <button
                type="button"
                onClick={() => setActionError("")}
              >
                Dismiss
              </button>
            </div>
          )}

          {error && (
            <div className="admin-sheets-error" role="alert">
              <p>{error}</p>
              <button type="button" onClick={loadSheets}>
                Try again
              </button>
            </div>
          )}

          {loading ? (
            <div className="admin-sheets-empty">
              Loading result-sheet submissions...
            </div>
          ) : !error && filteredSheets.length === 0 ? (
            <div className="admin-sheets-empty">
              <span>📂</span>
              <h3>No submissions found</h3>
              <p>
                No result sheets match this filter, or no submissions
                have been uploaded yet.
              </p>
            </div>
          ) : (
            !error && (
              <div className="admin-sheets-table-wrap">
                <table className="admin-sheets-table">
                  <thead>
                    <tr>
                      <th>Submission</th>
                      <th>Election</th>
                      <th>Polling unit</th>
                      <th>Submitted</th>
                      <th>Status</th>
                      <th>Review actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSheets.map((sheet) => {
                      const reviewable = canReview(sheet.status);
                      const isReviewing = reviewingId === sheet.id;

                      return (
                        <tr key={sheet.id}>
                          <td>
                            <strong>
                              {sheet.original_filename ||
                                `Result sheet #${sheet.id}`}
                            </strong>
                            <small>Reference #{sheet.id}</small>
                          </td>

                          <td>
                            {sheet.election_name ||
                              `Election #${sheet.election_id}`}
                          </td>

                          <td>
                            <strong>
                              {sheet.polling_unit_name ||
                                sheet.polling_unit_code ||
                                `Polling unit #${sheet.polling_unit_id}`}
                            </strong>
                            <small>
                              {[
                                sheet.lga_name,
                                sheet.state_name,
                              ]
                                .filter(Boolean)
                                .join(", ") || "Location unavailable"}
                            </small>
                          </td>

                          <td>
                            {sheet.uploaded_at
                              ? new Date(
                                  sheet.uploaded_at
                                ).toLocaleString()
                              : "Not available"}
                          </td>

                          <td>
                            <span
                              className={statusClass(sheet.status)}
                            >
                              {String(
                                sheet.status || "unknown"
                              ).replace(/_/g, " ")}
                            </span>
                          </td>

                          <td>
                            {reviewable ? (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  type="button"
                                  disabled={
                                    reviewingId !== null || loading
                                  }
                                  onClick={() => handleApprove(sheet)}
                                  style={{
                                    padding: "8px 12px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#176534",
                                    color: "#fff",
                                    cursor: "pointer",
                                    opacity:
                                      reviewingId !== null || loading
                                        ? 0.6
                                        : 1,
                                  }}
                                >
                                  {isReviewing
                                    ? "Processing..."
                                    : "Approve"}
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    reviewingId !== null || loading
                                  }
                                  onClick={() => handleReject(sheet)}
                                  style={{
                                    padding: "8px 12px",
                                    border: "none",
                                    borderRadius: "6px",
                                    background: "#b42318",
                                    color: "#fff",
                                    cursor: "pointer",
                                    opacity:
                                      reviewingId !== null || loading
                                        ? 0.6
                                        : 1,
                                  }}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span>
                                No action available
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </section>

        <p className="admin-sheets-footnote">
          A submitted sheet is evidence for review, not a verified
          election result. Approval alone does not publish a result.
          Evidence must be inspected and verified before publication.
        </p>
      </main>
    </div>
  );
}
