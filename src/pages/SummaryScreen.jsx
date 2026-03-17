/* eslint-disable no-unused-vars */
import useTranslate from "../i18n/useTranslate";
import decisionsData from "../data/decisions";

export default function SummaryScreen({ gameState, history, onReset, language, salary}) {
  
  const t = useTranslate(language);
  const tx = t.tx;

  

  const badges = [];
  if (gameState.creditScore > 750) badges.push({ icon: "⭐", label: tx("Credit Master") });
  if (gameState.balance > 50000) badges.push({ icon: "💰", label: tx("Money Saver") });
  if (gameState.stress < 30) badges.push({ icon: "😌", label: tx("Stress-Free") });
  if (gameState.investments > 30000) badges.push({ icon: "📈", label: tx("Smart Investor") });
  if (gameState.scamRisk < 20) badges.push({ icon: "🛡️", label: tx("Scam Defender") });

  // ---------------- SMART AI SIMULATION ----------------

  const simulateSmartPlanner = (salary) => {
    let state = {
      balance: 0,
      creditScore: 750,
      stress: 20,
      investments: 0,
      wealth: 0,
    };

    const chosenOptions = [];

    for (let month = 1; month <= 12; month++) {
      state.balance += salary;

      decisionsData.forEach((decision) => {
        // Score each option
        const scoredOptions = decision.options.map((option) => {
          let score = 0;

          // Prefer lower stress
          score += (option.impact?.stress || 0) * -2;

          // Prefer better credit
          score += (option.impact?.creditScore || 0) * 3;

          // Prefer investments
          if (option.investmentPercent) score += 10;

          // Penalize very high cost
          const cost =
            (option.costPercent ? salary * option.costPercent : 0) +
            (option.baseCost || 0) +
            (option.extraPercent ? salary * option.extraPercent : 0);

          score -= cost / 10000;

          return { option, score };
        });

        // Pick highest score
        const best = scoredOptions.sort((a, b) => b.score - a.score)[0]
          .option;

        if (month === 1) {
          chosenOptions.push({
            decision: decision.title,
            label: best.label,
          });
        }

        // Apply cost
        const cost =
          (best.costPercent ? salary * best.costPercent : 0) +
          (best.baseCost || 0) +
          (best.extraPercent ? salary * best.extraPercent : 0);

        state.balance = Math.max(0, state.balance - cost);

        // Apply impacts
        Object.entries(best.impact || {}).forEach(([key, value]) => {

          if (key === "creditScore") {
            state.creditScore = Math.max(
              300,
              Math.min(900, (state.creditScore || 750) + value)
            );

          } else if (key === "stress") {
            state.stress = Math.max(
              0,
              Math.min(100, (state.stress || 20) + value)
            );

          } else {
            state[key] = (state[key] || 0) + value;
          }

        });

        // Handle investment
        if (best.investmentPercent) {
          const investAmount = salary * best.investmentPercent;
          state.investments += investAmount;
        }
      });
    }

    state.wealth =
      Math.round(
        state.balance +
        state.investments * 1.08
      );

    return { state, chosenOptions };
  };



  const { state: smartUser, chosenOptions } =
    simulateSmartPlanner(salary || 50000);

  const playerBeatsSmart =
  gameState.wealth > smartUser.wealth;

  const betterStress =
  gameState.stress < smartUser.stress;

  const wealthWinner =
    gameState.wealth > smartUser.wealth ? "you" :
    gameState.wealth < smartUser.wealth ? "smart" : "tie";

  const creditWinner =
    gameState.creditScore > smartUser.creditScore ? "you" :
    gameState.creditScore < smartUser.creditScore ? "smart" : "tie";

  const stressWinner =
    gameState.stress < smartUser.stress ? "you" :
    gameState.stress > smartUser.stress ? "smart" : "tie";

  return (
    <div className="screen summary-container">
      
      {/* TITLE */}
      <h1 className="summary-title">{tx("Year End Summary")}</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
          {playerBeatsSmart ? (
            <div style={{ color: "#00ffae", fontWeight: "bold", fontSize: "18px" }}>
              🏆 You Outperformed the Balanced Strategy!
            </div>
          ) : (
            <div style={{ color: "#ffcc00", fontWeight: "bold", fontSize: "18px" }}>
              📊 Balanced Strategy Performed Better This Year
            </div>
          )}
      </div>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {gameState.stress < smartUser.stress && (
          <div style={{ color: "#00ffae" }}>
            😌 You Managed Stress Better Than the Balanced Strategy
          </div>
        )}

        {gameState.stress > smartUser.stress && (
          <div style={{ color: "#ff7675" }}>
            ⚠️ Your Stress Was Higher Than the Balanced Strategy
          </div>
        )}

        {gameState.stress === smartUser.stress && (
          <div style={{ color: "#ffd166" }}>
            🤝 You Matched the Balanced Strategy Stress Level
          </div>
        )}
      </div>

      

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

            {creditWinner === "you" && (
              <div className="stat-winner">🏆 Best Credit</div>
            )}
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Wealth")}</div>
            <div className="stat-value">₹{gameState.wealth.toLocaleString()}</div>

            {wealthWinner === "you" && (
              <div className="stat-winner">🏆 Best Wealth</div>
            )}
          </div>

          <div className="stat-item">
            <div className="stat-label">{tx("Stress")}</div>
            <div className="stat-value">{gameState.stress}%</div>

            {stressWinner === "you" && (
              <div className="stat-winner">🧘 Lowest Stress</div>
            )}
          </div>

        </div>

        

        {/* SMART USER SECTION */}
        <div className="comparison-card winner">
          <div className="comparison-label">{tx("Balanced Financial Strategy")} ✨</div>

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

          <div style={{ marginTop: "20px", fontSize: "14px", opacity: 0.9 }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Smart Strategy Used:
            </div>

            {chosenOptions.map((item, index) => (
              <div key={index}>
                • {tx(item.decision)}: {tx(item.label)}
              </div>
            ))}
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