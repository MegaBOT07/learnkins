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
  Sparkles,
} from "lucide-react";
import Container from "../../components/common/Container";

const Subjects = () => {
  const subjects = [
    {
      name: "Science",
      slug: "science",
      description:
        "Explore the wonders of physics, chemistry, and biology through interactive experiments and engaging content.",
      icon: <Beaker className="h-12 w-12" />,
      borderColor: "border-purple-500",
      accentBg: "bg-purple-500",
      accentText: "text-purple-600",
      lightBg: "bg-purple-50",
      tagStyle: "bg-purple-100 text-purple-700 border-purple-200",
      shadowColor: "rgba(168,85,247,1)",
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
      icon: <Calculator className="h-12 w-12" />,
      borderColor: "border-blue-500",
      accentBg: "bg-blue-500",
      accentText: "text-blue-600",
      lightBg: "bg-blue-50",
      tagStyle: "bg-blue-100 text-blue-700 border-blue-200",
      shadowColor: "rgba(59,130,246,1)",
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
      icon: <Globe2 className="h-12 w-12" />,
      borderColor: "border-green-500",
      accentBg: "bg-green-500",
      accentText: "text-green-600",
      lightBg: "bg-green-50",
      tagStyle: "bg-green-100 text-green-700 border-green-200",
      shadowColor: "rgba(34,197,94,1)",
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
      icon: <BookText className="h-12 w-12" />,
      borderColor: "border-orange-500",
      accentBg: "bg-orange-500",
      accentText: "text-orange-600",
      lightBg: "bg-orange-50",
      tagStyle: "bg-orange-100 text-orange-700 border-orange-200",
      shadowColor: "rgba(249,115,22,1)",
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
      description: "Interactive video content with animations and visual explanations",
      icon: <Video className="h-8 w-8" />,
      borderColor: "border-blue-500",
      accentText: "text-blue-600",
    },
    {
      title: "Study Notes",
      description: "Comprehensive notes covering all important topics and concepts",
      icon: <BookOpen className="h-8 w-8" />,
      borderColor: "border-green-500",
      accentText: "text-green-600",
    },
    {
      title: "Worksheets",
      description: "Practice worksheets with problems and exercises for each chapter",
      icon: <FileText className="h-8 w-8" />,
      borderColor: "border-orange-500",
      accentText: "text-orange-600",
    },
    {
      title: "Flashcards",
      description: "Interactive flashcards for quick review and memorization",
      icon: <CreditCard className="h-8 w-8" />,
      borderColor: "border-purple-500",
      accentText: "text-purple-600",
    },
    {
      title: "Quiz & Tests",
      description: "Interactive quizzes and tests to assess your understanding",
      icon: <HelpCircle className="h-8 w-8" />,
      borderColor: "border-pink-500",
      accentText: "text-pink-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Hero Section */}
      <section className="relative border-b-4 border-black overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <Container size="lg" className="relative z-10 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 bg-white border-2 border-black rounded-full text-sm font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Explore All Subjects</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 uppercase tracking-tighter">
              CHOOSE YOUR
              <br />
              <span className="text-white bg-black px-4">SUBJECT</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-medium mb-8">
              Discover engaging content tailored for middle school students
            </p>
            <div className="flex items-center justify-center space-x-3 text-sm font-bold uppercase tracking-wider">
              <Link
                to="/"
                className="px-4 py-2 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-all"
              >
                Home
              </Link>
              <ArrowRight className="h-4 w-4" />
              <span className="px-4 py-2 bg-black text-white rounded-xl border-2 border-black">Subjects</span>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Material Types Overview */}
      <div className="py-16 border-b-2 border-black">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl font-black text-black mb-3 uppercase tracking-tight">
                Types of Study Materials
              </h3>
              <p className="text-gray-600 text-lg font-medium">
                Everything you need to excel in your studies
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {materialTypes.map((type, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className={`bg-white p-6 text-center rounded-2xl border-2 ${type.borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}
                >
                  <div className={`inline-flex p-3 rounded-xl bg-black text-white mb-4 border-2 border-black`}>
                    {type.icon}
                  </div>
                  <h4 className="text-sm font-black text-black mb-2 uppercase tracking-wider">
                    {type.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">
                    {type.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Subject Cards */}
      <div className="py-20">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -8 }}
                className={`bg-white rounded-2xl border-2 ${subject.borderColor} overflow-hidden group`}
                style={{ boxShadow: `8px 8px 0px 0px rgba(0,0,0,1)` }}
              >
                {/* Subject Header */}
                <div className={`${subject.accentBg} p-8 text-white relative overflow-hidden border-b-2 border-black`}>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="p-3 bg-white/20 rounded-xl border-2 border-white/30">
                        {subject.icon}
                      </div>
                      <div className="text-6xl font-black opacity-20">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-3 uppercase tracking-tight">{subject.name}</h3>
                    <p className="text-lg opacity-90 leading-relaxed font-medium">
                      {subject.description}
                    </p>
                  </div>
                </div>

                {/* Subject Details */}
                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-sm font-black text-black mb-3 uppercase tracking-wider">
                      Topics Covered:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {subject.topics.map((topic, topicIndex) => (
                        <span
                          key={topicIndex}
                          className={`px-3 py-1.5 text-sm font-bold rounded-lg border ${subject.tagStyle}`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-black text-black mb-3 uppercase tracking-wider">
                      Available Materials:
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <Video className="h-4 w-4 text-blue-500" />
                        <span>{subject.materials.videos} Videos</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span>{subject.materials.notes} Notes</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <FileText className="h-4 w-4 text-orange-500" />
                        <span>{subject.materials.worksheets} Worksheets</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
                        <HelpCircle className="h-4 w-4 text-purple-500" />
                        <span>{subject.materials.quizzes} Quizzes</span>
                      </div>
                    </div>
                  </div>

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
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white font-bold rounded-xl border-2 border-black hover:bg-white hover:text-black transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] group"
                  >
                    Start Learning
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Materials Showcase Section */}
      <div className="py-20 bg-black text-white border-y-4 border-black">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase tracking-tight">
              Comprehensive Study Materials
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Access a wide variety of learning resources designed to help you
              succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Interactive Videos",
                description: "Engaging video lessons with animations and real-world examples",
                icon: <Video className="h-8 w-8" />,
                borderColor: "border-blue-500",
                accentColor: "text-blue-400",
                count: "200+",
                link: "/subjects",
              },
              {
                title: "Study Notes",
                description: "Comprehensive notes covering all important concepts and topics",
                icon: <BookOpen className="h-8 w-8" />,
                borderColor: "border-green-500",
                accentColor: "text-green-400",
                count: "150+",
                link: "/notes",
              },
              {
                title: "Practice Worksheets",
                description: "Hands-on exercises and problems to reinforce learning",
                icon: <FileText className="h-8 w-8" />,
                borderColor: "border-orange-500",
                accentColor: "text-orange-400",
                count: "100+",
                link: "/subjects",
              },
              {
                title: "Interactive Quizzes",
                description: "Test your knowledge with adaptive quizzes and assessments",
                icon: <HelpCircle className="h-8 w-8" />,
                borderColor: "border-purple-500",
                accentColor: "text-purple-400",
                count: "80+",
                link: "/quizzes",
              },
            ].map((material, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`bg-white text-black p-6 rounded-2xl border-2 ${material.borderColor} shadow-[6px_6px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.4)] transition-all`}
              >
                <div className="inline-flex p-3 rounded-xl bg-black text-white mb-4 border-2 border-black">
                  {material.icon}
                </div>
                <h3 className="text-xl font-black text-black mb-2">
                  {material.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed font-medium">
                  {material.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                  <span className="text-3xl font-black text-black">
                    {material.count}
                  </span>
                  <Link
                    to={material.link}
                    className="text-black font-bold text-sm flex items-center group hover:translate-x-1 transition-transform"
                  >
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-12">
            <Link
              to="/flashcards"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl border-2 border-white hover:bg-transparent hover:text-white transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
            >
              <CreditCard className="h-5 w-5" />
              Try Interactive Flashcards
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-xl border-2 border-white hover:bg-white hover:text-black transition-all active:scale-95"
            >
              <BookOpen className="h-5 w-5" />
              Access Study Notes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </div>

      {/* Study Tips Section */}
      <div className="py-20">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-4 uppercase tracking-tight">
              Study Tips for Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
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
                borderColor: "border-cyan-500",
                iconColor: "text-cyan-600",
              },
              {
                title: "Take Regular Breaks",
                description:
                  "Use the Pomodoro technique: 25 minutes study, 5 minutes break to maintain focus and avoid burnout.",
                icon: <Coffee className="h-10 w-10" />,
                borderColor: "border-orange-500",
                iconColor: "text-orange-600",
              },
              {
                title: "Practice Regularly",
                description:
                  "Complete quizzes and exercises daily to reinforce your learning and build lasting knowledge.",
                icon: <Dumbbell className="h-10 w-10" />,
                borderColor: "border-pink-500",
                iconColor: "text-pink-600",
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`bg-white p-8 text-center rounded-2xl border-2 ${tip.borderColor} shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group`}
              >
                <div className="inline-flex p-4 rounded-xl bg-black text-white mb-4 border-2 border-black group-hover:scale-110 transition-transform">
                  {tip.icon}
                </div>
                <h3 className="text-xl font-black text-black mb-3 uppercase tracking-tight">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Subjects;
