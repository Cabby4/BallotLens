
import SectionLabel from "../components/SectionLabel";

const principles = [
  {
    number: "01",
    title: "Traceable sources",
    description:
      "Every published evidence record should identify its source, origin, available publication details, and relevant limitations. Permission and reuse conditions must be assessed before information is republished.",
  },
  {
    number: "02",
    title: "Evidence assessment",
    description:
      "Records are assessed for authenticity, provenance, relevance, completeness, and corroboration. A document is not treated as reliable simply because it appears official.",
  },
  {
    number: "03",
    title: "Independent human review",
    description:
      "Material discrepancies and potentially high-impact findings require human review before publication. Automated tools may help identify issues, but they do not independently determine that fraud occurred.",
  },
  {
    number: "04",
    title: "Context before conclusions",
    description:
      "Differences between records can have multiple explanations. BallotLens documents the available evidence, identifies unresolved questions, and avoids presenting an unexplained discrepancy as proof of wrongdoing.",
  },
  {
    number: "05",
    title: "Corrections and appeals",
    description:
      "Corrections should include a reason and preserve the record's relevant history. Disputed high-impact findings should be eligible for independent review under a documented appeals process.",
  },
  {
    number: "06",
    title: "Privacy and responsible publication",
    description:
      "Sensitive personal information and protected source material should not be exposed unnecessarily. Public records must be reviewed for privacy, security, and lawful reuse before publication.",
  },
];

export default function Methodology() {
  return (
    <main className="inner-page methodology-page">
      <section className="page-hero">
        <div className="container">
          <SectionLabel>OUR METHODOLOGY</SectionLabel>

          <h1>
            Evidence first.
            <br />
            <span>Conclusions carefully.</span>
          </h1>

          <p>
            BallotLens is being developed around a transparent, evidence-led
            approach to examining election information in Nigeria. Our
            methods are designed to make sources traceable, uncertainties
            visible, and significant findings accountable.
          </p>
        </div>
      </section>

      <section className="container methodology-intro">
        <SectionLabel>HOW IT WORKS</SectionLabel>
        <h2>From source to reviewed finding</h2>
        <p>
          Every record should have a clear origin and a documented path
          through assessment and review. The process must distinguish
          between information received, information assessed, and findings
          approved for publication.
        </p>

        <div className="methodology-grid">
          {principles.map((item) => (
            <article className="methodology-card" key={item.number}>
              <span className="methodology-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="methodology-note">
        <div className="container">
          <SectionLabel>AN IMPORTANT DISTINCTION</SectionLabel>
          <h2>A discrepancy is a question to investigate.</h2>
          <p>
            A difference between election records is not, by itself, proof
            of electoral fraud. BallotLens aims to document what the
            available evidence supports, what remains uncertain, and what
            requires further examination.
          </p>
        </div>
      </section>
    </main>
  );
}
