import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";

const Privacy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: "We collect information you provide directly to us, including name, email address, and grade level when you create an account. We also automatically collect certain technical information such as IP address, browser type, and usage data to improve our platform."
    },
    {
      title: "How We Use Your Information",
      content: "We use your information to provide and improve our educational services, personalize learning experiences, communicate with you about updates, and ensure platform security. We do not sell personal information to third parties."
    },
    {
      title: "Data Storage and Security",
      content: "Your data is stored securely using industry-standard encryption and security protocols. We implement appropriate technical and organizational measures to protect personal information against unauthorized access, alteration, or destruction."
    },
    {
      title: "Children's Privacy",
      content: "LearnKins is designed for middle school students. We take children's privacy seriously and comply with applicable laws regarding the collection of data from minors. Parents can review and control their child's information through the Parental Control dashboard."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to enhance your browsing experience, analyze platform usage, and deliver relevant content. You can control cookie preferences through your browser settings."
    },
    {
      title: "Third-Party Services",
      content: "We may use third-party services for analytics, payment processing, and content delivery. These service providers are contractually bound to protect your data and use it only for the purposes we specify."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You can manage your account settings, opt out of communications, or request data deletion by contacting our support team."
    },
    {
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the platform. Continued use of LearnKins after changes constitutes acceptance of the updated policy."
    },
    {
      title: "Contact Us",
      content: "If you have questions about this Privacy Policy or our data practices, please contact us at support@learnkins.com or through our Contact page."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 border-2 border-orange-500 rounded-full mb-6">
              <Shield className="h-5 w-5 text-orange-400 mr-2" />
              <span className="font-bold text-orange-400 text-sm uppercase tracking-wider">Privacy</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Privacy Policy</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold">
              <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-orange-400">Privacy Policy</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500" />
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

export default Privacy;