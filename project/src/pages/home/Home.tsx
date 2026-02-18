import { Link } from "react-router-dom";
import {
  Play,
  BookOpen,
  Users,
  Trophy,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Rocket,
  Brain,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";
import { useGame } from "../../context/GameContext";
import { motion } from "framer-motion";
import Section from "../../components/common/Section";
import Container from "../../components/common/Container";

const Home = () => {
  // @ts-ignore
  const { userProgress } = useGame();

  const features = [
    {
      icon: <Play className="h-8 w-8 text-white" />,
      title: "Interactive Video Lessons",
      description:
        "Engaging video content that makes learning fun and memorable",
      color: "blue",
      borderColor: "border-blue-500",
      shadowColor: "shadow-blue-900/20",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-white" />,
      title: "Comprehensive Study Materials",
      description: "Complete notes and resources for all subjects",
      color: "pink",
      borderColor: "border-pink-500",
      shadowColor: "shadow-pink-900/20",
    },
    {
      icon: <Users className="h-8 w-8 text-white" />,
      title: "Expert Teachers",
      description: "Learn from the best educators in the field",
      color: "green",
      borderColor: "border-green-500",
      shadowColor: "shadow-green-900/20",
    },
    {
      icon: <Trophy className="h-8 w-8 text-white" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with fun and challenging quizzes",
      color: "purple",
      borderColor: "border-purple-500",
      shadowColor: "shadow-purple-900/20",
    },
  ];

  const subjects = [
    {
      name: "Science",
      icon: <Brain className="h-8 w-8 text-black group-hover:text-white transition-colors" />,
      description: "Explore the wonders of science",
      borderColor: "border-cyan-500",
      hoverBg: "hover:bg-cyan-500",
    },
    {
      name: "Mathematics",
      icon: <Target className="h-8 w-8 text-black group-hover:text-white transition-colors" />,
      description: "Master mathematical concepts",
      borderColor: "border-orange-500",
      hoverBg: "hover:bg-orange-500",
    },
    {
      name: "Social Science",
      icon: <Users className="h-8 w-8 text-black group-hover:text-white transition-colors" />,
      description: "Understand society and culture",
      borderColor: "border-green-500",
      hoverBg: "hover:bg-green-500",
    },
    {
      name: "English",
      icon: <BookOpen className="h-8 w-8 text-black group-hover:text-white transition-colors" />,
      description: "Enhance language skills",
      borderColor: "border-pink-500",
      hoverBg: "hover:bg-pink-500",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Students", icon: <Users className="h-8 w-8 text-blue-400" />, borderColor: "border-blue-500" },
    { number: "500+", label: "Video Lessons", icon: <Play className="h-8 w-8 text-pink-400" />, borderColor: "border-pink-500" },
    { number: "50+", label: "Expert Teachers", icon: <Award className="h-8 w-8 text-yellow-400" />, borderColor: "border-yellow-500" },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-8 w-8 text-green-400" />, borderColor: "border-green-500" },
  ];

  const benefits = [
    "Personalized learning paths",
    "24/7 access to materials",
    "Progress tracking & analytics",
    "Interactive assessments",
    "Gamified learning experience",
    "Certificate on completion",
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Modern Hero Section - Colorful Accents */}
      <section className="relative overflow-hidden pt-20 pb-0 lg:pt-32 border-b-4 border-black">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Floating Elements - Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 opacity-30"
          >
            <BookOpen className="h-24 w-24 text-blue-500 stroke-[1.5]" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-10 opacity-30"
          >
            <Trophy className="h-32 w-32 text-yellow-500 stroke-[1.5]" />
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 right-1/4 opacity-20"
          >
            <Star className="h-16 w-16 text-pink-500 stroke-[1.5]" />
          </motion.div>
        </div>

        <Container>
          <div className="relative z-10 py-12 lg:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-6 py-2 bg-yellow-100 border-2 border-black rounded-full text-sm font-black uppercase tracking-widest mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-crosshair"
              >
                <Sparkles className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-900">Transform Your Learning Journey</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none tracking-tighter">
                LEARN SMARTER
                <br />
                <span className="text-white bg-black px-4 decoration-wavy underline decoration-blue-400">
                  ACHIEVE FASTER
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-gray-800 font-medium mb-12 max-w-3xl mx-auto leading-relaxed border-l-4 border-black pl-6 text-left md:text-center md:border-l-0 md:pl-0">
                Experience interactive learning that adapts to your pace. Master every subject with engaging videos, quizzes, and expert guidance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link
                  to="/subjects"
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl text-lg border-2 border-black hover:bg-blue-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                </Link>
                <Link
                  to="/games-quiz"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-xl text-lg border-2 border-black hover:bg-gray-50 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                >
                  <Play className="h-5 w-5 fill-current text-pink-500" />
                  Explore Games
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 flex flex-wrap justify-center items-center gap-8 text-sm font-bold uppercase tracking-wider"
              >
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-green-500 transition-colors">
                  <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2.5} />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-blue-500 transition-colors">
                  <CheckCircle className="h-5 w-5 text-blue-500" strokeWidth={2.5} />
                  <span>500+ Lessons</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-purple-500 transition-colors">
                  <CheckCircle className="h-5 w-5 text-purple-500" strokeWidth={2.5} />
                  <span>95% Success Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <Section padding="lg" background="white">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 uppercase tracking-tight">
              Why Choose LearnKins?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Experience a revolutionary approach to learning with cutting-edge tools and expert guidance
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className={`relative bg-white p-8 rounded-2xl border-2 hover:border-4 ${feature.borderColor} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 h-full flex flex-col items-center text-center`}>
                <div className={`inline-flex p-4 rounded-xl bg-${feature.color}-500 text-white mb-6 transform group-hover:scale-110 active:rotate-12 transition-all duration-300 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <div className="py-20 bg-black text-white border-y-4 border-black">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-black mb-6 border-2 ${stat.borderColor} group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.2)]`}>
                  <div className="transform group-hover:rotate-12 transition-transform">
                    {/* Clone element to add stroke styling if needed, or just rely on CSS */}
                    {stat.icon}
                  </div>
                </div>
                <div className="text-5xl lg:text-6xl font-black mb-2 tracking-tighter">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </div>

      {/* Subjects Section */}
      <Section padding="lg" background="white">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6 uppercase tracking-tight">
              Explore Our Subjects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Comprehensive learning materials designed for excellence in every subject
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/subjects/${subject.name.toLowerCase()}`}
                className="block group"
              >
                <div className={`relative bg-white rounded-2xl p-8 border-2 ${subject.borderColor} ${subject.hoverBg} hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]`}>

                  <div className="relative z-10 text-center">
                    <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 inline-block p-4 rounded-full border-2 border-black bg-white group-hover:border-white">
                      {subject.icon}
                    </div>
                    <h3 className="text-2xl font-black mb-3">{subject.name}</h3>
                    <p className="text-gray-600 group-hover:text-white/90 text-sm font-medium">{subject.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <div className="py-24 bg-gray-50 border-y-2 border-black">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-black mb-8 leading-tight">
                EVERYTHING YOU NEED TO EXCEL
              </h2>
              <p className="text-xl text-gray-700 mb-10 font-medium">
                Our platform is designed with your success in mind, offering comprehensive tools and resources.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center border-2 border-black group-hover:bg-black transition-colors">
                      <CheckCircle className="h-5 w-5 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-black font-bold text-lg group-hover:translate-x-2 transition-transform">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-3xl p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
                <div className="bg-gray-100 rounded-xl p-6 space-y-8 border-2 border-dashed border-gray-400">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-black text-3xl font-black">Level Up!</div>
                      <div className="text-gray-600 font-bold">Track your progress</div>
                    </div>
                  </div>

                  <div className="h-4 bg-white rounded-full overflow-hidden border-2 border-black relative">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-green-500 relative"
                    >
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cGF0aCBkPSJNLTExLTExTDExIFoxIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-20"></div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: <Star className="h-6 w-6 text-yellow-500" />, label: "Points", value: "2,450" },
                      { icon: <Award className="h-6 w-6 text-purple-500" />, label: "Badges", value: "12" },
                      { icon: <Rocket className="h-6 w-6 text-orange-500" />, label: "Streak", value: "15" },
                    ].map((item, i) => (
                      <div key={i} className="text-center p-3 bg-white rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform">
                        <div className="mb-2 flex justify-center">{item.icon}</div>
                        <div className="text-black text-xl font-black">{item.value}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Final CTA Section */}
      <Section padding="lg" background="white">
        <div className="relative bg-black rounded-3xl overflow-hidden shadow-[12px_12px_0px_0px_#3B82F6] border-4 border-black">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative py-24 px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
                Ready to Start Your<br />Learning Journey?
              </h2>
              <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto font-medium">
                Join thousands of students who are already excelling with LearnKins
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 px-8 py-5 bg-blue-600 text-white font-black rounded-xl text-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[4px_4px_0px_0px_#ffffff] border-2 border-white hover:bg-blue-500"
                >
                  Get Started Free
                  <Zap className="h-6 w-6 fill-white" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 px-8 py-5 bg-transparent border-2 border-white text-white font-bold rounded-xl text-xl hover:bg-white hover:text-black transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
