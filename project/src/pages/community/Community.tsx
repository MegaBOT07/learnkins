import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import type { Achievement, Discussion, Reply, StudyGroup } from "../../types/community";
import { communityAPI } from "../../utils/api";
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
  Send,
  Edit3,
  Trash2,
  X,
} from "lucide-react";
import Container from "../../components/common/Container";
import Section from "../../components/common/Section";

type TabId = "discussions" | "groups" | "achievements";

type NewDiscussionState = {
  title: string;
  content: string;
  category: string;
  tags: string;
};

type NewGroupState = {
  name: string;
  description: string;
  subject: string;
  maxMembers: string;
};

type DiscussionPageState = {
  page: number;
  pages: number;
  total: number;
  hasMore: boolean;
};

type GroupPageState = {
  page: number;
  pages: number;
  total: number;
  hasMore: boolean;
};

const DISCUSSION_PAGE_LIMIT = 12;
const GROUP_PAGE_LIMIT = 9;

const EMPTY_DISCUSSION: NewDiscussionState = {
  title: "",
  content: "",
  category: "general",
  tags: "",
};

const EMPTY_GROUP: NewGroupState = {
  name: "",
  description: "",
  subject: "mathematics",
  maxMembers: "10",
};

const subjectLabelMap: Record<string, string> = {
  mathematics: "Mathematics",
  science: "Science",
  english: "English",
  "social-science": "Social Science",
  "computer-science": "Computer Science",
  "art-craft": "Art & Craft",
  general: "General",
};

const achievementIconMap: Record<string, JSX.Element> = {
  target: <Target className="h-8 w-8" />,
  trophy: <Trophy className="h-8 w-8" />,
  flame: <Flame className="h-8 w-8" />,
  calculator: <Calculator className="h-8 w-8" />,
  star: <Star className="h-8 w-8" />,
  zap: <Zap className="h-8 w-8" />,
};

const normalizeDiscussion = (item: any): Discussion => ({
  id: item._id || item.id,
  _id: item._id,
  title: item.title,
  content: item.content,
  author: item.author,
  category: item.category || "general",
  tags: item.tags || [],
  createdAt: item.createdAt,
  likes: Number(item.likes || 0),
  replies: Number(item.replies || 0),
  replyItems: (item.replyItems || []).map((r: any) => ({
    _id: r._id,
    content: r.content,
    createdAt: r.createdAt,
    author: r.author,
  } as Reply)),
  isLiked: Boolean(item.isLiked),
});

const normalizeGroup = (item: any, meId: string): StudyGroup => {
  const members = item.members || [];
  const isMember = members.some((m: any) => String(m?._id || m) === String(meId));
  return {
    id: item._id || item.id,
    _id: item._id,
    name: item.name,
    description: item.description,
    subject: item.subject,
    maxMembers: Number(item.maxMembers || 0),
    members,
    memberCount: Number(item.memberCount || members.length || 0),
    createdAt: item.createdAt,
    isMember,
    rules: item.rules || [],
    tags: item.tags || [],
  };
};

const normalizeAchievement = (item: any, userEarnedIds: Set<string>): Achievement => {
  const id = item._id || item.id;
  return {
    id,
    _id: item._id,
    name: item.name,
    description: item.description,
    points: Number(item.points || 0),
    earned: userEarnedIds.has(String(id)),
    earnedAt: item.earnedAt || null,
    icon: item.icon,
    rarity: item.rarity,
    criteria: item.criteria,
    category: item.category,
  };
};

