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

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-900 border-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-900 border-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-900 border-red-400";
      default:
        return "bg-gray-100 text-gray-900 border-gray-400";
    }
  };

  const getSubjectBorder = (subject: string) => {
    switch (subject) {
      case "science":
        return "border-purple-500";
      case "mathematics":
        return "border-blue-500";
      case "social-science":
        return "border-green-500";
      case "english":
        return "border-orange-500";
      default:
        return "border-cyan-500";
    }
  };

  const statItems = [
    { label: "Total Quizzes", value: quizzes.length.toString(), icon: <Trophy className="h-7 w-7" />, border: "border-cyan-500", color: "text-cyan-600" },
    { label: "Certifications", value: "12+", icon: <Star className="h-7 w-7" />, border: "border-yellow-500", color: "text-yellow-600" },
    { label: "Active Users", value: "5,000+", icon: <Users className="h-7 w-7" />, border: "border-green-500", color: "text-green-600" },
    { label: "Avg. Pass Rate", value: "78%", icon: <Clock className="h-7 w-7" />, border: "border-purple-500", color: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="relative bg-black text-white border-b-4 border-yellow-500 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-bold tracking-wider uppercase mb-6">
            <Link to="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-black rounded-lg border-2 border-white font-black">
              Professional Quizzes
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Professional Quizzes
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Challenge yourself with certification-ready quizzes and earn credentials
          </p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-gray-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {statItems.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white rounded-2xl border-2 ${stat.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}
              >
                <div className={`${stat.color} mb-3 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-black mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-bold text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-black tracking-tight mb-2">
              Available Professional Quizzes
            </h2>
            <p className="text-gray-600">
              Choose from certification quizzes across multiple subjects
            </p>
          </div>

          {/* ── Filters & AI Generator ── */}
          <div className="bg-white rounded-2xl border-2 border-black p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="all">All Subjects</option>
                  <option value="science">Science</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="social-science">Social Science</option>
                  <option value="english">English</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                  className="w-full px-4 py-2.5 border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all font-bold"
                >
                  <Filter className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>

            {/* AI Quiz Generator */}
            <div className="border-t-2 border-black pt-6">
              <h3 className="text-lg font-black text-black mb-4">✨ Generate New AI Quiz</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select
                    value={newAISubject}
                    onChange={(e) => setNewAISubject(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="science">Science</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="social-science">Social Science</option>
                    <option value="english">English</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={newAIDifficulty}
                    onChange={(e) => setNewAIDifficulty(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={50}
                    value={aiTotalQuestions}
                    onChange={(e) => setAiTotalQuestions(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div className="md:col-span-12">
                  <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                    Topic (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Photosynthesis, Fractions, World War II"
                    value={newAITopic}
                    onChange={(e) => setNewAITopic(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                    className="w-full px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-black hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_rgba(234,179,8,1)]"
                  >
                    {aiLoading ? 'Generating AI Quiz...' : '✨ Generate AI Quiz'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quiz List ── */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-bold">Loading professional quizzes...</p>
            </div>
          ) : error ? (
            <div className="bg-white border-2 border-red-500 rounded-2xl p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-red-700 font-bold">{error}</p>
              <button
                onClick={fetchQuizzes}
                className="mt-4 px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
              >
                Retry
              </button>
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl border-2 border-black flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-black text-black mb-2">
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
                  className={`bg-white rounded-2xl border-2 ${getSubjectBorder(quiz.subject)} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all overflow-hidden`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getDifficultyStyle(quiz.difficulty)}`}
                      >
                        {quiz.difficulty}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getSubjectBorder(quiz.subject)} bg-white`}
                      >
                        {quiz.subject}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-black mb-2 line-clamp-2">
                      {quiz.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {quiz.description}
                    </p>

                    <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-t-2 border-b-2 border-black">
                      <div className="text-center">
                        <div className="text-lg font-black text-cyan-600">
                          {quiz.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-600 font-bold">Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-green-600">
                          {quiz.timeLimit}m
                        </div>
                        <div className="text-xs text-gray-600 font-bold">Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-black text-orange-600">
                          {quiz.passingScore}%
                        </div>
                        <div className="text-xs text-gray-600 font-bold">Pass Score</div>
                      </div>
                    </div>

                    <div className="mb-4 text-sm">
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span className="font-bold">Avg Score</span>
                        <span className="font-black">
                          {Math.round(quiz.statistics.averageScore)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 border border-black">
                        <div
                          className="bg-black h-full rounded-full"
                          style={{
                            width: `${Math.min(quiz.statistics.averageScore, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600 mb-5 font-bold">
                      <span>{quiz.statistics.totalAttempts} attempts</span>
                      <span>{quiz.statistics.passRate}% pass rate</span>
                    </div>

                    <button
                      onClick={() => navigate(`/professional-quiz/${quiz._id}`)}
                      className="w-full bg-black text-white py-2.5 px-4 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
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
