import { useState, useEffect } from "react";
import { useParams, useSearchParams, useLocation, Link, useNavigate } from "react-router-dom";
import { subjectAPI, materialAPI } from "../../utils/api";
import {
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Clock,
  BookOpen,
  Download,
  Video,
} from "lucide-react";

const iconMap: Record<string, string> = {
  brain: "🧠",
  target: "🎯",
  users: "👥",
  book: "📚",
  beaker: "🔬",
  calculator: "📊",
  globe: "🌍",
  globe2: "🌍",
  booktext: "📖",
  "book-text": "📖",
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const isDirectVideoFile = (url: string = "") => {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
};

const isImageFile = (url: string = "") => {
  const value = String(url || "").toLowerCase();
  return /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?|#|$)/i.test(value) || value.includes("/image/upload/");
};

const getEmbeddableVideoUrl = (url: string = "") => {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      let id = "";

      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        id = parsed.pathname.split("/")[2] || "";
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/")[2] || "";
      } else if (parsed.pathname.startsWith("/live/")) {
        id = parsed.pathname.split("/")[2] || "";
      }

      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}`;
      }
    }

    return trimmed;
  } catch {
    return trimmed;
  }
};

const SubjectDetail = () => {
  const params = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab") || "videos";
  const [activeTab, setActiveTab] = useState(tabParam);

  const deriveSlug = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    if (pathParts[0] === "subjects" && pathParts[1]) return pathParts[1];
    if (params.slug) return params.slug;
    const directSubjects = ["maths", "science", "social-science", "english"];
    if (directSubjects.includes(pathParts[0])) return pathParts[0];
    return "";
  };
  const [slug, setSlug] = useState(deriveSlug());

  const [subject, setSubject] = useState<any>(null);
  const [subjectLoading, setSubjectLoading] = useState(true);

  const [videos, setVideos] = useState<any[]>([]);
  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [materialLoading, setMaterialLoading] = useState(false);

  useEffect(() => {
    if (tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    setSlug(deriveSlug());
  }, [location.pathname, params.slug]);

  useEffect(() => {
    let cancelled = false;
    const fetchSubject = async () => {
      setSubjectLoading(true);
      try {
        const res = await subjectAPI.getSubject(slug);
        if (cancelled) return;
        setSubject(res.data?.data ?? res.data ?? null);
      } catch {
        if (!cancelled) setSubject(null);
      } finally {
        if (!cancelled) setSubjectLoading(false);
      }
    };
    if (slug) fetchSubject();
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    const fetchMaterials = async () => {
      setMaterialLoading(true);
      try {
        const res = await materialAPI.getMaterials(slug);
        if (cancelled) return;
        const all: any[] = res.data?.data ?? res.data ?? [];
        setVideos(all.filter((m: any) => m.type === "video"));
        setWorksheets(all.filter((m: any) => m.type === "worksheet"));
        setNotes(all.filter((m: any) => m.type === "notes"));
      } catch {
        if (!cancelled) {
          setVideos([]);
          setWorksheets([]);
          setNotes([]);
        }
      } finally {
        if (!cancelled) setMaterialLoading(false);
      }
    };
    fetchMaterials();
    return () => { cancelled = true; };
  }, [slug]);

  const setTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  if (subjectLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!subject) {
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

  const color = subject.color || "#6366f1";
  const emoji = iconMap[subject.icon?.toLowerCase()] || "📘";
  const chapters = subject.chapters?.sort((a: any, b: any) => a.order - b.order) || [];

  const tabs = [
    { id: "videos", label: "Videos", icon: <Video className="h-5 w-5" /> },
    { id: "notes", label: "Notes", icon: <FileText className="h-5 w-5" /> },
    { id: "worksheets", label: "Worksheets", icon: <Download className="h-5 w-5" /> },
    { id: "qna", label: "Q&A", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const chapterColors = ["border-purple-500", "border-blue-500", "border-green-500", "border-orange-500", "border-pink-500"];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section
        className="relative text-white border-b-4 border-black overflow-hidden"
        style={{ backgroundColor: color }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <Link to="/subjects" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Subjects</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white rounded-lg border-2 border-white font-black" style={{ color }}>
              {subject.name}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-7xl p-4 bg-white/20 rounded-2xl border-2 border-white/30">{emoji}</div>
            <div>
              <h1 className="text-5xl lg:text-6xl font-black mb-4 uppercase tracking-tight">{subject.name}</h1>
              <p className="text-xl text-white/90 max-w-2xl font-medium">{subject.description}</p>
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
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 font-bold text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Video Lessons</h2>
                <p className="text-lg text-gray-600 font-medium">Watch engaging video lessons that make learning fun and interactive.</p>
              </div>

              {materialLoading ? (
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
                <div id="videos-grid" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {videos.map((v) => (
                    <div key={v._id} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="aspect-video bg-black">
                        {isDirectVideoFile(v.fileUrl) ? (
                          <video
                            src={v.fileUrl}
                            className="w-full h-full"
                            controls
                            preload="metadata"
                            title={v.title}
                          />
                        ) : isImageFile(v.fileUrl) ? (
                          <img
                            src={v.fileUrl}
                            alt={v.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : /youtube\.com|youtu\.be|vimeo\.com/i.test(v.fileUrl || "") ? (
                          <iframe
                            src={getEmbeddableVideoUrl(v.fileUrl)}
                            className="w-full h-full"
                            allowFullScreen
                            title={v.title}
                            referrerpolicy="strict-origin-when-cross-origin"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center p-4 bg-slate-900 text-white">
                            <p className="text-sm font-bold">Preview not available for this link</p>
                            <a
                              href={`${API_BASE}/materials/${v._id}/view`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold border-2 border-white hover:bg-transparent hover:text-white transition-all"
                            >
                              Open Material
                            </a>
                          </div>
                        )}
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
                {chapters.map((chapter: any, index: number) => (
                  <div key={index} className={`bg-white rounded-2xl border-2 ${chapterColors[index % 5]} overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                    <div
                      className="h-48 flex items-center justify-center border-b-2 border-black"
                      style={{ backgroundColor: color }}
                    >
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${
                          chapter.difficulty === "Beginner"
                            ? "bg-green-100 text-green-800 border-green-300"
                            : chapter.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-red-100 text-red-800 border-red-300"
                        }`}>
                          {chapter.difficulty || "Beginner"}
                        </span>
                        {chapter.duration && (
                          <div className="flex items-center text-gray-500 text-sm font-bold">
                            <Clock className="h-4 w-4 mr-1" />
                            {chapter.duration}
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-black mb-3">{chapter.title}</h3>
                      {chapter.topics && chapter.topics.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Topics covered:</h4>
                          <div className="space-y-1">
                            {chapter.topics.map((topic: string, topicIndex: number) => (
                              <div key={topicIndex} className="flex items-center text-sm text-gray-600 font-medium">
                                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }} />
                                {topic}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const el = document.getElementById("videos-grid");
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="w-full bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Watch Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Study Notes</h2>
                <p className="text-lg text-gray-600 font-medium">Comprehensive notes and study materials for each chapter.</p>
              </div>
              {materialLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : notes.length > 0 ? (
                <div className="space-y-6">
                  {notes.map((note) => (
                    <div key={note._id} className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-black mb-2">{note.title}</h3>
                          {note.description && <p className="text-gray-600 font-medium mb-4">{note.description}</p>}
                          <div className="flex flex-wrap gap-2">
                            {note.chapter && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold border border-gray-200 capitalize">{note.chapter}</span>}
                            {note.grade && <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold border border-gray-200">{note.grade}</span>}
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col space-y-2">
                          {note.fileUrl && (
                            <a
                              href={`${API_BASE}/materials/${note._id}/view`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95"
                            >
                              <BookOpen className="h-4 w-4" />
                              <span>Read</span>
                            </a>
                          )}
                          {note.fileUrl && (
                            <a
                              href={note.fileUrl}
                              download
                              className="flex items-center space-x-2 px-5 py-2.5 border-2 border-black text-black rounded-xl font-bold hover:bg-black hover:text-white transition-all"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No notes available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon — the admin is uploading study notes!</p>
                </div>
              )}
            </div>
          )}

          {/* Worksheets Tab */}
          {activeTab === "worksheets" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Practice Worksheets</h2>
                <p className="text-lg text-gray-600 font-medium">Download and practice with worksheets for each chapter.</p>
              </div>
              {materialLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
                </div>
              ) : worksheets.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <Download size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No worksheets available yet</p>
                  <p className="text-sm text-gray-400 mt-1">Check back soon — the admin is uploading worksheets!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {worksheets.map((ws) => (
                    <div key={ws._id} className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className="p-3 rounded-xl text-white"
                          style={{ backgroundColor: color }}
                        >
                          <Download className="h-6 w-6" />
                        </div>
                        {ws.difficulty && (
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-black border ${
                            ws.difficulty === "Beginner"
                              ? "bg-green-100 text-green-800 border-green-300"
                              : ws.difficulty === "Intermediate"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                : "bg-red-100 text-red-800 border-red-300"
                          }`}>
                            {ws.difficulty}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-black text-black mb-2">{ws.title}</h3>
                      {ws.description && <p className="text-gray-600 text-sm mb-4">{ws.description}</p>}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {ws.chapter && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-gray-200 capitalize">{ws.chapter}</span>}
                        {ws.grade && <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg text-xs font-bold border border-gray-200">{ws.grade}</span>}
                      </div>
                      {ws.fileUrl && (
                        <a
                          href={ws.fileUrl}
                          download
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95"
                        >
                          <Download className="h-4 w-4" />
                          <span>Download Worksheet</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Q&A Tab */}
          {activeTab === "qna" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Questions & Answers</h2>
                <p className="text-lg text-gray-600 font-medium">Practice questions and detailed explanations to test your understanding.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {chapters.map((chapter: any, index: number) => (
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
                    <button
                      onClick={() => navigate(`/quizzes?subject=${slug}`)}
                      className="w-full mt-4 bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
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
