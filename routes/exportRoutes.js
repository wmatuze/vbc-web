const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth-middleware");
const MemberRenewal = require("../models/MemberRenewal");
const FoundationClassRegistration = require("../models/FoundationClassRegistration");
const json2csv = require("json2csv").Parser;

/**
 * @route GET /api/export/members/approved
 * @desc Export approved members as CSV
 * @access Private (Admin only)
 */
router.get("/members/approved", authMiddleware, async (req, res) => {
  try {
    // Find all approved membership renewals
    const approvedMembers = await MemberRenewal.find({
      status: "approved",
    }).sort({ renewalDate: -1 });

    if (approvedMembers.length === 0) {
      return res.status(404).json({ message: "No approved members found" });
    }

    // Format data for CSV
    const membersData = approvedMembers.map((member) => ({
      Name: member.fullName,
      Email: member.email,
      Phone: member.phone,
      Birthday: new Date(member.birthday).toLocaleDateString(),
      "Member Since": member.memberSince,
      "Renewal Date": new Date(member.renewalDate).toLocaleDateString(),
      "Ministry Involvement": member.ministryInvolvement || "None specified",
      "Address Changed": member.addressChange ? "Yes" : "No",
      "New Address": member.newAddress || "N/A",
    }));

    // Convert to CSV
    const fields = [
      "Name",
      "Email",
      "Phone",
      "Birthday",
      "Member Since",
      "Renewal Date",
      "Ministry Involvement",
      "Address Changed",
      "New Address",
    ];
    const json2csvParser = new json2csv({ fields });
    const csv = json2csvParser.parse(membersData);

    // Set response headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=approved_members_${new Date().toISOString().slice(0, 10)}.csv`
    );

    // Send CSV data
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting approved members:", error);
    return res.status(500).json({
      message: "Failed to export approved members",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/export/foundation-classes/completed
 * @desc Export members who have completed foundation classes
 * @access Private (Admin only)
 */
router.get(
  "/foundation-classes/completed",
  authMiddleware,
  async (req, res) => {
    try {
      // Find all completed foundation class registrations
      const completedMembers = await FoundationClassRegistration.find({
        status: "completed",
      }).sort({ updatedAt: -1 });

      if (completedMembers.length === 0) {
        return res
          .status(404)
          .json({ message: "No completed foundation class members found" });
      }

      // Format data for CSV
      const membersData = completedMembers.map((member) => ({
        Name: member.fullName,
        Email: member.email,
        Phone: member.phone,
        "Registration Date": new Date(
          member.registrationDate
        ).toLocaleDateString(),
        "Completed Date": new Date(member.updatedAt).toLocaleDateString(),
        "Preferred Session": member.preferredSession,
        Questions: member.questions || "None",
      }));

      // Convert to CSV
      const fields = [
        "Name",
        "Email",
        "Phone",
        "Registration Date",
        "Completed Date",
        "Preferred Session",
        "Questions",
      ];
      const json2csvParser = new json2csv({ fields });
      const csv = json2csvParser.parse(membersData);

      // Set response headers for file download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=foundation_class_graduates_${new Date().toISOString().slice(0, 10)}.csv`
      );

      // Send CSV data
      return res.status(200).send(csv);
    } catch (error) {
      console.error("Error exporting foundation class graduates:", error);
      return res.status(500).json({
        message: "Failed to export foundation class graduates",
        error: error.message,
      });
    }
  }
);

module.exports = router;
