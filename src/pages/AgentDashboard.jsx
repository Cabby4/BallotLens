
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/agent-dashboard.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

export default function AgentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [electionId, setElectionId] = useState("");
  const [pollingUnitId, setPollingUnitId] = useState("");
  const [resultFile, setResultFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [submittedSheets, setSubmittedSheets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("ballotLensToken");
    const savedUser = localStorage.getItem("ballotLensUser");

    if (!token || !savedUser) {
      navigate("/observer/login", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("ballotLensUser");
      navigate("/observer/login", { replace: true });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("ballotLensToken");
    localStorage.removeItem("ballotLensUser");
    navigate("/observer/login", { replace: true });
  }

  async function handleUpload(event) {
    event.preventDefault();
    setUploadMessage("");
    setUploadError("");

    if (!resultFile) {
      setUploadError("Please select a result-sheet image.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(resultFile.type)) {
      setUploadError("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (resultFile.size > 5 * 1024 * 1024) {
      setUploadError("The image must not exceed 5 MB.");
      return;
    }

    const token = localStorage.getItem("ballotLensToken");

    if (!token) {
      navigate("/observer/login", { replace: true });
      return;
    }

    const formData = new FormData();
    formData.append("election_id", electionId.trim());
    formData.append("polling_unit_id", pollingUnitId.trim());
    formData.append("resultSheet", resultFile);

    setUploading(true);

    try {
      const response = await fetch(`${API_URL}/result-sheets`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        if (response.status === 401) {
          localStorage.removeItem("ballotLensToken");
          localStorage.removeItem("ballotLensUser");
          navigate("/observer/login", { replace: true });
          return;
        }

        throw new Error(
          data.message || "Unable to submit the result sheet."
        );
      }

      setUploadMessage(data.message || "Result sheet submitted successfully.");
      setSubmittedSheets((previous) => [
        data.resultSheet,
        ...previous,
      ]);
      setElectionId("");
      setPollingUnitId("");
      setResultFile(null);

      event.target.reset();
    } catch (error) {
      setUploadError(
        error.message || "Unable to connect to the BallotLens server."
      );
    } finally {
      setUploading(false);
    }
  }

  if (!user) {
    return (
      <main className="agent-dashboard-loading">
        Loading your dashboard...
      </main>
    );
  }

  const displayName = user.full_name || "Election Agent";

  return (
    <main className="agent-dashboard">
      <section className="agent-dashboard-header">
        <div>
          <p className="agent-eyebrow">BALLOTLENS INTERNATIONAL</p>
          <h1>Agent Dashboard</h1>
          <p>
            Welcome back, {displayName}. Manage your election
            observation activities from one place.
          </p>
        </div>

        <button
          type="button"
          className="agent-logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </section>

      <section className="agent-welcome-card">
        <div className="agent-avatar" aria-hidden="true">
          {displayName.charAt(0).toUpperCase()}
        </div>

        <div className="agent-profile-info">
          <h2>{displayName}</h2>
          <p>{user.email}</p>
          <p>
            {user.organisation_name || "Organisation or party not provided"}
          </p>
        </div>

        <div className="agent-account-status">
          <span className="agent-status-dot" />
          Account active
          <small>Agent approval: check with administrator</small>
        </div>
      </section>

      <section className="agent-summary-grid">
        <article className="agent-summary-card">
          <span className="agent-card-icon">◈</span>
          <p>Assigned Elections</p>
          <strong>—</strong>
          <small>Assignment data not connected yet</small>
        </article>

        <article className="agent-summary-card">
          <span className="agent-card-icon">▤</span>
          <p>Submitted Result Sheets</p>
          <strong>{submittedSheets.length}</strong>
          <small>Sheets submitted in this session</small>
        </article>

        <article className="agent-summary-card">
          <span className="agent-card-icon">◷</span>
          <p>Awaiting Review</p>
          <strong>—</strong>
          <small>Review data not connected yet</small>
        </article>
      </section>

      <section className="agent-panel agent-upload-panel">
        <h2>Submit a Result Sheet</h2>
        <p>
          Upload a clear image of the result sheet for the correct
          election and polling unit. Submissions remain subject to review.
        </p>

        <form className="agent-upload-form" onSubmit={handleUpload}>
          <label htmlFor="election-id">Election ID</label>
          <input
            id="election-id"
            type="number"
            min="1"
            step="1"
            value={electionId}
            onChange={(event) => setElectionId(event.target.value)}
            placeholder="Enter election ID"
            required
          />

          <label htmlFor="polling-unit-id">Polling Unit ID</label>
          <input
            id="polling-unit-id"
            type="number"
            min="1"
            step="1"
            value={pollingUnitId}
            onChange={(event) => setPollingUnitId(event.target.value)}
            placeholder="Enter polling unit ID"
            required
          />

          <label htmlFor="result-sheet-file">Result-sheet image</label>
          <input
            id="result-sheet-file"
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setResultFile(event.target.files?.[0] || null)
            }
            required
          />

          <small className="agent-upload-help">
            JPG, PNG or WEBP. Maximum file size: 5 MB.
          </small>

          {uploadError && (
            <p className="agent-upload-error" role="alert">
              {uploadError}
            </p>
          )}

          {uploadMessage && (
            <p className="agent-upload-success" role="status">
              {uploadMessage}
            </p>
          )}

          <button
            type="submit"
            className="agent-primary-link agent-upload-button"
            disabled={uploading}
          >
            {uploading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </section>

      <section className="agent-dashboard-content">
        <div className="agent-panel">
          <h2>Recent Submissions</h2>

          {submittedSheets.length === 0 ? (
            <div className="agent-empty-state">
              <span aria-hidden="true">▤</span>
              <h3>No new submissions in this session</h3>
              <p>
                Successful uploads will appear here. Persistent submission
                history will be connected to the backend next.
              </p>
            </div>
          ) : (
            <div className="agent-submission-list">
              {submittedSheets.map((sheet) => (
                <article
                  className="agent-submission-item"
                  key={sheet.id}
                >
                  <div>
                    <strong>
                      {sheet.original_filename || `Result sheet #${sheet.id}`}
                    </strong>
                    <p>
                      Election #{sheet.election_id} · Polling unit #
                      {sheet.polling_unit_id}
                    </p>
                    <small>
                      {sheet.uploaded_at
                        ? new Date(sheet.uploaded_at).toLocaleString()
                        : "Recently submitted"}
                    </small>
                  </div>
                  <span className="agent-submission-status">
                    {sheet.status || "submitted"}
                  </span>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="agent-panel agent-quick-links">
          <h2>Quick Links</h2>

          <Link to="/elections">
            <span>Explore Elections</span>
            <span>→</span>
          </Link>

          <Link to="/results">
            <span>View Published Results</span>
            <span>→</span>
          </Link>

          <Link to="/evidence">
            <span>View Evidence</span>
            <span>→</span>
          </Link>

          <div className="agent-security-note">
            <strong>Evidence integrity</strong>
            <p>
              Uploaded result sheets are not automatically verified or
              published. An authorised review process is required.
            </p>
          </div>
        </aside>
      </section>

      <section className="agent-profile-footer">
        <h2>Account Information</h2>

        <div>
          <span>Account role</span>
          <strong>{user.role || "observer"}</strong>
        </div>

        <div>
          <span>Organisation / party</span>
          <strong>{user.organisation_name || "Not provided"}</strong>
        </div>

        <div>
          <span>Phone number</span>
          <strong>{user.phone_number || "Not provided"}</strong>
        </div>

        <div>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
      </section>
    </main>
  );
}
