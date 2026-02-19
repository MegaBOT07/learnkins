import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { materialAPI } from "../../utils/api";
import {
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Clock,
  BookOpen,
  Download,
} from "lucide-react";

const SubjectDetail = () => {
  const { subject } = useParams();
  const [activeTab, setActiveTab] = useState("video");

  const [videos, setVideos] = useState<any[]>([]);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      setVideoLoading(true);
      try {
        const res = await materialAPI.getMaterials(subject);
        const all: any[] = res.data?.data ?? res.data ?? [];
        setVideos(all.filter((m: any) => m.type === "video"));
      } catch {
        setVideos([]);
      } finally {
        setVideoLoading(false);
      }
    };
    fetchVideos();
  }, [subject]);

  const subjectData = {
    science: {
      name: "Science",
      accent: "bg-purple-500",
      accentText: "text-purple-600",
      accentBorder: "border-purple-500",
      accentShadow: "shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]",
      icon: "🔬",
      description: "Explore the fascinating world of science through interactive experiments and engaging content.",
      chapters: [
        { title: "Crop Production and Management", duration: "45 min", difficulty: "Beginner", topics: ["Introduction to Agriculture", "Types of Crops", "Modern Farming Methods", "Crop Protection"] },
        { title: "Microorganisms: Friend and Foe", duration: "50 min", difficulty: "Intermediate", topics: ["Types of Microorganisms", "Helpful Microorganisms", "Harmful Microorganisms", "Food Preservation"] },
        { title: "Synthetic Fibres and Plastics", duration: "40 min", difficulty: "Beginner", topics: ["Natural vs Synthetic", "Types of Synthetic Fibres", "Plastics", "Environmental Impact"] },
      ],
    },
    mathematics: {
      name: "Mathematics",
      accent: "bg-blue-500",
      accentText: "text-blue-600",
      accentBorder: "border-blue-500",
      accentShadow: "shadow-[3px_3px_0px_0px_rgba(59,130,246,1)]",
      icon: "📊",
      description: "Master mathematical concepts through step-by-step explanations and practice problems.",
      chapters: [
        { title: "Rational Numbers", duration: "60 min", difficulty: "Intermediate", topics: ["Introduction to Rational Numbers", "Operations", "Properties", "Word Problems"] },
        { title: "Linear Equations in One Variable", duration: "55 min", difficulty: "Intermediate", topics: ["Solving Linear Equations", "Applications", "Word Problems", "Graphical Representation"] },
        { title: "Understanding Quadrilaterals", duration: "50 min", difficulty: "Beginner", topics: ["Types of Quadrilaterals", "Properties", "Angle Sum Property", "Special Quadrilaterals"] },
      ],
    },
    "social-science": {
      name: "Social Science",
      accent: "bg-green-500",
      accentText: "text-green-600",
      accentBorder: "border-green-500",
      accentShadow: "shadow-[3px_3px_0px_0px_rgba(34,197,94,1)]",
      icon: "🌍",
      description: "Discover history, geography, and civics through engaging stories and interactive content.",
      chapters: [
        { title: "How, When and Where", duration: "45 min", difficulty: "Beginner", topics: ["Historical Sources", "Dating in History", "Maps and History", "Colonial Records"] },
        { title: "From Trade to Territory", duration: "50 min", difficulty: "Intermediate", topics: ["East India Company", "Trade Expansion", "Political Control", "Company Rule"] },
        { title: "Ruling the Countryside", duration: "55 min", difficulty: "Intermediate", topics: ["Rural Society", "Revenue Systems", "Agricultural Changes", "Peasant Movements"] },
      ],
    },
    english: {
      name: "English",
      accent: "bg-orange-500",
      accentText: "text-orange-600",
      accentBorder: "border-orange-500",
      accentShadow: "shadow-[3px_3px_0px_0px_rgba(249,115,22,1)]",
      icon: "📚",
      description: "Develop language skills through literature, grammar, and creative writing.",
      chapters: [
        { title: "The Best Christmas Present in the World", duration: "40 min", difficulty: "Beginner", topics: ["Reading Comprehension", "Vocabulary", "Character Analysis", "Theme Discussion"] },
        { title: "The Tsunami", duration: "45 min", difficulty: "Intermediate", topics: ["Factual Reading", "Cause and Effect", "Disaster Management", "Writing Skills"] },
        { title: "Glimpses of the Past", duration: "50 min", difficulty: "Beginner", topics: ["Historical Events", "Timeline Reading", "Visual Interpretation", "Discussion"] },
      ],
    },
  };

  const currentSubject = subjectData[subject as keyof typeof subjectData];

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-3xl font-black text-black mb-4 uppercase">Subject not found</h1>
          <Link to="/subjects" className="px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all">
            Back to Subjects
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "video", label: "Video", icon: <Play className="h-5 w-5" /> },
    { id: "notes", label: "Notes", icon: <FileText className="h-5 w-5" /> },
    { id: "qna", label: "Q&A", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const chapterColors = ["border-purple-500", "border-blue-500", "border-green-500", "border-orange-500", "border-pink-500"];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section className={`relative ${currentSubject.accent} text-white border-b-4 border-black overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/subjects" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Subjects</Link>
            <ArrowRight className="h-4 w-4" />
            <span className={`px-3 py-1.5 bg-white ${currentSubject.accentText} rounded-lg border-2 border-white font-black`}>{currentSubject.name}</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-7xl p-4 bg-white/20 rounded-2xl border-2 border-white/30">{currentSubject.icon}</div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tight">{currentSubject.name}</h1>
              <p className="text-xl text-white/90 max-w-2xl font-medium">{currentSubject.description}</p>
            </div>
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
                    ? `bg-black text-white border-black ${currentSubject.accentShadow}`
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
          {activeTab === "video" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Video Lessons</h2>
                <p className="text-lg text-gray-600 font-medium">Watch engaging video lessons that make learning fun and interactive.</p>
              </div>

              {videoLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <Play size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No videos available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon — the admin is uploading learning content!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {videos.map((v) => (
                    <div key={v._id} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="aspect-video bg-black">
                        <iframe
                          src={v.fileUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title={v.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-black text-slate-900 text-lg">{v.title}</h3>
                        {v.description && <p className="text-sm text-slate-500 mt-1">{v.description}</p>}
                        <div className="flex gap-2 mt-2">
                          {v.chapter && <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-slate-200 capitalize">{v.chapter}</span>}
                          {v.grade && <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-slate-200">{v.grade}</span>}
                          {v.difficulty && <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-slate-200">{v.difficulty}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {currentSubject.chapters.map((chapter, index) => (
                  <div key={index} className={`bg-white rounded-2xl border-2 ${chapterColors[index % 5]} overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                    <div className={`${currentSubject.accent} h-48 flex items-center justify-center border-b-2 border-black`}>
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30"><Play className="h-8 w-8 text-white fill-white" /></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${chapter.difficulty === "Beginner" ? "bg-green-100 text-green-800 border-green-300" : chapter.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : "bg-red-100 text-red-800 border-red-300"
                          }`}>{chapter.difficulty}</span>
                        <div className="flex items-center text-gray-500 text-sm font-bold"><Clock className="h-4 w-4 mr-1" />{chapter.duration}</div>
                      </div>
                      <h3 className="text-xl font-black text-black mb-3">{chapter.title}</h3>
                      <div className="mb-4">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topics covered:</h4>
                        <div className="space-y-1">
                          {chapter.topics.map((topic, topicIndex) => (
                            <div key={topicIndex} className="flex items-center text-sm text-gray-600 font-medium">
                              <div className={`w-2 h-2 ${currentSubject.accent} rounded-full mr-2`} />
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="w-full bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Watch Now</span>
                      </button>
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
                <p className="text-lg text-gray-600 font-medium">Comprehensive notes and study materials for each chapter.</p>
              </div>
              <div className="space-y-6">
                {currentSubject.chapters.map((chapter, index) => (
                  <div key={index} className={`bg-white rounded-2xl border-2 ${chapterColors[index % 5]} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-black mb-2">{chapter.title}</h3>
                        <p className="text-gray-600 font-medium mb-4">Detailed notes covering all important concepts and key points.</p>
                        <div className="flex flex-wrap gap-2">
                          {chapter.topics.map((topic, topicIndex) => (
                            <span key={topicIndex} className={`px-3 py-1 bg-gray-100 ${currentSubject.accentText} rounded-lg text-sm font-bold border border-gray-200`}>{topic}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6 flex flex-col space-y-2">
                        <Link to="/notes" className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">
                          <BookOpen className="h-4 w-4" />
                          <span>Read</span>
                        </Link>
                        <button className="flex items-center space-x-2 px-5 py-2.5 border-2 border-black text-black rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                          <Download className="h-4 w-4" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "qna" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Questions & Answers</h2>
                <p className="text-lg text-gray-600 font-medium">Practice questions and detailed explanations to test your understanding.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentSubject.chapters.map((chapter, index) => (
                  <div key={index} className={`bg-white rounded-2xl border-2 ${chapterColors[index % 5]} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                    <h3 className="text-xl font-black text-black mb-4">{chapter.title}</h3>
                    <div className="space-y-3">
                      {[
                        { label: "Multiple Choice Questions", count: "15 Questions", color: "bg-blue-500" },
                        { label: "Short Answer Questions", count: "10 Questions", color: "bg-green-500" },
                        { label: "Long Answer Questions", count: "5 Questions", color: "bg-orange-500" },
                      ].map((qtype, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-black">
                          <span className="text-black font-bold">{qtype.label}</span>
                          <span className={`${qtype.color} text-white px-3 py-1 rounded-lg text-sm font-black border-2 border-black`}>{qtype.count}</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center space-x-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>Start Practice</span>
                    </button>
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

export default SubjectDetail;
