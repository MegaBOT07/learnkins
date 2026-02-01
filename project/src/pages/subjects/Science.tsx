import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  BookOpen,
  FileText,
  CreditCard,
  HelpCircle,
  Video,
  Download,
  Star,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  Calendar,
  CheckCircle,
  Award,
  Target,
  Zap,
} from "lucide-react";

const Science = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const chapters = [
    {
      id: 1,
      title: "Physics Fundamentals",
      description:
        "Learn the basic principles of physics including mechanics, energy, and motion",
      topics: ["Mechanics", "Energy", "Motion", "Forces"],
      duration: "5 hours",
      difficulty: "Beginner",
      progress: 75,
      materials: {
        videos: 10,
        notes: 15,
        worksheets: 8,
        flashcards: 20,
        quizzes: 5,
      },
    },
    {
      id: 2,
      title: "Chemistry Essentials",
      description:
        "Explore atomic structure, chemical reactions, and molecular bonding",
      topics: [
        "Atomic Structure",
        "Chemical Reactions",
        "Molecular Bonding",
        "Periodic Table",
      ],
      duration: "6 hours",
      difficulty: "Intermediate",
      progress: 60,
      materials: {
        videos: 12,
        notes: 18,
        worksheets: 10,
        flashcards: 25,
        quizzes: 6,
      },
    },
    {
      id: 3,
      title: "Biology & Life Sciences",
      description: "Study living organisms, cells, genetics, and ecosystems",
      topics: ["Cell Biology", "Genetics", "Ecology", "Human Anatomy"],
      duration: "7 hours",
      difficulty: "Intermediate",
      progress: 40,
      materials: {
        videos: 15,
        notes: 20,
        worksheets: 12,
        flashcards: 30,
        quizzes: 7,
      },
    },
    {
      id: 4,
      title: "Environmental Science",
      description:
        "Understand environmental systems, sustainability, and climate change",
      topics: [
        "Ecosystems",
        "Climate Change",
        "Sustainability",
        "Natural Resources",
      ],
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 25,
      materials: {
        videos: 8,
        notes: 12,
        worksheets: 6,
        flashcards: 15,
        quizzes: 4,
      },
    },
  ];

  const stats = {
    totalVideos: 45,
    totalNotes: 65,
    totalWorksheets: 36,
    totalFlashcards: 90,
    totalQuizzes: 22,
    totalStudents: 980,
    averageScore: 84,
    completionRate: 72,
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      id: "videos",
      label: "Video Lessons",
      icon: <Video className="h-5 w-5" />,
    },
    {
      id: "notes",
      label: "Study Notes",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: "worksheets",
      label: "Worksheets",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      id: "assessments",
      label: "Worksheets",
      icon: <Target className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-learnkins-purple-500 to-learnkins-purple-600 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-purple-200 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <Link
              to="/subjects"
              className="hover:text-purple-200 transition-colors"
            >
              Subjects
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Science</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-6xl">🔬</div>
            <div>
              <h1 className="text-5xl font-bold mb-4">Science</h1>
              <p className="text-xl text-purple-100 max-w-2xl">
                Explore the wonders of physics, chemistry, and biology through
                interactive experiments and engaging content. Discover the
                natural world through hands-on learning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalVideos}
              </div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalNotes}
              </div>
              <div className="text-sm text-gray-600">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalWorksheets}
              </div>
              <div className="text-sm text-gray-600">Worksheets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.totalFlashcards}
              </div>
              <div className="text-sm text-gray-600">Flashcards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalQuizzes}
              </div>
              <div className="text-sm text-gray-600">Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {stats.totalStudents}
              </div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.averageScore}%
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "overview" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Course Overview
                </h2>
                <p className="text-lg text-gray-600">
                  Explore scientific concepts through comprehensive study
                  materials
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Chapters
                  </h3>
                  <div className="space-y-4">
                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="bg-white rounded-xl shadow-lg p-6"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                              {chapter.title}
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                              {chapter.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {chapter.topics.map((topic, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500 mb-1">
                              {chapter.difficulty}
                            </div>
                            <div className="text-sm text-gray-500">
                              {chapter.duration}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{chapter.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${chapter.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Link
                            to={`/subjects/science/${chapter.id}`}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Start
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Access
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      to="/notes"
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Study Notes
                          </h4>
                          <p className="text-sm text-gray-600">
                            Comprehensive notes for all topics
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <Link
                      to="/quizzes"
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <HelpCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Practice Quizzes
                          </h4>
                          <p className="text-sm text-gray-600">
                            Test your knowledge
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <Link
                      to="/flashcards"
                      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <CreditCard className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Flashcards
                          </h4>
                          <p className="text-sm text-gray-600">
                            Quick review and memorization
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Video Lessons
                </h2>
                <p className="text-lg text-gray-600">
                  Watch engaging video content with animations and visual
                  explanations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-48 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {chapter.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{chapter.materials.videos} videos</span>
                        <span>{chapter.duration}</span>
                      </div>
                      <Link
                        to={`/subjects/science/${chapter.id}/videos`}
                        className="block w-full text-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Watch Videos
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Study Notes
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive notes covering all important topics and concepts
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {chapter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{chapter.materials.notes} notes</span>
                          <span>{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <BookOpen className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to="/notes"
                        className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Read Notes
                      </Link>
                      <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Download notes"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "worksheets" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Worksheets
                </h2>
                <p className="text-lg text-gray-600">
                  Practice worksheets with problems and exercises for each
                  chapter
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {chapter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{chapter.materials.worksheets} worksheets</span>
                          <span>{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <FileText className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                        Start Practice
                      </button>
                      <button
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Download worksheet"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "flashcards" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Flashcards
                </h2>
                <p className="text-lg text-gray-600">
                  Interactive flashcards for quick review and memorization
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {chapter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{chapter.materials.flashcards} cards</span>
                          <span>{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <CreditCard className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <Link
                      to="/flashcards"
                      className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Start Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Quizzes
                </h2>
                <p className="text-lg text-gray-600">
                  Interactive quizzes and tests to assess your understanding
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {chapter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{chapter.materials.quizzes} quizzes</span>
                          <span>{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <HelpCircle className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <Link
                      to="/quizzes"
                      className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Take Quiz
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Worksheets
                </h2>
                <p className="text-lg text-gray-600">
                  Practice worksheets and assessments to test your science
                  knowledge
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: "science-1",
                    title: "Physics Fundamentals Test",
                    description:
                      "Test your knowledge of basic physics concepts including motion, forces, and energy",
                    difficulty: "Intermediate",
                    timeLimit: "12 min",
                    questions: 5,
                    subject: "Science",
                  },
                  {
                    id: "science-2",
                    title: "Chemical Reactions Assessment",
                    description:
                      "Test your understanding of chemical reactions and their types",
                    difficulty: "Intermediate",
                    timeLimit: "10 min",
                    questions: 5,
                    subject: "Science",
                  },
                  {
                    id: "science-3",
                    title: "Biology Basics Quiz",
                    description:
                      "Test your knowledge of fundamental biology concepts",
                    difficulty: "Beginner",
                    timeLimit: "8 min",
                    questions: 5,
                    subject: "Science",
                  },
                ].map((assessment) => (
                  <div
                    key={assessment.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {assessment.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {assessment.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{assessment.questions} questions</span>
                          <span>{assessment.timeLimit}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              assessment.difficulty === "Beginner"
                                ? "bg-green-100 text-green-800"
                                : assessment.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {assessment.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Target className="h-8 w-8 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/quiz/${assessment.id}`}
                        className="flex-1 bg-orange-600 text-white text-center py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Start Quiz
                      </Link>
                      <a
                        href={`/${
                          assessment.id === "science-1"
                            ? "(3)History of Number Systems.docx"
                            : assessment.id === "science-2"
                            ? "(5)Number Play.docx"
                            : assessment.id === "science-3"
                            ? "(6)Distributive Property.docx"
                            : ""
                        }`}
                        download
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Download worksheet"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Science;
