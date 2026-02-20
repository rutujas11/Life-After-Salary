/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeScreen from "./pages/HomeScreen";
import AboutScreen from "./pages/AboutScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardScreen from "./pages/DashboardScreen";
import SummaryScreen from "./pages/SummaryScreen";

import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";

import EventModal from "./components/EventModal";
import { INITIAL_STATE } from "./data/constants";
import DECISIONS from "./data/decisions";
import EVENTS from "./data/events";
import useTranslate from "./i18n/useTranslate";

export default function App() {
  const [language, setLanguage] = useState("EN");
  const [screen, setScreen] = useState("home");

  // === NEW: demo auth state ===
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  // restore session
  useEffect(() => {
    const session = localStorage.getItem("las_session");
    const userRaw = localStorage.getItem("las_user");
    if (session === "1" && userRaw) {
      try {
        setAuth({ isAuthenticated: true, user: JSON.parse(userRaw) });
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        // Fallback – clear bad data so it doesn't break next time
        localStorage.removeItem("las_user");
      }
    }
  }, []);

  const handleSignup = (name, email, password) => {
    const user = { name, email };
    localStorage.setItem("las_user", JSON.stringify(user));
    localStorage.setItem("las_credentials", JSON.stringify({ email, password }));
    localStorage.setItem("las_session", "1");
    setAuth({ isAuthenticated: true, user });
    setScreen("home"); // start flow
  };

  const handleLogin = (email, password) => {
    const credsRaw = localStorage.getItem("las_credentials");
    if (!credsRaw) {
      alert("No account found. Please sign up.");
      setScreen("signup");
      return;
    }
    try {
      const creds = JSON.parse(credsRaw);
      if (creds.email === email && creds.password === password) {
        const user = JSON.parse(localStorage.getItem("las_user") || "{}");
        localStorage.setItem("las_session", "1");
        setAuth({ isAuthenticated: true, user });
        setScreen("home");
      } else {
        alert("Invalid email or password");
      }
    } catch {
      alert("Invalid email or password");
    }
  };

  const handleLogout = () => {
    localStorage.setItem("las_session", "0");
    setAuth({ isAuthenticated: false, user: null });
    setScreen("home");
  };
  // === END demo auth ===

  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [userProfile, setUserProfile] = useState({ city: "", salary: "" });
  const [decisions, setDecisions] = useState({});
  const [history, setHistory] = useState([]);
  const [showEvent, setShowEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  useEffect(() => {
    if (screen === "dashboard" && gameState.month <= 12 && Math.random() > 0.7) {
      const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setCurrentEvent(randomEvent);
      setShowEvent(true);
    }
  }, [screen, gameState.month]);

  // Guard private screens
  useEffect(() => {
    const privateScreens = new Set(["onboarding", "dashboard", "summary"]);
    if (!auth.isAuthenticated && privateScreens.has(screen)) {
      setScreen("login");
    }
  }, [auth.isAuthenticated, screen]);

  // const handleDecision = (id, option) => {
  //   setDecisions({ ...decisions, [id]: option });
  //   const next = { ...gameState };
  //   Object.entries(option.impact).forEach(([k, v]) => {
  //     next[k] = Math.max(0, next[k] + v);
  //   });
  //   setGameState(next);
  // };

  const handleDecision = (id, option) => {
    setDecisions(prev => ({
      ...prev,
      [id]: option
    }));
  };

  
  // const nextMonth = () => {
  //   if (gameState.month >= 12) return setScreen("summary");
  //   setGameState({
  //     ...gameState,
  //     month: gameState.month + 1,
  //     balance: gameState.balance + 50000,
  //   });
  //   setDecisions({});
  // };

  const nextMonth = () => {
    if (gameState.month >= 12) {
      setScreen("summary");
      return;
    }

    let updatedState = { ...gameState };

    // 1️⃣ Add salary first
    const monthlySalary = Number(userProfile.salary) || 50000;
    updatedState.balance += monthlySalary;

    // 2️⃣ Apply each selected decision ONCE
    Object.values(decisions).forEach(option => {
      if (!option?.impact) return;

      Object.entries(option.impact).forEach(([key, value]) => {
        updatedState[key] = Math.max(
          0,
          (updatedState[key] ?? 0) + value
        );
      });
    });

    // 3️⃣ Increment month
    updatedState.month += 1;

    setGameState(updatedState);
    setDecisions({});
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
    setUserProfile({ city: "", salary: "" });
    setHistory([]);
    setDecisions({});
    setScreen("home");
  };

  return (
    <>
      <Navbar
        screen={screen}
        setScreen={setScreen}
        language={language}
        setLanguage={setLanguage}
        // NEW props
        isAuthenticated={auth.isAuthenticated}
        user={auth.user}
        onLogout={handleLogout}
      />

      {/* Public screens */}
      {screen === "home" && (
        <HomeScreen language={language}
          onStart={() => setScreen(auth.isAuthenticated ? "onboarding" : "signup")}
          onAbout={() => setScreen("about")}
        />
      )}
      {screen === "about" && <AboutScreen onBack={() => setScreen("home")} />}

      {/* NEW: auth screens */}
      {screen === "login" && (
        <LoginScreen 
          language={language}
          onLogin={handleLogin}
          onGoToSignup={() => setScreen("signup")}
          onGoHome={() => setScreen("home")}
        />
      )}
      {screen === "signup" && (
        <SignupScreen
          language={language}
          onSignup={handleSignup}
          onGoToLogin={() => setScreen("login")}
          onGoHome={() => setScreen("home")}
        />
      )}

      {/* Private screens */}
      {screen === "onboarding" && (
        <OnboardingScreen
          language={language}
          userProfile={userProfile}           // <-- REQUIRED
          setUserProfile={setUserProfile}
          onComplete={() => setScreen("dashboard")}
        />
      )}
      {screen === "dashboard" && (
        <DashboardScreen
          language={language}
          gameState={gameState}
          decisions={decisions}
          onDecide={handleDecision}
          onNext={nextMonth}
          onReset={resetGame}
        />
      )}
      {screen === "summary" && (
        <SummaryScreen
          language={language}
          gameState={gameState}
          history={history}
          onRestart={() => {
            resetGame();
            setScreen("home");
          }}
        />
      )}

      {showEvent && currentEvent && (
        <EventModal language={language}
          event={currentEvent}
          onChoose={(option) => {
            const next = { ...gameState };
            Object.entries(option.impact).forEach(([k, v]) => {
              next[k] = Math.max(0, next[k] + v);
            });
            setHistory([...history, { event: currentEvent, choice: option, month: gameState.month }]);
            setGameState(next);
            setShowEvent(false);
          }}
        />
      )}
    </>
  );
}