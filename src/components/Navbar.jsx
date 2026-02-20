import LanguageToggle from "./LanguageToggle";
import useTranslate from "../i18n/useTranslate";

export default function Navbar({
  screen,
  setScreen,
  language,
  setLanguage,
  // auth props
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
}) {
  const t = useTranslate(language);
  const tx = t.tx;

  const firstName =
    user?.name?.trim()?.split(" ")?.[0] ||
    (user?.email ? user.email.split("@")[0] : "");

  return (
    <div className="navbar">
      {/* Logo / Brand */}
      <div className="nav-logo" onClick={() => setScreen("home")}>
        💸 {tx("Life After Salary")}
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

      {/* Right side: AUTH (styled like language buttons) + LanguageToggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Auth buttons first */}
        {!isAuthenticated ? (
          <div className="nav-lang" style={{ marginRight: 6 }}>
            <button
              // optional: highlight the current auth screen
              className={screen === "login" ? "active" : ""}
              onClick={() => setScreen("login")}
            >
              {tx("Login")}
            </button>
            <button
              className={screen === "signup" ? "active" : ""}
              onClick={() => setScreen("signup")}
            >
              {tx("Sign up")}
            </button>
          </div>
        ) : (
          <div className="nav-lang" style={{ marginRight: 6, display: "flex", gap: 8 }}>
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "2px solid var(--neon-blue)",
                color: "var(--text-secondary)",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {tx("Hi")},{" "}
              <strong style={{ color: "var(--neon-blue)" }}>
                {firstName || tx("Player")}
              </strong>
            </span>
            <button onClick={onLogout}>{tx("Logout")}</button>
          </div>
        )}

        {/* Language toggle after auth buttons */}
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>
    </div>
  );
}