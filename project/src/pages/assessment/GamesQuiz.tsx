import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Trophy, Users, Brain, Target } from "lucide-react";

const GamesQuiz = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "science", name: "Science" },
    { id: "math", name: "Mathematics" },
    { id: "social", name: "Social Science" },
    { id: "english", name: "English" },
  ];

  const quizzes = [
    {
      id: "quiz-1",
      title: "Science Quick Quiz",
      questions: 15,
      duration: "10 min",
      difficulty: "Medium",
      category: "science",
      participants: 2450,
    },
    {
      id: "quiz-2",
      title: "Math Challenge",
      questions: 20,
      duration: "15 min",
      difficulty: "Hard",
      category: "math",
      participants: 1980,
    },
    {
      id: "quiz-3",
      title: "History Facts",
      questions: 12,
      duration: "8 min",
      difficulty: "Easy",
      category: "social",
      participants: 1750,
    },
    {
      id: "quiz-4",
      title: "English Grammar Test",
      questions: 18,
      duration: "12 min",
      difficulty: "Medium",
      category: "english",
      participants: 1450,
    },
  ];

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

  const quizBorders = [
    "border-cyan-500",
    "border-pink-500",
    "border-orange-500",
    "border-purple-500",
  ];

  const featureColors = [
    "text-cyan-600 bg-cyan-50 border-cyan-300",
    "text-pink-600 bg-pink-50 border-pink-300",
    "text-orange-600 bg-orange-50 border-orange-300",
    "text-purple-600 bg-purple-50 border-purple-300",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <section className="relative bg-black text-white border-b-4 border-cyan-500 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-bold tracking-wider uppercase mb-6">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-black rounded-lg border-2 border-white font-black">
              Quizzes
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
            Game Quizzes
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Test your knowledge with engaging educational quizzes that make
            learning fun and interactive
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-14 bg-gray-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { icon: <Brain className="h-7 w-7" />, title: "Brain Training", description: "Enhance cognitive skills" },
              { icon: <Target className="h-7 w-7" />, title: "Goal Oriented", description: "Achievement-based learning" },
              { icon: <Trophy className="h-7 w-7" />, title: "Competitive", description: "Leaderboards & rewards" },
              { icon: <Users className="h-7 w-7" />, title: "Multiplayer", description: "Learn with friends" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`text-center p-6 bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}
              >
                <div className={`mb-3 flex justify-center ${featureColors[index].split(" ")[0]}`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-black text-black mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Filters ── */}
      <section className="py-8 bg-white border-b-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${selectedCategory === category.id
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
                    : "bg-white text-black border-black hover:bg-gray-50"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quiz Cards ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black tracking-tight mb-2">
              Quick Quizzes
            </h2>
            <p className="text-gray-600">
              Test your knowledge with these engaging quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 border-2 ${quizBorders[index % 4]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}
              >
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center mx-auto mb-3 border-2 border-black">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-black">
                    {quiz.title}
                  </h3>
                </div>

                <div className="space-y-2 mb-5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Questions:</span>
                    <span className="font-bold text-black">{quiz.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="font-bold text-black">{quiz.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Difficulty:</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getDifficultyStyle(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Participants:</span>
                    <span className="font-bold text-black">{quiz.participants}</span>
                  </div>
                </div>

                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full bg-black text-white py-2.5 px-4 rounded-xl border-2 border-black font-bold block text-center hover:bg-white hover:text-black transition-all"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <section className="py-16 bg-black text-white border-t-4 border-cyan-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-2">
              Top Performers This Week
            </h2>
            <p className="text-gray-400">
              See how you rank against other students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Alex Johnson", score: 9850, badge: "🥇", rank: 1, border: "border-yellow-400" },
              { name: "Sarah Chen", score: 9720, badge: "🥈", rank: 2, border: "border-gray-300" },
              { name: "Mike Rodriguez", score: 9650, badge: "🥉", rank: 3, border: "border-orange-400" },
            ].map((player, index) => (
              <div
                key={index}
                className={`bg-white text-black rounded-2xl p-6 text-center border-2 ${player.border} shadow-[4px_4px_0px_0px_rgba(0,206,209,0.6)]`}
              >
                <div className="text-4xl mb-3">{player.badge}</div>
                <h3 className="text-lg font-black mb-1">{player.name}</h3>
                <div className="text-2xl font-black text-cyan-600">
                  {player.score} pts
                </div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
                  Rank #{player.rank}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/community"
              className="inline-flex items-center px-8 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-black hover:text-white hover:border-cyan-500 transition-all text-lg"
            >
              View Full Leaderboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GamesQuiz;
