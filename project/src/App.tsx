import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { GameProvider } from "./context/GameContext";
import { TokenProvider } from "./context/TokenContext";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Subjects from "./pages/subjects/Subjects";
import SubjectDetail from "./pages/subjects/SubjectDetail";
import StudyMaterials from "./pages/learning/StudyMaterials";
import GamesQuiz from "./pages/assessment/GamesQuiz";
import Games from "./pages/games/Games";
import Game from "./pages/games/Game";
import VideoPage from "./pages/media/VideoPage";
import ProfessionalQuizzes from "./pages/assessment/ProfessionalQuizzes";
import ProfessionalQuiz from "./pages/assessment/ProfessionalQuiz";

import Community from "./pages/community/Community";
import ParentalControl from "./pages/parental/ParentalControl";
import Contact from "./pages/contact/Contact";
import Flashcards from "./pages/learning/Flashcards";
import Notes from "./pages/learning/Notes";
import Mathematics from "./pages/subjects/Mathematics";
import Science from "./pages/subjects/Science";
import SocialScience from "./pages/subjects/SocialScience";
import English from "./pages/subjects/English";
import Progress from "./pages/progress/Progress";
import Team from "./pages/about/Team";
import AdminPanel from "./pages/admin/AdminPanel";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import StartupAnimation from "./components/animation/StartupAnimation";
import LearnerBot from "./features/learnerbot/EmbeddedLearnerBot";
import Vault from "./components/features/vault/Vault";

// Import game components
import EnhancedHistoryGame from "./components/games/HistoryGame/EnhancedHistoryGame";
import GrammarWarrior from "./components/games/GrammarWarrior/GrammarWarrior";

function App() {
  const [showStartupAnimation, setShowStartupAnimation] = useState(true);

  useEffect(() => {
    // Temporarily disable localStorage check to always show animation
    // const hasSeenAnimation = localStorage.getItem('hasSeenStartupAnimation');
    // if (hasSeenAnimation) {
    //   setShowStartupAnimation(false);
    // }

    // Clear localStorage to reset animation
    localStorage.removeItem("hasSeenStartupAnimation");
  }, []);

  const handleAnimationComplete = () => {
    setShowStartupAnimation(false);
    localStorage.setItem("hasSeenStartupAnimation", "true");
  };

  if (showStartupAnimation) {
    return <StartupAnimation onComplete={handleAnimationComplete} />;
  }

  return (
    <AuthProvider>
      <TokenProvider>
        <GameProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/:slug" element={<SubjectDetail />} />
                <Route path="/subjects/:slug/:chapterId" element={<SubjectDetail />} />
                <Route path="/subjects/:slug/:chapterId/videos" element={<VideoPage />} />
                <Route path="/study-materials" element={<StudyMaterials />} />
                <Route path="/games-quiz" element={<GamesQuiz />} />
                <Route path="/games" element={<Games />} />
                
                {/* Integrated game routes */}
                <Route path="/games/history-game" element={<EnhancedHistoryGame />} />
                <Route path="/games/grammar-warrior" element={<GrammarWarrior />} />
                
                {/* Redirect standard quiz routes to Professional Quizzes UI */}
                <Route path="/quizzes" element={<ProfessionalQuizzes />} />
                <Route path="/quiz/:id" element={<ProfessionalQuiz />} />
                {/* Redirect legacy or generic quiz links to professional quizzes */}
                <Route path="/quiz" element={<Navigate to="/quizzes" replace />} />
                <Route path="/professional-quizzes" element={<Navigate to="/quizzes" replace />} />
                <Route path="/game/:id" element={<Game />} />
                <Route path="/professional-quizzes" element={<ProfessionalQuizzes />} />
                <Route path="/professional-quiz/:id" element={<ProfessionalQuiz />} />

                <Route path="/community" element={<Community />} />
                <Route path="/parental-control" element={<ParentalControl />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/mathematics" element={<Mathematics />} />
                <Route path="/science" element={<Science />} />
                <Route path="/social-science" element={<SocialScience />} />
                <Route path="/english" element={<English />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/team" element={<Team />} />
                <Route path="/learnerbot" element={<LearnerBot />} />
                <Route path="/tokens" element={<Vault />} />
              </Routes>
            </main>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              {/* Vault is accessible via /tokens route in the navbar */}
            </div>
            <Footer />
          </div>
          </Router>
        </GameProvider>
      </TokenProvider>
    </AuthProvider>
  );
}

export default App;
