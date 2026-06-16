// Additional sections for the Home page - Import and use in Home.tsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Section from "./Section";
import {
  Play,
  Trophy,
  Award,
  TrendingUp,
  Star,
  CheckCircle,
} from "lucide-react";

// Features Section Component
export const FeaturesSection = ({ features }: any) => (
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
      {features.map((feature: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          whileHover={{ y: -8 }}
          className="group relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
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
);

// Stats Section Component
export const StatsSection = ({ stats }: any) => (
  <Section padding="lg" background="gradient">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat: any, index: number) => (
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
);

// Subjects Section Component
export const SubjectsSection = ({ subjects }: any) => (
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
      {subjects.map((subject: any, index: number) => (
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
              {/* Animated Background Effect */}
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
);

// Benefits Section Component
export const BenefitsSection = ({ benefits }: any) => (
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
          {benefits.map((benefit: string, index: number) => (
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
                { icon: <Star />, label: "Points", value: "2,450" },
                { icon: <Award />, label: "Badges", value: "12" },
                { icon: <TrendingUp />, label: "Streak", value: "15" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-white mb-1">{item.icon}</div>
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
);

// CTA Section Component
export const CTASection = () => (
  <Section padding="lg" background="white">
    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 rounded-3xl overflow-hidden">
      {/* Animated Background */}
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
              <Play className="h-5 w-5" />
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
);
