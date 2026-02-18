import { sendEmail } from '../utils/sendEmail.js';

// Contact message model (simple in-memory storage for demo)
let contactMessages = [];

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;

    // Create contact message
    const contactMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      category,
      status: 'new',
      createdAt: new Date()
    };

    contactMessages.push(contactMessage);

    // Send email notification to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'admin@learnkins.com',
        subject: `New Contact Form Submission: ${subject}`,
        message: `
          New contact form submission received:
          
          Name: ${name}
          Email: ${email}
          Category: ${category}
          Subject: ${subject}
          
          Message:
          ${message}
        `
      });
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
    }

    // Send confirmation email to user
    try {
      await sendEmail({
        email,
        subject: 'Thank you for contacting LearnKins',
        message: `
          Dear ${name},
          
          Thank you for contacting us. We have received your message and will get back to you within 24 hours.
          
          Your message:
          Subject: ${subject}
          ${message}
          
          Best regards,
          LearnKins Support Team
        `
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: contactMessage
    });
  } catch (error) {
    console.error('Submit contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get contact messages
// @route   GET /api/contact
// @access  Private (Admin)
export const getContactMessages = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;

    let filteredMessages = contactMessages;

    if (status) {
      filteredMessages = filteredMessages.filter(msg => msg.status === status);
    }

    if (category) {
      filteredMessages = filteredMessages.filter(msg => msg.category === category);
    }

    // Sort by creation date (newest first)
    filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      count: paginatedMessages.length,
      total: filteredMessages.length,
      data: paginatedMessages
    });
  } catch (error) {
    console.error('Get contact messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update message status
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
export const updateMessageStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const messageIndex = contactMessages.findIndex(msg => msg.id === id);

    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    contactMessages[messageIndex].status = status;
    contactMessages[messageIndex].updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Message status updated successfully',
      data: contactMessages[messageIndex]
    });
  } catch (error) {
    console.error('Update message status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};