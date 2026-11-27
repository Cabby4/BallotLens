import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(
    /\/$/,
    ""
  );

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Check your details.");
      }

      const token =
        data.token || data.accessToken || data.access_token;
      const user = data.user || data.data?.user;

      if (!token || !user) {
        throw new Error(
          "The login response did not include the expected token and user. Check your existing backend login response."
        );
      }

      if (user.role !== "admin") {
        throw new Error(
          "This account is not an administrator. Please use an admin account."
        );
      }

      localStorage.setItem("ballotLensToken", token);
      localStorage.setItem("ballotLensUser", JSON.stringify(user));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <Link to="/" className="admin-login-brand">
          <span className="admin-login-logo">B</span>
          <span>
            <strong>BallotLens</strong>
            <small>ADMINISTRATION PORTAL</small>
          </span>
        </Link>

        <div className="admin-login-heading">
          <span>SECURE ACCESS</span>
          <h1>Administrator Login</h1>
          <p>Sign in to manage election data and review submissions.</p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In to Dashboard"}
          </button>
        </form>

        <p className="admin-login-note">
          Administrator access is restricted to authorised accounts.
        </p>

        <Link to="/" className="admin-login-home">
          ← Back to BallotLens
        </Link>
      </section>
    </main>
  );
}