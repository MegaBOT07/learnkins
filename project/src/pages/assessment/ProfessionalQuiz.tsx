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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || "Failed to load quiz"}</div>
          <button
            onClick={() => navigate("/professional-quizzes")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {quiz.title}
                </h1>
                <p className="text-lg text-gray-600">{quiz.description}</p>
              </div>
              <button
                onClick={() => navigate("/professional-quizzes")}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {quiz.totalQuestions}
                </div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {quiz.timeLimit}m
                </div>
                <div className="text-sm text-gray-600">Time Limit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {quiz.difficulty}
                </div>
                <div className="text-sm text-gray-600">Difficulty</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {quiz.passingScore}%
                </div>
                <div className="text-sm text-gray-600">Pass Score</div>
              </div>
            </div>

            {quiz.certificateTemplate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">
                    Earn a certificate upon passing this quiz
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={() => setIsStarted(true)}
                className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
              >
                Start Quiz
              </button>
              <button
                onClick={() => navigate("/professional-quizzes")}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-yellow-100'
            }`}
          >
            <div className="text-4xl">
              {passed ? '🏆' : '📚'}
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {passed ? 'Congratulations!' : 'Quiz Complete'}
          </h2>

          <div className={`text-5xl font-bold mb-4 ${passed ? 'text-green-600' : 'text-yellow-600'}`}>
            {percentage}%
          </div>

          <p className="text-lg text-gray-600 mb-6">
            {passed
              ? `You passed! Score: ${score} points`
              : `You need ${quiz.passingScore}% to pass. Score: ${score} points`}
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 mb-1">Pass Score Required</div>
            <div className="text-2xl font-bold text-gray-800">{quiz.passingScore}%</div>
          </div>

          {passed && quiz.certificateTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="text-blue-800 font-semibold">
                ✓ Certificate Issued
              </div>
              <div className="text-sm text-blue-700 mt-1">
                {quiz.certificateTemplate.title}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate("/professional-quizzes")}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
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
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
              <p className="text-sm text-gray-600 mt-1">
                Question {currentQuestion + 1} of {quiz.totalQuestions}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-xl font-bold text-red-600">
                <Clock className="h-5 w-5" />
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-gray-600">Time Left</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quiz.totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {currentQuestionData.question}
            </h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswers[currentQuestion] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900 font-medium">{option}</span>
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
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <div className="text-sm text-gray-600">
              {currentQuestion + 1} / {quiz.totalQuestions}
            </div>

            {currentQuestion === quiz.totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
