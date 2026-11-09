
import { Link } from "react-router-dom";
import SectionLabel from "../components/SectionLabel";
import { ArrowIcon } from "../components/Brand";

const principles = [
  {
    number: "01",
    eyebrow: "SOURCE",
    title: "Preserve the evidence",
    description:
      "Keep records traceable, document where they came from, and preserve relevant changes and source details.",
    icon: "◎",
  },
  {
    number: "02",
    eyebrow: "ASSESSMENT",
    title: "Compare with care",
    description:
      "Examine differences across available records while accounting for missing information, context, and uncertainty.",
    icon: "⌕",
  },
  {
    number: "03",
    eyebrow: "ACCOUNTABILITY",
    title: "Explain the findings",
    description:
      "Make supporting evidence, review decisions, limitations, and corrections understandable to the public.",
    icon: "↗",
  },
];

const reviewSteps = [
  {
    number: "01",
    title: "Identify the source",
    description: "Record the origin and context of the information.",
  },
  {
    number: "02",
    title: "Assess the evidence",
    description: "Examine authenticity, completeness, and relevance.",
  },
  {
    number: "03",
    title: "Compare records",
    description: "Document differences and investigate possible explanations.",
  },
  {
    number: "04",
    title: "Review before publication",
    description: "Subject significant findings to appropriate human review.",
  },
];

