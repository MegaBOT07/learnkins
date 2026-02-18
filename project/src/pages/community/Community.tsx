import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import type { Discussion, StudyGroup, Achievement } from "../types/community";
import {
  Users,
  Trophy,
  Plus,
  Search,
  Heart,
  Share2,
  Star,
  MoreHorizontal,
  User,
  MessageCircle,
  Target,
  Zap,
  Flame,
  Calculator,
} from "lucide-react";
import Container from "../../components/common/Container";
import Section from "../../components/common/Section";

const Community = () => {
  const [activeTab, setActiveTab] = useState("discussions");
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  useAuth();

  // State for community data
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [, setUserAchievements] = useState<Achievement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [] = useState("all");

  // State for new discussion/group
  const [, setShowNewDiscussion] = useState(false);
  const [] = useState(false);
  const [] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [] = useState({
    name: "",
    description: "",
    subject: "",
    maxMembers: 10,
  });

  // Demo data for community
  const demoDiscussions: Discussion[] = [
    {
      id: "1",
      title: "Best study techniques for math?",
      content:
        "I'm struggling with algebra. What are some effective study techniques that have worked for you? I've tried flashcards but looking for more interactive methods.",
      authorIdId: { name: "Alex Johnson" },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      replies: 5,
      isLiked: false,
      tags: ["study-tips", "algebra", "help"],
    },
    {
      id: "2",
      title: "Creative science project ideas",
      content:
        "Looking for creative science project ideas that are both educational and fun. Any suggestions for experiments that can be done at home?",
      authorIdId: { name: "Emma Student" },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 8,
      replies: 3,
      isLiked: true,
      category: "science",
      tags: ["projects", "experiments", "6th-grade"],
    },
    {
      id: "3",
      title: "How to improve reading comprehension",
      content:
        "I love reading but sometimes struggle with understanding complex texts. What strategies do you use to improve comprehension?",
      authorIdId: { name: "Mike Wilson" },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      replies: 7,
      isLiked: false,
      category: "english",
      tags: ["reading", "comprehension", "tips"],
    },
    {
      id: "4",
      title: "Study group for history",
      content:
        "Anyone interested in forming a study group for social studies? We can discuss historical events and help each other prepare for tests.",
      authorIdId: { name: "Sarah Teacher" },
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 6,
      replies: 2,
      isLiked: false,
      category: "social-science",
      tags: ["study-group", "history", "collaboration"],
    },
  ];

  const demoStudyGroups: StudyGroup[] = [
    {
      id: "1",
      name: "Math Wizards",
      description:
        "A group for students who love mathematics and want to help each other solve problems.",
      subjectId: "mathematics",
      maxMembers: 15,
      members: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isMember: false,
      rules: [
        "Be respectful to all members",
        "Share your problem-solving approaches",
        "Help others when you can",
      ],
      tags: ["algebra", "geometry", "problem-solving"],
    },
    {
      id: "2",
      name: "Science Explorers",
      description:
        "Join us to explore the wonders of science through experiments and discussions.",
      subjectId: "science",
      maxMembers: 20,
      members: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      isMember: true,
      rules: [
        "Follow safety guidelines",
        "Share interesting discoveries",
        "Ask questions freely",
      ],
      tags: ["chemistry", "physics", "biology", "experiments"],
    },
    {
      id: "3",
      name: "English Literature Club",
      description:
        "Discuss books, improve writing skills, and share creative stories.",
      subjectId: "english",
      maxMembers: 12,
      members: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      isMember: false,
      rules: [
        "Respect different opinions",
        "Share your favorite books",
        "Practice creative writing",
      ],
      tags: ["literature", "writing", "poetry"],
    },
  ];

  const demoAchievements: Achievement[] = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first lesson",
      points: 10,
      earned: true,
      earnedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Target className="h-10 w-10" />,
      rarity: "Common",
      criteria: "Complete any lesson",
      category: "study",
    },
    {
      id: "2",
      name: "Quiz Master",
      description: "Score 100% on 5 quizzes",
      points: 50,
      earned: true,
      earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Trophy className="h-10 w-10" />,
      rarity: "Uncommon",
      criteria: "Get perfect scores on 5 quizzes",
      category: "quiz",
    },
    {
      id: "3",
      name: "Study Streak",
      description: "Study for 7 consecutive days",
      points: 100,
      earned: false,
      earnedAt: null,
      icon: <Flame className="h-10 w-10" />,
      rarity: "Rare",
      criteria: "Study every day for a week",
      category: "streak",
    },
    {
      id: "4",
      name: "Math Genius",
      description: "Complete 50 math problems",
      points: 75,
      earned: true,
      earnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      icon: <Calculator className="h-10 w-10" />,
      rarity: "Uncommon",
      criteria: "Solve 50 math problems correctly",
      category: "study",
    },
  ];

  // Use demo data instead of API calls
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setDiscussions(demoDiscussions);
      setStudyGroups(demoStudyGroups);
      setAchievements(demoAchievements);
      setUserAchievements(demoAchievements.filter((a) => a.earned));
      setLoading(false);
    }, 500);
  }, []);

  const handleLikeDiscussion = async (discussionId: string) => {
    setDiscussions(
      discussions.map((d) =>
        d.id === discussionId ? { ...d, likes: d.likes + 1, isLiked: true } : d
      )
    );
  };

  const handleJoinGroup = async (groupId: string) => {
    setStudyGroups(
      studyGroups.map((g) => (g.id === groupId ? { ...g, isMember: true } : g))
    );
  };

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Color palette for discussion cards
  const discussionColors = [
    { border: "border-blue-500", accent: "text-blue-600", bg: "bg-blue-50", tag: "bg-blue-100 text-blue-700" },
    { border: "border-pink-500", accent: "text-pink-600", bg: "bg-pink-50", tag: "bg-pink-100 text-pink-700" },
    { border: "border-green-500", accent: "text-green-600", bg: "bg-green-50", tag: "bg-green-100 text-green-700" },
    { border: "border-purple-500", accent: "text-purple-600", bg: "bg-purple-50", tag: "bg-purple-100 text-purple-700" },
  ];

  // Color palette for study groups
  const groupColors = [
    { border: "border-orange-500", accent: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-800 border-orange-300" },
    { border: "border-cyan-500", accent: "text-cyan-600", bg: "bg-cyan-50", badge: "bg-cyan-100 text-cyan-800 border-cyan-300" },
    { border: "border-pink-500", accent: "text-pink-600", bg: "bg-pink-50", badge: "bg-pink-100 text-pink-800 border-pink-300" },
  ];

  // Color palette for achievements
  const achievementColors = [
    { border: "border-blue-500", icon: "text-blue-600", glow: "bg-blue-50" },
    { border: "border-yellow-500", icon: "text-yellow-600", glow: "bg-yellow-50" },
    { border: "border-red-500", icon: "text-red-500", glow: "bg-red-50" },
    { border: "border-green-500", icon: "text-green-600", glow: "bg-green-50" },
  ];

  const tabs = [
    {
      id: "discussions",
      label: "Discussions",
      icon: <MessageCircle className="h-5 w-5" />,
      color: "blue",
    },
    {
      id: "groups",
      label: "Study Groups",
      icon: <Users className="h-5 w-5" />,
      color: "green",
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Trophy className="h-5 w-5" />,
      color: "purple",
    },
  ];

  const getTabClasses = (tab: typeof tabs[0]) => {
    if (activeTab === tab.id) {
      const colorMap: Record<string, string> = {
        blue: "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]",
        green: "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(34,197,94,1)]",
        purple: "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]",
      };
      return colorMap[tab.color];
    }
    return "bg-white text-black border-black hover:bg-gray-50";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-black text-lg font-black uppercase tracking-wider">Loading community...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-white p-8 rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black text-black mb-4 uppercase">
              Error Loading Community
            </h2>
            <p className="text-gray-600 font-medium mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-black text-white font-bold rounded-xl border-2 border-black hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Hero Header */}
      <section className="relative border-b-4 border-black overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <Container size="xl" className="relative z-10 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white border-2 border-black rounded-full text-sm font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Zap className="h-4 w-4 text-purple-500" />
              <span>Connect & Learn Together</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-black text-black mb-6 uppercase tracking-tighter">
              COMMUNITY
              <br />
              <span className="text-white bg-black px-4">HUB</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Connect with fellow students, join study groups, and track your
              achievements.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Search Bar & Tabs */}
      <Section padding="md" background="white">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Search */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search discussions, groups, or achievements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-black rounded-xl font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                />
              </div>
              <button
                onClick={() => setShowNewDiscussion(true)}
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus className="w-5 h-5" />
                New Discussion
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl border-2 transition-all duration-200 ${getTabClasses(tab)}`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Content */}
      <Section padding="lg" background="white">
        <Container size="xl">
          {activeTab === "discussions" && (
            <div className="space-y-6">
              {filteredDiscussions.map((discussion, index) => {
                const color = discussionColors[index % discussionColors.length];
                return (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white p-6 rounded-2xl border-2 ${color.border} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center border-2 border-black`}>
                          <User className={`w-6 h-6 ${color.accent}`} />
                        </div>
                        <div>
                          <h3 className="font-black text-black text-lg">
                            {discussion.title}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium">
                            by <span className="font-bold text-black">{discussion.authorIdId.name}</span> •{" "}
                            {new Date(discussion.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        className="p-2 text-gray-400 hover:text-black border-2 border-transparent hover:border-black rounded-lg transition-all"
                        title="More options"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-700 mb-4 font-medium leading-relaxed">{discussion.content}</p>

                    {/* Tags */}
                    {discussion.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag, i) => (
                          <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full ${color.tag} border border-current/20`}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                      <button
                        onClick={() => handleLikeDiscussion(discussion.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${discussion.isLiked
                            ? "border-red-500 text-red-500 bg-red-50"
                            : "border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500"
                          }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${discussion.isLiked ? "fill-current" : ""
                            }`}
                        />
                        <span>{discussion.likes}</span>
                      </button>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">
                        <MessageCircle className="w-4 h-4" />
                        <span>{discussion.replies}</span>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-black hover:text-black font-bold text-sm transition-all ml-auto">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group, index) => {
                const color = groupColors[index % groupColors.length];
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className={`bg-white p-6 rounded-2xl border-2 ${color.border} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-black text-black text-xl mb-2">
                          {group.name}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium mb-3">
                          {group.description}
                        </p>
                        <p className="text-xs text-gray-400 font-bold">
                          Created {new Date(group.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs font-black px-3 py-1.5 rounded-lg border-2 ${color.badge} uppercase tracking-wider`}>
                        {group.subjectId}
                      </span>
                    </div>

                    {/* Tags */}
                    {group.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {group.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                        <Users className="w-4 h-4" />
                        <span>0 / {group.maxMembers} members</span>
                      </div>
                      <button
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={group.isMember}
                        className={`px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${group.isMember
                            ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed"
                            : "bg-black text-white border-black hover:bg-white hover:text-black active:scale-95 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]"
                          }`}
                      >
                        {group.isMember ? "✓ Joined" : "Join Group"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => {
                const color = achievementColors[index % achievementColors.length];
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`bg-white p-6 rounded-2xl border-2 ${achievement.earned ? color.border : "border-gray-200 border-dashed"
                      } shadow-[6px_6px_0px_0px_rgba(0,0,0,${achievement.earned ? "1" : "0.1"})] transition-all`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${achievement.earned ? `${color.glow} ${color.icon}` : "bg-gray-100 text-gray-300"
                        } border-2 ${achievement.earned ? "border-black" : "border-gray-200"}`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-black text-lg mb-2 ${achievement.earned ? "text-black" : "text-gray-400"}`}>
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium mb-4">
                        {achievement.description}
                      </p>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className={`text-xs font-black px-3 py-1 rounded-full border-2 ${achievement.earned
                            ? "bg-black text-white border-black"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                          } uppercase tracking-wider`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-sm font-bold text-gray-600">
                          {achievement.points} pts
                        </span>
                      </div>

                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-1 text-green-600 font-black">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-sm uppercase tracking-wider">Earned!</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 font-medium italic">
                          {achievement.criteria}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
};

export default Community;
