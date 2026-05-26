import { calculateOptionCost } from "../utils/calculateCost";
export default function DecisionCard({ decision, selected, onSelect, salary, city }) {
  return (
    <div className="decision-card">
      <div className="decision-title">
        <span style={{ marginRight: "8px" }}>{decision.icon}</span>
        {decision.title}
      </div>

      <div className="decision-options">
        {decision.options.map((option, index) => {
          
          const cost = calculateOptionCost(
            option,
            decision.id,
            salary,
            city
          );
          return (
            <div key={index}>
              <button
                className="option-btn"
                onClick={() => onSelect(option)}
                style={{
                  background:
                    selected === option
                      ? "white"
                      : "rgba(8,217,214,0.15)",
                  color:
                    selected === option
                      ? "black"
                      : "white",
                }}
              >
                <div className="option-content">
                  <div className="option-label">
                    {option.label}
                  </div>

                  {/* ✅ Always show cost inside button */}
                  {cost > 0 && (
                    <div className="option-amount">
                      ₹{cost.toLocaleString()} / month
                    </div>
                  )}
                </div>
              </button>

              <div className="option-impact">
                {option.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={
                      tag.includes("💰") ||
                        tag.includes("💪") ||
                        tag.includes("📈") ||
                        tag.includes("😌")
                        ? "impact-positive"
                        : tag.includes("⚠️") ||
                          tag.includes("😰") ||
                          tag.includes("❌")
                          ? "impact-negative"
                          : "impact-neutral"
                    }
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}