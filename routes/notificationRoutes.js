const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth-middleware");
const { sendEmail } = require("../utils/emailService");

const BRAND = {
  dark: "#0a0a0a",
  red: "#dc2626",
  white: "#ffffff",
  lightBg: "#f9fafb",
  border: "#e5e7eb",
  mutedText: "#6b7280",
  darkMuted: "#9ca3af",
};

/** Branded email wrapper shared by all notification types */
function baseTemplate(headerTitle, accentColor, content) {
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

    <div style="height:4px;background:${accent};"></div>

    <div style="background:${BRAND.dark};padding:32px 24px;text-align:center;">
      ${logoUrl ? `<img src="${logoUrl}" alt="Victory Bible Church" style="height:50px;width:auto;display:block;margin:0 auto 16px;" />` : ""}
      <p style="margin:0 0 6px;color:${BRAND.darkMuted};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;">Victory Bible Church</p>
      <h1 style="margin:0;color:${BRAND.white};font-size:22px;font-weight:700;letter-spacing:-0.02em;">${headerTitle}</h1>
    </div>

    <div style="padding:36px 32px;background:${BRAND.white};">
      ${content}
    </div>

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
}

/** Left-bordered detail card */
function detailCard(items, accentColor) {
  const accent = accentColor || BRAND.red;
  const rows = items
    .filter(([, v]) => v != null && v !== "")
    .map(([label, value]) => `
      <tr>
        <td style="padding:6px 0;color:${BRAND.mutedText};font-size:13px;width:150px;vertical-align:top;">${label}</td>
        <td style="padding:6px 0;color:#111827;font-size:13px;font-weight:500;vertical-align:top;">${value}</td>
      </tr>`)
    .join("");

  return `
    <div style="border-left:3px solid ${accent};background:${BRAND.lightBg};padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
      <table style="border-collapse:collapse;width:100%;"><tbody>${rows}</tbody></table>
    </div>`;
}

function greeting(name) {
  return `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">Dear ${name},</p>`;
}

function signature() {
  return `<p style="color:#374151;font-size:15px;line-height:1.7;margin:20px 0 0;">God bless,<br><strong>Victory Bible Church</strong></p>`;
}

function para(text) {
  return `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">${text}</p>`;
}

/**
 * POST /api/notifications/send
 * Body: { type, recipient: { email, name, phone }, data: {...} }
 */
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { type, recipient, data } = req.body;

    if (!type || !recipient?.email) {
      return res.status(400).json({ message: "Missing required fields: type and recipient.email" });
    }

    const emailContent = getEmailContent(type, recipient, data || {});

    await sendEmail({
      to: recipient.email,
      subject: emailContent.subject,
      html: emailContent.body,
      text: `Please view this email in an HTML-capable client. Subject: ${emailContent.subject}`,
    });

    return res.status(200).json({ message: "Notification sent successfully" });
  } catch (error) {
    console.error("Error in notification route:", error.message);
    return res.status(500).json({
      message: "Failed to send notification",
      error: error.message,
    });
  }
});

