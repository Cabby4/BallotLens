
import Brand from "./Brand";

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
        <Brand />

        <p>See the Evidence. Understand the Results.</p>

        <button
          type="button"
          className="back-to-top"
          onClick={handleBackToTop}
          aria-label="Scroll to the top of this page"
        >
          Back to top ↑
        </button>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} BallotLens</span>
        <span>Independent election evidence · Nigeria</span>
      </div>
    </footer>
  );
}
