import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Brain, Target, Medal, Crown } from "lucide-react";
import { quizAPI } from "../../utils/api";

const GamesQuiz = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quizData, setQuizData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userRankData, setUserRankData] = useState<any>(null);
  const [leaderboardSubject, setLeaderboardSubject] = useState("all");


  useEffect(() => {
    const fetchHomepageQuizzes = async () => {
      try {
        const response = await quizAPI.getHomepageQuizCards();

        if (response.data.success) {
          setQuizData(response.data.data);
        }
      } catch (error) {
        console.error(error); 
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageQuizzes();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await quizAPI.getLeaderboard(leaderboardSubject);
        if (res.data.success) {
          setLeaderboardData(res.data.data.leaderboard);
          setUserRankData(res.data.data.userRank);
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    };
    fetchLeaderboard();
  }, [leaderboardSubject]);

  const categories = [
    { id: "all", name: "All Categories" },

    ...(quizData?.filteredCategories || []).map((category: any) => ({
      id: category.subject,
      name: category.subject,
    })),
  ];

  const filteredQuizzes =
    selectedCategory === "all"
      ? quizData?.all || []
      : quizData?.filteredCategories?.find(
        (cat: any) => cat.subject === selectedCategory
      )?.quizzes || [];

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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Quizzes</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Test your knowledge with engaging educational quizzes that make
            learning fun and interactive
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Brain className="h-8 w-8" />,
                title: "Brain Training",
                description: "Enhance cognitive skills",
              },
              {
                icon: <Target className="h-8 w-8" />,
                title: "Goal Oriented",
                description: "Achievement-based learning",
              },
              {
                icon: <Trophy className="h-8 w-8" />,
                title: "Competitive",
                description: "Leaderboards & rewards",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Multiplayer",
                description: "Learn with friends",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
              >
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      {
        loading ? (
          <div className="text-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
            ></div>
            <p className="mt-4 text-gray-600">Loading quizzes...</p>
          </div>
        )
          : (
            <section className="py-20 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 mb-16 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredQuizzes.map((quiz, index) => (
                    <div
                      key={index}
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
                          <span className="font-medium">{quiz.questionCount}</span>
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
                      </div>

                      {quiz.userAttempt ? (
                        <div className="block w-full py-2 px-4 rounded-lg text-white font-semibold text-center bg-green-600">
                          Attempted
                        </div>
                      ) : (
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="block w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-md hover:scale-105"
                        >
                          Start Quiz
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center">
                  <Link
                    to={`/games-quiz/${selectedCategory}`}
                    className=" flex gap-2 items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium block text-center"
                  >
                    View all <ArrowRight />
                  </Link>
                </div>
              </div>
            </section>
          )
      }

      {/* Leaderboard Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <h2 className="text-4xl font-bold">Leaderboard</h2>
            </div>
            <p className="text-xl text-blue-200">
              Top performers in quiz challenges
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <select
              value={leaderboardSubject}
              onChange={(e) => setLeaderboardSubject(e.target.value)}
              className="px-4 py-3 rounded-lg text-black border-2 border-white focus:outline-none bg-white font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="social-science">Social Science</option>
              <option value="english">English</option>
            </select>
          </div>

          {/* Top 3 */}
          {leaderboardData.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              {leaderboardData.slice(0, 3).map((entry, index) => {
                const medals = [
                  { icon: <Crown className="h-8 w-8 text-yellow-400" />, bg: "from-yellow-400 to-amber-600", border: "border-yellow-400" },
                  { icon: <Medal className="h-8 w-8 text-gray-300" />, bg: "from-gray-300 to-gray-500", border: "border-gray-300" },
                  { icon: <Medal className="h-8 w-8 text-amber-700" />, bg: "from-amber-700 to-amber-900", border: "border-amber-700" },
                ][index];
                const scale = index === 0 ? "scale-110" : "scale-100";
                return (
                  <div key={entry.userId} className={`${scale} bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center border ${medals.border} hover:bg-opacity-20 transition-all`}>
                    <div className="flex justify-center mb-3">{medals.icon}</div>
                    <h3 className="text-xl font-bold mb-1">{entry.name}</h3>
                    <div className="text-3xl font-black text-yellow-300 mb-1">{entry.totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-blue-200">points</div>
                    <div className="text-xs text-blue-300 mt-2">{entry.totalAttempts} quiz{entry.totalAttempts !== 1 ? 'zes' : ''} completed</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Rest of top 100 */}
          {leaderboardData.length > 3 && (
            <div className="max-w-3xl mx-auto space-y-2 mb-8">
              {leaderboardData.slice(3).map((entry) => (
                <div key={entry.userId} className="flex items-center gap-4 bg-white bg-opacity-5 rounded-lg px-5 py-3 hover:bg-opacity-10 transition-all">
                  <span className="w-8 text-center font-bold text-blue-300">#{entry.rank}</span>
                  <div className="flex-1 font-medium">{entry.name}</div>
                  <div className="font-bold text-yellow-300">{entry.totalPoints.toLocaleString()} <span className="text-xs text-blue-300 font-normal">pts</span></div>
                </div>
              ))}
            </div>
          )}

          {leaderboardData.length === 0 && (
            <div className="text-center py-12 text-blue-300">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No leaderboard data yet. Start taking quizzes to earn points!</p>
            </div>
          )}

          {/* User rank highlight if above 100 */}
          {userRankData && userRankData.rank > 100 && (
            <div className="max-w-3xl mx-auto mb-8 p-5 bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🏆</div>
                <div className="flex-1">
                  <div className="text-lg font-bold">Your Rank</div>
                  <div className="text-sm opacity-80">You are in the top performers!</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black">#{userRankData.rank}</div>
                  <div className="text-sm font-semibold">{userRankData.totalPoints.toLocaleString()} pts</div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <Link
              to="/games-quiz/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 font-bold rounded-lg text-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View Full Leaderboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GamesQuiz;