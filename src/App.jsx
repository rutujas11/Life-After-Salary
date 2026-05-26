
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeScreen from "./pages/HomeScreen";
import AboutScreen from "./pages/AboutScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardScreen from "./pages/DashboardScreen";
import SummaryScreen from "./pages/SummaryScreen";

import "./firebase/firebase";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";

import { db } from "./firebase/firebase";

import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";

import EventModal from "./components/EventModal";
import EVENTS from "./data/events";
import { INITIAL_STATE } from "./data/constants";

import { calculateOptionCost } from "./utils/calculateCost";

export default function App() {
  const [screen, setScreen] = useState("home");

  // === NEW: demo auth state ===
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  // === firebase connection ===
  const saveGame = async (userId, data) => {

    await setDoc(
      doc(db, "gameSaves", userId),
      data
    );
  };

  const loadGame = async (userId) => {

    const snap = await getDoc(
      doc(db, "gameSaves", userId)
    );

    if (snap.exists()) {
      return snap.data();
    }

    return null;
  };

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

  const handleSignup = async (user) => {
    localStorage.setItem(
      "las_session",
      "1"
    );

    localStorage.setItem(
      "las_user",
      JSON.stringify(user)
    );

    setAuth({
      isAuthenticated: true,
      user,
    });

    await saveGame(user.email, {
      gameState: INITIAL_STATE,
      currentCity: "",
      currentSalary: 0,
      history: []
    });

    setScreen("home");
  };

  const handleLogin = async (user) => {
    localStorage.setItem(
      "las_session",
      "1"
    );

    localStorage.setItem(
      "las_user",
      JSON.stringify(user)
    );

    setAuth({
      isAuthenticated: true,
      user,
    });

    const save = await loadGame(user.email);
    if (save) {
      setGameState(
        save.gameState || INITIAL_STATE
      );
      setCurrentCity(
        save.currentCity || ""
      );
      setCurrentSalary(
        save.currentSalary || 0
      );
      setHistory(
        save.history || []
      );
    }
    setScreen("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("las_session");
    setAuth({ isAuthenticated: false, user: null });
    setScreen("home");
  };
  // === END demo auth ===

  const [gameState, setGameState] = useState(INITIAL_STATE);
  const [userProfile, setUserProfile] = useState({ city: "" });
  const [currentSalary, setCurrentSalary] = useState(0);
  const [currentCity, setCurrentCity] = useState("");
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

  useEffect(() => {

    if (!auth?.user) return;

    saveGame(auth.user.email, {
      gameState,
      currentCity,
      currentSalary,
      history
    });

  }, [
    gameState,
    currentCity,
    currentSalary,
    history,
    auth
  ]);

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

    const salaryValue = currentSalary || 50000;

    let updatedState = { ...gameState };

    // 1️⃣ Add salary
    updatedState.balance += salaryValue;

    // 2️⃣ Apply decisions
    let monthlyExpenses = 0;
    Object.values(decisions).forEach(option => {
      if (!option) return;

      let totalCost = 0;

      const decisionId = Object.keys(decisions).find(
        key => decisions[key] === option
      );

      totalCost = calculateOptionCost(
        option,
        decisionId,
        salaryValue,
        currentCity
      );

      monthlyExpenses += totalCost;
      totalCost = Math.round(totalCost);

      if (totalCost > updatedState.balance) {
        alert(
          `⚠️ Insufficient balance.\nYou need ₹${totalCost.toLocaleString()} but only have ₹${updatedState.balance.toLocaleString()}`
        );
      }

      // Deduct total cost
      if (totalCost > 0) {
        updatedState.balance -= totalCost;
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

    if (monthlyExpenses > updatedState.balance) {
      alert(
        "⚠️ You cannot proceed.\nYour monthly expenses exceed your balance."
      );

      return;
    }

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
        isAuthenticated={auth.isAuthenticated}
        user={auth.user}
        onLogout={handleLogout}
      />

      {/* Public screens */}
      {screen === "home" && (
        <HomeScreen
          onStart={() => setScreen(auth.isAuthenticated ? "onboarding" : "signup")}
          onAbout={() => setScreen("about")}
        />
      )}
      {screen === "about" && (
        <AboutScreen 
          setScreen={setScreen} 
        />
      )}

      {/* NEW: auth screens */}
      {screen === "login" && (
        <LoginScreen 
          onLogin={handleLogin}
          onGoToSignup={() => setScreen("signup")}
          onGoHome={() => setScreen("home")}
        />
      )}
      {screen === "signup" && (
        <SignupScreen
          onSignup={handleSignup}
          onGoToLogin={() => setScreen("login")}
          onGoHome={() => setScreen("home")}
        />
      )}

      {/* Private screens */}
      {screen === "onboarding" && (
        <OnboardingScreen
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          setScreen={setScreen}
          currentSalary={currentSalary}          // ✅ ADD
          setCurrentSalary={setCurrentSalary}    // ✅ ADD
              
          onComplete={() => {
            const salaryValue = currentSalary || 50000;

            setCurrentSalary(salaryValue);
            setCurrentCity(userProfile.city);

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
          gameState={gameState}
          decisions={decisions}
          onDecide={handleDecision}
          onNext={nextMonth}
          onReset={resetGame}
          currentSalary={currentSalary}
          currentCity={currentCity}
          setCurrentSalary={setCurrentSalary}
          setCurrentCity={setCurrentCity}
          setGameState={setGameState}
        />
      )}
      {screen === "summary" && (
        <SummaryScreen
          gameState={gameState}
          history={history}
          onReset={resetGame}
          salary={currentSalary}
        />
      )}

      {showEvent && currentEvent && (
        <EventModal
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