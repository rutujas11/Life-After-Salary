import { useState } from "react";

export default function EventModal({ event, onChoose }) {
  const [selected, setSelected] = useState(null);

  const choose = (option) => {
    setSelected(option);
    setTimeout(() => onChoose(option), 1500);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <div className="modal-icon">{event.icon}</div>
        <h2 className="modal-title">{event.title}</h2>
        <p className="modal-description">{event.description}</p>

        {!selected ? (
          <div className="modal-actions">
            {event.options.map((option, i) => (
              <button
                key={i}
                className={`modal-btn ${i === 0 ? "modal-btn-primary" : "modal-btn-secondary"}`}
                onClick={() => choose(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="modal-description" style={{ color: "yellow", marginTop: 20 }}>
            {selected.outcome}
          </p>
        )}
      </div>
    </div>
  );
}