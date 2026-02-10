/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import HomeScreen from "./pages/HomeScreen";
import AboutScreen from "./pages/AboutScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import DashboardScreen from "./pages/DashboardScreen";
import SummaryScreen from "./pages/SummaryScreen";
import EventModal from "./components/EventModal";

import { INITIAL_STATE } from "./data/constants";
import DECISIONS from "./data/decisions";
import EVENTS from "./data/events";

export default function App() {
  const [language, setLanguage] = useState("EN");
  const [screen, setScreen] = useState("home");

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

  const handleDecision = (id, option) => {
    setDecisions({ ...decisions, [id]: option });

    let state = { ...gameState };
    Object.entries(option.impact).forEach(([key, val]) => {
      state[key] = Math.max(0, state[key] + val);
    });
    setGameState(state);
  };

  const nextMonth = () => {
    if (gameState.month >= 12) return setScreen("summary");

    setGameState({
      ...gameState,
      month: gameState.month + 1,
      balance: gameState.balance + 50000,
    });

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
    <div className="app-container">
      <Navbar
        screen={screen}
        setScreen={setScreen}
        language={language}
        setLanguage={setLanguage}
      />

      {screen === "home" && (
        <HomeScreen 
          language={language}
          onStart={() => setScreen("onboarding")}
          onAbout={() => setScreen("about")}
        />
      )}

      {screen === "about" && 
        <AboutScreen 
          language={language}
          onBack={() => setScreen("home")} 
        />}

      {screen === "onboarding" && (
        <OnboardingScreen 
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          language={language}
          onSubmit={() => setScreen("dashboard")}
        />
      )}

      {screen === "dashboard" && (
        <DashboardScreen
          gameState={gameState}
          decisions={decisions}
          onDecision={handleDecision}
          onNextMonth={nextMonth}
          language={language}
        />
      )}

      {screen === "summary" && (
        <SummaryScreen
          gameState={gameState}
          history={history}
          onReset={resetGame}
          language={language}
        />
      )}

      {showEvent && currentEvent && (
        <EventModal 
          language={language}
          event={currentEvent}
          onChoice={(option) => {
            let updated = { ...gameState };
            Object.entries(option.impact).forEach(([k, v]) => {
              updated[k] = Math.max(0, updated[k] + v);
            });

            setHistory([...history, { event: currentEvent, choice: option, month: gameState.month }]);
            setGameState(updated);
            setShowEvent(false);
          }}
        />
      )}
    </div>
  );
}