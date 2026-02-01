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
            question:
              "What is the process by which plants make their own food?",
            options: [
              "Photosynthesis",
              "Respiration",
              "Digestion",
              "Fermentation",
            ],
            correctAnswer: 0,
            explanation:
              "Photosynthesis is the process where plants convert sunlight, water, and carbon dioxide into glucose and oxygen.",
          },
          {
            id: "q2",
            question: "Which of the following is a renewable energy source?",
            options: ["Coal", "Natural Gas", "Solar Power", "Oil"],
            correctAnswer: 2,
            explanation:
              "Solar power is a renewable energy source as it comes from the sun, which is virtually unlimited.",
          },
          {
            id: "q3",
            question: "What is the largest organ in the human body?",
            options: ["Heart", "Brain", "Skin", "Liver"],
            correctAnswer: 2,
            explanation:
              "The skin is the largest organ in the human body, covering approximately 20 square feet.",
          },
          {
            id: "q4",
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1,
            explanation:
              "Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.",
          },
          {
            id: "q5",
            question: "What is the chemical symbol for gold?",
            options: ["Ag", "Au", "Fe", "Cu"],
            correctAnswer: 1,
            explanation:
              "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error || "Failed to load quiz"}</div>
          <button
            onClick={() => navigate("/quizzes")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {quizData.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {quizData.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {quizData.questionCount}
                  </div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {quizData.timeLimit}
                  </div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {quizData.difficulty}
                  </div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {quizData.participants.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Participants</div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={startQuiz}
                  className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold"
                >
                  Start Quiz
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
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

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Quiz Complete!
              </h1>

              <div className="mb-8">
                <div
                  className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}
                >
                  {Math.round(score)}%
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  {getScoreMessage(score)}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {quizData.questions.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {correctAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Correct Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {incorrectAnswers}
                    </div>
                    <div className="text-sm text-gray-600">Incorrect</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatTime(quizData.timeLimit * 60 - timeLeft)}
                    </div>
                    <div className="text-sm text-gray-600">Time Used</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowResults(false)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review Answers
                </button>
                <button
                  onClick={() => navigate("/quizzes")}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
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

  // Exciting Popup Modal
  if (showPopup) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-bounce-in">
          <div className="p-8 text-center">
            {/* Animated Trophy with Glow Effect */}
            <div
              className={`w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse ${
                score >= 80 ? "animate-pulse-glow" : ""
              }`}
            >
              <div className="text-4xl animate-bounce">
                {getScoreEmoji(score)}
              </div>
            </div>

            {/* Score Display with Animation */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2 animate-slide-in">
              Quiz Complete!
            </h2>
            <div
              className={`text-5xl font-bold mb-4 ${getScoreColor(
                score
              )} animate-slide-in`}
            >
              {Math.round(score)}%
            </div>
            <p className="text-lg text-gray-600 mb-6 animate-slide-in">
              {getScoreMessage(score)}
            </p>

            {/* Animated Progress Bar */}
            <div className="mb-6 animate-slide-in">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{Math.round(score)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    score >= 80
                      ? "bg-green-500"
                      : score >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>

            {/* Detailed Results with Animation */}
            <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-in">
              <div className="bg-green-50 rounded-lg p-4 transform hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}
                </div>
                <div className="text-sm text-green-700">Correct</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 transform hover:scale-105 transition-transform">
                <div className="text-2xl font-bold text-red-600">
                  {incorrectAnswers}
                </div>
                <div className="text-sm text-red-700">Incorrect</div>
              </div>
            </div>

            {/* Time Used */}
            <div className="mb-6 animate-slide-in">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-blue-700">
                  Time Used
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatTime(quizData.timeLimit * 60 - timeLeft)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 animate-slide-in">
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowResults(true);
                }}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold transform hover:scale-105"
              >
                View Detailed Results
              </button>
              <button
                onClick={() => {
                  setShowPopup(false);
                  navigate("/quizzes");
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors transform hover:scale-105"
              >
                Back to Quizzes
              </button>
            </div>

            {/* Confetti Effect for High Scores */}
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

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/quizzes")}
                className="text-gray-600 hover:text-gray-800"
                aria-label="Back to quizzes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  {quizData.title}
                </h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of{" "}
                  {quizData.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-red-600">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-gray-800">{option}</span>
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
            className={`px-6 py-3 rounded-lg transition-colors ${
              currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Previous
          </button>

          <button
            onClick={isLastQuestion ? handleQuizComplete : handleNextQuestion}
            disabled={selectedAnswers[currentQuestionIndex] === undefined}
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedAnswers[currentQuestionIndex] === undefined
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
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
