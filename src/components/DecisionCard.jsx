import useTranslate from "../i18n/useTranslate";
export default function DecisionCard({ decision, selected, onSelect, language, salary }) {
  
  const t = useTranslate(language);
  const tx = t.tx;

  return (
    <div className="decision-card">
      <div className="decision-title">
        <span style={{ marginRight: "8px" }}>{decision.icon}</span>
        {tx(decision.title)}
      </div>

      <div className="decision-options">
        {decision.options.map((option, index) => {
          const cost = (() => {
            if (!salary) return 0;

            let total = 0;

            if (option.baseCost) {
              total += option.baseCost;
            }

            if (option.extraPercent) {
              total += Math.round(salary * option.extraPercent);
            }

            if (option.costPercent) {
              total += Math.round(salary * option.costPercent);
            }

            return total;
          })();

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
                    {tx(option.label)}
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
                    {tx(tag)}
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