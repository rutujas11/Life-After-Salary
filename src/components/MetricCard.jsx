// src/components/MetricCard.jsx
export default function MetricCard({
  icon,            // string or node (e.g., "💰")
  label,           // string (e.g., "Balance")
  value,           // string or number (rendered as-is)
  valueColor,      // CSS color string (optional)
  barPercent,      // number 0-100 (optional)
  barGradient,     // CSS background for the bar (optional)
}) {
  return (
    <div className="metric-card">
      {icon && <div className="metric-icon">{icon}</div>}
      {label && <div className="metric-label">{label}</div>}

      <div
        className="metric-value"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </div>

      {typeof barPercent === "number" && (
        <div className="metric-bar">
          <div
            className="metric-bar-fill"
            style={{
              width: `${Math.max(0, Math.min(100, barPercent))}%`,
              ...(barGradient ? { background: barGradient } : null),
            }}
          />
        </div>
      )}
    </div>
  );
}