import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { quizAPI } from '../../utils/api';
import { useTokens } from '../../context/TokenContext';
import { useGame } from '../../context/GameContext';
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trophy,
  Star,
} from 'lucide-react';

interface Question {
  _id?: string;
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  grade?: string;
  difficulty: string;
  timeLimit: number;
  totalQuestions?: number;
  questionCount?: number;
  description?: string;
  participants?: number;
  questions: Question[];
}

const PracticeQuiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || '';

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { award } = useTokens();
  const { takeQuiz } = useGame();

  // Fetch quiz data from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError('Quiz ID is required');
          return;
        }

        const response = await quizAPI.getQuiz(id);
        const payload = response.data?.data || response.data?.quiz || response.data;

        if (payload) {
          setQuiz(payload);
          setTimeLeft((payload.timeLimit || 30) * 60); // Default 30 mins if not specified
        } else {
          setError('Quiz not found');
        }
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.response?.data?.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Handle quiz submission to backend
  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const quizId = quiz._id || quiz.id;

      const answers = selectedAnswers.map((answer, index) => ({
        questionId: quiz.questions[index]._id || quiz.questions[index].id || `q${index + 1}`,
        selectedAnswer: answer,
      }));

      const timeTaken = (quiz.timeLimit || 30) * 60 - timeLeft;

      try {
        const response = await quizAPI.submitQuiz(quizId, answers, timeTaken);

        if (response.data.success) {
          setScore(response.data.data?.percentage || response.data.score || 0);
          setCorrectAnswers(response.data.data?.correctCount || response.data.correctCount || 0);
          setIncorrectAnswers(
            quiz.questions.length - (response.data.data?.correctCount || response.data.correctCount || 0)
          );
        }
      } catch (apiErr: any) {
        // If backend fails, calculate locally
        if (apiErr.response?.status === 404 || apiErr.response?.status === 400) {
          console.log('Quiz not found on backend, calculating score locally');
          calculateScoreLocally();
        } else {
          throw apiErr;
        }
      }
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      calculateScoreLocally(); // Fallback to local calculation
    } finally {
      setSubmitting(false);
    }
  };

  const calculateScoreLocally = () => {
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    const percentage = (correct / quiz.questions.length) * 100;
    setScore(percentage);
    setCorrectAnswers(correct);
    setIncorrectAnswers(quiz.questions.length - correct);

    const tokensEarned = percentage >= 100 ? 25 : percentage >= 40 ? Math.floor(percentage / 5) : 0;
    if (tokensEarned > 0) {
      try {
        award(tokensEarned, `practice-quiz:${quiz._id || quiz.id}`, {
          quizId: quiz._id || quiz.id,
          score: Math.round(percentage),
          tokensAwarded: tokensEarned,
          correctAnswers: correct
        });
      } catch (err) {
        console.warn('Failed to award tokens for quiz completion', err);
      }
    }

    try { takeQuiz(); } catch (err) { /* GameContext may not be available */ }
  };

  // Timer effect
  useEffect(() => {
    if (isStarted && !isCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isCompleted]);

  const startQuiz = () => {
    setIsStarted(true);
    if (quiz) {
      setTimeLeft((quiz.timeLimit || 30) * 60);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
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
    setIsCompleted(true);
    await handleSubmitQuiz();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!quiz) return 0;
    return ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return '🎉 Excellent! You mastered this!';
    if (score >= 80) return '🌟 Great job! Very good understanding!';
    if (score >= 70) return '👍 Good effort! Keep practicing!';
    if (score >= 60) return '📚 Nice try! Review and practice more!';
    return '💪 Keep going! More practice needed!';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading practice quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-red-700 font-bold text-lg mb-4">
              {error || 'Quiz not found'}
            </p>
            <button
              onClick={() => {
                if (subject) {
                  navigate(`/practice-quizzes?subject=${subject}`);
                } else {
                  navigate('/subjects');
                }
              }}
              className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const questionCount = quiz.totalQuestions || quiz.questionCount || quiz.questions.length;

  /* ── Pre-Start Screen ── */
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-black text-black mb-2">{quiz.title}</h1>
                <p className="text-gray-600">{quiz.description || `Practice your ${quiz.subject} knowledge`}</p>
              </div>
              <button
                onClick={() => {
                  if (subject) {
                    navigate(`/practice-quizzes?subject=${subject}`);
                  } else {
                    navigate('/subjects');
                  }
                }}
                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { value: questionCount, label: 'Questions', border: 'border-cyan-500', color: 'text-cyan-600' },
                { value: `${quiz.timeLimit}m`, label: 'Time Limit', border: 'border-green-500', color: 'text-green-600' },
                { value: quiz.difficulty, label: 'Difficulty', border: 'border-orange-500', color: 'text-orange-600' },
                { value: quiz.subject, label: 'Subject', border: 'border-purple-500', color: 'text-purple-600' },
              ].map((stat, idx) => (
                <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border-2 border-blue-400 rounded-2xl p-4 mb-8 flex items-center gap-3">
              <Star className="h-6 w-6 text-blue-600 shrink-0" />
              <span className="font-bold text-blue-800">
                Answer all questions to improve your skills and earn tokens!
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={startQuiz}
                className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]"
              >
                Start Practice Quiz
              </button>
              <button
                onClick={() => {
                  if (subject) {
                    navigate(`/practice-quizzes?subject=${subject}`);
                  } else {
                    navigate('/subjects');
                  }
                }}
                className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results Screen ── */
  if (isCompleted && showResults) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-4">Quiz Complete!</h1>

              <div className="mb-8">
                <div className={`text-6xl font-black mb-4 ${getScoreColor(score)}`}>
                  {Math.round(score)}%
                </div>
                <p className="text-gray-600 font-medium mb-6">{getScoreMessage(score)}</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  {[
                    { value: questionCount, label: 'Total Questions', border: 'border-cyan-500', color: 'text-cyan-600' },
                    { value: correctAnswers, label: 'Correct', border: 'border-green-500', color: 'text-green-600' },
                    { value: incorrectAnswers, label: 'Incorrect', border: 'border-red-500', color: 'text-red-600' },
                    { value: formatTime(quiz.timeLimit * 60 - timeLeft), label: 'Time Used', border: 'border-purple-500', color: 'text-purple-600' },
                    { value: score >= 100 ? 25 : score >= 40 ? Math.floor(score / 5) : 0, label: 'Tokens Earned', border: 'border-yellow-500', color: 'text-yellow-600' },
                  ].map((stat, idx) => (
                    <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
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
                  onClick={() => {
                    if (subject) {
                      navigate(`/practice-quizzes?subject=${subject}`);
                    } else {
                      navigate('/subjects');
                    }
                  }}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  Back to Practice Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Answer Review Screen ── */
  if (isCompleted && !showResults) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-black">Answer Review</h2>
            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              See Results
            </button>
          </div>

          <div className="space-y-4">
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <div key={index} className="bg-white rounded-2xl border-2 border-black p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 border-2 border-black flex items-center justify-center font-black text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-black mb-3">{question.question}</p>

                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optIdx) => {
                          const isUserAnswer = optIdx === userAnswer;
                          const isCorrectAnswer = optIdx === question.correctAnswer;

                          let bgColor = 'bg-white';
                          let borderColor = 'border-gray-300';

                          if (isUserAnswer && isCorrect) {
                            bgColor = 'bg-green-50';
                            borderColor = 'border-green-500';
                          } else if (isUserAnswer && !isCorrect) {
                            bgColor = 'bg-red-50';
                            borderColor = 'border-red-500';
                          } else if (isCorrectAnswer) {
                            bgColor = 'bg-green-50';
                            borderColor = 'border-green-500';
                          }

                          return (
                            <div key={optIdx} className={`p-3 rounded-xl border-2 ${borderColor} ${bgColor} flex items-center gap-3`}>
                              <input type="radio" disabled checked={isUserAnswer} className="cursor-not-allowed" />
                              <span className="font-medium text-black">{option}</span>
                              {isUserAnswer && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                              {isUserAnswer && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                              {isCorrectAnswer && !isUserAnswer && <CheckCircle className="ml-auto h-5 w-5 text-green-600" />}
                            </div>
                          );
                        })}
                      </div>

                      {question.explanation && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                          <p className="text-sm font-medium text-blue-900">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-3 max-w-sm mx-auto">
            <button
              onClick={() => setShowResults(true)}
              className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              See Results
            </button>
            <button
              onClick={() => {
                if (subject) {
                  navigate(`/practice-quizzes?subject=${subject}`);
                } else {
                  navigate('/subjects');
                }
              }}
              className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
            >
              Back to Practice Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz Attempt Screen ── */
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-black text-black mb-1">{quiz.title}</h1>
            <p className="text-gray-600 text-sm">
              Question {currentQuestionIndex + 1} of {questionCount}
            </p>
          </div>
          <div className={`text-center px-6 py-3 bg-white rounded-xl border-2 border-black font-black text-2xl ${
            timeLeft <= 60 ? 'text-red-600' : 'text-black'
          }`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-gray-200 rounded-full h-2 border-2 border-black overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <p className="text-xl font-black text-black mb-6">{currentQuestion.question}</p>

          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 rounded-xl border-2 border-black font-bold text-left transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-6 py-3 bg-white text-black rounded-xl border-2 border-black font-bold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          <div className="flex gap-2 flex-wrap justify-center">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg border-2 border-black font-bold transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-black text-white'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-green-100 text-black border-green-500'
                    : 'bg-white text-black'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="flex-1 px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === questionCount - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>

        {!isAnswered && (
          <p className="text-center text-orange-600 font-bold">Please select an answer to continue</p>
        )}
      </div>
    </div>
  );
};

export default PracticeQuiz;
