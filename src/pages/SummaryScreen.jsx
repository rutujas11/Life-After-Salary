/* eslint-disable no-unused-vars */
import useTranslate from "../i18n/useTranslate";

export default function SummaryScreen({ gameState, history, onReset, language }) {
  
  const t = useTranslate(language);
  const tx = t.tx;

  const smartUser = {
    balance: 150000,
    creditScore: 820,
    wealth: 180000,
    stress: 15,
  };

  const badges = [];
  if (gameState.creditScore > 750) badges.push({ icon: "⭐", label: tx("Credit Master") });
  if (gameState.balance > 50000) badges.push({ icon: "💰", label: tx("Money Saver") });
  if (gameState.stress < 30) badges.push({ icon: "😌", label: tx("Stress-Free") });
  if (gameState.investments > 30000) badges.push({ icon: "📈", label: tx("Smart Investor") });
  if (gameState.scamRisk < 20) badges.push({ icon: "🛡️", label: tx("Scam Defender") });

  return (
    <div className="screen summary-container">
      
      {/* TITLE */}
      <h1 className="summary-title">{tx("Year End Summary")}</h1>

      {/* Comparison */}
      <div className="comparison-grid">
        
        {/* YOU SECTION */}
        <div className="comparison-card loser">
          <div className="comparison-label">{tx("Your Journey")}</div>

          <div className="stat-item">
            <div className="stat-label">{tx("Balance")}</div>
            <div className="stat-value">₹{gameState.balance.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Credit Score")}</div>
            <div className="stat-value">{gameState.creditScore}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Wealth")}</div>
            <div className="stat-value">₹{gameState.wealth.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Stress")}</div>
            <div className="stat-value">{gameState.stress}%</div>
          </div>
        </div>

        {/* SMART USER SECTION */}
        <div className="comparison-card winner">
          <div className="comparison-label">{tx("Smart Planner")} ✨</div>

          <div className="stat-item">
            <div className="stat-label">{tx("Balance")}</div>
            <div className="stat-value">₹{smartUser.balance.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Credit Score")}</div>
            <div className="stat-value">{smartUser.creditScore}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Wealth")}</div>
            <div className="stat-value">₹{smartUser.wealth.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Stress")}</div>
            <div className="stat-value">{smartUser.stress}%</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      {badges.length > 0 && (
        <div className="achievements">
          <h3 className="achievement-title">{tx("Achievements Unlocked")}</h3>
          
          <div className="achievement-badges">
            {badges.map((b, i) => (
              <div key={i} className="badge">
                <span className="badge-icon">{b.icon}</span> {tx(b.label)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button className="btn-primary" onClick={onReset}>
          {tx("Play Again")}
        </button>

        <button className="btn-secondary">
          {tx("Share Results")} 📤
        </button>
      </div>
    </div>
  );
}