import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Target, Eye, Heart, Lightbulb, BookOpen, GraduationCap, Globe } from "lucide-react";

const About = () => {
  const milestones = [
    { year: "2024", title: "Platform Launch", description: "LearnKins launched with interactive learning for middle school students." },
    { year: "2024", title: "1000+ Students", description: "Reached over 1,000 active students across India." },
    { year: "2025", title: "Expanded Content", description: "Added 500+ video lessons, quizzes, and educational games." },
    { year: "2025", title: "Community Growth", description: "Launched community features and parental control dashboard." },
  ];

  const values = [
    { icon: <Lightbulb className="h-8 w-8" />, title: "Innovation", description: "Using modern technology to make learning engaging and effective." },
    { icon: <Heart className="h-8 w-8" />, title: "Passion", description: "Dedicated to transforming education for every child." },
    { icon: <Target className="h-8 w-8" />, title: "Excellence", description: "Committed to the highest quality educational content." },
    { icon: <Globe className="h-8 w-8" />, title: "Accessibility", description: "Making quality education available to students everywhere." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center px-4 py-2 bg-purple-500/20 border-2 border-purple-500 rounded-full mb-6">
              <BookOpen className="h-5 w-5 text-purple-400 mr-2" />
              <span className="font-bold text-purple-400 text-sm uppercase tracking-wider">About Us</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Our Story</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              We're on a mission to make middle school education engaging, interactive, and accessible for every student.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold">
              <Link to="/" className="hover:text-purple-400 transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-purple-400">About Us</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 rounded-xl bg-purple-500 text-white flex items-center justify-center mb-5">
                <Eye className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-black mb-4">Our Vision</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                To create a world where every middle school student has access to personalized, engaging, and 
                high-quality education that inspires curiosity, critical thinking, and a lifelong love for learning.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 rounded-xl bg-orange-500 text-white flex items-center justify-center mb-5">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-2xl font-black text-black mb-4">Our Mission</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                To empower students with interactive video lessons, gamified quizzes, and comprehensive study 
                materials that make learning fun while ensuring academic excellence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              The principles that guide everything we do at LearnKins.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border-2 border-black p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                <div className="text-purple-600 flex justify-center mb-4">{v.icon}</div>
                <h3 className="text-lg font-black text-black mb-2">{v.title}</h3>
                <p className="text-gray-600 font-medium text-sm">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4 uppercase tracking-tight">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
              Key milestones in our mission to transform education.
            </p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px h-full w-0.5 bg-black hidden md:block" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                    <div className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
                      <span className="text-purple-600 font-black text-sm">{m.year}</span>
                      <h3 className="text-xl font-black text-black mt-1">{m.title}</h3>
                      <p className="text-gray-600 font-medium text-sm mt-1">{m.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-8 h-8 rounded-full bg-black border-4 border-white shadow-[0_0_0_2px_black] shrink-0 z-10" />
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <GraduationCap className="h-12 w-12 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-black mb-4 tracking-tight">Join Us on This Journey</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Be part of a growing community of students, parents, and educators who are redefining education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center bg-white text-black py-3 px-6 rounded-xl border-2 border-white font-black hover:bg-transparent hover:text-white transition-all">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/team" className="inline-flex items-center justify-center bg-transparent text-white py-3 px-6 rounded-xl border-2 border-white font-black hover:bg-white hover:text-black transition-all">
              Meet Our Team <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;