
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";



function NigeriaElectionCountdown() {
  const electionDate = new Date("2027-01-16T00:00:00+01:00").getTime();

  const calculateTime = () => {
    const difference = Math.max(0, electionDate - Date.now());

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      finished: difference === 0,
    };
  };

  const [time, setTime] = useState(calculateTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "DAYS", value: time.days },
    { label: "HOURS", value: time.hours },
    { label: "MINUTES", value: time.minutes },
    { label: "SECONDS", value: time.seconds },
  ];

  return (
    <section className="bl-countdown-section">
      <div className="bl-container bl-countdown-inner">
        <div className="bl-countdown-heading">
          <span className="bl-section-label">
            NIGERIA · 2027 GENERAL ELECTION
          </span>

          <h2>
            The countdown
            <br />
            to election day.
          </h2>

          <p>
            Saturday, 16 January 2027
          </p>
        </div>

        <div className="bl-countdown-content">
          {time.finished ? (
            <div className="bl-countdown-finished">
              Election day has arrived.
            </div>
          ) : (
            <div className="bl-countdown-timer">
              {units.map((unit) => (
                <div className="bl-countdown-unit" key={unit.label}>
                  <div className="bl-countdown-number">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <span>{unit.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bl-countdown-note">
            <span className="bl-countdown-indicator" />
            Counting down to Nigeria's presidential and National Assembly
            elections.
          </div>

          <Link to="/elections" className="bl-countdown-link">
            Follow election information <span>↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      {/* HERO */}
      <section className="bl-hero">
        <div className="bl-hero-glow" />

        <div className="bl-container bl-hero-grid">
          <div className="bl-hero-copy">
            <div className="bl-eyebrow">
              <span className="bl-eyebrow-dot" />
              INDEPENDENT. INTERNATIONAL. EVIDENCE-LED.
            </div>

            <h1>
              Elections deserve
              <br />
              <span>to be seen clearly.</span>
            </h1>

            <p className="bl-hero-description">
              BallotLens is an international independent election tracker
              and observer, making election information easier to examine
              through evidence, transparent review, and credible sources.
            </p>

            <div className="bl-hero-actions">
              <Link to="/elections" className="bl-btn bl-btn-gold">
                Explore elections <span>↗</span>
              </Link>

              <Link to="/evidence" className="bl-btn bl-btn-outline">
                Explore evidence
              </Link>
            </div>

            <div className="bl-hero-principles">
              <span>Evidence before conclusions</span>
              <span className="bl-principle-divider" />
              <span>Transparency through review</span>
            </div>
          </div>

          {/* INTERNATIONAL OBSERVATION VISUAL */}
          <div className="bl-observation-visual">
            <div className="bl-visual-topbar">
              <div>
                <span className="bl-visual-kicker">
                  THE BALLOTLENS MISSION
                </span>
                <h2>See the evidence.</h2>
              </div>

              <div className="bl-orbit-icon">◎</div>
            </div>

            <div className="bl-world-visual">
              <div className="bl-world-grid" />

              <svg
                className="bl-world-lines"
                viewBox="0 0 500 300"
                fill="none"
                aria-hidden="true"
              >
                <ellipse
                  cx="250"
                  cy="150"
                  rx="205"
                  ry="94"
                  stroke="currentColor"
                  strokeOpacity=".15"
                />
                <ellipse
                  cx="250"
                  cy="150"
                  rx="145"
                  ry="94"
                  stroke="currentColor"
                  strokeOpacity=".13"
                />
                <ellipse
                  cx="250"
                  cy="150"
                  rx="78"
                  ry="94"
                  stroke="currentColor"
                  strokeOpacity=".12"
                />
                <path
                  d="M45 150H455M66 108H434M66 192H434"
                  stroke="currentColor"
                  strokeOpacity=".13"
                />

                <path
                  d="M115 103L190 139L275 82L362 133L310 199L222 174L164 219"
                  stroke="#D9B66C"
                  strokeWidth="1.5"
                  strokeDasharray="5 6"
                />

                <path
                  d="M190 139L222 174L275 82"
                  stroke="#D9B66C"
                  strokeOpacity=".55"
                />

                {[
                  [115, 103],
                  [190, 139],
                  [275, 82],
                  [362, 133],
                  [310, 199],
                  [222, 174],
                  [164, 219],
                ].map(([cx, cy], index) => (
                  <g key={index}>
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill="#D9B66C"
                      fillOpacity=".15"
                    />
                    <circle cx={cx} cy={cy} r="3.5" fill="#D9B66C" />
                  </g>
                ))}
              </svg>

              <div className="bl-map-center">
                <span className="bl-map-center-icon">◎</span>
                <span>INDEPENDENT OBSERVATION</span>
              </div>

              <div className="bl-map-caption">
                <span className="bl-map-pulse" />
                A global perspective on election transparency
              </div>
            </div>

            <div className="bl-visual-bottom">
              <div>
                <span className="bl-bottom-number">01</span>
                <span>TRACK</span>
              </div>
              <div>
                <span className="bl-bottom-number">02</span>
                <span>EXAMINE</span>
              </div>
              <div>
                <span className="bl-bottom-number">03</span>
                <span>UNDERSTAND</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bl-hero-bottom-line" />
      </section>
      <NigeriaElectionCountdown />

      {/* INTRODUCTION */}
      <section className="bl-intro-section">
        <div className="bl-container bl-intro-grid">
          <div>
            <span className="bl-section-label">WHY BALLOTLENS</span>
            <h2>
              Election transparency
              <br />
              starts with <span>evidence.</span>
            </h2>
          </div>

          <div className="bl-intro-copy">
            <p>
              Election information can be difficult to verify and compare.
              BallotLens brings records, sources, and reviewed findings
              into a clearer view.
            </p>

            <Link to="/methodology" className="bl-text-link">
              How our approach works <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CORE PILLARS */}
      <section className="bl-pillars-section">
        <div className="bl-container">
          <div className="bl-pillars-heading">
            <div>
              <span className="bl-section-label">OUR APPROACH</span>
              <h2>Built around what can be verified.</h2>
            </div>

            <p>
              Independent observation. Traceable sources. Transparent
              findings.
            </p>
          </div>

          <div className="bl-pillars-grid">
            <article className="bl-pillar-card">
              <span className="bl-pillar-number">01 / TRACK</span>
              <div className="bl-pillar-icon">◎</div>
              <h3>Follow elections</h3>
              <p>
                Explore elections, locations, timelines, and available
                election records.
              </p>
              <Link to="/elections">Explore elections ↗</Link>
            </article>

            <article className="bl-pillar-card">
              <span className="bl-pillar-number">02 / EXAMINE</span>
              <div className="bl-pillar-icon">⌕</div>
              <h3>Examine evidence</h3>
              <p>
                Review supporting documents, source references, and
                reported discrepancies.
              </p>
              <Link to="/evidence">View evidence ↗</Link>
            </article>

            <article className="bl-pillar-card">
              <span className="bl-pillar-number">03 / UNDERSTAND</span>
              <div className="bl-pillar-icon">↗</div>
              <h3>Understand findings</h3>
              <p>
                See reviewed findings in context, with explanations
                and supporting references.
              </p>
              <Link to="/methodology">Our methodology ↗</Link>
            </article>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bl-closing-section">
        <div className="bl-container bl-closing-inner">
          <div>
            <span className="bl-section-label">INFORMED BY EVIDENCE</span>
            <h2>
              Look beyond the headline.
              <br />
              Examine the evidence.
            </h2>
          </div>

          <Link to="/elections" className="bl-btn bl-btn-gold">
            Start exploring <span>↗</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
