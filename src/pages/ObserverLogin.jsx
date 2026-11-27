
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/observer-auth.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5001/api"
).replace(/\/+$/, "");

export default function ObserverLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to log in.");
      }

      if (!data.token) {
        throw new Error(
          "The server did not return an authentication token."
        );
      }

      // Save the authentication token.
      localStorage.setItem("ballotLensToken", data.token);

      // Save the returned profile when available.
      if (data.user) {
        localStorage.setItem(
          "ballotLensUser",
          JSON.stringify(data.user)
        );
      }

      // Open the new Agent Dashboard after successful login.
      navigate("/agent/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to BallotLens. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="observer-auth-page">
      <section className="observer-auth-card observer-login-card">
        <Link to="/elections" className="observer-auth-back">
          ← Back to Elections
        </Link>

        <div className="observer-auth-brand">
          <span className="observer-auth-icon">BL</span>
          <span>BallotLens International</span>
        </div>

        <p className="observer-auth-eyebrow">
          SECURE AGENT PORTAL
        </p>

        <h1>Welcome back</h1>

        <p className="observer-auth-description">
          Sign in to access your agent account and submit election
          result sheets if your account has been approved.
        </p>

        <form
          className="observer-auth-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="observer-auth-notice" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="observer-auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Log In"}
            {!loading && <span aria-hidden="true"> →</span>}
          </button>
        </form>

        <p className="observer-auth-switch">
          Need an account?{" "}
          <Link to="/observer/signup">Register as an agent</Link>
        </p>

        <div className="observer-auth-security">
          <span aria-hidden="true">●</span>
          Authorized access only. Submitted evidence is subject to
          independent review.
        </div>
      </section>
    </main>
  );
}
