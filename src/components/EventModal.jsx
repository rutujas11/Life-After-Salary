import useTranslate from "../i18n/useTranslate";
import { useState } from "react";

export default function EventModal({ event, onChoice, language }) {
  const [selected, setSelected] = useState(null);
  const t = useTranslate(language);
  const tx = t.tx;

  const choose = (option) => {
    setSelected(option);
    setTimeout(() => onChoice(option), 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-icon">{event.icon}</div>
        <h2 className="modal-title">{tx(event.title)}</h2>
        <p className="modal-description">{tx(event.description)}</p>

        {!selected ? (
          <div className="modal-actions">
            {event.options.map((option, i) => (
              <button
                key={i}
                className={`modal-btn ${i === 0 ? "modal-btn-primary" : "modal-btn-secondary"}`}
                onClick={() => choose(option)}
              >
                {tx(option.label)}
              </button>
            ))}
          </div>
        ) : (
          <p className="modal-description" style={{ color: "yellow", marginTop: 20 }}>
            {tx(selected.outcome)}
          </p>
        )}
      </div>
    </div>
  );
}