import { useState, useEffect } from "react";
import { useTokens } from "../../context/TokenContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Eye,
  EyeOff,
  BookOpen,
  Brain,
  Target,
  Trophy,
  Search,
  Filter,
  Star,
} from "lucide-react";
import { flashcardAPI } from "../../utils/api";
import { flashcardAiService } from "../../services/flashcardAiService";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  studyCount: number;
  rating: number;
}

const Flashcards = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [newCard, setNewCard] = useState({
    question: "",
    answer: "",
    subject: "science",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    tags: "",
    isPublic: true,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { redeem, canRedeem } = useTokens();
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem("learnkins_unlocked") || "{}";
      return JSON.parse(raw);
    } catch (e) {
      return {};
    }
  });

  const persistUnlocked = (next: Record<string, boolean>) => {
    setUnlocked(next);
    try {
      localStorage.setItem("learnkins_unlocked", JSON.stringify(next));
    } catch (e) { }
  };

  const unlockCard = (cardId: string) => {
    const cost = 5;
    if (!canRedeem(cost)) {
      alert("Not enough tokens to unlock this flashcard.");
      return;
    }
    const ok = redeem(cost, `unlock:flashcard:${cardId}`);
    if (ok) {
      persistUnlocked({ ...unlocked, [cardId]: true });
    } else {
      alert("Failed to redeem tokens.");
    }
  };

  const demoFlashcards: Flashcard[] = [
    { id: "1", question: "What is photosynthesis?", answer: "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce glucose and oxygen.", subject: "science", difficulty: "Medium", tags: ["biology", "plants", "energy"], createdBy: "Dr. Smith", isPublic: true, createdAt: "2024-01-15", studyCount: 245, rating: 4.8 },
    { id: "2", question: "What is the quadratic formula?", answer: "x = (-b ± √(b² - 4ac)) / 2a, where a, b, and c are coefficients of the quadratic equation ax² + bx + c = 0.", subject: "mathematics", difficulty: "Hard", tags: ["algebra", "equations", "formula"], createdBy: "Prof. Johnson", isPublic: true, createdAt: "2024-01-14", studyCount: 189, rating: 4.6 },
    { id: "3", question: "Who was the first President of India?", answer: "Dr. Rajendra Prasad was the first President of India, serving from 1950 to 1962.", subject: "social-science", difficulty: "Easy", tags: ["history", "india", "president"], createdBy: "Ms. Patel", isPublic: true, createdAt: "2024-01-13", studyCount: 156, rating: 4.9 },
    { id: "4", question: "What is a metaphor?", answer: "A metaphor is a figure of speech that compares two unlike things without using 'like' or 'as', stating that one thing is another.", subject: "english", difficulty: "Medium", tags: ["grammar", "literature", "figures of speech"], createdBy: "Mrs. Brown", isPublic: true, createdAt: "2024-01-12", studyCount: 203, rating: 4.7 },
    { id: "5", question: "What is the chemical formula for water?", answer: "H₂O - two hydrogen atoms bonded to one oxygen atom.", subject: "science", difficulty: "Easy", tags: ["chemistry", "molecules", "basic"], createdBy: "Dr. Wilson", isPublic: true, createdAt: "2024-01-11", studyCount: 312, rating: 4.9 },
    { id: "6", question: "What is the area of a circle?", answer: "A = πr², where r is the radius of the circle and π (pi) ≈ 3.14159.", subject: "mathematics", difficulty: "Medium", tags: ["geometry", "area", "circle"], createdBy: "Mr. Davis", isPublic: true, createdAt: "2024-01-10", studyCount: 178, rating: 4.5 },
  ];

  useEffect(() => {
    let mounted = true;
    const fetchFlashcards = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await flashcardAPI.getFlashcards("all");
        const data = res.data?.data || [];
        if (mounted && Array.isArray(data)) {
          const normalized = data.map((card: any) => ({
            id: card._id || card.id || String(Date.now()),
            question: card.question || "",
            answer: card.answer || "",
            subject: card.subject || "",
            difficulty: card.difficulty || "Medium",
            tags: Array.isArray(card.tags) ? card.tags : typeof card.tags === "string" ? card.tags.split(",").map((t: string) => t.trim()) : [],
            createdBy: card.createdBy && typeof card.createdBy === "object" ? card.createdBy.name || card.createdBy._id : card.createdBy || "Unknown",
            isPublic: card.isPublic !== undefined ? card.isPublic : true,
            createdAt: card.createdAt || new Date().toISOString(),
            studyCount: card.studyCount || 0,
            rating: typeof card.rating === "number" ? card.rating : card.rating && card.rating.average !== undefined ? card.rating.average : 0,
          }));
          setFlashcards(normalized);
          setFilteredCards(normalized);
        } else if (mounted) {
          setFlashcards(demoFlashcards);
          setFilteredCards(demoFlashcards);
        }
      } catch (err: any) {
        console.error("Failed to fetch flashcards", err);
        if (mounted) {
          setFlashcards(demoFlashcards);
          setFilteredCards(demoFlashcards);
          setError(err?.response?.data?.message || err.message || "Failed to load flashcards");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFlashcards();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let filtered = flashcards;
    if (searchTerm) {
      filtered = filtered.filter((card) => card.question.toLowerCase().includes(searchTerm.toLowerCase()) || card.answer.toLowerCase().includes(searchTerm.toLowerCase()) || card.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    if (selectedSubject !== "all") {
      filtered = filtered.filter((card) => card.subject === selectedSubject);
    }
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((card) => card.difficulty === selectedDifficulty);
    }
    setFilteredCards(filtered);
  }, [searchTerm, selectedSubject, selectedDifficulty, flashcards]);

  const handleCreateCard = async () => {
    if (!newCard.question.trim() || !newCard.answer.trim()) return;
    const tags = newCard.tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    const cardPayload: any = { question: newCard.question, answer: newCard.answer, subject: newCard.subject, difficulty: newCard.difficulty, tags, isPublic: newCard.isPublic };
    const optimisticCard: Flashcard = { id: Date.now().toString(), question: newCard.question, answer: newCard.answer, subject: newCard.subject, difficulty: newCard.difficulty, tags, createdBy: "You", isPublic: newCard.isPublic, createdAt: new Date().toISOString().split("T")[0], studyCount: 0, rating: 0 };

    try {
      const res = await flashcardAPI.createFlashcard(cardPayload);
      const created: any = res.data?.data || res.data || {};
      if (created && (created._id || created.id)) {
        const normalizedCreated = {
          id: created._id || created.id, question: created.question || optimisticCard.question, answer: created.answer || optimisticCard.answer,
          subject: created.subject || optimisticCard.subject, difficulty: created.difficulty || optimisticCard.difficulty,
          tags: Array.isArray(created.tags) ? created.tags : typeof created.tags === "string" ? created.tags.split(",").map((t: string) => t.trim()) : optimisticCard.tags,
          createdBy: created.createdBy && typeof created.createdBy === "object" ? created.createdBy.name || created.createdBy._id : created.createdBy || optimisticCard.createdBy,
          isPublic: created.isPublic !== undefined ? created.isPublic : optimisticCard.isPublic, createdAt: created.createdAt || optimisticCard.createdAt,
          studyCount: created.studyCount || optimisticCard.studyCount,
          rating: typeof created.rating === "number" ? created.rating : created.rating && created.rating.average !== undefined ? created.rating.average : optimisticCard.rating,
        } as Flashcard;
        setFlashcards([normalizedCreated, ...flashcards]);
        setFilteredCards([normalizedCreated, ...filteredCards]);
      } else {
        setFlashcards([optimisticCard, ...flashcards]);
        setFilteredCards([optimisticCard, ...filteredCards]);
      }
    } catch (err) {
      console.error("Create flashcard failed, using optimistic card", err);
      setFlashcards([optimisticCard, ...flashcards]);
      setFilteredCards([optimisticCard, ...filteredCards]);
    } finally {
      setNewCard({ question: "", answer: "", subject: "science", difficulty: "Medium", tags: "", isPublic: true });
      setActiveTab("browse");
    }
  };

  const generateFlashcardsWithAI = async () => {
    if (!aiTopic.trim()) { setAiError("Please enter a topic"); return; }
    setAiGenerating(true);
    setAiError(null);
    try {
      const response = await flashcardAiService.generateFlashcards(aiTopic);
      if (response.error) { setAiError(response.error); setAiGenerating(false); return; }
      let parsed = [];
      const text = response.message || "";
      try { parsed = JSON.parse(text); } catch {
        const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || null;
        if (codeBlockMatch) { parsed = JSON.parse(codeBlockMatch[1]); } else { throw new Error("Could not parse AI response as JSON"); }
      }
      if (!Array.isArray(parsed)) parsed = [parsed];
      for (const card of parsed) {
        const aiPayload: any = { question: card.question || "", answer: card.answer || "", subject: card.subject || "science", difficulty: card.difficulty || "Medium", tags: ["ai-generated", aiTopic.toLowerCase()], isPublic: true };
        try {
          const res = await flashcardAPI.createFlashcard(aiPayload);
          const created = res.data?.data || {};
          if (created && (created._id || created.id)) {
            const normalized = { id: created._id || created.id, question: created.question, answer: created.answer, subject: created.subject, difficulty: created.difficulty, tags: Array.isArray(created.tags) ? created.tags : [], createdBy: created.createdBy?.name || "AI", isPublic: true, createdAt: created.createdAt || new Date().toISOString().split("T")[0], studyCount: 0, rating: 0 } as Flashcard;
            setFlashcards((prev) => [normalized, ...prev]);
            setFilteredCards((prev) => [normalized, ...prev]);
          }
        } catch (err) { console.error("Failed to create individual flashcard", err); }
      }
      setAiModalOpen(false);
      setAiTopic("");
      setAiGenerating(false);
    } catch (err: any) {
      console.error("AI generation failed", err);
      setAiError(err?.message || "Failed to generate flashcards with AI");
      setAiGenerating(false);
    }
  };

  const startStudyMode = () => {
    if (filteredCards.length === 0) return;
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const nextCard = () => {
    if (currentCardIndex < filteredCards.length - 1) { setCurrentCardIndex(currentCardIndex + 1); setShowAnswer(false); } else { setStudyMode(false); }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) { setCurrentCardIndex(currentCardIndex - 1); setShowAnswer(false); }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-500";
      case "Medium": return "bg-orange-100 text-orange-800 border-orange-500";
      case "Hard": return "bg-red-100 text-red-800 border-red-500";
      default: return "bg-gray-100 text-gray-800 border-gray-500";
    }
  };

  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "science": return "bg-purple-500 border-purple-700";
      case "mathematics": return "bg-blue-500 border-blue-700";
      case "social-science": return "bg-green-500 border-green-700";
      case "english": return "bg-orange-500 border-orange-700";
      default: return "bg-gray-500 border-gray-700";
    }
  };

  const getSubjectBorder = (subject: string) => {
    switch (subject) {
      case "science": return "border-purple-500";
      case "mathematics": return "border-blue-500";
      case "social-science": return "border-green-500";
      case "english": return "border-orange-500";
      default: return "border-gray-500";
    }
  };

  const tabs = [
    { id: "browse", label: "Browse Cards", icon: <BookOpen className="h-5 w-5" /> },
    { id: "create", label: "Create Card", icon: <Plus className="h-5 w-5" /> },
    { id: "study", label: "Study Mode", icon: <Brain className="h-5 w-5" /> },
  ];

  // Study Mode UI
  if (studyMode && filteredCards.length > 0) {
    const currentCard = filteredCards[currentCardIndex];

    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Study Mode</h2>
            <p className="text-gray-600 font-bold">Card {currentCardIndex + 1} of {filteredCards.length}</p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4 border-2 border-black overflow-hidden">
              <div className="bg-black h-full rounded-full transition-all duration-300" style={{ width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` }}></div>
            </div>
          </div>

          <div className={`bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 min-h-[400px] flex flex-col justify-center`}>
            <div className="text-center mb-6">
              <span className={`inline-block px-3 py-1 rounded-lg text-xs font-black border-2 ${getDifficultyColor(currentCard.difficulty)}`}>{currentCard.difficulty}</span>
              <span className={`inline-block ml-2 px-3 py-1 rounded-lg text-xs font-black text-white border-2 ${getSubjectColor(currentCard.subject)}`}>{currentCard.subject}</span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-black text-black mb-4 uppercase">{showAnswer ? "Answer:" : "Question:"}</h3>
              <p className="text-lg text-gray-700 leading-relaxed font-medium">{showAnswer ? currentCard.answer : currentCard.question}</p>
            </div>

            <div className="flex justify-center space-x-4">
              {!showAnswer ? (
                <button onClick={() => setShowAnswer(true)} className="flex items-center px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-purple-500 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)]">
                  <Eye className="h-5 w-5 mr-2" />Show Answer
                </button>
              ) : (
                <div className="flex space-x-4">
                  <button onClick={previousCard} disabled={currentCardIndex === 0} className="flex items-center px-6 py-3 bg-white text-black rounded-xl font-bold border-2 border-black hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <EyeOff className="h-5 w-5 mr-2" />Previous
                  </button>
                  <button onClick={nextCard} className="px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-green-500 transition-all active:scale-95">
                    {currentCardIndex === filteredCards.length - 1 ? "Finish" : "Next →"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-6">
            <button onClick={() => setStudyMode(false)} className="text-gray-600 hover:text-black transition-colors font-bold underline">Exit Study Mode</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Header Section */}
      <section className="relative bg-black text-white border-b-4 border-purple-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center space-x-3 text-sm font-bold uppercase tracking-wider mb-8">
            <Link to="/" className="px-3 py-1.5 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">Home</Link>
            <ArrowRight className="h-4 w-4" />
            <span className="px-3 py-1.5 bg-white text-black rounded-lg border-2 border-white font-black">Flashcards</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 uppercase tracking-tight">Flashcards</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-medium">
            Create, study, and master concepts with interactive flashcards
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Cards", value: flashcards.length.toString(), icon: <BookOpen className="h-7 w-7" />, color: "text-blue-600", border: "border-blue-500", bg: "bg-blue-50" },
              { label: "Study Sessions", value: "1,250+", icon: <Brain className="h-7 w-7" />, color: "text-purple-600", border: "border-purple-500", bg: "bg-purple-50" },
              { label: "Success Rate", value: "94%", icon: <Target className="h-7 w-7" />, color: "text-green-600", border: "border-green-500", bg: "bg-green-50" },
              { label: "Achievements", value: "156", icon: <Trophy className="h-7 w-7" />, color: "text-orange-600", border: "border-orange-500", bg: "bg-orange-50" },
            ].map((stat, index) => (
              <div key={index} className={`text-center p-6 bg-white rounded-2xl border-2 ${stat.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all`}>
                <div className={`${stat.bg} ${stat.color} p-3 rounded-xl border-2 border-black inline-flex mb-3`}>{stat.icon}</div>
                <div className="text-3xl font-black text-black mb-1">{stat.value}</div>
                <div className="text-gray-600 font-bold text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b-2 border-black sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-3 py-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl border-2 font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]"
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

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Browse Tab */}
          {activeTab === "browse" && (
            <div>
              {loading && (
                <div className="py-12">
                  <div className="max-w-3xl mx-auto text-center bg-white rounded-2xl p-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl font-black text-black mb-2 uppercase">Loading flashcards...</div>
                    <div className="text-sm text-gray-500 font-medium">Fetching cards from the server. This may take a moment.</div>
                    {error && (<div className="text-sm text-red-500 mt-4 font-bold">{error}</div>)}
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Browse Flashcards</h2>
                  <p className="text-lg text-gray-600 font-medium">Discover and study from our collection of flashcards</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button type="button" onClick={startStudyMode} disabled={filteredCards.length === 0} className="flex items-center px-5 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]">
                    <Brain className="h-5 w-5 mr-2" />Start Study Mode ({filteredCards.length} cards)
                  </button>
                  <button type="button" onClick={() => setAiModalOpen(true)} className="flex items-center px-4 py-3 border-2 border-black rounded-xl bg-white text-black font-bold hover:bg-yellow-50 transition-all" title="Generate flashcards with AI">
                    <Star className="h-4 w-4 mr-2 text-yellow-500" />Generate with AI
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl border-2 border-black p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" placeholder="Search flashcards..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border-2 border-black rounded-xl font-medium focus:ring-2 focus:ring-black outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Subject</label>
                    <select title="Subject" aria-label="Subject" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                      <option value="all">All Subjects</option>
                      <option value="science">Science</option>
                      <option value="mathematics">Mathematics</option>
                      <option value="social-science">Social Science</option>
                      <option value="english">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Difficulty</label>
                    <select title="Difficulty" aria-label="Difficulty" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                      <option value="all">All Levels</option>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button onClick={() => { setSearchTerm(""); setSelectedSubject("all"); setSelectedDifficulty("all"); }} title="Clear all filters" className="w-full px-4 py-2.5 border-2 border-black text-black rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                      <Filter className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCards.map((card) => (
                  <div key={card.id} className={`bg-white rounded-2xl border-2 ${getSubjectBorder(card.subject)} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border-2 ${getDifficultyColor(card.difficulty)}`}>{card.difficulty}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600 font-bold">{card.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-black mb-2 line-clamp-2">{card.question}</h3>

                    {unlocked[card.id] ? (
                      <p className="text-gray-600 text-sm font-medium mb-4">{card.answer}</p>
                    ) : (
                      <div className="text-gray-600 text-sm mb-4">
                        <div className="mb-2 font-bold">Answer is locked.</div>
                        <button onClick={() => unlockCard(card.id)} className="px-3 py-1.5 bg-black text-white rounded-lg font-bold text-xs border-2 border-black hover:bg-purple-500 transition-all">
                          Unlock Answer (5 💎)
                        </button>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {card.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-bold border border-gray-200">{tag}</span>
                      ))}
                      {card.tags.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg font-bold border border-gray-200">+{card.tags.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 font-bold uppercase tracking-wider">
                      <span>By {card.createdBy}</span>
                      <span>{card.studyCount} studies</span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCards.length === 0 && (
                <div className="text-center py-12">
                  <div className="inline-block p-4 bg-gray-50 rounded-2xl border-2 border-black mb-4"><BookOpen className="h-12 w-12 text-gray-400" /></div>
                  <h3 className="text-xl font-black text-black mb-2">No flashcards found</h3>
                  <p className="text-gray-600 font-medium mb-4">Try adjusting your filters or create a new flashcard</p>
                  <button onClick={() => setActiveTab("create")} className="px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-purple-500 transition-all active:scale-95">Create Flashcard</button>
                </div>
              )}
            </div>
          )}

          {/* Create Tab */}
          {activeTab === "create" && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Create New Flashcard</h2>
                <p className="text-lg text-gray-600 font-medium">Add your own flashcard to help others learn</p>
              </div>

              <div className="max-w-2xl mx-auto">
                {/* AI Modal */}
                {aiModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-black uppercase">Generate with AI</h3>
                        <button onClick={() => setAiModalOpen(false)} className="p-2 hover:bg-black hover:text-white rounded-xl border-2 border-black transition-all">✕</button>
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-4">Enter a topic or keyword and AI will generate a small set of flashcards for you.</p>
                      <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="e.g. Photosynthesis, Pythagorean theorem, World War II" className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium mb-3 focus:ring-2 focus:ring-black outline-none" />
                      {aiError && (<div className="text-sm text-red-500 mb-2 font-bold">{aiError}</div>)}
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => setAiModalOpen(false)} className="px-4 py-2.5 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all">Cancel</button>
                        <button onClick={generateFlashcardsWithAI} disabled={aiGenerating} className="px-4 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold disabled:opacity-50 hover:bg-purple-500 transition-all">
                          {aiGenerating ? "Generating..." : "Generate"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Question *</label>
                      <textarea value={newCard.question} onChange={(e) => setNewCard({ ...newCard, question: e.target.value })} placeholder="Enter your question here..." rows={3} className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium focus:ring-2 focus:ring-black outline-none resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Answer *</label>
                      <textarea value={newCard.answer} onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })} placeholder="Enter the answer here..." rows={4} className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium focus:ring-2 focus:ring-black outline-none resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Subject</label>
                        <select title="Select subject" value={newCard.subject} onChange={(e) => setNewCard({ ...newCard, subject: e.target.value })} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                          <option value="science">Science</option>
                          <option value="mathematics">Mathematics</option>
                          <option value="social-science">Social Science</option>
                          <option value="english">English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Difficulty</label>
                        <select title="Select difficulty level" value={newCard.difficulty} onChange={(e) => setNewCard({ ...newCard, difficulty: e.target.value as "Easy" | "Medium" | "Hard" })} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Tags (comma-separated)</label>
                      <input type="text" value={newCard.tags} onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })} placeholder="e.g., biology, plants, photosynthesis" className="w-full px-4 py-2.5 border-2 border-black rounded-xl font-medium focus:ring-2 focus:ring-black outline-none" />
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="isPublic" checked={newCard.isPublic} onChange={(e) => setNewCard({ ...newCard, isPublic: e.target.checked })} className="h-4 w-4 text-black focus:ring-black border-2 border-black rounded" />
                      <label htmlFor="isPublic" className="ml-2 text-sm text-black font-bold">Make this flashcard public for others to study</label>
                    </div>
                    <div className="flex space-x-4">
                      <button type="button" onClick={handleCreateCard} disabled={!newCard.question.trim() || !newCard.answer.trim()} className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]">
                        Create Flashcard
                      </button>
                      <button type="button" onClick={() => setActiveTab("browse")} className="px-6 py-3 border-2 border-black text-black rounded-xl font-bold hover:bg-black hover:text-white transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Study Tab */}
          {activeTab === "study" && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-black mb-4 uppercase tracking-tight">Study Mode</h2>
                <p className="text-lg text-gray-600 font-medium mb-8">Choose your study preferences and start learning</p>

                <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Subject</label>
                      <select title="Select subject for study mode" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                        <option value="all">All Subjects</option>
                        <option value="science">Science</option>
                        <option value="mathematics">Mathematics</option>
                        <option value="social-science">Social Science</option>
                        <option value="english">English</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-wider">Difficulty</label>
                      <select title="Select difficulty level for study mode" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full px-3 py-2.5 border-2 border-black rounded-xl font-bold focus:ring-2 focus:ring-black outline-none">
                        <option value="all">All Levels</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="pt-4">
                      <p className="text-sm text-gray-600 font-bold mb-4">{filteredCards.length} flashcards available</p>
                      <button onClick={startStudyMode} disabled={filteredCards.length === 0} className="w-full px-6 py-3 bg-black text-white rounded-xl font-bold border-2 border-black hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[3px_3px_0px_0px_rgba(168,85,247,1)]">
                        Start Studying
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Flashcards;
