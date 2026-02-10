
import { CITIES, SALARIES } from "../data/constants";
import useTranslate from "../i18n/useTranslate";

export default function OnboardingScreen({
  userProfile,
  setUserProfile,
  onSubmit,
  language,
}) {
  const t = useTranslate(language);
  const tx = t.tx;

  return (
    <div className="screen">
      <div className="header">
        <h1 className="logo">{tx("Life After Salary")}</h1>
        <p className="tagline">{tx("Your Financial Journey Starts Here")}</p>
      </div>

      <div className="onboarding-card">
        {/* City */}
        <div className="form-group">
          <label className="form-label">{tx("Choose Your City")}</label>
          <div className="select-grid">
            {CITIES.map((city) => (
              <div
                key={city}
                className={`select-option ${
                  userProfile.city === city ? "selected" : ""
                }`}
                onClick={() => setUserProfile({ ...userProfile, city })}
              >
                {tx(city)}
              </div>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div className="form-group">
          <label className="form-label">{tx("Select Your Salary Range")}</label>
          <div className="select-grid">
            {SALARIES.map((salary) => (
              <div
                key={salary}
                className={`select-option ${
                  userProfile.salary === salary ? "selected" : ""
                }`}
                onClick={() => setUserProfile({ ...userProfile, salary })}
              >
                {tx(salary)}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={onSubmit}
          disabled={!userProfile.city || !userProfile.salary}
        >
          {tx("Start Journey")}
        </button>
      </div>
    </div>
  );
}