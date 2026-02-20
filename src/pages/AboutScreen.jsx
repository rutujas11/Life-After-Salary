import useTranslate from "../i18n/useTranslate";

export default function AboutScreen({ language, setScreen }) {
  const t = useTranslate(language);
  const tx = t.tx;

  return (
    <div className="screen">
      <div className="header">
        <h1 className="logo">{tx("About This Project")}</h1>
        <p className="tagline">{tx("Gamifying Financial Literacy")}</p>
      </div>

      <div className="decision-cards">
        <div className="decision-card">
          <div className="decision-title">🎯 {tx("Mission")}</div>
          <p className="modal-description">
            {tx(
              "Helping young adults build strong financial habits through simulation and decision-making."
            )}
          </p>
        </div>

        <div className="decision-card">
          <div className="decision-title">🧠 {tx("Why It Works")}</div>
          <p className="modal-description">
            {tx(
              "Learning by doing creates long-term behavioural change, not just awareness."
            )}
          </p>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-secondary" onClick={() => setScreen("home")}>
          {tx("← Back to Home")}
        </button>
      </div>
    </div>
  );
}