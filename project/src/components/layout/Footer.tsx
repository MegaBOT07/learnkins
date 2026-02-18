import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Heart,
} from "lucide-react";
import Logo from "../common/Logo";
import Container from "../common/Container";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    subjects: [
      { name: "Science", path: "/subjects/science", hoverColor: "hover:text-cyan-500" },
      { name: "Mathematics", path: "/subjects/mathematics", hoverColor: "hover:text-orange-500" },
      { name: "Social Science", path: "/subjects/social-science", hoverColor: "hover:text-green-500" },
      { name: "English", path: "/subjects/english", hoverColor: "hover:text-pink-500" },
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
    { icon: <Facebook className="h-5 w-5" />, href: "#", name: "Facebook", hoverBg: "hover:bg-blue-600 hover:border-blue-600" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter", hoverBg: "hover:bg-sky-500 hover:border-sky-500" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", name: "Instagram", hoverBg: "hover:bg-pink-500 hover:border-pink-500" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", name: "YouTube", hoverBg: "hover:bg-red-600 hover:border-red-600" },
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
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">+91-7878888924</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-pink-500 group-hover:border-pink-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">support@learnkins.com</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">
                  Skit Campus, Jaipur, Rajasthan, India
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-black flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-500 group-hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none">
                  <span className="text-sm">👤</span>
                </div>
                <span className="text-gray-700 font-medium group-hover:translate-x-1 transition-transform">Founder - Mohit Lalwani</span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Subjects</h3>
            <ul className="space-y-3">
              {footerLinks.subjects.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-black text-black mb-5 uppercase tracking-wider border-b-2 border-black pb-2">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className={`text-gray-600 font-bold ${link.hoverColor} transition-all duration-200 hover:translate-x-2 inline-flex items-center gap-1`}
                  >
                    {link.name}
                  </Link>
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
              <h3 className="text-2xl font-black text-black mb-2 uppercase tracking-tight">
                Stay Updated
              </h3>
              <p className="text-gray-600 font-medium">
                Subscribe to our newsletter for the latest educational content
                and updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3 bg-white border-2 border-black rounded-xl text-black placeholder-gray-400 font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              />
              <button className="px-8 py-3 bg-purple-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all inline-flex items-center justify-center gap-2 uppercase tracking-wider">
                Subscribe
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Footer */}
      <div className="bg-black text-white">
        <Container size="xl" className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm font-bold">
              © {currentYear} LearnKins. All rights reserved. Made with{" "}
              <Heart className="inline h-4 w-4 text-red-500 fill-red-500" />{" "}
              for students.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
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
