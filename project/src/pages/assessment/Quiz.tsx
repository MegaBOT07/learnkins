import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI, progressAPI } from "../../utils/api";
import { useTokens } from "../../context/TokenContext";
import {
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Trophy,
  Star,
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizData {
  id: string;
  title: string;
  subject: string;
  grade: string;
  difficulty: string;
  timeLimit: number;
  questionCount: number;
  description: string;
  participants: number;
  questions: Question[];
}

const Quiz = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { award } = useTokens();

  // Fetch quiz data from backend
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) {
          setError("Quiz ID is required");
          return;
        }

        // For demo quiz IDs, skip API call and use fallback directly
        if (id.startsWith("quiz-")) {
          const demo = getQuizData(id);
          if (demo) {
            setQuiz(demo);
            setTimeLeft(demo.timeLimit * 60);
            setLoading(false);
            return;
          } else {
            setError("Quiz not found");
            setLoading(false);
            return;
          }
        }

        const response = await quizAPI.getQuiz(id);
        // backend returns { success: true, data: quiz }
        const payload = response.data?.data || response.data?.quiz || response.data;
        if (payload) {
          setQuiz(payload);
          setTimeLeft((payload.timeLimit || 0) * 60);
        } else {
          setError("Quiz not found");
        }
      } catch (err: any) {
        console.error("Error fetching quiz:", err);
        // If backend fails and this is a demo id, use fallback
        if (id && id.startsWith("quiz-")) {
          const demo = getQuizData(id);
          if (demo) {
            setQuiz(demo);
            setTimeLeft(demo.timeLimit * 60);
            setLoading(false);
            return;
          }
        }
        setError(err.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // Demo quiz data based on quiz ID (fallback if API fails)
  const getQuizData = (quizId: string): QuizData | null => {
    const quizDataMap: Record<string, QuizData> = {
      "quiz-1": {
        id: "quiz-1",
        title: "Science Quick Quiz",
        subject: "Science",
        grade: "6th",
        difficulty: "Medium",
        timeLimit: 10,
        questionCount: 15,
        description:
          "Test your knowledge of basic scientific concepts and natural phenomena.",
        participants: 2450,
        questions: [
          {
            id: "q1",
            question: "What is the chemical symbol for water?",
            options: ["H2O", "CO2", "NaCl", "O2"],
            correctAnswer: 0,
            explanation:
              "Water's chemical formula is H2O, consisting of two hydrogen atoms and one oxygen atom.",
          },
          {
            id: "q2",
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1,
            explanation:
              "Mars is called the Red Planet due to iron oxide on its surface.",
          },
          {
            id: "q3",
            question: "What is the largest organ in the human body?",
            options: ["Heart", "Liver", "Skin", "Brain"],
            correctAnswer: 2,
            explanation:
              "The skin is the largest organ, covering the entire body.",
          },
          {
            id: "q4",
            question:
              "What is the process by which plants make their own food?",
            options: [
              "Respiration",
              "Photosynthesis",
              "Fermentation",
              "Digestion",
            ],
            correctAnswer: 1,
            explanation:
              "Photosynthesis is the process where plants convert sunlight into food using CO2 and water.",
          },
          {
            id: "q5",
            question: "Which gas do humans breathe out?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
            correctAnswer: 2,
            explanation:
              "Humans exhale carbon dioxide (CO2) as a waste product of cellular respiration.",
          },
        ],
      },
      "quiz-2": {
        id: "quiz-2",
        title: "Math Challenge",
        subject: "Mathematics",
        grade: "7th",
        difficulty: "Hard",
        timeLimit: 15,
        questionCount: 20,
        description:
          "Advanced mathematical problems including algebra and geometry.",
        participants: 1980,
        questions: [
          {
            id: "q1",
            question: "Solve for x: 3x + 5 = 20",
            options: ["3", "4", "5", "6"],
            correctAnswer: 2,
            explanation: "3x + 5 = 20, subtract 5: 3x = 15, divide by 3: x = 5",
          },
          {
            id: "q2",
            question:
              "What is the area of a rectangle with length 8 and width 6?",
            options: ["14", "28", "48", "56"],
            correctAnswer: 2,
            explanation: "Area = length × width = 8 × 6 = 48",
          },
          {
            id: "q3",
            question: "What is 25% of 80?",
            options: ["15", "20", "25", "30"],
            correctAnswer: 1,
            explanation: "25% = 0.25, so 0.25 × 80 = 20",
          },
          {
            id: "q4",
            question: "Solve the equation: 2x² + 3x - 2 = 0",
            options: [
              "x = 1, x = -2",
              "x = 2, x = -1",
              "x = 0.5, x = -2",
              "x = -0.5, x = 2",
            ],
            correctAnswer: 2,
            explanation:
              "Using the quadratic formula: x = (-3 ± √(9 + 16)) / 4 = (-3 ± 5) / 4",
          },
          {
            id: "q5",
            question: "What is the slope of the line y = 2x + 3?",
            options: ["2", "3", "5", "1"],
            correctAnswer: 0,
            explanation: "In y = mx + b, m is the slope, so slope = 2",
          },
        ],
      },
      "quiz-3": {
        id: "quiz-3",
        title: "History Facts",
        subject: "Social Science",
        grade: "6th",
        difficulty: "Easy",
        timeLimit: 8,
        questionCount: 12,
        description:
          "Explore historical events and important facts from different eras.",
        participants: 1750,
        questions: [
          {
            id: "q1",
            question: "Who was the first President of the United States?",
            options: [
              "Thomas Jefferson",
              "John Adams",
              "George Washington",
              "Benjamin Franklin",
            ],
            correctAnswer: 2,
            explanation:
              "George Washington was the first President of the United States, serving from 1789 to 1797.",
          },
          {
            id: "q2",
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correctAnswer: 2,
            explanation:
              "World War II ended in 1945 with the surrender of Germany in May and Japan in September.",
          },
          {
            id: "q3",
            question: "Which ancient wonder was located in Alexandria?",
            options: [
              "Colossus of Rhodes",
              "Lighthouse of Alexandria",
              "Temple of Artemis",
              "Hanging Gardens",
            ],
            correctAnswer: 1,
            explanation:
              "The Lighthouse of Alexandria was one of the Seven Wonders of the Ancient World.",
          },
          {
            id: "q4",
            question: "Who wrote the Declaration of Independence?",
            options: [
              "Benjamin Franklin",
              "Thomas Jefferson",
              "John Adams",
              "George Washington",
            ],
            correctAnswer: 1,
            explanation:
              "Thomas Jefferson was the primary author of the Declaration of Independence.",
          },
          {
            id: "q5",
            question: "Which empire was ruled by the Aztecs?",
            options: ["Inca", "Maya", "Aztec", "Olmec"],
            correctAnswer: 2,
            explanation:
              "The Aztec Empire was a Mesoamerican empire that existed in central Mexico.",
          },
        ],
      },
      "quiz-4": {
        id: "quiz-4",
        title: "English Grammar Test",
        subject: "English",
        grade: "8th",
        difficulty: "Medium",
        timeLimit: 12,
        questionCount: 18,
        description: "Master grammar rules and improve your language skills.",
        participants: 1450,
        questions: [
          {
            id: "q1",
            question: "Which of the following is a proper noun?",
            options: ["city", "country", "London", "river"],
            correctAnswer: 2,
            explanation:
              "London is a proper noun as it's the name of a specific city.",
          },
          {
            id: "q2",
            question: "What is the past tense of 'go'?",
            options: ["goed", "went", "gone", "going"],
            correctAnswer: 1,
            explanation: "The past tense of 'go' is 'went'.",
          },
          {
            id: "q3",
            question: "Which sentence uses correct punctuation?",
            options: [
              "Its time to go.",
              "It's time to go.",
              "Its' time to go.",
              "Its time to go!",
            ],
            correctAnswer: 1,
            explanation:
              "It's is the contraction of 'it is', so 'It's time to go.' is correct.",
          },
          {
            id: "q4",
            question: "What type of word is 'quickly'?",
            options: ["Noun", "Verb", "Adjective", "Adverb"],
            correctAnswer: 3,
            explanation: "Quickly is an adverb as it modifies a verb.",
          },
          {
            id: "q5",
            question: "Which sentence is grammatically correct?",
            options: [
              "Me and him went to the store.",
              "Him and I went to the store.",
              "He and I went to the store.",
              "I and he went to the store.",
            ],
            correctAnswer: 2,
            explanation: "He and I went to the store is grammatically correct.",
          },
        ],
      },
    };

    return quizDataMap[quizId] || quizDataMap["quiz-1"];
  };

  // Use fetched quiz data, fallback to demo data
  const quizData = quiz || (loading === false && !quiz ? getQuizData(id || "quiz-1") : null);

  // Handle quiz submission to backend
  const handleSubmitQuiz = async () => {
    if (!quizData) return;

    try {
      setSubmitting(true);
      const answers = selectedAnswers.map((answer, index) => ({
        questionId: quizData.questions[index].id,
        selectedAnswer: answer,
      }));

      // For demo quizzes, include quizData in submission for backend to save
      const timeTaken = quizData.timeLimit * 60 - timeLeft;

      // Pre-calc local results so we can send them with the request (useful for demo quizzes)
      let precalcPercentage: number | null = null;
      let precalcCorrectCount: number | null = null;
      if (quizData && quizData.questions) {
        let c = 0;
        quizData.questions.forEach((question, index) => {
          const userAnswer = selectedAnswers[index];
          if (userAnswer === question.correctAnswer) c++;
        });
        precalcCorrectCount = c;
        precalcPercentage = (c / quizData.questions.length) * 100;
      }

      // Try to submit to backend
      try {
        const response = await quizAPI.submitQuiz(
          quizData.id,
          answers,
          timeTaken,
          // Include demo quiz data so backend can save it even if quiz doesn't exist in DB
          quizData.id.startsWith("quiz-") ? quizData : undefined,
          precalcPercentage !== null && precalcCorrectCount !== null
            ? { percentage: precalcPercentage, correctCount: precalcCorrectCount }
            : undefined
        );

        if (response.data.success) {
          setScore(response.data.data?.percentage || response.data.score || precalcPercentage || 0);
          setCorrectAnswers(response.data.data?.correctCount || response.data.correctCount || precalcCorrectCount || 0);
          setIncorrectAnswers(
            quizData.questions.length - (response.data.data?.correctCount || response.data.correctCount || precalcCorrectCount || 0)
          );
        }
      } catch (apiErr: any) {
        // If backend fails (404 for demo quizzes, etc.), calculate locally
        if (apiErr.response?.status === 404 || apiErr.response?.status === 400) {
          console.log("Quiz not found on backend, calculating score locally");

          // Calculate score locally
          let localScore = 0;
          let correctCount = 0;

          quizData.questions.forEach((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            if (isCorrect) {
              localScore += 10; // Default points per question
              correctCount++;
            }
          });

          setScore(localScore);
          setCorrectAnswers(correctCount);
          setIncorrectAnswers(quizData.questions.length - correctCount);
        } else {
          throw apiErr;
        }
      }
    } catch (err: any) {
      console.error("Error submitting quiz:", err);
      alert("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isQuizStarted && !isQuizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isQuizStarted, isQuizCompleted]);

  const startQuiz = () => {
    setIsQuizStarted(true);
    setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
    try {
      // award 1 token per question click and save meta to server when authenticated
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      award?.(1, `quiz:select`, { quizId: quizData.id, questionId: currentQuestion.id, index: currentQuestionIndex });
    } catch (e) {
      console.warn('Failed to award token for question selection', e);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuizComplete = async () => {
    setIsQuizCompleted(true);
    await handleSubmitQuiz();
    calculateScore();
  };

  const calculateScore = () => {
    if (!quizData) return;

    let correct = 0;
    let incorrect = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizData.questions[index].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });
    const percentage = (correct / quizData.questions.length) * 100;
    setScore(percentage);
    setCorrectAnswers(correct);
    setIncorrectAnswers(incorrect);

    // Award tokens based on score (10 points = 1 token)
    const tokensEarned = Math.floor(percentage / 10);
    if (tokensEarned > 0) {
      try {
        award(tokensEarned, `quiz-completed:${quizData.id}`, {
          quizTitle: quizData.title,
          score: Math.round(percentage),
          tokensAwarded: tokensEarned,
          correctAnswers: correct
        });
      } catch (err) {
        console.warn('Failed to award tokens for quiz completion', err);
      }
    }

    setShowPopup(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 90) return "Excellent! You're a quiz master!";
    if (score >= 80) return "Great job! You have a solid understanding!";
    if (score >= 60) return "Good work! Keep learning and improving!";
    return "Keep studying! You'll get better with practice!";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 90) return "🏆";
    if (score >= 80) return "🎉";
    if (score >= 60) return "👍";
    return "💪";
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl border-2 border-red-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="text-red-700 text-lg font-bold mb-4">{error || "Failed to load quiz"}</div>
          <button
            onClick={() => navigate("/quizzes")}
            className="px-6 py-2.5 bg-black text-white rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  /* ── Pre-Start Screen ── */
  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-3">
                {quizData.title}
              </h1>
              <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                {quizData.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { value: quizData.questionCount, label: "Questions", border: "border-cyan-500", color: "text-cyan-600" },
                  { value: quizData.timeLimit, label: "Minutes", border: "border-green-500", color: "text-green-600" },
                  { value: quizData.difficulty, label: "Difficulty", border: "border-purple-500", color: "text-purple-600" },
                  { value: quizData.participants.toLocaleString(), label: "Participants", border: "border-orange-500", color: "text-orange-600" },
                ].map((stat, idx) => (
                  <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                    <div className={`text-2xl font-black ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={startQuiz}
                  className="w-full bg-black text-white py-4 px-8 rounded-xl border-2 border-black font-black text-lg hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,206,209,1)]"
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Results Review ── */
  if (showResults) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-center">
              <div className="w-20 h-20 bg-cyan-50 border-2 border-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-cyan-600" />
              </div>
              <h1 className="text-3xl font-black text-black mb-4">
                Quiz Complete!
              </h1>

              <div className="mb-8">
                <div className={`text-6xl font-black mb-4 ${getScoreColor(score)}`}>
                  {Math.round(score)}%
                </div>
                <p className="text-gray-600 font-medium mb-6">
                  {getScoreMessage(score)}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { value: quizData.questions.length, label: "Total Questions", border: "border-cyan-500", color: "text-cyan-600" },
                    { value: correctAnswers, label: "Correct Answers", border: "border-green-500", color: "text-green-600" },
                    { value: incorrectAnswers, label: "Incorrect", border: "border-red-500", color: "text-red-600" },
                    { value: formatTime(quizData.timeLimit * 60 - timeLeft), label: "Time Used", border: "border-purple-500", color: "text-purple-600" },
                  ].map((stat, idx) => (
                    <div key={idx} className={`text-center p-4 bg-white rounded-2xl border-2 ${stat.border} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                      <div className={`text-2xl font-black ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => setShowResults(false)}
                  className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Score Popup ── */
  if (showPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md w-full">
          <div className="p-8 text-center">
            {/* Emoji Badge */}
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 flex items-center justify-center ${score >= 80 ? "border-green-500 bg-green-50" : score >= 60 ? "border-yellow-500 bg-yellow-50" : "border-red-500 bg-red-50"
                }`}
            >
              <div className="text-4xl">
                {getScoreEmoji(score)}
              </div>
            </div>

            {/* Score */}
            <h2 className="text-3xl font-black text-black mb-2">
              Quiz Complete!
            </h2>
            <div className={`text-5xl font-black mb-4 ${getScoreColor(score)}`}>
              {Math.round(score)}%
            </div>
            <p className="text-gray-600 font-medium mb-6">
              {getScoreMessage(score)}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border border-black overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${score >= 80
                      ? "bg-green-500"
                      : score >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            {/* Result Cards */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white rounded-2xl p-4 border-2 border-green-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider">Correct</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border-2 border-red-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-2xl font-black text-red-600">
                  {incorrectAnswers}
                </div>
                <div className="text-xs font-bold text-red-700 uppercase tracking-wider">Incorrect</div>
              </div>
            </div>

            {/* Time Used */}
            <div className="mb-6">
              <div className="bg-white rounded-2xl p-4 border-2 border-cyan-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Time Used
                </div>
                <div className="text-2xl font-black text-cyan-600">
                  {formatTime(quizData.timeLimit * 60 - timeLeft)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowResults(true);
                }}
                className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-white hover:text-black transition-all"
              >
                View Detailed Results
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/quizzes");
                }}
                className="w-full bg-white text-black py-3 px-6 rounded-xl border-2 border-black font-bold hover:bg-gray-50 transition-all"
              >
                Back to Quizzes
              </button>
            </div>

            {/* Confetti for High Scores */}
            {score >= 80 && (
              <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-bounce"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random() * 2}s`,
                    }}
                  >
                    <span className="text-2xl">
                      {
                        ["🎉", "🎊", "🏆", "⭐", "💫"][
                        Math.floor(Math.random() * 5)
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz In Progress ── */
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto pt-4">
        {/* Header */}
        <div className="bg-white rounded-2xl border-2 border-black p-6 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/quizzes")}
                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                aria-label="Back to quizzes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-black text-black">
                  {quizData.title}
                </h1>
                <p className="text-sm text-gray-600 font-bold">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quizData.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 font-black ${timeLeft < 60 ? 'text-red-600' : 'text-black'}`}>
                <Clock className="w-5 h-5" />
                <span className="text-lg">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 border border-black">
            <div
              className="bg-black h-full rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border-2 border-black p-8 mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-xl font-black text-black mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${selectedAnswers[currentQuestionIndex] === index
                    ? "border-black bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
                    : "border-black bg-white text-black hover:bg-gray-50"
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedAnswers[currentQuestionIndex] === index
                        ? "border-white bg-white"
                        : "border-black"
                      }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-2.5 h-2.5 bg-black rounded-full"></div>
                    )}
                  </div>
                  <span className="font-bold">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-xl border-2 border-black font-bold transition-all ${currentQuestionIndex === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-white text-black hover:bg-gray-50"
              }`}
          >
            Previous
          </button>

          <button
            onClick={isLastQuestion ? handleQuizComplete : handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className={`px-6 py-3 rounded-xl border-2 border-black font-bold transition-all ${selectedAnswers[currentQuestionIndex] === undefined
                ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-black text-white hover:bg-white hover:text-black"
              }`}
          >
            {isLastQuestion ? "Finish Quiz" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
