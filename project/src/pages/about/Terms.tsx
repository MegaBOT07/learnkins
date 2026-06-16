import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, FileText } from "lucide-react";

const Terms = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing or using LearnKins, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time."
    },
    {
      title: "Account Registration",
      content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your login credentials. Parental accounts may have additional verification requirements."
    },
    {
      title: "User Responsibilities",
      content: "Users agree to use the platform for lawful educational purposes only. Prohibited activities include sharing inappropriate content, attempting to breach security, harassing other users, or violating any applicable laws."
    },
    {
      title: "Parental Consent",
      content: "Parents or guardians are responsible for supervising their children's use of LearnKins. By creating a student account, you confirm that you have obtained parental consent where required by applicable law."
    },
    {
      title: "Intellectual Property",
      content: "All content on LearnKins, including videos, quizzes, study materials, and software, is the intellectual property of LearnKins or its licensors. Users may not reproduce, distribute, or create derivative works without permission."
    },
    {
      title: "Subscription and Payments",
      content: "Certain features may require payment. All fees are non-refundable unless otherwise stated. We reserve the right to change pricing with notice. Subscription renewals are processed automatically unless cancelled."
    },
    {
      title: "Limitation of Liability",
      content: "LearnKins is provided 'as is' without warranties. We are not liable for indirect, incidental, or consequential damages arising from platform use. Our total liability is limited to the amount paid by you in the past 12 months."
    },
    {
      title: "Termination",
      content: "We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or disrupt the platform experience for others. Users may delete their accounts at any time."
    },
    {
      title: "Governing Law",
      content: "These terms are governed by the laws of India. Any disputes shall be resolved through arbitration in Jaipur, Rajasthan. Both parties agree to submit to the personal jurisdiction of the courts in Jaipur."
    },
    {
      title: "Contact Information",
      content: "For questions about these terms, contact us at support@learnkins.com or visit our Contact page. We aim to respond to all inquiries within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 border-2 border-blue-500 rounded-full mb-6">
              <FileText className="h-5 w-5 text-blue-400 mr-2" />
              <span className="font-bold text-blue-400 text-sm uppercase tracking-wider">Terms</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Terms of Service</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Please read these terms carefully before using LearnKins.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold">
              <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-blue-400">Terms of Service</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 font-medium mb-10">Last updated: January 2025</p>
          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="text-xl font-black text-black mb-3">{s.title}</h2>
                <p className="text-gray-700 font-medium leading-relaxed">{s.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Terms;