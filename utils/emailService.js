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
  console.error("EMAIL_USER and EMAIL_PASSWORD must be set as environment variables");
  process.exit(1);
}

// Always use Gmail — credentials are a Gmail app password in all environments
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ─── Core sender ─────────────────────────────────────────────────────────────

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "Victory Bible Church <no-reply@victorybiblechurch.org>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments,
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

// ─── Visitor / first-timer connection card ───────────────────────────────────

const sendVisitorRegistrationEmails = async (visitor) => {
  const name = visitor.fullName || "Friend";
  const displayName = [visitor.title, visitor.fullName].filter(Boolean).join(" ");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org";

  // ── Visitor confirmation ──
  if (visitor.email) {
    await sendEmail({
      to: visitor.email,
      subject: "Welcome to Victory Bible Church — We're Glad You Came!",
      text: `Dear ${name}, thank you for visiting Victory Bible Church. We are so glad you were with us!`,
      html: createEmailTemplate(
        "Welcome to VBC",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${displayName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           Thank you for visiting <strong>Victory Bible Church</strong>. We are so glad you were with us and we hope your experience was everything you expected and more.
         </p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           Your connection card has been received. ${visitor.requestContact ? "Someone from our team will be in touch with you soon." : "We would love to stay connected with you."}
         </p>
         <div style="border-left:3px solid ${BRAND.red};background:#fef2f2;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
           <p style="margin:0 0 4px;color:#991b1b;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Our Vision</p>
           <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;font-style:italic;">"Winning a Generation for Christ."</p>
         </div>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           We meet every Sunday at 9:30 AM at Off Chiwala Road, CBU East Gate, Kitwe. We would love to see you again!
         </p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           God bless you,<br>
           <strong>Bishop Cyrus &amp; Pastor Getrude Simwanza</strong><br>
           Victory Bible Church, Kitwe
         </p>`
      ),
    });
  }

  // ── Admin notification ──
  const childrenList = visitor.children?.filter(Boolean).join(", ") || "—";
  await sendEmail({
    to: adminEmail,
    subject: `New First-Timer Connection Card: ${displayName}`,
    text: `New visitor connection card from ${displayName}.`,
    html: createEmailTemplate(
      "New Visitor Connection Card",
      BRAND.red,
      `<p style="color:#374151;font-size:15px;line-height:1.7;">A new visitor has submitted their connection card.</p>
       ${detailBlock([
         ["Name",           displayName],
         ["Age Group",      visitor.ageGroup   || "—"],
         ["Marital Status", visitor.maritalStatus || "—"],
         ["Phone",          visitor.phone      || "—"],
         ["Email",          visitor.email      || "—"],
         ["Address",        visitor.address    || "—"],
         ["Birthday",       visitor.birthday   || "—"],
         ["Has Children",   visitor.hasChildren ? `Yes — ${childrenList}` : "No"],
         ["Wants Contact",  visitor.requestContact ? "Yes" : "No"],
         ["Accepted Jesus", visitor.acceptedJesus === true ? "Yes" : visitor.acceptedJesus === false ? "No" : "—"],
         ["Decision Today", visitor.wantToAccept === "yes" ? "Yes" : visitor.wantToAccept === "not-today" ? "Not Today" : "—"],
         ["Visit Date",     formatDate(visitor.visitDate)],
       ])}
       <p style="text-align:center;margin:28px 0;">
         <a href="${process.env.ADMIN_URL || "https://victorybiblechurch.org/admin"}/members?tab=visitors"
            style="background:${BRAND.red};color:${BRAND.white};padding:12px 24px;text-decoration:none;border-radius:2px;font-size:14px;font-weight:600;display:inline-block;">
           View in Admin Dashboard
         </a>
       </p>`
    ),
  });
};

// ─── Discipleship completion certificate ──────────────────────────────────────

const buildCertificateHTML = ({ studentName, className, classLevel, duration, facilitator, cohortName, completedDate }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Dancing+Script:wght@700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 297mm; height: 210mm; overflow: hidden; background: #f9f7f2; }
    .page { width: 297mm; height: 210mm; position: relative; background: #f9f7f2; overflow: hidden; }
    .layout { position: absolute; inset: 0; display: flex; }
    .left-col { width: 255px; flex-shrink: 0; position: relative; }
    .content {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 28px 52px 28px 36px; text-align: center; position: relative; z-index: 2;
    }
    .cert-title {
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: 38px; font-weight: 700; letter-spacing: 0.18em; color: #0a0a0a; line-height: 1; margin-bottom: 4px;
    }
    .cert-subtitle {
      font-family: 'Cinzel', 'Times New Roman', serif;
      font-size: 13px; font-weight: 400; letter-spacing: 0.35em; color: #444; margin-bottom: 16px;
    }
    .gold-rule {
      width: 220px; height: 1px;
      background: linear-gradient(90deg, transparent, #c9a84c 20%, #c9a84c 80%, transparent);
      margin: 0 auto 16px;
    }
    .presented-to {
      font-family: 'Lato', Arial, sans-serif;
      font-size: 12px; font-weight: 300; color: #999; letter-spacing: 0.06em; margin-bottom: 4px;
    }
    .student-name {
      font-family: 'Dancing Script', cursive;
      font-size: 54px; font-weight: 700; color: #c9a84c; line-height: 1.1; margin-bottom: 12px;
    }
    .completed-text {
      font-family: 'Lato', Arial, sans-serif;
      font-size: 12px; font-weight: 300; color: #666; margin-bottom: 5px;
    }
    .course-name {
      font-family: 'Cinzel', serif;
      font-size: 14px; font-weight: 600; color: #0a0a0a; letter-spacing: 0.05em; margin-bottom: 4px;
    }
    .course-meta { font-family: 'Lato', Arial, sans-serif; font-size: 10px; color: #999; letter-spacing: 0.08em; margin-bottom: 14px; }
    .date-location { font-family: 'Cinzel', serif; font-size: 12px; font-weight: 600; color: #444; letter-spacing: 0.05em; margin-bottom: 22px; }
    .signatures { display: flex; justify-content: center; gap: 60px; }
    .sig-item { text-align: center; width: 150px; }
    .sig-line { width: 130px; height: 1px; background: #c9a84c; margin: 0 auto 8px; }
    .sig-name { font-family: 'Cinzel', serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #0a0a0a; }
    .sig-role { font-family: 'Lato', Arial, sans-serif; font-size: 9px; letter-spacing: 0.15em; color: #999; text-transform: uppercase; margin-top: 3px; }
  </style>
</head>
<body>
<div class="page">

  <!-- Background geometric shapes -->
  <svg style="position:absolute;inset:0;width:100%;height:100%;" viewBox="0 0 1122 793" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="0,0 310,0 220,793 0,793" fill="#0a0a0a"/>
    <polygon points="0,0 200,0 130,793 0,793" fill="#dc2626" opacity="0.10"/>
    <polygon points="285,0 345,0 260,793 200,793" fill="#ffffff" opacity="0.04"/>
  </svg>

  <!-- Gold seal -->
  <svg style="position:absolute;left:52px;top:50%;transform:translateY(-50%);z-index:3;" width="152" height="152" viewBox="0 0 152 152" xmlns="http://www.w3.org/2000/svg">
    <circle cx="76" cy="76" r="73" fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-dasharray="5 3"/>
    <circle cx="76" cy="76" r="67" fill="none" stroke="#c9a84c" stroke-width="2"/>
    <circle cx="76" cy="76" r="64" fill="#c9a84c" fill-opacity="0.10"/>
    <!-- 5-pointed star (outer r=43, inner r=18) -->
    <polygon points="76,33 87,61 116,63 93,82 101,110 76,94 51,110 59,82 36,63 65,61" fill="#c9a84c"/>
    <!-- Inner dark circle -->
    <circle cx="76" cy="76" r="31" fill="#0e0e0e"/>
    <circle cx="76" cy="76" r="28" fill="none" stroke="#c9a84c" stroke-width="1.2"/>
    <text x="76" y="85" text-anchor="middle" font-size="26" fill="#c9a84c" font-family="serif">✦</text>
  </svg>

  <div class="layout">
    <div class="left-col">
      <!-- Church wordmark -->
      <div style="position:absolute;top:22px;left:18px;z-index:4;">
        <div style="line-height:1;white-space:nowrap;">
          <span style="font-family:'Cinzel',serif;font-size:30px;font-weight:900;color:#c9a84c;vertical-align:middle;">V</span><span style="font-family:'Cinzel',serif;font-size:12px;font-weight:400;letter-spacing:0.08em;color:#ffffff;vertical-align:middle;">ictory Bible Church</span>
        </div>
        <div style="font-family:'Lato',Arial,sans-serif;font-size:8px;font-weight:300;letter-spacing:0.2em;color:#c9a84c;text-transform:uppercase;margin-top:5px;">Kitwe, Zambia</div>
        <div style="width:110px;height:1px;background:linear-gradient(90deg,#c9a84c,transparent);margin-top:6px;"></div>
      </div>
    </div>
    <div class="content">

      <!-- Laurel wreath -->
      <svg width="66" height="42" viewBox="0 0 66 42" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:10px;">
        <ellipse cx="9"  cy="21" rx="8" ry="3.5" transform="rotate(-15 9 21)"  fill="#c9a84c" opacity="0.9"/>
        <ellipse cx="15" cy="12" rx="8" ry="3.5" transform="rotate(-42 15 12)" fill="#c9a84c" opacity="0.85"/>
        <ellipse cx="23" cy="5"  rx="7" ry="3"   transform="rotate(-64 23 5)"  fill="#c9a84c" opacity="0.8"/>
        <ellipse cx="6"  cy="31" rx="7" ry="3"   transform="rotate(5 6 31)"    fill="#c9a84c" opacity="0.8"/>
        <ellipse cx="57" cy="21" rx="8" ry="3.5" transform="rotate(15 57 21)"  fill="#c9a84c" opacity="0.9"/>
        <ellipse cx="51" cy="12" rx="8" ry="3.5" transform="rotate(42 51 12)"  fill="#c9a84c" opacity="0.85"/>
        <ellipse cx="43" cy="5"  rx="7" ry="3"   transform="rotate(64 43 5)"   fill="#c9a84c" opacity="0.8"/>
        <ellipse cx="60" cy="31" rx="7" ry="3"   transform="rotate(-5 60 31)"  fill="#c9a84c" opacity="0.8"/>
        <line x1="17" y1="38" x2="30" y2="38" stroke="#c9a84c" stroke-width="1"/>
        <circle cx="33" cy="38" r="3" fill="#c9a84c"/>
        <line x1="36" y1="38" x2="49" y2="38" stroke="#c9a84c" stroke-width="1"/>
      </svg>

      <div class="cert-title">CERTIFICATE</div>
      <div class="cert-subtitle">OF COMPLETION</div>
      <div class="gold-rule"></div>
      <div class="presented-to">Proudly presented to :</div>
      <div class="student-name">${studentName}</div>
      <div class="completed-text">has successfully completed the discipleship course</div>
      <div class="course-name">${className}</div>
      ${(classLevel || duration || cohortName)
        ? `<div class="course-meta">${[classLevel && `Level: ${classLevel.charAt(0).toUpperCase() + classLevel.slice(1)}`, duration, cohortName].filter(Boolean).join(" · ")}</div>`
        : `<div style="height:14px;"></div>`}
      <div class="date-location">Kitwe, ${completedDate}</div>

      <div class="signatures">
        <div class="sig-item">
          <div class="sig-line"></div>
          <div class="sig-name">Bishop Cyrus Simwanza</div>
          <div class="sig-role">Senior Pastor</div>
        </div>
        <div class="sig-item">
          <div class="sig-line"></div>
          <div class="sig-name">${facilitator}</div>
          <div class="sig-role">Course Facilitator</div>
        </div>
      </div>

    </div>
  </div>
</div>
</body>
</html>`;

const generateCertificatePDF = async (data) => {
  const puppeteer = require("puppeteer");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(buildCertificateHTML(data), { waitUntil: "networkidle0" });
    await page.evaluateHandle("document.fonts.ready");
    const pdfBuffer = await page.pdf({
      width: "297mm",
      height: "210mm",
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

const sendDiscipleshipCertificate = async (registration) => {
  const studentName   = registration.fullName || "Student";
  const className     = registration.classId?.title     || registration.className     || "Discipleship Class";
  const classLevel    = registration.classId?.level     || "";
  const duration      = registration.classId?.durationDisplay || "";
  const facilitator   = registration.sessionId?.facilitator?.name || registration.facilitator || "Course Facilitator";
  const cohortName    = registration.sessionId?.cohortName  || "";
  const completedDate = formatDate(new Date());

  const pdfBuffer = await generateCertificatePDF({
    studentName, className, classLevel, duration, facilitator, cohortName, completedDate,
  });

  const firstName = studentName.split(" ")[0];

  await sendEmail({
    to: registration.email,
    subject: `Certificate of Completion — ${className} · Victory Bible Church`,
    text: `Congratulations ${studentName}! You have successfully completed ${className} at Victory Bible Church. Please find your certificate of completion attached.`,
    html: createEmailTemplate(
      `Congratulations, ${firstName}!`,
      BRAND.red,
      `<p style="color:#374151;font-size:15px;line-height:1.7;">
         We are so proud of your commitment and dedication. Completing <strong>${className}</strong> is a significant milestone in your walk with Christ — this is just the beginning of deeper service and growth.
       </p>
       <p style="color:#374151;font-size:15px;line-height:1.7;margin-top:16px;">
         Your certificate of completion is attached as a PDF. You can save or print it for your records.
       </p>
       <p style="color:#374151;font-size:15px;line-height:1.7;margin-top:16px;">
         God bless,<br><strong>Victory Bible Church</strong>
       </p>`
    ),
    attachments: [
      {
        filename: `Certificate — ${className}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};

// ─── Event signup request confirmation ───────────────────────────────────────

const sendEventSignupRequestEmails = async (request, event) => {
  if (!request?.email || !request?.fullName) {
    throw new Error("Missing required signup data: email and fullName are required");
  }

  const isBaptism       = request.eventType === "baptism";
  const isBabyDedication = request.eventType === "babyDedication";

  const eventTitle = event?.title || "the upcoming event";
  const eventDate  = event?.startDate ? formatDate(event.startDate) : null;

  const subjectSuffix = isBaptism
    ? "Baptism Registration"
    : isBabyDedication
    ? "Baby Dedication Registration"
    : "Event Registration";

  try {
    // ── Registrant confirmation ──────────────────────────────────────────────
    await sendEmail({
      to: request.email,
      subject: `${subjectSuffix} Received — Victory Bible Church`,
      text: `Dear ${request.fullName}, your registration for ${eventTitle} has been received. We will be in touch shortly to confirm your spot.`,
      html: createEmailTemplate(
        "Registration Received",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${request.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           Thank you for registering for <strong>${eventTitle}</strong>. We've received your submission and our team will be in touch shortly to confirm your spot.
         </p>
         ${detailBlock([
           ["Event",   eventTitle],
           ...(eventDate ? [["Date", eventDate]] : []),
           ["Name",    request.fullName],
           ["Phone",   request.phone],
           ...(isBabyDedication && request.childName
             ? [["Child's Name", request.childName]] : []),
           ...(isBabyDedication && request.childDateOfBirth
             ? [["Child's Date of Birth", formatDate(request.childDateOfBirth)]] : []),
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;">If you have any questions in the meantime, feel free to reach out to our church office.</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });

    // ── Admin notification ───────────────────────────────────────────────────
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New ${subjectSuffix}: ${request.fullName}`,
      text: `New ${subjectSuffix.toLowerCase()} from ${request.fullName} (${request.email}) for ${eventTitle}.`,
      html: createEmailTemplate(
        `New ${subjectSuffix}`,
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">A new ${subjectSuffix.toLowerCase()} has been submitted.</p>
         ${detailBlock([
           ["Event",          eventTitle],
           ...(eventDate ? [["Date", eventDate]] : []),
           ["Name",           request.fullName],
           ["Email",          request.email],
           ["Phone",          request.phone],
           ...(isBaptism && request.testimony
             ? [["Testimony", request.testimony]] : []),
           ...(isBaptism && request.previousReligion
             ? [["Previous Religion", request.previousReligion]] : []),
           ...(isBabyDedication && request.childName
             ? [["Child's Name", request.childName]] : []),
           ...(isBabyDedication && request.childDateOfBirth
             ? [["Child's Date of Birth", formatDate(request.childDateOfBirth)]] : []),
           ...(isBabyDedication && request.parentNames
             ? [["Parent Names", request.parentNames]] : []),
           ...(!isBaptism && !isBabyDedication && request.message
             ? [["Message", request.message]] : []),
           ["Submitted", formatDate(request.submittedAt || new Date())],
         ])}
         <p style="text-align:center;margin:28px 0;">
           <a href="${process.env.ADMIN_URL || "https://victorybiblechurch.org/admin"}/requests"
              style="background:${BRAND.red};color:${BRAND.white};padding:12px 24px;text-decoration:none;border-radius:2px;font-size:14px;font-weight:600;display:inline-block;">
             Review in Admin Dashboard
           </a>
         </p>`
      ),
    });
  } catch (error) {
    console.error("Error sending event signup request emails:", error);
  }
};

// ─── Discipleship class registration confirmation ─────────────────────────────

const sendDiscipleshipRegistrationEmails = async (registration) => {
  if (!registration?.email || !registration?.fullName) {
    throw new Error("Missing required data: email and fullName are required");
  }

  const className    = registration.classId?.title     || registration.className     || "Discipleship Class";
  const sessionName  = registration.sessionId?.cohortName || registration.preferredSession || "—";
  const schedule     = registration.sessionId?.schedule
    ? `${registration.sessionId.schedule.day}s at ${registration.sessionId.schedule.time}`
    : null;
  const location     = registration.sessionId?.location || null;
  const facilitator  = registration.sessionId?.facilitator?.name || null;

  try {
    // ── Registrant confirmation ──────────────────────────────────────────────
    await sendEmail({
      to: registration.email,
      subject: `Discipleship Class Registration Received — Victory Bible Church`,
      text: `Dear ${registration.fullName}, your registration for ${className} has been received. We will review it and contact you shortly.`,
      html: createEmailTemplate(
        "Registration Received",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">Dear ${registration.fullName},</p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           Thank you for registering for <strong>${className}</strong>. We're excited to walk this discipleship journey with you.
           Your registration has been received and a facilitator will be in touch shortly to confirm your place.
         </p>
         ${detailBlock([
           ["Class",        className],
           ["Session",      sessionName],
           ["Schedule",     schedule],
           ["Venue",        location],
           ["Facilitator",  facilitator],
           ["Registered",   formatDate(registration.registrationDate || new Date())],
         ])}
         <p style="color:#374151;font-size:15px;line-height:1.7;"><strong>What happens next?</strong></p>
         <ul style="color:#374151;font-size:14px;line-height:2;padding-left:20px;margin:0 0 20px;">
           <li>Your registration will be reviewed by the facilitator.</li>
           <li>You will receive an approval confirmation with final class details.</li>
           <li>Please arrive a few minutes early on your first day.</li>
         </ul>
         <p style="color:#374151;font-size:15px;line-height:1.7;">
           If you have any questions before then, feel free to reach out to our church office.
         </p>
         <p style="color:#374151;font-size:15px;line-height:1.7;">God bless,<br><strong>Victory Bible Church</strong></p>`
      ),
    });

    // ── Admin notification ───────────────────────────────────────────────────
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "admin@victorybiblechurch.org",
      subject: `New Discipleship Registration: ${registration.fullName} — ${className}`,
      text: `New discipleship registration from ${registration.fullName} (${registration.email}) for ${className}.`,
      html: createEmailTemplate(
        "New Discipleship Registration",
        BRAND.red,
        `<p style="color:#374151;font-size:15px;line-height:1.7;">A new discipleship class registration has been submitted.</p>
         ${detailBlock([
           ["Name",          registration.fullName],
           ["Email",         registration.email],
           ["Phone",         registration.phone],
           ["Class",         className],
           ["Session",       sessionName],
           ["Schedule",      schedule],
           ["Venue",         location],
           ["Facilitator",   facilitator],
           ["Previous classes", registration.previousClasses || null],
           ["Motivation",    registration.motivationReason],
           ["Questions",     registration.questions || null],
           ["Emergency contact", registration.emergencyContact
             ? `${registration.emergencyContact.name} (${registration.emergencyContact.relationship}) · ${registration.emergencyContact.phone}`
             : null],
           ["Registered",    formatDate(registration.registrationDate || new Date())],
         ])}
         <p style="text-align:center;margin:28px 0;">
           <a href="${process.env.ADMIN_URL || "https://victorybiblechurch.org/admin"}/requests"
              style="background:${BRAND.red};color:${BRAND.white};padding:12px 24px;text-decoration:none;border-radius:2px;font-size:14px;font-weight:600;display:inline-block;">
             Review in Admin Dashboard
           </a>
         </p>`
      ),
    });
  } catch (error) {
    console.error("Error sending discipleship registration emails:", error);
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
  sendVisitorRegistrationEmails,
  sendEventSignupRequestEmails,
  sendDiscipleshipCertificate,
  sendDiscipleshipRegistrationEmails,
};
