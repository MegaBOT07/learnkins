import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Clock,
  BookOpen,
} from "lucide-react";

const SubjectDetail = () => {
  const { subject } = useParams();
  const [activeTab, setActiveTab] = useState("video");

  // Local videos stored in localStorage under key 'learnkins_local_videos'
  type VideoEntry = {
    id: string;
    title: string;
    src: string; // relative path from public, e.g. '/my-video.mp4'
    description?: string;
  };

  const [videos, setVideos] = useState<VideoEntry[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSrc, setNewSrc] = useState("");

  useEffect(() => {
    try {
      const all = JSON.parse(
        localStorage.getItem("learnkins_local_videos") || "{}"
      );
      const list: VideoEntry[] = all[subject as string] || [];
      setVideos(list);
    } catch (e) {
      setVideos([]);
    }
  }, [subject]);

  const saveVideosForSubject = (list: VideoEntry[]) => {
    try {
      const all = JSON.parse(localStorage.getItem("learnkins_local_videos") || "{}"
      );
      all[subject as string] = list;
      localStorage.setItem("learnkins_local_videos", JSON.stringify(all));
      setVideos(list);
    } catch (e) {
      console.error("Failed to save videos", e);
    }
  };

  const addVideo = () => {
    if (!newTitle || !newSrc) return;
    const entry: VideoEntry = {
      id: Date.now().toString(),
      title: newTitle,
      src: newSrc.startsWith("/") ? newSrc : `/${newSrc}`,
    };
    const next = [entry, ...videos];
    saveVideosForSubject(next);
    setNewTitle("");
    setNewSrc("");
  };

  const removeVideo = (id: string) => {
    const next = videos.filter((v) => v.id !== id);
    saveVideosForSubject(next);
  };

  const subjectData = {
    science: {
      name: "Science",
      color: "from-purple-500 to-indigo-600",
      icon: "🔬",
      description:
        "Explore the fascinating world of science through interactive experiments and engaging content.",
      chapters: [
        {
          title: "Crop Production and Management",
          duration: "45 min",
          difficulty: "Beginner",
          topics: [
            "Introduction to Agriculture",
            "Types of Crops",
            "Modern Farming Methods",
            "Crop Protection",
          ],
        },
        {
          title: "Microorganisms: Friend and Foe",
          duration: "50 min",
          difficulty: "Intermediate",
          topics: [
            "Types of Microorganisms",
            "Helpful Microorganisms",
            "Harmful Microorganisms",
            "Food Preservation",
          ],
        },
        {
          title: "Synthetic Fibres and Plastics",
          duration: "40 min",
          difficulty: "Beginner",
          topics: [
            "Natural vs Synthetic",
            "Types of Synthetic Fibres",
            "Plastics",
            "Environmental Impact",
          ],
        },
      ],
    },
    mathematics: {
      name: "Mathematics",
      color: "from-blue-500 to-cyan-600",
      icon: "📊",
      description:
        "Master mathematical concepts through step-by-step explanations and practice problems.",
      chapters: [
        {
          title: "Rational Numbers",
          duration: "60 min",
          difficulty: "Intermediate",
          topics: [
            "Introduction to Rational Numbers",
            "Operations",
            "Properties",
            "Word Problems",
          ],
        },
        {
          title: "Linear Equations in One Variable",
          duration: "55 min",
          difficulty: "Intermediate",
          topics: [
            "Solving Linear Equations",
            "Applications",
            "Word Problems",
            "Graphical Representation",
          ],
        },
        {
          title: "Understanding Quadrilaterals",
          duration: "50 min",
          difficulty: "Beginner",
          topics: [
            "Types of Quadrilaterals",
            "Properties",
            "Angle Sum Property",
            "Special Quadrilaterals",
          ],
        },
      ],
    },
    "social-science": {
      name: "Social Science",
      color: "from-green-500 to-teal-600",
      icon: "🌍",
      description:
        "Discover history, geography, and civics through engaging stories and interactive content.",
      chapters: [
        {
          title: "How, When and Where",
          duration: "45 min",
          difficulty: "Beginner",
          topics: [
            "Historical Sources",
            "Dating in History",
            "Maps and History",
            "Colonial Records",
          ],
        },
        {
          title: "From Trade to Territory",
          duration: "50 min",
          difficulty: "Intermediate",
          topics: [
            "East India Company",
            "Trade Expansion",
            "Political Control",
            "Company Rule",
          ],
        },
        {
          title: "Ruling the Countryside",
          duration: "55 min",
          difficulty: "Intermediate",
          topics: [
            "Rural Society",
            "Revenue Systems",
            "Agricultural Changes",
            "Peasant Movements",
          ],
        },
      ],
    },
    english: {
      name: "English",
      color: "from-orange-500 to-red-600",
      icon: "📚",
      description:
        "Develop language skills through literature, grammar, and creative writing.",
      chapters: [
        {
          title: "The Best Christmas Present in the World",
          duration: "40 min",
          difficulty: "Beginner",
          topics: [
            "Reading Comprehension",
            "Vocabulary",
            "Character Analysis",
            "Theme Discussion",
          ],
        },
        {
          title: "The Tsunami",
          duration: "45 min",
          difficulty: "Intermediate",
          topics: [
            "Factual Reading",
            "Cause and Effect",
            "Disaster Management",
            "Writing Skills",
          ],
        },
        {
          title: "Glimpses of the Past",
          duration: "50 min",
          difficulty: "Beginner",
          topics: [
            "Historical Events",
            "Timeline Reading",
            "Visual Interpretation",
            "Discussion",
          ],
        },
      ],
    },
  };

  const currentSubject = subjectData[subject as keyof typeof subjectData];

  if (!currentSubject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Subject not found
          </h1>
          <Link to="/subjects" className="text-blue-600 hover:text-blue-800">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <Link
              to="/subjects"
              className="hover:text-blue-400 transition-colors"
            >
              Subjects
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>{currentSubject.name}</span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="text-6xl">{currentSubject.icon}</div>
            <div>
              <h1 className="text-5xl font-bold mb-4">{currentSubject.name}</h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                {currentSubject.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
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
          {activeTab === "video" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Video Lessons
                </h2>
                <p className="text-lg text-gray-600">
                  Watch engaging video lessons that make learning fun and
                  interactive.
                </p>
              </div>

              {/* Local videos added via localStorage */}
              <div className="mb-6">
                <h3 className="text-2xl font-semibold mb-3">Local Videos</h3>

                <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Video title (e.g. Fractions Lesson)"
                    className="w-full sm:w-1/3 px-3 py-2 border rounded-md"
                  />
                  <input
                    value={newSrc}
                    onChange={(e) => setNewSrc(e.target.value)}
                    placeholder="File path in public (e.g. /maths1.mp4)"
                    className="w-full sm:w-1/3 px-3 py-2 border rounded-md"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={addVideo}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setNewTitle("");
                        setNewSrc("");
                      }}
                      className="px-4 py-2 border rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {videos.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No local videos added for this subject yet. Use the form
                    above to add a video you placed in the `public/` folder.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {videos.map((v) => (
                      <div key={v.id} className="bg-white rounded-lg shadow p-3">
                        <video
                          controls
                          src={v.src}
                          className="w-full h-40 object-cover rounded"
                        />
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-sm font-medium">{v.title}</div>
                          <button
                            onClick={() => removeVideo(v.id)}
                            className="text-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {currentSubject.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div
                      className={`bg-gradient-to-r ${currentSubject.color} h-48 flex items-center justify-center`}
                    >
                      <Play className="h-16 w-16 text-white" />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            chapter.difficulty === "Beginner"
                              ? "bg-green-100 text-green-800"
                              : chapter.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {chapter.difficulty}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="h-4 w-4 mr-1" />
                          {chapter.duration}
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {chapter.title}
                      </h3>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Topics covered:
                        </h4>
                        <div className="space-y-1">
                          {chapter.topics.map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Study Notes
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive notes and study materials for each chapter.
                </p>
              </div>

              <div className="space-y-6">
                {currentSubject.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Detailed notes covering all important concepts and key
                          points.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {chapter.topics.map((topic, topicIndex) => (
                            <span
                              key={topicIndex}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-6 flex flex-col space-y-2">
                        <Link
                          to="/notes"
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>Read</span>
                        </Link>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          <FileText className="h-4 w-4" />
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Questions & Answers
                </h2>
                <p className="text-lg text-gray-600">
                  Practice questions and detailed explanations to test your
                  understanding.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentSubject.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {chapter.title}
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          Multiple Choice Questions
                        </span>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                          15 Questions
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          Short Answer Questions
                        </span>
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                          10 Questions
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">
                          Long Answer Questions
                        </span>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                          5 Questions
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center space-x-2">
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
