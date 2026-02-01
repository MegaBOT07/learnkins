import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Trophy, Clock, Users, Filter, Search, Star } from "lucide-react";
import { professionalQuizAPI } from "../../utils/api";
import type { LucideIcon } from "lucide-react";

interface ProfessionalQuiz {
  _id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  difficulty: string;
  timeLimit: number;
  totalQuestions: number;
  passingScore: number;
  statistics: {
    totalAttempts: number;
    averageScore: number;
    passRate: number;
  };
}

const ProfessionalQuizzes = () => {
  const [quizzes, setQuizzes] = useState<ProfessionalQuiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<ProfessionalQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [newAIDifficulty, setNewAIDifficulty] = useState("Easy");
  const [aiLoading, setAILoading] = useState(false);
  const [aiTotalQuestions, setAiTotalQuestions] = useState(10);
  const [newAITopic, setNewAITopic] = useState("");
  const [newAISubject, setNewAISubject] = useState("science");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await professionalQuizAPI.getQuizzes();
      const data = response.data?.data || [];
      setQuizzes(data);
      setFilteredQuizzes(data);
    } catch (err: any) {
      console.error("Error fetching professional quizzes:", err);
      setError(err?.response?.data?.message || "Failed to load professional quizzes");
      setQuizzes([]);
      setFilteredQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = quizzes;

    if (searchTerm) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((quiz) => quiz.subject === selectedSubject);
    }

    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((quiz) => quiz.difficulty === selectedDifficulty);
    }

    setFilteredQuizzes(filtered);
  }, [searchTerm, selectedSubject, selectedDifficulty, quizzes]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "science":
        return "bg-purple-100 text-purple-800";
      case "mathematics":
        return "bg-blue-100 text-blue-800";
      case "social-science":
        return "bg-green-100 text-green-800";
      case "english":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Professional Quizzes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Professional Quizzes</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Challenge yourself with certification-ready quizzes and earn credentials
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                label: "Total Quizzes",
                value: quizzes.length.toString(),
                icon: <Trophy className="h-8 w-8" />,
                color: "text-blue-600",
              },
              {
                label: "Certifications",
                value: "12+",
                icon: <Star className="h-8 w-8" />,
                color: "text-yellow-600",
              },
              {
                label: "Active Users",
                value: "5,000+",
                icon: <Users className="h-8 w-8" />,
                color: "text-green-600",
              },
              {
                label: "Avg. Pass Rate",
                value: "78%",
                icon: <Clock className="h-8 w-8" />,
                color: "text-purple-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Available Professional Quizzes
            </h2>
            <p className="text-lg text-gray-600">
              Choose from certification quizzes across multiple subjects
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Subjects</option>
                  <option value="science">Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="social-science">Social Science</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSubject("all");
                    setSelectedDifficulty("all");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate New AI Quiz</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={newAISubject}
                    onChange={(e) => setNewAISubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="social-science">Social Science</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={newAIDifficulty}
                    onChange={(e) => setNewAIDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                  <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={50}
                    value={aiTotalQuestions}
                    onChange={(e) => setAiTotalQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                  <div className="md:col-span-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Photosynthesis, Fractions, World War II"
                      value={newAITopic}
                      onChange={(e) => setNewAITopic(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                <div className="md:col-span-12">
                  <button
                    disabled={aiLoading}
                    onClick={async () => {
                      try {
                        setAILoading(true);
                        const resp = await professionalQuizAPI.createAIQuiz({
                          difficulty: newAIDifficulty,
                          totalQuestions: aiTotalQuestions,
                          subject: newAISubject,
                        });
                        const created = resp.data?.data;
                        if (created && created._id) {
                          navigate(`/professional-quiz/${created._id}`);
                        } else {
                          fetchQuizzes();
                        }
                      } catch (err: any) {
                        console.error('AI quiz generation failed', err);
                        setError('AI quiz generation failed');
                      } finally {
                        setAILoading(false);
                      }
                    }}
                    className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {aiLoading ? 'Generating AI Quiz...' : '✨ Generate AI Quiz'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading professional quizzes...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={fetchQuizzes}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No professional quizzes found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          quiz.difficulty
                        )}`}
                      >
                        {quiz.difficulty}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(
                          quiz.subject
                        )}`}
                      >
                        {quiz.subject}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {quiz.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-b border-gray-200">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {quiz.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-600">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {quiz.timeLimit}m
                        </div>
                        <div className="text-xs text-gray-600">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {quiz.passingScore}%
                        </div>
                        <div className="text-xs text-gray-600">Pass Score</div>
                      </div>
                    </div>

                    <div className="mb-4 text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>Avg Score</span>
                        <span className="font-semibold">
                          {Math.round(quiz.statistics.averageScore)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min(quiz.statistics.averageScore, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                      <span>{quiz.statistics.totalAttempts} attempts</span>
                      <span>{quiz.statistics.passRate}% pass rate</span>
                    </div>

                    <button
                      onClick={() => navigate(`/professional-quiz/${quiz._id}`)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfessionalQuizzes;
