import { Link } from "react-router-dom";
import {
  ArrowRight,
  Download,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  CreditCard,
} from "lucide-react";

const StudyMaterials = () => {
  const subjects = [
    {
      name: "Science",
      slug: "science",
      color: "from-learnkins-purple-500 to-learnkins-purple-600",
      icon: "🔬",
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
      color: "from-learnkins-blue-500 to-learnkins-blue-600",
      icon: "📊",
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
      color: "from-learnkins-green-500 to-learnkins-green-600",
      icon: "🌍",
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
      color: "from-learnkins-orange-500 to-learnkins-orange-600",
      icon: "📚",
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

  const recentMaterials = [
    {
      title: "Photosynthesis - Complete Guide",
      subject: "Science",
      type: "Notes",
      downloads: 1250,
      date: "2024-01-15",
    },
    {
      title: "Quadratic Equations Practice Set",
      subject: "Mathematics",
      type: "Worksheet",
      downloads: 980,
      date: "2024-01-14",
    },
    {
      title: "Indian Freedom Movement",
      subject: "Social Science",
      type: "Video",
      downloads: 1500,
      date: "2024-01-13",
    },
    {
      title: "Grammar Fundamentals Quiz",
      subject: "English",
      type: "Quiz",
      downloads: 750,
      date: "2024-01-12",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-learnkins-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link
              to="/"
              className="hover:text-learnkins-blue-400 transition-colors"
            >
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Study Materials</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Study Materials
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Access comprehensive study materials including videos, notes,
            worksheets, flashcards, and quizzes for all subjects
          </p>
        </div>
      </section>

      {/* Material Types Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Types of Study Materials
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to excel in your studies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {materialTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div
                  className={`${type.color} text-white p-3 rounded-lg inline-block mb-4`}
                >
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
                {type.title === "Flashcards" && (
                  <Link
                    to="/flashcards"
                    className="inline-block mt-3 text-learnkins-purple-600 hover:text-learnkins-purple-700 text-sm font-medium"
                  >
                    Try Flashcards →
                  </Link>
                )}
                {type.title === "Study Notes" && (
                  <Link
                    to="/notes"
                    className="inline-block mt-3 text-learnkins-green-600 hover:text-learnkins-green-700 text-sm font-medium"
                  >
                    Access Notes →
                  </Link>
                )}
                {type.title === "Quiz & Tests" && (
                  <Link
                    to="/quizzes"
                    className="inline-block mt-3 text-learnkins-blue-600 hover:text-learnkins-blue-700 text-sm font-medium"
                  >
                    Take Quizzes →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Study Materials by Subject
            </h2>
            <p className="text-xl text-gray-600">
              Choose your subject to access all study materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} p-8 text-white relative`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl mb-4">{subject.icon}</div>
                      <h3 className="text-3xl font-bold mb-2">
                        {subject.name}
                      </h3>
                    </div>
                    <div className="text-6xl font-bold opacity-20">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-learnkins-blue-50 rounded-lg">
                      <Video className="h-6 w-6 text-learnkins-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-learnkins-blue-600">
                        {subject.materials.videos}
                      </div>
                      <div className="text-sm text-gray-600">Videos</div>
                    </div>
                    <Link
                      to="/notes"
                      className="text-center p-4 bg-learnkins-green-50 rounded-lg hover:bg-learnkins-green-100 transition-colors cursor-pointer"
                    >
                      <BookOpen className="h-6 w-6 text-learnkins-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-learnkins-green-600">
                        {subject.materials.notes}
                      </div>
                      <div className="text-sm text-gray-600">Notes</div>
                    </Link>
                    <div className="text-center p-4 bg-learnkins-orange-50 rounded-lg">
                      <FileText className="h-6 w-6 text-learnkins-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-learnkins-orange-600">
                        {subject.materials.worksheets}
                      </div>
                      <div className="text-sm text-gray-600">Worksheets</div>
                    </div>
                    <Link
                      to="/quizzes"
                      className="text-center p-4 bg-learnkins-purple-50 rounded-lg hover:bg-learnkins-purple-100 transition-colors cursor-pointer"
                    >
                      <HelpCircle className="h-6 w-6 text-learnkins-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-learnkins-purple-600">
                        {subject.materials.quizzes}
                      </div>
                      <div className="text-sm text-gray-600">Quizzes</div>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    <Link
                      to={`/subjects/${subject.slug}`}
                      className="block w-full bg-learnkins-blue-600 text-white text-center py-3 px-6 rounded-lg hover:bg-learnkins-blue-700 transition-colors duration-300 font-semibold"
                    >
                      Access Materials
                    </Link>
                    <Link
                      to="/flashcards"
                      className="block w-full bg-learnkins-purple-600 text-white text-center py-3 px-6 rounded-lg hover:bg-learnkins-purple-700 transition-colors duration-300 font-semibold"
                    >
                      Study Flashcards
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Materials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recently Added Materials
            </h2>
            <p className="text-xl text-gray-600">
              Latest study materials added to our collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentMaterials.map((material, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 bg-learnkins-blue-100 text-learnkins-blue-800 text-xs font-medium rounded">
                    {material.subject}
                  </span>
                  <span className="text-xs text-gray-500">{material.date}</span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {material.title}
                </h3>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">{material.type}</span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="h-4 w-4 mr-1" />
                    {material.downloads}
                  </div>
                </div>

                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-learnkins-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Get Access to All Study Materials
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join our learning platform and get unlimited access to all study
            materials including our new flashcard system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/subjects"
              className="inline-flex items-center px-8 py-4 bg-white text-learnkins-blue-600 font-semibold rounded-lg text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Browse Subjects
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/flashcards"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg text-lg hover:bg-white hover:text-learnkins-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Try Flashcards
              <CreditCard className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterials;
