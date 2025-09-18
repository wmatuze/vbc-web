const nodemailer = require("nodemailer");
require("dotenv").config();

// Email styling constants
const EMAIL_COLORS = {
  primary: '#4f46e5',
  secondary: '#3b82f6',
  success: '#047857',
  info: '#1e40af',
  background: '#f3f4f6',
  lightBackground: '#f8fafc',
  border: '#e5e7eb',
  textMuted: '#6b7280',
  white: '#ffffff'
};

// Utility function for consistent date formatting
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Enhanced email template with your actual logo
const createEmailTemplate = (headerTitle, headerColor, content) => {
  const churchInfo = {
    // Use imgur as a reliable image hosting service for emails
    // Upload your logo to imgur.com and replace this URL
    logoUrl: process.env.CHURCH_LOGO_URL || "https://i.imgur.com/placeholder.png",
    name: "Victory Bible Church",
    address: "Off Chiwala Road CBU East Gate, Kitwe, Zambia",
    phone: "+260 123 456 789", 
    email: "info@victorybiblechurch.org",
    website: "https://victorybiblechurch.org"
  };
  
  return `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid ${EMAIL_COLORS.border};">
  <!-- Header with Your Logo -->
  <div style="background-color: ${headerColor}; color: ${EMAIL_COLORS.white}; padding: 30px 20px; text-align: center;">
    <img src="${churchInfo.logoUrl}" alt="Victory Bible Church Logo" 
         style="height: 60px; width: auto; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;" />
    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">${headerTitle}</h1>
  </div>
  
  <!-- Content -->
  <div style="padding: 30px 20px; background-color: ${EMAIL_COLORS.white};">
    ${content}
  </div>
  
  <!-- Footer with Church Info -->
  <div style="background-color: ${EMAIL_COLORS.background}; padding: 20px; text-align: center; border-top: 1px solid ${EMAIL_COLORS.border};">
    <img src="${churchInfo.logoUrl}" alt="Victory Bible Church" 
         style="height: 40px; width: auto; margin-bottom: 10px;" />
    <div style="font-size: 14px; color: ${EMAIL_COLORS.textMuted}; line-height: 1.6;">
      <strong style="color: #333;">Victory Bible Church</strong><br>
      ${churchInfo.address}<br>
      Phone: ${churchInfo.phone} | Email: <a href="mailto:${churchInfo.email}" style="color: ${EMAIL_COLORS.primary};">${churchInfo.email}</a><br>
      <a href="${churchInfo.website}" style="color: ${EMAIL_COLORS.primary}; text-decoration: none;">${churchInfo.website}</a>
    </div>
    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid ${EMAIL_COLORS.border}; font-size: 12px; color: ${EMAIL_COLORS.textMuted};">
      &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
    </div>
  </div>
</div>
  `;
};


// Configure email transporter
let transporter;
const isDevelopment = process.env.NODE_ENV !== "production";

