import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Code,
  PenTool,
  Lightbulb,
  Mail,
  Linkedin,
  Github,
  Globe,
  Award,
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  year: string;
  branch: string;
  specializations: string[];
  avatar: string;
  bio: string;
  social: {
    email?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

const Team = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "Mohit Lalwani",
      role: "Founder",
      year: "2nd Year B.Tech",
      branch: "CSE-AI",
      specializations: ["Technical", "Web Development"],
      avatar: "ML",
      bio: "Passionate about creating innovative educational technology solutions. Leading the technical vision and development of Learnkins platform.",
      social: {
        email: "mohit.lalwani@learnkins.com",
        linkedin: "mohit-lalwani",
        github: "mohitlalwani",
        website: "mohitlalwani.dev",
      },
    },
    {
      id: 2,
      name: "Vaibhavi Shukla",
      role: "Project Member",
      year: "2nd Year B.Tech",
      branch: "CSE-AI",
      specializations: ["Content Writing", "Decision Consultor"],
      avatar: "VS",
      bio: "Dedicated to creating engaging educational content and providing strategic insights for the platform's growth and user experience.",
      social: {
        email: "vaibhavi.shukla@learnkins.com",
        linkedin: "vaibhavi-shukla",
        github: "vaibhavishukla",
      },
    },
    {
      id: 3,
      name: "Harsh Saini",
      role: "Project Member",
      year: "2nd Year B.Tech",
      branch: "CSE-AI",
      specializations: ["Market Researcher", "Ideator"],
      avatar: "HS",
      bio: "Focused on market analysis and innovative ideation to ensure Learnkins meets the evolving needs of students and educators.",
      social: {
        email: "harsh.saini@learnkins.com",
        linkedin: "harsh-saini",
        github: "harshsaini",
      },
    },
  ];

  const getSpecializationIcon = (spec: string) => {
    switch (spec.toLowerCase()) {
      case "technical":
      case "web development":
        return <Code className="h-4 w-4" />;
      case "content writing":
        return <PenTool className="h-4 w-4" />;
      case "decision consultor":
        return <Target className="h-4 w-4" />;
      case "market researcher":
        return <TrendingUp className="h-4 w-4" />;
      case "ideator":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "founder":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "project member":
        return "bg-gradient-to-r from-blue-500 to-purple-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-20">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-lg mb-6">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-5 w-5" />
            <span>Meet Our Team</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Meet Our Teachers
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the passionate team behind Learnkins - dedicated to
            revolutionizing education through technology
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Amazing Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a team of passionate students from CSE-AI branch, working
              together to create an innovative learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                {/* Card Header */}
                <div className="relative p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {member.avatar}
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor(
                        member.role
                      )}`}
                    >
                      {member.role}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 mb-1">{member.year}</p>
                  <p className="text-gray-500 text-sm mb-4">{member.branch}</p>

                  {/* Specializations */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Specializations:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.specializations.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium"
                        >
                          {getSpecializationIcon(spec)}
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-3">
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors duration-200"
                        title="Email"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.linkedin && (
                      <a
                        href={`https://linkedin.com/in/${member.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors duration-200"
                        title="LinkedIn"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.github && (
                      <a
                        href={`https://github.com/${member.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-gray-800 text-gray-600 hover:text-white rounded-full transition-colors duration-200"
                        title="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.social.website && (
                      <a
                        href={`https://${member.social.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 rounded-full transition-colors duration-200"
                        title="Website"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {hoveredMember === member.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <Award className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-semibold">
                        Connect with {member.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Team Achievements
            </h2>
            <p className="text-gray-600">
              Our collective impact in educational technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Users className="h-8 w-8" />,
                number: "3",
                label: "Team Members",
                color: "text-blue-600",
              },
              {
                icon: <Code className="h-8 w-8" />,
                number: "100+",
                label: "Features Built",
                color: "text-green-600",
              },
              {
                icon: <BookOpen className="h-8 w-8" />,
                number: "50+",
                label: "Study Materials",
                color: "text-purple-600",
              },
              {
                icon: <Target className="h-8 w-8" />,
                number: "1000+",
                label: "Students Helped",
                color: "text-orange-600",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`mx-auto mb-4 ${stat.color}`}>{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always looking for passionate individuals to join our team and
            help us revolutionize education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Team;
