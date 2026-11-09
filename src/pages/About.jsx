
import SectionLabel from "../components/SectionLabel";

const principles = [
  {
    number: "01",
    title: "Independence",
    description:
      "Our purpose is to examine election evidence objectively, without treating any political party, candidate, or institution as automatically right or wrong.",
  },
  {
    number: "02",
    title: "Transparency",
    description:
      "We aim to make sources, assessment methods, limitations, and the reasons behind published findings understandable to the public.",
  },
  {
    number: "03",
    title: "Accountability",
    description:
      "Significant findings should be reviewable. Corrections must be explained, and disputed high-impact conclusions should have a documented path to independent review.",
  },
  {
    number: "04",
    title: "Public interest",
    description:
      "We aim to help citizens, journalists, researchers, and accredited election observers examine election information responsibly and make better-informed assessments.",
  },
];

export default function About() {
  return (
    <main className="inner-page about-page">
      <section className="page-hero">
        <div className="container">
          <SectionLabel>ABOUT BALLOTLENS</SectionLabel>

          <h1>
            Democracy deserves
            <br />
            <span>clear evidence.</span>
          </h1>

          <p>
            BallotLens is an independent election evidence and transparency
            platform being developed to help Nigerians examine election
            information through traceable sources, documented methods,
            and responsible reporting.
          </p>
        </div>
      </section>

      <section className="container about-content">
        <div className="about-story">
          <SectionLabel>WHY WE EXIST</SectionLabel>
          <h2>Make election information easier to examine.</h2>

          <p>
            Election information can come from official publications,
            result sheets, observation reports, credible media reports,
            and other sources. Understanding how these records relate to
            one another requires more than simply collecting numbers.
          </p>

          <p>
            BallotLens is designed to organize relevant evidence, document
            where it came from, identify inconsistencies that deserve
            attention, and explain what can and cannot reasonably be
            concluded from the available information.
          </p>

          <p>
            Our goal is to support informed public scrutiny while protecting
            sensitive information and avoiding unsupported allegations.
          </p>
        </div>

        <div className="about-boundaries">
          <SectionLabel>OUR ROLE</SectionLabel>
          <h2>What BallotLens is — and isn't.</h2>

          <ul>
            <li>
              <strong>We are:</strong> a platform for examining and
              documenting election evidence.
            </li>
            <li>
              <strong>We aim to be:</strong> transparent about sources,
              uncertainty, review, and corrections.
            </li>
            <li>
              <strong>We are not:</strong> a replacement for INEC or the
              courts, and we do not declare official election winners.
            </li>
            <li>
              <strong>We do not assume:</strong> that every discrepancy
              proves fraud or deliberate wrongdoing.
            </li>
          </ul>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <SectionLabel>OUR COMMITMENTS</SectionLabel>
          <h2>Principles that guide our work</h2>

          <div className="about-principles-grid">
            {principles.map((item) => (
              <article className="about-principle-card" key={item.number}>
                <span className="methodology-number">{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container about-closing">
        <h2>Trust is earned through evidence.</h2>
        <p>
          BallotLens aims to earn public trust through careful research,
          transparent methods, responsible publication, and a willingness
          to correct mistakes and mostly importantly, to avoid rigging.        
          </p>
      </section>
    </main>
  );
}
