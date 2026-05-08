import { useEffect } from "react";
import { useState } from "react";
import useTranslate from "../i18n/useTranslate";
import DECISIONS from "../data/decisions";
import MetricCard from "../components/MetricCard";
import DecisionCard from "../components/DecisionCard";
import { INITIAL_STATE } from "../data/constants";


export default function DashboardScreen({
  gameState,
  decisions,
  onDecide,
  onNext,
  language,
  currentSalary,
  currentCity,
  setCurrentSalary,
  setCurrentCity
}) {
  // --- i18n ---
  const t = useTranslate(language);
  const tx = t.tx;

  // --- Guard against undefined gameState (prevents crash) ---
  const state = gameState && typeof gameState === "object" ? gameState : INITIAL_STATE;

  // all decisions chosen?
  const allDone =
    Array.isArray(DECISIONS) &&
    DECISIONS.length > 0 &&
    DECISIONS.every(d =>
      Object.prototype.hasOwnProperty.call(decisions || {}, d.id)
    );

  const [shuffledDecisions] = useState(() => {
    return DECISIONS.map((decision) => ({
      ...decision,
      options: [...decision.options].sort(() => Math.random() - 0.5),
    }));
  });

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [gameState.month]);

  

  return (
    <div className="screen dashboard">
      <div style={{ marginBottom: "10px", opacity: 0.8 }}>
        💼 Salary: ₹{currentSalary?.toLocaleString()} | 🏙️ {currentCity || "Not Set"}
      </div>

      {/* ✅ BUTTONS */}
      <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
        <button
          className="btn-secondary"
          onClick={() => {
            const input = prompt("Enter your new monthly salary (₹):");

            if (!input) return;

            const newSalary = parseInt(input);

            if (isNaN(newSalary) || newSalary <= 0) {
              alert("Invalid salary");
              return;
            }

            setCurrentSalary(newSalary);
            alert(`🎉 Salary updated to ₹${newSalary}`);
          }}
        >
          💰 Increase Salary
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            const cities = ["Mumbai", "Pune", "Bengaluru", "Delhi", "Hyderabad"];

            const newCity = prompt(
              "Enter new city:\nMumbai\nPune\nHyderabad\nDelhi\nBengaluru"
            );

            if (!newCity || !cities.includes(newCity)) {
              alert("Invalid city");
              return;
            }

            setCurrentCity(newCity);
            alert(`🏙️ Moved to ${newCity}`);;
          }}
        >
          🏙️ Change City
        </button>
      </div>

      {/* Month header */}
      <div className="month-header">
        <h2 className="month-title">
          {tx("Month")} {state.month} / 12
        </h2>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <MetricCard
          icon="💰"
          label={tx("Balance")}
          value={`₹${Number(state.balance || 0).toLocaleString()}`}
          valueColor={(state.balance || 0) > 0 ? "var(--success)" : "var(--danger)"}
          barPercent={Math.min(100, ((state.balance || 0) / 100000) * 100)}
        />

        <MetricCard
          icon="📊"
          label={tx("Credit Score")}
          value={state.creditScore ?? 0}
          valueColor={
            (state.creditScore ?? 0) > 700
              ? "var(--success)"
              : (state.creditScore ?? 0) > 600
              ? "var(--warning)"
              : "var(--danger)"
          }
          barPercent={((state.creditScore ?? 0) / 900) * 100}
        />

        <MetricCard
          icon="📈"
          label={tx("Net Wealth")}
          value={`₹${Number(state.wealth || 0).toLocaleString()}`}
          valueColor="var(--neon-blue)"
          barPercent={Math.min(100, ((state.wealth || 0) / 200000) * 100)}
        />

        <MetricCard
          icon="😰"
          label={tx("Stress")}
          value={`${state.stress ?? 0}%`}
          valueColor={
            (state.stress ?? 0) < 30
              ? "var(--success)"
              : (state.stress ?? 0) < 60
              ? "var(--warning)"
              : "var(--danger)"
          }
          barPercent={state.stress ?? 0}
          barGradient="linear-gradient(90deg, var(--success), var(--danger))"
        />

        <MetricCard
          icon="🛡️"
          label={tx("Scam Risk")}
          value={`${state.scamRisk ?? 0}%`}
          valueColor={
            (state.scamRisk ?? 0) < 30
              ? "var(--success)"
              : (state.scamRisk ?? 0) < 60
              ? "var(--warning)"
              : "var(--danger)"
          }
          barPercent={state.scamRisk ?? 0}
          barGradient="linear-gradient(90deg, var(--success), var(--danger))"
        />
      </div>

      {/* Decisions */}
      <div className="decision-section">
        <h3 className="section-title">{tx("Make Your Monthly Decisions")}</h3>

        <div className="decision-cards">
          {shuffledDecisions.map((d) => (
            <DecisionCard
              key={d.id}
              decision={d}
              selected={decisions ? decisions[d.id] : undefined}
              onSelect={(o) => {
                // guard + track
                if (typeof onDecide === "function") onDecide(d.id, o);
                else console.warn("onDecide prop is not a function", onDecide);
              }}
              language={language}
              salary={currentSalary}
              city={currentCity}  
            />
          ))}
        </div>
      </div>


      {/* Next month */}
      <div className="action-buttons">
        <button
          type="button"                 
          className="btn-primary next-month" 
          disabled={!allDone}
          aria-disabled={!allDone}     
          onClick={() => {
            if (!allDone) return;       
            if (typeof onNext === "function") onNext();
            else console.warn("onNext prop is not a function", onNext);
          }}
        >
          {state.month >= 12 ? tx("Finish Year") : tx("Next Month")} →
        </button>
      </div>
    </div>
  );
}
