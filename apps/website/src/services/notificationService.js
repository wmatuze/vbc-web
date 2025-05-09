import axios from "axios";
import { getApiUrl, getAuthToken } from "./config";

/**
 * Notification service to handle sending messages to users
 */
class NotificationService {
  /**
   * Send a membership renewal approval notification
   * @param {Object} member - The member object with contact details
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendMembershipApprovalNotification(member) {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: "membership_renewal_approved",
          recipient: {
            email: member.email,
            phone: member.phone,
            name: member.fullName,
          },
          data: {
            memberSince: member.memberSince,
            renewalDate: member.renewalDate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to send membership approval notification:", error);
      throw error;
    }
  }

  /**
   * Send a foundation class enrollment approval with schedule
   * @param {Object} enrollee - The enrollee object with contact details
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendClassScheduleNotification(enrollee) {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: "foundation_class_approved",
          recipient: {
            email: enrollee.email,
            phone: enrollee.phone,
            name: enrollee.fullName,
          },
          data: {
            preferredSession: enrollee.preferredSession,
            // You might want to fetch the actual schedule data from the server
            // or include it in the enrollee object
            schedule: {
              location: "Room 201",
              startDate: enrollee.preferredSession,
              time: "9:00 AM - 10:30 AM",
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to send class schedule notification:", error);
      throw error;
    }
  }

  /**
   * Send a notification when foundation class is completed and member is official
   * @param {Object} enrollee - The enrollee object with contact details
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendClassCompletionNotification(enrollee) {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: "foundation_class_completed",
          recipient: {
            email: enrollee.email,
            phone: enrollee.phone,
            name: enrollee.fullName,
          },
          data: {
            completionDate: new Date().toISOString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to send class completion notification:", error);
      throw error;
    }
  }

  /**
   * Send a membership renewal declined notification
   * @param {Object} member - The member object with contact details
   * @param {String} reason - Optional reason for declining
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendMembershipDeclinedNotification(member, reason = "") {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: "membership_renewal_declined",
          recipient: {
            email: member.email,
            phone: member.phone,
            name: member.fullName,
          },
          data: {
            reason: reason,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to send membership declined notification:", error);
      throw error;
    }
  }

  /**
   * Send a class enrollment cancelled notification
   * @param {Object} enrollee - The enrollee object with contact details
   * @param {String} reason - Optional reason for cancellation
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendClassCancellationNotification(enrollee, reason = "") {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: "foundation_class_cancelled",
          recipient: {
            email: enrollee.email,
            phone: enrollee.phone,
            name: enrollee.fullName,
          },
          data: {
            reason: reason,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to send class cancellation notification:", error);
      throw error;
    }
  }

  /**
   * Send an event signup request approval notification
   * @param {Object} request - The signup request object with contact details
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendEventSignupApprovalNotification(request) {
    try {
      console.log(
        "Sending event signup approval notification for:",
        request.fullName
      );
      console.log("Event type:", request.eventType);
      console.log(
        "Request object structure:",
        JSON.stringify({
          id: request.id,
          eventId: request.eventId,
          eventType: request.eventType,
          email: request.email,
          fullName: request.fullName,
        })
      );

      // Check if eventId is an object or a string
      if (typeof request.eventId === "object") {
        console.log(
          "Event details:",
          JSON.stringify({
            title: request.eventId?.title,
            date: request.eventId?.date,
            time: request.eventId?.time,
            location: request.eventId?.location,
          })
        );
      } else {
        console.log(
          "EventId is not an object, it's a:",
          typeof request.eventId
        );
        console.log("EventId value:", request.eventId);
      }

      const token = getAuthToken();

      // Prepare notification data
      const notificationData = {
        type: `${request.eventType}_signup_approved`,
        recipient: {
          email: request.email,
          phone: request.phone,
          name: request.fullName,
        },
        data: {
          eventTitle: request.eventId?.title || "Event",
          eventDate: request.eventId?.date || "TBD",
          eventTime: request.eventId?.time || "TBD",
          eventLocation: request.eventId?.location || "TBD",
          // Include event-specific data
          ...(request.eventType === "baptism" && {
            testimony: request.testimony,
            previousReligion: request.previousReligion,
          }),
          ...(request.eventType === "babyDedication" && {
            childName: request.childName,
            childDateOfBirth: request.childDateOfBirth,
            parentNames: request.parentNames,
          }),
        },
      };

      console.log(
        "Sending notification with data:",
        JSON.stringify(notificationData)
      );

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        notificationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Notification response:", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error(
        "Failed to send event signup approval notification:",
        error
      );
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send an event signup request declined notification
   * @param {Object} request - The signup request object with contact details
   * @param {String} reason - Optional reason for declining
   * @returns {Promise} - Promise that resolves when notification is sent
   */
  static async sendEventSignupDeclinedNotification(request, reason = "") {
    try {
      const token = getAuthToken();

      const response = await axios.post(
        `${getApiUrl()}/api/notifications/send`,
        {
          type: `${request.eventType}_signup_declined`,
          recipient: {
            email: request.email,
            phone: request.phone,
            name: request.fullName,
          },
          data: {
            eventTitle: request.eventId?.title || "Event",
            reason: reason,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to send event signup declined notification:",
        error
      );
      throw error;
    }
  }
}

export default NotificationService;