// Set up the transporter based on environment
if (isDevelopment || !process.env.NODE_ENV) {
  // TEMPORARY: Force use of Gmail for testing/demo
  console.log("FORCING Gmail for email testing/demo");
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "watu.matuze@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "chxp rnip ozqo daxa",
    },
  });
} else {
  // Production email configuration
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

/**
 * Send an email using configured transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body (optional)
 * @returns {Promise} - Resolves with info about sent email
 */
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        "Victory Bible Church <no-reply@victorybiblechurch.org>",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send membership renewal confirmation emails
 * @param {Object} renewal - Membership renewal data
 */
const sendMembershipRenewalEmails = async (renewal) => {
  // Input validation
  if (!renewal || !renewal.email || !renewal.fullName) {
    throw new Error("Missing required renewal data: email and fullName are required");
  }

  try {
    // Email to member
    await sendEmail({
      to: renewal.email,
      subject: "Membership Renewal Confirmation - Victory Bible Church",
      text: `
Dear ${renewal.fullName},

Thank you for renewing your membership with Victory Bible Church. Your renewal has been received and is being processed.

Renewal Details:
- Name: ${renewal.fullName}
- Member Since: ${renewal.memberSince}
- Renewal Date: ${formatDate(renewal.renewalDate)}

If you have any questions, please contact our church office at (123) 456-7890 or email renewal@vbc.info.

Blessings,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "Membership Renewal Confirmation",
        EMAIL_COLORS.primary,
        `
    <p>Dear ${renewal.fullName},</p>

    <p>Thank you for renewing your membership with Victory Bible Church. Your renewal has been received and is being processed.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Renewal Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${formatDate(renewal.renewalDate)}</li>
      </ul>
    </div>

    <p>If you have any questions, please contact our church office at (123) 456-7890 or email <a href="mailto:renewal@vbc.info" style="color: ${EMAIL_COLORS.primary};">renewal@vbc.info</a>.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
        `
      ),
    });

    // Email to admin with improved subject
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Renewal: ${renewal.fullName} - Victory Bible Church`,
      text: `
A new membership renewal has been submitted.

Member Details:
- Name: ${renewal.fullName}
- Email: ${renewal.email}
- Phone: ${renewal.phone}
- Member Since: ${renewal.memberSince}
- Renewal Date: ${formatDate(renewal.renewalDate)}
- Address Change: ${renewal.addressChange ? "Yes" : "No"}
${renewal.addressChange ? `- New Address: ${renewal.newAddress}` : ""}

Please review this renewal in the admin dashboard.
      `,
      html: createEmailTemplate(
        "New Membership Renewal",
        EMAIL_COLORS.primary,
        `
    <p>Dear Admin,</p>
    
    <p>A new membership renewal has been submitted.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Member Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Email:</strong> ${renewal.email}</li>
        <li><strong>Phone:</strong> ${renewal.phone}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${formatDate(renewal.renewalDate)}</li>
        <li><strong>Address Change:</strong> ${renewal.addressChange ? "Yes" : "No"}</li>
        ${renewal.addressChange ? `<li><strong>New Address:</strong> ${renewal.newAddress}</li>` : ""}
      </ul>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ADMIN_URL || "https://admin.victorybiblechurch.org"}/membership/renewals" 
         style="background-color: ${EMAIL_COLORS.primary}; color: ${EMAIL_COLORS.white}; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Review in Admin Dashboard
      </a>
    </p>
        `
      ),
    });

    console.log("Membership renewal emails sent successfully");
  } catch (error) {
    console.error("Error sending membership renewal emails:", error);
    // Don't throw the error - we don't want to break the API if email fails
  }
};

/**
 * Send foundation classes registration confirmation emails
 * @param {Object} registration - Foundation classes registration data
 */
const sendFoundationClassRegistrationEmails = async (registration) => {
  // Input validation
  if (!registration || !registration.email || !registration.fullName) {
    throw new Error("Missing required registration data: email and fullName are required");
  }

  try {
    // Email to registrant
    await sendEmail({
      to: registration.email,
      subject:
        "Foundation Classes Registration Confirmed - Victory Bible Church",
      text: `
Dear ${registration.fullName},

Thank you for registering for Foundation Classes at Victory Bible Church. Your registration has been received and is confirmed.

Registration Details:
- Name: ${registration.fullName}
- Preferred Session: ${registration.preferredSession}
- Registration Date: ${formatDate(registration.registrationDate)}

What to Bring:
- Bible
- Notebook
- Pen

We look forward to seeing you at the first class! If you have any questions, please contact our church office at (123) 456-7890.

Blessings,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "Foundation Classes Registration Confirmed",
        EMAIL_COLORS.secondary,
        `
    <p>Dear ${registration.fullName},</p>

    <p>Thank you for registering for Foundation Classes at Victory Bible Church. Your registration has been received and is <strong>confirmed</strong>.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Registration Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.fullName}</li>
        <li><strong>Preferred Session:</strong> ${registration.preferredSession}</li>
        <li><strong>Registration Date:</strong> ${formatDate(registration.registrationDate)}</li>
      </ul>
    </div>

    <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: ${EMAIL_COLORS.secondary};">What to Bring:</h3>
      <ul>
        <li>Bible</li>
        <li>Notebook</li>
        <li>Pen</li>
      </ul>
    </div>

    <p>We look forward to seeing you at the first class! If you have any questions, please contact our church office at (123) 456-7890.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
        `
      ),
    });

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Foundation Registration: ${registration.fullName}`,
      text: `
A new Foundation Classes registration has been submitted.

Registrant Details:
- Name: ${registration.fullName}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Preferred Session: ${registration.preferredSession}
- Registration Date: ${formatDate(registration.registrationDate)}
${registration.questions ? `- Questions/Requests: ${registration.questions}` : ""}

Please review this registration in the admin dashboard.
      `,
      html: createEmailTemplate(
        "New Foundation Classes Registration",
        EMAIL_COLORS.secondary,
        `
    <p>Dear Admin,</p>
    
    <p>A new Foundation Classes registration has been submitted.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Registrant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.fullName}</li>
        <li><strong>Email:</strong> ${registration.email}</li>
        <li><strong>Phone:</strong> ${registration.phone}</li>
        <li><strong>Preferred Session:</strong> ${registration.preferredSession}</li>
        <li><strong>Registration Date:</strong> ${formatDate(registration.registrationDate)}</li>
        ${registration.questions ? `<li><strong>Questions/Requests:</strong> ${registration.questions}</li>` : ""}
      </ul>
    </div>

    <p style="text-align: center; margin: 30px 0;">
      <a href="${process.env.ADMIN_URL || "https://admin.victorybiblechurch.org"}/foundation-classes/registrations" 
         style="background-color: ${EMAIL_COLORS.secondary}; color: ${EMAIL_COLORS.white}; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Review in Admin Dashboard
      </a>
    </p>
        `
      ),
    });

    console.log("Foundation classes registration emails sent successfully");
  } catch (error) {
    console.error(
      "Error sending foundation classes registration emails:",
      error
    );
  }
};

