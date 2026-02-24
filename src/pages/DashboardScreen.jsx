import { useEffect } from "react";
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
  language
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

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [gameState.month]);

  return (
    <div className="screen dashboard">
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
          {DECISIONS.map((d) => (
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
            />
          ))}
        </div>
      </div>


      {/* Next month */}
      <div className="action-buttons">
        <button
          type="button"                 // <-- add this so it never acts like a <form> submit
          className="btn-primary next-month"  // <-- add class for neon animation
          disabled={!allDone}
          aria-disabled={!allDone}      // <-- better a11y
          onClick={() => {
            if (!allDone) return;       // defensive guard
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
