const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth-middleware");
const nodemailer = require("nodemailer");
const MemberRenewal = require("../models/MemberRenewal");
const FoundationClassRegistration = require("../models/FoundationClassRegistration");

// Configure nodemailer for development (mock) or production
let transporter;

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== "production";

if (isDevelopment) {
  // In development, create a mock transporter that just logs emails
  console.log("Using mock email transporter for development");
  transporter = {
    sendMail: (mailOptions) => {
      console.log("MOCK EMAIL SENT:");
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Body:", mailOptions.html.substring(0, 100) + "...");
      return Promise.resolve({ messageId: "mock-email-id-" + Date.now() });
    },
  };
} else {
  // In production, use real email service
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * @route POST /api/notifications/send
 * @desc Send email notifications to users
 * @access Private (Admin only)
 */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { type, recipient, data } = req.body;

    console.log("Notification request received:", {
      type,
      recipient: { ...recipient, email: recipient?.email },
    });

    if (!type || !recipient || !recipient.email) {
      console.error("Missing required fields:", { type, recipient });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get email content based on notification type
    const emailContent = getEmailContent(type, recipient, data);

    // Send the email
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        '"Victory Bible Church" <no-reply@victorybiblechurch.org>',
      to: recipient.email,
      subject: emailContent.subject,
      html: emailContent.body,
    };

    console.log("Sending email to:", recipient.email);

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.messageId);

      // For SMS, you would integrate with an SMS service here
      // if (recipient.phone) { ... send SMS ... }

      // Record notification in database if needed
      // await Notification.create({ type, recipient: recipient.email, sentAt: new Date() });

      return res
        .status(200)
        .json({ message: "Notification sent successfully" });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        message: "Failed to send email notification",
        error: emailError.message,
        details: isDevelopment ? emailError.stack : undefined,
      });
    }
  } catch (error) {
    console.error("Error in notification route:", error);
    return res.status(500).json({
      message: "Failed to process notification request",
      error: error.message,
      details: isDevelopment ? error.stack : undefined,
    });
  }
});

/**
 * Generate email content based on notification type
 * @param {String} type - Notification type
 * @param {Object} recipient - Recipient information
 * @param {Object} data - Additional data for the notification
 * @returns {Object} Email subject and body
 */
function getEmailContent(type, recipient, data) {
  const { name } = recipient;
  const churchLogo =
    process.env.CHURCH_LOGO_URL || "https://victorybiblechurch.org/logo.png";
  const churchName = "Victory Bible Church Kitwe";
  const churchAddress = "123 Church Road, Kitwe, Zambia";
  const churchPhone = "+260 123 456 789";
  const churchEmail = "info@victorybiblechurch.org";
  const churchWebsite = "https://victorybiblechurch.org";

  // Common footer for all emails
  const emailFooter = `
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
      <p>${churchName}</p>
      <p>${churchAddress}</p>
      <p>Phone: ${churchPhone} | Email: ${churchEmail}</p>
      <p><a href="${churchWebsite}" style="color: #4a6ee0;">${churchWebsite}</a></p>
    </div>
  `;

  switch (type) {
    case "membership_renewal_approved":
      return {
        subject: "Your Membership Renewal Has Been Approved",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>We're pleased to inform you that your membership renewal at ${churchName} has been approved!</p>
            <p>Your continued commitment to our church family is greatly appreciated. As a renewed member, you'll continue to enjoy all the benefits of being part of our community.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our church office.</p>
            <p>God bless you,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };

    case "membership_renewal_declined":
      return {
        subject: "Regarding Your Membership Renewal",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>Thank you for submitting your membership renewal at ${churchName}.</p>
            <p>We are getting in touch regarding your recent application. There appears to be some information we need to clarify. Please contact our church office at your earliest convenience to discuss your membership renewal.</p>
            ${data.reason ? `<p>Additional information: ${data.reason}</p>` : ""}
            <p>We look forward to speaking with you soon.</p>
            <p>Blessings,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };

    case "foundation_class_approved":
      return {
        subject: "Welcome to Foundation Classes - Your Enrollment is Confirmed",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>Great news! Your enrollment in our Foundation Classes has been approved and confirmed.</p>
            <h3>Your Class Schedule:</h3>
            <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Location:</strong> ${data.schedule?.location || "Church Main Building, Room 201"}</p>
              <p><strong>Start Date:</strong> ${data.schedule?.startDate || "Please contact the church office for details"}</p>
              <p><strong>Time:</strong> ${data.schedule?.time || "9:00 AM - 10:30 AM"}</p>
            </div>
            <p>These classes will provide you with a strong biblical foundation and prepare you for church membership.</p>
            <p>Please arrive 15 minutes early for your first class. Bring your Bible, a notebook, and a pen.</p>
            <p>If you have any questions or need to reschedule, please contact our church office.</p>
            <p>We're excited to have you join us!</p>
            <p>Blessings,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };

    case "foundation_class_completed":
      return {
        subject:
          "Congratulations on Completing Foundation Classes - Welcome to Church Membership!",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
              <h1 style="color: #1e40af; margin-top: 10px;">Welcome to Church Membership!</h1>
            </div>
            <h2>Hello ${name},</h2>
            <p><strong>Congratulations!</strong> We're thrilled to inform you that you have successfully completed all of your Foundation Classes at ${churchName}.</p>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #bfdbfe;">
              <p style="font-weight: bold; color: #1e40af; margin-top: 0;">NEW MEMBER CONFIRMATION - FOUNDATION CLASS GRADUATE</p>
              <p>This marks an important milestone in your journey of faith, and we are pleased to welcome you as an <strong>official member</strong> of our church family!</p>
            </div>
            <p>As a church member, you now have the opportunity to:</p>
            <ul>
              <li>Participate in church decision meetings</li>
              <li>Serve in various ministry areas</li>
              <li>Access member-specific resources and support</li>
              <li>Become more deeply connected to our church community</li>
            </ul>
            <p>We encourage you to prayerfully consider how God might be calling you to serve and grow within our church family.</p>
            <p>If you have any questions about next steps or how to get involved, please don't hesitate to reach out to our church office.</p>
            <p>Welcome to the family!</p>
            <p>In Christ,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };

    case "foundation_class_cancelled":
      return {
        subject: "Regarding Your Foundation Class Enrollment",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>We are contacting you regarding your enrollment in our Foundation Classes at ${churchName}.</p>
            <p>We need to discuss some details about your registration. Please contact our church office at your earliest convenience.</p>
            ${data.reason ? `<p>Additional information: ${data.reason}</p>` : ""}
            <p>We look forward to speaking with you soon.</p>
            <p>Blessings,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };

    default:
      return {
        subject: "Notification from Victory Bible Church",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>This is a notification from ${churchName}.</p>
            <p>Please contact our church office for more information.</p>
            <p>Blessings,</p>
            <p>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };
  }
}

module.exports = router;