/**
 * Send membership approval notification email
 * @param {Object} renewal - Approved membership renewal data
 */
const sendMembershipApprovalEmail = async (renewal) => {
  // Input validation
  if (!renewal || !renewal.email || !renewal.fullName) {
    throw new Error("Missing required renewal data: email and fullName are required");
  }

  try {
    // Email to member
    await sendEmail({
      to: renewal.email,
      subject:
        "Your Membership Renewal Has Been Approved - Victory Bible Church",
      text: `
Dear ${renewal.fullName},

We are pleased to inform you that your membership renewal with Victory Bible Church has been reviewed and approved.

** THIS IS A MEMBERSHIP RENEWAL CONFIRMATION FOR EXISTING MEMBERS **

Your membership is now active and renewed for another year. Thank you for your continued commitment to our church community.

Membership Details:
- Name: ${renewal.fullName}
- Member Since: ${renewal.memberSince}
- Renewal Date: ${new Date(renewal.renewalDate).toLocaleDateString()}
- Status: Approved

As a member, you have access to various ministry opportunities, events, and resources. We encourage you to stay connected and be an active part of our church family.

If you have any questions about your membership or would like to get more involved, please contact our church office at (123) 456-7890 or email membership@vbc.info.

Blessings,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "Membership Renewal Approved",
        EMAIL_COLORS.success,
        `
    <p>Dear ${renewal.fullName},</p>

    <p>We are pleased to inform you that your membership renewal with Victory Bible Church has been reviewed and <strong>approved</strong>.</p>

    <div style="background-color: ${EMAIL_COLORS.lightBackground}; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid ${EMAIL_COLORS.border};">
      <p style="font-weight: bold; color: ${EMAIL_COLORS.success}; margin: 0; text-align: center;">✓ MEMBERSHIP RENEWAL CONFIRMATION FOR EXISTING MEMBERS</p>
    </div>

    <p>Your membership is now active and renewed for another year. Thank you for your continued commitment to our church community.</p>

    <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.success};">
      <h3 style="margin-top: 0; color: ${EMAIL_COLORS.success};">Membership Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${formatDate(renewal.renewalDate)}</li>
        <li><strong>Status:</strong> <span style="color: ${EMAIL_COLORS.success}; font-weight: bold;">Approved</span></li>
      </ul>
    </div>

    <p>As a member, you have access to various ministry opportunities, events, and resources. We encourage you to stay connected and be an active part of our church family.</p>

    <p>If you have any questions about your membership or would like to get more involved, please contact our church office at (123) 456-7890 or email <a href="mailto:membership@vbc.info" style="color: ${EMAIL_COLORS.primary};">membership@vbc.info</a>.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
        `
      ),
    });

    console.log("Membership approval email sent successfully");
  } catch (error) {
    console.error("Error sending membership approval email:", error);
    // Don't throw the error - we don't want to break the API if email fails
  }
};

/**
 * Send foundation class completion notification email
 * @param {Object} registration - Completed foundation class registration data
 */
const sendFoundationClassCompletionEmail = async (registration) => {
  // Input validation
  if (!registration || !registration.email || !registration.fullName) {
    throw new Error("Missing required registration data: email and fullName are required");
  }

  try {
    // Email to member
    await sendEmail({
      to: registration.email,
      subject:
        "Congratulations on Completing Foundation Classes - Welcome to Church Membership!",
      text: `
Dear ${registration.fullName},

Congratulations! We're thrilled to inform you that you have successfully completed all of your Foundation Classes at Victory Bible Church.

*** NEW MEMBER CONFIRMATION - FOUNDATION CLASS GRADUATE ***

This marks an important milestone in your journey of faith, and we are pleased to welcome you as an official member of our church family!

As a church member, you now have the opportunity to:
- Participate in church decision meetings
- Serve in various ministry areas
- Access member-specific resources and support
- Become more deeply connected to our church community

We encourage you to prayerfully consider how God might be calling you to serve and grow within our church family.

If you have any questions about next steps or how to get involved, please don't hesitate to reach out to our church office.

Welcome to the family!

In Christ,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "Welcome to Church Membership!",
        EMAIL_COLORS.info,
        `
    <p>Dear ${registration.fullName},</p>

    <p><strong>Congratulations!</strong> We're thrilled to inform you that you have successfully completed all of your Foundation Classes at Victory Bible Church.</p>

    <div style="background-color: #eff6ff; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #bfdbfe;">
      <p style="font-weight: bold; color: ${EMAIL_COLORS.info}; margin-top: 0; text-align: center;">🎓 NEW MEMBER CONFIRMATION - FOUNDATION CLASS GRADUATE</p>
      <p style="margin-bottom: 0;">This marks an important milestone in your journey of faith, and we are pleased to welcome you as an <strong>official member</strong> of our church family!</p>
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

    <p><strong>Welcome to the family!</strong></p>

    <p>In Christ,<br>Victory Bible Church Team</p>
        `
      ),
    });

    console.log("Foundation class completion email sent successfully");
  } catch (error) {
    console.error("Error sending foundation class completion email:", error);
    // Don't throw the error - we don't want to break the API if email fails
  }
};

