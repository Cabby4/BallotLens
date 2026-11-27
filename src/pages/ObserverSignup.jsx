
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/observer-auth.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

export default function ObserverSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    organisation: "",
    password: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!agreed) {
      setError("Please confirm that your information is accurate.");
      return;
    }

    if (formData.password.length < 10) {
      setError("Your password must contain at least 10 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone_number: formData.phone.trim(),
          organisation_name: formData.organisation.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Registration failed.");
      }

      if (!data.token) {
        throw new Error(
          "Your account was created, but no authentication token was returned. Please try logging in."
        );
      }

      // Keep the existing token storage behavior.
      localStorage.setItem("ballotLensToken", data.token);

      setSuccess(
        data.message || "Your observer account was created successfully."
      );

      // Continue to the existing login page.
      setTimeout(() => {
        navigate("/observer/login", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="observer-auth-page">
      <section className="observer-auth-card">
        <Link to="/elections" className="observer-auth-back">
          ← Back to Elections
        </Link>

        <div className="observer-auth-brand">
          <span className="observer-auth-icon">BL</span>
          <span>BallotLens International</span>
        </div>

        <p className="observer-auth-eyebrow">
          ELECTION AGENT REGISTRATION
        </p>

        <h1>Create your agent account</h1>

        <p className="observer-auth-description">
          Register to request authorization to submit polling-unit
          election result sheets for independent review.
        </p>

        <form className="observer-auth-form" onSubmit={handleSubmit}>
          <label htmlFor="agent-name">Full name</label>
          <input
            id="agent-name"
            name="full_name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            maxLength={200}
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <label htmlFor="agent-email">Email address</label>
          <input
            id="agent-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            maxLength={254}
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="agent-phone">Phone number</label>
          <input
            id="agent-phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            maxLength={30}
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <label htmlFor="agent-organisation">
            Organisation or party affiliation
          </label>
          <input
            id="agent-organisation"
            name="organisation"
            type="text"
            placeholder="Enter organisation, party, or Independent"
            maxLength={200}
            value={formData.organisation}
            onChange={handleChange}
            required
          />

          <label htmlFor="agent-password">Password</label>
          <input
            id="agent-password"
            name="password"
            type="password"
            placeholder="Create a password (minimum 10 characters)"
            autoComplete="new-password"
            minLength={10}
            maxLength={72}
            value={formData.password}
            onChange={handleChange}
            required
          />

          {error && (
            <p className="observer-auth-notice" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="observer-auth-notice" role="status">
              {success}
            </p>
          )}

          <label className="observer-auth-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              required
            />
            <span>
              I confirm that my information is accurate and agree to
              BallotLens review and verification procedures.
            </span>
          </label>

          <button
            type="submit"
            className="observer-auth-submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Submit Registration"}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>
        </form>

        <p className="observer-auth-notice">
          Registration does not automatically authorize uploads.
          Your account must be reviewed and approved first.
        </p>

        <p className="observer-auth-switch">
          Already registered?{" "}
          <Link to="/observer/login">Log in</Link>
        </p>
      </section>
    </main>
  );
}
