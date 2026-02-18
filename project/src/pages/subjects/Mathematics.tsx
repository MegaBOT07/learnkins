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

const Mathematics = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const chapters = [
    {
      id: 1,
      title: "Algebra Fundamentals",
      description: "Learn the basics of algebraic expressions, equations, and inequalities",
      topics: ["Linear Equations", "Quadratic Functions", "Polynomials", "Inequalities"],
      duration: "4 hours",
      difficulty: "Beginner",
      progress: 85,
      materials: { videos: 8, notes: 12, worksheets: 6, flashcards: 15, quizzes: 4 },
    },
    {
      id: 2,
      title: "Geometry & Trigonometry",
      description: "Explore geometric shapes, angles, and trigonometric functions",
      topics: ["Triangles", "Circles", "Trigonometric Ratios", "Coordinate Geometry"],
      duration: "6 hours",
      difficulty: "Intermediate",
      progress: 65,
      materials: { videos: 10, notes: 15, worksheets: 8, flashcards: 20, quizzes: 5 },
    },
    {
      id: 3,
      title: "Calculus Basics",
      description: "Introduction to limits, derivatives, and basic integration",
      topics: ["Limits", "Derivatives", "Integration", "Applications"],
      duration: "8 hours",
      difficulty: "Advanced",
      progress: 45,
      materials: { videos: 12, notes: 18, worksheets: 10, flashcards: 25, quizzes: 6 },
    },
    {
      id: 4,
      title: "Statistics & Probability",
      description: "Learn data analysis, probability theory, and statistical methods",
      topics: ["Data Analysis", "Probability", "Normal Distribution", "Hypothesis Testing"],
      duration: "5 hours",
      difficulty: "Intermediate",
      progress: 30,
      materials: { videos: 9, notes: 14, worksheets: 7, flashcards: 18, quizzes: 4 },
    },
  ];

  const stats = {
    totalVideos: 39, totalNotes: 59, totalWorksheets: 31, totalFlashcards: 78,
    totalQuizzes: 19, totalStudents: 1250, averageScore: 87, completionRate: 78,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="h-5 w-5" /> },
    { id: "videos", label: "Video Lessons", icon: <Video className="h-5 w-5" /> },
    { id: "notes", label: "Study Notes", icon: <BookOpen className="h-5 w-5" /> },
    { id: "worksheets", label: "Worksheets", icon: <FileText className="h-5 w-5" /> },
    { id: "flashcards", label: "Flashcards", icon: <CreditCard className="h-5 w-5" /> },
    { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "assessments", label: "Worksheets", icon: <Target className="h-5 w-5" /> },
  ];

  const statItems = [
    { value: stats.totalVideos, label: "Videos", color: "text-blue-600", border: "border-blue-500" },
    { value: stats.totalNotes, label: "Notes", color: "text-green-600", border: "border-green-500" },
    { value: stats.totalWorksheets, label: "Worksheets", color: "text-orange-600", border: "border-orange-500" },
    { value: stats.totalFlashcards, label: "Flashcards", color: "text-pink-600", border: "border-pink-500" },
    { value: stats.totalQuizzes, label: "Quizzes", color: "text-purple-600", border: "border-purple-500" },
    { value: stats.totalStudents, label: "Students", color: "text-cyan-600", border: "border-cyan-500" },
    { value: `${stats.averageScore}%`, label: "Avg Score", color: "text-green-600", border: "border-green-500" },
    { value: `${stats.completionRate}%`, label: "Completion", color: "text-yellow-600", border: "border-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section className="relative bg-blue-500 text-white border-b-4 border-black overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/subjects" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Subjects</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-blue-600 rounded-lg border-2 border-white font-black">Mathematics</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-7xl p-4 bg-white/20 rounded-2xl border-2 border-white/30">📊</div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tight">Mathematics</h1>
              <p className="text-xl text-white/90 max-w-2xl font-medium">
                Master mathematical concepts from basic arithmetic to advanced
                problem-solving techniques. Develop logical thinking and analytical skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {statItems.map((stat, i) => (
              <div key={i} className={`text-center p-3 rounded-xl border-2 ${stat.border} bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b-2 border-black sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(59,130,246,1)]"
                    : "bg-white text-black border-black hover:bg-gray-50"
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
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Course Overview</h2>
                <p className="text-lg text-gray-600 font-medium">Master mathematical concepts through comprehensive study materials</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wider">Chapters</h3>
                  <div className="space-y-4">
                    {chapters.map((chapter, idx) => {
                      const colors = ["border-blue-500", "border-purple-500", "border-green-500", "border-orange-500"];
                      return (
                        <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${colors[idx % 4]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-black text-black mb-2">{chapter.title}</h4>
                              <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {chapter.topics.map((topic, index) => (
                                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold border border-blue-200">{topic}</span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{chapter.difficulty}</div>
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{chapter.duration}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-sm mb-1 font-bold">
                                <span>Progress</span>
                                <span>{chapter.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${chapter.progress}%` }} />
                              </div>
                            </div>
                            <Link to={`/subjects/mathematics/${chapter.id}`} className="px-5 py-2.5 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]">Start</Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wider">Quick Access</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { to: "/notes", icon: <BookOpen className="h-6 w-6" />, title: "Study Notes", desc: "Comprehensive notes for all topics", color: "border-green-500", iconBg: "bg-green-50", iconColor: "text-green-600" },
                      { to: "/quizzes", icon: <HelpCircle className="h-6 w-6" />, title: "Practice Quizzes", desc: "Test your knowledge", color: "border-blue-500", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                      { to: "/flashcards", icon: <CreditCard className="h-6 w-6" />, title: "Flashcards", desc: "Quick review and memorization", color: "border-purple-500", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
                    ].map((item, i) => (
                      <Link key={i} to={item.to} className={`flex items-center justify-between p-5 bg-white rounded-2xl border-2 ${item.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group`}>
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${item.iconBg} rounded-xl border-2 border-black ${item.iconColor}`}>{item.icon}</div>
                          <div>
                            <h4 className="font-black text-black">{item.title}</h4>
                            <p className="text-sm text-gray-600 font-medium">{item.desc}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-black group-hover:translate-x-1 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Video Lessons</h2>
                <p className="text-lg text-gray-600 font-medium">Watch engaging video content with animations and visual explanations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white rounded-2xl border-2 border-blue-500 overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                    <div className="bg-blue-500 h-48 flex items-center justify-center border-b-2 border-black">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"><Play className="h-8 w-8 text-white fill-white" /></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                      <p className="text-gray-600 text-sm font-medium mb-4">{chapter.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 font-bold mb-4">
                        <span>{chapter.materials.videos} videos</span>
                        <span>{chapter.duration}</span>
                      </div>
                      <Link to={`/subjects/mathematics/${chapter.id}/videos`} className="block w-full text-center bg-black text-white py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Watch Videos</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "notes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Study Notes</h2>
                <p className="text-lg text-gray-600 font-medium">Comprehensive notes covering all important topics and concepts</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white rounded-2xl p-6 border-2 border-green-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 font-bold">
                          <span>{chapter.materials.notes} notes</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs border border-gray-200">{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-green-50 rounded-xl border-2 border-black"><BookOpen className="h-8 w-8 text-green-600" /></div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to="/notes" className="flex-1 bg-black text-white text-center py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Read Notes</Link>
                      <button className="px-4 py-3 border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all" title="Download notes"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "worksheets" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Worksheets</h2>
                <p className="text-lg text-gray-600 font-medium">Practice worksheets with problems and exercises for each chapter</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white rounded-2xl p-6 border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 font-bold">
                          <span>{chapter.materials.worksheets} worksheets</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs border border-gray-200">{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-orange-50 rounded-xl border-2 border-black"><FileText className="h-8 w-8 text-orange-600" /></div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-black text-white py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Start Practice</button>
                      <button className="px-4 py-3 border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all" title="Download worksheet"><Download className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "flashcards" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Flashcards</h2>
                <p className="text-lg text-gray-600 font-medium">Interactive flashcards for quick review and memorization</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white rounded-2xl p-6 border-2 border-pink-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 font-bold">
                          <span>{chapter.materials.flashcards} cards</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs border border-gray-200">{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-pink-50 rounded-xl border-2 border-black"><CreditCard className="h-8 w-8 text-pink-600" /></div>
                    </div>
                    <Link to="/flashcards" className="block w-full bg-black text-white text-center py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Start Review</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Quizzes</h2>
                <p className="text-lg text-gray-600 font-medium">Interactive quizzes and tests to assess your understanding</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 font-bold">
                          <span>{chapter.materials.quizzes} quizzes</span>
                          <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs border border-gray-200">{chapter.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-blue-50 rounded-xl border-2 border-black"><HelpCircle className="h-8 w-8 text-blue-600" /></div>
                    </div>
                    <Link to="/quizzes" className="block w-full bg-black text-white text-center py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Take Quiz</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Worksheets</h2>
                <p className="text-lg text-gray-600 font-medium">Practice worksheets and assessments to test your mathematical skills</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: "math-1", title: "Square and Cube Numbers Assessment", description: "Test your understanding of square and cube numbers, their properties, and applications", difficulty: "Intermediate", timeLimit: "10 min", questions: 5 },
                  { id: "math-2", title: "Arithmetic Expressions Quiz", description: "Practice evaluating arithmetic expressions using order of operations", difficulty: "Beginner", timeLimit: "8 min", questions: 5 },
                  { id: "math-3", title: "Geometry Fundamentals Test", description: "Test your knowledge of basic geometric concepts and shapes", difficulty: "Beginner", timeLimit: "10 min", questions: 5 },
                ].map((assessment) => (
                  <div key={assessment.id} className="bg-white rounded-2xl p-6 border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{assessment.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{assessment.description}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 font-bold">
                          <span>{assessment.questions} questions</span>
                          <span>{assessment.timeLimit}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${assessment.difficulty === "Beginner" ? "bg-green-100 text-green-800 border-green-300" : assessment.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300"
                            }`}>{assessment.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-orange-50 rounded-xl border-2 border-black"><Target className="h-8 w-8 text-orange-600" /></div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/quiz/${assessment.id}`} className="flex-1 bg-black text-white text-center py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Start Quiz</Link>
                      <a
                        href={`/${assessment.id === "math-1" ? "(1)Square and Cube.docx" : assessment.id === "math-2" ? "(2)Arithmetic Expressions.docx" : assessment.id === "math-3" ? "(4)Quadrilaterals.docx" : ""}`}
                        download
                        className="px-4 py-3 border-2 border-black text-black rounded-xl hover:bg-black hover:text-white transition-all"
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

export default Mathematics;
