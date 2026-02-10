import LanguageToggle from "./LanguageToggle";
import useTranslate from "../i18n/useTranslate";

export default function Navbar({ screen, setScreen, language, setLanguage }) {
  const t = useTranslate(language);
  const tx = t.tx;

  return (
    <div className="navbar">
      {/* Logo / Brand */}
      <div className="nav-logo" onClick={() => setScreen("home")}>
        {/* Website name translates */}
        {tx("Life After Salary")}
      </div>

      {/* Tabs */}
      <div className="nav-tabs">
        <button
          className={screen === "home" ? "active" : ""}
          onClick={() => setScreen("home")}
        >
          🏠 {tx("Home")}
        </button>

        <button
          className={screen === "about" ? "active" : ""}
          onClick={() => setScreen("about")}
        >
          ℹ️ {tx("About")}
        </button>

        <button
          className={screen === "onboarding" ? "active" : ""}
          onClick={() => setScreen("onboarding")}
        >
          🎮 {tx("Play Game")}
        </button>
      </div>

      {/* Language buttons */}
      <LanguageToggle language={language} setLanguage={setLanguage} />
    </div>
  );
}