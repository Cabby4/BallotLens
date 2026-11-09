export default function SectionLabel({ children }) {
  return (
    <div className="section-label">
      <span className="label-dot" />
      {children}
    </div>
  );
}