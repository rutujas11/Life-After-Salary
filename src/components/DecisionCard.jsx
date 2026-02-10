import useTranslate from "../i18n/useTranslate";
export default function DecisionCard({ decision, selected, onSelect, language }) {
  
  const t = useTranslate(language);
  const tx = t.tx;

  return (
    <div className="decision-card">
      <div className="decision-title">
        <span style={{ marginRight: "8px" }}>{decision.icon}</span>
        {tx(decision.title)}
      </div>

      <div className="decision-options">
        {decision.options.map((option, index) => (
          <div key={index}>
            <button
              className="option-btn"
              onClick={() => onSelect(option)}
              style={{
                background: selected === option ? "white" : "rgba(8,217,214,0.15)",
                color: selected === option ? "black" : "white",
              }}
            >
              {tx(option.label)}
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
                      : tag.includes("⚠️") || tag.includes("😰") || tag.includes("❌")
                      ? "impact-negative"
                      : "impact-neutral"
                  }
                >
                  {tx(tag)}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}