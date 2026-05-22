import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Send,
  Heart,
  ExternalLink,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Logo from "../common/Logo";
import Container from "../common/Container";

const XIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMsg, setNewsletterMsg] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterStatus("loading");
    try {
      const res = await fetch("http://localhost:5000/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (data.success) {
        setNewsletterStatus("success");
        setNewsletterMsg("Subscribed successfully!");
        setNewsletterEmail("");
      } else {
        setNewsletterStatus("error");
        setNewsletterMsg(data.message || "Something went wrong");
      }
    } catch {
      setNewsletterStatus("error");
      setNewsletterMsg("Failed to subscribe. Try again later.");
    }
    setTimeout(() => {
      setNewsletterStatus("idle");
      setNewsletterMsg("");
    }, 4000);
  };

  const footerLinks = {
    subjects: [
      { name: "Science", path: "/science", hoverColor: "hover:text-cyan-500" },
      { name: "Mathematics", path: "/maths", hoverColor: "hover:text-orange-500" },
      { name: "Social Science", path: "/social-science", hoverColor: "hover:text-green-500" },
      { name: "English", path: "/english", hoverColor: "hover:text-pink-500" },
    ],
    resources: [
      { name: "Study Materials", path: "/study-materials", hoverColor: "hover:text-blue-500" },
      { name: "Video Lessons", path: "/subjects", hoverColor: "hover:text-purple-500" },
      { name: "Practice Quizzes", path: "/games-quiz", hoverColor: "hover:text-orange-500" },
      { name: "Team", path: "/team", hoverColor: "hover:text-green-500" },
    ],
    support: [
      { name: "Help Center", path: "/contact", hoverColor: "hover:text-pink-500" },
      { name: "Community", path: "/community", hoverColor: "hover:text-blue-500" },
      { name: "Parental Control", path: "/parental-control", hoverColor: "hover:text-purple-500" },
      { name: "Contact Us", path: "/contact", hoverColor: "hover:text-cyan-500" },
    ],
    company: [
      { name: "About Us", path: "/about", hoverColor: "hover:text-green-500" },
      { name: "Privacy Policy", path: "/privacy", hoverColor: "hover:text-orange-500" },
      { name: "Terms of Service", path: "/terms", hoverColor: "hover:text-blue-500" },
      { name: "Careers", path: "/careers", hoverColor: "hover:text-pink-500" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com/learnkins", name: "Facebook", hoverBg: "hover:bg-blue-600 hover:border-blue-600" },
    { icon: <XIcon />, href: "https://x.com/learnkins", name: "X (Twitter)", hoverBg: "hover:bg-black hover:border-black" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com/learnkins", name: "Instagram", hoverBg: "hover:bg-pink-500 hover:border-pink-500" },
    { icon: <Youtube className="h-5 w-5" />, href: "https://youtube.com/@learnkins", name: "YouTube", hoverBg: "hover:bg-red-600 hover:border-red-600" },
  ];

  return (
    <footer className="bg-white text-black border-t-4 border-black">
      {/* Main Footer Content */}
      <Container size="xl" className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo size="md" />
            </Link>
            <p className="text-gray-600 mb-6 leading-relaxed font-medium">
              Empowering middle school students with interactive learning
              experiences that make education engaging, fun, and effective.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+917878888924" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">+91-7878888924</span>
              </a>
              <a href="mailto:support@learnkins.com" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">support@learnkins.com</span>
              </a>
              <a href="https://maps.google.com/?q=Skit+Campus+Jaipur+Rajasthan+India" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">
                  Skit Campus, Jaipur, Rajasthan, India
                </span>
              </a>
              <a href="https://linkedin.com/in/mohit-lalwani-3b8437273" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">Founder - Mohit Lalwani</span>
              </a>
            </div>
          </div>

          {/* Quick Links: Subjects, Resources, Support, Company */}
          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Subjects</h3>
            <ul className="space-y-3">
              {footerLinks.subjects.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Newsletter Signup */}
      <div className="border-t-2 border-black">
        <Container size="xl" className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">Stay Updated</h3>
              <p className="text-gray-600 font-medium">Subscribe to our newsletter for the latest educational content and updates.</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-gray-400 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              />
              <button
                type="submit"
                disabled={newsletterStatus === "loading"}
                className="px-8 py-3 bg-purple-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all inline-flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
              >
                {newsletterStatus === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : newsletterStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                {newsletterStatus === "success" ? "Done" : "Subscribe"}
              </button>
              {newsletterMsg && (
                <p className={`text-sm font-bold ${newsletterStatus === "success" ? "text-green-600" : "text-red-600"}`}>{newsletterMsg}</p>
              )}
            </form>
          </div>
        </Container>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black text-white">
        <Container size="xl" className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm font-bold">
              &copy; {currentYear} LearnKins. All rights reserved. Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500 fill-red-500" /> for students.
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl border-2 border-white text-white flex items-center justify-center ${social.hoverBg} hover:text-white hover:scale-110 active:scale-95 transition-all duration-200`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
