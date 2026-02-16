import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  HelpCircle,
  Users,
  Clock,
} from "lucide-react";
import Container from "../../components/common/Container";
import Section from "../../components/common/Section";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
    });
  };

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      details: ["+91-7878888924", "+91-83060 96190"],
      description: "Mon-Fri 9AM-6PM IST",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["support@brillix.com", "info@brillix.com"],
      description: "We'll respond within 24 hours",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: ["Skit Campus", "Jagatpura, Jaipur, Rajasthan (302002)"],
      description: "Visit our office",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Support Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
      description: "Sunday: Closed",
    },
  ];

  const faqItems = [
    {
      question: "How do I reset my child's password?",
      answer:
        "You can reset your child's password from the Parental Control dashboard or contact our support team for assistance.",
    },
    {
      question: "What subjects are available for middle school students?",
      answer:
        "We offer comprehensive courses in Science, Mathematics, Social Science, and English, all aligned with middle school curriculum standards.",
    },
    {
      question: "Can I track my child's learning progress?",
      answer:
        "Yes! Our Parental Control dashboard provides detailed insights into your child's learning activities, progress, and achievements.",
    },
    {
      question: "Are the educational games safe for children?",
      answer:
        "Absolutely! All our games are designed specifically for educational purposes and are completely safe and age-appropriate for middle school students.",
    },
    {
      question: "How do I set time limits for my child?",
      answer:
        "Time limits can be configured in the Parental Control section. You can set daily limits, break reminders, and bedtime restrictions.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, we have mobile apps for both iOS and Android devices. You can download them from the respective app stores.",
    },
  ];

  const supportCategories = [
    {
      icon: <HelpCircle className="h-8 w-8" />,
      title: "General Support",
      description:
        "Questions about features, account setup, or general inquiries",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Parental Controls",
      description: "Help with monitoring, time limits, and content filtering",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Technical Issues",
      description: "Login problems, video playback, or app-related issues",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section padding="lg" background="gradient" className="relative overflow-hidden">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white relative z-10"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <MessageCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Get in Touch</span>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              We're here to help! Get in touch with our support team for any
              questions or assistance
            </p>
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Link to="/" className="hover:text-white/80 transition-colors">
                Home
              </Link>
              <ArrowRight className="h-5 w-5" />
              <span className="font-semibold">Contact</span>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Support Categories */}
      <Section padding="lg" background="white">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How Can We Help?
            </h2>
            <p className="text-lg text-gray-600">
              Choose the category that best describes your inquiry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card card-hover p-8 text-center cursor-pointer group"
              >
                <div className="text-blue-600 bg-gradient-to-br from-blue-100 to-blue-50 p-4 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form and Info */}
      <Section padding="xl" background="gray">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="input"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="parental">Parental Controls</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input resize-none"
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full group"
                >
                  <Send className="h-5 w-5 mr-2" />
                  <span>Send Message</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Have questions about LearnKins? We're here to help! Reach out to
                  us through any of the following channels.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="card card-hover p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="text-blue-600 bg-gradient-to-br from-blue-100 to-blue-50 p-3 rounded-xl shadow-sm">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-700">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section padding="xl" background="white">
        <Container size="xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about LearnKins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="card card-hover p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed ml-9">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4 text-lg">
              Can't find what you're looking for?
            </p>
            <Link to="/community" className="btn btn-primary group">
              Visit Community Forum
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section padding="xl" background="gradient">
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of students who are already excelling with LearnKins's
              interactive learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/subjects" className="btn btn-primary bg-white text-blue-600 hover:bg-gray-100 group shadow-xl">
                Explore Subjects
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/team" className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-blue-600 group">
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </Container>
      </Section>
    </div>
  );
};

export default Contact;
