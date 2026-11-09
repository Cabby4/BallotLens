
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Brand, { ArrowIcon } from "./Brand";


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
        <Brand />

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav
          id="main-navigation"
          className={`navigation ${menuOpen ? "navigation-open" : ""}`}
          aria-label="Main navigation"
        >
          {navigation.map((item) => {
         const isPageLink = [
                "/",
                "/elections",
                "/evidence",
                "/methodology",
                "/about",
                ].includes(item.to);

            if (isPageLink) {
              return (
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
              );
            }

            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={closeMenu}
                className="nav-link"
              >
                {item.label}
              </Link>
            );
          })}

          <Link
            className="nav-cta"
            to="/about"
            onClick={closeMenu}
          >
            Our mission <ArrowIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}
