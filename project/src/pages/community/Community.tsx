import { useState, useEffect } from "react";
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
} from "lucide-react";

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
      icon: "🎯",
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
      icon: "🏆",
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
      icon: "🔥",
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
      icon: "🧮",
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

  const tabs = [
    {
      id: "discussions",
      label: "Discussions",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      id: "groups",
      label: "Study Groups",
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: <Trophy className="h-5 w-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading community...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Error Loading Community
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Community Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with fellow students, join study groups, and track your
            achievements.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search discussions, groups, or achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowNewDiscussion(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Discussion
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === "discussions" && (
            <div className="space-y-6">
              {filteredDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {discussion.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {discussion.authorIdId.name} •{" "}
                          {new Date(discussion.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="More options"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-gray-700 mb-4">{discussion.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLikeDiscussion(discussion.id)}
                        className={`flex items-center space-x-1 ${
                          discussion.isLiked
                            ? "text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            discussion.isLiked ? "fill-current" : ""
                          }`}
                        />
                        <span>{discussion.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{discussion.replies}</span>
                      </div>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group) => (
                <div
                  key={group.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {group.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {group.subjectId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>0 / {group.maxMembers} members</span>
                    </div>
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        group.isMember
                          ? "bg-gray-100 text-gray-600"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {group.isMember ? "Joined" : "Join Group"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-white rounded-xl shadow-lg p-6"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {achievement.rarity}
                      </span>
                      <span className="text-sm text-gray-600">
                        {achievement.points} points
                      </span>
                    </div>

                    {achievement.earned ? (
                      <div className="flex items-center justify-center text-green-600">
                        <Star className="w-4 h-4 mr-1" />
                        <span className="text-sm">Earned</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {achievement.criteria}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
