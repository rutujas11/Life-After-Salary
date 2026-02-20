import { useState } from "react";
import useTranslate from "../i18n/useTranslate";

export default function SignupScreen({ language, onSignup, onGoToLogin, onGoHome }) {
  const t = useTranslate(language);
  const tx = t.tx;

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [err, setErr]           = useState("");

  const submit = (e) => {
    e.preventDefault();
    setErr("");
    if (!fullName || !email || !password || !confirm) {
      setErr(tx("Please fill all fields"));
      return;
    }
    if (password !== confirm) {
      setErr(tx("Passwords don’t match"));
      return;
    }
    onSignup(fullName.trim(), email.trim(), password);
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
      <div className="background-pattern" aria-hidden />

      {/* subtle gradient wash */}
      <div
        aria-hidden
        className="fullscreen-overlay signup-bg-overlay"
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(135deg, rgba(255,46,99,0.08), rgba(255,217,61,0.08))",
          pointerEvents: "none",
        }}
      />

      {/* bg image */}
          <div
              aria-hidden
              className="fullscreen-overlay signup-bg-overlay"
              style={{
                  background: `url('/src/assets/signup-bg.jpg') center/cover no-repeat`,
                  opacity: 0.12,
                  mixBlendMode: "screen",
              }}
          />

      <div
        className="onboarding-card"
        style={{
          maxWidth: 560,
          width: "100%",
          borderColor: "rgba(255, 46, 99, 0.45)",
          boxShadow: "0 20px 60px rgba(255,46,99,0.25)",
        }}
      >
        <h2 className="logo" style={{ marginBottom: 6 }}>{tx("Create your account")}</h2>
        <p className="tagline" style={{ textAlign: "center", marginBottom: 24 }}>
          {tx("It only takes a minute")}
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{tx("Full name")}</label>
            <input
              type="text"
              placeholder={tx("e.g., Aditi Sharma")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

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
              placeholder={tx("At least 6 characters")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              minLength={6}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{tx("Confirm password")}</label>
            <input
              type="password"
              placeholder={tx("Re-enter password")}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={inputStyle}
              minLength={6}
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
            {tx("Create account")}
          </button>
        </form>

        <div className="action-buttons" style={{ marginTop: 18 }}>
          <button className="btn-secondary" onClick={onGoToLogin}>
            {tx("Have an account? Login")}
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
  border: "2px solid var(--neon-pink)",
  outline: "none",
  background: "rgba(255, 46, 99, 0.08)",
  color: "var(--text-primary)",
  fontWeight: 600,
};
