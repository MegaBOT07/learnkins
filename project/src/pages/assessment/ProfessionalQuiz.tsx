import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { professionalQuizAPI, progressAPI } from "../../utils/api";
import { useTokens } from "../../context/TokenContext";
import { Clock, ArrowLeft, Trophy } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
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
  const { award } = useTokens();

  const [quiz, setQuiz] = useState<ProfessionalQuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await professionalQuizAPI.getQuiz(id || "");
      setQuiz(response.data.data);
      setTimeLeft((response.data.data.timeLimit || 30) * 60);
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
      const answers = selectedAnswers.map((answer) => answer);

      const response = await professionalQuizAPI.submitQuiz(
        quiz._id,
        answers,
        (quiz.timeLimit * 60) - timeLeft
      );

      if (response.data.success) {
        const { score: earnedScore, percentage: pct, passed: isPass } = response.data.data;

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
      }
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      alert('Failed to submit quiz. Please try again.');
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
              <button
                onClick={() => setIsStarted(true)}
                className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]"
              >
                Start Quiz
              </button>
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
    );
  }

  /* ── Results Screen ── */
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border-2 border-black max-w-md w-full p-8 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 flex items-center justify-center ${passed ? 'border-green-500 bg-green-50' : 'border-yellow-500 bg-yellow-50'
              }`}
          >
            <div className="text-4xl">
              {passed ? '🏆' : '📚'}
            </div>
          </div>

          <h2 className="text-3xl font-black text-black mb-2">
            {passed ? 'Congratulations!' : 'Quiz Complete'}
          </h2>

          <div className={`text-5xl font-black mb-4 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {percentage}%
          </div>

          <p className="text-gray-600 font-medium mb-6">
            {passed
              ? `You passed! Score: ${score} points`
              : `You need ${quiz.passingScore}% to pass. Score: ${score} points`}
          </p>

          <div className="bg-gray-50 rounded-2xl border-2 border-black p-4 mb-6">
            <div className="text-xs text-gray-600 font-bold uppercase tracking-wider mb-1">Pass Score Required</div>
            <div className="text-2xl font-black text-black">{quiz.passingScore}%</div>
          </div>

          {passed && quiz.certificateTemplate && (
            <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-4 mb-6">
              <div className="text-green-800 font-black">
                ✓ Certificate Issued
              </div>
              <div className="text-sm text-green-700 mt-1 font-medium">
                {quiz.certificateTemplate.title}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate("/professional-quizzes")}
              className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Back to Quizzes
            </button>
            <button
              onClick={() => {
                setIsStarted(false);
                setIsCompleted(false);
                setCurrentQuestion(0);
                setSelectedAnswers([]);
                setTimeLeft(quiz.timeLimit * 60);
              }}
              className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
            >
              Retake Quiz
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
              {currentQuestionData.options.map((option, index) => (
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
              ))}
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
