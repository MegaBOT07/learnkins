import { FormEvent, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { communityAPI } from "../../utils/api";
import { useConfirm } from "../../components/ConfirmDialog";
import type { StudyGroup, GroupMessage, GroupPost, Reply } from "../../types/community";
import {
  ArrowLeft,
  Send,
  MessageCircle,
  Users,
  FileText,
  Info,
  Heart,
  Trash2,
  User,
  UserMinus,
  LogOut,
  Plus,
  X,
  Loader2,
  Clock,
  Shield,
  Hash,
  Tag,
} from "lucide-react";
import Container from "../../components/common/Container";

type GroupTab = "chat" | "posts" | "members" | "about";

const subjectLabelMap: Record<string, string> = {
  mathematics: "Mathematics",
  science: "Science",
  english: "English",
  "social-science": "Social Science",
  "computer-science": "Computer Science",
  "art-craft": "Art & Craft",
  general: "General",
};

const StudyGroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const meId = String(user?._id || user?.id || "");
  const { confirm: confirmDelete } = useConfirm();

  const [group, setGroup] = useState<StudyGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GroupTab>("chat");

  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState("");
  const [postingPost, setPostingPost] = useState(false);
  const [expandedPostReplies, setExpandedPostReplies] = useState<Record<string, boolean>>({});
  const [postReplyDrafts, setPostReplyDrafts] = useState<Record<string, string>>({});
  const [replyingPostId, setReplyingPostId] = useState<string | null>(null);

  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [joiningGroup, setJoiningGroup] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const isCreator = group && String((group as any).creator?._id || (group as any).creator?.id) === meId;

  useEffect(() => {
    if (!id) return;
    fetchGroupData();
  }, [id]);

  useEffect(() => {
    if (activeTab === "chat" && messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(null), 2500);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  const fetchGroupData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [groupRes, messagesRes, postsRes] = await Promise.all([
        communityAPI.getStudyGroup(id!),
        communityAPI.getGroupMessages(id!, { limit: 50 }),
        communityAPI.getGroupPosts(id!, { limit: 20 }),
      ]);

      const raw = groupRes.data?.group || {};
      const g: StudyGroup = {
        id: raw._id || raw.id,
        _id: raw._id,
        name: raw.name,
        description: raw.description,
        subject: raw.subject,
        maxMembers: Number(raw.maxMembers || 0),
        members: raw.members || [],
        memberCount: Number(raw.memberCount || raw.members?.length || 0),
        createdAt: raw.createdAt,
        isMember: Boolean(raw.isMember),
        rules: raw.rules || [],
        tags: raw.tags || [],
        creator: raw.creator,
        isActive: raw.isActive,
        activityLevel: raw.activityLevel,
        lastActivity: raw.lastActivity,
        availableSpots: raw.availableSpots,
      };
      setGroup(g);

      setMessages(messagesRes.data?.messages || []);
      setPosts((postsRes.data?.posts || []).map(normalizeGroupPost));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load group data");
    } finally {
      setLoading(false);
    }
  };

  const normalizeGroupPost = (item: any): GroupPost => ({
    id: item._id || item.id,
    _id: item._id,
    group: item.group,
    title: item.title,
    content: item.content,
    author: item.author,
    tags: item.tags || [],
    likes: Number(item.likes || 0),
    replies: Number(item.replies || 0),
    replyItems: (item.replyItems || []).map((r: any) => ({
      _id: r._id,
      content: r.content,
      createdAt: r.createdAt,
      author: r.author,
    } as Reply)),
    isLiked: Boolean(item.isLiked),
    isPinned: Boolean(item.isPinned),
    createdAt: item.createdAt,
  });

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const content = messageInput.trim();
    if (!content || !id || !group?.isMember) return;

    setSendingMessage(true);
    try {
      const res = await communityAPI.sendGroupMessage(id, { content });
      const newMsg = res.data?.groupMessage;
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
        setMessageInput("");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!isAuthenticated || !id) return;
    setJoiningGroup(true);
    try {
      const res = await communityAPI.joinStudyGroup(id);
      const memberCount = Number(res.data?.memberCount || 0);
      setGroup((prev) => prev ? { ...prev, isMember: true, memberCount } : prev);
      setActionMessage("Joined group!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to join");
    } finally {
      setJoiningGroup(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!id || !group?.isMember) return;
    if (!(await confirmDelete("Leave this study group?"))) return;
    setLoadingAction("leave");
    try {
      await communityAPI.leaveStudyGroup(id);
      setGroup((prev) => prev ? { ...prev, isMember: false, memberCount: Math.max(0, (prev.memberCount || 1) - 1) } : prev);
      setActionMessage("Left the group.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to leave");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id || !(await confirmDelete("Remove this member?"))) return;
    setLoadingAction(`remove-${userId}`);
    try {
      await communityAPI.removeGroupMember(id, userId);
      setGroup((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members.filter((m: any) => String(m._id || m) !== String(userId)),
          memberCount: Math.max(0, (prev.memberCount || 1) - 1),
        };
      });
      setActionMessage("Member removed.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to remove member");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreatePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!id || !newPostTitle.trim() || !newPostContent.trim()) return;
    setPostingPost(true);
    try {
      const tags = newPostTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 5);
      const res = await communityAPI.createGroupPost(id, {
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        tags,
      });
      const created = normalizeGroupPost(res.data?.post || {});
      setPosts((prev) => [created, ...prev]);
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostTags("");
      setShowNewPost(false);
      setActionMessage("Post created!");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create post");
    } finally {
      setPostingPost(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!id || !(await confirmDelete("Delete this post?"))) return;
    try {
      await communityAPI.deleteGroupPost(id, postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setActionMessage("Post deleted.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to delete post");
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!id || !isAuthenticated) return;
    try {
      const res = await communityAPI.likeGroupPost(id, postId);
      const likes = Number(res.data?.likes || 0);
      const isLiked = Boolean(res.data?.isLiked);
      setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes, isLiked } : p)));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to like post");
    }
  };

  const handlePostReply = async (postId: string) => {
    if (!id || !isAuthenticated) return;
    const content = (postReplyDrafts[postId] || "").trim();
    if (!content) return;

    setReplyingPostId(postId);
    try {
      const res = await communityAPI.replyToGroupPost(id, postId, { content });
      const createdReply = res.data?.reply;
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const existing = p.replyItems || [];
          return {
            ...p,
            replies: Number(res.data?.replies || existing.length + 1),
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
      setPostReplyDrafts((prev) => ({ ...prev, [postId]: "" }));
      setExpandedPostReplies((prev) => ({ ...prev, [postId]: true }));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reply");
    } finally {
      setReplyingPostId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const tabs: { id: GroupTab; label: string; icon: React.ReactNode }[] = [
    { id: "chat", label: "Chat", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "posts", label: "Posts", icon: <FileText className="w-4 h-4" /> },
    { id: "members", label: "Members", icon: <Users className="w-4 h-4" /> },
    { id: "about", label: "About", icon: <Info className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-black text-lg font-black uppercase tracking-wider">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-2xl font-black text-gray-500 mb-4">Group not found</p>
          <button onClick={() => navigate("/community")} className="px-6 py-3 bg-black text-white rounded-xl border-2 border-black font-bold">
            Back to Community
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-30 bg-white border-b-4 border-black">
        <Container size="xl">
          <div className="flex items-center gap-4 py-3">
            <button
              onClick={() => navigate("/community")}
              className="p-2 border-2 border-black rounded-xl hover:bg-gray-100 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black truncate">{group.name}</h1>
              <p className="text-xs text-gray-500 font-medium">
                {subjectLabelMap[group.subject] || group.subject} • {group.memberCount || 0} members
              </p>
            </div>
            {!group.isMember ? (
              <button
                onClick={handleJoinGroup}
                disabled={joiningGroup}
                className="px-5 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold text-sm hover:bg-white hover:text-black transition-all disabled:opacity-60"
              >
                {joiningGroup ? "Joining..." : "Join Group"}
              </button>
            ) : (
              <button
                onClick={handleLeaveGroup}
                disabled={loadingAction === "leave"}
                className="px-4 py-2.5 border-2 border-red-500 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-60 inline-flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                {loadingAction === "leave" ? "Leaving..." : "Leave"}
              </button>
            )}
          </div>
        </Container>
      </div>

      <Container size="xl" className="py-6">
        {error && <div className="p-4 mb-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 font-bold">{error}</div>}
        {actionMessage && <div className="p-4 mb-4 rounded-xl border-2 border-emerald-300 bg-emerald-50 text-emerald-700 font-bold">{actionMessage}</div>}

        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                  : "bg-white text-black border-black hover:bg-gray-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "chat" && (
          <div className="border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-500 font-bold">No messages yet</p>
                    <p className="text-sm text-gray-400">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 ${String(msg.sender?._id || msg.sender?.id) === meId ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center bg-white flex-shrink-0 ${String(msg.sender?._id || msg.sender?.id) === meId ? "" : ""}`}>
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className={`max-w-[75%] ${String(msg.sender?._id || msg.sender?.id) === meId ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl border-2 border-black ${
                        String(msg.sender?._id || msg.sender?.id) === meId
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}>
                        <p className="text-sm font-bold">{String(msg.sender?._id || msg.sender?.id) === meId ? "You" : msg.sender?.name || "User"}</p>
                        <p className="text-sm mt-0.5">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 px-1 font-medium">{formatDate(msg.createdAt)}</p>
                    </div>
                  </motion.div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {group.isMember ? (
              <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-black bg-white flex gap-3">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sendingMessage}
                  className="px-5 py-3 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {sendingMessage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Send
                </button>
              </form>
            ) : (
              <div className="p-4 border-t-2 border-black bg-gray-100 text-center">
                <p className="text-sm text-gray-500 font-bold">Join the group to participate in chat</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "posts" && (
          <div className="space-y-4">
            {group.isMember && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNewPost((p) => !p)}
                  className="px-5 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold text-sm hover:bg-white hover:text-black transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </div>
            )}

            {showNewPost && (
              <form onSubmit={handleCreatePost} className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <h3 className="text-lg font-black">Create Post</h3>
                <input
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  placeholder="Post title"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium"
                  required
                />
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share something with the group..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium"
                  required
                />
                <input
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="Tags (comma separated, optional)"
                  className="w-full px-4 py-3 border-2 border-black rounded-xl font-medium"
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowNewPost(false)} className="px-4 py-2.5 border-2 border-black rounded-xl font-bold text-sm">Cancel</button>
                  <button type="submit" disabled={postingPost || !newPostTitle.trim() || !newPostContent.trim()} className="px-4 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold text-sm disabled:opacity-60">
                    {postingPost ? "Posting..." : "Create Post"}
                  </button>
                </div>
              </form>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-2xl">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-xl font-black text-gray-500">No posts yet</p>
                <p className="text-sm text-gray-400 mt-1">Be the first to post in this group</p>
              </div>
            ) : (
              posts.map((post) => {
                const showReplies = Boolean(expandedPostReplies[post.id]);
                const replyList = post.replyItems || [];
                const postId = post.id;
                return (
                  <motion.div
                    key={postId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center bg-gray-100">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-black text-black">{post.title}</h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {post.author?.name || "User"} • {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {post.isPinned && <Shield className="w-4 h-4 text-amber-500" />}
                        {isCreator && (
                          <button onClick={() => handleDeletePost(postId)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium mb-3">{post.content}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200 flex items-center gap-1">
                            <Hash className="w-3 h-3" />{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-4 pt-3 border-t-2 border-gray-100">
                      <button
                        onClick={() => handleLikePost(postId)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 font-bold text-xs transition-all ${
                          post.isLiked ? "border-red-500 text-red-500 bg-red-50" : "border-gray-200 text-gray-500 hover:border-red-500"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-current" : ""}`} />
                        {post.likes}
                      </button>
                      <button
                        onClick={() => setExpandedPostReplies((p) => ({ ...p, [postId]: !p[postId] }))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-black font-bold text-xs transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        {post.replies}
                      </button>
                    </div>

                    {showReplies && (
                      <div className="mt-4 pt-4 border-t-2 border-gray-100 space-y-3">
                        {replyList.length > 0 ? (
                          replyList.map((reply, i) => (
                            <div key={reply._id || i} className="p-3 rounded-xl border border-gray-200 bg-gray-50">
                              <p className="text-xs font-bold text-gray-500 mb-1">{reply.author?.name || "User"} • {formatDate(reply.createdAt)}</p>
                              <p className="text-sm text-gray-700 font-medium">{reply.content}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No replies yet</p>
                        )}
                        {group.isMember && (
                          <div className="flex items-center gap-2">
                            <input
                              value={postReplyDrafts[postId] || ""}
                              onChange={(e) => setPostReplyDrafts((p) => ({ ...p, [postId]: e.target.value }))}
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-2 border-2 border-black rounded-xl text-sm"
                            />
                            <button
                              onClick={() => handlePostReply(postId)}
                              disabled={!postReplyDrafts[postId]?.trim() || replyingPostId === postId}
                              className="px-3 py-2 bg-black text-white rounded-xl border-2 border-black text-sm font-bold disabled:opacity-60 inline-flex items-center gap-1"
                            >
                              {replyingPostId === postId ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {activeTab === "members" && (
          <div className="border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="p-4 border-b-2 border-black bg-gray-50 flex items-center justify-between">
              <p className="font-black">
                Members <span className="text-gray-500">({group.memberCount || group.members.length})</span>
              </p>
              <p className="text-xs text-gray-500 font-medium">
                {group.maxMembers - (group.memberCount || group.members.length)} spots left
              </p>
            </div>
            <div className="divide-y-2 divide-black">
              {group.members.map((member: any) => {
                const memberId = String(member._id || member);
                const isMe = memberId === meId;
                const isGroupCreator = String((group as any).creator?._id || (group as any).creator?.id) === memberId;
                return (
                  <div key={memberId} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center bg-white">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {member.name || "User"} {isMe && "(You)"}
                        </p>
                        <p className="text-xs text-gray-400">{isGroupCreator ? "Creator" : "Member"}</p>
                      </div>
                    </div>
                    {isGroupCreator && <Shield className="w-4 h-4 text-amber-500" />}
                    {isCreator && !isMe && !isGroupCreator && (
                      <button
                        onClick={() => handleRemoveMember(memberId)}
                        disabled={loadingAction === `remove-${memberId}`}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all disabled:opacity-60"
                        title="Remove member"
                      >
                        {loadingAction === `remove-${memberId}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black mb-4">About this Group</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-gray-700 font-medium">{group.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm font-bold">
                      {subjectLabelMap[group.subject] || group.subject}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Activity Level</p>
                    <span className="inline-flex items-center gap-1 text-sm font-bold">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {group.activityLevel || "Moderate"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Members</p>
                    <p className="text-sm font-bold">{group.memberCount || 0} / {group.maxMembers}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Created</p>
                    <p className="text-sm font-bold">{new Date(group.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {group.tags && group.tags.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200">
                          <Tag className="w-3 h-3" />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {group.rules && group.rules.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rules</p>
                    <ul className="space-y-1">
                      {group.rules.map((rule, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                          <span className="text-gray-400 mt-0.5">•</span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-2 border-black rounded-2xl bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-lg font-black mb-2">Creator</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center bg-amber-50">
                  <User className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold">{(group as any).creator?.name || "Unknown"}</p>
                  <p className="text-xs text-gray-400">{(group as any).creator?.email || ""}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default StudyGroupDetail;
