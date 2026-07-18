import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI, progressAPI } from "../../utils/api";
import { storeNewAchievements } from "../../utils/achievements";
import { useTokens } from "../../context/TokenContext";
import { useGame } from "../../context/GameContext";
import { useToast } from "../../components/Toast";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trophy,
  Star,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type?: string;
  points?: number;
  options: string[];
}

interface QuizData {
  id: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  timeLimit: number;

  questionCount?: number;

  description: string;
  participants: number;
  questions: Question[];
}

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const timerDoneRef = useRef(false);
  const { award } = useTokens();
  const { takeQuiz, addPoints, addExperience } = useGame();
  const { showToast } = useToast();


  const normalizeQuiz = (quiz: any) => {
    return {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      subject: quiz.subject,
      grade: quiz.grade,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      participants: quiz.participants || 0,

      questions: quiz.questions.map((q: any) => ({
        id: q._id,
        question: q.question,
        type: q.type,
        points: q.points,

        options: (q.options || []).map((opt: any) => opt.text),
      }))
    }
  };

  // Fetch quiz data from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError("Quiz ID is required");
          return;
        }

        const response = await quizAPI.getQuiz(id);
        // backend returns { success: true, data: quiz }
        const payload = response.data?.data || response.data?.quiz || response.data;
        if (payload) {
          setQuiz(normalizeQuiz(payload));
          setTimeLeft((payload.timeLimit || 0) * 60);
        } else {
          setError("Quiz not found");
        }
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        setError(err.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const quizData = quiz;

  // Handle quiz submission to backend
  const handleSubmitQuiz = async () => {
    if (!quizData) return;

    try {
      setSubmitting(true);

      const answersPayload = quizData.questions.map((q, index) => ({
        questionId: q.id,
        answer: answers[index]
      }));

      const timeTaken = quizData.timeLimit * 60 - timeLeft;

      const response = await quizAPI.submitQuiz(
        quizData.id,
        answersPayload,
        timeTaken
      );

      if (response.data?.success) {
        const result = response.data.data;
        if (!result) throw new Error('Missing result data');

        setScore(result.percentage);
        setCorrectAnswers(result.correctCount);
        setIncorrectAnswers(
          quizData.questions.length - result.correctCount
        );

        // Store any newly unlocked achievements for Progress page to show
        if (response.data.newAchievements?.length > 0) {
          storeNewAchievements(response.data.newAchievements);
        }

        // Update game progress stats (profile quizzesTaken, totalPoints)
        try {
          takeQuiz();
          addPoints(result.correctCount * 10);
        } catch (err) {
          console.warn('Failed to update game progress', err);
        }

        setShowPopup(true);
      }

    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      showToast("Failed to submit quiz. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isQuizStarted, isQuizCompleted]);

  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted && timeLeft <= 0 && !timerDoneRef.current) {
      timerDoneRef.current = true;
      handleQuizComplete();
    }
  }, [timeLeft, isQuizStarted, isQuizCompleted]);

  const startQuiz = () => {
    if (!quizData) return;
    if (!quizData.questions || quizData.questions.length === 0) {
      setError('This quiz has no questions.');
      return;
    }
    setIsQuizStarted(true);
    setTimeLeft(quizData.timeLimit * 60);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    try {
      // award 1 token per question click and save meta to server when authenticated
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      award?.(1, `quiz:select`, { quizId: quizData.id, questionId: currentQuestion.id, index: currentQuestionIndex });
    } catch (e) {
      console.warn('Failed to award token for question selection', e);
    }
  };

  const handleTextAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizComplete = async () => {
    setIsQuizCompleted(true);
    try {
      await handleSubmitQuiz();
    } catch {
      // handleSubmitQuiz has its own catch — this only runs on unexpected errors
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! You're a quiz master!";
    if (score >= 80) return "Great job! You have a solid understanding!";
    if (score >= 60) return "Good work! Keep learning and improving!";
    return "Keep studying! You'll get better with practice!";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🏆";
    if (score >= 80) return "🎉";
    if (score >= 60) return "👍";
    return "💪";
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-red-700 text-lg font-bold mb-4">{error || "Failed to load quiz"}</div>
          <button
            onClick={() => navigate("/quizzes")}
            className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-Start Screen ── */
  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-3">
                {quizData.title}
              </h1>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                {quizData.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: quizData.questions.length, label: "Questions", border: "border-cyan-500", color: "text-cyan-600" },
                  { value: quizData.timeLimit, label: "Minutes", border: "border-green-500", color: "text-green-600" },
                  { value: quizData.difficulty, label: "Difficulty", border: "border-purple-500", color: "text-purple-600" },
                  { value: quizData.participants.toLocaleString(), label: "Participants", border: "border-orange-500", color: "text-orange-600" },
                ].map((stat, idx) => (
                  <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className={`text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={startQuiz}
                  className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,206,209,1)]"
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results Review ── */
  if (showResults) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-4">
                Quiz Complete!
              </h1>

              <div className="mb-8">
                <div className={`text-6xl font-black mb-4 ${getScoreColor(score)}`}>
                  {Math.round(score)}%
                </div>
                <p className="text-gray-600 font-medium mb-6">
                  {getScoreMessage(score)}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { value: quizData.questions.length, label: "Total Questions", border: "border-cyan-500", color: "text-cyan-600" },
                    { value: correctAnswers, label: "Correct Answers", border: "border-green-500", color: "text-green-600" },
                    { value: incorrectAnswers, label: "Incorrect", border: "border-red-500", color: "text-red-600" },
                    { value: formatTime(quizData.timeLimit * 60 - timeLeft), label: "Time Used", border: "border-purple-500", color: "text-purple-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className={`text-2xl font-black ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => setShowResults(false)}
                  className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Score Popup ── */
  if (showPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
          <div className="p-8 text-center">
            {/* Emoji Badge */}
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 flex items-center justify-center ${score >= 80 ? "border-green-500 bg-green-50" : score >= 60 ? "border-yellow-500 bg-yellow-50" : "border-red-500 bg-red-50"
                }`}
            >
              <div className="text-4xl">
                {getScoreEmoji(score)}
              </div>
            </div>

            {/* Score */}
            <h2 className="text-3xl font-black text-black mb-2">
              Quiz Complete!
            </h2>
            <div className={`text-5xl font-black mb-4 ${getScoreColor(score)}`}>
              {Math.round(score)}%
            </div>
            <p className="text-gray-600 font-medium mb-6">
              {getScoreMessage(score)}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${score >= 80
                    ? "bg-green-500"
                    : score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                    }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-4 border-2 border-green-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Correct</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border-2 border-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-red-600">
                  {incorrectAnswers}
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider">Incorrect</div>
              </div>
            </div>

            {/* Time Used */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-4 border-2 border-cyan-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Time Used
                </div>
                <div className="text-2xl font-black text-cyan-600">
                  {formatTime(quizData.timeLimit * 60 - timeLeft)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowResults(true);
                }}
                className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
              >
                View Detailed Results
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/leaderboard");
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl border-2 border-blue-600 font-bold hover:bg-blue-700 transition-all"
              >
                View Leaderboard
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/quizzes");
                }}
                className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
              >
                Back to Quizzes
              </button>
            </div>

            {/* Confetti for High Scores */}
            {score >= 80 && (
              <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                    }}
                  >
                    <span className="text-2xl">
                      {
                        ["🎉", "🎊", "🏆", "⭐", "💫"][
                        Math.floor(Math.random() * 5)
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz In Progress ── */
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-black p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/quizzes")}
                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Back to quizzes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-black">
                  {quizData.title}
                </h1>
                <p className="text-sm text-gray-600 font-bold">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quizData.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 font-black ${timeLeft < 60 ? 'text-red-600' : 'text-black'}`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border-2 border-black p-8 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black text-black mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.type === "short-answer" ? (
              <input
                type="text"
                placeholder="Type your answer..."
                value={answers[currentQuestionIndex] || ""}
                onChange={(e) => handleTextAnswer(e.target.value)}
                className="w-full p-4 border-2 border-black rounded-xl font-bold"
              />
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${answers[currentQuestionIndex] === option
                      ? "border-black bg-black text-white"
                      : "border-black bg-white text-black"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl border-2 border-black font-bold transition-all ${currentQuestionIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-white text-black hover:bg-gray-50"
              }`}
          >
            Previous
          </button>

          <button
            onClick={isLastQuestion ? handleQuizComplete : handleNextQuestion}
            disabled={!answers[currentQuestionIndex]}
            className={`px-6 py-3 rounded-xl border-2 border-black font-bold transition-all ${!answers[currentQuestionIndex] === undefined
              ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
              : "bg-black text-white hover:bg-white hover:text-black"
              }`}
          >
            {isLastQuestion ? "Finish Quiz" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
