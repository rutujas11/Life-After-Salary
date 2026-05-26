import { toast } from "react-hot-toast";
const CITY_OPTIONS = [
  { id: "mumbai",    label: "Mumbai",    icon: "🌆" },
  { id: "pune",      label: "Pune",      icon: "🏙️" },
  { id: "hyderabad", label: "Hyderabad", icon: "🕌" },
  { id: "bengaluru", label: "Bengaluru", icon: "🌉" },
  { id: "delhi",     label: "Delhi",     icon: "🛕" },
];

export default function OnboardingScreen({
  userProfile = { city: "", salary: "" },   // fallback prevents crashes
  setUserProfile,
  onComplete,
  setScreen,
  currentSalary,
  setCurrentSalary
}) {


  const handleStart = (e) => {
    e.preventDefault(); // if wrapped in a <form>, prevent full-page submit
    // Basic validation
    if (!userProfile?.city || !currentSalary) {
      toast.success("Please select your city and enter salary");
      return;
    }
    // Advance to dashboard
    onComplete?.();
  };

  return (
    <div className="screen">
      <div className="onboarding-card">
        <h2 className="logo" style={{ marginBottom: 6 }}>
          {"Let’s set up your profile"}
        </h2>

        {/* CITY */}
        <div className="form-group">
          <label className="form-label">{"Choose your city"}</label>

          <div className="select-grid">
            {CITY_OPTIONS.map(({ id, label, icon }) => {
              const selected = userProfile.city === label; // we store the label (e.g., "Hyderabad")

              return (
                <div
                  key={id}
                  className={`select-option${selected ? " selected" : ""}`}
                  onClick={() => setUserProfile((p) => ({ ...p, city: label }))}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setUserProfile((p) => ({ ...p, city: label }));
                    }
                  }}
                  aria-pressed={selected}
                  aria-label={label}
                >
                  {/* Icon + Name */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    fontWeight: 700
                  }}>
                    <span aria-hidden="true" style={{ fontSize: 28, lineHeight: 1 }}>
                      {icon}
                    </span>
                    <h4 style={{ margin: 0 }}>{label}</h4>
                  </div>

                  {/* Optional helper text */}
                  {/* <p style={{ marginTop: 8, opacity: 0.75, fontSize: 12 }}>
            {tx("Tap to select")}
          </p> */}
                </div>
              );
            })}
          </div>
        </div>

        {/* SALARY */}
        <div className="form-group">
          <label className="form-label">{"Enter your monthly salary"}</label>

          <input
            type="number"
            className="salary-input"
            placeholder="e.g. 40000"
            value={currentSalary || ""}
            min="10000"
            max="500000"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value < 0) return; // prevent negative
              setCurrentSalary(value);
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className="action-buttons">
          <button
            type="button"          // avoid accidental form submit
            className="btn-primary"
            onClick={handleStart}
            disabled={!userProfile.city || !currentSalary}
          >
            {"Start Journey"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setScreen("home")}
          >
            {"<- Back"}
          </button>
        </div>
      </div>
    </div>
  );
}