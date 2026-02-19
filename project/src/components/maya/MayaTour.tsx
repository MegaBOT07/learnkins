import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  Gamepad2,
  Users,
  Wallet,
  Bot,
  Star,
  Home,
  Trophy,
} from "lucide-react";

const MAYA_KEY = "learnkins_maya_tour_done";

interface TourStep {
  title: string;
  message: string;
  icon: React.ReactNode;
  color: string;
  action?: { label: string; path: string };
  highlight?: "navbar" | "bottom";
  emoji: string;
}

const STEPS: TourStep[] = [
  {
    emoji: "👋",
    title: "Hey there! I'm Maya!",
    message:
      "Welcome to LearnKins — your smart interactive learning platform! I'm Maya, your personal guide. Let me give you a quick tour so you can make the most of everything here. Ready?",
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    emoji: "🏠",
    title: "Your Home Base",
    message:
      "The Home page is your starting point. You'll find featured subjects, quick-start activities, and a summary of what's happening on the platform. Click the LearnKins logo anytime to return here.",
    icon: <Home className="h-5 w-5" />,
    color: "from-blue-500 to-cyan-500",
    action: { label: "Go to Home", path: "/" },
    highlight: "navbar",
  },
  {
    emoji: "📚",
    title: "Explore Subjects",
    message:
      "Head to Subjects to dive into Mathematics, Science, Social Science, and English. Each subject has chapters, study notes, videos, and quizzes! Perfect for Class 6–8 students.",
    icon: <BookOpen className="h-5 w-5" />,
    color: "from-green-500 to-teal-500",
    action: { label: "Browse Subjects", path: "/subjects" },
    highlight: "navbar",
  },
  {
    emoji: "🎮",
    title: "Games & Quizzes",
    message:
      "Learning is more fun when it's a game! Try our interactive quizzes and games. Compete, earn points, and level up. The more you play, the better you get!",
    icon: <Gamepad2 className="h-5 w-5" />,
    color: "from-orange-500 to-red-500",
    action: { label: "Play Now", path: "/games-quiz" },
    highlight: "navbar",
  },
  {
    emoji: "🃏",
    title: "Flashcard Magic",
    message:
      "Flashcards are a superpower for memorizing concepts fast. Create your own cards or use our pre-made decks. Flip, test yourself, and watch your scores soar!",
    icon: <Star className="h-5 w-5" />,
    color: "from-yellow-500 to-orange-500",
    action: { label: "Try Flashcards", path: "/flashcards" },
  },
  {
    emoji: "💎",
    title: "Your Wallet",
    message:
      "Every time you complete a quiz, win a game, or log in daily, you earn tokens! Tokens appear in your Wallet. Watch your balance grow as you learn more!",
    icon: <Wallet className="h-5 w-5" />,
    color: "from-purple-600 to-indigo-600",
    action: { label: "Open Wallet", path: "/tokens" },
  },
  {
    emoji: "🤖",
    title: "Meet LearnerBot",
    message:
      "Stuck on a problem? LearnerBot is your AI-powered study buddy! Ask any question and get instant, clear explanations. Available 24/7, right inside LearnKins.",
    icon: <Bot className="h-5 w-5" />,
    color: "from-cyan-500 to-blue-600",
    action: { label: "Chat with LearnerBot", path: "/learnerbot" },
  },
  {
    emoji: "👥",
    title: "Join the Community",
    message:
      "Connect with fellow learners, ask questions, share tips, and form study groups! Learning together is always more powerful than learning alone.",
    icon: <Users className="h-5 w-5" />,
    color: "from-pink-500 to-rose-500",
    action: { label: "Visit Community", path: "/community" },
  },
  {
    emoji: "🚀",
    title: "You're All Set!",
    message:
      "That's everything you need to know to get started! Remember, I'm always just a click away if you need help. Now go explore and have fun learning! 🎉",
    icon: <Trophy className="h-5 w-5" />,
    color: "from-yellow-400 to-pink-500",
    highlight: "bottom",
  },
];

const MayaAvatar: React.FC<{ pulse?: boolean }> = ({ pulse }) => (
  <div className="relative">
    <div
      className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg shadow-purple-500/40 border-2 border-white/20 ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      🧑‍🏫
    </div>
    {pulse && (
      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
      </span>
    )}
  </div>
);

interface MayaTourProps {
  onDone?: () => void;
}

const MayaTour: React.FC<MayaTourProps> = ({ onDone }) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(MAYA_KEY);
    if (!done) {
      // Small delay before showing tour so page fully loads
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const complete = () => {
    localStorage.setItem(MAYA_KEY, "true");
    setVisible(false);
    onDone?.();
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      complete();
    }
  };

  const handleAction = (path: string) => {
    navigate(path);
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  if (!visible) return null;

  return (
    <AnimatePresence>
      {/* Floating trigger (minimized state) */}
      {minimized ? (
        <motion.button
          key="maya-mini"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => setMinimized(false)}
          className="fixed bottom-6 right-6 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-xl shadow-purple-500/40 border-2 border-white/20 hover:scale-110 transition-transform"
          title="Resume Maya's tour"
        >
          🧑‍🏫
          <span className="absolute -right-1 -top-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500" />
          </span>
        </motion.button>
      ) : (
        <motion.div
          key="maya-panel"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="fixed bottom-6 right-6 z-[9999] w-[340px] max-w-[calc(100vw-2rem)]"
        >
          {/* Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gray-950 border border-white/10 shadow-2xl shadow-black/60">
            {/* Gradient top border strip */}
            <div className={`h-1 w-full bg-gradient-to-r ${current.color}`} />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <div className="flex items-center gap-3">
                <MayaAvatar pulse />
                <div>
                  <div className="text-xs font-bold text-purple-400 tracking-wide uppercase">Maya · Your Guide</div>
                  <div className="flex gap-1 mt-1">
                    {STEPS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === step
                            ? "w-4 bg-purple-400"
                            : i < step
                            ? "w-1.5 bg-purple-700"
                            : "w-1.5 bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-colors text-xs"
                  title="Minimize"
                >
                  —
                </button>
                <button
                  onClick={complete}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white/10 hover:text-white transition-colors"
                  title="Skip tour"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="px-4 pb-4"
              >
                {/* Emoji + Title */}
                <div className="flex items-start gap-3 mt-2">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${current.color} shadow-lg text-xl`}>
                    {current.emoji}
                  </div>
                  <div>
                    <div className="font-bold text-white leading-tight">{current.title}</div>
                    <div className="mt-1.5 text-sm text-gray-300 leading-relaxed">{current.message}</div>
                  </div>
                </div>

                {/* Action button */}
                {current.action && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    onClick={() => handleAction(current.action!.path)}
                    className={`mt-3 w-full rounded-xl bg-gradient-to-r ${current.color} px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 transition-all shadow-md`}
                  >
                    {current.action.label} →
                  </motion.button>
                )}

                {/* Navigation */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={() => setStep((s) => Math.max(s - 1, 0))}
                    disabled={step === 0}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  <span className="text-xs text-gray-600">
                    {step + 1} / {STEPS.length}
                  </span>
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-white transition-all ${
                      isLast
                        ? "bg-gradient-to-r from-yellow-500 to-pink-500 hover:opacity-90"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {isLast ? "🎉 Done!" : <>Next <ChevronRight className="h-3.5 w-3.5" /></>}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tail */}
          <div className="absolute -bottom-2 right-8 h-4 w-4 rotate-45 bg-gray-950 border-r border-b border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MayaTour;
export { MAYA_KEY };