function getEmailContent(type, recipient, data) {
  const { name } = recipient;

  // ── Event signup patterns (baptism_signup_approved, babyDedication_signup_declined, etc.) ──
  const approvedMatch = type.match(/^(.+)_signup_approved$/);
  const declinedMatch = type.match(/^(.+)_signup_declined$/);

  if (approvedMatch) {
    const eventType = approvedMatch[1];
    const eventTitle = data.eventTitle || "the event";

    const eventDetails = detailCard([
      ["Event",    data.eventTitle],
      ["Date",     data.eventDate],
      ["Time",     data.eventTime],
      ["Location", data.eventLocation],
    ]);

    if (eventType === "baptism") {
      return {
        subject: "Your Baptism Request Has Been Approved",
        body: baseTemplate("Baptism Approved", BRAND.red, `
          ${greeting(name)}
          ${para("We are delighted to confirm that your baptism request has been <strong>approved</strong>. This is a beautiful step in your walk of faith — we are honoured to share it with you.")}
          ${eventDetails}
          <div style="border-left:3px solid #fbbf24;background:#fffbeb;padding:14px 18px;margin:20px 0;border-radius:0 4px 4px 0;">
            ${para("<strong>Please remember to bring:</strong> a change of clothes, a towel, and a plastic bag for wet items. Arrive 30 minutes before the scheduled time.")}
          </div>
          ${para("If you have any questions, please don't hesitate to contact our church office.")}
          ${signature()}
        `),
      };
    }

    if (eventType === "babyDedication") {
      return {
        subject: "Your Baby Dedication Request Has Been Approved",
        body: baseTemplate("Baby Dedication Approved", BRAND.red, `
          ${greeting(name)}
          ${para("What a blessing! Your baby dedication request has been <strong>approved</strong>. We are so honoured to celebrate this moment with your family.")}
          ${detailCard([
            ["Event",        data.eventTitle],
            ["Date",         data.eventDate],
            ["Time",         data.eventTime],
            ["Location",     data.eventLocation],
            ...(data.childName ? [["Child's Name", data.childName]] : []),
          ])}
          ${para("Please arrive 15 minutes before the scheduled time. We look forward to praying over your child and family.")}
          ${para("Feel free to contact our church office if you have any questions.")}
          ${signature()}
        `),
      };
    }

    // Generic event approval
    return {
      subject: `Your Registration for ${eventTitle} Has Been Approved`,
      body: baseTemplate("Registration Approved", BRAND.red, `
        ${greeting(name)}
        ${para(`We are pleased to confirm that your registration for <strong>${eventTitle}</strong> has been approved.`)}
        ${eventDetails}
        ${para("We look forward to seeing you. If anything changes or you have questions, please contact our office.")}
        ${signature()}
      `),
    };
  }

  if (declinedMatch) {
    const eventTitle = data.eventTitle || "the event";
    return {
      subject: `Regarding Your Registration for ${eventTitle}`,
      body: baseTemplate("Registration Update", "#6b7280", `
        ${greeting(name)}
        ${para(`Thank you for your interest in <strong>${eventTitle}</strong> at Victory Bible Church.`)}
        ${para("We were unable to confirm your registration at this time. Please contact our church office and we would be happy to assist you or find a suitable alternative.")}
        ${data.reason ? para(`<em>Additional information: ${data.reason}</em>`) : ""}
        ${signature()}
      `),
    };
  }

  // ── Named notification types ──────────────────────────────────────────────
  switch (type) {

    case "membership_renewal_approved":
      return {
        subject: "Your Membership Renewal Has Been Approved",
        body: baseTemplate("Membership Renewed", BRAND.red, `
          ${greeting(name)}
          ${para("Great news — your membership renewal with Victory Bible Church has been <strong>approved</strong>. Thank you for your continued commitment to our community.")}
          ${detailCard([
            ["Member Since",   data.memberSince],
            ["Renewal Date",   data.renewalDate ? new Date(data.renewalDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""],
            ["Status",         "✓ Approved"],
          ])}
          ${para("We encourage you to stay connected and active in our church family. There are many ways to serve — reach out to our office if you'd like to get more involved.")}
          ${signature()}
        `),
      };

    case "membership_renewal_declined":
      return {
        subject: "Regarding Your Membership Renewal",
        body: baseTemplate("Membership Renewal Update", "#6b7280", `
          ${greeting(name)}
          ${para("Thank you for submitting your membership renewal. We need to clarify a few details before we can process it further.")}
          ${para("Please contact our church office at your earliest convenience and we'll be happy to assist you.")}
          ${data.reason ? para(`<em>Additional information: ${data.reason}</em>`) : ""}
          ${signature()}
        `),
      };

    case "foundation_class_approved":
      return {
        subject: "Welcome to Foundation Classes — Your Enrollment is Confirmed",
        body: baseTemplate("Enrollment Confirmed", BRAND.red, `
          ${greeting(name)}
          ${para("We're excited to confirm your enrollment in <strong>Foundation Classes</strong> at Victory Bible Church. These classes will give you a strong biblical foundation and prepare you for active church membership.")}
          ${detailCard([
            ["Location",   data.schedule?.location || "Church Main Building"],
            ["Start Date", data.schedule?.startDate || "Contact office for details"],
            ["Time",       data.schedule?.time || "Contact office for details"],
            ["Day",        data.schedule?.day || ""],
          ])}
          ${para("Please arrive 15 minutes early for your first session and bring a Bible, a notebook, and a pen.")}
          ${para("If you need to reschedule or have any questions, please don't hesitate to contact our church office.")}
          ${signature()}
        `),
      };

    case "foundation_class_completed":
      return {
        subject: "Congratulations — You've Completed Foundation Classes!",
        body: baseTemplate("Welcome to the Family", BRAND.red, `
          ${greeting(name)}
          ${para("<strong>Congratulations!</strong> You have successfully completed all Foundation Classes. This is a significant milestone and we are so proud of your commitment to grow in faith.")}
          <div style="border-left:3px solid ${BRAND.red};background:#fef2f2;padding:16px 20px;margin:20px 0;border-radius:0 4px 4px 0;">
            <p style="margin:0 0 4px;color:#991b1b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">New Member Confirmed</p>
            <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">You are now an official member of Victory Bible Church.</p>
          </div>
          ${para("As a member, you are invited to:")}
          <ul style="color:#374151;font-size:15px;line-height:1.9;padding-left:20px;margin:0 0 16px;">
            <li>Participate in church decision meetings</li>
            <li>Serve in ministry areas that match your gifts</li>
            <li>Access member-specific resources and support</li>
            <li>Grow deeper in community with the VBC family</li>
          </ul>
          ${para("We look forward to walking this journey alongside you. Welcome to the family!")}
          ${signature()}
        `),
      };

    case "foundation_class_cancelled":
      return {
        subject: "Regarding Your Foundation Class Enrollment",
        body: baseTemplate("Enrollment Update", "#6b7280", `
          ${greeting(name)}
          ${para("We are contacting you regarding your Foundation Classes enrollment at Victory Bible Church.")}
          ${para("We need to discuss some details. Please contact our church office at your earliest convenience and we'll be happy to assist.")}
          ${data.reason ? para(`<em>Additional information: ${data.reason}</em>`) : ""}
          ${signature()}
        `),
      };

    case "discipleship_registration_approved":
      return {
        subject: "Your Discipleship Class Registration Has Been Approved",
        body: baseTemplate("Registration Approved", BRAND.red, `
          ${greeting(name)}
          ${para(`We are pleased to confirm that your registration for <strong>${data.className || "Discipleship Classes"}</strong> has been <strong>approved</strong>.`)}
          ${detailCard([
            ["Class",   data.className],
            ["Level",   data.level],
            ["Session", data.preferredSession],
            ["Status",  "✓ Approved"],
          ])}
          ${para("Our team will be in touch shortly with session details and next steps. In the meantime, feel free to contact our church office if you have any questions.")}
          ${para("We look forward to growing in faith together with you.")}
          ${signature()}
        `),
      };

    case "discipleship_registration_rejected":
      return {
        subject: "Regarding Your Discipleship Class Registration",
        body: baseTemplate("Registration Update", "#6b7280", `
          ${greeting(name)}
          ${para(`Thank you for your interest in <strong>${data.className || "Discipleship Classes"}</strong> at Victory Bible Church.`)}
          ${para("We were unable to confirm your registration at this time. Please contact our church office — we'd love to find the right fit for you and help you take the next step in your faith journey.")}
          ${signature()}
        `),
      };

    default:
      return {
        subject: "Notification from Victory Bible Church",
        body: baseTemplate("Notification", BRAND.red, `
          ${greeting(name)}
          ${para("This is a notification from Victory Bible Church. Please contact our church office for more information.")}
          ${signature()}
        `),
      };
  }
}

module.exports = router;
