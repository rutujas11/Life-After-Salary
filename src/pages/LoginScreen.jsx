import { useState } from "react";
import useTranslate from "../i18n/useTranslate";

export default function LoginScreen({ language, onLogin, onGoToSignup, onGoHome }) {
  const t = useTranslate(language);
  const tx = t.tx;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr(tx("Please fill all fields"));
      return;
    }
    onLogin(email.trim(), password);
  };

  return (
    <div
      className="screen"
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* page background overlay */}
      <div
        className="background-pattern"
        aria-hidden
        style={{
          opacity: 0.08,
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.12) 35px, rgba(255,255,255,.12) 70px)`,
        }}
      />
      <div
        aria-hidden
        className="fullscreen-overlay login-bg-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,46,99,0.08), rgba(8,217,214,0.08))",
          pointerEvents: "none",
        }}
      />

      {/* bg image (soft) */}
          <div
              aria-hidden
              className="fullscreen-overlay login-bg-overlay"
              style={{
                  background: `url('/src/assets/login-bg.jpg') center/cover no-repeat`,
                  opacity: 0.12,
                  mixBlendMode: "screen",
              }}
          />

      {/* Card */}
      <div
        className="onboarding-card"
        style={{
          maxWidth: 520,
          width: "100%",
          borderColor: "rgba(8, 217, 214, 0.45)",
          boxShadow: "0 20px 60px rgba(8, 217, 214, 0.25)",
        }}
      >
        <h2 className="logo" style={{ marginBottom: 6 }}>{tx("Welcome back")}</h2>
        <p className="tagline" style={{ textAlign: "center", marginBottom: 24 }}>
          {tx("Sign in to continue your journey")}
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{tx("Email")}</label>
            <input
              type="email"
              placeholder={tx("you@example.com")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{tx("Password")}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {err ? (
            <div
              style={{
                color: "var(--danger)",
                background: "rgba(255,71,87,0.12)",
                border: "1px solid var(--danger)",
                padding: "10px 12px",
                borderRadius: 10,
                fontWeight: 600,
              }}
            >
              {err}
            </div>
          ) : null}

          <button type="submit" className="btn-primary">
            {tx("Login")}
          </button>
        </form>

        <div className="action-buttons" style={{ marginTop: 18 }}>
          <button className="btn-secondary" onClick={onGoToSignup}>
            {tx("Create an account")}
          </button>
          <button className="btn-secondary" onClick={onGoHome}>
            {tx("Back to Home")}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 12,
  border: "2px solid var(--neon-blue)",
  outline: "none",
  background: "rgba(8,217,214,0.08)",
  color: "var(--text-primary)",
  fontWeight: 600,
};
