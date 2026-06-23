/* eslint-disable no-unused-vars */
import decisionsData from "../data/decisions";
import toast from "react-hot-toast";

export default function SummaryScreen({ gameState, history, onReset, salary}) {
  
  const badges = [];
  if (gameState.creditScore > 750) badges.push({ icon: "⭐", label: "Credit Master" });
  if (gameState.balance > 50000) badges.push({ icon: "💰", label: "Money Saver" });
  if (gameState.stress < 30) badges.push({ icon: "😌", label: "Stress-Free" });
  if (gameState.investments > 30000) badges.push({ icon: "📈", label: "Smart Investor" });
  if (gameState.scamRisk < 20) badges.push({ icon: "🛡️", label: "Scam Defender" });

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


  const score =
    gameState.score || 0;

  let level = ":worst";

  if (score > 200) level = ": Okish";
  if (score > 400) level = ": Good";
  if (score > 700) level = ": Better";
  if (score > 1000) level = ": Awesome";

  let rank = "😅 Beginner";

  if (score > 300) {
    rank = "💼 Salary Master";
  }

  if (score > 600) {
    rank = "📈 Wealth Builder";
  }

  if (score > 1000) {
    rank = "👑 Financial Legend";
  }

  return (
    <div className="screen summary-container">
      
      {/* TITLE */}
      <h1 className="summary-title">{"Year End Summary"}</h1>
      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            color: "gold",
            marginBottom: "10px",
            fontSize: "34px",
          }}
        >
          🏆 Level {level}
        </h2>

        <h3
          style={{
            color: "#08d9d6",
            marginBottom: "10px",
          }}
        >
          ⭐ Score: {score.toLocaleString()}
        </h3>

        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          {rank}
        </div>
      </div>

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
          <div className="comparison-label">{"Your Journey"}</div>

          <div className="stat-item">
            <div className="stat-label">{"Balance"}</div>
            <div className="stat-value">₹{gameState.balance.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Credit Score"}</div>
            <div className="stat-value">{gameState.creditScore}</div>

            {creditWinner === "you" && (
              <div className="stat-winner">🏆 Best Credit</div>
            )}
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Wealth"}</div>
            <div className="stat-value">₹{gameState.wealth.toLocaleString()}</div>

            {wealthWinner === "you" && (
              <div className="stat-winner">🏆 Best Wealth</div>
            )}
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Stress"}</div>
            <div className="stat-value">{gameState.stress}%</div>

            {stressWinner === "you" && (
              <div className="stat-winner">🧘 Lowest Stress</div>
            )}
          </div>

        </div>

        

        {/* SMART USER SECTION */}
        <div className="comparison-card winner">
          <div className="comparison-label">{"Balanced Financial Strategy"} ✨</div>

          <div className="stat-item">
            <div className="stat-label">{"Balance"}</div>
            <div className="stat-value">₹{smartUser.balance.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Credit Score"}</div>
            <div className="stat-value">{smartUser.creditScore}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Wealth"}</div>
            <div className="stat-value">₹{smartUser.wealth.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">{"Stress"}</div>
            <div className="stat-value">{smartUser.stress}%</div>
          </div>

          <div style={{ marginTop: "20px", fontSize: "14px", opacity: 0.9 }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              Smart Strategy Used:
            </div>

            {chosenOptions.map((item, index) => (
              <div key={index}>
                • {item.decision}: {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements */}
      {badges.length > 0 && (
        <div className="achievements">
          <h3 className="achievement-title">{"Achievements Unlocked"}</h3>
          
          <div className="achievement-badges">
            {badges.map((b, i) => (
              <div key={i} className="badge">
                <span className="badge-icon">{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="action-buttons">
        <button className="btn-primary" onClick={onReset}>
          {"Play Again"}
        </button>

        <button
          className="btn-secondary"
          onClick={() => {

            const text =
              `💸 My Life After Salary Results
⭐ Score: ${score}
🏆 Rank: ${level}
🏦 Final Balance: ₹${gameState.balance.toLocaleString()}
📈 Wealth: ₹${gameState.wealth.toLocaleString()}
😰 Stress: ${gameState.stress}
💳 Credit Score: ${gameState.creditScore}

Can you survive adulthood better than me? 😅`;

            if (navigator.share) {

              navigator.share({
                title: "Life After Salary",
                text,
              });

            } else {

              navigator.clipboard.writeText(text);

              toast.success(
                "Result copied to clipboard!"
              );
            }
          }}
        >
          {"Share Results"} 📤
        </button>

        <button
          className="btn-secondary"
          onClick={onReset}
        >
          🚀 Play Again
        </button>
      </div>
    </div>
  );
}