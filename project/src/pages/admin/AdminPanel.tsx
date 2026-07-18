import { useEffect, useState } from "react";
import api, { authAPI, materialAPI, quizAPI, userAPI, flashcardAPI, tokenAPI, shopAPI, contactAPI, subjectAPI, newsletterAPI, certificateAPI } from "../../utils/api";
import {
  Shield, Upload, FileText, Users, LogOut, Trash2, Plus, X,
  LayoutDashboard, BookOpen, Brain, Settings,
  ChevronRight, Search, BarChart3, Clock, Award, Activity,
  Filter, Download, Star, History, Gem, TrendingUp, ShoppingBag,
  Edit3, BookMarked, MessageSquare, Mail, Eye, Archive, RefreshCw, FileBadge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../components/Toast";
import { useConfirm } from "../../components/ConfirmDialog";

const AdminPanel = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();
  const { confirm: confirmDelete } = useConfirm();

  // Professional Theme Constants
  const theme = {
    primary: "bg-slate-900 text-white",
    secondary: "bg-white border-slate-200 shadow-sm",
    accent: "bg-indigo-600 text-white hover:bg-indigo-700",
    danger: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white",
    success: "bg-emerald-50 text-emerald-600 border-emerald-100",
    warning: "bg-amber-50 text-amber-600 border-amber-100",
    muted: "text-slate-500",
    card: "bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300",
    input: "w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all",
    buttonPrimary: "px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm",
    buttonSecondary: "px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold hover:bg-slate-50 active:scale-[0.98] transition-all",
  };
  // Data lists
  const [materials, setMaterials] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [shopItems, setShopItems] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  // Token analytics state
  const [tokenStats, setTokenStats] = useState<any>(null);
  const [shopStats, setShopStats] = useState<any>(null);
  const [tokenStatsLoading, setTokenStatsLoading] = useState(false);

  // Selected user for progress view
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [userTransactions, setUserTransactions] = useState<any[]>([]);

  // Creation / Edit Modals state
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showShopItemModal, setShowShopItemModal] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [certificateTab, setCertificateTab] = useState("single");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [uploadedAdminFile, setUploadedAdminFile] = useState<File | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [editingShopItem, setEditingShopItem] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [contactFilter, setContactFilter] = useState("all");
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<any[]>([]);
  const [messagesSubTab, setMessagesSubTab] = useState<"messages" | "newsletter">("messages");

  const [newFlashcard, setNewFlashcard] = useState({
    question: "", answer: "", subject: "science", chapter: "", difficulty: "Medium"
  });

  const [newMaterial, setNewMaterial] = useState({
    title: "", description: "", subject: "science", type: "video",
    chapter: "", grade: "6th", fileUrl: "", tags: "", difficulty: "Beginner"
  });

  const [newCertificate, setNewCertificate] = useState({
    studentName: "", email: "", phoneNumber: "", college: "", university: "",
    internshipDomain: "", internshipTitle: "", duration: "", startDate: "", endDate: ""
  });

  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    subject: "",
    grade: "",
    difficulty: "Medium",
    questions: [] as any[]
  });

  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  const fetchSubjectsByGrade = async (grade: string) => {
    try {
      setLoadingSubjects(true);
      const params = grade && grade !== 'all' ? grade : undefined;
      const response = await subjectAPI.getSubjects(params);

      if (response.data.success) {
        setAvailableSubjects(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setAvailableSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // Transform frontend question format → backend model format
  const transformQuestions = (inputs: any[]) => inputs.map((q: any) => ({
    question: q.question,
    type: "multiple-choice",
    options: q.options.map((opt: string, i: number) => ({
      text: opt,
      isCorrect: i === q.correctAnswer
    })),
    correctAnswer: q.correctAnswer?.toString() || "0",
    explanation: q.explanation || "",
    points: 1
  }));

  const [newSubject, setNewSubject] = useState({
    name: "", slug: "", description: "", icon: "book", color: "#6366f1", grade: "6th"
  });

  const [newShopItem, setNewShopItem] = useState({
    title: "", description: "", type: "power_up", price: 10,
    icon: "🎁", subject: "all", grade: "all", stock: -1
  });

  // Quiz question builder
  const [quizQuestionInputs, setQuizQuestionInputs] = useState<any[]>([]);

  const [diamondAmount, setDiamondAmount] = useState<number>(0);
  const [awardReason, setAwardReason] = useState<string>("Admin Reward");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (token) {
      fetchAll();
    }
  }, [token]);

  const fetchUserTransactions = async (userId: string) => {
    try {
      const res = await tokenAPI.getUserTransactions(userId);
      setUserTransactions(res.data?.transactions || []);
    } catch (err) {
      console.error("Fetch user transactions failed", err);
    }
  };

  const fetchWithRetry = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        if (err?.response?.status === 429 && i < retries - 1) {
          await new Promise(r => setTimeout(r, (i + 1) * 1500));
          continue;
        }
        console.warn("Fetch failed:", err?.message || err);
        return null;
      }
    }
    return null;
  };

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const fetchAll = async () => {
    setLoading(true);
    try {
      const calls = [
        { key: "materials", fn: () => materialAPI.getMaterials('all') },
        { key: "quizzes", fn: () => quizAPI.getQuizzes('all') },
        { key: "users", fn: () => userAPI.getUsers() },
        { key: "flashcards", fn: () => flashcardAPI.getFlashcards('all') },
        { key: "subjects", fn: () => subjectAPI.getSubjects() },
        { key: "contact", fn: () => contactAPI.getMessages() },
        { key: "shop", fn: () => shopAPI.getItems({}) },
        { key: "newsletter", fn: () => newsletterAPI.getSubscribers() },
        { key: "certificates", fn: () => certificateAPI.getCertificates() },
      ];

      const results: Record<string, any> = {};
      for (const call of calls) {
        const res = await fetchWithRetry(call.fn);
        if (res) results[call.key] = res.data?.data || res.data || [];
        await delay(300);
      }

      if (results.materials) setMaterials(results.materials);
      if (results.quizzes) setQuizzes(results.quizzes);
      if (results.users) setUsers(results.users);
      if (results.flashcards) setFlashcards(results.flashcards);
      if (results.subjects) setSubjects(results.subjects);
      if (results.contact) setContactMessages(results.contact);
      if (results.shop) setShopItems(results.shop);
      if (results.newsletter) setNewsletterSubscribers(results.newsletter);
      if (results.certificates) setCertificates(results.certificates);
    } catch (err) {
      console.error("Fetch admin data failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await authAPI.login(loginForm);
      const tokenValue = res.data?.token || (res.data as any)?.accessToken;
      if (!tokenValue) return showToast("Login failed: no token returned", "error");
      localStorage.setItem("token", tokenValue);
      setToken(tokenValue);
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || "Login failed", "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMaterials([]);
    setQuizzes([]);
    setUsers([]);
    setFlashcards([]);
  };

  const handleAwardDiamonds = async () => {
    if (!selectedUser || diamondAmount <= 0) return;
    try {
      setLoading(true);
      // Using tokenAPI to award diamonds to target user
      await tokenAPI.awardUser(selectedUser._id || selectedUser.id, diamondAmount, awardReason);
      showToast(`Successfully awarded ${diamondAmount} diamonds to ${selectedUser.name}`, "success");
      setDiamondAmount(0);
      setAwardReason("Admin Reward");
      fetchAll();
      // Refresh transactions for current view
      fetchUserTransactions(selectedUser._id || selectedUser.id);
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to award diamonds", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupStudents = async () => {
    if (!(await confirmDelete('Are you absolutely sure you want to remove ALL students and their associated data (progress, transactions)? This action cannot be undone.'))) {
      return;
    }

    try {
      setLoading(true);
      await userAPI.cleanupStudents();
      showToast('Student records have been successfully cleared.', "success");
      fetchAll();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || 'Failed to cleanup students', "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenStats = async () => {
    setTokenStatsLoading(true);
    try {
      const [tRes, sRes] = await Promise.allSettled([
        tokenAPI.getAdminStats(),
        shopAPI.getAdminStats(),
      ]);
      if (tRes.status === 'fulfilled') setTokenStats(tRes.value?.data?.data ?? tRes.value?.data);
      if (sRes.status === 'fulfilled') setShopStats(sRes.value?.data?.data ?? sRes.value?.data);
    } catch (err) {
      console.error('Token stats fetch failed', err);
    } finally {
      setTokenStatsLoading(false);
    }
  };

  const fetchUserProgress = async (userId: string) => {
    try {
      const res = await userAPI.getUserProgress(userId);
      setUserProgress(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Fetch user progress failed", err);
    }
  };

  const toggleUserDetail = (user: any) => {
    if (selectedUser?._id === user._id) {
      setSelectedUser(null);
      setUserProgress([]);
      setUserTransactions([]);
    } else {
      setSelectedUser(user);
      const uid = user._id || user.id;
      fetchUserProgress(uid);
      fetchUserTransactions(uid);
    }
  };

  const handleCreateFlashcard = async () => {
    try {
      setLoading(true);
      await flashcardAPI.createFlashcard(newFlashcard);
      showToast("Flashcard created successfully!", "success");
      setShowFlashcardModal(false);
      setNewFlashcard({ question: "", answer: "", subject: "science", chapter: "", difficulty: "Medium" });
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to create flashcard", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlashcard = async (id: string) => {
    if (!(await confirmDelete("Are you sure you want to delete this flashcard?"))) return;
    try {
      setLoading(true);
      await flashcardAPI.deleteFlashcard(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!(await confirmDelete("Are you sure you want to delete this material?"))) return;
    try {
      setLoading(true);
      await materialAPI.deleteMaterial(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!(await confirmDelete("Are you sure you want to delete this quiz?"))) return;
    try {
      setLoading(true);
      await quizAPI.deleteQuiz(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMaterial = async () => {
    try {
      setLoading(true);
      const isFileUpload = newMaterial.type !== "video";
      if (!newMaterial.title || !newMaterial.subject || (isFileUpload ? !uploadedAdminFile : !newMaterial.fileUrl)) {
        alert(isFileUpload ? "Please fill in title, subject, and select a file." : "Please fill in title, subject, and video URL.");
        return;
      }
      const desc = newMaterial.description || `${newMaterial.type === "video" ? "Video lesson" : newMaterial.type === "notes" ? "Study notes" : newMaterial.type === "worksheet" ? "Worksheet" : "Presentation"} for ${newMaterial.subject} - ${newMaterial.grade} grade`;
      if (isFileUpload && uploadedAdminFile) {
        const formData = new FormData();
        formData.append("file", uploadedAdminFile);
        formData.append("title", newMaterial.title);
        formData.append("subject", newMaterial.subject);
        formData.append("grade", newMaterial.grade);
        formData.append("type", newMaterial.type);
        formData.append("chapter", newMaterial.chapter);
        formData.append("difficulty", newMaterial.difficulty);
        formData.append("description", desc);
        await api.post("/materials", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } else {
        await materialAPI.createMaterial({ ...newMaterial, description: desc });
      }
      alert("Material uploaded successfully!");
      setShowMaterialModal(false);
      setUploadedAdminFile(null);
      setNewMaterial({ title: "", description: "", subject: "science", type: "video", chapter: "", grade: "6th", fileUrl: "", tags: "", difficulty: "Beginner" });
      fetchAll();
    } catch (err: any) {
      console.error(err);
      showToast(err?.response?.data?.message || "Failed to upload material", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {

    if (!newQuiz.grade) {
      showToast("Please select a grade", "error");
      return;
    }

    if (!newQuiz.subject) {
      showToast("Please select a subject", "error");
      return;
    }

    try {
      setLoading(true);
      await quizAPI.createQuiz({
        ...newQuiz,
        grade: newQuiz.grade || "6th",
        description: newQuiz.description || newQuiz.title,
        questions: transformQuestions(quizQuestionInputs)
      });
      showToast("Quiz built successfully!", "success");
      setShowQuizModal(false);
      setNewQuiz({
        title: "",
        description: "",
        subject: "",
        grade: "",
        difficulty: "Medium",
        questions: []
      });


      setAvailableSubjects([]);
      setQuizQuestionInputs([]);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to build quiz", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      setLoading(true);
      await userAPI.updateUser(userId, { role: newRole });
      showToast(`User identity updated to ${newRole}`, "success");
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update user permissions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const students = users.filter(u => u.role === 'student');
     const headers = ['Name', 'Email', 'Grade', 'Role', 'Level', 'XP', '💎', 'Progress %', 'Joined'];
    const rows = students.map((u: any) => [
      u.name || '',
      u.email || '',
      u.grade || '',
      u.role || '',
      u.level || 1,
      u.experience || 0,
      u.tokens || 0,
      u.totalProgress || 0,
      u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ''
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learnkins-students-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!(await confirmDelete(`Are you sure you want to delete "${userName}"? This action cannot be undone.`))) return;
    try {
      setLoading(true);
      await userAPI.deleteUser(userId);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  // Subject CRUD
  const handleCreateSubject = async () => {
    try {
      setLoading(true);
      await subjectAPI.createSubject(newSubject);
      showToast("Subject created successfully!", "success");
      setShowSubjectModal(false);
      setNewSubject({ name: "", slug: "", description: "", icon: "book", color: "#6366f1", grade: "6th" });
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to create subject", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    try {
      setLoading(true);
      await subjectAPI.updateSubject(editingSubject._id || editingSubject.id, editingSubject);
      showToast("Subject updated!", "success");
      setEditingSubject(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update subject", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!(await confirmDelete("Delete this subject?"))) return;
    try {
      setLoading(true);
      await subjectAPI.deleteSubject(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Contact messages
  const handleUpdateMessageStatus = async (id: string, status: string) => {
    try {
      await contactAPI.updateMessageStatus(id, { status });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Shop Item CRUD
  const handleCreateShopItem = async () => {
    try {
      setLoading(true);
      await shopAPI.createItem(newShopItem);
      showToast("Shop item created!", "success");
      setShowShopItemModal(false);
      setNewShopItem({ title: "", description: "", type: "power_up", price: 10, icon: "🎁", subject: "all", grade: "all", stock: -1 });
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to create shop item", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShopItem = async () => {
    if (!editingShopItem) return;
    try {
      setLoading(true);
      await shopAPI.updateItem(editingShopItem._id || editingShopItem.id, editingShopItem);
      showToast("Shop item updated!", "success");
      setEditingShopItem(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update shop item", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShopItem = async (id: string) => {
    if (!(await confirmDelete("Delete this shop item?"))) return;
    try {
      setLoading(true);
      await shopAPI.deleteItem(id);
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCertificate = async () => {
    try {
      setLoading(true);
      await certificateAPI.createCertificate(newCertificate);
      showToast("Certificate generated successfully!", "success");
      setShowCertificateModal(false);
      setNewCertificate({
        studentName: "", email: "", phoneNumber: "", college: "", university: "",
        internshipDomain: "", internshipTitle: "", duration: "", startDate: "", endDate: ""
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to generate certificate", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return showToast("Please select a file first", "error");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', bulkFile);
      
      const response = await certificateAPI.bulkCreateCertificates(formData);
      
      // Download the zip file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'certificates.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showToast("Bulk generated successfully!", "success");
      setShowCertificateModal(false);
      setBulkFile(null);
      fetchAll();
    } catch (err: any) {
      console.error(err);
      let errorMessage = "Failed to generate certificate";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          errorMessage = JSON.parse(text).message || errorMessage;
        } catch (e) {
          // ignore
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!(await confirmDelete("Delete this certificate?"))) return;
    try {
      setLoading(true);
      setCertificates(prev => prev.filter(c => (c._id || c.id) !== id)); // Optimistic UI update
      await certificateAPI.deleteCertificate(id);
      fetchAll();
    } catch (err) {
      console.error(err);
      fetchAll(); // Revert on failure
    } finally {
      setLoading(false);
    }
  };

  // Quiz question builder helpers
  const addQuizQuestion = () => {
    setQuizQuestionInputs([...quizQuestionInputs, {
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    }]);
  };

  const updateQuizQuestion = (index: number, field: string, value: any) => {
    const updated = [...quizQuestionInputs];
    (updated[index] as any)[field] = value;
    setQuizQuestionInputs(updated);
  };

  const updateQuizQuestionOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...quizQuestionInputs];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestionInputs(updated);
  };

  const removeQuizQuestion = (index: number) => {
    setQuizQuestionInputs(quizQuestionInputs.filter((_, i) => i !== index));
  };

  // Edit helpers — populate modal with existing data
  const startEditFlashcard = (card: any) => {
    setEditingFlashcard({ ...card });
  };
  const startEditMaterial = (mat: any) => {
    setEditingMaterial({ ...mat });
  };
  const startEditQuiz = (quiz: any) => {
    setEditingQuiz({ ...quiz });
    // Backend stores questions as {options: [{text, isCorrect}], correctAnswer: String}
    // Frontend expects {options: [strings], correctAnswer: index}
    const qs = (quiz.questions || []).map((q: any) => {
      const opts = Array.isArray(q.options)
        ? q.options.map((o: any) => (typeof o === 'string' ? o : o.text || ''))
        : ["", "", "", ""];
      const correctIdx = typeof q.correctAnswer === 'number'
        ? q.correctAnswer
        : opts.findIndex((_: string, i: number) => {
          const opt = q.options?.[i];
          return opt?.isCorrect === true || i === parseInt(q.correctAnswer);
        });
      return {
        question: q.question || "",
        options: opts,
        correctAnswer: correctIdx >= 0 ? correctIdx : 0,
        explanation: q.explanation || ""
      };
    });
    setQuizQuestionInputs(qs);
  };
  const startEditSubject = (subj: any) => {
    setEditingSubject({ ...subj });
  };
  const startEditShopItem = (item: any) => {
    setEditingShopItem({ ...item });
  };

  const handleUpdateFlashcard = async () => {
    if (!editingFlashcard) return;
    try {
      setLoading(true);
      await flashcardAPI.updateFlashcard(editingFlashcard._id || editingFlashcard.id, editingFlashcard);
      showToast("Flashcard updated!", "success");
      setEditingFlashcard(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update flashcard", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMaterial = async () => {
    if (!editingMaterial) return;
    try {
      setLoading(true);
      await materialAPI.updateMaterial(editingMaterial._id || editingMaterial.id, editingMaterial);
      showToast("Material updated!", "success");
      setEditingMaterial(null);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update material", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuiz = async () => {
    if (!editingQuiz) return;
    try {
      setLoading(true);
      await quizAPI.updateQuiz(editingQuiz._id || editingQuiz.id, {
        ...editingQuiz,
        grade: editingQuiz.grade || "6th",
        description: editingQuiz.description || editingQuiz.title,
        questions: transformQuestions(quizQuestionInputs)
      });
      showToast("Quiz updated!", "success");
      setEditingQuiz(null);
      setQuizQuestionInputs([]);
      fetchAll();
    } catch (err) {
      console.error(err);
      showToast("Failed to update quiz", "error");
    } finally {
      setLoading(false);
    }
  };
  const inputClass = "w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const cardClass = "bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all";
  const sidebarItemClass = (id: string) => `
    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all cursor-pointer font-semibold
    ${activeTab === id
      ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl max-w-md w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
              <Shield className="h-7 w-7 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 font-medium mt-1">Authorized Personnel Only</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="admin@learnkins.com"
                className={theme.input}
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={theme.input}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-200 mt-2"
            >
              Verify Identity
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Secure Access Protocol v2.8</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex relative text-slate-900">
      {loading && (
        <div className="fixed inset-0 z-[100] bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-3 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="mt-4 font-bold tracking-tight text-slate-600 text-sm">Synchronizing Data...</p>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">LEARNKINS</h1>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Management Console</span>
            </div>
          </div>
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 mt-2">Overview</p>
          <div className={sidebarItemClass("dashboard")} onClick={() => setActiveTab("dashboard")}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </div>
          <div className={sidebarItemClass("users")} onClick={() => setActiveTab("users")}>
            <Users size={18} />
            <span>Students</span>
          </div>
          <div className={sidebarItemClass("certificates")} onClick={() => setActiveTab("certificates")}>
            <FileBadge size={18} />
            <span>Certificates</span>
          </div>
          <div className={sidebarItemClass("messages")} onClick={() => setActiveTab("messages")}>
            <MessageSquare size={18} />
            <span>Messages</span>
          </div>

          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-2">Content</p>
          <div className={sidebarItemClass("subjects")} onClick={() => setActiveTab("subjects")}>
            <BookMarked size={18} />
            <span>Subjects</span>
          </div>
          <div className={sidebarItemClass("quizzes")} onClick={() => setActiveTab("quizzes")}>
            <FileText size={18} />
            <span>Quizzes</span>
          </div>
          <div className={sidebarItemClass("flashcards")} onClick={() => setActiveTab("flashcards")}>
            <Brain size={18} />
            <span>Flashcards</span>
          </div>
          <div className={sidebarItemClass("materials")} onClick={() => setActiveTab("materials")}>
            <BookOpen size={18} />
            <span>Materials</span>
          </div>

          <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-6 mb-2">Economy</p>
           <div className={sidebarItemClass("tokens")} onClick={() => { setActiveTab("tokens"); fetchTokenStats(); }}>
            <Gem size={18} />
            <span>💎 Diamonds & Shop</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-rose-600 rounded-lg font-bold hover:bg-rose-50 transition-all text-sm border border-transparent hover:border-rose-100"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm shadow-slate-100/50">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-800">
              {activeTab === 'dashboard' && 'Control Center'}
              {activeTab === 'users' && 'Student Directory'}
              {activeTab === 'subjects' && 'Subject Management'}
              {activeTab === 'quizzes' && 'Exam Management'}
              {activeTab === 'flashcards' && 'Knowledge Base'}
              {activeTab === 'materials' && 'Educational Assets'}
              {activeTab === 'messages' && 'Contact Messages'}
               {activeTab === 'tokens' && '💎 Diamonds & Shop'}
               {activeTab === 'certificates' && 'Certificates'}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search repository..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-lg font-medium text-xs w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="h-9 w-9 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="p-8 pb-20 max-w-[1600px] mx-auto w-full">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-indigo-50 rounded-lg">
                        <Users className="h-5 w-5 text-indigo-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Students</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{users.filter(u => u.role === 'student').length}</p>
                  </div>
                </div>

                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-emerald-50 rounded-lg">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Quizzes</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{quizzes.length}</p>
                  </div>
                </div>

                <div className={theme.card}>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-rose-50 rounded-lg">
                        <Activity className="h-5 w-5 text-rose-600" />
                      </div>
                    </div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content Count</h3>
                    <p className="text-3xl font-bold mt-1 tracking-tight">{materials.length + flashcards.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity / Quick Actions Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={cardClass}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Platform Metrics</h3>
                    <div className="flex items-center text-green-500 font-bold text-sm">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                      Live
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Total Users</span>
                        <span className="font-bold text-xl">{users.length}</span>
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        {users.filter(u => u.role === 'student').length} students · {users.filter(u => u.role !== 'student').length} staff
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Content Library</span>
                        <span className="font-bold text-xl">{materials.length + flashcards.length + quizzes.length}</span>
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        {materials.length} videos · {quizzes.length} quizzes
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Subjects</span>
                        <span className="font-bold text-xl">{subjects.length}</span>
                      </div>
                      <div className="text-xs font-bold text-gray-500">
                        {flashcards.length} flashcards
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-2 border-black rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-sm uppercase">Shop Items</span>
                        <span className="font-bold text-xl">{shopItems.length}</span>
                      </div>
                       <div className="text-xs font-bold text-gray-500">
                        {shopItems.filter((item: any) => item.stock !== 0).length} available in shop
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <h3 className="text-xl font-black mb-6">Quick Content Push</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setShowSubjectModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-cyan-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-cyan-600" />
                      <span className="font-black text-sm uppercase">Add Subject</span>
                    </button>
                    <button onClick={() => setShowQuizModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-green-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-green-600" />
                      <span className="font-black text-sm uppercase">Build Quiz</span>
                    </button>
                    <button onClick={() => setShowMaterialModal(true)} className="p-4 bg-white border-2 border-black rounded-xl hover:bg-purple-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col items-center text-center">
                      <Plus className="h-6 w-6 mb-2 text-purple-600" />
                      <span className="font-black text-sm uppercase">Material</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-white border-2 border-black px-4 py-2 rounded-xl flex items-center space-x-2 font-bold cursor-pointer hover:bg-gray-50 transition-all">
                    <Filter className="h-4 w-4" />
                    <span>All Grades</span>
                  </div>
                  <div onClick={handleExportCSV} className="bg-white border-2 border-black px-4 py-2 rounded-xl flex items-center space-x-2 font-bold cursor-pointer hover:bg-gray-50 transition-all">
                    <Download className="h-4 w-4" />
                    <span>Export CSV</span>
                  </div>
                  <div className="bg-rose-50 border-2 border-rose-500 px-4 py-2 rounded-xl flex items-center space-x-2 font-black cursor-pointer hover:bg-rose-100 transition-all text-rose-600 shadow-[2px_2px_0px_0px_rgba(225,29,72,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none" onClick={handleCleanupStudents}>
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Students</span>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Showing {users.filter(u => u.role === 'student').length} registered students
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200">
                      <th className="px-6 py-4 font-bold">Student Details</th>
                      <th className="px-6 py-4 font-bold">Level / Grade</th>
                      <th className="px-6 py-4 font-bold text-center">Progress</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.filter(u => u.role === 'student').map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 uppercase text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                              <div className="text-[11px] font-medium text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold uppercase text-slate-600">
                            {user.grade} Grade
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="bg-indigo-600 h-full rounded-full"
                                style={{ width: `${user.totalProgress || 0}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-bold uppercase mt-1.5 text-slate-400 tracking-wider">
                              {user.totalProgress || 0}% Complete
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <select
                              className="text-[11px] font-bold uppercase bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500"
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id || user.id, e.target.value)}
                            >
                              <option value="student">Student</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => toggleUserDetail(user)}
                              className="inline-flex items-center text-[11px] font-bold uppercase bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                              Analytics
                              <ChevronRight size={14} className="ml-1" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id || user.id, user.name)}
                              className="p-2 bg-white border border-slate-200 text-slate-300 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Student Detail Viewport */}
              <AnimatePresence>
                {selectedUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative border border-slate-200"
                    >
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-6 right-6 h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all z-10 shadow-sm"
                      >
                        <X size={20} />
                      </button>

                      <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-6">
                          <div className="h-20 w-20 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-sm">
                            {selectedUser.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold tracking-tight text-slate-900">{selectedUser.name}</h3>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="font-medium text-slate-500">{selectedUser.email}</span>
                              <div className="h-1 w-1 bg-slate-300 rounded-full" />
                              <span className="font-bold text-xs uppercase tracking-widest text-indigo-600">{selectedUser.grade} Grade</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-grow p-8 overflow-y-auto bg-white space-y-8">
                        {/* Analytics Row */}
                        <div className="grid grid-cols-5 gap-4">
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-xl font-bold text-slate-900">
                              {(userProgress.reduce((acc, p) => acc + (p.timeSpent || 0), 0) / 60).toFixed(1)}h
                            </div>
                            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-1">Study Time</div>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <Award className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-xl font-bold text-slate-900">
                              {userProgress.reduce((acc, p) => acc + (p.completedActivities?.length || 0), 0)}
                            </div>
                            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-1">Activities</div>
                          </div>
                          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center shadow-sm">
                            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-indigo-500 opacity-80" />
                            <div className="text-xl font-bold text-slate-900">
                              {userProgress.length > 0
                                ? Math.round(userProgress.reduce((acc, p) => acc + (p.progress || 0), 0) / userProgress.length)
                                : 0}%
                            </div>
                            <div className="text-[9px] font-bold uppercase text-slate-400 tracking-widest mt-1">Avg Progress</div>
                          </div>
                          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center shadow-sm">
                            <Star className="h-6 w-6 mx-auto mb-2 text-emerald-600 opacity-80" />
                            <div className="text-xl font-bold text-slate-900">
                              Lvl {selectedUser.level || 1}
                            </div>
                            <div className="text-[9px] font-bold uppercase text-emerald-600 tracking-widest mt-1">Student Rank</div>
                          </div>
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl text-center shadow-sm">
                            <Activity className="h-6 w-6 mx-auto mb-2 text-amber-600 opacity-80" />
                            <div className="text-xl font-bold text-slate-900">
                              {selectedUser.experience || 0}
                            </div>
                            <div className="text-[9px] font-bold uppercase text-amber-600 tracking-widest mt-1">Total XP</div>
                          </div>
                        </div>

                        {/* Diamond Allotment Section */}
                        <div className="p-6 bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl">
                          <h4 className="text-sm font-black uppercase tracking-wider text-indigo-700 mb-4 flex items-center gap-2">
                            <span>💎</span> Allot Diamonds
                          </h4>
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                              <input
                                type="number"
                                placeholder="Amount (e.g. 50)"
                                className={theme.input}
                                value={diamondAmount || ''}
                                onChange={(e) => setDiamondAmount(parseInt(e.target.value) || 0)}
                              />
                            </div>
                            <div className="flex-[2]">
                              <input
                                type="text"
                                placeholder="Reason (e.g. Good Participation)"
                                className={theme.input}
                                value={awardReason}
                                onChange={(e) => setAwardReason(e.target.value)}
                              />
                            </div>
                            <button
                              onClick={handleAwardDiamonds}
                              disabled={diamondAmount <= 0}
                              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-black hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                              Award
                            </button>
                          </div>
                        </div>

                        {/* Diamond Transaction History */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <History size={16} className="mr-2" />
                            Diamond Transaction History
                          </h4>
                          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            {userTransactions && userTransactions.length > 0 ? (
                              <div className="divide-y divide-slate-50">
                                {userTransactions.map((tx, idx) => (
                                  <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                                    <div className="flex items-center space-x-4">
                                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg
                                        ${tx.type === 'award' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
                                      `}>
                                        {tx.type === 'award' ? '+' : '-'}
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-900 text-sm">{tx.reason || (tx.type === 'award' ? 'Reward' : 'Redemption')}</div>
                                        <div className="text-[10px] font-medium text-slate-400">
                                          {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`text-sm font-black flex items-center gap-1
                                      ${tx.type === 'award' ? 'text-emerald-600' : 'text-rose-600'}
                                    `}>
                                      <span>{tx.type === 'award' ? '+' : ''}{tx.amount}</span>
                                      <span className="text-xs">💎</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="py-12 text-center">
                                <p className="font-medium text-slate-400 text-sm italic">No diamond transactions recorded for this student.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Activity Feed */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <Activity size={16} className="mr-2" />
                            Learning Timeline
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {userProgress.map((prog, idx) => (
                              <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between hover:border-indigo-200 transition-all shadow-sm">
                                <div className="flex items-center space-x-4">
                                  <div className={`h-10 w-10 border border-slate-100 rounded-lg flex items-center justify-center font-bold uppercase text-[10px]
                                    ${prog.subject === 'mathematics' ? 'bg-blue-50 text-blue-600' :
                                      prog.subject === 'science' ? 'bg-emerald-50 text-emerald-600' :
                                        prog.subject === 'english' ? 'bg-pink-50 text-pink-600' : 'bg-amber-50 text-amber-600'}
                                  `}>
                                    {prog.subject.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-xs uppercase tracking-tight text-slate-900">{prog.subject}</div>
                                    <div className="text-[11px] font-medium text-slate-400">{prog.chapter || 'Knowledge Core'}</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-indigo-600">{prog.progress}%</div>
                                  <div className="w-16 h-1 mt-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${prog.progress}%` }} />
                                  </div>
                                </div>
                              </div>
                            ))}
                            {userProgress.length === 0 && (
                              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                                <p className="font-medium text-slate-400 text-sm italic">No learning sessions found for this identity.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                          Secure Report Export
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === "subjects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Subjects & Curriculum</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Manage learning subjects</p>
                </div>
                <button onClick={() => setShowSubjectModal(true)} className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]">
                  <Plus size={18} /><span>New Subject</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subj) => (
                  <div key={subj._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xl font-bold" style={{ backgroundColor: subj.color || '#6366f1', color: 'white' }}>
                          {(subj.icon || '📚').charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{subj.name}</h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subj.grade || 'All'} Grade</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mb-4 line-clamp-2">{subj.description || 'No description'}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subj.slug}</span>
                      <div className="flex space-x-2">
                        <button onClick={() => startEditSubject(subj)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 size={14} /></button>
                        <button onClick={() => handleDeleteSubject(subj._id || subj.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {subjects.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                    <p className="font-medium text-slate-400 text-sm italic">No subjects yet. Create your first subject.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                  Showing {certificates.length} certificates
                </div>
                <button onClick={() => setShowCertificateModal(true)} className={theme.buttonPrimary + " flex items-center gap-2"}>
                  <Plus size={16} /> Generate Certificate
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-200">
                      <th className="px-6 py-4 font-bold">Internship / Student</th>
                      <th className="px-6 py-4 font-bold">Duration</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map((cert) => (
                      <tr key={cert._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 text-sm">{cert.internshipTitle}</div>
                          <div className="text-[11px] font-medium text-slate-500">{cert.studentName}</div>
                          <div className="text-[10px] font-medium text-slate-400">{cert.certificateId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-slate-600">{cert.duration}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${cert.status === 'Valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <a href={`/verify/internship/${cert.certificateId}`} target="_blank" rel="noreferrer" className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 rounded-lg transition-all" title="View Verification">
                              <Eye size={14} />
                            </a>
                            <a 
                              href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}/uploads/certificates/${cert.certificateId}.pdf`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 rounded-lg transition-all" 
                              title="Download Certificate"
                              download
                            >
                              <Download size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteCertificate(cert._id)}
                              className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-lg transition-all"
                              title="Delete Certificate"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {certificates.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400 font-medium italic">
                          No certificates have been generated yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "messages" && (
            <div className="space-y-6">
              {/* Sub-tabs */}
              <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => setMessagesSubTab("messages")} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${messagesSubTab === "messages" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}><MessageSquare size={16} /><span>Messages</span></button>
                <button onClick={() => setMessagesSubTab("newsletter")} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${messagesSubTab === "newsletter" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}><Mail size={16} /><span>Newsletter ({newsletterSubscribers.length})</span></button>
              </div>

              {messagesSubTab === "messages" && (
                <>
                  <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Contact Messages</h3>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">User inquiries & support requests</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {['all', 'new', 'read', 'replied'].map(f => (
                        <button key={f} onClick={() => setContactFilter(f)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${contactFilter === f ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{f}</button>
                      ))}
                      <button onClick={fetchAll} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><RefreshCw size={14} /></button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {contactMessages
                      .filter((m: any) => contactFilter === 'all' || m.status === contactFilter)
                      .map((msg: any) => (
                        <div key={msg.id || msg._id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedMessage(selectedMessage?.id === msg.id ? null : msg)}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-9 w-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center font-bold text-indigo-600 uppercase text-xs">{msg.name?.charAt(0)}</div>
                              <div>
                                <div className="font-bold text-slate-900 text-sm">{msg.name}</div>
                                <div className="text-[11px] font-medium text-slate-400">{msg.email}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full ${msg.status === 'new' ? 'bg-green-50 text-green-600 border border-green-200' : msg.status === 'read' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-purple-50 text-purple-600 border border-purple-200'}`}>{msg.status}</span>
                              <span className="text-[10px] font-medium text-slate-400">{new Date(msg.createdAt || msg.submittedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-[10px] font-bold text-indigo-600/70 bg-indigo-50 px-2 py-0.5 rounded uppercase">{msg.category}</span>
                            <span className="font-semibold text-slate-700 text-sm">{msg.subject}</span>
                          </div>
                          {selectedMessage?.id === msg.id && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                              <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-slate-200">
                                {msg.status !== 'read' && <button onClick={(e) => { e.stopPropagation(); handleUpdateMessageStatus(msg.id, 'read'); }} className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all"><Eye size={12} /><span>Mark Read</span></button>}
                                {msg.status !== 'replied' && <button onClick={(e) => { e.stopPropagation(); handleUpdateMessageStatus(msg.id, 'replied'); }} className="flex items-center space-x-1 px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-100 transition-all"><Mail size={12} /><span>Mark Replied</span></button>}
                                <button onClick={(e) => { e.stopPropagation(); handleUpdateMessageStatus(msg.id, 'archived'); }} className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-200 transition-all"><Archive size={12} /><span>Archive</span></button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    {contactMessages.length === 0 && (
                      <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                        <p className="font-medium text-slate-400 text-sm italic">No contact messages yet.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {messagesSubTab === "newsletter" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Newsletter Subscribers</h3>
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">{newsletterSubscribers.length} total subscribers</p>
                    </div>
                    <button onClick={fetchAll} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"><RefreshCw size={14} /></button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 text-left">
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Email</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
                          <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Subscribed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterSubscribers.map((sub: any, i: number) => (
                          <tr key={sub._id || i} className="border-t border-slate-100 hover:bg-slate-50 transition-all">
                            <td className="px-4 py-3 font-medium text-slate-800 text-sm">{sub.email}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full ${sub.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>{sub.active ? 'Active' : 'Unsubscribed'}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-500">{new Date(sub.subscribedAt || sub.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                        {newsletterSubscribers.length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-4 py-12 text-center">
                              <p className="font-medium text-slate-400 text-sm italic">No subscribers yet.</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "flashcards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Flashcard Repository</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Knowledge Base Assets</p>
                </div>
                <button
                  onClick={() => setShowFlashcardModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Build New Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {flashcards.map((card) => (
                  <div key={card._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {card.subject}
                        </span>
                        <button
                          onClick={() => startEditFlashcard(card)}
                          className="text-slate-300 hover:text-indigo-500 transition-colors p-1"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteFlashcard(card._id || card.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{card.question}</h4>
                      <p className="text-slate-500 font-medium text-xs border-t border-slate-100 pt-3 mt-3 italic bg-slate-50/50 p-2 rounded-lg leading-relaxed">A: {card.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "quizzes" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Content Assessments</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Interactive Logic Verification</p>
                </div>
                <button
                  onClick={() => setShowQuizModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Plus size={18} />
                  <span>Interactive Builder</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {quizzes.map((q) => (
                  <div key={q._id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all group shadow-sm">
                    <div className="flex items-center space-x-6">
                      <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-500 shadow-inner">
                        {q.questions?.length || 0} Q
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{q.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-wider">{q.subject}</span>
                          <div className="h-1 w-1 bg-slate-200 rounded-full" />
                          <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-wider">{q.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => startEditQuiz(q)} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-indigo-300 hover:text-indigo-600 font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(q._id || q.id)}
                        className="p-2.5 bg-white border border-slate-200 text-slate-300 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Educational Library</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Static High-Resolution Assets</p>
                </div>
                <button
                  onClick={() => setShowMaterialModal(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-[0.98]"
                >
                  <Upload size={18} />
                  <span>Secure Upload</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((m) => (
                  <div key={m._id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="p-1.5 bg-slate-50 border border-slate-100 rounded">
                          <BookOpen size={14} className="text-slate-400" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Asset</span>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors uppercase text-[11px] tracking-tight">{m.title}</h4>
                      <p className="text-slate-500 font-medium text-[11px] mt-2 mb-4 line-clamp-2">Reference documentation for {m.subject} syllabus.</p>
                      <div className="flex items-center space-x-3 text-[10px] font-bold text-indigo-600/70">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded uppercase">{m.subject}</span>
                        <div className="h-1 w-1 bg-slate-200 rounded-full" />
                        <span className="uppercase">{m.type || 'PDF Document'}</span>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-slate-50 space-x-2">
                      <button onClick={() => startEditMaterial(m)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMaterial(m._id || m.id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TOKEN ANALYTICS TAB ── */}
          {activeTab === "tokens" && (
            <div className="p-6 space-y-6">
              {tokenStatsLoading ? (
                <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
                  <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  Loading token analytics…
                </div>
              ) : (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total in Circulation", value: tokenStats?.totalTokensInCirculation ?? 0, icon: "💎", color: "indigo" },
                      { label: "Total Earned (all time)", value: tokenStats?.totalEarned ?? 0, icon: "⬆️", color: "emerald" },
                      { label: "Total Spent", value: tokenStats?.totalSpent ?? 0, icon: "⬇️", color: "rose" },
                      { label: "Total Purchases", value: shopStats?.totalPurchases ?? 0, icon: "🛒", color: "amber" },
                    ].map(card => (
                      <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <p className="text-2xl mb-1">{card.icon}</p>
                        <p className="text-2xl font-extrabold text-slate-900">{card.value.toLocaleString()}</p>
                        <p className="text-xs text-slate-500 mt-1">{card.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* 7-day activity */}
                  {tokenStats?.dailyActivity?.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2"><TrendingUp size={16} /> 7-Day Activity</h3>
                      <div className="flex items-end gap-2 h-24">
                        {tokenStats.dailyActivity.map((d: any, i: number) => {
                          const maxAmt = Math.max(...tokenStats.dailyActivity.map((x: any) => x.totalAmount ?? x.amount ?? 1));
                          const amt = d.totalAmount ?? d.amount ?? 0;
                          const pct = maxAmt > 0 ? (amt / maxAmt) * 100 : 0;
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d._id ?? d.date}: ${amt} diamonds`}>
                              <div className="w-full rounded-t-sm bg-indigo-500 transition-all" style={{ height: `${Math.max(pct, 5)}%` }} />
                              <span className="text-[9px] text-slate-400">{(d._id ?? d.date ?? "")?.slice(5)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-5">
                    {/* Top earners */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><Award size={16} /> Top 10 Earners</h3>
                      {!tokenStats?.topEarners?.length ? (
                        <p className="text-slate-400 text-sm py-4 text-center">No data yet</p>
                      ) : (
                        <div className="space-y-2">
                          {tokenStats.topEarners.map((u: any, i: number) => (
                            <div key={u._id} className="flex items-center gap-3 py-1.5 border-b border-slate-50 last:border-0">
                              <span className="text-xs font-bold text-slate-400 w-5">#{i + 1}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-800 truncate">{u.name ?? u.email}</p>
                                <p className="text-xs text-slate-400 truncate">{u.email}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-indigo-600 flex items-center gap-1"><Gem size={12} />{u.tokens ?? u.balance ?? 0}</p>
                                <p className="text-xs text-slate-400">Lv {u.level ?? 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent transactions */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><Activity size={16} /> Recent Transactions</h3>
                      {!tokenStats?.recentTransactions?.length ? (
                        <p className="text-slate-400 text-sm py-4 text-center">No transactions yet</p>
                      ) : (
                        <div className="space-y-1.5 max-h-80 overflow-y-auto">
                          {tokenStats.recentTransactions.map((tx: any) => (
                            <div key={tx._id} className="flex items-center gap-2 py-1.5 border-b border-slate-50 last:border-0">
                              <span className={`text-xs font-bold w-14 text-right ${tx.type === 'earn' ? 'text-emerald-600' : 'text-rose-500'}`}>
                                {tx.type === 'earn' ? '+' : '-'}{tx.amount}💎
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-700 truncate">{tx.reason}</p>
                                <p className="text-[10px] text-slate-400">{tx.userId?.name ?? tx.userId?.email ?? "User"}</p>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0">{new Date(tx.createdAt).toLocaleDateString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shop stats */}
                  {shopStats && (
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                      <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><ShoppingBag size={16} /> Shop Overview</h3>
                      <div className="grid sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xl font-extrabold text-slate-900">{shopStats.totalItems ?? 0}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Total Items</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xl font-extrabold text-slate-900">{shopStats.totalPurchases ?? 0}</p>
                          <p className="text-xs text-slate-500 mt-0.5">Total Purchases</p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-xl font-extrabold text-indigo-600">{shopStats.totalTokensSpent ?? 0} 💎</p>
                           <p className="text-xs text-slate-500 mt-0.5">💎 Diamonds Spent in Shop</p>
                        </div>
                      </div>
                      {shopStats.topItems?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Top Sold Items</p>
                          <div className="space-y-1.5">
                            {shopStats.topItems.slice(0, 5).map((it: any) => (
                              <div key={it._id} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                                <span className="font-medium text-slate-700">{it.title ?? it._id}</span>
                                <span className="text-indigo-600 font-bold">{it.count ?? it.purchases ?? 0} sold</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={fetchTokenStats}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all"
                  >
                    <TrendingUp size={14} /> Refresh Stats
                  </button>

                  {/* Shop Items Management */}
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2"><ShoppingBag size={16} /> Shop Items</h3>
                      <button onClick={() => setShowShopItemModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all">
                        <Plus size={14} /> Add Item
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {shopItems.map((item: any) => (
                        <div key={item._id} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between group">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{item.icon || '🎁'}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.title}</p>
                              <p className="text-[10px] font-medium text-slate-400">{item.type} · {item.price}💎 {item.stock === -1 ? '· ∞' : `· ${item.stock} left`}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => startEditShopItem(item)} className="p-1.5 text-slate-300 hover:text-indigo-600 transition-colors"><Edit3 size={14} /></button>
                            <button onClick={() => handleDeleteShopItem(item._id || item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      ))}
                      {shopItems.length === 0 && (
                        <div className="col-span-full py-6 text-center">
                          <p className="text-sm text-slate-400 italic">No shop items yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showFlashcardModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">New Knowledge Card</h3>
                <button onClick={() => setShowFlashcardModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Question</label>
                  <textarea className={theme.input} rows={2} value={newFlashcard.question} onChange={(e) => setNewFlashcard({ ...newFlashcard, question: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Correct Answer</label>
                  <textarea className={theme.input} rows={2} value={newFlashcard.answer} onChange={(e) => setNewFlashcard({ ...newFlashcard, answer: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={newFlashcard.subject} onChange={(e) => setNewFlashcard({ ...newFlashcard, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select className={theme.input} value={newFlashcard.difficulty} onChange={(e) => setNewFlashcard({ ...newFlashcard, difficulty: e.target.value })}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowFlashcardModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateFlashcard} className={theme.buttonPrimary}>Create Flashcard</button>
              </div>
            </div>
          </motion.div>
        )}

        {showMaterialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {newMaterial.type === "video" ? "Upload Learning Video" : newMaterial.type === "notes" ? "Upload Study Notes" : newMaterial.type === "worksheet" ? "Upload Worksheet" : "Upload Presentation"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {newMaterial.type === "video" ? "Add YouTube videos or other materials for students" : "Upload files securely from your device"}
                  </p>
                </div>
                <button onClick={() => { setShowMaterialModal(false); setUploadedAdminFile(null); }} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title *</label>
                  <input className={theme.input} placeholder="e.g. Introduction to Cells" value={newMaterial.title} onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject *</label>
                    <select className={theme.input} value={newMaterial.subject} onChange={(e) => setNewMaterial({ ...newMaterial, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                      <option value="social-science">Social Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade *</label>
                    <select className={theme.input} value={newMaterial.grade} onChange={(e) => setNewMaterial({ ...newMaterial, grade: e.target.value })}>
                      <option value="6th">Grade 6</option>
                      <option value="7th">Grade 7</option>
                      <option value="8th">Grade 8</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                    <select className={theme.input} value={newMaterial.type} onChange={(e) => {
                      setNewMaterial({ ...newMaterial, type: e.target.value, fileUrl: "" });
                      setUploadedAdminFile(null);
                    }}>
                      <option value="video">Video Lesson</option>
                      <option value="notes">Study Notes</option>
                      <option value="worksheet">Worksheet</option>
                      <option value="presentation">Presentation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select className={theme.input} value={newMaterial.difficulty} onChange={(e) => setNewMaterial({ ...newMaterial, difficulty: e.target.value })}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chapter / Topic</label>
                  <input className={theme.input} placeholder="e.g. Cell Biology, Algebra, Photosynthesis" value={newMaterial.chapter} onChange={(e) => setNewMaterial({ ...newMaterial, chapter: e.target.value })} />
                </div>

                {newMaterial.type === "video" ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Video URL * <span className="text-slate-300 font-normal">(YouTube embed or direct video link)</span>
                    </label>
                    <input
                      className={theme.input}
                      placeholder="https://www.youtube.com/embed/VIDEO_ID"
                      value={newMaterial.fileUrl}
                      onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 mt-1">Tip: For YouTube, use the embed URL format: youtube.com/embed/VIDEO_ID</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">File Upload *</label>
                    <div
                      onClick={() => document.getElementById("admin-file-upload")?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${uploadedAdminFile ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50"}`}
                    >
                      <input
                        id="admin-file-upload"
                        type="file"
                        accept={newMaterial.type === "notes" ? ".pdf,.doc,.docx,.txt" : newMaterial.type === "worksheet" ? ".pdf,.doc,.docx,.xls,.xlsx" : ".pdf,.pptx,.ppt,.doc,.docx"}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadedAdminFile(file);
                          }
                        }}
                      />
                      {uploadedAdminFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-indigo-100 rounded-xl border-2 border-indigo-500">
                            <FileText size={24} className="text-indigo-600" />
                          </div>
                          <p className="font-bold text-slate-800 text-sm">{uploadedAdminFile.name}</p>
                          <p className="text-xs text-slate-500">{(uploadedAdminFile.size / 1024).toFixed(1)} KB</p>
                          <button onClick={(e) => { e.stopPropagation(); setUploadedAdminFile(null); setNewMaterial({ ...newMaterial, fileUrl: "" }); }} className="text-xs text-rose-500 font-bold hover:underline">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-slate-100 rounded-xl border-2 border-slate-300">
                            <Upload size={24} className="text-slate-400" />
                          </div>
                          <p className="font-bold text-slate-700">Click to select a file</p>
                          <p className="text-xs text-slate-400">
                            {newMaterial.type === "notes" ? "PDF, DOC, DOCX, TXT" : newMaterial.type === "worksheet" ? "PDF, DOC, DOCX, XLS, XLSX" : "PDF, PPT, PPTX, DOC, DOCX"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} placeholder="Brief description of what students will learn..." value={newMaterial.description} onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })} />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => { setShowMaterialModal(false); setUploadedAdminFile(null); }} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateMaterial} className={theme.buttonPrimary}>
                  {newMaterial.type === "video" ? "Upload Material" : "Upload File"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showQuizModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{editingQuiz ? 'Edit Assessment' : 'Initialize Assessment'}</h3>
                <button onClick={() => { setShowQuizModal(false); setEditingQuiz(null); setQuizQuestionInputs([]); }} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assessment Title</label>
                    <input className={theme.input} value={editingQuiz ? editingQuiz.title : newQuiz.title} onChange={(e) => editingQuiz ? setEditingQuiz({ ...editingQuiz, title: e.target.value }) : setNewQuiz({ ...newQuiz, title: e.target.value })} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea className={theme.input} rows={2} value={editingQuiz ? (editingQuiz.description || '') : newQuiz.description} onChange={(e) => editingQuiz ? setEditingQuiz({ ...editingQuiz, description: e.target.value }) : setNewQuiz({ ...newQuiz, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                    <select className={theme.input} value={editingQuiz ? (editingQuiz.grade || '6th') : newQuiz.grade} onChange={(e) => {
                      const grade = e.target.value;
                      if (editingQuiz) {
                        setEditingQuiz({ ...editingQuiz, grade, subject: "" });
                      } else {
                        setNewQuiz({ ...newQuiz, grade, subject: "" });
                      }
                      fetchSubjectsByGrade(grade);
                    }}>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={editingQuiz ? editingQuiz.subject : newQuiz.subject}
                      disabled={
                        !(editingQuiz ? editingQuiz.grade : newQuiz.grade)
                      }

                      onChange={(e) => {
                        const subject = e.target.value;
                        if (editingQuiz) {
                          setEditingQuiz({
                            ...editingQuiz,
                            subject,
                          });
                        } else {
                          setNewQuiz({
                            ...newQuiz,
                            subject,
                          });
                        }
                      }}>
                      <option value="">
                        {loadingSubjects
                          ? "Loading Subjects..."
                          : "Select Subject"}
                      </option>

                      {availableSubjects.map((subject: any) => (
                        <option
                          key={subject._id}
                          value={subject.slug}
                        >
                          {subject.name}
                        </option>
                      ))}

                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select className={theme.input} value={editingQuiz ? editingQuiz.difficulty : newQuiz.difficulty} onChange={(e) => editingQuiz ? setEditingQuiz({ ...editingQuiz, difficulty: e.target.value }) : setNewQuiz({ ...newQuiz, difficulty: e.target.value })}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                {/* Question Builder */}
                <div className="border-t border-slate-100 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Questions ({quizQuestionInputs.length})</label>
                    <button type="button" onClick={addQuizQuestion} className="flex items-center gap-1 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all"><Plus size={12} /> Add Question</button>
                  </div>
                  {quizQuestionInputs.map((q, qi) => (
                    <div key={qi} className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase">Q{qi + 1}</span>
                        <button type="button" onClick={() => removeQuizQuestion(qi)} className="text-rose-400 hover:text-rose-600 transition-colors"><X size={14} /></button>
                      </div>
                      <input className={theme.input + " mb-2"} placeholder="Question text" value={q.question} onChange={(e) => updateQuizQuestion(qi, 'question', e.target.value)} />
                      {[0, 1, 2, 3].map((oi) => (
                        <div key={oi} className="flex items-center gap-2 mb-1">
                          <input type="radio" checked={q.correctAnswer === oi} onChange={() => updateQuizQuestion(qi, 'correctAnswer', oi)} className="accent-indigo-600" />
                          <input className={theme.input + " text-sm"} placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={q.options[oi]} onChange={(e) => updateQuizQuestionOption(qi, oi, e.target.value)} />
                        </div>
                      ))}
                      <input className={theme.input + " mt-2 text-sm"} placeholder="Explanation (optional)" value={q.explanation} onChange={(e) => updateQuizQuestion(qi, 'explanation', e.target.value)} />
                    </div>
                  ))}
                  {quizQuestionInputs.length === 0 && (
                    <p className="text-sm text-slate-400 italic text-center py-4">Click "Add Question" to start building your quiz.</p>
                  )}
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                <button onClick={() => { setShowQuizModal(false); setEditingQuiz(null); setQuizQuestionInputs([]); }} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={editingQuiz ? handleUpdateQuiz : handleCreateQuiz} className={theme.buttonPrimary}>{editingQuiz ? 'Update Quiz' : 'Create Quiz'}</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subject Modal */}
        {showSubjectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">New Subject</h3>
                <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                    <input className={theme.input} value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. Physics" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Slug</label>
                    <input className={theme.input} value={newSubject.slug} onChange={(e) => setNewSubject({ ...newSubject, slug: e.target.value })} placeholder="physics" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} value={newSubject.description} onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Icon</label>
                    <input className={theme.input} value={newSubject.icon} onChange={(e) => setNewSubject({ ...newSubject, icon: e.target.value })} placeholder="book" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Color</label>
                    <input type="color" className="h-10 w-full rounded-lg border border-slate-200 cursor-pointer" value={newSubject.color} onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                    <select className={theme.input} value={newSubject.grade} onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowSubjectModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateSubject} className={theme.buttonPrimary}>Create Subject</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subject Edit Modal */}
        {editingSubject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Subject</h3>
                <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Name</label>
                    <input className={theme.input} value={editingSubject.name || ''} onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Slug</label>
                    <input className={theme.input} value={editingSubject.slug || ''} onChange={(e) => setEditingSubject({ ...editingSubject, slug: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} value={editingSubject.description || ''} onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Icon</label>
                    <input className={theme.input} value={editingSubject.icon || ''} onChange={(e) => setEditingSubject({ ...editingSubject, icon: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Color</label>
                    <input type="color" className="h-10 w-full rounded-lg border border-slate-200 cursor-pointer" value={editingSubject.color || '#6366f1'} onChange={(e) => setEditingSubject({ ...editingSubject, color: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                    <select className={theme.input} value={editingSubject.grade || '6th'} onChange={(e) => setEditingSubject({ ...editingSubject, grade: e.target.value })}>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setEditingSubject(null)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleUpdateSubject} className={theme.buttonPrimary}>Update Subject</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificate Modal */}
        {showCertificateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Generate Certificate</h3>
                <button onClick={() => setShowCertificateModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              
              <div className="flex border-b border-slate-200">
                <button onClick={() => setCertificateTab('single')} className={`flex-1 py-3 text-sm font-bold transition-all ${certificateTab === 'single' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>Single Entry</button>
                <button onClick={() => setCertificateTab('bulk')} className={`flex-1 py-3 text-sm font-bold transition-all ${certificateTab === 'bulk' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}>Bulk Upload (Excel/CSV)</button>
              </div>

              {certificateTab === 'single' ? (
                <>
                  <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Student Name *</label>
                        <input className={theme.input} value={newCertificate.studentName} onChange={(e) => setNewCertificate({ ...newCertificate, studentName: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email *</label>
                        <input type="email" className={theme.input} value={newCertificate.email} onChange={(e) => setNewCertificate({ ...newCertificate, email: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input className={theme.input} value={newCertificate.phoneNumber} onChange={(e) => setNewCertificate({ ...newCertificate, phoneNumber: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">University / College</label>
                        <input className={theme.input} value={newCertificate.university} onChange={(e) => setNewCertificate({ ...newCertificate, university: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Internship Domain *</label>
                        <input className={theme.input} value={newCertificate.internshipDomain} onChange={(e) => setNewCertificate({ ...newCertificate, internshipDomain: e.target.value })} placeholder="e.g. Web Development" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Internship Title *</label>
                        <input className={theme.input} value={newCertificate.internshipTitle} onChange={(e) => setNewCertificate({ ...newCertificate, internshipTitle: e.target.value })} placeholder="e.g. Full Stack Engineer Intern" required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Start Date *</label>
                        <input type="date" className={theme.input} value={newCertificate.startDate} onChange={(e) => setNewCertificate({ ...newCertificate, startDate: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">End Date *</label>
                        <input type="date" className={theme.input} value={newCertificate.endDate} onChange={(e) => setNewCertificate({ ...newCertificate, endDate: e.target.value })} required />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Duration *</label>
                        <input className={theme.input} value={newCertificate.duration} onChange={(e) => setNewCertificate({ ...newCertificate, duration: e.target.value })} placeholder="e.g. 3 Months" required />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                    <button onClick={() => setShowCertificateModal(false)} className={theme.buttonSecondary}>Cancel</button>
                    <button onClick={handleCreateCertificate} className={theme.buttonPrimary}>Generate Certificate</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm flex items-start gap-3">
                      <div className="mt-0.5">ℹ️</div>
                      <div>
                        <p className="font-bold mb-1">Bulk Generation Template</p>
                        <p className="mb-2">Download our sample template and fill it out to generate multiple certificates at once. Required headers: <strong>Name, Email, Phone, College, University, Domain, Title, StartDate, EndDate, Duration</strong>.</p>
                        <a href="data:text/csv;charset=utf-8,Name,Email,Phone,College,University,Domain,Title,StartDate,EndDate,Duration%0AJohn Doe,john@example.com,1234567890,MIT,MIT,Web Development,Full Stack Intern,2023-01-01,2023-03-01,2 Months" download="template.csv" className="text-blue-600 font-bold hover:underline">Download Template</a>
                      </div>
                    </div>

                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Upload File</label>
                    <div 
                      onClick={() => document.getElementById("bulk-file-upload")?.click()}
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${bulkFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50'}`}
                    >
                      <input 
                        id="bulk-file-upload"
                        type="file" 
                        accept=".csv,.xlsx,.xls" 
                        className="hidden" 
                        onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                      />
                      {bulkFile ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-indigo-100 rounded-xl border-2 border-indigo-500 text-indigo-600">
                            <FileText size={24} />
                          </div>
                          <p className="font-bold text-slate-800">{bulkFile.name}</p>
                          <p className="text-xs text-slate-500">{(bulkFile.size / 1024).toFixed(1)} KB</p>
                          <button onClick={(e) => { e.stopPropagation(); setBulkFile(null); }} className="text-xs text-rose-500 font-bold hover:underline mt-2">Remove</button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-3 bg-slate-100 rounded-xl border-2 border-slate-300 text-slate-400">
                            <Upload size={24} />
                          </div>
                          <p className="font-bold text-slate-700">Click to select an Excel or CSV file</p>
                          <p className="text-xs text-slate-400">.xlsx, .xls, .csv</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                    <button onClick={() => setShowCertificateModal(false)} className={theme.buttonSecondary}>Cancel</button>
                    <button onClick={handleBulkUpload} className={theme.buttonPrimary} disabled={!bulkFile}>
                      {loading ? 'Processing...' : 'Upload & Generate Zip'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Shop Item Modal */}
        {showShopItemModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">New Shop Item</h3>
                <button onClick={() => setShowShopItemModal(false)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                  <input className={theme.input} value={newShopItem.title} onChange={(e) => setNewShopItem({ ...newShopItem, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} value={newShopItem.description} onChange={(e) => setNewShopItem({ ...newShopItem, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                    <select className={theme.input} value={newShopItem.type} onChange={(e) => setNewShopItem({ ...newShopItem, type: e.target.value })}>
                      <option value="flashcard_pack">Flashcard Pack</option>
                      <option value="quiz_unlock">Quiz Unlock</option>
                      <option value="power_up">Power Up</option>
                      <option value="boost">Boost</option>
                      <option value="cosmetic">Cosmetic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price (💎)</label>
                    <input type="number" className={theme.input} value={newShopItem.price} onChange={(e) => setNewShopItem({ ...newShopItem, price: parseInt(e.target.value) || 10 })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Icon</label>
                    <input className={theme.input} value={newShopItem.icon} onChange={(e) => setNewShopItem({ ...newShopItem, icon: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={newShopItem.subject} onChange={(e) => setNewShopItem({ ...newShopItem, subject: e.target.value })}>
                      <option value="all">All</option>
                      <option value="science">Science</option>
                      <option value="mathematics">Math</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                    <select className={theme.input} value={newShopItem.grade} onChange={(e) => setNewShopItem({ ...newShopItem, grade: e.target.value })}>
                      <option value="all">All Grades</option>
                      <option value="1">Grade 1</option>
                      <option value="2">Grade 2</option>
                      <option value="3">Grade 3</option>
                      <option value="4">Grade 4</option>
                      <option value="5">Grade 5</option>
                      <option value="6">Grade 6</option>
                      <option value="7">Grade 7</option>
                      <option value="8">Grade 8</option>
                      <option value="9">Grade 9</option>
                      <option value="10">Grade 10</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock</label>
                    <input type="number" className={theme.input} value={newShopItem.stock} onChange={(e) => setNewShopItem({ ...newShopItem, stock: parseInt(e.target.value) || -1 })} placeholder="-1 = unlimited" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setShowShopItemModal(false)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleCreateShopItem} className={theme.buttonPrimary}>Create Item</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Shop Item Edit Modal */}
        {editingShopItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Shop Item</h3>
                <button onClick={() => setEditingShopItem(null)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
               <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                  <input className={theme.input} value={editingShopItem.title || ''} onChange={(e) => setEditingShopItem({ ...editingShopItem, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea className={theme.input} rows={2} value={editingShopItem.description || ''} onChange={(e) => setEditingShopItem({ ...editingShopItem, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                    <select className={theme.input} value={editingShopItem.type || 'power_up'} onChange={(e) => setEditingShopItem({ ...editingShopItem, type: e.target.value })}>
                      <option value="flashcard_pack">Flashcard Pack</option>
                      <option value="quiz_unlock">Quiz Unlock</option>
                      <option value="power_up">Power Up</option>
                      <option value="boost">Boost</option>
                      <option value="cosmetic">Cosmetic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price (💎)</label>
                    <input type="number" className={theme.input} value={editingShopItem.price || 0} onChange={(e) => setEditingShopItem({ ...editingShopItem, price: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Icon</label>
                    <input className={theme.input} value={editingShopItem.icon || ''} onChange={(e) => setEditingShopItem({ ...editingShopItem, icon: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={editingShopItem.subject || 'all'} onChange={(e) => setEditingShopItem({ ...editingShopItem, subject: e.target.value })}>
                      <option value="all">All</option>
                      <option value="science">Science</option>
                      <option value="mathematics">Math</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock</label>
                    <input type="number" className={theme.input} value={editingShopItem.stock ?? -1} onChange={(e) => setEditingShopItem({ ...editingShopItem, stock: parseInt(e.target.value) || -1 })} placeholder="-1 = unlimited" />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setEditingShopItem(null)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleUpdateShopItem} className={theme.buttonPrimary}>Update Item</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Flashcard Edit Modal */}
        {editingFlashcard && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Knowledge Card</h3>
                <button onClick={() => setEditingFlashcard(null)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Question</label>
                  <textarea className={theme.input} rows={2} value={editingFlashcard.question || ''} onChange={(e) => setEditingFlashcard({ ...editingFlashcard, question: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Answer</label>
                  <textarea className={theme.input} rows={2} value={editingFlashcard.answer || ''} onChange={(e) => setEditingFlashcard({ ...editingFlashcard, answer: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={editingFlashcard.subject || 'science'} onChange={(e) => setEditingFlashcard({ ...editingFlashcard, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Difficulty</label>
                    <select className={theme.input} value={editingFlashcard.difficulty || 'Medium'} onChange={(e) => setEditingFlashcard({ ...editingFlashcard, difficulty: e.target.value })}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setEditingFlashcard(null)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleUpdateFlashcard} className={theme.buttonPrimary}>Update Flashcard</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Material Edit Modal */}
        {editingMaterial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">Edit Material</h3>
                <button onClick={() => setEditingMaterial(null)} className="text-slate-400 hover:text-slate-900 transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Title</label>
                  <input className={theme.input} value={editingMaterial.title || ''} onChange={(e) => setEditingMaterial({ ...editingMaterial, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Video URL</label>
                  <input className={theme.input} value={editingMaterial.fileUrl || ''} onChange={(e) => setEditingMaterial({ ...editingMaterial, fileUrl: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Subject</label>
                    <select className={theme.input} value={editingMaterial.subject || 'science'} onChange={(e) => setEditingMaterial({ ...editingMaterial, subject: e.target.value })}>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                    <select className={theme.input} value={editingMaterial.grade || '6th'} onChange={(e) => setEditingMaterial({ ...editingMaterial, grade: e.target.value })}>
                      <option value="6th">6th</option>
                      <option value="7th">7th</option>
                      <option value="8th">8th</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button onClick={() => setEditingMaterial(null)} className={theme.buttonSecondary}>Cancel</button>
                <button onClick={handleUpdateMaterial} className={theme.buttonPrimary}>Update Material</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

export default AdminPanel;
