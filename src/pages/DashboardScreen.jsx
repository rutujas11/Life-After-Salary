
import useTranslate from "../i18n/useTranslate";
import DECISIONS from "../data/decisions";
import MetricCard from "../components/MetricCard";
import DecisionCard from "../components/DecisionCard";
import { INITIAL_STATE } from "../data/constants";

export default function DashboardScreen({
  gameState,
  decisions,
  onDecision,
  onNextMonth,
  language
}) {
  // --- i18n ---
  const t = useTranslate(language);
  const tx = t.tx;

  // --- Guard against undefined gameState (prevents crash) ---
  const state = gameState && typeof gameState === "object" ? gameState : INITIAL_STATE;

  // all decisions chosen?
  const allDone = decisions && DECISIONS
    ? Object.keys(decisions).length === DECISIONS.length
    : false;

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
              onSelect={(o) => onDecision(d.id, o)}
              language={language}   // <-- critical for MR/HI
            />
          ))}
        </div>
      </div>

      {/* Next month */}
      <div className="action-buttons">
        <button
          className="btn-primary"
          disabled={!allDone}
          onClick={onNextMonth}
        >
          {state.month >= 12 ? tx("Finish Year") : tx("Next Month")} →
        </button>
      </div>
    </div>
  );
}
