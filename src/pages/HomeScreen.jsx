
export default function HomeScreen({ onStart, onAbout }) {

  return (
    <div className="screen">
      <div className="header">
        <h1 className="logo pulse">{"Life After Salary"}</h1>
        <p className="tagline">{"Learn money by living it"}</p>
      </div>

      <div className="decision-cards">
        <div className="decision-card">
          <div className="decision-title">🚀 {"Why This Game?"}</div>
          <p className="modal-description">
            {"Practice real-life financial decisions safely. Learn budgeting, credit, investments & scam protection."}
          </p>
        </div>

        <div className="decision-card">
          <div className="decision-title">📊 {"What You’ll Experience"}</div>
          <ul className="modal-description">
            <li>{"✔ 12 months of salary life"}</li>
            <li>{"✔ Real consequences"}</li>
            <li>{"✔ Surprise events & scams"}</li>
          </ul>
        </div>
      </div>

      <div className="home-actions">

        <div className="play-cta" onClick={onStart}>
          <div className="play-cta-icon">🎮</div>

          <div className="play-cta-content">
            <h2>Survive Your Salary💸</h2>
            <p>Survive 12 months. Build wealth. Avoid scams.</p>
          </div>

          <div className="play-cta-arrow">→</div>
        </div>

        <button className="about-btn" onClick={onAbout}>
          ℹ️ About Game
        </button>

      </div>
    </div>
  );
}