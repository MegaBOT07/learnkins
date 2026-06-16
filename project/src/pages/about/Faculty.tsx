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

const Faculty = () => {
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

  const getRoleBorder = (role: string) => {
    switch (role.toLowerCase()) {
      case "founder":
        return "border-orange-500";
      case "project member":
        return "border-purple-500";
      default:
        return "border-gray-500";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "founder":
        return "bg-orange-500 text-white";
      case "project member":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm font-bold mb-6">
            <Link to="/" className="hover:text-yellow-400 transition-colors">
              Home
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span className="text-yellow-400">Meet Our Teachers</span>
          </div>
          <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-full mb-4">
            <Award className="h-5 w-5 text-yellow-400 mr-2" />
            <span className="font-bold text-yellow-400 text-sm uppercase tracking-wider">Our Faculty</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Meet Our Teachers
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Meet the passionate team behind Learnkins - dedicated to
            revolutionizing education through technology
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-black mb-4">
              Our Amazing Team
            </h2>
            <p className="text-lg text-gray-600 font-medium max-w-3xl mx-auto">
              We are a team of passionate students from CSE-AI branch, working
              together to create an innovative learning platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className={`group relative bg-white rounded-2xl border-2 ${getRoleBorder(member.role)} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 overflow-hidden`}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <div className="relative p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-black flex items-center justify-center text-white text-2xl font-black border-2 border-black">
                      {member.avatar}
                    </div>
                    <div
                      className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-black border-2 border-black ${getRoleColor(member.role)}`}
                    >
                      {member.role}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-black mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 font-medium mb-1">{member.year}</p>
                  <p className="text-gray-500 text-sm font-bold mb-4">{member.branch}</p>

                  <div className="mb-6">
                    <h4 className="text-xs font-black text-black uppercase tracking-wider mb-3">
                      Specializations:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.specializations.map((spec, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-50 text-black rounded-full text-xs font-bold border-2 border-gray-200"
                        >
                          {getSpecializationIcon(spec)}
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 font-medium">
                    {member.bio}
                  </p>

                  <div className="flex justify-center space-x-3">
                    {member.social.email && (
                      <a
                        href={`mailto:${member.social.email}`}
                        className="p-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-full transition-all"
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
                        className="p-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-full transition-all"
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
                        className="p-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-full transition-all"
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
                        className="p-2 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-full transition-all"
                        title="Website"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {hoveredMember === member.id && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <Award className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                      <p className="text-lg font-black">
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-black mb-4">
              Team Achievements
            </h2>
            <p className="text-gray-600 font-medium">
              Our collective impact in educational technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Users className="h-8 w-8" />, number: "3", label: "Team Members", color: "text-cyan-600", border: "border-cyan-500" },
              { icon: <Code className="h-8 w-8" />, number: "100+", label: "Features Built", color: "text-green-600", border: "border-green-500" },
              { icon: <BookOpen className="h-8 w-8" />, number: "50+", label: "Study Materials", color: "text-purple-600", border: "border-purple-500" },
              { icon: <Target className="h-8 w-8" />, number: "1000+", label: "Students Helped", color: "text-orange-600", border: "border-orange-500" },
            ].map((stat, index) => (
              <div key={index} className={`text-center p-6 bg-white rounded-2xl border-2 ${stat.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                <div className={`mx-auto mb-4 flex justify-center ${stat.color}`}>{stat.icon}</div>
                <div className="text-3xl font-black text-black mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-black mb-4">
            Join Our Mission
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            We're always looking for passionate individuals to join our team and
            help us revolutionize education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-transparent hover:text-white transition-all"
            >
              Get in Touch
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-black rounded-xl hover:bg-white hover:text-black transition-all"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faculty;
