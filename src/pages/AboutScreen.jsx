export default function AboutScreen({ setScreen }) {

  return (
    <div className="screen">
      <div className="header">
        <h1 className="logo">{"About This Project"}</h1>
        <p className="tagline">{"Gamifying Financial Literacy"}</p>
      </div>

      <div className="decision-cards">
        <div className="decision-card">
          <div className="decision-title">🎯 {"Mission"}</div>
          <p className="modal-description">
            {
              "Helping young adults build strong financial habits through simulation and decision-making."
            }
          </p>
        </div>

        <div className="decision-card">
          <div className="decision-title">🧠 {"Why It Works"}</div>
          <p className="modal-description">
            {
              "Learning by doing creates long-term behavioural change, not just awareness."
            }
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={() => setScreen("home")}>
          {"← Back to Home"}
        </button>
      </div>
    </div>
  );
}