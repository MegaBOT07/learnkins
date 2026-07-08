import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { professionalQuizAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Clock, Trophy } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type?: string;
  options: string[];
  correctAnswer: number | string;
  explanation?: string;
  points?: number;
}

interface AttemptAnswer {
  questionId: string;
  selectedAnswer: number | string;
  isCorrect: boolean;
  pointsEarned: number;
}

interface Attempt {
  _id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  difficulty: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  attemptDate: string;
  answers: AttemptAnswer[];
  questions: Question[];
}

const QuizAttemptReview = () => {
  const { id, attemptId } = useParams<{ id: string; attemptId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: `/professional-quiz/${id}/attempt/${attemptId}` } } });
      return;
    }
    fetchAttempt();
  }, [id, attemptId, isAuthenticated]);

  const fetchAttempt = async () => {
    try {
      setLoading(true);
      const res = await professionalQuizAPI.getAllMyAttempts();
      const allAttempts: Attempt[] = res.data?.data || [];
      const found = allAttempts.find(a => a._id === attemptId);
      if (found) {
        setAttempt(found);
      } else {
        // Fallback: fetch from specific quiz
        const quizRes = await professionalQuizAPI.getUserAttempts(id!);
        const quizAttempts = quizRes.data?.data || [];
        const match = quizAttempts.find((a: any) => a._id === attemptId);
        if (match) {
          const quizRes2 = await professionalQuizAPI.getQuiz(id!);
          const quiz = quizRes2.data?.data;
          setAttempt({
            _id: match._id,
            quizId: id!,
            quizTitle: quiz?.title || "Quiz",
            subject: quiz?.subject || "",
            difficulty: quiz?.difficulty || "",
            totalQuestions: quiz?.totalQuestions || 0,
            score: match.score,
            percentage: match.percentage,
            passed: match.passed,
            timeTaken: match.timeTaken,
            attemptDate: match.attemptDate,
            answers: match.answers,
            questions: quiz?.questions || [],
          });
        } else {
          setError("Attempt not found");
        }
      }
    } catch (err) {
      console.error("Error fetching attempt:", err);
      setError("Failed to load attempt details");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg mb-4">{error || "Attempt not found"}</p>
          <Link to="/my-attempts" className="text-black underline font-medium">Back to My Attempts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate("/my-attempts")} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-black">{attempt.quizTitle}</h1>
            <p className="text-sm text-gray-500 font-medium">{formatDate(attempt.attemptDate)}</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-2xl font-black ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>{attempt.percentage}%</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Score</div>
            </div>
            <div>
              <div className="text-2xl font-black text-black">{attempt.score}/{attempt.totalQuestions}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Points</div>
            </div>
            <div>
              <div className="text-2xl font-black text-black">{formatTime(attempt.timeTaken)}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Time</div>
            </div>
            <div>
              <div className={`text-2xl font-black ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                {attempt.passed ? 'Pass' : 'Fail'}
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</div>
            </div>
          </div>
        </div>

        {/* Answer Review */}
        <h2 className="text-xl font-black text-black mb-4">Answer Review</h2>
        <div className="space-y-4">
          {attempt.questions.map((q, index) => {
            const answer = attempt.answers[index];
            if (!answer) return null;
            const isCorrect = answer.isCorrect;
            const userAns = answer.selectedAnswer;
            const correctAns = q.correctAnswer;
            const isShort = q.type === 'short-answer';

            let userDisplay = typeof userAns === 'number' ? q.options[userAns] || `Option ${userAns}` : String(userAns ?? 'Not answered');
            let correctDisplay = typeof correctAns === 'number' ? q.options[correctAns] || `Option ${correctAns}` : String(correctAns);

            return (
              <div key={q.id} className={`rounded-xl border-2 p-5 ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'}`}>
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

        <div className="text-center mt-8 mb-12">
          <Link
            to="/my-attempts"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
          >
            Back to My Attempts
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizAttemptReview;
