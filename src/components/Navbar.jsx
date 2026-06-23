export default function Navbar({
  screen,
  setScreen,
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
}) {
  const firstName =
    user?.name?.trim()?.split(" ")?.[0] ||
    (user?.email ? user.email.split("@")[0] : "");

  return (
    <div className="navbar">
      {/* Logo / Brand */}
      <div
        className="nav-logo"
        onClick={() => setScreen("home")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
        }}
      >
        <img
          src="/app_logo.png"
          alt="Life After Salary"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "10px",
            objectFit: "cover"
          }}
        />

        <span>Life After Salary</span>
      </div>

      {/* Tabs */}
      <div className="nav-tabs">
        <button
          className={screen === "home" ? "active" : ""}
          onClick={() => setScreen("home")}
        >
          🏠 {"Home"}
        </button>

        <button
          className={screen === "about" ? "active" : ""}
          onClick={() => setScreen("about")}
        >
          ℹ️ {"About"}
        </button>

        <button
          className={screen === "onboarding" ? "active" : ""}
          onClick={() => setScreen("onboarding")}
        >
          🎮 {"Play Game"}
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
              {"Login"}
            </button>
            <button
              className={screen === "signup" ? "active" : ""}
              onClick={() => setScreen("signup")}
            >
              {"Sign up"}
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
              {"Hi"},{" "}
              <strong style={{ color: "var(--neon-blue)" }}>
                {firstName || "Player"}
              </strong>
            </span>
            <button onClick={onLogout}>{"Logout"}</button>
          </div>
        )}
        
      </div>
    </div>
  );
}