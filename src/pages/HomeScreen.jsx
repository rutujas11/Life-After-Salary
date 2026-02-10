import useTranslate from "../i18n/useTranslate";

export default function HomeScreen({ language, onStart, onAbout }) {
    const t = useTranslate(language);
    const tx = t.tx;

  return (
    <div className="screen">
      <div className="header">
        <h1 className="logo pulse">{tx("Life After Salary")}</h1>
        <p className="tagline">{tx("Learn money by living it")}</p>
      </div>

      <div className="decision-cards">
        <div className="decision-card">
          <div className="decision-title">🚀 {tx("Why This Game?")}</div>
          <p className="modal-description">
            {tx("Practice real-life financial decisions safely. Learn budgeting, credit, investments & scam protection.")}
          </p>
        </div>

        <div className="decision-card">
          <div className="decision-title">📊 {tx("What You’ll Experience")}</div>
          <ul className="modal-description">
            <li>{tx("✔ 12 months of salary life")}</li>
            <li>{tx("✔ Real consequences")}</li>
            <li>{tx("✔ Surprise events & scams")}</li>
          </ul>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-primary" onClick={onStart}>{tx("Play Game")}</button>
        <button className="btn-secondary" onClick={onAbout}>{tx("About Project")}</button>
      </div>
    </div>
  );
}