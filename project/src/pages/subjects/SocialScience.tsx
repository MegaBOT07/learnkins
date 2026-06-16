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
  Globe,
  Map,
  Users,
  Calendar,
  Star,
  Clock,
  Eye,
  Target,
} from "lucide-react";

const SocialScience = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const chapters = [
    { id: 1, title: "Ancient Civilizations", description: "Explore the rise and fall of ancient civilizations", topics: ["Mesopotamia", "Egypt", "Greece", "Rome", "China"], duration: "4 weeks", difficulty: "Intermediate", materials: { videos: 8, notes: 12, worksheets: 6, quizzes: 4 } },
    { id: 2, title: "Medieval Period", description: "Understanding the Middle Ages and feudal systems", topics: ["Feudalism", "Crusades", "Black Death", "Renaissance"], duration: "3 weeks", difficulty: "Intermediate", materials: { videos: 6, notes: 10, worksheets: 5, quizzes: 3 } },
    { id: 3, title: "Modern History", description: "Industrial Revolution to present day", topics: ["Industrial Revolution", "World Wars", "Cold War", "Globalization"], duration: "5 weeks", difficulty: "Advanced", materials: { videos: 10, notes: 15, worksheets: 8, quizzes: 5 } },
    { id: 4, title: "Physical Geography", description: "Earth's physical features and natural processes", topics: ["Landforms", "Climate", "Natural Resources", "Ecosystems"], duration: "4 weeks", difficulty: "Intermediate", materials: { videos: 7, notes: 12, worksheets: 6, quizzes: 4 } },
    { id: 5, title: "Human Geography", description: "Human populations, cultures, and settlements", topics: ["Population", "Migration", "Urbanization", "Cultural Diversity"], duration: "3 weeks", difficulty: "Intermediate", materials: { videos: 6, notes: 10, worksheets: 5, quizzes: 3 } },
    { id: 6, title: "Civics and Government", description: "Understanding democracy and governance", topics: ["Democracy", "Constitution", "Elections", "Rights & Duties"], duration: "4 weeks", difficulty: "Intermediate", materials: { videos: 8, notes: 12, worksheets: 6, quizzes: 4 } },
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: <BookOpen className="h-5 w-5" /> },
    { id: "videos", label: "Video Lessons", icon: <Video className="h-5 w-5" /> },
    { id: "notes", label: "Study Notes", icon: <FileText className="h-5 w-5" /> },
    { id: "worksheets", label: "Worksheets", icon: <Download className="h-5 w-5" /> },
    { id: "flashcards", label: "Flashcards", icon: <CreditCard className="h-5 w-5" /> },
    { id: "quizzes", label: "Quizzes", icon: <HelpCircle className="h-5 w-5" /> },
    { id: "assessments", label: "Worksheets", icon: <Target className="h-5 w-5" /> },
  ];

  const chapterColors = ["border-green-500", "border-blue-500", "border-purple-500", "border-orange-500", "border-pink-500", "border-cyan-500"];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section className="relative bg-green-500 text-white border-b-4 border-black overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/subjects" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Subjects</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-green-600 rounded-lg border-2 border-white font-black">Social Science</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-7xl p-4 bg-white/20 rounded-2xl border-2 border-white/30">🌍</div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tight">Social Science</h1>
              <p className="text-xl text-white/90 max-w-2xl font-medium">
                Explore history, geography, and civics through engaging content and
                interactive learning experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-8 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { to: "/notes", icon: <BookOpen className="h-6 w-6" />, title: "Study Notes", desc: "Access comprehensive study materials", color: "border-green-500", iconBg: "bg-green-50", iconColor: "text-green-600" },
              { to: "/quizzes", icon: <HelpCircle className="h-6 w-6" />, title: "Quizzes", desc: "Test your knowledge with interactive quizzes", color: "border-blue-500", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
              { to: "/flashcards", icon: <CreditCard className="h-6 w-6" />, title: "Flashcards", desc: "Review key concepts with flashcards", color: "border-purple-500", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
            ].map((item, i) => (
              <Link key={i} to={item.to} className={`flex items-center space-x-3 p-5 bg-white rounded-2xl border-2 ${item.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all group`}>
                <div className={`p-3 ${item.iconBg} rounded-xl border-2 border-black ${item.iconColor}`}>{item.icon}</div>
                <div className="flex-1">
                  <h4 className="font-black text-black">{item.title}</h4>
                  <p className="text-sm text-gray-600 font-medium">{item.desc}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-black group-hover:translate-x-1 transition-transform" />
              </Link>
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
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(34,197,94,1)]"
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
                <p className="text-lg text-gray-600 font-medium">Explore history, geography, and civics through comprehensive study materials</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wider">Key Details</h3>
                  <div className="space-y-4">
                    {[
                      { icon: <Globe className="h-5 w-5" />, text: "History, Geography, and Civics", color: "text-green-600", bg: "bg-green-50" },
                      { icon: <Clock className="h-5 w-5" />, text: "23 weeks total duration", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: <Star className="h-5 w-5" />, text: "Intermediate to Advanced level", color: "text-yellow-600", bg: "bg-yellow-50" },
                      { icon: <Eye className="h-5 w-5" />, text: "45 video lessons available", color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center space-x-3 p-4 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                        <div className={`p-2 ${item.bg} rounded-lg border-2 border-black ${item.color}`}>{item.icon}</div>
                        <span className="text-black font-bold">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-black text-black mb-4 uppercase tracking-wider">What You'll Learn</h3>
                  <div className="bg-white rounded-2xl border-2 border-green-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <ul className="space-y-3 text-gray-700 font-medium">
                      {[
                        "Understanding historical events and their impact",
                        "Exploring geographical features and human-environment interaction",
                        "Learning about democratic processes and civic responsibilities",
                        "Developing critical thinking and analytical skills",
                        "Understanding cultural diversity and global perspectives",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-500 font-black mt-0.5">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-black mt-10 mb-4 uppercase tracking-wider">Chapters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${chapterColors[idx % 6]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                    <h4 className="text-lg font-black text-black mb-2">{chapter.title}</h4>
                    <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {chapter.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-0.5 bg-green-100 text-green-800 rounded-lg text-xs font-bold border border-green-200">{topic}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                      <span>{chapter.duration}</span>
                      <span>{chapter.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Video Lessons</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl border-2 ${chapterColors[idx % 6]} overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                    <div className="bg-green-500 h-36 flex items-center justify-center border-b-2 border-black">
                      <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"><Play className="h-7 w-7 text-white fill-white" /></div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-black text-black mb-1">{chapter.title}</h3>
                      <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                      <div className="text-sm text-gray-500 font-bold mb-3">{chapter.materials.videos} videos</div>
                      <button className="w-full bg-black text-white py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Watch</button>
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
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${chapterColors[idx % 6]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                    <div className="text-sm text-gray-500 font-bold mb-4">{chapter.materials.notes} notes</div>
                    <Link to="/notes" className="block w-full bg-black text-white text-center py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Read Notes</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "worksheets" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Worksheets</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${chapterColors[idx % 6]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                    <div className="text-sm text-gray-500 font-bold mb-4">{chapter.materials.worksheets} worksheets</div>
                    <button className="w-full bg-black text-white py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Download</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "flashcards" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Flashcards</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${chapterColors[idx % 6]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                    <div className="text-sm text-gray-500 font-bold mb-4">Flashcards available</div>
                    <Link to="/flashcards" className="block w-full bg-black text-white text-center py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Practice</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Quizzes</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={`bg-white rounded-2xl p-6 border-2 ${chapterColors[idx % 6]} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="text-lg font-black text-black mb-2">{chapter.title}</h3>
                    <p className="text-gray-600 text-sm font-medium mb-3">{chapter.description}</p>
                    <div className="text-sm text-gray-500 font-bold mb-4">{chapter.materials.quizzes} quizzes</div>
                    <Link to="/quizzes" className="block w-full bg-black text-white text-center py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Take Quiz</Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "assessments" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Worksheets</h2>
                <p className="text-lg text-gray-600 font-medium">Practice worksheets and assessments to test your social science knowledge</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: "social-1", title: "Ancient Civilizations Quiz", description: "Test your knowledge of ancient civilizations and their contributions", difficulty: "Beginner", timeLimit: "8 min", questions: 5 },
                  { id: "social-2", title: "Geography and Government Test", description: "Test your knowledge of physical geography and government systems", difficulty: "Beginner", timeLimit: "10 min", questions: 5 },
                  { id: "social-3", title: "Economics and Culture Assessment", description: "Test your understanding of economic systems and cultural diversity", difficulty: "Beginner", timeLimit: "8 min", questions: 5 },
                ].map((assessment) => (
                  <div key={assessment.id} className="bg-white rounded-2xl p-6 border-2 border-orange-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-black mb-2">{assessment.title}</h3>
                        <p className="text-gray-600 text-sm font-medium mb-3">{assessment.description}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 font-bold">
                          <span>{assessment.questions} questions</span>
                          <span>{assessment.timeLimit}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${assessment.difficulty === "Beginner" ? "bg-green-100 text-green-800 border-green-300" : "bg-yellow-100 text-yellow-800 border-yellow-300"
                            }`}>{assessment.difficulty}</span>
                        </div>
                      </div>
                      <div className="ml-4 p-3 bg-orange-50 rounded-xl border-2 border-black"><Target className="h-8 w-8 text-orange-600" /></div>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/quiz/${assessment.id}`} className="flex-1 bg-black text-white text-center py-3 px-4 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">Start Quiz</Link>
                      <a
                        href={`/${assessment.id === "social-1" ? "(4)Quadrilaterals.docx" : assessment.id === "social-2" ? "(5)Number Play.docx" : assessment.id === "social-3" ? "(6)Distributive Property.docx" : ""}`}
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

export default SocialScience;
