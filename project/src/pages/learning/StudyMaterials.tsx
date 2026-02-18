import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  CreditCard,
} from "lucide-react";
import { subjectAPI, materialAPI } from "../../utils/api";

const StudyMaterials = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [recentMaterials, setRecentMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subRes, matRes] = await Promise.all([
          subjectAPI.getSubjects(),
          materialAPI.getMaterials()
        ]);

        const fetchedSubjects = (subRes.data || []).map((sub: any) => ({
          name: sub.name,
          slug: sub.slug || sub.name.toLowerCase().replace(/\s+/g, '-'),
          accent: "border-purple-500",
          accentBg: "bg-purple-500",
          accentLight: "bg-purple-50",
          accentText: "text-purple-600",
          icon: sub.icon || "📚",
          materials: sub.materialsCount || { videos: 0, notes: 0, worksheets: 0, quizzes: 0 }
        }));

        const fetchedMaterials = (matRes.data?.data || matRes.data || []).slice(0, 4).map((mat: any) => ({
          title: mat.title,
          subject: mat.subject || "General",
          type: mat.type || "Notes",
          downloads: mat.downloads || 0,
          date: new Date(mat.createdAt).toISOString().split('T')[0],
          color: "border-blue-500"
        }));

        setSubjects(fetchedSubjects.length > 0 ? fetchedSubjects : defaultSubjects);
        setRecentMaterials(fetchedMaterials.length > 0 ? fetchedMaterials : defaultRecentMaterials);
      } catch (err) {
        console.error("Failed to fetch study materials", err);
        setSubjects(defaultSubjects);
        setRecentMaterials(defaultRecentMaterials);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const defaultSubjects = [
    { name: "Science", slug: "science", accent: "border-purple-500", accentBg: "bg-purple-500", accentLight: "bg-purple-50", accentText: "text-purple-600", icon: "🔬", materials: { videos: 45, notes: 30, worksheets: 25, quizzes: 20 } },
    { name: "Mathematics", slug: "mathematics", accent: "border-blue-500", accentBg: "bg-blue-500", accentLight: "bg-blue-50", accentText: "text-blue-600", icon: "📊", materials: { videos: 50, notes: 35, worksheets: 30, quizzes: 25 } },
    { name: "Social Science", slug: "social-science", accent: "border-green-500", accentBg: "bg-green-500", accentLight: "bg-green-50", accentText: "text-green-600", icon: "🌍", materials: { videos: 40, notes: 28, worksheets: 22, quizzes: 18 } },
    { name: "English", slug: "english", accent: "border-orange-500", accentBg: "bg-orange-500", accentLight: "bg-orange-50", accentText: "text-orange-600", icon: "📚", materials: { videos: 35, notes: 25, worksheets: 20, quizzes: 15 } },
  ];

  const defaultRecentMaterials = [
    { title: "Photosynthesis - Complete Guide", subject: "Science", type: "Notes", downloads: 1250, date: "2024-01-15", color: "border-purple-500" },
    { title: "Quadratic Equations Practice Set", subject: "Mathematics", type: "Worksheet", downloads: 980, date: "2024-01-14", color: "border-blue-500" },
    { title: "Indian Freedom Movement", subject: "Social Science", type: "Video", downloads: 1500, date: "2024-01-13", color: "border-green-500" },
    { title: "Grammar Fundamentals Quiz", subject: "English", type: "Quiz", downloads: 750, date: "2024-01-12", color: "border-orange-500" },
  ];

  const materialTypes = [
    { title: "Video Lessons", description: "Interactive video content with animations and visual explanations", icon: <Video className="h-7 w-7" />, color: "border-blue-500", iconBg: "bg-blue-50", iconColor: "text-blue-600", link: null },
    { title: "Study Notes", description: "Comprehensive notes covering all important topics and concepts", icon: <BookOpen className="h-7 w-7" />, color: "border-green-500", iconBg: "bg-green-50", iconColor: "text-green-600", link: "/notes" },
    { title: "Worksheets", description: "Practice worksheets with problems and exercises for each chapter", icon: <FileText className="h-7 w-7" />, color: "border-orange-500", iconBg: "bg-orange-50", iconColor: "text-orange-600", link: null },
    { title: "Flashcards", description: "Interactive flashcards for quick review and memorization", icon: <CreditCard className="h-7 w-7" />, color: "border-purple-500", iconBg: "bg-purple-50", iconColor: "text-purple-600", link: "/flashcards" },
    { title: "Quiz & Tests", description: "Interactive quizzes and tests to assess your understanding", icon: <HelpCircle className="h-7 w-7" />, color: "border-cyan-500", iconBg: "bg-cyan-50", iconColor: "text-cyan-600", link: "/quizzes" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl font-black uppercase tracking-widest animate-pulse">Loading Materials...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section className="relative bg-black text-white border-b-4 border-blue-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-black rounded-lg border-2 border-white font-black">Study Materials</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight">Study Materials</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Access comprehensive study materials including videos, notes, worksheets, flashcards, and quizzes for all subjects
          </p>
        </div>
      </section>

      {/* Material Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Types of Study Materials</h2>
            <p className="text-lg text-gray-600 font-medium">Everything you need to excel in your studies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {materialTypes.map((type, index) => (
              <div key={index} className={`bg-white p-6 rounded-2xl border-2 ${type.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                <div className={`${type.iconBg} ${type.iconColor} p-3 rounded-xl border-2 border-black inline-block mb-4`}>
                  {type.icon}
                </div>
                <h3 className="text-lg font-black text-black mb-2">{type.title}</h3>
                <p className="text-gray-600 text-sm font-medium mb-3">{type.description}</p>
                {type.link && (
                  <Link to={type.link} className={`inline-block ${type.iconColor} text-sm font-bold hover:underline`}>
                    Explore →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-gray-50 border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Study Materials by Subject</h2>
            <p className="text-lg text-gray-600 font-medium">Choose your subject to access all study materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className={`bg-white rounded-2xl border-2 ${subject.accent} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all overflow-hidden`}>
                <div className={`${subject.accentBg} p-8 text-white border-b-2 border-black relative`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl mb-3">{subject.icon}</div>
                      <h3 className="text-3xl font-black">{subject.name}</h3>
                    </div>
                    <div className="text-6xl font-black opacity-20">{String(index + 1).padStart(2, "0")}</div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: <Video className="h-5 w-5" />, count: subject.materials.videos, label: "Videos", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: <BookOpen className="h-5 w-5" />, count: subject.materials.notes, label: "Notes", color: "text-green-600", bg: "bg-green-50", link: "/notes" },
                      { icon: <FileText className="h-5 w-5" />, count: subject.materials.worksheets, label: "Worksheets", color: "text-orange-600", bg: "bg-orange-50" },
                      { icon: <HelpCircle className="h-5 w-5" />, count: subject.materials.quizzes, label: "Quizzes", color: "text-purple-600", bg: "bg-purple-50", link: "/quizzes" },
                    ].map((stat, i) => {
                      const content = (
                        <div key={i} className={`text-center p-3 ${stat.bg} rounded-xl border-2 border-black ${stat.link ? "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer" : ""}`}>
                          <div className={`${stat.color} mx-auto mb-1 flex justify-center`}>{stat.icon}</div>
                          <div className={`text-2xl font-black ${stat.color}`}>{stat.count}</div>
                          <div className="text-xs text-gray-600 font-bold uppercase">{stat.label}</div>
                        </div>
                      );
                      return stat.link ? <Link key={i} to={stat.link}>{content}</Link> : <div key={i}>{content}</div>;
                    })}
                  </div>

                  <div className="space-y-3">
                    <Link to={`/subjects/${subject.slug}`} className="block w-full bg-black text-white text-center py-3 px-6 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95">
                      Access Materials
                    </Link>
                    <Link to="/flashcards" className="block w-full bg-white text-black text-center py-3 px-6 rounded-xl font-bold border-2 border-black hover:bg-black hover:text-white transition-all active:scale-95">
                      Study Flashcards
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Materials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Recently Added Materials</h2>
            <p className="text-lg text-gray-600 font-medium">Latest study materials added to our collection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentMaterials.map((material, index) => (
              <div key={index} className={`bg-white rounded-2xl p-6 border-2 ${material.color} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-black text-white text-xs font-black rounded-lg">{material.subject}</span>
                  <span className="text-xs text-gray-500 font-bold">{material.date}</span>
                </div>
                <h3 className="text-lg font-black text-black mb-2 line-clamp-2">{material.title}</h3>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 font-bold">{material.type}</span>
                  <div className="flex items-center text-sm text-gray-500 font-bold">
                    <Download className="h-4 w-4 mr-1" />
                    {material.downloads}
                  </div>
                </div>
                <button className="w-full bg-black text-white py-2.5 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white border-t-4 border-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Get Access to All Study Materials</h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto font-medium">
            Join our learning platform and get unlimited access to all study materials including our new flashcard system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/subjects" className="inline-flex items-center px-8 py-4 bg-white text-black font-black rounded-xl text-lg border-2 border-white hover:bg-transparent hover:text-white transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]">
              Browse Subjects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/flashcards" className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-black rounded-xl text-lg hover:bg-white hover:text-black transition-all active:scale-95">
              Try Flashcards
              <CreditCard className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterials;
