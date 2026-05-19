import { useEffect } from "react";
import { useState } from "react";
import useTranslate from "../i18n/useTranslate";
import DECISIONS from "../data/decisions";
import MetricCard from "../components/MetricCard";
import DecisionCard from "../components/DecisionCard";
import { CITY_CONFIG } from "../data/cityConfig";
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
  setCurrentCity,
  setGameState
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

  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [tempSalary, setTempSalary] = useState(currentSalary || 0);
  useEffect(() => {
    setTempSalary(currentSalary || 0);
  }, [currentSalary]);

  const [tempCity, setTempCity] = useState(currentCity);

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [gameState.month]);

  const totalMonthlyExpenses = Object.entries(decisions || {}).reduce(
    (sum, [decisionId, option]) => {

      if (!option) return sum;

      let cost = 0;

      const cityData =
        CITY_CONFIG[currentCity] || CITY_CONFIG.Pune;

      // RENT
      if (decisionId === "rent") {

        if (option.label === "Shared Apartment") {
          const [min, max] = cityData.rent.shared;
          cost = Math.round((min + max) / 2);
        }

        else if (option.label === "PG Accommodation") {
          const [min, max] = cityData.rent.pg;
          cost = Math.round((min + max) / 2);
        }

        else if (option.label === "1/2 BHK Flat") {
          const [min, max] = cityData.rent.flat;
          cost = Math.round((min + max) / 2);
        }
      }

      // FOOD
      else if (decisionId === "food") {

        cost +=
          (option.baseCost || 0) *
          (cityData.foodMultiplier || 1);

        if (option.extraPercent) {
          cost += Math.round(
            currentSalary * option.extraPercent
          );
        }
      }

      // OTHER
      else {

        if (option.baseCost) {
          cost += option.baseCost;
        }

        if (option.extraPercent) {
          cost += Math.round(
            currentSalary * option.extraPercent
          );
        }

        if (option.costPercent) {
          cost += Math.round(
            currentSalary * option.costPercent
          );
        }
      }

      return sum + Math.round(cost);

    }, 0
  );

  const remainingSalary =
    (currentSalary || 0) - totalMonthlyExpenses;

  return (
    <div className="screen dashboard">
      
      {/* ✅ BUTTONS */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          className="btn-secondary"
          onClick={() => {
            setTempSalary(currentSalary);
            setShowSalaryModal(true);
          }}
        >
          💰 Update Salary
        </button>

        <button
          className="btn-secondary"
          onClick={() => {
            setTempCity(currentCity);
            setShowCityModal(true);
          }}
        >
          🏙️ Change City
        </button>
      </div>


      {showSalaryModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>💰 Update Monthly Salary</h3>

            <input
              type="number"
              className="salary-input"
              value={tempSalary}
              onChange={(e) => setTempSalary(Number(e.target.value))}
              placeholder="Enter salary"
            />

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (!tempSalary || tempSalary <= 0) return;

                  setCurrentSalary(Number(tempSalary));

                  setGameState((prev) => ({
                    ...prev,
                    balance:
                      prev.balance +
                      (tempSalary - currentSalary),

                    wealth:
                      prev.wealth +
                      (tempSalary - currentSalary),
                  }));

                  setShowSalaryModal(false);
                }}
              >
                Save
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowSalaryModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showCityModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h3>🏙️ Change City</h3>

            <select
              className="salary-input"
              value={tempCity}
              onChange={(e) => setTempCity(e.target.value)}
            >
              <option value="">Select City</option>
              <option value="Mumbai">🌆 Mumbai</option>
              <option value="Pune">🏙️ Pune</option>
              <option value="Delhi">🏛️ Delhi</option>
              <option value="Bengaluru">🌉 Bengaluru</option>
              <option value="Hyderabad">🕌 Hyderabad</option>
            </select>

            <div className="modal-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  if (!tempCity) return;

                  setCurrentCity(tempCity);
                  setShowCityModal(false);
                }}
              >
                Save
              </button>

              <button
                className="btn-secondary"
                onClick={() => setShowCityModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Live Budget Tracker */}
      <div style={{ marginBottom: "10px", opacity: 0.8 }}>
        💼 Salary: ₹{Number(currentSalary || 0).toLocaleString()} | 🏙️ {currentCity || "Not Set"}
      </div>

      <div
        style={{
          marginBottom: "18px",
          padding: "14px",
          borderRadius: "16px",

          background:
            remainingSalary >= 0
              ? "rgba(0,255,140,0.12)"
              : "rgba(255,0,80,0.12)",

          border:
            remainingSalary >= 0
              ? "1px solid rgba(0,255,140,0.35)"
              : "1px solid rgba(255,0,80,0.35)",

          color:
            remainingSalary >= 0
              ? "#00ff95"
              : "#ff4d6d",

          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        💸 Monthly Expenses:
        ₹{totalMonthlyExpenses.toLocaleString()}

        <br />

        💰 Remaining:
        ₹{remainingSalary.toLocaleString()}
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
