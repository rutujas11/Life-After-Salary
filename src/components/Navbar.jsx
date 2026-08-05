import { useState } from "react";

export default function Navbar({
  screen,
  setScreen,
  isAuthenticated = false,
  user = null,
  onLogout = () => {},
  onReset = () => {},
}) {
  const [showMenu, setShowMenu] = useState(false);

  const firstName =
    user?.name?.trim()?.split(" ")[0] ||
    (user?.email ? user.email.split("@")[0] : "Player");

  return (
    <>
      <div className="navbar">

        {/* Mobile Hamburger */}
        <button
          className="menu-trigger mobile-only"
          onClick={() => setShowMenu(true)}
        >
          ☰
        </button>
        
        {/* Logo */}
        <div
          className="nav-logo"
          onClick={() => setScreen("home")}
        >
          <img
            src="/app_logo.png"
            alt="Life After Salary"
            className="nav-logo-img"
          />

          <span className="nav-logo-text">
            Life After Salary
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-tabs desktop-nav">
          <button
            className={screen === "home" ? "active" : ""}
            onClick={() => setScreen("home")}
          >
            🏠 Home
          </button>

          <button
            className={screen === "about" ? "active" : ""}
            onClick={() => setScreen("about")}
          >
            ℹ️ About
          </button>

          <button
            className="drawer-link"
            onClick={() => {
              if (screen === "dashboard") {
                setShowMenu(false);
                return;
              }

              setScreen(isAuthenticated ? "dashboard" : "onboarding");
              setShowMenu(false);
            }}
          >
            🎮 {isAuthenticated ? "Continue Game" : "Play Game"}
          </button>
        </div>

        {/* Desktop Auth */}
        <div className="desktop-nav">
          {!isAuthenticated ? (
            <div
              className="nav-lang"
              style={{ display: "flex", gap: 8 }}
            >
              <button
                className={screen === "login" ? "active" : ""}
                onClick={() => setScreen("login")}
              >
                Login
              </button>

              <button
                className={screen === "signup" ? "active" : ""}
                onClick={() => setScreen("signup")}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div
              className="nav-lang"
              style={{ display: "flex", gap: 8 }}
            >
              <span
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "2px solid var(--neon-blue)",
                  color: "var(--text-secondary)",
                  fontWeight: 700,
                }}
              >
                Hi,{" "}
                <strong style={{ color: "var(--neon-blue)" }}>
                  {firstName}
                </strong>
              </span>

              <button onClick={onLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

        
      </div>

      {/* Mobile Drawer */}
      {showMenu && (
        <>
          <div
            className="drawer-overlay"
            onClick={() => setShowMenu(false)}
          />

          <div className="side-drawer">
            <div className="drawer-top">
              <button
                className="close-btn"
                onClick={() => setShowMenu(false)}
              >
                ✕
              </button>

              <div className="profile-avatar">👤</div>

              <h3 className="profile-name">
                {firstName}
              </h3>
            </div>

            <button
              className="drawer-link"
              onClick={() => {
                setScreen("home");
                setShowMenu(false);
              }}
            >
              🏠 Home
            </button>

            <button
              className="drawer-link"
              onClick={() => {
                setScreen("about");
                setShowMenu(false);
              }}
            >
              ℹ️ About
            </button>

            {/* <button
              className="drawer-link"
              onClick={() => {
                setScreen("onboarding");
                setShowMenu(false);
              }}
            >
              🎮 Play Game
            </button> */}

            <button
              className="drawer-link"
              onClick={() => {
                if (screen === "dashboard") {
                  setShowMenu(false);
                  return;
                }

                setScreen(isAuthenticated ? "dashboard" : "onboarding");
                setShowMenu(false);
              }}
            >
              🎮 {isAuthenticated ? "Continue Game" : "Play Game"}
            </button>

            {isAuthenticated && (
              <>
                <button
                  className="drawer-link"
                  onClick={() => {
                    onReset();
                    setShowMenu(false);
                  }}
                >
                  🔄 Start New Game
                </button>

                <button
                  className="drawer-link"
                  onClick={() => {
                    onLogout();
                    setShowMenu(false);
                  }}
                >
                  🚪 Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <button
                  className="drawer-link"
                  onClick={() => {
                    setScreen("login");
                    setShowMenu(false);
                  }}
                >
                  🔑 Login
                </button>

                <button
                  className="drawer-link"
                  onClick={() => {
                    setScreen("signup");
                    setShowMenu(false);
                  }}
                >
                  📝 Sign Up
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}