function Hero() {
  return (
    <section className="hero home-hero" id="home">
      <div className="home-hero-photo" aria-hidden="true" />
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-pattern" aria-hidden="true" />

      <div className="container home-hero-layout">
        <div className="home-hero-copy">
          <SectionLabel>
            INDEPENDENT ELECTION TRANSPARENCY
          </SectionLabel>

          <h1>
            Election evidence.
            <br />
            <span>Clearer understanding.</span>
          </h1>

          <p className="hero-description">
            BallotLens is being developed to help Nigerians examine
            election information through traceable sources, careful
            assessment, and transparent explanations.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" to="/elections">
              Explore elections <ArrowIcon />
            </Link>

            <Link className="button button-secondary" to="/methodology">
              Our methodology
            </Link>
          </div>

          <div className="home-hero-trust">
            <span className="trust-check" aria-hidden="true">
              ✓
            </span>
            <span>
              Evidence-led approach
              <span className="trust-divider">·</span>
              Clear about uncertainty
            </span>
          </div>
        </div>

        <div className="home-hero-aside">
          <div className="hero-aside-top">
            <span className="hero-aside-icon" aria-hidden="true">
              ◈
            </span>
            <span>THE BALLOTLENS APPROACH</span>
          </div>

          <h2>Look beyond the numbers.</h2>

          <p>
            Understand where information comes from, how records compare,
            and what the available evidence can actually support.
          </p>

          <div className="hero-aside-divider" />

          <Link to="/evidence" className="hero-aside-link">
            Explore the evidence process <ArrowIcon />
          </Link>

          <span className="hero-aside-footnote">
            A platform in development · No verified coverage figures claimed
          </span>
        </div>
      </div>

      <div className="home-hero-bottom">
        <div className="container home-hero-bottom-inner">
          <span>TRANSPARENCY</span>
          <span className="hero-bottom-line" />
          <span>TRACEABILITY</span>
          <span className="hero-bottom-line" />
          <span>ACCOUNTABILITY</span>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  return (
    <section className="principles-section home-principles" id="evidence">
      <div className="container">
        <div className="home-section-heading">
          <div>
            <SectionLabel>THE PRINCIPLES</SectionLabel>
            <h2>
              Trust is built through
              <br />
              <span>a transparent process.</span>
            </h2>
          </div>

          <p>
            Election transparency is more than publishing numbers. It
            means showing the sources, examining the context, and being
            honest about what is and is not known.
          </p>
        </div>

        <div className="principles-grid home-principles-grid">
          {principles.map((item) => (
            <article className="principle-card home-principle-card" key={item.number}>
              <div className="home-principle-top">
                <span className="home-principle-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="principle-number">{item.number}</span>
              </div>

              <span className="home-card-eyebrow">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              <span className="home-card-bottom-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ElectionOverview() {
  return (
    <section className="election-section home-election-section" id="elections">
      <div className="container home-election-layout">
        <div className="home-election-copy">
          <SectionLabel>ELECTION INFORMATION</SectionLabel>

          <h2>
            Start with the record.
            <br />
            <span>Understand the context.</span>
          </h2>

          <p>
            BallotLens aims to organise election information by election,
            contest, and geographic area, while preserving the source
            details needed to understand and assess each record.
          </p>

          <div className="home-election-points">
            <div>
              <span className="home-point-check">✓</span>
              <span>Source-aware election records</span>
            </div>
            <div>
              <span className="home-point-check">✓</span>
              <span>Geographic organisation as data becomes available</span>
            </div>
            <div>
              <span className="home-point-check">✓</span>
              <span>Clear distinction between evidence and conclusions</span>
            </div>
          </div>

          <Link to="/elections" className="button button-primary">
            Visit Elections <ArrowIcon />
          </Link>
        </div>

        <div className="home-registry-card">
          <div className="home-registry-top">
            <div>
              <span className="home-card-eyebrow">PLATFORM STATUS</span>
              <h3>Election registry</h3>
            </div>
            <span className="home-status-pill">
              <span />
              In development
            </span>
          </div>

          <div className="home-registry-visual">
            <div className="home-registry-map" aria-hidden="true">
              <div className="map-ring map-ring-one" />
              <div className="map-ring map-ring-two" />
              <div className="map-ring map-ring-three" />
              <span className="map-pin map-pin-one">●</span>
              <span className="map-pin map-pin-two">●</span>
              <span className="map-pin map-pin-three">●</span>
              <span className="map-pin map-pin-four">●</span>
              <span className="map-center-mark">BL</span>
            </div>

            <div className="home-registry-visual-label">
              <span className="home-registry-live-dot" />
              <span>Preparing source-linked records</span>
            </div>
          </div>

          <p className="home-registry-note">
            Coverage will be displayed as relevant source data is obtained,
            assessed, and approved. No verified coverage figures are
            currently being claimed here.
          </p>

          <Link to="/elections" className="home-registry-link">
            View election information <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MethodologyPreview() {
  return (
    <section className="methodology-section home-methodology-section">
      <div className="container home-methodology-layout">
        <div className="home-methodology-intro">
          <SectionLabel>HOW WE APPROACH EVIDENCE</SectionLabel>

          <h2>
            Evidence first.
            <br />
            <span>Conclusions carefully.</span>
          </h2>

          <p>
            A difference between records is a reason to investigate,
            not a verdict. Any future public finding should be supported
            by reviewed evidence, explained in context, and accompanied
            by relevant limitations.
          </p>

          <Link to="/methodology" className="button button-primary">
            Read our methodology <ArrowIcon />
          </Link>

          <div className="home-methodology-note">
            <span aria-hidden="true">i</span>
            <p>
              Automated tools can assist examination, but they do not
              independently establish electoral fraud.
            </p>
          </div>
        </div>

        <div className="home-review-panel">
          <div className="home-review-panel-header">
            <div>
              <span className="home-card-eyebrow">THE REVIEW PROCESS</span>
              <h3>From source to assessment</h3>
            </div>
            <span className="home-review-mark" aria-hidden="true">
              ✓
            </span>
          </div>

          <div className="home-review-steps">
            {reviewSteps.map((step, index) => (
              <div className="home-review-step" key={step.number}>
                <div className="home-review-step-marker">
                  <span>{step.number}</span>
                  {index < reviewSteps.length - 1 && (
                    <span className="home-review-connector" />
                  )}
                </div>

                <div className="home-review-step-copy">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="home-review-panel-footer">
            <span className="home-review-footer-icon">◎</span>
            <p>
              The process is designed to make the reasoning behind
              published findings easier to examine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="about-section home-about-section">
      <div className="container">
        <div className="home-about-panel">
          <div className="home-about-decoration" aria-hidden="true">
            <span className="home-about-orbit home-about-orbit-one" />
            <span className="home-about-orbit home-about-orbit-two" />
            <span className="home-about-symbol">BL</span>
          </div>

          <div className="home-about-copy">
            <SectionLabel>WHY BALLOTLENS</SectionLabel>

            <h2>
              Public understanding
              <br />
              deserves better evidence.
            </h2>

            <p>
              BallotLens is being developed as an independent,
              public-interest platform to help citizens, journalists,
              researchers, and election observers examine election
              information responsibly.
            </p>

            <p>
              Our role is to make records easier to examine—not to replace
              official institutions, declare election winners, or present
              an unverified discrepancy as proof of wrongdoing.
            </p>

            <Link to="/about" className="button button-light">
              Discover our mission <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeClosing() {
  return (
    <section className="home-closing-section">
      <div className="container home-closing-inner">
        <div>
          <span className="home-closing-kicker">THE BALLOTLENS COMMITMENT</span>
          <h2>Better questions begin with better evidence.</h2>
          <p>
            Explore the platform, understand the method, and see why
            source transparency matters.
          </p>
        </div>

        <div className="home-closing-actions">
          <Link to="/evidence" className="button button-primary">
            Explore evidence <ArrowIcon />
          </Link>
          <Link to="/methodology" className="home-closing-text-link">
            How we work <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="home-page">
      <Hero />
      <Principles />
      <ElectionOverview />
      <MethodologyPreview />
      <AboutPreview />
      <HomeClosing />
    </main>
  );
}
