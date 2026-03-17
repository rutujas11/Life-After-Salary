
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
import EVENTS from "./data/events";
import { INITIAL_STATE, SALARY_MAP } from "./data/constants";

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
    if (
      screen === "dashboard" &&
      gameState.month > 1 &&   // ❗ prevents event on first load
      gameState.month <= 12 &&
      Math.random() > 0.6      // adjust probability if needed
    ) {
      const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      setCurrentEvent(randomEvent);
      setShowEvent(true);
    }
  }, [gameState.month, screen]);

  // Guard private screens
  useEffect(() => {
    const privateScreens = new Set(["onboarding", "dashboard", "summary"]);
    if (!auth.isAuthenticated && privateScreens.has(screen)) {
      setScreen("login");
    }
  }, [auth.isAuthenticated, screen]);

  const handleDecision = (id, option) => {
    setDecisions(prev => ({
      ...prev,
      [id]: option
    }));
  };

  const nextMonth = () => {
    if (gameState.month >= 12) {
      setScreen("summary");
      return;
    }

    const salaryValue = SALARY_MAP[userProfile.salary] || 50000;

    let updatedState = { ...gameState };

    // 1️⃣ Add salary
    updatedState.balance += salaryValue;

    // 2️⃣ Apply decisions
    Object.values(decisions).forEach(option => {
      if (!option) return;

      let totalCost = 0;

      // 🏠 % based cost (rent etc.)
      if (option.costPercent) {
        totalCost += Math.round(salaryValue * option.costPercent);
      }

      // 🍔 Fixed base cost (food etc.)
      if (option.baseCost) {
        totalCost += option.baseCost;
      }

      // 📊 Lifestyle extra %
      if (option.extraPercent) {
        totalCost += Math.round(salaryValue * option.extraPercent);
      }

      // Deduct total cost
      if (totalCost > 0) {
        updatedState.balance = Math.max(
          0,
          updatedState.balance - totalCost
        );
      }

      // 📈 Apply stress / credit changes
      Object.entries(option.impact || {}).forEach(([key, value]) => {
        updatedState[key] = Math.max(
          0,
          (updatedState[key] ?? 0) + value
        );
      });

      // 💹 Investment handling
      if (option.investmentPercent) {
        const investAmount = Math.round(
          salaryValue * option.investmentPercent
        );

        updatedState.investments =
          (updatedState.investments || 0) + investAmount;

        // 5% growth
        updatedState.wealth =
          (updatedState.wealth || 0) +
          Math.round(investAmount * 1.05);
      }
    });

    // 3️⃣ Recalculate wealth cleanly
    updatedState.wealth =
      (updatedState.balance || 0) +
      (updatedState.savings || 0) +
      (updatedState.investments || 0);

    // 4️⃣ Bankruptcy warning
    if (updatedState.balance <= 0) {
      alert("⚠️ You are bankrupt! Manage wisely.");
    }

    // 5️⃣ Increment month
    updatedState.month += 1;

    setGameState(updatedState);
    setDecisions({});
  };

  const resetGame = () => {
    setGameState({ ...INITIAL_STATE });
    setUserProfile({ city: "", salary: "" });
    setHistory([]);
    setDecisions({});
    setShowEvent(false);
    setCurrentEvent(null);
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
      {screen === "about" && (
        <AboutScreen 
          language={language}
          setScreen={setScreen} 
        />
      )}

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
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setScreen={setScreen}
          onComplete={() => {
            const salaryValue = SALARY_MAP[userProfile.salary] || 50000;

            setGameState({
              ...INITIAL_STATE,
              balance: salaryValue,
              wealth: salaryValue
            });

            setScreen("dashboard");
          }}
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
          salary={SALARY_MAP[userProfile.salary]}
        />
      )}
      {screen === "summary" && (
        <SummaryScreen
          language={language}
          gameState={gameState}
          history={history}
          onReset={resetGame}
          salary={SALARY_MAP[userProfile.salary]}
        />
      )}

      {showEvent && currentEvent && (
        <EventModal
          language={language}
          event={currentEvent}
          onChoose={(option) => {
            let updatedState = { ...gameState };

            // Apply impact safely
            Object.entries(option.impact || {}).forEach(([key, value]) => {
              updatedState[key] = Math.max(
                0,
                (updatedState[key] ?? 0) + value
              );
            });

            // 🔥 Recalculate wealth properly
            updatedState.wealth =
              (updatedState.balance || 0) +
              (updatedState.savings || 0) +
              (updatedState.investments || 0);

            // Save to history
            setHistory(prev => [
              ...prev,
              { event: currentEvent, choice: option, month: gameState.month }
            ]);

            // Update state
            setGameState(updatedState);
            setShowEvent(false);
            setCurrentEvent(null);
          }}
        />
      )}
    </>
  );
}