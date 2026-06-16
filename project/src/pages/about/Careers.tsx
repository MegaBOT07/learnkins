import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Users, Trophy, Zap, Mail } from "lucide-react";

const Careers = () => {
  const openings = [
    {
      title: "Full Stack Developer",
      type: "Full-time",
      location: "Jaipur, Rajasthan",
      description: "Build and maintain our educational platform using React, Node.js, and MongoDB."
    },
    {
      title: "Content Creator - Science & Math",
      type: "Full-time",
      location: "Remote",
      description: "Create engaging video lessons and study materials for middle school students."
    },
    {
      title: "UI/UX Designer",
      type: "Full-time",
      location: "Jaipur, Rajasthan",
      description: "Design intuitive and delightful learning experiences for students and parents."
    },
    {
      title: "Curriculum Developer - English",
      type: "Part-time",
      location: "Remote",
      description: "Develop comprehensive English curriculum aligned with middle school standards."
    },
    {
      title: "Community Manager",
      type: "Full-time",
      location: "Remote",
      description: "Grow and nurture our learning community, manage parent and student engagement."
    },
    {
      title: "Data Analyst",
      type: "Full-time",
      location: "Jaipur, Rajasthan",
      description: "Analyze learning patterns and provide insights to improve educational outcomes."
    }
  ];

  const perks = [
    { icon: <Zap className="h-6 w-6" />, title: "Fast-paced Environment", description: "Work with a passionate team moving at startup speed." },
    { icon: <Users className="h-6 w-6" />, title: "Great Team Culture", description: "Collaborative, supportive, and fun work environment." },
    { icon: <Trophy className="h-6 w-6" />, title: "Growth Opportunities", description: "Learn, grow, and take ownership of impactful projects." },
    { icon: <Briefcase className="h-6 w-6" />, title: "Flexible Work", description: "Remote-friendly with flexible working hours." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center px-4 py-2 bg-pink-500/20 border-2 border-pink-500 rounded-full mb-6">
              <Briefcase className="h-5 w-5 text-pink-400 mr-2" />
              <span className="font-bold text-pink-400 text-sm uppercase tracking-wider">Careers</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Join Our Team</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Help us shape the future of education. Build, create, and make an impact.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold">
              <Link to="/" className="hover:text-pink-400 transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-pink-400">Careers</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500" />
      </section>

      {/* Perks */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Why Join LearnKins?</h2>
            <p className="text-gray-600 font-medium">Be part of something meaningful.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border-2 border-black p-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-pink-600 flex justify-center mb-3">{p.icon}</div>
                <h3 className="text-base font-black text-black mb-1">{p.title}</h3>
                <p className="text-gray-600 text-sm font-medium">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 bg-gray-50 border-y-2 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Open Positions</h2>
            <p className="text-gray-600 font-medium">Find your role and apply today.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {openings.map((job, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-black text-black">{job.title}</h3>
                  <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">{job.type}</span>
                </div>
                <p className="text-sm text-gray-500 font-bold mb-2">{job.location}</p>
                <p className="text-gray-600 font-medium text-sm mb-4">{job.description}</p>
                <a href="mailto:careers@learnkins.com" className="inline-flex items-center text-sm font-black text-pink-600 hover:text-pink-800 transition-colors">
                  Apply Now <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="absolute top-0 left-0 right-0 h-1 bg-pink-500" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <Mail className="h-10 w-10 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Don't See the Right Role?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            We're always looking for talented people. Send your resume to careers@learnkins.com
          </p>
          <a href="mailto:careers@learnkins.com" className="inline-flex items-center justify-center bg-white text-black py-3 px-8 rounded-xl border-2 border-white font-black hover:bg-transparent hover:text-white transition-all">
            Send Your Resume <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Careers;