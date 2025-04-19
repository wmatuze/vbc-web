const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure email transporter
let transporter;

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV !== "production";

// Set up the transporter based on environment
if (isDevelopment) {
  // TEMPORARY: Force use of Gmail for testing
  console.log("FORCING Gmail for email testing");
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
- Renewal Date: ${new Date(renewal.renewalDate).toLocaleDateString()}

If you have any questions, please contact our church office at (123) 456-7890 or email renewal@vbc.info.

Blessings,
Victory Bible Church Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
    <h1>Membership Renewal Confirmation</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${renewal.fullName},</p>

    <p>Thank you for renewing your membership with Victory Bible Church. Your renewal has been received and is being processed.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Renewal Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${new Date(renewal.renewalDate).toLocaleDateString()}</li>
      </ul>
    </div>

    <p>If you have any questions, please contact our church office at (123) 456-7890 or email <a href="mailto:renewal@vbc.info">renewal@vbc.info</a>.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
    });

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: "New Membership Renewal Submission",
      text: `
A new membership renewal has been submitted.

Member Details:
- Name: ${renewal.fullName}
- Email: ${renewal.email}
- Phone: ${renewal.phone}
- Member Since: ${renewal.memberSince}
- Renewal Date: ${new Date(renewal.renewalDate).toLocaleDateString()}
- Address Change: ${renewal.addressChange ? "Yes" : "No"}
${renewal.addressChange ? `- New Address: ${renewal.newAddress}` : ""}

Please review this renewal in the admin dashboard.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
    <h1>New Membership Renewal</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>A new membership renewal has been submitted.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Member Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Email:</strong> ${renewal.email}</li>
        <li><strong>Phone:</strong> ${renewal.phone}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${new Date(renewal.renewalDate).toLocaleDateString()}</li>
        <li><strong>Address Change:</strong> ${renewal.addressChange ? "Yes" : "No"}</li>
        ${renewal.addressChange ? `<li><strong>New Address:</strong> ${renewal.newAddress}</li>` : ""}
      </ul>
    </div>

    <p><a href="${process.env.ADMIN_URL || "https://admin.victorybiblechurch.org"}/membership/renewals" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Review in Admin Dashboard</a></p>
  </div>
</div>
      `,
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
  try {
    // Email to registrant
    await sendEmail({
      to: registration.email,
      subject:
        "Foundation Classes Registration Confirmation - Victory Bible Church",
      text: `
Dear ${registration.fullName},

Thank you for registering for Foundation Classes at Victory Bible Church. Your registration has been received and is confirmed.

Registration Details:
- Name: ${registration.fullName}
- Preferred Session: ${registration.preferredSession}
- Registration Date: ${new Date(registration.registrationDate).toLocaleDateString()}

What to Bring:
- Bible
- Notebook
- Pen

We look forward to seeing you at the first class! If you have any questions, please contact our church office at (123) 456-7890.

Blessings,
Victory Bible Church Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
    <h1>Foundation Classes Registration Confirmation</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${registration.fullName},</p>

    <p>Thank you for registering for Foundation Classes at Victory Bible Church. Your registration has been received and is confirmed.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Registration Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.fullName}</li>
        <li><strong>Preferred Session:</strong> ${registration.preferredSession}</li>
        <li><strong>Registration Date:</strong> ${new Date(registration.registrationDate).toLocaleDateString()}</li>
      </ul>
    </div>

    <div style="background-color: #dbeafe; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #1e40af;">What to Bring:</h3>
      <ul>
        <li>Bible</li>
        <li>Notebook</li>
        <li>Pen</li>
      </ul>
    </div>

    <p>We look forward to seeing you at the first class! If you have any questions, please contact our church office at (123) 456-7890.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
    });

    // Email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: "New Foundation Classes Registration",
      text: `
A new Foundation Classes registration has been submitted.

Registrant Details:
- Name: ${registration.fullName}
- Email: ${registration.email}
- Phone: ${registration.phone}
- Preferred Session: ${registration.preferredSession}
- Registration Date: ${new Date(registration.registrationDate).toLocaleDateString()}
${registration.questions ? `- Questions/Requests: ${registration.questions}` : ""}

Please review this registration in the admin dashboard.
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #3b82f6; color: white; padding: 20px; text-align: center;">
    <h1>New Foundation Classes Registration</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>A new Foundation Classes registration has been submitted.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Registrant Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${registration.fullName}</li>
        <li><strong>Email:</strong> ${registration.email}</li>
        <li><strong>Phone:</strong> ${registration.phone}</li>
        <li><strong>Preferred Session:</strong> ${registration.preferredSession}</li>
        <li><strong>Registration Date:</strong> ${new Date(registration.registrationDate).toLocaleDateString()}</li>
        ${registration.questions ? `<li><strong>Questions/Requests:</strong> ${registration.questions}</li>` : ""}
      </ul>
    </div>

    <p><a href="${process.env.ADMIN_URL || "https://admin.victorybiblechurch.org"}/foundation-classes/registrations" style="background-color: #3b82f6; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Review in Admin Dashboard</a></p>
  </div>
</div>
      `,
    });

    console.log("Foundation classes registration emails sent successfully");
  } catch (error) {
    console.error(
      "Error sending foundation classes registration emails:",
      error
    );
    // Don't throw the error - we don't want to break the API if email fails
  }
};

/**
 * Send membership approval notification email
 * @param {Object} renewal - Approved membership renewal data
 */
const sendMembershipApprovalEmail = async (renewal) => {
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
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #047857; color: white; padding: 20px; text-align: center;">
    <h1>Membership Renewal Approved</h1>
    <h2 style="font-size: 18px; margin-top: 5px;">For Existing Church Members</h2>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${renewal.fullName},</p>

    <p>We are pleased to inform you that your membership renewal with Victory Bible Church has been reviewed and <strong>approved</strong>.</p>

    <div style="background-color: #f8fafc; padding: 10px; border-radius: 5px; margin: 15px 0; border: 1px solid #cbd5e1;">
      <p style="font-weight: bold; color: #334155; margin: 0;">THIS IS A MEMBERSHIP RENEWAL CONFIRMATION FOR EXISTING MEMBERS</p>
    </div>

    <p>Your membership is now active and renewed for another year. Thank you for your continued commitment to our church community.</p>

    <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #047857;">
      <h3 style="margin-top: 0; color: #047857;">Membership Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${renewal.fullName}</li>
        <li><strong>Member Since:</strong> ${renewal.memberSince}</li>
        <li><strong>Renewal Date:</strong> ${new Date(renewal.renewalDate).toLocaleDateString()}</li>
        <li><strong>Status:</strong> <span style="color: #047857; font-weight: bold;">Approved</span></li>
      </ul>
    </div>

    <p>As a member, you have access to various ministry opportunities, events, and resources. We encourage you to stay connected and be an active part of our church family.</p>

    <p>If you have any questions about your membership or would like to get more involved, please contact our church office at (123) 456-7890 or email <a href="mailto:membership@vbc.info">membership@vbc.info</a>.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
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
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center;">
    <h1>Welcome to Church Membership!</h1>
    <h2 style="font-size: 18px; margin-top: 5px;">Foundation Class Graduate</h2>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${registration.fullName},</p>

    <p><strong>Congratulations!</strong> We're thrilled to inform you that you have successfully completed all of your Foundation Classes at Victory Bible Church.</p>

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

    <p><strong>Welcome to the family!</strong></p>

    <p>In Christ,<br>Victory Bible Church Team</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
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
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
    <h1>Cell Group Join Request Confirmation</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${request.name},</p>

    <p>Thank you for your interest in joining the "${cellGroup.name}" cell group. Your request has been received and is being processed.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
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
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
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
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
    <h1>New Cell Group Join Request</h1>
  </div>
  <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
    <p>Dear ${cellGroup.leader},</p>

    <p>A new request to join your cell group has been submitted.</p>

    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
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
      <h3 style="margin-top: 0; color: #4338ca;">Cell Group:</h3>
      <ul>
        <li><strong>Name:</strong> ${cellGroup.name}</li>
        <li><strong>Location:</strong> ${cellGroup.location}</li>
      </ul>
    </div>

    <p>Please contact this person soon to welcome them and provide more information about your cell group.</p>

    <p>Blessings,<br>Victory Bible Church Team</p>
  </div>
  <div style="background-color: #f3f4f6; padding: 10px; text-align: center; font-size: 12px; color: #6b7280;">
    &copy; ${new Date().getFullYear()} Victory Bible Church. All rights reserved.
  </div>
</div>
      `,
    });

    console.log("Cell group join request emails sent successfully");
  } catch (error) {
    console.error("Error sending cell group join request emails:", error);
    // Don't throw the error - we don't want to break the API if email fails
  }
};

module.exports = {
  sendEmail,
  sendMembershipRenewalEmails,
  sendFoundationClassRegistrationEmails,
  sendMembershipApprovalEmail,
  sendFoundationClassCompletionEmail,
  sendCellGroupJoinRequestEmails,
};
