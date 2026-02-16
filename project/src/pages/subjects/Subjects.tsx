import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  HelpCircle,
  Video,
  BookOpen,
  CreditCard,
  Beaker,
  Calculator,
  Globe2,
  BookText,
  Clock,
  Coffee,
  Dumbbell,
} from "lucide-react";
import Container from "../../components/common/Container";
import Section from "../../components/common/Section";

const Subjects = () => {
  const subjects = [
    {
      name: "Science",
      slug: "science",
      description:
        "Explore the wonders of physics, chemistry, and biology through interactive experiments and engaging content.",
      color: "from-purple-600 to-purple-500",
      icon: <Beaker className="h-12 w-12" />,
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
      color: "from-blue-600 to-blue-500",
      icon: <Calculator className="h-12 w-12" />,
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
      color: "from-green-600 to-green-500",
      icon: <Globe2 className="h-12 w-12" />,
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
      color: "from-orange-600 to-orange-500",
      icon: <BookText className="h-12 w-12" />,
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section
        padding="lg"
        background="gradient"
        className="relative overflow-hidden"
      >
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <BookOpen className="h-5 w-5 mr-2" />
                <span className="font-medium">Explore All Subjects</span>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Choose Your Subject
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover engaging content tailored for middle school students
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Link
                to="/"
                className="hover:text-white/80 transition-colors"
              >
                Home
              </Link>
              <ArrowRight className="h-5 w-5" />
              <span className="font-semibold">Subjects</span>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Main Content */}
      <Section padding="xl" background="white">
        <Container size="xl">
          {/* Material Types Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Types of Study Materials
              </h3>
              <p className="text-gray-600 text-lg">
                Everything you need to excel in your studies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {materialTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="card card-hover p-6 text-center"
                >
                  <div
                    className={`${type.color} text-white p-3 rounded-xl inline-block mb-4 shadow-lg`}
                  >
                    {type.icon}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    {type.title}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {type.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
                className="card overflow-hidden group shadow-xl"
              >
                <div
                  className={`bg-gradient-to-br ${subject.color} p-8 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                        {subject.icon}
                      </div>
                      <div className="text-5xl font-bold opacity-20">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-3">{subject.name}</h3>
                    <p className="text-lg opacity-90 leading-relaxed">
                      {subject.description}
                    </p>
                  </div>
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
                      className="btn btn-primary w-full group"
                    >
                      Start Learning
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Materials Showcase Section */}
      <Section padding="xl" background="gray">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Study Materials
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access a wide variety of learning resources designed to help you
              succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Videos",
                description:
                  "Engaging video lessons with animations and real-world examples",
                icon: <Video className="h-8 w-8" />,
                color: "bg-gradient-to-br from-blue-600 to-blue-500",
                count: "200+",
              },
              {
                title: "Study Notes",
                description:
                  "Comprehensive notes covering all important concepts and topics",
                icon: <BookOpen className="h-8 w-8" />,
                color: "bg-gradient-to-br from-green-600 to-green-500",
                count: "150+",
              },
              {
                title: "Practice Worksheets",
                description:
                  "Hands-on exercises and problems to reinforce learning",
                icon: <FileText className="h-8 w-8" />,
                color: "bg-gradient-to-br from-orange-600 to-orange-500",
                count: "100+",
              },
              {
                title: "Interactive Quizzes",
                description:
                  "Test your knowledge with adaptive quizzes and assessments",
                icon: <HelpCircle className="h-8 w-8" />,
                color: "bg-gradient-to-br from-purple-600 to-purple-500",
                count: "80+",
              },
            ].map((material, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card card-hover p-6"
              >
                <div
                  className={`${material.color} text-white p-3 rounded-xl inline-block mb-4 shadow-lg`}
                >
                  {material.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {material.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {material.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center group"
                  >
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link to="/flashcards" className="btn btn-secondary group">
              <CreditCard className="mr-2 h-5 w-5" />
              Try Interactive Flashcards
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/notes" className="btn btn-accent group">
              <BookOpen className="mr-2 h-5 w-5" />
              Access Study Notes
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </Container>
      </Section>

      {/* Study Tips Section */}
      <Section padding="xl" background="white">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Study Tips for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Make the most of your learning experience with these helpful tips
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Create a Study Schedule",
                description:
                  "Set aside specific times for each subject to maintain consistency and build a strong learning routine.",
                icon: <Clock className="h-10 w-10" />,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Take Regular Breaks",
                description:
                  "Use the Pomodoro technique: 25 minutes study, 5 minutes break to maintain focus and avoid burnout.",
                icon: <Coffee className="h-10 w-10" />,
                color: "from-orange-500 to-red-500",
              },
              {
                title: "Practice Regularly",
                description:
                  "Complete quizzes and exercises daily to reinforce your learning and build lasting knowledge.",
                icon: <Dumbbell className="h-10 w-10" />,
                color: "from-purple-500 to-pink-500",
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card card-hover p-8 text-center group"
              >
                <div
                  className={`bg-gradient-to-br ${tip.color} text-white p-4 rounded-xl inline-block mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  {tip.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Subjects;
