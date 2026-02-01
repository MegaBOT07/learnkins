import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    subjects: [
      { name: "Science", path: "/subjects/science" },
      { name: "Mathematics", path: "/subjects/mathematics" },
      { name: "Social Science", path: "/subjects/social-science" },
      { name: "English", path: "/subjects/english" },
    ],
    resources: [
      { name: "Study Materials", path: "/study-materials" },
      { name: "Video Lessons", path: "/subjects" },
      { name: "Practice Quizzes", path: "/games-quiz" },
      { name: "Team", path: "/team" },
    ],
    support: [
      { name: "Help Center", path: "/contact" },
      { name: "Community", path: "/community" },
      { name: "Parental Control", path: "/parental-control" },
      { name: "Contact Us", path: "/contact" },
    ],
    company: [
      { name: "About Us", path: "/about" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Careers", path: "/careers" },
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: "#", name: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, href: "#", name: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, href: "#", name: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, href: "#", name: "YouTube" },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img
                src="/Screenshot 2025-07-01 135146.png"
                alt="LearnKins"
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering middle school students with interactive learning
              experiences that make education engaging, fun, and effective.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-learnkins-blue-400" />
                <span className="text-gray-300">+91-7878888924</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-learnkins-blue-400" />
                <span className="text-gray-300">support@learnkins.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-learnkins-blue-400" />
                <span className="text-gray-300">
                  Skit Campus , Jaipur , Rajasthan , India
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-learnkins-blue-400" />
                <span className="text-gray-300">Founder - Mohit Lalwani</span>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Subjects</h3>
            <ul className="space-y-2">
              {footerLinks.subjects.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-learnkins-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-learnkins-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-learnkins-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-learnkins-blue-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300">
                Subscribe to our newsletter for the latest educational content
                and updates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-learnkins-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-learnkins-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {currentYear} LearnKins. All rights reserved. Made with ❤️ for
              students.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-learnkins-blue-400 transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
