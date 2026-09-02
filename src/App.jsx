
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomeScreen from "./pages/HomeScreen";
import AboutScreen from "./pages/AboutScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardScreen from "./pages/DashboardScreen";
import SummaryScreen from "./pages/SummaryScreen";
import "./App.css";

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
import { Toaster, toast } from "react-hot-toast";

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
    try {
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

      toast.success("🎉 Account Created Successfully");

      setScreen("home");

    } catch (error) {

      console.error("Signup save failed:", error);

      toast.success(
        "🎉 Account Created Successfully"
      );

      setScreen("home");
    }
  };

  const handleLogin = async (user) => {
    try {
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

      toast.success("✅ Login Successful");

      setScreen("home");

    } catch (error) {

      console.error("Login load failed:", error);

      toast.success(
        "✅ Login Successful"
      );

      setScreen("home");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("las_session");
    localStorage.removeItem("las_user");

    setAuth({
      isAuthenticated: false,
      user: null
    });

    toast.success("👋 Logged Out Successfully");

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

    updatedState.totalIncome =
      (updatedState.totalIncome || 0) + salaryValue;

    // 2️⃣ Apply decisions
    let monthlyExpenses = 0;

    Object.entries(decisions).forEach(([decisionId, option]) => {
      if (!option) return;

      const totalCost = calculateOptionCost(
        option,
        decisionId,
        salaryValue,
        currentCity
      );

      monthlyExpenses += totalCost;

      if (totalCost > 0) {
        updatedState.balance -= totalCost;
      }

      Object.entries(option.impact || {}).forEach(([key, value]) => {
        updatedState[key] = Math.max(
          0,
          (updatedState[key] ?? 0) + value
        );
      });

      if (option.investmentPercent) {
        const investAmount = Math.round(
          salaryValue * option.investmentPercent
        );

        updatedState.investments =
          (updatedState.investments || 0) + investAmount;

        updatedState.wealth =
          (updatedState.wealth || 0) +
          Math.round(investAmount * 1.05);
      }
    });

    // 3️⃣ Recalculate wealth cleanly
    updatedState.totalExpenses =
      (updatedState.totalExpenses || 0) +
      monthlyExpenses;

    updatedState.wealth =
      (updatedState.savings || 0) +
      (updatedState.investments || 0);
    // 4️⃣ Bankruptcy warning
    if (updatedState.balance <= 0) {
      toast.success("⚠️ You are bankrupt! Manage wisely.");
    }

    let monthlyScore = 0;

    // ✅ Positive balance reward
    if (updatedState.balance > 0) {
      monthlyScore += 50;
    }

    // ✅ Savings reward
    monthlyScore += Math.round(
      (updatedState.savings || 0) / 1000
    );

    // ✅ Investment reward
    monthlyScore += Math.round(
      (updatedState.investments || 0) / 1000
    );

    // ✅ Wealth reward
    monthlyScore += Math.round(
      (updatedState.wealth || 0) / 5000
    );

    // ✅ Credit score reward
    monthlyScore += Math.round(
      (updatedState.creditScore || 0) / 50
    );

    // ✅ Low stress bonus
    if ((updatedState.stress || 0) < 40) {
      monthlyScore += 30;
    }

    // ❌ High stress penalty
    if ((updatedState.stress || 0) > 70) {
      monthlyScore -= 40;
    }

    // ❌ Overspending punishment
    if (updatedState.balance < 0) {
      monthlyScore -= 100;
    }

    // ❌ Scam risk punishment
    monthlyScore -= Math.round(
      (updatedState.scamRisk || 0) / 5
    );

    // ✅ Final score
    updatedState.score =
      Math.max(
        0,
        (updatedState.score || 0) +
        monthlyScore
      );

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
    // setScreen("home");
    setCurrentSalary(0);
    setCurrentCity("");
    setScreen("onboarding");
  };

  return (
    <>
      {screen !== "login" &&
        screen !== "signup" && (
          <Navbar
            screen={screen}
            setScreen={setScreen}
            isAuthenticated={auth.isAuthenticated}
            user={auth.user}
            onLogout={handleLogout}
            onReset={resetGame}
          />
        )}

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
              wealth: 0,
              totalIncome: 0,
              totalExpenses: 0
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
          setDecisions={setDecisions}
          setScreen={setScreen}
          onLogout={handleLogout}
          user={auth.user}
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

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid #08d9d6",
            borderRadius: "12px",
            padding: "14px",
          },
        }}
      />
    </>
  );
}