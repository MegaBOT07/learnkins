import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { professionalQuizAPI, progressAPI } from "../../utils/api";
import { storeNewAchievements } from "../../utils/achievements";
import { useTokens } from "../../context/TokenContext";
import { useGame } from "../../context/GameContext";
import { useToast } from "../../components/Toast";
// @ts-ignore
import { useAuth } from "../../context/AuthContext";
import { Clock, ArrowLeft, Trophy } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type?: 'multiple-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
  points?: number;
}

interface ProfessionalQuizData {
  _id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  difficulty: string;
  timeLimit: number;
  passingScore: number;
  totalQuestions: number;
  questions: Question[];
  certificateTemplate?: {
    title: string;
    description: string;
    issuer: string;
  };
}

const ProfessionalQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  // @ts-ignore
  const { isAuthenticated } = useAuth();
  const { award } = useTokens();
  const { takeQuiz, addPoints, addExperience } = useGame();
  const { showToast } = useToast();

  const [quiz, setQuiz] = useState<ProfessionalQuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [attemptData, setAttemptData] = useState<any>(null);
  const [existingAttempt, setExistingAttempt] = useState<any>(null);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await professionalQuizAPI.getQuiz(id || "");
      const quizData = response.data?.data;
      if (!quizData) {
        setError("Quiz not found");
        return;
      }
      setQuiz(quizData);
      setTimeLeft((quizData.timeLimit || 30) * 60);

      // Check for existing attempts
      if (isAuthenticated) {
        try {
          const attemptsRes = await professionalQuizAPI.getUserAttempts(id || "");
          const attempts = attemptsRes.data?.data || [];
          if (attempts.length > 0) {
            // Pick the most recent attempt
            setExistingAttempt(attempts[attempts.length - 1]);
          }
        } catch (err) {
          // Non-critical; user can still start quiz
        }
      }
    } catch (err: any) {
      console.error("Error fetching professional quiz:", err);
      setError(err?.response?.data?.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isStarted && !isCompleted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isCompleted, timeLeft]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const response = await professionalQuizAPI.submitQuiz(
        quiz._id,
        selectedAnswers,
        (quiz.timeLimit * 60) - timeLeft
      );

      if (response.data?.success) {
        if (response.data.newAchievements?.length > 0) {
          storeNewAchievements(
            response.data.newAchievements.map((a: any) => ({
              icon: a.icon || '🏆',
              name: a.name || 'Achievement Unlocked',
              points: a.points || 0,
            }))
          );
        }

        const { score: earnedScore, percentage: pct, passed: isPass, timeTaken: taken } = response.data.data || {};
        const timeTakenSeconds = taken || ((quiz.timeLimit * 60) - timeLeft);
        setTimeTaken(timeTakenSeconds);

        setScore(earnedScore);
        setPercentage(pct);
        setPassed(isPass);
        setIsCompleted(true);

        // Award tokens based on score (10 points = 1 token)
        const tokensAwarded = Math.floor(pct / 10);
        if (tokensAwarded > 0) {
          try {
            award(tokensAwarded, `professional-quiz:${quiz._id}`, {
              quizTitle: quiz.title,
              score: earnedScore,
              percentage: pct,
              passed: isPass,
              tokensAwarded
            });
          } catch (err) {
            console.warn('Failed to award tokens', err);
          }
        }

        // Update game context stats (profile quizzesTaken, totalPoints)
        // Note: XP is awarded server-side via user.addExperience(totalXP)
        try {
          takeQuiz();
          addPoints(earnedScore);
        } catch (err) {
          console.warn('Failed to update game progress', err);
        }

        // Update progress
        try {
          await progressAPI.logStudySession({
            subject: quiz.subject,
            chapter: 'professional-quizzes',
            duration: ((quiz.timeLimit * 60) - timeLeft) / 60,
            activities: [{
              type: 'quiz',
              id: quiz._id,
              score: pct
            }]
          });
        } catch (err) {
          console.warn('Failed to update progress', err);
        }

        // Fetch attempt data for review
        try {
          const attemptsRes = await professionalQuizAPI.getUserAttempts(quiz._id);
          const attempts = attemptsRes.data?.data || [];
          if (attempts.length > 0) {
            setAttemptData(attempts[attempts.length - 1]);
          }
        } catch (err) {
          console.warn('Failed to fetch attempt data', err);
        }
      }
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      showToast('Failed to submit quiz. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading professional quiz...</p>
        </div>
      </div>
    );
  }

  /* ── Error State ── */
  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-red-700 text-lg font-bold mb-4">{error || "Failed to load quiz"}</div>
          <button
            onClick={() => navigate("/professional-quizzes")}
            className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-Start Screen ── */
  if (!isStarted) {
    return (
      <>
        <div className="min-h-screen bg-white p-6">
          <div className="max-w-4xl mx-auto pt-8">
            <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-black text-black mb-2">
                    {quiz.title}
                  </h1>
                  <p className="text-gray-600">{quiz.description}</p>
                </div>
                <button
                  onClick={() => navigate("/professional-quizzes")}
                  className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: quiz.totalQuestions, label: "Questions", border: "border-cyan-500", color: "text-cyan-600" },
                  { value: `${quiz.timeLimit}m`, label: "Time Limit", border: "border-green-500", color: "text-green-600" },
                  { value: quiz.difficulty, label: "Difficulty", border: "border-orange-500", color: "text-orange-600" },
                  { value: `${quiz.passingScore}%`, label: "Pass Score", border: "border-purple-500", color: "text-purple-600" },
                ].map((stat, idx) => (
                  <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className={`text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              {quiz.certificateTemplate && (
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4 mb-8 flex items-center space-x-3">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                  <span className="font-bold text-yellow-800">
                    Earn a certificate upon passing this quiz
                  </span>
                </div>
              )}

              <div className="space-y-3">
                {existingAttempt ? (
                  <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5 mb-3">
                    <p className="font-black text-yellow-800 mb-1">You already attempted this quiz</p>
                    <p className="text-yellow-700 text-sm mb-3">
                      Score: {existingAttempt.score}/{quiz.totalQuestions} ({existingAttempt.percentage}%) — {existingAttempt.passed ? 'Passed' : 'Failed'}
                    </p>
                    <Link
                      to={`/professional-quiz/${id}/attempt/${existingAttempt._id}`}
                      className="block w-full text-center px-4 py-2.5 bg-yellow-500 text-black rounded-xl border-2 border-yellow-500 font-bold hover:bg-white transition-all"
                    >
                      Review Your Attempt
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowAuthPrompt(true);
                      } else {
                        setIsStarted(true);
                      }
                    }}
                    className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]"
                  >
                    Start Quiz
                  </button>
                )}
                <button
                  onClick={() => navigate("/professional-quizzes")}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Auth Prompt Modal */}
        {showAuthPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl border-2 border-yellow-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full mx-4 relative">
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-black text-2xl font-bold leading-none"
              >
                &times;
              </button>
              <h3 className="text-2xl font-black text-black mb-2">Login Required</h3>
              <p className="text-gray-600 mb-6">
                You need to sign in or create an account to take this quiz.
              </p>
              <Link
                to="/login"
                state={{ from: { pathname: location.pathname } }}
                className="block w-full text-center px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-black hover:bg-white hover:text-black transition-all mb-3"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                state={{ from: { pathname: location.pathname } }}
                className="block w-full text-center px-6 py-3 bg-yellow-500 text-black rounded-xl border-2 border-yellow-500 font-black hover:bg-white hover:text-black transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </>
    );
  }

  /* ── Results Screen ── */
  if (isCompleted) {
    const formatTimeTaken = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m}m ${s}s`;
    };

    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-2xl mx-auto">
          {/* Summary Card */}
          <div className="bg-white rounded-2xl border-2 border-black p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 flex items-center justify-center ${passed ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'}`}
            >
              <div className="text-4xl">{passed ? '🏆' : '📚'}</div>
            </div>
            <h2 className="text-3xl font-black text-black mb-2">
              {passed ? 'Congratulations!' : 'Quiz Complete'}
            </h2>
            <div className={`text-5xl font-black mb-4 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
              {percentage}%
            </div>
            <p className="text-gray-600 font-medium mb-4">
              {passed ? `You passed! Score: ${score} points` : `You need ${quiz.passingScore}% to pass. Score: ${score} points`}
            </p>
            <div className="flex justify-center gap-6 text-sm font-bold text-gray-600 mb-6">
              <div>
                <span className="text-black">{formatTimeTaken(timeTaken)}</span>
                <div className="text-xs uppercase tracking-wider">Time Taken</div>
              </div>
              <div>
                <span className="text-black">{quiz.totalQuestions} Qs</span>
                <div className="text-xs uppercase tracking-wider">Questions</div>
              </div>
            </div>
            {passed && quiz.certificateTemplate && (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 mb-6">
                <div className="text-green-800 font-black">✓ Certificate Issued</div>
                <div className="text-sm text-green-700 mt-1 font-medium">{quiz.certificateTemplate.title}</div>
              </div>
            )}
            <button
              onClick={() => navigate("/professional-quizzes")}
              className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Back to Quizzes
            </button>
          </div>

          {/* Answer Review */}
          <div className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-xl font-black text-black mb-6">Answer Review</h3>
            <div className="space-y-4">
              {quiz.questions.map((q, index) => {
                const userAns = attemptData?.answers?.[index]?.selectedAnswer ?? selectedAnswers[index];
                const isCorrect = attemptData?.answers?.[index]?.isCorrect ?? false;
                const correctAns = q.correctAnswer;

                let userDisplay = typeof userAns === 'number' ? q.options[userAns] || `Option ${userAns}` : String(userAns ?? 'Not answered');
                let correctDisplay = typeof correctAns === 'number' ? q.options[correctAns] || `Option ${correctAns}` : String(correctAns);
                const isShort = q.type === 'short-answer';

                return (
                  <div
                    key={q.id}
                    className={`rounded-xl border-2 p-5 ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-black mb-2">Q{index + 1}. {q.question}</p>
                        {q.type && (
                          <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 px-2 py-0.5 bg-gray-200 rounded">
                            {q.type === 'multiple-choice' ? 'MC' : q.type === 'true-false' ? 'TF' : 'SA'}
                          </span>
                        )}
                        {!isShort ? (
                          <div className="space-y-1.5 mt-1">
                            {q.options.map((opt, oi) => {
                              const isUserChoice = oi === (typeof userAns === 'number' ? userAns : -1);
                              const isCorrectChoice = oi === (typeof correctAns === 'number' ? correctAns : -1);
                              let style = 'border-gray-200 bg-white';
                              if (isCorrectChoice) style = 'border-green-500 bg-green-100';
                              if (isUserChoice && !isCorrect) style = 'border-red-500 bg-red-100';
                              return (
                                <div key={oi} className={`p-3 rounded-lg border-2 text-sm font-medium ${style}`}>
                                  {opt}
                                  {isCorrectChoice && !isUserChoice && <span className="ml-2 text-green-700 font-bold">← Correct Answer</span>}
                                  {isUserChoice && isCorrectChoice && <span className="ml-2 text-green-700 font-bold">← Your Answer</span>}
                                  {isUserChoice && !isCorrectChoice && <span className="ml-2 text-red-700 font-bold">← Your Answer</span>}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="mt-2 space-y-1 text-sm font-medium">
                            <p>Your answer: <span className={isCorrect ? 'text-green-700 font-black' : 'text-red-700 font-black'}>{userDisplay}</span></p>
                            {!isCorrect && <p>Correct answer: <span className="text-green-700 font-black">{correctDisplay}</span></p>}
                          </div>
                        )}
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-300">
                            <p className="text-xs font-black uppercase tracking-wider text-gray-600 mb-1">Explanation</p>
                            <p className="text-sm text-gray-700">{q.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => navigate("/professional-quizzes")}
              className="w-full mt-6 bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz In Progress ── */
  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-black">{quiz.title}</h2>
              <p className="text-sm text-gray-600 font-bold mt-1">
                Question {currentQuestion + 1} of {quiz.totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-2 text-xl font-black ${timeLeft < 60 ? 'text-red-600' : 'text-black'}`}>
                <Clock className="h-5 w-5" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">Time Left</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
              <div
                className="bg-black h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-lg font-black text-black mb-6">
              {currentQuestionData.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestionData.type === 'short-answer' ? (
                <input
                  type="text"
                  placeholder="Type your answer..."
                  value={typeof selectedAnswers[currentQuestion] === 'string' ? selectedAnswers[currentQuestion] as string : ''}
                  onChange={(e) => {
                    const newAnswers = [...selectedAnswers];
                    newAnswers[currentQuestion] = e.target.value;
                    setSelectedAnswers(newAnswers);
                  }}
                  className="w-full p-4 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              ) : (
                currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${selectedAnswers[currentQuestion] === index
                        ? 'border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(234,179,8,1)]'
                        : 'border-black bg-white text-black hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAnswers[currentQuestion] === index
                            ? 'border-white bg-white'
                            : 'border-black'
                          }`}
                      >
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                        )}
                      </div>
                      <span className="font-bold">{option}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between space-x-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-white text-black rounded-xl border-2 border-black font-bold hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <div className="text-sm font-black text-gray-600">
              {currentQuestion + 1} / {quiz.totalQuestions}
            </div>

            {currentQuestion === quiz.totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[3px_3px_0px_0px_rgba(34,197,94,1)]"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalQuiz;
