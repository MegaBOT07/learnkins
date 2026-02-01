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
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Quick Quizzes
            </h2>
            <p className="text-xl text-gray-600">
              Test your knowledge with these engaging quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quizzes.map((quiz, index) => (
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
                    <span className="font-medium">{quiz.questions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{quiz.duration}</span>
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

                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium block text-center"
                >
                  Start Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Top Performers This Week
            </h2>
            <p className="text-xl opacity-90">
              See how you rank against other students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Alex Johnson", score: 9850, badge: "🥇", rank: 1 },
              { name: "Sarah Chen", score: 9720, badge: "🥈", rank: 2 },
              { name: "Mike Rodriguez", score: 9650, badge: "🥉", rank: 3 },
            ].map((player, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-3">{player.badge}</div>
                <h3 className="text-xl font-bold mb-2">{player.name}</h3>
                <div className="text-2xl font-bold text-yellow-300">
                  {player.score} pts
                </div>
                <div className="text-sm opacity-75">Rank #{player.rank}</div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/community"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
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
