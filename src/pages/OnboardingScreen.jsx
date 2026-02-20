import useTranslate from "../i18n/useTranslate";

// Put this near the top of OnboardingScreen.jsx (outside the component)
const CITY_OPTIONS = [
  { id: "mumbai",    label: "Mumbai",    icon: "🌆" },
  { id: "pune",      label: "Pune",      icon: "🏙️" },
  { id: "hyderabad", label: "Hyderabad", icon: "🕌" },
  { id: "bengaluru", label: "Bengaluru", icon: "🌉" },
  { id: "delhi",     label: "Delhi",     icon: "🛕" },
];

// If you later want custom SVGs, switch `icon` to a component or image path, e.g.
// icon: <YourSvg style={{ width: 28, height: 28 }} />  OR  icon: "/src/assets/cities/hyderabad.svg"

export default function OnboardingScreen({
  language,
  userProfile = { city: "", salary: "" },   // fallback prevents crashes
  setUserProfile,
  onComplete,
}) {
  const t = useTranslate(language);
  const tx = t.tx;

  const handleStart = (e) => {
    e.preventDefault(); // if wrapped in a <form>, prevent full-page submit
    // Basic validation
    if (!userProfile?.city || !userProfile?.salary) {
      alert(tx("Please select your city and salary range"));
      return;
    }
    // Advance to dashboard
    onComplete?.();
  };

  return (
    <div className="screen">
      <div className="onboarding-card">
        <h2 className="logo" style={{ marginBottom: 6 }}>
          {tx("Let’s set up your profile")}
        </h2>

        {/* CITY */}
        <div className="form-group">
          <label className="form-label">{tx("Choose your city")}</label>

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
          <label className="form-label">{tx("Select your salary range")}</label>
          <div className="select-grid">
            {["< ₹25k", "₹25k–₹50k", "₹50k–₹1L", "₹1L+"].map((s) => (
              <div
                key={s}
                className={
                  "select-option" + (userProfile.salary === s ? " selected" : "")
                }
                onClick={() => setUserProfile((p) => ({ ...p, salary: s }))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setUserProfile((p) => ({ ...p, salary: s }))}
              >
                <h4>{s}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="action-buttons">
          <button
            type="button"          // avoid accidental form submit
            className="btn-primary"
            onClick={handleStart}
            disabled={!userProfile.city || !userProfile.salary}
          >
            {tx("Start Journey")}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => window.history.back()}
          >
            {tx("Back")}
          </button>
        </div>
      </div>
    </div>
  );
}