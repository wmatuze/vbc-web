const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth-middleware");
const nodemailer = require("nodemailer");
const MemberRenewal = require("../models/MemberRenewal");
const FoundationClassRegistration = require("../models/FoundationClassRegistration");

// Configure nodemailer for development (mock) or production
let transporter;

// Log environment configuration
console.log("=== Email Configuration ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not set");
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "Set" : "Not set");
console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
console.log("========================");

// Create transporter with Gmail configuration
console.log("Configuring Gmail email transporter");
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error("ERROR: Missing email credentials in environment variables");
  console.error("Please ensure EMAIL_USER and EMAIL_PASSWORD are set");
}

// Create transporter with proper configuration
transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify the transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Email transporter verification failed:", error);
  } else {
    console.log("Email transporter is ready to send emails");
  }
});

/**
 * @route POST /api/notifications/send
 * @desc Send email notifications to users
 * @access Private (Admin only)
 */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { type, recipient, data } = req.body;

    console.log("=== Notification Request Details ===");
    console.log("Type:", type);
    console.log("Recipient:", { ...recipient, email: recipient?.email });
    console.log("Data:", data);
    console.log("===================================");

    if (!type || !recipient || !recipient.email) {
      console.error("Missing required fields:", { type, recipient });
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Get email content based on notification type
    console.log("Generating email content for type:", type);
    console.log("Recipient data:", JSON.stringify(recipient));
    console.log("Event data:", JSON.stringify(data));

    const emailContent = getEmailContent(type, recipient, data);
    console.log("Email content generated successfully");
    console.log("Email subject:", emailContent.subject);

    // Send the email
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        '"Victory Bible Church" <watu.matuze@gmail.com>',
      to: recipient.email,
      subject: emailContent.subject,
      html: emailContent.body,
    };

    console.log("Preparing to send email to:", recipient.email);
    console.log("Email configuration:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    try {
      console.log("Attempting to send email...");
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
      console.error("Email error details:", {
        message: emailError.message,
        stack: emailError.stack,
        code: emailError.code,
      });
      return res.status(500).json({
        message: "Failed to send email notification",
        error: emailError.message,
        details: undefined,
      });
    }
  } catch (error) {
    console.error("Error in notification route:", error);
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    return res.status(500).json({
      message: "Failed to process notification request",
      error: error.message,
      details: undefined,
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

  // Log the notification type for debugging
  console.log("Processing notification type:", type);

  // Check if this is an event signup approval notification
  const eventSignupApprovedMatch = type.match(/^(.+)_signup_approved$/);
  const eventSignupDeclinedMatch = type.match(/^(.+)_signup_declined$/);

  if (eventSignupApprovedMatch) {
    const eventType = eventSignupApprovedMatch[1]; // Extract the event type (baptism, babyDedication, etc.)
    console.log(`Detected event signup approval for event type: ${eventType}`);

    // Handle different event types with specific templates
    if (eventType === "baptism") {
      return {
        subject: "Your Baptism Request Has Been Approved",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>We are delighted to inform you that your baptism request at ${churchName} has been approved!</p>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #bfdbfe;">
              <h3 style="margin-top: 0; color: #1e40af;">Baptism Details:</h3>
              <ul>
                <li><strong>Event:</strong> ${data.eventTitle}</li>
                <li><strong>Date:</strong> ${data.eventDate}</li>
                <li><strong>Time:</strong> ${data.eventTime}</li>
                <li><strong>Location:</strong> ${data.eventLocation}</li>
              </ul>
            </div>

            <p>This is a significant step in your faith journey, and we are excited to celebrate this moment with you. Please arrive 30 minutes before the scheduled time to prepare for the baptism.</p>

            <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #cbd5e1;">
              <h3 style="margin-top: 0; color: #334155;">What to Bring:</h3>
              <ul>
                <li>Change of clothes</li>
                <li>Towel</li>
                <li>Plastic bag for wet clothes</li>
                <li>Any personal items you may need</li>
              </ul>
            </div>

            <p>If you have any questions or need to make any changes, please contact our church office as soon as possible.</p>

            <p>We look forward to celebrating this special moment with you!</p>

            <p>Blessings,<br>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };
    } else if (eventType === "babyDedication") {
      return {
        subject: "Your Baby Dedication Request Has Been Approved",
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>We are pleased to inform you that your baby dedication request at ${churchName} has been approved!</p>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #bfdbfe;">
              <h3 style="margin-top: 0; color: #1e40af;">Baby Dedication Details:</h3>
              <ul>
                <li><strong>Event:</strong> ${data.eventTitle}</li>
                <li><strong>Date:</strong> ${data.eventDate}</li>
                <li><strong>Time:</strong> ${data.eventTime}</li>
                <li><strong>Location:</strong> ${data.eventLocation}</li>
                ${data.childName ? `<li><strong>Child's Name:</strong> ${data.childName}</li>` : ""}
              </ul>
            </div>

            <p>This is a special moment for your family, and we are honored to be part of it. Please arrive 15 minutes before the scheduled time.</p>

            <p>If you have any questions or need to make any changes, please contact our church office as soon as possible.</p>

            <p>We look forward to celebrating this special occasion with you and your family!</p>

            <p>Blessings,<br>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };
    } else {
      // Generic event signup approval template for other event types
      return {
        subject: `Your ${data.eventTitle || "Event"} Registration Has Been Approved`,
        body: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
            </div>
            <h2>Hello ${name},</h2>
            <p>We are pleased to inform you that your registration for ${data.eventTitle || "our event"} has been approved!</p>

            <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #bfdbfe;">
              <h3 style="margin-top: 0; color: #1e40af;">Event Details:</h3>
              <ul>
                <li><strong>Event:</strong> ${data.eventTitle || "Event"}</li>
                <li><strong>Date:</strong> ${data.eventDate || "Please contact for details"}</li>
                <li><strong>Time:</strong> ${data.eventTime || "Please contact for details"}</li>
                <li><strong>Location:</strong> ${data.eventLocation || "Please contact for details"}</li>
              </ul>
            </div>

            <p>We look forward to seeing you at this event. If you have any questions or need to make any changes, please contact our church office.</p>

            <p>Blessings,<br>The ${churchName} Team</p>
            ${emailFooter}
          </div>
        `,
      };
    }
  } else if (eventSignupDeclinedMatch) {
    const eventType = eventSignupDeclinedMatch[1]; // Extract the event type
    console.log(`Detected event signup decline for event type: ${eventType}`);

    // Generic event signup declined template
    return {
      subject: `Regarding Your ${data.eventTitle || "Event"} Registration`,
      body: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="${churchLogo}" alt="${churchName}" style="max-width: 200px;" />
          </div>
          <h2>Hello ${name},</h2>
          <p>Thank you for your interest in ${data.eventTitle || "our event"} at ${churchName}.</p>
          <p>We need to discuss some details about your registration. Please contact our church office at your earliest convenience.</p>
          ${data.reason ? `<p>Additional information: ${data.reason}</p>` : ""}
          <p>We look forward to speaking with you soon.</p>
          <p>Blessings,<br>The ${churchName} Team</p>
          ${emailFooter}
        </div>
      `,
    };
  }

  // Continue with the regular switch statement for other notification types
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
