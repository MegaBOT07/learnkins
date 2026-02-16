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
  const { userProgress, addExperience, unlockAchievement, updateProgress } =
    useGame();

  const features = [
    {
      icon: <Play className="h-8 w-8" />,
      title: "Interactive Video Lessons",
      description:
        "Engaging video content that makes learning fun and memorable",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Comprehensive Study Materials",
      description: "Complete notes and resources for all subjects",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Teachers",
      description: "Learn from the best educators in the field",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with fun and challenging quizzes",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const subjects = [
    {
      name: "Science",
      gradient: "from-purple-500 to-purple-600",
      icon: <Brain className="h-8 w-8" />,
      description: "Explore the wonders of science",
    },
    {
      name: "Mathematics",
      gradient: "from-blue-500 to-blue-600",
      icon: <Target className="h-8 w-8" />,
      description: "Master mathematical concepts",
    },
    {
      name: "Social Science",
      gradient: "from-green-500 to-green-600",
      icon: <Users className="h-8 w-8" />,
      description: "Understand society and culture",
    },
    {
      name: "English",
      gradient: "from-orange-500 to-orange-600",
      icon: <BookOpen className="h-8 w-8" />,
      description: "Enhance language skills",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Active Students", icon: <Users /> },
    { number: "500+", label: "Video Lessons", icon: <Play /> },
    { number: "50+", label: "Expert Teachers", icon: <Award /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp /> },
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
    <div className="min-h-screen">{/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 opacity-20"
          >
            <BookOpen className="h-16 w-16" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-20 right-10 opacity-20"
          >
            <Trophy className="h-20 w-20" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/2 right-1/4 opacity-10"
          >
            <Sparkles className="h-12 w-12" />
          </motion.div>
        </div>

        <Container>
          <div className="relative py-24 lg:py-32 text-center">
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20"
              >
                <Sparkles className="h-4 w-4" />
                <span>Transform Your Learning Journey</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Learn Smarter,
                <br />
                <span className="bg-gradient-to-r from-yellow-200 to-orange-300 bg-clip-text text-transparent">
                  Achieve Faster
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Experience interactive learning that adapts to your pace. Master every subject with engaging videos, quizzes, and expert guidance.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/subjects"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/games-quiz"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold rounded-xl text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Play className="h-5 w-5" />
                  Explore Games
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 flex flex-wrap justify-center items-center gap-6 text-sm text-blue-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>500+ Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>95% Success Rate</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Container>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose LearnKins?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                style={{ background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})` }}
              />
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Stats Section */}
      <Section padding="lg" background="gradient">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg text-blue-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Subjects Section */}
      <Section padding="lg" background="white">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Explore Our Subjects
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <div className={`relative bg-gradient-to-br ${subject.gradient} rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full blur-2xl" />
                  
                  <div className="relative z-10">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {subject.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{subject.name}</h3>
                    <p className="text-white/90 text-sm">{subject.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Benefits Section */}
      <Section padding="lg" background="gray">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 mb-8">
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
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium text-lg">{benefit}</span>
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
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">Level Up!</div>
                    <div className="text-white/80 text-sm">Track your progress</div>
                  </div>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: <Star className="h-5 w-5" />, label: "Points", value: "2,450" },
                    { icon: <Award className="h-5 w-5" />, label: "Badges", value: "12" },
                    { icon: <Rocket className="h-5 w-5" />, label: "Streak", value: "15" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="text-white mb-1 flex justify-center">{item.icon}</div>
                      <div className="text-white text-lg font-bold">{item.value}</div>
                      <div className="text-white/70 text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section padding="lg" background="white">
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>

          <div className="relative py-20 px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                Join thousands of students who are already excelling with LearnKins
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Get Started Free
                  <Zap className="h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white font-semibold rounded-xl text-lg hover:bg-white/20 transition-all duration-300"
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
