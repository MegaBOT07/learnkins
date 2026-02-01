import React, { useState, useEffect } from "react";
import { useTokens } from "../../context/TokenContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  FileText,
  Calendar,
  Tag,
  Star,
  Filter,
  SortAsc,
  SortDesc,
  FolderOpen,
  Share2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  File,
  Printer,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  fullContent?: string;
  subject: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isPrivate: boolean;
  color: string;
  sourceFile?: string;
}

interface WordFile {
  id: string;
  name: string;
  size: string;
  subject: string;
  description: string;
  uploadDate: string;
}

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "title" | "subject">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showPrivate, setShowPrivate] = useState(true);
  const [activeTab, setActiveTab] = useState<"notes" | "files">("notes");
  const { redeem, canRedeem } = useTokens();
  const [unlockedNotes, setUnlockedNotes] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem('learnkins_unlocked_notes') || '{}'); } catch(e) { return {}; }
  });

  const persistUnlockedNotes = (next: Record<string, boolean>) => {
    setUnlockedNotes(next);
    try { localStorage.setItem('learnkins_unlocked_notes', JSON.stringify(next)); } catch(e){}
  };

  const unlockNote = (noteId: string) => {
    const cost = 10;
    if (!canRedeem(cost)) { alert('Not enough tokens to unlock this note.'); return; }
    const ok = redeem(cost, `unlock:note:${noteId}`);
    if (ok) {
      persistUnlockedNotes({ ...unlockedNotes, [noteId]: true });
    } else {
      alert('Failed to redeem tokens.');
    }
  };

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Art",
    "Music",
    "Physical Education",
  ];

  const colors = [
    "bg-blue-100 border-blue-300",
    "bg-green-100 border-green-300",
    "bg-purple-100 border-purple-300",
    "bg-orange-100 border-orange-300",
    "bg-pink-100 border-pink-300",
    "bg-yellow-100 border-yellow-300",
    "bg-indigo-100 border-indigo-300",
    "bg-red-100 border-red-300",
  ];

  // Load notes data
  useEffect(() => {
    const loadNotes = async () => {
      try {
        // Load Word document notes
        const wordResponse = await fetch("/word-notes.json");
        const demoResponse = await fetch("/demo-notes.json");

        let allNotes: Note[] = [];

        if (wordResponse.ok) {
          const wordNotes = await wordResponse.json();

          // Convert Word notes to Note format
          const convertedWordNotes = wordNotes.map((wordNote: any) => ({
            id: wordNote.id,
            title: wordNote.title,
            content: wordNote.content,
            fullContent: wordNote.fullContent,
            subject: wordNote.subject,
            tags: wordNote.tags,
            createdAt: wordNote.createdAt,
            updatedAt: wordNote.updatedAt,
            isFavorite: wordNote.isFavorite,
            isPrivate: wordNote.isPrivate,
            color: wordNote.color,
            sourceFile: wordNote.sourceFile,
          }));

          allNotes = [...convertedWordNotes];
        }

        if (demoResponse.ok) {
          const demoNotes = await demoResponse.json();
          allNotes = [...allNotes, ...demoNotes];
        }

        // Demo notes for fallback
        const fallbackNotes: Note[] = [
          {
            id: "demo-1",
            title: "Algebra Basics",
            content:
              "Linear equations and quadratic functions are fundamental concepts in algebra. Remember to always check your work and show your steps clearly.",
            subject: "Mathematics",
            tags: ["algebra", "equations", "basics"],
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            isFavorite: true,
            isPrivate: false,
            color: colors[0],
          },
          {
            id: "demo-2",
            title: "Photosynthesis Process",
            content:
              "Photosynthesis is the process by which plants convert light energy into chemical energy. The process involves chlorophyll, carbon dioxide, and water.",
            subject: "Science",
            tags: ["biology", "plants", "photosynthesis"],
            createdAt: "2024-01-14T14:20:00Z",
            updatedAt: "2024-01-14T14:20:00Z",
            isFavorite: false,
            isPrivate: true,
            color: colors[1],
          },
          {
            id: "demo-3",
            title: "Shakespeare's Sonnets",
            content:
              "Shakespeare wrote 154 sonnets, each following a specific rhyme scheme. The themes often explore love, beauty, and the passage of time.",
            subject: "English",
            tags: ["literature", "poetry", "shakespeare"],
            createdAt: "2024-01-13T09:15:00Z",
            updatedAt: "2024-01-13T09:15:00Z",
            isFavorite: true,
            isPrivate: false,
            color: colors[2],
          },
        ];

        // Set notes if we have any loaded
        if (allNotes.length > 0) {
          setNotes(allNotes);
          setFilteredNotes(allNotes);
        } else {
          // Fallback to demo notes if nothing loaded
          setNotes(fallbackNotes);
          setFilteredNotes(fallbackNotes);
        }
      } catch (error) {
        console.error("Error loading notes:", error);
        // Fallback to demo notes
        const fallbackNotes: Note[] = [
          {
            id: "demo-1",
            title: "Algebra Basics",
            content:
              "Linear equations and quadratic functions are fundamental concepts in algebra. Remember to always check your work and show your steps clearly.",
            subject: "Mathematics",
            tags: ["algebra", "equations", "basics"],
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T10:30:00Z",
            isFavorite: true,
            isPrivate: false,
            color: colors[0],
          },
          {
            id: "demo-2",
            title: "Photosynthesis Process",
            content:
              "Photosynthesis is the process by which plants convert light energy into chemical energy. The process involves chlorophyll, carbon dioxide, and water.",
            subject: "Science",
            tags: ["biology", "plants", "photosynthesis"],
            createdAt: "2024-01-14T14:20:00Z",
            updatedAt: "2024-01-14T14:20:00Z",
            isFavorite: false,
            isPrivate: true,
            color: colors[1],
          },
          {
            id: "demo-3",
            title: "Shakespeare's Sonnets",
            content:
              "Shakespeare wrote 154 sonnets, each following a specific rhyme scheme. The themes often explore love, beauty, and the passage of time.",
            subject: "English",
            tags: ["literature", "poetry", "shakespeare"],
            createdAt: "2024-01-13T09:15:00Z",
            updatedAt: "2024-01-13T09:15:00Z",
            isFavorite: true,
            isPrivate: false,
            color: colors[2],
          },
        ];
        setNotes(fallbackNotes);
        setFilteredNotes(fallbackNotes);
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    let filtered = notes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by subject
    if (selectedSubject !== "all") {
      filtered = filtered.filter((note) => note.subject === selectedSubject);
    }

    // Filter by privacy
    if (!showPrivate) {
      filtered = filtered.filter((note) => !note.isPrivate);
    }

    // Sort notes
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "subject":
          comparison = a.subject.localeCompare(b.subject);
          break;
        case "date":
        default:
          comparison =
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredNotes(filtered);
  }, [notes, searchTerm, selectedSubject, sortBy, sortOrder, showPrivate]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      subject: "Mathematics",
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      isPrivate: false,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setSelectedNote(newNote);
    setIsCreating(true);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    if (isCreating) {
      setNotes((prev) => [...prev, selectedNote]);
    } else {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === selectedNote.id
            ? { ...selectedNote, updatedAt: new Date().toISOString() }
            : note
        )
      );
    }

    setIsEditing(false);
    setIsCreating(false);
    setSelectedNote(null);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setIsEditing(false);
      setIsCreating(false);
    }
  };

  const toggleFavorite = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
  };

  const togglePrivate = (noteId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, isPrivate: !note.isPrivate } : note
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Word files data
  const wordFiles: WordFile[] = [
    {
      id: "1",
      name: "(1)Square and Cube.docx",
      size: "430KB",
      subject: "Mathematics",
      description: "Comprehensive study material on squares and cubes",
      uploadDate: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "(2)Arithmetic Expressions.docx",
      size: "215KB",
      subject: "Mathematics",
      description: "Understanding arithmetic expressions and operations",
      uploadDate: "2024-01-14T14:20:00Z",
    },
    {
      id: "3",
      name: "(3)History of Number Systems.docx",
      size: "456KB",
      subject: "Mathematics",
      description: "Historical development of number systems",
      uploadDate: "2024-01-13T09:15:00Z",
    },
    {
      id: "4",
              name: "(4)Quadrilaterals.docx",
      size: "2.2MB",
      subject: "Mathematics",
      description: "Study of quadrilaterals and their properties",
      uploadDate: "2024-01-12T16:45:00Z",
    },
    {
      id: "5",
      name: "(5)Number Play.docx",
      size: "1.4MB",
      subject: "Mathematics",
      description: "Interactive number games and activities",
      uploadDate: "2024-01-11T11:20:00Z",
    },
    {
      id: "6",
      name: "(6)Distributive Property.docx",
      size: "430KB",
      subject: "Mathematics",
      description: "Understanding the distributive property in algebra",
      uploadDate: "2024-01-10T13:30:00Z",
    },
    {
      id: "7",
      name: "(7)Proportional Reasoning.docx",
      size: "431KB",
      subject: "Mathematics",
      description: "Proportional reasoning and ratios",
      uploadDate: "2024-01-09T15:15:00Z",
    },
  ];

  const handleDownload = (fileName: string) => {
    // Create a link element to trigger download
    const link = document.createElement("a");
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (fileName: string) => {
    // Open the file in a new window for printing
    const printWindow = window.open(`/${fileName}`, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div className="absolute inset-0 opacity-10 bg-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Notes</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Interactive Notes
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Create, organize, and manage your study notes with our interactive
            note-taking system
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("notes")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "notes"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Interactive Notes</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("files")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "files"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <File className="h-4 w-4" />
                  <span>Study Files</span>
                </div>
              </button>
            </div>
          </div>

          {activeTab === "notes" && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Notes
                    </h2>
                    <button
                      onClick={createNewNote}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Create new note"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        title="Filter notes by subject"
                      >
                        <option value="all">All Subjects</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                      </label>
                      <div className="flex space-x-2">
                        <select
                          value={sortBy}
                          onChange={(e) =>
                            setSortBy(
                              e.target.value as "date" | "title" | "subject"
                            )
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Sort notes by"
                        >
                          <option value="date">Date</option>
                          <option value="title">Title</option>
                          <option value="subject">Subject</option>
                        </select>
                        <button
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          title={`Sort ${
                            sortOrder === "asc" ? "descending" : "ascending"
                          }`}
                        >
                          {sortOrder === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPrivate(!showPrivate)}
                        className={`p-2 rounded-lg transition-colors ${
                          showPrivate
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                        title={`${showPrivate ? "Hide" : "Show"} private notes`}
                      >
                        {showPrivate ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <span className="text-sm text-gray-600">
                        Show Private
                      </span>
                    </div>
                  </div>

                  {/* Note Count */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      {filteredNotes.length} note
                      {filteredNotes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes List */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`bg-white rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                        selectedNote?.id === note.id
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : note.color
                      }`}
                      onClick={() => setSelectedNote(note)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {note.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                            {unlockedNotes[note.id] ? (
                              note.content
                            ) : (
                              <>
                                <div className="mb-3">Content is locked.</div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); unlockNote(note.id); }}
                                  className="px-3 py-1 bg-blue-600 text-white rounded"
                                >
                                  Unlock Note (10 💎)
                                </button>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(note.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              note.isFavorite
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                            title={
                              note.isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                            }
                          >
                            <Star
                              className={`h-4 w-4 ${
                                note.isFavorite ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePrivate(note.id);
                            }}
                            className={`p-1 rounded transition-colors ${
                              note.isPrivate
                                ? "text-red-500 hover:text-red-600"
                                : "text-gray-400 hover:text-red-500"
                            }`}
                            title={
                              note.isPrivate ? "Make public" : "Make private"
                            }
                          >
                            {note.isPrivate ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{note.subject}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(note.updatedAt)}</span>
                        </span>
                      </div>

                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {note.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {note.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{note.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredNotes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No notes found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || selectedSubject !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first note to get started"}
                    </p>
                    {!searchTerm && selectedSubject === "all" && (
                      <button
                        onClick={createNewNote}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Create Note</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Study Files Section */}
          {activeTab === "files" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Study Files
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <File className="h-4 w-4" />
                    <span>{wordFiles.length} files available</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wordFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <File className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {file.name.replace(".docx", "")}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {file.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{file.subject}</span>
                            </span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDownload(file.name)}
                            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            title="Download file"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                          <button
                            onClick={() => handlePrint(file.name)}
                            className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            title="Print file"
                          >
                            <Printer className="h-4 w-4" />
                            <span>Print</span>
                          </button>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(file.uploadDate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {wordFiles.length === 0 && (
                  <div className="text-center py-12">
                    <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No study files available
                    </h3>
                    <p className="text-gray-600">
                      Upload Word documents to make them accessible here
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Note Editor Modal */}
          {selectedNote && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? "Create New Note" : "Edit Note"}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={saveNote}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      title="Save note"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedNote(null);
                        setIsEditing(false);
                        setIsCreating(false);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Close"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={selectedNote.title}
                          onChange={(e) =>
                            setSelectedNote({
                              ...selectedNote,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter note title..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={selectedNote.content}
                          onChange={(e) =>
                            setSelectedNote({
                              ...selectedNote,
                              content: e.target.value,
                            })
                          }
                          rows={12}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          placeholder="Write your note content here..."
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <select
                          value={selectedNote.subject}
                          onChange={(e) =>
                            setSelectedNote({
                              ...selectedNote,
                              subject: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          title="Select subject for note"
                        >
                          {subjects.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={selectedNote.tags.join(", ")}
                          onChange={(e) =>
                            setSelectedNote({
                              ...selectedNote,
                              tags: e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="tag1, tag2, tag3..."
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedNote.isFavorite}
                            onChange={(e) =>
                              setSelectedNote({
                                ...selectedNote,
                                isFavorite: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Favorite
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedNote.isPrivate}
                            onChange={(e) =>
                              setSelectedNote({
                                ...selectedNote,
                                isPrivate: e.target.checked,
                              })
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">Private</span>
                        </label>
                      </div>

                      {!isCreating && (
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => deleteNote(selectedNote.id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full"
                            title="Delete note"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Note</span>
                          </button>
                        </div>
                      )}
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

export default Notes;
