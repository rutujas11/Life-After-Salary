
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

      <div className="action-buttons">
        <button className="btn-primary" onClick={onStart}>{"Play Game"}</button>
        <button className="btn-secondary" onClick={onAbout}>{"About Project"}</button>
      </div>
    </div>
  );
}