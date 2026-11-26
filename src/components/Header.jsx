
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { ArrowIcon } from "./Brand";

const navigation = [
  { label: "Home", to: "/" },
  { label: "Elections", to: "/elections" },
  { label: "Evidence", to: "/evidence" },
  { label: "Methodology", to: "/methodology" },
  { label: "About", to: "/about" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container nav-container">
        {/* Official BallotLens International logo */}
        <Link
          to="/"
          className="international-brand"
          aria-label="BallotLens International home"
          onClick={closeMenu}
        >
          <img
            src="/ballotlens-international-logo.png"
            alt="BallotLens International — Elections. Evidence. Accountability."
            className="header-logo"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          className="menu-toggle"
          type="button"
          aria-label={
            menuOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* Navigation links */}
        <nav
          id="main-navigation"
          className={`navigation ${
            menuOpen ? "navigation-open" : ""
          }`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}

          <Link
            className="nav-cta"
            to="/elections"
            onClick={closeMenu}
          >
            Explore Elections <ArrowIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