/**
 * Send cell group join request emails
 * @param {Object} request - Cell group join request data
 * @param {Object} cellGroup - Cell group data
 */
const sendCellGroupJoinRequestEmails = async (request, cellGroup) => {
  // Input validation
  if (!request || !request.email || !request.name) {
    throw new Error("Missing required request data: email and name are required");
  }
  if (!cellGroup || !cellGroup.name || !cellGroup.leader) {
    throw new Error("Missing required cell group data: name and leader are required");
  }

  try {
    // Email to the person who wants to join
    await sendEmail({
      to: request.email,
      subject: "Cell Group Join Request Confirmation - Victory Bible Church",
      text: `
Dear ${request.name},

Thank you for your interest in joining the "${cellGroup.name}" cell group. Your request has been received and is being processed.

Request Details:
- Cell Group: ${cellGroup.name}
- Leader: ${cellGroup.leader}
- Meeting Day: ${cellGroup.meetingDay || "Not specified"}
- Meeting Time: ${cellGroup.meetingTime || "Not specified"}
- Location: ${cellGroup.location}

The cell group leader will contact you soon with more information. If you have any questions in the meantime, please contact our church office.

Blessings,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "Cell Group Join Request Confirmation",
        EMAIL_COLORS.primary,
        `
    <p>Dear ${request.name},</p>

    <p>Thank you for your interest in joining the "${cellGroup.name}" cell group. Your request has been received and is being processed.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Request Details:</h3>
      <ul>
        <li><strong>Cell Group:</strong> ${cellGroup.name}</li>
        <li><strong>Leader:</strong> ${cellGroup.leader}</li>
        <li><strong>Meeting Day:</strong> ${cellGroup.meetingDay || "Not specified"}</li>
        <li><strong>Meeting Time:</strong> ${cellGroup.meetingTime || "Not specified"}</li>
        <li><strong>Location:</strong> ${cellGroup.location}</li>
      </ul>
    </div>

    <p>The cell group leader will contact you soon with more information. If you have any questions in the meantime, please contact our church office.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
        `
      ),
    });

    // Email to the cell group leader
    await sendEmail({
      to:
        cellGroup.leaderContact ||
        process.env.ADMIN_EMAIL ||
        "admin@victorybiblechurch.org",
      subject: "New Cell Group Join Request - Victory Bible Church",
      text: `
Dear ${cellGroup.leader},

A new request to join your cell group has been submitted.

Join Request Details:
- Name: ${request.name}
- Email: ${request.email}
- Phone: ${request.phone}
${request.whatsapp ? `- WhatsApp: ${request.whatsapp}` : ""}
${request.message ? `- Message: ${request.message}` : ""}

Cell Group:
- Name: ${cellGroup.name}
- Location: ${cellGroup.location}

Please contact this person soon to welcome them and provide more information about your cell group.

Blessings,
Victory Bible Church Team
      `,
      html: createEmailTemplate(
        "New Cell Group Join Request",
        EMAIL_COLORS.primary,
        `
    <p>Dear ${cellGroup.leader},</p>

    <p>A new request to join your cell group has been submitted.</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Join Request Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${request.name}</li>
        <li><strong>Email:</strong> ${request.email}</li>
        <li><strong>Phone:</strong> ${request.phone}</li>
        ${request.whatsapp ? `<li><strong>WhatsApp:</strong> ${request.whatsapp}</li>` : ""}
        ${request.message ? `<li><strong>Message:</strong> ${request.message}</li>` : ""}
      </ul>
    </div>

    <div style="background-color: #e0e7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: ${EMAIL_COLORS.primary};">Cell Group:</h3>
      <ul>
        <li><strong>Name:</strong> ${cellGroup.name}</li>
        <li><strong>Location:</strong> ${cellGroup.location}</li>
      </ul>
    </div>

    <p>Please contact this person soon to welcome them and provide more information about your cell group.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
        `
      ),
    });

    console.log("Cell group join request emails sent successfully");
  } catch (error) {
    console.error("Error sending cell group join request emails:", error);
    // Don't throw the error - we don't want to break the API if email fails
  }
};

/**
 * Send support request email to admin
 * @param {Object} supportData - Support request data
 */
const sendSupportRequestEmail = async (supportData) => {
  if (!supportData || !supportData.name || !supportData.email || !supportData.subject || !supportData.message) {
    throw new Error("Missing required support request data");
  }

  const { name, email, subject, message, priority = 'medium' } = supportData;

  try {
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "watu.matuze@gmail.com",
      subject: `Support Request: ${subject} (${priority} priority)`,
      text: `
Support Request from Admin Portal

From: ${name} (${email})
Priority: ${priority}

Message:
${message}

---
This message was sent from the Victory Bible Church CMS Support Form.
      `,
      html: createEmailTemplate(
        "Support Request from Admin Portal",
        EMAIL_COLORS.info,
        `
    <p><strong>From:</strong> ${name} (${email})</p>
    <p><strong>Priority:</strong> <span style="color: ${priority === "urgent" ? "#dc2626" : priority === "high" ? "#ea580c" : priority === "medium" ? "#0284c7" : "#059669"};">${priority}</span></p>
    <p><strong>Subject:</strong> ${subject}</p>

    <div style="background-color: ${EMAIL_COLORS.background}; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
    </div>

    <p style="font-size: 12px; color: ${EMAIL_COLORS.textMuted}; margin-top: 30px; padding-top: 10px; border-top: 1px solid ${EMAIL_COLORS.border};">
      This message was sent from the Victory Bible Church CMS Support Form.
    </p>
        `
      ),
    });

    console.log("Support request email sent successfully");
  } catch (error) {
    console.error("Error sending support request email:", error);
    throw error; // Re-throw for API to handle
  }
};

module.exports = {
  sendEmail,
  sendMembershipRenewalEmails,
  sendFoundationClassRegistrationEmails,
  sendMembershipApprovalEmail,
  sendFoundationClassCompletionEmail,
  sendCellGroupJoinRequestEmails,
  sendSupportRequestEmail,
};
