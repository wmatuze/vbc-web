const nodemailer = require("nodemailer");
require("dotenv").config();

const BRAND = {
  dark: "#0a0a0a",
  red: "#dc2626",
  white: "#ffffff",
  lightBg: "#f9fafb",
  border: "#e5e7eb",
  mutedText: "#6b7280",
  darkMuted: "#9ca3af",
};

const formatDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Builds a branded VBC email wrapper.
 * accentColor is used for the top stripe and detail-block left border.
 */
const createEmailTemplate = (headerTitle, accentColor, content) => {
  const accent = accentColor || BRAND.red;
  const logoUrl = process.env.CHURCH_LOGO_URL || "";
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headerTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:${BRAND.white};border:1px solid ${BRAND.border};border-radius:4px;overflow:hidden;">

    <!-- Accent stripe -->
    <div style="height:4px;background:${accent};"></div>

    <!-- Header -->
    <div style="background:${BRAND.dark};padding:32px 24px;text-align:center;">
      ${logoUrl ? `<img src="${logoUrl}" alt="Victory Bible Church" style="height:50px;width:auto;display:block;margin:0 auto 16px;" />` : ""}
      <p style="margin:0 0 6px;color:${BRAND.darkMuted};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Victory Bible Church</p>
      <h1 style="margin:0;color:${BRAND.white};font-size:22px;font-weight:700;letter-spacing:-0.02em;">${headerTitle}</h1>
    </div>

    <!-- Body -->
    <div style="padding:36px 32px;background:${BRAND.white};">
      ${content}
    </div>

    <!-- Footer -->
    <div style="background:${BRAND.dark};padding:28px 24px;text-align:center;">
      <div style="height:1px;background:${accent};opacity:0.35;margin:0 0 20px;"></div>
      <p style="margin:0 0 4px;color:${BRAND.white};font-size:13px;font-weight:600;">Victory Bible Church</p>
      <p style="margin:0 0 4px;color:${BRAND.darkMuted};font-size:12px;line-height:1.6;">Off Chiwala Road CBU East Gate, Kitwe, Zambia</p>
      <p style="margin:0 0 16px;color:${BRAND.darkMuted};font-size:12px;">
        <a href="mailto:info@victorybiblechurch.org" style="color:${BRAND.darkMuted};text-decoration:none;">info@victorybiblechurch.org</a>
        &nbsp;·&nbsp;
        <a href="https://victorybiblechurch.org" style="color:${BRAND.darkMuted};text-decoration:none;">victorybiblechurch.org</a>
      </p>
      <p style="margin:0;color:#4b5563;font-size:11px;">&copy; ${year} Victory Bible Church. All rights reserved.</p>
    </div>

  </div>
</body>
</html>`;
};

/** Reusable detail block with a coloured left border */
const detailBlock = (items, accentColor) => {
  const accent = accentColor || BRAND.red;
  const rows = items
    .filter(([, v]) => v != null && v !== "")
    .map(([label, value]) => `
      <tr>
        <td style="padding:6px 0;color:${BRAND.mutedText};font-size:13px;width:140px;vertical-align:top;">${label}</td>
        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500;vertical-align:top;">${value}</td>
      </tr>`)
    .join("");

  return `
    <div style="border-left:3px solid ${accent};background:${BRAND.lightBg};padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
      <table style="border-collapse:collapse;width:100%;">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
};

// ─── Transporter ─────────────────────────────────────────────────────────────

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.error("ERROR: EMAIL_USER and EMAIL_PASSWORD must be set in .env file");
  process.exit(1);
}

const isDevelopment = process.env.NODE_ENV !== "production";
let transporter;

if (isDevelopment || !process.env.NODE_ENV) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });
} else {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === "true",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });
}

// ─── Core sender ─────────────────────────────────────────────────────────────

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "Victory Bible Church <no-reply@victorybiblechurch.org>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

// ─── Membership renewal confirmation (on form submission) ────────────────────

