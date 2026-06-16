import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../../utils/api';
import { ArrowLeft, Clock, BarChart3, HelpCircle } from 'lucide-react';

interface QuizData {
  _id: string;
  title: string;
  subject: string;
  difficulty: string;
  questionCount?: number;
  totalQuestions?: number;
  timeLimit?: number;
  description?: string;
  grade?: string;
}

const PracticeQuizzes = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subject = searchParams.get('subject') || '';

  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Fetch practice quizzes for the subject
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!subject) {
          setError('Subject is required');
          setQuizzes([]);
          return;
        }

        const response = await quizAPI.getQuizzes(subject);
        const data = response.data?.data || [];
        
        if (Array.isArray(data)) {
          setQuizzes(data);
        } else {
          setError('Invalid quiz data format');
          setQuizzes([]);
        }
      } catch (err: any) {
        console.error('Error fetching practice quizzes:', err);
        setError(err.response?.data?.message || 'Failed to load practice quizzes');
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    if (subject) {
      fetchQuizzes();
    }
  }, [subject]);

  const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
    Easy: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-300' },
    Medium: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-300' },
    Hard: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-300' },
  };

  const filteredQuizzes = selectedDifficulty === 'All'
    ? quizzes
    : quizzes.filter(q => q.difficulty === selectedDifficulty);

  const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1).replace('-', ' ') : 'Practice Quizzes';

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/subjects/${subject}`)}
            className="flex items-center gap-2 text-black font-bold mb-4 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to {subjectName}
          </button>
          
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
            <h1 className="text-4xl font-black text-black mb-2 uppercase tracking-tight">
              📝 Practice Questions
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Choose a practice quiz from {subjectName} and test your knowledge
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-6 py-2.5 rounded-xl font-bold border-2 border-black transition-all ${
                selectedDifficulty === diff
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">Loading practice quizzes...</p>
          </div>
        ) : error ? (
          <div className="bg-white border-2 border-red-500 rounded-2xl p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-red-700 font-bold text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              Retry
            </button>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">
              No practice quizzes found
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedDifficulty === 'All'
                ? `No practice quizzes available for ${subjectName} yet. Check back later!`
                : `No ${selectedDifficulty} practice quizzes found. Try a different difficulty level.`}
            </p>
            <button
              onClick={() => navigate('/subjects')}
              className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
            >
              View All Subjects
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuizzes.map((quiz) => {
              const difficulty = quiz.difficulty || 'Medium';
              const colors = difficultyColors[difficulty] || difficultyColors.Medium;
              const questionCount = quiz.totalQuestions || quiz.questionCount || 0;
              const timeLimit = quiz.timeLimit || 0;

              return (
                <div
                  key={quiz._id}
                  className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-black mb-2 line-clamp-2">
                        {quiz.title}
                      </h3>
                      {quiz.description && (
                        <p className="text-gray-600 text-sm font-medium line-clamp-2 mb-4">
                          {quiz.description}
                        </p>
                      )}
                    </div>
                    <div
                      className={`ml-4 px-3 py-1 rounded-lg text-xs font-black border border-black ${colors.bg} ${colors.text}`}
                    >
                      {difficulty}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6 text-sm font-bold text-gray-700">
                    {questionCount > 0 && (
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>{questionCount} Questions</span>
                      </div>
                    )}
                    {timeLimit > 0 && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{timeLimit} min</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/practice-quiz/${quiz._id}?subject=${subject}`)}
                    className="w-full bg-black text-white py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Start Practice</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeQuizzes;
