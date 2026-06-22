import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { quizAPI, subjectAPI } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Trophy, Search } from "lucide-react";


const SubjectQuizzes = () => {
  const navigate = useNavigate();
  const { subject } = useParams();
  const [selectedSubject, setSelectedSubject] = useState(subject || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  const fetchSubjects = async () => {
    try {
      let grade = null;

      const user = localStorage.getItem("user");

      if (user) {
        const parsed = JSON.parse(user);
        grade = parsed.grade;
      } else {
        window.location.href = "/login";
        return;
      }

      const cacheKey = `subjects_cache_${grade}`;

      const cache = localStorage.getItem(cacheKey);

      if (cache) {
        const parsed = JSON.parse(cache);

        const oneDay = 24 * 60 * 60 * 1000;

        if (
          parsed.timestamp &&
          Date.now() - parsed.timestamp < oneDay
        ) {
          setSubjects(parsed.data);
          syncSelectedSubject(parsed.data);
          return;
        }
      }

      const response = await subjectAPI.getSubjects(grade);

      if (response.data.success) {
        setSubjects(response.data.data);
        syncSelectedSubject(response.data.data);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: response.data.data,
            timestamp: Date.now(),
          })
        );
      }
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchQuizzes = async (
    pageNumber: number,
    append = false
  ) => {
    try {
      if (pageNumber === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const response = await quizAPI.getQuizzes({
        subject: selectedSubject === "all" ? undefined : selectedSubject,
        page: pageNumber,
        limit: 8,
      });

      if (response.data.success) {
        const newData = response.data.data || [];

        setTotal(response.data.total || 0);

        if (append) {
          setQuizData((prev) => [...prev, ...newData]);
        } else {
          setQuizData(newData);
        }
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const syncSelectedSubject = (availableSubjects: any[]) => {
    const subjectExists = availableSubjects.some(
      (s) => s.slug === subject
    );

    setSelectedSubject(
      subject && subjectExists ? subject : "all"
    );
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;

    const nextPage = page + 1;

    await fetchQuizzes(nextPage, true);

    setPage(nextPage);
  };

  const displayQuizzes = quizData;

  const filteredQuizzes = displayQuizzes.filter((quiz) =>
    quiz.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setQuizData([]);
    setPage(1);

    fetchQuizzes(1);
  }, [selectedSubject]);


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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Quizzes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {selectedSubject !== "all"
              ? `${selectedSubject.charAt(0).toUpperCase()}${selectedSubject.slice(1)} Quizzes`
              : "All Quizzes"}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your knowledge with engaging educational quizzes that make
            learning fun and interactive
          </p>
        </div>
      </section>

      {/* Filter Section with drop down*/}
      <div className=" rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 px-[30%] gap-4 mb-6">
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
              onChange={(e) => {
                const value = e.target.value;

                setSelectedSubject(value);

                if (value === "all") {
                  navigate("/games-quiz");
                } else {
                  navigate(`/games-quiz/${value}`);
                }
              }}
              className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            >
              <option value="all">All Subjects</option>

              {subjects.map((subject) => (
                <option
                  key={subject._id}
                  value={subject.slug}
                >
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>


      {/* Quizzes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-20">
              <h2 className="text-xl font-semibold">Loading quizzes...</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 mb-16 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <h3 className="text-2xl font-semibold text-gray-600">
                    No quizzes found
                  </h3>
                </div>
              )}
              {filteredQuizzes.map((quiz, index) => (
                <div
                  key={quiz.id || quiz._id}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {quiz.title}
                    </h3>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{quiz.questionCount || quiz.questions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{quiz.timeLimit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
                          quiz.difficulty
                        )}`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{quiz.participants}</span>
                    </div>
                  </div>
                  {quiz.userAttempt ? (
                    <div className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-center">
                      Attempted
                    </div>
                  ) : (
                    <Link
                      to={`/quiz/${quiz.id || quiz._id}`}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium block text-center"
                    >
                      Start Quiz
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
          {quizData.length > 0 && quizData.length < total && (
            <div className="flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex gap-2 items-center bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SubjectQuizzes;