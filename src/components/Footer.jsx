
import { Link } from "react-router-dom";
import "../styles/footer.css";

const footerLinks = [
  { label: "Home", to: "/" },
  { label: "Elections", to: "/elections" },
  { label: "Evidence", to: "/evidence" },
  { label: "Methodology", to: "/methodology" },
  { label: "About us", to: "/about" },
];

export default function Footer() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-main">
        {/* Brand and logo */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-brand-link"
            aria-label="BallotLens International home"
          >
            <img
              src="/ballotlens-international-logo.png"
              alt="BallotLens International — Elections. Evidence. Accountability."
              className="footer-logo"
            />
          </Link>

          <p className="footer-description">
            Supporting election transparency through credible
            information, evidence-based reporting, and independent
            observation.
          </p>

          <Link to="/elections" className="footer-explore">
            Explore Elections <span>↗</span>
          </Link>
        </div>

        {/* Quick links */}
        <div className="footer-column">
          <h3>Explore</h3>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            {footerLinks.map((item) => (
              <Link key={item.label} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Areas of focus */}
        <div className="footer-column">
          <h3>Our focus</h3>

          <ul className="footer-focus-list">
            <li>Election monitoring</li>
            <li>Evidence verification</li>
            <li>Transparent reporting</li>
            <li>Public accountability</li>
          </ul>
        </div>

        {/* Mission */}
        <div className="footer-column footer-purpose">
          <h3>Our purpose</h3>

          <p>
            Making election information easier to access,
            understand, and scrutinise around the world.
          </p>

          <button
            type="button"
            className="back-to-top"
            onClick={handleBackToTop}
            aria-label="Scroll to the top of this page"
          >
            Back to top ↑
          </button>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {new Date().getFullYear()} BallotLens International.
            All rights reserved.
          </span>

          <span className="footer-bottom-tagline">
            Independent election evidence
            <span className="footer-green-dot" />
            Global perspective
          </span>
        </div>
      </div>
    </footer>
  );
}
