const nodemailer = require('nodemailer');
const { Contact } = require('../models/index');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message, phone, company } = req.body;

    const contact = await Contact.create({
      name, email, subject, message, phone, company,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Send email notification to admin
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Contact: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">New Portfolio Contact</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
              ${phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ''}
              ${company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${company}</td></tr>` : ''}
            </table>
            <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin-top: 16px;">
              <strong>Message:</strong>
              <p style="margin-top: 8px;">${message}</p>
            </div>
          </div>
        `,
      });

      // Auto-reply to sender
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Thank you for reaching out, ${name}!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6366f1;">Message Received!</h2>
            <p>Hi ${name},</p>
            <p>Thank you for reaching out. I've received your message and will get back to you as soon as possible.</p>
            <p>Best regards</p>
          </div>
        `,
      });
    } catch (emailError) {
      logger.error(`Email send error: ${emailError.message}`);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!', contact: { id: contact._id } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' }),
    };

    res.json({ success: true, total, contacts, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact status
// @route   PATCH /api/contacts/:id/status
// @access  Private/Admin
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'replied' && { repliedAt: new Date() }) },
      { new: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    next(error);
  }
};
