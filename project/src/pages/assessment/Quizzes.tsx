import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Trophy, BookOpen, Search, Users } from "lucide-react";

interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  timeLimit: number;
  questionCount: number;
  description: string;
  participants: number;
}

const Quizzes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // Demo quiz data matching the image design
  const quizzes: Quiz[] = [
    {
      id: "quiz-1",
      title: "Science Quick Quiz",
      subject: "Science",
      grade: "6th",
      difficulty: "Medium",
      timeLimit: 10,
      questionCount: 15,
      description:
        "Test your knowledge of basic scientific concepts and natural phenomena.",
      participants: 2450,
    },
    {
      id: "quiz-2",
      title: "Math Challenge",
      subject: "Mathematics",
      grade: "7th",
      difficulty: "Hard",
      timeLimit: 15,
      questionCount: 20,
      description:
        "Advanced mathematical problems including algebra and geometry.",
      participants: 1980,
    },
    {
      id: "quiz-3",
      title: "History Facts",
      subject: "Social Science",
      grade: "6th",
      difficulty: "Easy",
      timeLimit: 8,
      questionCount: 12,
      description:
        "Explore historical events and important facts from different eras.",
      participants: 1750,
    },
    {
      id: "quiz-4",
      title: "English Grammar Test",
      subject: "English",
      grade: "8th",
      difficulty: "Medium",
      timeLimit: 12,
      questionCount: 18,
      description: "Master grammar rules and improve your language skills.",
      participants: 1450,
    },
    {
      id: "quiz-5",
      title: "Physics Fundamentals",
      subject: "Science",
      grade: "8th",
      difficulty: "Hard",
      timeLimit: 15,
      questionCount: 20,
      description: "Understand Newton's laws and basic physics concepts.",
      participants: 1200,
    },
    {
      id: "quiz-6",
      title: "Algebra Basics",
      subject: "Mathematics",
      grade: "7th",
      difficulty: "Medium",
      timeLimit: 10,
      questionCount: 15,
      description: "Solve linear equations and understand algebraic concepts.",
      participants: 2100,
    },
  ];

  const subjects = [
    "all",
    "Science",
    "Mathematics",
    "English",
    "Social Science",
  ];
  const grades = ["all", "6th", "7th", "8th"];
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || quiz.subject === selectedSubject;
    const matchesGrade =
      selectedGrade === "all" || quiz.grade === selectedGrade;
    const matchesDifficulty =
      selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty;

    return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty;
  });

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

  const getSubjectIcon = (subject: string) => {
    switch (subject) {
      case "Mathematics":
        return "🧮";
      case "Science":
        return "🔬";
      case "English":
        return "📚";
      case "Social Science":
        return "🌍";
      default:
        return "📖";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Quick Quizzes
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with these engaging quizzes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Subject Filter */}
            <div>
              <label
                htmlFor="subject-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <select
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by subject"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Filter */}
            <div>
              <label
                htmlFor="grade-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Grade
              </label>
              <select
                id="grade-filter"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by grade"
              >
                {grades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade === "all" ? "All Grades" : `${grade} Grade`}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label
                htmlFor="difficulty-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Difficulty
              </label>
              <select
                id="difficulty-filter"
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Filter by difficulty"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Difficulties" : difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Trophy Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                {/* Quiz Title */}
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-4">
                  {quiz.title}
                </h3>

                {/* Quiz Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Questions:</span>
                    <span className="font-medium">{quiz.questionCount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Duration:</span>
                    <span className="font-medium">{quiz.timeLimit} min</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Difficulty:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Participants:</span>
                    <span className="font-medium">
                      {quiz.participants.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium block"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredQuizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No quizzes found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters to find more quizzes.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("all");
                setSelectedGrade("all");
                setSelectedDifficulty("all");
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {quizzes.length}
            </div>
            <div className="text-gray-600">Total Quizzes</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {quizzes.filter((q) => q.difficulty === "Easy").length}
            </div>
            <div className="text-gray-600">Beginner Friendly</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {quizzes.filter((q) => q.difficulty === "Hard").length}
            </div>
            <div className="text-gray-600">Advanced Level</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;
