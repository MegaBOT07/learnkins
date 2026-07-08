import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { professionalQuizAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { Clock, ChevronRight, Trophy, BookOpen } from "lucide-react";

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
}

const MyQuizAttempts = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/my-attempts" } } });
      return;
    }
    fetchAttempts();
  }, [isAuthenticated]);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await professionalQuizAPI.getAllMyAttempts();
      setAttempts(res.data?.data || []);
    } catch (err: any) {
      console.error("Error fetching attempts:", err);
      setError("Failed to load your quiz attempts");
    } finally {
      setLoading(false);
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      science: "border-cyan-400 bg-cyan-50 text-cyan-900",
      mathematics: "border-blue-400 bg-blue-50 text-blue-900",
      "social-science": "border-orange-400 bg-orange-50 text-orange-900",
      english: "border-purple-400 bg-purple-50 text-purple-900",
    };
    return colors[subject] || "border-gray-400 bg-gray-50 text-gray-900";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading your attempts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-black">My Quiz Attempts</h1>
            <p className="text-gray-600 font-medium mt-1">Review your past quiz results</p>
          </div>
          <Link
            to="/quizzes"
            className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black font-bold text-sm hover:bg-white hover:text-black transition-all"
          >
            Browse Quizzes
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {!loading && attempts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-black text-black mb-2">No attempts yet</h3>
            <p className="text-gray-500 mb-6">You haven't taken any quizzes yet</p>
            <Link
              to="/quizzes"
              className="inline-block px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Take a Quiz
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div
              key={attempt._id}
              className="bg-white rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-5 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSubjectColor(attempt.subject)}`}>
                      {attempt.subject}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${attempt.difficulty === 'Easy' ? 'border-green-400 bg-green-50 text-green-900' : attempt.difficulty === 'Medium' ? 'border-yellow-400 bg-yellow-50 text-yellow-900' : 'border-red-400 bg-red-50 text-red-900'}`}>
                      {attempt.difficulty}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold border ${attempt.passed ? 'border-green-400 bg-green-50 text-green-900' : 'border-red-400 bg-red-50 text-red-900'}`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-black truncate">{attempt.quizTitle}</h3>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600 font-medium">
                    <span className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      Score: {attempt.score}/{attempt.totalQuestions}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatTime(attempt.timeTaken)}
                    </span>
                    <span className="text-xs text-gray-400">{formatDate(attempt.attemptDate)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-2xl font-black ${attempt.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {attempt.percentage}%
                  </div>
                  <button
                    onClick={() => navigate(`/professional-quiz/${attempt.quizId}/attempt/${attempt._id}`)}
                    className="mt-2 flex items-center gap-1 text-sm font-bold text-black hover:text-yellow-600 transition-all"
                  >
                    Review <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyQuizAttempts;
