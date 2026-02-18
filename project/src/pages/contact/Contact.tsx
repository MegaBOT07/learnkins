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
      border: "border-cyan-500",
      color: "text-cyan-600",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      details: ["support@brillix.com", "info@brillix.com"],
      description: "We'll respond within 24 hours",
      border: "border-yellow-500",
      color: "text-yellow-600",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Address",
      details: ["Skit Campus", "Jagatpura, Jaipur, Rajasthan (302002)"],
      description: "Visit our office",
      border: "border-green-500",
      color: "text-green-600",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Support Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM",
      ],
      description: "Sunday: Closed",
      border: "border-purple-500",
      color: "text-purple-600",
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
      border: "border-cyan-500",
      color: "text-cyan-600",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Parental Controls",
      description: "Help with monitoring, time limits, and content filtering",
      border: "border-green-500",
      color: "text-green-600",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Technical Issues",
      description: "Login problems, video playback, or app-related issues",
      border: "border-orange-500",
      color: "text-orange-600",
    },
  ];

  const inputClass = "w-full px-4 py-3 border-2 border-black rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all";
  const labelClass = "block text-xs font-black text-black uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-cyan-500/20 border-2 border-cyan-500 rounded-full mb-6">
              <MessageCircle className="h-5 w-5 text-cyan-400 mr-2" />
              <span className="font-bold text-cyan-400 text-sm uppercase tracking-wider">Get in Touch</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
              Contact Us
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
              We're here to help! Get in touch with our support team for any
              questions or assistance
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm font-bold">
              <Link to="/" className="hover:text-cyan-400 transition-colors">
                Home
              </Link>
              <ArrowRight className="h-4 w-4" />
              <span className="text-cyan-400">Contact</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />
      </section>

      {/* Support Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-black mb-2">
              How Can We Help?
            </h2>
            <p className="text-gray-600 font-medium">
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
                transition={{ delay: index * 0.1 }}
                className={`p-8 text-center rounded-2xl border-2 ${category.border} bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all cursor-pointer`}
              >
                <div className={`${category.color} flex justify-center mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-lg font-black text-black mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm font-medium">{category.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <h2 className="text-2xl font-black text-black mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={inputClass}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className={labelClass}>
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="parental">Parental Controls</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className={inputClass}
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className={`${inputClass} resize-none`}
                    placeholder="Please provide details about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-black text-base hover:bg-white hover:text-black transition-all flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-black text-black mb-2">
                  Get in Touch
                </h2>
                <p className="text-gray-600 font-medium">
                  Have questions about LearnKins? We're here to help! Reach out to
                  us through any of the following channels.
                </p>
              </div>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-2xl border-2 ${info.border} p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`${info.color} mt-1`}>
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-black text-black mb-1">
                          {info.title}
                        </h3>
                        <div className="space-y-0.5">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-sm text-gray-700 font-medium">
                              {detail}
                            </p>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-black text-black mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 font-medium max-w-2xl mx-auto">
              Find quick answers to common questions about LearnKins
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-3 mb-2">
                  <HelpCircle className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                  <h3 className="text-base font-black text-black">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 font-medium leading-relaxed ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 font-medium mb-4">
              Can't find what you're looking for?
            </p>
            <Link
              to="/community"
              className="inline-flex items-center bg-black text-white py-3 px-6 rounded-xl border-2 border-black font-black hover:bg-white hover:text-black transition-all shadow-[3px_3px_0px_0px_rgba(0,206,209,1)]"
            >
              Visit Community Forum
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-500" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black mb-4 tracking-tight">
              Ready to Start Learning?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already excelling with LearnKins's
              interactive learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/subjects"
                className="inline-flex items-center justify-center bg-white text-black py-3 px-6 rounded-xl border-2 border-white font-black hover:bg-transparent hover:text-white transition-all"
              >
                Explore Subjects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/team"
                className="inline-flex items-center justify-center bg-transparent text-white py-3 px-6 rounded-xl border-2 border-white font-black hover:bg-white hover:text-black transition-all"
              >
                Meet Our Team
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