const Community = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const meId = String(user?._id || user?.id || "");

  const [activeTab, setActiveTab] = useState<TabId>("discussions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const [discussionPaging, setDiscussionPaging] = useState<DiscussionPageState>({
    page: 1,
    pages: 1,
    total: 0,
    hasMore: false,
  });
  const [groupPaging, setGroupPaging] = useState<GroupPageState>({
    page: 1,
    pages: 1,
    total: 0,
    hasMore: false,
  });
  const [loadingMoreDiscussions, setLoadingMoreDiscussions] = useState(false);
  const [loadingMoreGroups, setLoadingMoreGroups] = useState(false);

  const [stats, setStats] = useState({
    totalDiscussions: 0,
    totalGroups: 0,
    totalUsers: 0,
  });

  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState<NewDiscussionState>(EMPTY_DISCUSSION);
  const [newGroup, setNewGroup] = useState<NewGroupState>(EMPTY_GROUP);

  const [postingDiscussion, setPostingDiscussion] = useState(false);
  const [postingGroup, setPostingGroup] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState<Record<string, boolean>>({});
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyingDiscussionId, setReplyingDiscussionId] = useState<string | null>(null);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);

  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editingDiscussionDraft, setEditingDiscussionDraft] = useState({ title: "", content: "", category: "general", tags: "" });
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyDraft, setEditingReplyDraft] = useState("");
  const [submittingEditId, setSubmittingEditId] = useState<string | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupDraft, setEditingGroupDraft] = useState({
    name: "",
    description: "",
    subject: "mathematics",
    maxMembers: "10",
    tags: "",
  });

  const resetDiscussionForm = () => {
    setNewDiscussion(EMPTY_DISCUSSION);
    setShowNewDiscussion(false);
  };

  const resetGroupForm = () => {
    setNewGroup(EMPTY_GROUP);
    setShowNewGroup(false);
  };

  const fetchDiscussionsPage = async (page: number, append = false) => {
    if (append) setLoadingMoreDiscussions(true);
    const res = await communityAPI.getDiscussions({ limit: DISCUSSION_PAGE_LIMIT, page });
    const raw = res.data?.discussions || [];
    const pagination = res.data?.pagination || {};
    const mapped = raw.map(normalizeDiscussion);

    setDiscussions((prev) => {
      if (!append) return mapped;
      const ids = new Set(prev.map((d) => d.id));
      const toAdd = mapped.filter((d) => !ids.has(d.id));
      return [...prev, ...toAdd];
    });
    setDiscussionPaging({
      page: Number(pagination.page || page),
      pages: Number(pagination.pages || page),
      total: Number(pagination.total || 0),
      hasMore: Number(pagination.page || page) < Number(pagination.pages || page),
    });
    if (append) setLoadingMoreDiscussions(false);
  };

  const fetchGroupsPage = async (page: number, append = false) => {
    if (append) setLoadingMoreGroups(true);
    const res = await communityAPI.getStudyGroups({ limit: GROUP_PAGE_LIMIT, page });
    const raw = res.data?.groups || [];
    const pagination = res.data?.pagination || {};
    const mapped = raw.map((g: any) => normalizeGroup(g, meId));

    setStudyGroups((prev) => {
      if (!append) return mapped;
      const ids = new Set(prev.map((g) => g.id));
      const toAdd = mapped.filter((g) => !ids.has(g.id));
      return [...prev, ...toAdd];
    });
    setGroupPaging({
      page: Number(pagination.page || page),
      pages: Number(pagination.pages || page),
      total: Number(pagination.total || 0),
      hasMore: Number(pagination.page || page) < Number(pagination.pages || page),
    });
    if (append) setLoadingMoreGroups(false);
  };

  const fetchAllCommunityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [achievementRes, statsRes, userAchievementRes] = await Promise.all([
        communityAPI.getAchievements(),
        communityAPI.getCommunityStats(),
        isAuthenticated ? communityAPI.getUserAchievements() : Promise.resolve({ data: { achievements: [] } }),
      ]);

      await Promise.all([fetchDiscussionsPage(1), fetchGroupsPage(1)]);

      const rawAchievements = achievementRes.data?.achievements || [];
      const userAchievements = userAchievementRes.data?.achievements || [];
      const userEarnedIds = new Set(userAchievements.map((a: any) => String(a._id || a.id)));

      setAchievements(rawAchievements.map((a: any) => normalizeAchievement(a, userEarnedIds)));

      const s = statsRes.data?.stats || {};
      setStats({
        totalDiscussions: Number(s.totalDiscussions || 0),
        totalGroups: Number(s.totalGroups || 0),
        totalUsers: Number(s.totalUsers || 0),
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCommunityData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  useEffect(() => {
    const poll = setInterval(() => {
      if (activeTab === "discussions") {
        fetchDiscussionsPage(discussionPaging.page);
      } else if (activeTab === "groups") {
        fetchGroupsPage(groupPaging.page);
      }
    }, 15000);
    return () => clearInterval(poll);
  }, [activeTab, discussionPaging.page, groupPaging.page]);

  const filteredDiscussions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return discussions;
    return discussions.filter((discussion) => {
      const haystack = [discussion.title, discussion.content, discussion.category || "", ...(discussion.tags || []), discussion.author?.name || ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [discussions, searchQuery]);

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return studyGroups;
    return studyGroups.filter((group) => {
      const haystack = [group.name, group.description, group.subject, ...(group.tags || [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [studyGroups, searchQuery]);

  const filteredAchievements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return achievements;
    return achievements.filter((achievement) => {
      const haystack = [achievement.name, achievement.description, achievement.rarity || "", achievement.category || ""]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [achievements, searchQuery]);

  const canManageDiscussion = (discussion: Discussion) => {
    const ownerId = String(discussion.author?._id || discussion.author?.id || "");
    return isAuthenticated && (String(user?.role) === "admin" || ownerId === meId);
  };

  const canManageReply = (reply: Reply) => {
    const ownerId = String(reply.author?._id || reply.author?.id || "");
    return isAuthenticated && (String(user?.role) === "admin" || ownerId === meId);
  };

  const handleCreateDiscussion = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to create a discussion.");
      return;
    }

    const title = newDiscussion.title.trim();
    const content = newDiscussion.content.trim();
    const tags = newDiscussion.tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean).slice(0, 5);

    if (title.length < 5 || content.length < 10) {
      setError("Title must be at least 5 chars and content at least 10 chars.");
      return;
    }

    setPostingDiscussion(true);
    setError(null);
    try {
      const response = await communityAPI.createDiscussion({ title, content, category: newDiscussion.category, tags });
      const created = normalizeDiscussion(response.data?.discussion || {});
      setDiscussions((prev) => [created, ...prev]);
      setDiscussionPaging((prev) => ({ ...prev, total: prev.total + 1 }));
      setStats((prev) => ({ ...prev, totalDiscussions: prev.totalDiscussions + 1 }));
      resetDiscussionForm();
      setActionMessage("Discussion created successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create discussion.");
    } finally {
      setPostingDiscussion(false);
    }
  };

  const handleUpdateDiscussion = async (discussionId: string) => {
    const title = editingDiscussionDraft.title.trim();
    const content = editingDiscussionDraft.content.trim();
    if (title.length < 5 || content.length < 10) {
      setError("Title must be at least 5 chars and content at least 10 chars.");
      return;
    }

    setSubmittingEditId(discussionId);
    setError(null);
    try {
      const payload = {
        title,
        content,
        category: editingDiscussionDraft.category,
        tags: editingDiscussionDraft.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 5),
      };
      const response = await communityAPI.updateDiscussion(discussionId, payload);
      const updated = normalizeDiscussion(response.data?.discussion || {});
      setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? updated : d)));
      setEditingDiscussionId(null);
      setActionMessage("Discussion updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update discussion.");
    } finally {
      setSubmittingEditId(null);
    }
  };

  const handleDeleteDiscussion = async (discussionId: string) => {
    if (!window.confirm("Delete this discussion?")) return;
    setError(null);
    try {
      await communityAPI.deleteDiscussion(discussionId);
      setDiscussions((prev) => prev.filter((d) => d.id !== discussionId));
      setDiscussionPaging((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
      setStats((prev) => ({ ...prev, totalDiscussions: Math.max(prev.totalDiscussions - 1, 0) }));
      setActionMessage("Discussion deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete discussion.");
    }
  };

  const handleCreateGroup = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      setError("Please login to create a study group.");
      return;
    }

    const payload = {
      name: newGroup.name.trim(),
      description: newGroup.description.trim(),
      subject: newGroup.subject,
      maxMembers: Number(newGroup.maxMembers || 10),
    };

    if (payload.name.length < 3 || payload.description.length < 10) {
      setError("Group name must be at least 3 chars and description at least 10 chars.");
      return;
    }

    setPostingGroup(true);
    setError(null);
    try {
      const response = await communityAPI.createStudyGroup(payload);
      const created = normalizeGroup(response.data?.group || {}, meId);
      setStudyGroups((prev) => [created, ...prev]);
      setGroupPaging((prev) => ({ ...prev, total: prev.total + 1 }));
      setStats((prev) => ({ ...prev, totalGroups: prev.totalGroups + 1 }));
      resetGroupForm();
      setActionMessage("Study group created successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create study group.");
    } finally {
      setPostingGroup(false);
    }
  };

  const handleLikeDiscussion = async (discussionId: string) => {
    if (!isAuthenticated) {
      setError("Please login to like discussions.");
      return;
    }

    try {
      const response = await communityAPI.likeDiscussion(discussionId);
      const likes = Number(response.data?.likes || 0);
      const isLiked = Boolean(response.data?.isLiked);
      setDiscussions((prev) => prev.map((d) => (d.id === discussionId ? { ...d, likes, isLiked } : d)));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to toggle like.");
    }
  };

  const handleReply = async (discussionId: string) => {
    if (!isAuthenticated) {
      setError("Please login to comment.");
      return;
    }

    const content = (replyDrafts[discussionId] || "").trim();
    if (!content) return;

    setReplyingDiscussionId(discussionId);
    setError(null);
    try {
      const response = await communityAPI.replyToDiscussion(discussionId, { content });
      const createdReply = response.data?.reply;

      setDiscussions((prev) =>
        prev.map((d) => {
          if (d.id !== discussionId) return d;
          const existing = d.replyItems || [];
          return {
            ...d,
            replies: Number(response.data?.replies || existing.length + 1),
            replyItems: [
              ...existing,
              {
                _id: createdReply?._id,
                content: createdReply?.content || content,
                createdAt: createdReply?.createdAt || new Date().toISOString(),
                author: createdReply?.author || { _id: meId, name: user?.name || "You" },
              },
            ],
          };
        })
      );
      setReplyDrafts((prev) => ({ ...prev, [discussionId]: "" }));
      setExpandedReplies((prev) => ({ ...prev, [discussionId]: true }));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to add comment.");
    } finally {
      setReplyingDiscussionId(null);
    }
  };

  const startEditReply = (replyId: string, content: string) => {
    setEditingReplyId(replyId);
    setEditingReplyDraft(content);
  };

  const handleUpdateReply = async (discussionId: string, replyId: string) => {
    const content = editingReplyDraft.trim();
    if (!content) return;
    setSubmittingEditId(replyId);
    setError(null);
    try {
      const response = await communityAPI.updateDiscussionReply(discussionId, replyId, { content });
      const updated = response.data?.reply;
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d.id !== discussionId) return d;
          return {
            ...d,
            replyItems: (d.replyItems || []).map((r) =>
              r._id === replyId ? { ...r, content: updated?.content || content } : r
            ),
          };
        })
      );
      setEditingReplyId(null);
      setEditingReplyDraft("");
      setActionMessage("Comment updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update comment.");
    } finally {
      setSubmittingEditId(null);
    }
  };

  const handleDeleteReply = async (discussionId: string, replyId: string) => {
    if (!window.confirm("Delete this comment?")) return;
    setError(null);
    try {
      const response = await communityAPI.deleteDiscussionReply(discussionId, replyId);
      setDiscussions((prev) =>
        prev.map((d) => {
          if (d.id !== discussionId) return d;
          const remaining = (d.replyItems || []).filter((r) => r._id !== replyId);
          return {
            ...d,
            replyItems: remaining,
            replies: Number(response.data?.replies || remaining.length),
          };
        })
      );
      setActionMessage("Comment deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete comment.");
    }
  };

  const handleJoinGroup = async (groupId: string, alreadyMember?: boolean) => {
    if (!isAuthenticated) {
      setError("Please login to join groups.");
      return;
    }
    if (alreadyMember) return;

    setJoiningGroupId(groupId);
    setError(null);
    try {
      const response = await communityAPI.joinStudyGroup(groupId);
      const memberCount = Number(response.data?.memberCount || 0);
      setStudyGroups((prev) =>
        prev.map((g) =>
          g.id === groupId
            ? { ...g, isMember: true, memberCount, members: [...(g.members || []), { _id: meId }] }
            : g
        )
      );
      setActionMessage("Joined study group successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to join group.");
    } finally {
      setJoiningGroupId(null);
    }
  };

  const canManageGroup = (group: StudyGroup) => {
    const creatorId = String((group as any)?.creator?._id || (group as any)?.creator?.id || "");
    return isAuthenticated && (String(user?.role) === "admin" || creatorId === meId);
  };

  const startEditGroup = (group: StudyGroup) => {
    setEditingGroupId(group.id);
    setEditingGroupDraft({
      name: group.name,
      description: group.description,
      subject: group.subject,
      maxMembers: String(group.maxMembers || 10),
      tags: (group.tags || []).join(", "),
    });
  };

  const handleUpdateGroup = async (groupId: string) => {
    const name = editingGroupDraft.name.trim();
    const description = editingGroupDraft.description.trim();
    if (name.length < 3 || description.length < 10) {
      setError("Group name must be at least 3 chars and description at least 10 chars.");
      return;
    }

    const payload = {
      name,
      description,
      subject: editingGroupDraft.subject,
      maxMembers: Number(editingGroupDraft.maxMembers || 10),
      tags: editingGroupDraft.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 8),
    };

    setSubmittingEditId(groupId);
    setError(null);
    try {
      const response = await communityAPI.updateStudyGroup(groupId, payload);
      const updated = normalizeGroup(response.data?.group || {}, meId);
      setStudyGroups((prev) => prev.map((g) => (g.id === groupId ? updated : g)));
      setEditingGroupId(null);
      setActionMessage("Study group updated.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update study group.");
    } finally {
      setSubmittingEditId(null);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!window.confirm("Delete this study group?")) return;
    setError(null);
    try {
      await communityAPI.deleteStudyGroup(groupId);
      setStudyGroups((prev) => prev.filter((g) => g.id !== groupId));
      setGroupPaging((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
      setStats((prev) => ({ ...prev, totalGroups: Math.max(prev.totalGroups - 1, 0) }));
      setActionMessage("Study group deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete study group.");
    }
  };

  const loadMoreDiscussions = async () => {
    if (!discussionPaging.hasMore || loadingMoreDiscussions) return;
    await fetchDiscussionsPage(discussionPaging.page + 1, true);
  };

  const loadMoreGroups = async () => {
    if (!groupPaging.hasMore || loadingMoreGroups) return;
    await fetchGroupsPage(groupPaging.page + 1, true);
  };

  const discussionColors = [
    { border: "border-blue-500", accent: "text-blue-600", bg: "bg-blue-50", tag: "bg-blue-100 text-blue-700" },
    { border: "border-pink-500", accent: "text-pink-600", bg: "bg-pink-50", tag: "bg-pink-100 text-pink-700" },
    { border: "border-green-500", accent: "text-green-600", bg: "bg-green-50", tag: "bg-green-100 text-green-700" },
    { border: "border-purple-500", accent: "text-purple-600", bg: "bg-purple-50", tag: "bg-purple-100 text-purple-700" },
  ];

  const groupColors = [
    { border: "border-orange-500", accent: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-800 border-orange-300" },
    { border: "border-cyan-500", accent: "text-cyan-600", bg: "bg-cyan-50", badge: "bg-cyan-100 text-cyan-800 border-cyan-300" },
    { border: "border-pink-500", accent: "text-pink-600", bg: "bg-pink-50", badge: "bg-pink-100 text-pink-800 border-pink-300" },
  ];

  const achievementColors = [
    { border: "border-blue-500", icon: "text-blue-600", glow: "bg-blue-50" },
    { border: "border-yellow-500", icon: "text-yellow-600", glow: "bg-yellow-50" },
    { border: "border-red-500", icon: "text-red-500", glow: "bg-red-50" },
    { border: "border-green-500", icon: "text-green-600", glow: "bg-green-50" },
  ];

  const tabs = [
    { id: "discussions" as TabId, label: "Discussions", icon: <MessageCircle className="h-5 w-5" />, color: "blue" },
    { id: "groups" as TabId, label: "Study Groups", icon: <Users className="h-5 w-5" />, color: "green" },
    { id: "achievements" as TabId, label: "Achievements", icon: <Trophy className="h-5 w-5" />, color: "purple" },
  ];

  const getTabClasses = (tab: { id: TabId; color: string }) => {
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
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-black text-lg font-black uppercase tracking-wider">Loading community...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <section className="relative border-b-4 border-black overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <Container size="xl" className="relative z-10 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
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
              Live community powered by real discussions, comments, groups, and achievements.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-black uppercase tracking-wide">
              <span className="px-4 py-2 border-2 border-black rounded-xl">{stats.totalUsers} users</span>
              <span className="px-4 py-2 border-2 border-black rounded-xl">{stats.totalDiscussions} discussions</span>
              <span className="px-4 py-2 border-2 border-black rounded-xl">{stats.totalGroups} groups</span>
            </div>
          </motion.div>
        </Container>
      </section>

      <Section padding="md" background="white">
        <Container size="xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="space-y-6">
            {error && <div className="p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 font-bold">{error}</div>}
            {actionMessage && <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 font-bold">{actionMessage}</div>}

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

              {activeTab === "discussions" ? (
                <button
                  onClick={() => setShowNewDiscussion((prev) => !prev)}
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-5 h-5" />
                  New Discussion
                </button>
              ) : activeTab === "groups" ? (
                <button
                  onClick={() => setShowNewGroup((prev) => !prev)}
                  className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus className="w-5 h-5" />
                  New Group
                </button>
              ) : null}
            </div>

            {showNewDiscussion && (
              <form onSubmit={handleCreateDiscussion} className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-xl font-black">Create New Discussion</h3>
                <input value={newDiscussion.title} onChange={(e) => setNewDiscussion((p) => ({ ...p, title: e.target.value }))} placeholder="Discussion title" className="w-full px-4 py-3 border-2 border-black rounded-xl" required />
                <textarea value={newDiscussion.content} onChange={(e) => setNewDiscussion((p) => ({ ...p, content: e.target.value }))} placeholder="Share your question or idea" rows={4} className="w-full px-4 py-3 border-2 border-black rounded-xl" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={newDiscussion.category} onChange={(e) => setNewDiscussion((p) => ({ ...p, category: e.target.value }))} className="w-full px-4 py-3 border-2 border-black rounded-xl">
                    <option value="general">General</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="social-science">Social Science</option>
                  </select>
                  <input value={newDiscussion.tags} onChange={(e) => setNewDiscussion((p) => ({ ...p, tags: e.target.value }))} placeholder="tags comma separated" className="w-full px-4 py-3 border-2 border-black rounded-xl" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={resetDiscussionForm} className="px-5 py-2.5 border-2 border-black rounded-xl font-bold inline-flex items-center gap-1"><X className="w-4 h-4" />Cancel</button>
                  <button type="submit" disabled={postingDiscussion} className="px-5 py-2.5 bg-black text-white border-2 border-black rounded-xl font-bold disabled:opacity-60">{postingDiscussion ? "Posting..." : "Post Discussion"}</button>
                </div>
              </form>
            )}

            {showNewGroup && (
              <form onSubmit={handleCreateGroup} className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-xl font-black">Create Study Group</h3>
                <input value={newGroup.name} onChange={(e) => setNewGroup((p) => ({ ...p, name: e.target.value }))} placeholder="Group name" className="w-full px-4 py-3 border-2 border-black rounded-xl" required />
                <textarea value={newGroup.description} onChange={(e) => setNewGroup((p) => ({ ...p, description: e.target.value }))} placeholder="What is this group about?" rows={3} className="w-full px-4 py-3 border-2 border-black rounded-xl" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={newGroup.subject} onChange={(e) => setNewGroup((p) => ({ ...p, subject: e.target.value }))} className="w-full px-4 py-3 border-2 border-black rounded-xl">
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="english">English</option>
                    <option value="social-science">Social Science</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="art-craft">Art & Craft</option>
                  </select>
                  <input value={newGroup.maxMembers} onChange={(e) => setNewGroup((p) => ({ ...p, maxMembers: e.target.value }))} type="number" min={2} max={50} className="w-full px-4 py-3 border-2 border-black rounded-xl" placeholder="Max members" />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={resetGroupForm} className="px-5 py-2.5 border-2 border-black rounded-xl font-bold inline-flex items-center gap-1"><X className="w-4 h-4" />Cancel</button>
                  <button type="submit" disabled={postingGroup} className="px-5 py-2.5 bg-black text-white border-2 border-black rounded-xl font-bold disabled:opacity-60">{postingGroup ? "Creating..." : "Create Group"}</button>
                </div>
              </form>
            )}

            <div className="flex gap-3 flex-wrap">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 font-bold rounded-xl border-2 transition-all duration-200 ${getTabClasses(tab)}`}>
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      <Section padding="lg" background="white">
        <Container size="xl">
          {activeTab === "discussions" && (
            <div className="space-y-6">
              {filteredDiscussions.map((discussion, index) => {
                const color = discussionColors[index % discussionColors.length];
                const discussionId = discussion.id;
                const showReplies = Boolean(expandedReplies[discussionId]);
                const replyList = discussion.replyItems || [];
                const isEditingThisDiscussion = editingDiscussionId === discussionId;

                return (
                  <motion.div
                    key={discussionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    className={`bg-white p-6 rounded-2xl border-2 ${color.border} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${color.bg} rounded-xl flex items-center justify-center border-2 border-black`}>
                          <User className={`w-6 h-6 ${color.accent}`} />
                        </div>
                        <div>
                          <h3 className="font-black text-black text-lg">{discussion.title}</h3>
                          <p className="text-sm text-gray-500 font-medium">
                            by <span className="font-bold text-black">{discussion.author?.name || "Anonymous"}</span> • {new Date(discussion.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {canManageDiscussion(discussion) && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingDiscussionId(discussionId);
                              setEditingDiscussionDraft({
                                title: discussion.title,
                                content: discussion.content,
                                category: discussion.category || "general",
                                tags: (discussion.tags || []).join(", "),
                              });
                            }}
                            className="p-2 text-gray-500 hover:text-black border-2 border-transparent hover:border-black rounded-lg transition-all"
                            title="Edit discussion"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDiscussion(discussionId)}
                            className="p-2 text-gray-500 hover:text-red-600 border-2 border-transparent hover:border-red-500 rounded-lg transition-all"
                            title="Delete discussion"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditingThisDiscussion ? (
                      <div className="space-y-3 mb-4">
                        <input
                          value={editingDiscussionDraft.title}
                          onChange={(e) => setEditingDiscussionDraft((p) => ({ ...p, title: e.target.value }))}
                          className="w-full px-3 py-2 border-2 border-black rounded-xl"
                        />
                        <textarea
                          value={editingDiscussionDraft.content}
                          onChange={(e) => setEditingDiscussionDraft((p) => ({ ...p, content: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border-2 border-black rounded-xl"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <select value={editingDiscussionDraft.category} onChange={(e) => setEditingDiscussionDraft((p) => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-xl">
                            <option value="general">General</option>
                            <option value="mathematics">Mathematics</option>
                            <option value="science">Science</option>
                            <option value="english">English</option>
                            <option value="social-science">Social Science</option>
                          </select>
                          <input value={editingDiscussionDraft.tags} onChange={(e) => setEditingDiscussionDraft((p) => ({ ...p, tags: e.target.value }))} className="w-full px-3 py-2 border-2 border-black rounded-xl" placeholder="tags comma separated" />
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setEditingDiscussionId(null)} className="px-3 py-2 border-2 border-black rounded-xl text-sm font-bold">Cancel</button>
                          <button onClick={() => handleUpdateDiscussion(discussionId)} disabled={submittingEditId === discussionId} className="px-3 py-2 bg-black text-white border-2 border-black rounded-xl text-sm font-bold disabled:opacity-60">
                            {submittingEditId === discussionId ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 mb-4 font-medium leading-relaxed">{discussion.content}</p>
                    )}

                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag, i) => (
                          <span key={i} className={`text-xs font-bold px-3 py-1 rounded-full ${color.tag} border border-current/20`}>#{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-4 border-t-2 border-gray-100">
                      <button
                        onClick={() => handleLikeDiscussion(discussionId)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${discussion.isLiked ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500"}`}
                      >
                        <Heart className={`w-4 h-4 ${discussion.isLiked ? "fill-current" : ""}`} />
                        <span>{discussion.likes}</span>
                      </button>

                      <button
                        onClick={() => setExpandedReplies((prev) => ({ ...prev, [discussionId]: !prev[discussionId] }))}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-black hover:text-black font-bold text-sm transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{discussion.replies}</span>
                      </button>

                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-black hover:text-black font-bold text-sm transition-all ml-auto">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>

                    {showReplies && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-100 space-y-3">
                        {replyList.length > 0 ? (
                          <div className="space-y-2">
                            {replyList.map((reply, rIndex) => {
                              const replyId = reply._id || `${discussionId}-${rIndex}`;
                              const isEditingReply = editingReplyId === replyId;
                              return (
                                <div key={replyId} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="text-xs text-gray-500 font-bold mb-1">
                                      {reply.author?.name || "User"} • {new Date(reply.createdAt).toLocaleString()}
                                    </div>
                                    {canManageReply(reply) && reply._id && (
                                      <div className="flex items-center gap-1">
                                        <button onClick={() => startEditReply(reply._id!, reply.content)} className="p-1 text-gray-500 hover:text-black rounded border border-transparent hover:border-black" title="Edit comment">
                                          <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => handleDeleteReply(discussionId, reply._id!)} className="p-1 text-gray-500 hover:text-red-600 rounded border border-transparent hover:border-red-500" title="Delete comment">
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  {isEditingReply ? (
                                    <div className="flex items-center gap-2 mt-2">
                                      <input value={editingReplyDraft} onChange={(e) => setEditingReplyDraft(e.target.value)} className="flex-1 px-2 py-1.5 border-2 border-black rounded-lg text-sm" />
                                      <button onClick={() => setEditingReplyId(null)} className="px-2 py-1 text-xs border-2 border-black rounded-lg font-bold">Cancel</button>
                                      <button onClick={() => handleUpdateReply(discussionId, reply._id!)} disabled={submittingEditId === reply._id} className="px-2 py-1 text-xs bg-black text-white border-2 border-black rounded-lg font-bold disabled:opacity-60">
                                        {submittingEditId === reply._id ? "..." : "Save"}
                                      </button>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-700 font-medium">{reply.content}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments yet. Be the first one.</p>
                        )}

                        <div className="flex items-center gap-2">
                          <input
                            value={replyDrafts[discussionId] || ""}
                            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [discussionId]: e.target.value }))}
                            placeholder={isAuthenticated ? "Write a comment..." : "Login to comment"}
                            disabled={!isAuthenticated}
                            className="flex-1 px-3 py-2 border-2 border-black rounded-xl text-sm"
                          />
                          <button onClick={() => handleReply(discussionId)} disabled={!isAuthenticated || replyingDiscussionId === discussionId} className="inline-flex items-center gap-1 px-3 py-2 bg-black text-white border-2 border-black rounded-xl text-sm font-bold disabled:opacity-60">
                            <Send className="w-4 h-4" />
                            {replyingDiscussionId === discussionId ? "..." : "Send"}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {filteredDiscussions.length === 0 && (
                <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <MessageCircle size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No discussions found</p>
                </div>
              )}

              {!searchQuery && discussionPaging.hasMore && (
                <div className="flex justify-center pt-2">
                  <button onClick={loadMoreDiscussions} disabled={loadingMoreDiscussions} className="px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all disabled:opacity-60">
                    {loadingMoreDiscussions ? "Loading..." : "Load More Discussions"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "groups" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map((group, index) => {
                  const color = groupColors[index % groupColors.length];
                  const isFull = Number(group.memberCount || 0) >= Number(group.maxMembers || 0);
                  return (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      whileHover={{ y: -6 }}
                      onClick={() => navigate(`/community/groups/${group.id}`)}
                      className={`bg-white p-6 rounded-2xl border-2 ${color.border} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-black text-black text-xl mb-2">{group.name}</h3>
                          <p className="text-sm text-gray-600 font-medium mb-3">{group.description}</p>
                          <p className="text-xs text-gray-400 font-bold">Created {new Date(group.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-black px-3 py-1.5 rounded-lg border-2 ${color.badge} uppercase tracking-wider`}>
                          {subjectLabelMap[group.subject] || group.subject}
                        </span>
                      </div>

                      {group.tags && group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {group.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 font-bold">
                          <Users className="w-4 h-4" />
                          <span>{group.memberCount || 0} / {group.maxMembers} members</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleJoinGroup(group.id, group.isMember); }}
                          disabled={Boolean(group.isMember) || isFull || joiningGroupId === group.id}
                          className={`px-5 py-2.5 rounded-xl text-sm font-black border-2 transition-all ${group.isMember ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" : isFull ? "bg-amber-50 text-amber-700 border-amber-200 cursor-not-allowed" : "bg-black text-white border-black hover:bg-white hover:text-black active:scale-95 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)]"}`}
                        >
                          {group.isMember ? "✓ Joined" : isFull ? "Group Full" : joiningGroupId === group.id ? "Joining..." : "Join Group"}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredGroups.length === 0 && (
                <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <Users size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No study groups found</p>
                </div>
              )}

              {!searchQuery && groupPaging.hasMore && (
                <div className="flex justify-center pt-2">
                  <button onClick={loadMoreGroups} disabled={loadingMoreGroups} className="px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all disabled:opacity-60">
                    {loadingMoreGroups ? "Loading..." : "Load More Groups"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAchievements.map((achievement, index) => {
                const color = achievementColors[index % achievementColors.length];
                const iconKey = String(achievement.icon || "").toLowerCase();
                const renderedIcon = achievementIconMap[iconKey] || <Star className="h-8 w-8" />;

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`bg-white p-6 rounded-2xl border-2 ${achievement.earned ? color.border : "border-gray-200 border-dashed"} shadow-[6px_6px_0px_0px_rgba(0,0,0,${achievement.earned ? "1" : "0.1"})] transition-all`}
                  >
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${achievement.earned ? `${color.glow} ${color.icon}` : "bg-gray-100 text-gray-300"} border-2 ${achievement.earned ? "border-black" : "border-gray-200"}`}>
                        {renderedIcon}
                      </div>
                      <h3 className={`font-black text-lg mb-2 ${achievement.earned ? "text-black" : "text-gray-400"}`}>{achievement.name}</h3>
                      <p className="text-sm text-gray-500 font-medium mb-4">{achievement.description}</p>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className={`text-xs font-black px-3 py-1 rounded-full border-2 ${achievement.earned ? "bg-black text-white border-black" : "bg-gray-100 text-gray-500 border-gray-200"} uppercase tracking-wider`}>
                          {achievement.rarity || "Common"}
                        </span>
                        <span className="text-sm font-bold text-gray-600">{achievement.points} pts</span>
                      </div>

                      {achievement.earned ? (
                        <div className="flex items-center justify-center gap-1 text-green-600 font-black">
                          <Star className="w-5 h-5 fill-current" />
                          <span className="text-sm uppercase tracking-wider">Earned!</span>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 font-medium italic">{achievement.criteria || "Complete criteria to unlock"}</div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {filteredAchievements.length === 0 && (
                <div className="col-span-full text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                  <Trophy size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xl font-black text-gray-500">No achievements found</p>
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </div>
  );
};

export default Community;
