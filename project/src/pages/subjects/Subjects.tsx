import { Link } from "react-router-dom";
import {
  ArrowRight,
  Play,
  FileText,
  HelpCircle,
  Video,
  BookOpen,
  Download,
  CreditCard,
} from "lucide-react";

const Subjects = () => {
  const subjects = [
    {
      name: "Science",
      slug: "science",
      description:
        "Explore the wonders of physics, chemistry, and biology through interactive experiments and engaging content.",
      color: "from-learnkins-purple-500 to-learnkins-purple-600",
      icon: "🔬",
      topics: ["Physics", "Chemistry", "Environmental Science"],
      materials: {
        videos: 45,
        notes: 30,
        worksheets: 25,
        quizzes: 20,
      },
    },
    {
      name: "Mathematics",
      slug: "mathematics",
      description:
        "Master mathematical concepts from basic arithmetic to advanced problem-solving techniques.",
      color: "from-learnkins-blue-500 to-learnkins-blue-600",
      icon: "📊",
      topics: ["Algebra", "Geometry", "Statistics", "Number Theory"],
      materials: {
        videos: 50,
        notes: 35,
        worksheets: 30,
        quizzes: 25,
      },
    },
    {
      name: "Social Science",
      slug: "social-science",
      description:
        "Understand history, geography, civics, and economics through engaging stories and interactive maps.",
      color: "from-learnkins-green-500 to-learnkins-green-600",
      icon: "🌍",
      topics: ["History", "Geography", "Civics"],
      materials: {
        videos: 40,
        notes: 28,
        worksheets: 22,
        quizzes: 18,
      },
    },
    {
      name: "English",
      slug: "english",
      description:
        "Develop reading, writing, and communication skills through literature and creative exercises.",
      color: "from-learnkins-orange-500 to-learnkins-orange-600",
      icon: "📚",
      topics: ["Grammar", "Literature", "Creative Writing", "Comprehension"],
      materials: {
        videos: 35,
        notes: 25,
        worksheets: 20,
        quizzes: 15,
      },
    },
  ];

  const materialTypes = [
    {
      title: "Video Lessons",
      description:
        "Interactive video content with animations and visual explanations",
      icon: <Video className="h-8 w-8" />,
      color: "bg-learnkins-blue-500",
    },
    {
      title: "Study Notes",
      description:
        "Comprehensive notes covering all important topics and concepts",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-learnkins-green-500",
    },
    {
      title: "Worksheets",
      description:
        "Practice worksheets with problems and exercises for each chapter",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-learnkins-orange-500",
    },
    {
      title: "Flashcards",
      description: "Interactive flashcards for quick review and memorization",
      icon: <CreditCard className="h-8 w-8" />,
      color: "bg-learnkins-purple-500",
    },
    {
      title: "Quiz & Tests",
      description: "Interactive quizzes and tests to assess your understanding",
      icon: <HelpCircle className="h-8 w-8" />,
      color: "bg-learnkins-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section
        className="relative bg-cover bg-center text-white py-20"
        style={{
          backgroundImage: `url(project\public\ChatGPT Image Aug 25, 2025, 06_05_33 PM.png)`, // <-- update path
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>{" "}
        {/* Dark overlay for readability */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">SUBJECTS</h1>
          <div className="flex items-center justify-center space-x-2 text-lg">
            <Link
              to="/"
              className="hover:text-learnkins-blue-400 transition-colors"
            >
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Subjects</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Subject
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover engaging content tailored for middle school students
            </p>
          </div>

          {/* Material Types Overview */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Types of Study Materials
              </h3>
              <p className="text-gray-600">
                Everything you need to excel in your studies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {materialTypes.map((type, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 text-center"
                >
                  <div
                    className={`${type.color} text-white p-2 rounded-lg inline-block mb-3`}
                  >
                    {type.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    {type.title}
                  </h4>
                  <p className="text-gray-600 text-xs">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} p-8 text-white`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{subject.icon}</div>
                    <div className="text-4xl font-bold opacity-20">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{subject.name}</h3>
                  <p className="text-lg opacity-90">{subject.description}</p>
                </div>

                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      Available Materials:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Video className="h-4 w-4 text-learnkins-blue-600" />
                        <span>{subject.materials.videos} Videos</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 text-learnkins-green-600" />
                        <span>{subject.materials.notes} Notes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 text-learnkins-orange-600" />
                        <span>{subject.materials.worksheets} Worksheets</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <HelpCircle className="h-4 w-4 text-learnkins-purple-600" />
                        <span>{subject.materials.quizzes} Quizzes</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={
                        subject.slug === "mathematics"
                          ? "/mathematics"
                          : subject.slug === "science"
                          ? "/science"
                          : subject.slug === "social-science"
                          ? "/social-science"
                          : subject.slug === "english"
                          ? "/english"
                          : `/subjects/${subject.slug}`
                      }
                      className="inline-flex items-center px-6 py-3 bg-learnkins-blue-600 text-white font-semibold rounded-lg hover:bg-learnkins-blue-700 transition-colors duration-300 group-hover:bg-learnkins-blue-700"
                    >
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Showcase Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Study Materials
            </h2>
            <p className="text-xl text-gray-600">
              Access a wide variety of learning resources designed to help you
              succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Videos",
                description:
                  "Engaging video lessons with animations and real-world examples",
                icon: <Video className="h-8 w-8" />,
                color: "bg-learnkins-blue-500",
                count: "200+",
              },
              {
                title: "Study Notes",
                description:
                  "Comprehensive notes covering all important concepts and topics",
                icon: <BookOpen className="h-8 w-8" />,
                color: "bg-learnkins-green-500",
                count: "150+",
              },
              {
                title: "Practice Worksheets",
                description:
                  "Hands-on exercises and problems to reinforce learning",
                icon: <FileText className="h-8 w-8" />,
                color: "bg-learnkins-orange-500",
                count: "100+",
              },
              {
                title: "Interactive Quizzes",
                description:
                  "Test your knowledge with adaptive quizzes and assessments",
                icon: <HelpCircle className="h-8 w-8" />,
                color: "bg-learnkins-purple-500",
                count: "80+",
              },
            ].map((material, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div
                  className={`${material.color} text-white p-3 rounded-lg inline-block mb-4`}
                >
                  {material.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {material.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {material.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {material.count}
                  </span>
                  <Link
                    to={
                      material.title === "Study Notes"
                        ? "/notes"
                        : material.title === "Interactive Quizzes"
                        ? "/quizzes"
                        : "/subjects"
                    }
                    className="text-learnkins-blue-600 hover:text-learnkins-blue-700 font-medium text-sm"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 space-x-4">
            <Link
              to="/flashcards"
              className="inline-flex items-center px-8 py-4 bg-learnkins-purple-600 text-white font-semibold rounded-lg text-lg hover:bg-learnkins-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Try Interactive Flashcards
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center px-8 py-4 bg-learnkins-green-600 text-white font-semibold rounded-lg text-lg hover:bg-learnkins-green-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Access Study Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Study Tips Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Study Tips for Success
            </h2>
            <p className="text-xl text-gray-600">
              Make the most of your learning experience with these helpful tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create a Study Schedule",
                description:
                  "Set aside specific times for each subject to maintain consistency.",
                icon: "⏰",
              },
              {
                title: "Take Regular Breaks",
                description:
                  "Use the Pomodoro technique: 25 minutes study, 5 minutes break.",
                icon: "☕",
              },
              {
                title: "Practice Regularly",
                description:
                  "Complete quizzes and exercises to reinforce your learning.",
                icon: "💪",
              },
            ].map((tip, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subjects;
