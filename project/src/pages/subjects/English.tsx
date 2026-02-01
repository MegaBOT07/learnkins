import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Video,
  FileText,
  Download,
  Play,
  HelpCircle,
  CreditCard,
  Book,
  PenTool,
  MessageSquare,
  Eye,
  Star,
  Clock,
  Users,
  Target,
} from "lucide-react";

const English = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const chapters = [
    {
      id: 1,
      title: "Grammar Fundamentals",
      description:
        "Master the basics of English grammar and sentence structure",
      topics: ["Parts of Speech", "Sentence Types", "Tenses", "Punctuation"],
      duration: "4 weeks",
      difficulty: "Beginner",
      materials: {
        videos: 10,
        notes: 15,
        worksheets: 8,
        quizzes: 6,
      },
    },
    {
      id: 2,
      title: "Reading Comprehension",
      description: "Develop critical reading skills and understanding",
      topics: ["Main Idea", "Context Clues", "Inference", "Text Analysis"],
      duration: "3 weeks",
      difficulty: "Intermediate",
      materials: {
        videos: 8,
        notes: 12,
        worksheets: 6,
        quizzes: 4,
      },
    },
    {
      id: 3,
      title: "Creative Writing",
      description: "Express yourself through various forms of writing",
      topics: [
        "Narrative Writing",
        "Descriptive Writing",
        "Poetry",
        "Storytelling",
      ],
      duration: "4 weeks",
      difficulty: "Intermediate",
      materials: {
        videos: 12,
        notes: 18,
        worksheets: 10,
        quizzes: 5,
      },
    },
    {
      id: 4,
      title: "Literature Analysis",
      description: "Explore classic and contemporary literature",
      topics: ["Novels", "Short Stories", "Poetry", "Drama"],
      duration: "5 weeks",
      difficulty: "Advanced",
      materials: {
        videos: 15,
        notes: 20,
        worksheets: 12,
        quizzes: 8,
      },
    },
    {
      id: 5,
      title: "Communication Skills",
      description: "Develop effective speaking and listening skills",
      topics: ["Public Speaking", "Debate", "Active Listening", "Presentation"],
      duration: "3 weeks",
      difficulty: "Intermediate",
      materials: {
        videos: 8,
        notes: 10,
        worksheets: 5,
        quizzes: 3,
      },
    },
    {
      id: 6,
      title: "Vocabulary Building",
      description: "Expand your vocabulary and word usage",
      topics: [
        "Word Roots",
        "Synonyms & Antonyms",
        "Context Usage",
        "Word Origins",
      ],
      duration: "3 weeks",
      difficulty: "Beginner",
      materials: {
        videos: 6,
        notes: 12,
        worksheets: 8,
        quizzes: 4,
      },
    },
  ];

  const quickLinks = [
    {
      title: "Study Notes",
      description: "Access comprehensive study materials",
      icon: <BookOpen className="h-6 w-6" />,
      link: "/notes",
      color: "bg-learnkins-orange-500",
    },
    {
      title: "Quizzes",
      description: "Test your knowledge with interactive quizzes",
      icon: <HelpCircle className="h-6 w-6" />,
      link: "/quizzes",
      color: "bg-learnkins-blue-500",
    },
    {
      title: "Flashcards",
      description: "Review key concepts with flashcards",
      icon: <CreditCard className="h-6 w-6" />,
      link: "/flashcards",
      color: "bg-learnkins-purple-500",
    },
  ];

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "videos",
      label: "Video Lessons",
      icon: <Video className="h-4 w-4" />,
    },
    {
      id: "notes",
      label: "Study Notes",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "worksheets",
      label: "Worksheets",
      icon: <Download className="h-4 w-4" />,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: "quizzes",
      label: "Quizzes",
      icon: <HelpCircle className="h-4 w-4" />,
    },
    {
      id: "assessments",
      label: "Worksheets",
      icon: <Target className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-learnkins-orange-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link
              to="/"
              className="hover:text-learnkins-orange-400 transition-colors"
            >
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <Link
              to="/subjects"
              className="hover:text-learnkins-orange-400 transition-colors"
            >
              Subjects
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>English</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">English</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Develop reading, writing, and communication skills through
            literature and creative exercises
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Access Links */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div
                    className={`${link.color} text-white p-3 rounded-lg inline-block mb-4`}
                  >
                    {link.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-gray-600">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 bg-white rounded-lg p-2 shadow-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-learnkins-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-lg">
            {activeTab === "overview" && (
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      Course Overview
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Book className="h-5 w-5 text-learnkins-orange-600" />
                        <span className="text-gray-700">
                          Grammar, Literature, and Writing
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="h-5 w-5 text-learnkins-orange-600" />
                        <span className="text-gray-700">
                          22 weeks total duration
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-learnkins-orange-600" />
                        <span className="text-gray-700">
                          Beginner to Advanced level
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Eye className="h-5 w-5 text-learnkins-orange-600" />
                        <span className="text-gray-700">
                          59 video lessons available
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      What You'll Learn
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Master English grammar and sentence structure</li>
                      <li>
                        • Develop critical reading and comprehension skills
                      </li>
                      <li>
                        • Express creativity through various writing forms
                      </li>
                      <li>• Analyze and appreciate literature</li>
                      <li>• Build effective communication skills</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Video Lessons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {chapter.materials.videos} videos
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Play className="h-4 w-4 text-learnkins-orange-600" />
                        <span className="text-sm text-gray-600">
                          Start Learning
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Study Notes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {chapter.materials.notes} notes
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-learnkins-orange-600" />
                        <span className="text-sm text-gray-600">
                          Read Notes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "worksheets" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Worksheets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {chapter.materials.worksheets} worksheets
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4 text-learnkins-orange-600" />
                        <span className="text-sm text-gray-600">Download</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "flashcards" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Flashcards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          Flashcards available
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-learnkins-orange-600" />
                        <span className="text-sm text-gray-600">Practice</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "quizzes" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Quizzes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="bg-gray-50 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {chapter.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {chapter.materials.quizzes} quizzes
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {chapter.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <HelpCircle className="h-4 w-4 text-learnkins-orange-600" />
                        <span className="text-sm text-gray-600">Take Quiz</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "assessments" && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Worksheets
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Practice worksheets and assessments to test your English
                  skills
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      id: "english-1",
                      title: "Grammar Fundamentals Quiz",
                      description:
                        "Test your understanding of parts of speech and basic grammar",
                      difficulty: "Beginner",
                      timeLimit: "8 min",
                      questions: 5,
                      subject: "English",
                    },
                    {
                      id: "english-2",
                      title: "Reading Comprehension Assessment",
                      description:
                        "Test your reading comprehension and analysis skills",
                      difficulty: "Intermediate",
                      timeLimit: "10 min",
                      questions: 5,
                      subject: "English",
                    },
                    {
                      id: "english-3",
                      title: "Writing and Literature Test",
                      description:
                        "Test your knowledge of writing techniques and literary elements",
                      difficulty: "Intermediate",
                      timeLimit: "8 min",
                      questions: 5,
                      subject: "English",
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
                            assessment.id === "english-1"
                              ? "(1)Square and Cube.docx"
                              : assessment.id === "english-2"
                              ? "(2)Arithmetic Expressions.docx"
                              : assessment.id === "english-3"
                              ? "(3)History of Number Systems.docx"
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
        </div>
      </section>
    </div>
  );
};

export default English;
