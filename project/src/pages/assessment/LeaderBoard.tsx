import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Trophy, Medal, Crown, Search } from "lucide-react";
import { quizAPI } from "../../utils/api";

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userRankData, setUserRankData] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const subjects = [
    { id: "all", name: "All Subjects" },
    { id: "mathematics", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "social-science", name: "Social Science" },
    { id: "english", name: "English" },
  ];

  const fetchLeaderboard = async (subject: string) => {
    setLoading(true);
    try {
      const res = await quizAPI.getLeaderboard(subject);
      if (res.data.success) {
        setLeaderboardData(res.data.data.leaderboard);
        setUserRankData(res.data.data.userRank);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedSubject);
  }, [selectedSubject]);

  const filtered = searchTerm
    ? leaderboardData.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leaderboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-bold tracking-wider uppercase mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/quizzes" className="hover:text-blue-400 transition-colors">
              Quizzes
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-blue-900 rounded-lg font-black">
              Leaderboard
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            Top 100 quiz performers. Climb the ranks and prove your knowledge!
          </p>
        </div>
      </section>

      {/* ── Filters ── */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap justify-center gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className={`px-4 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                    selectedSubject === s.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* User rank highlight */}
          {userRankData && userRankData.rank > 100 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-black rounded-2xl shadow-xl border-2 border-yellow-300">
              <div className="flex items-center gap-5">
                <div className="text-4xl">🏆</div>
                <div className="flex-1">
                  <div className="text-xl font-black">Your Rank</div>
                  <div className="text-sm opacity-80">
                    You're among the top quiz takers!
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">#{userRankData.rank}</div>
                  <div className="text-sm font-bold opacity-80">
                    {userRankData.totalPoints.toLocaleString()} pts
                  </div>
                  <div className="text-xs opacity-70">
                    {userRankData.totalAttempts} quiz
                    {userRankData.totalAttempts !== 1 ? "zes" : ""}
                  </div>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold mb-2">No results found</p>
              <p className="text-sm">
                {searchTerm
                  ? "Try a different search term."
                  : "No one has taken any quizzes yet. Be the first!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Top 3 highlighted */}
              {filtered.slice(0, 3).map((entry, index) => {
                const styles = [
                  {
                    bg: "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300",
                    icon: <Crown className="h-5 w-5 text-yellow-500" />,
                    badge: "bg-yellow-400 text-yellow-900",
                  },
                  {
                    bg: "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300",
                    icon: <Medal className="h-5 w-5 text-gray-400" />,
                    badge: "bg-gray-300 text-gray-800",
                  },
                  {
                    bg: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300",
                    icon: <Medal className="h-5 w-5 text-amber-700" />,
                    badge: "bg-amber-700 text-white",
                  },
                ][index];
                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-5 rounded-xl border-2 ${styles.bg} shadow-md`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${styles.badge}`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900">{entry.name}</div>
                      <div className="text-xs text-gray-500">
                        {entry.totalAttempts} quiz
                        {entry.totalAttempts !== 1 ? "zes" : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {styles.icon}
                      <span className="font-black text-lg text-gray-900">
                        {entry.totalPoints.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">
                        pts
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Ranks 4-100 */}
              {filtered.slice(3).map((entry) => (
                <div
                  key={entry.userId}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className="w-8 text-center font-bold text-gray-400 text-sm">
                    #{entry.rank}
                  </span>
                  <div className="flex-1 font-medium text-gray-800">
                    {entry.name}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">
                      {entry.totalPoints.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Quizzes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