const sendMembershipRenewalEmails = async (renewal) => {
  if (!renewal?.email || !renewal?.fullName) {
    throw new Error("Missing required renewal data: email and fullName are required");
  }

  try {
    await sendEmail({
      to: renewal.email,
      subject: "Membership Renewal Received — Victory Bible Church",
      text: `Dear ${renewal.fullName}, your membership renewal has been received and is being reviewed.`,
      html: createEmailTemplate(
        "Renewal Received",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${renewal.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Thank you for renewing your membership with us. We've received your submission and our team will review it shortly.</p>
         ${detailBlock([
           ["Name", renewal.fullName],
           ["Member Since", renewal.memberSince],
           ["Renewal Date", formatDate(renewal.renewalDate)],
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">If you have any questions, please contact our church office.</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Renewal: ${renewal.fullName}`,
      text: `New membership renewal from ${renewal.fullName} (${renewal.email}).`,
      html: createEmailTemplate(
        "New Membership Renewal",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">A new membership renewal has been submitted.</p>
         ${detailBlock([
           ["Name", renewal.fullName],
           ["Email", renewal.email],
           ["Phone", renewal.phone],
           ["Member Since", renewal.memberSince],
           ["Renewal Date", formatDate(renewal.renewalDate)],
           ["Address Change", renewal.addressChange ? "Yes" : "No"],
           ...(renewal.addressChange ? [["New Address", renewal.newAddress]] : []),
         ])}
         <p style="text-align:center;margin:28px 0;">
           <a href="${process.env.ADMIN_URL || "https://victorybiblechurch.org/admin"}/members"
              style="background:${BRAND.red};color:${BRAND.white};padding:12px 24px;text-decoration:none;border-radius:2px;font-size:14px;font-weight:600;display:inline-block;">
             Review in Admin Dashboard
           </a>
         </p>`
      ),
    });
  } catch (error) {
    console.error("Error sending membership renewal emails:", error);
  }
};

// ─── Foundation class registration confirmation (on form submission) ──────────

const sendFoundationClassRegistrationEmails = async (registration) => {
  if (!registration?.email || !registration?.fullName) {
    throw new Error("Missing required registration data: email and fullName are required");
  }

  try {
    await sendEmail({
      to: registration.email,
      subject: "Foundation Classes Registration Received — Victory Bible Church",
      text: `Dear ${registration.fullName}, your Foundation Classes registration has been received.`,
      html: createEmailTemplate(
        "Registration Received",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${registration.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Thank you for registering for Foundation Classes. We're excited to have you join us on this journey of faith. Your registration is being reviewed and we'll be in touch soon with confirmation.</p>
         ${detailBlock([
           ["Name", registration.fullName],
           ["Preferred Session", registration.preferredSession],
           ["Registration Date", formatDate(registration.registrationDate)],
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">In the meantime, feel free to bring a Bible, a notebook, and a pen to your first session.</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Foundation Registration: ${registration.fullName}`,
      text: `New Foundation Classes registration from ${registration.fullName}.`,
      html: createEmailTemplate(
        "New Foundation Registration",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">A new Foundation Classes registration has been submitted.</p>
         ${detailBlock([
           ["Name", registration.fullName],
           ["Email", registration.email],
           ["Phone", registration.phone],
           ["Preferred Session", registration.preferredSession],
           ["Registration Date", formatDate(registration.registrationDate)],
           ...(registration.questions ? [["Questions", registration.questions]] : []),
         ])}
         <p style="text-align:center;margin:28px 0;">
           <a href="${process.env.ADMIN_URL || "https://victorybiblechurch.org/admin"}/members?tab=foundation"
              style="background:${BRAND.red};color:${BRAND.white};padding:12px 24px;text-decoration:none;border-radius:2px;font-size:14px;font-weight:600;display:inline-block;">
             Review in Admin Dashboard
           </a>
         </p>`
      ),
    });
  } catch (error) {
    console.error("Error sending foundation class registration emails:", error);
  }
};

// ─── Membership approval (admin-triggered) ───────────────────────────────────

const sendMembershipApprovalEmail = async (renewal) => {
  if (!renewal?.email || !renewal?.fullName) {
    throw new Error("Missing required renewal data");
  }

  try {
    await sendEmail({
      to: renewal.email,
      subject: "Your Membership Renewal Has Been Approved — Victory Bible Church",
      text: `Dear ${renewal.fullName}, your membership renewal has been approved. Welcome back to the VBC family!`,
      html: createEmailTemplate(
        "Membership Renewed",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${renewal.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Great news — your membership renewal with Victory Bible Church has been <strong>approved</strong>. Thank you for your continued commitment to our community.</p>
         ${detailBlock([
           ["Name", renewal.fullName],
           ["Member Since", renewal.memberSince],
           ["Renewal Date", formatDate(renewal.renewalDate)],
           ["Status", "✓ Approved"],
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">We encourage you to stay connected and be an active part of our church family. There are many ways to serve and grow — reach out to our office if you'd like to get more involved.</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless you,<br><strong>Victory Bible Church</strong></p>`
      ),
    });
  } catch (error) {
    console.error("Error sending membership approval email:", error);
  }
};

// ─── Foundation class completion (admin-triggered) ───────────────────────────

const sendFoundationClassCompletionEmail = async (registration) => {
  if (!registration?.email || !registration?.fullName) {
    throw new Error("Missing required registration data");
  }

  try {
    await sendEmail({
      to: registration.email,
      subject: "Congratulations — You've Completed Foundation Classes!",
      text: `Dear ${registration.fullName}, congratulations on completing Foundation Classes. Welcome to the VBC family!`,
      html: createEmailTemplate(
        "Welcome to the Family",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${registration.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;"><strong>Congratulations!</strong> You have successfully completed all Foundation Classes at Victory Bible Church. This is a significant milestone in your faith journey and we are truly proud of your commitment.</p>
         <div style="border-left:3px solid ${BRAND.red};background:#fef2f2;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
           <p style="margin:0;color:#991b1b;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">New Member Confirmed</p>
           <p style="margin:8px 0 0;color:#374151;font-size:14px;">You are now an official member of Victory Bible Church.</p>
         </div>
         <p style="color:#374151;font-size:15px;line-height:1.7;">As a member, you are invited to:</p>
         <ul style="color:#374151;font-size:15px;line-height:1.9;padding-left:20px;">
           <li>Participate in church decision meetings</li>
           <li>Serve in ministry areas that match your gifts</li>
           <li>Access member-specific resources and support</li>
           <li>Grow deeper in community with the VBC family</li>
         </ul>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Reach out to our office anytime — we're here to walk this journey with you.</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">In Christ,<br><strong>Victory Bible Church</strong></p>`
      ),
    });
  } catch (error) {
    console.error("Error sending foundation class completion email:", error);
  }
};

// ─── Cell group join request ─────────────────────────────────────────────────

const sendCellGroupJoinRequestEmails = async (request, cellGroup) => {
  if (!request?.email || !request?.name) {
    throw new Error("Missing required request data: email and name are required");
  }
  if (!cellGroup?.name || !cellGroup?.leader) {
    throw new Error("Missing required cell group data: name and leader are required");
  }

  try {
    await sendEmail({
      to: request.email,
      subject: `Cell Group Join Request Received — ${cellGroup.name}`,
      text: `Dear ${request.name}, your request to join ${cellGroup.name} has been received.`,
      html: createEmailTemplate(
        "Join Request Received",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${request.name},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Thank you for your interest in joining the <strong>${cellGroup.name}</strong> cell group. Your request has been received and the group leader will be in touch with you shortly.</p>
         ${detailBlock([
           ["Cell Group", cellGroup.name],
           ["Leader", cellGroup.leader],
           ["Meeting Day", cellGroup.meetingDay || "Contact leader for details"],
           ["Meeting Time", cellGroup.meetingTime || "Contact leader for details"],
           ["Location", cellGroup.location],
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });

    await sendEmail({
      to: cellGroup.leaderContact || process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Join Request for ${cellGroup.name}`,
      text: `${request.name} has requested to join your cell group.`,
      html: createEmailTemplate(
        "New Cell Group Join Request",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${cellGroup.leader},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">Someone has requested to join your cell group <strong>${cellGroup.name}</strong>. Please reach out to them soon.</p>
         ${detailBlock([
           ["Name", request.name],
           ["Email", request.email],
           ["Phone", request.phone],
           ...(request.whatsapp ? [["WhatsApp", request.whatsapp]] : []),
           ...(request.message ? [["Message", request.message]] : []),
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });
  } catch (error) {
    console.error("Error sending cell group join request emails:", error);
  }
};

// ─── Support request ─────────────────────────────────────────────────────────

const sendSupportRequestEmail = async (supportData) => {
  if (!supportData?.name || !supportData?.email || !supportData?.subject || !supportData?.message) {
    throw new Error("Missing required support request data");
  }

  const { name, email, subject, message, priority = "medium" } = supportData;

  const priorityColor = {
    urgent: "#dc2626",
    high: "#ea580c",
    medium: "#0284c7",
    low: "#059669",
  }[priority] || "#0284c7";

  await sendEmail({
    to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
    subject: `[${priority.toUpperCase()}] Support: ${subject}`,
    text: `From: ${name} (${email})\n\n${message}`,
    html: createEmailTemplate(
      "Support Request",
      priorityColor,
      `<p style="color:#374151;font-size:15px;line-height:1.7;"><strong>From:</strong> ${name} (<a href="mailto:${email}" style="color:${BRAND.red};">${email}</a>)</p>
       <p style="color:#374151;font-size:15px;line-height:1.7;"><strong>Priority:</strong> <span style="color:${priorityColor};font-weight:600;text-transform:uppercase;">${priority}</span></p>
       <p style="color:#374151;font-size:15px;line-height:1.7;"><strong>Subject:</strong> ${subject}</p>
       <div style="background:${BRAND.lightBg};border:1px solid ${BRAND.border};padding:16px 20px;margin:20px 0;border-radius:4px;">
         <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">${message.replace(/\n/g, "<br>")}</p>
       </div>`
    ),
  });
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
