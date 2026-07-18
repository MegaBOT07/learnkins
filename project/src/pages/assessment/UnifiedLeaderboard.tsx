import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Search,
  Gamepad2,
  Target,
  Flame,
} from "lucide-react";
import { leaderboardAPI } from "../../utils/api";

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  points: number;
  experience: number;
  level: number;
  totalQuizzesTaken: number;
  totalGamesPlayed: number;
  perfectScores: number;
  currentStreak: number;
  isCurrentUser: boolean;
}

const FILTERS = [
  { id: "all", label: "All", icon: <Trophy className="h-4 w-4" /> },
  { id: "quizzes", label: "Quizzes", icon: <Target className="h-4 w-4" /> },
  { id: "games", label: "Games", icon: <Gamepad2 className="h-4 w-4" /> },
];

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard({ filter: activeFilter });
      if (res.data.success) {
        setLeaderboard(res.data.data.leaderboard);
        setUserRank(res.data.data.userRank);
      }
    } catch (err) {
      console.error("Leaderboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [activeFilter]);

  const filtered = searchTerm
    ? leaderboard.filter((e) =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leaderboard;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="relative bg-black text-white overflow-hidden border-b-4 border-black">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center space-x-2 text-sm font-bold tracking-wider uppercase mb-6">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-black rounded-lg font-black border-2 border-white">
              Leaderboard
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto font-medium">
            Top 100 performers across quizzes and games. Climb the ranks!
          </p>
        </div>
      </section>

      {/* ── Filters & Search ── */}
      <section className="py-6 bg-white border-b-2 border-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap justify-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-black font-bold text-sm transition-all ${
                    activeFilter === f.id
                      ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {f.icon}
                  {f.label}
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
                className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl text-sm font-bold focus:outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 font-bold">Loading leaderboard...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* User rank highlight (if outside top 100) */}
          {userRank && (
            <div className="mb-8 p-6 bg-yellow-400 text-black rounded-2xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-white rounded-2xl border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <Trophy className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-black uppercase tracking-wider opacity-70 mb-1">
                    Your Rank
                  </div>
                  <div className="text-2xl font-black">
                    {userRank.name}
                  </div>
                  <div className="text-sm font-bold opacity-70 mt-1">
                    Keep climbing! You're among all quiz and game takers.
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black">#{userRank.rank}</div>
                  <div className="text-lg font-black mt-1">
                    {userRank.points.toLocaleString()} pts
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-sm font-bold opacity-70">
                    <span className="flex items-center gap-1">
                      <Target className="h-3.5 w-3.5" />
                      {userRank.totalQuizzesTaken} quizzes
                    </span>
                    <span className="flex items-center gap-1">
                      <Gamepad2 className="h-3.5 w-3.5" />
                      {userRank.totalGamesPlayed} games
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Trophy className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold mb-2">No results found</p>
              <p className="text-sm font-medium">
                {searchTerm
                  ? "Try a different search term."
                  : "No one has earned points yet. Be the first!"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Top 3 highlighted */}
              {filtered.slice(0, 3).map((entry) => {
                const styles = [
                  {
                    bg: "bg-yellow-100 border-yellow-400",
                    icon: <Crown className="h-5 w-5 text-yellow-500" />,
                    badge: "bg-yellow-400 text-yellow-900 border-yellow-500",
                  },
                  {
                    bg: "bg-gray-100 border-gray-400",
                    icon: <Medal className="h-5 w-5 text-gray-500" />,
                    badge: "bg-gray-300 text-gray-800 border-gray-400",
                  },
                  {
                    bg: "bg-orange-50 border-orange-300",
                    icon: <Medal className="h-5 w-5 text-orange-600" />,
                    badge: "bg-orange-400 text-white border-orange-500",
                  },
                ][entry.rank - 1];

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-black ${styles.bg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      entry.isCurrentUser ? "ring-4 ring-blue-500 ring-offset-2" : ""
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 border-black ${styles.badge}`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-gray-900 text-lg">{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-lg font-black border-2 border-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-600">
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {entry.totalQuizzesTaken} quizzes
                        </span>
                        <span className="flex items-center gap-1">
                          <Gamepad2 className="h-3 w-3" />
                          {entry.totalGamesPlayed} games
                        </span>
                        {entry.currentStreak > 0 && (
                          <span className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {entry.currentStreak} streak
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {styles.icon}
                      <span className="font-black text-xl text-gray-900">
                        {entry.points.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-gray-500">pts</span>
                    </div>
                  </div>
                );
              })}

              {/* Ranks 4-100 */}
              {filtered.slice(3).map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                    entry.isCurrentUser
                      ? "shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] border-blue-500 bg-blue-50"
                      : "shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <span className="w-10 text-center font-black text-gray-400 text-sm">
                    #{entry.rank}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-gray-800">{entry.name}</span>
                      {entry.isCurrentUser && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-lg font-black border-2 border-black">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {entry.totalQuizzesTaken}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gamepad2 className="h-3 w-3" />
                        {entry.totalGamesPlayed}
                      </span>
                      {entry.currentStreak > 0 && (
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {entry.currentStreak}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-gray-900">
                      {entry.points.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold text-gray-400 ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/quizzes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
