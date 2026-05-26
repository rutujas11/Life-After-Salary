import { useState } from "react";
import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase/firebase";

export default function LoginScreen({ onLogin, onGoToSignup, onGoHome }) {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    if (!email || !password) {
      setErr("Please fill all fields");
      return;
    }

    try {
      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      onLogin({
        name:
          userCredential.user.displayName || "",
        email: email.trim(),
      });

    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setErr("Invalid email or password");
      } else {
        setErr(error.message);
      }
    }
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
        <h2 className="logo" style={{ marginBottom: 6 }}>{"Welcome back"}</h2>
        <p className="tagline" style={{ textAlign: "center", marginBottom: 24 }}>
          {"Sign in to continue your journey"}
        </p>

        <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">{"Email"}</label>
            <input
              type="email"
              placeholder={"you@example.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">{"Password"}</label>
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
            {"Login"}
          </button>
        </form>

        <div className="action-buttons" style={{ marginTop: 18 }}>
          <button className="btn-secondary" onClick={onGoToSignup}>
            {"Create an account"}
          </button>
          <button className="btn-secondary" onClick={onGoHome}>
            {"Back to Home"}
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
