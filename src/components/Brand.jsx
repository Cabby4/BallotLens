export function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Brand() {
  return (
    <a href="#home" className="brand" aria-label="BallotLens home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 40 40" fill="none">
          <rect
            x="3"
            y="3"
            width="34"
            height="34"
            rx="11"
            stroke="currentColor"
            strokeWidth="2"
          />

          <circle
            cx="17"
            cy="17"
            r="7"
            stroke="currentColor"
            strokeWidth="2.5"
          />

          <path
            d="m22 22 7 7M13.5 17l2.5 2.5 5-5"
            stroke="#D8AD57"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="brand-name">
        Ballot<span>Lens</span>
        <small>INDEPENDENT ELECTION EVIDENCE</small>
      </span>
    </a>
  );
}