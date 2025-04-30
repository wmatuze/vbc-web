import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

// Services
import RequestsService from "../../services/requestsService";
import NotificationService from "../../services/notificationService";

// Validation
import {
  validateMembershipRenewal,
  validateFoundationClassRegistration,
  validateMembershipStatusChange,
  validateFoundationClassStatusChange,
  validateEventSignupRequest,
  validateEventSignupStatusChange,
} from "../../utils/requestsValidation";

// Components
import RequestsTabs from "./requests/RequestsTabs";
import SearchFilters from "./requests/SearchFilters";
import MembershipTab from "./requests/MembershipTab";
import MembershipDetailsModal from "./requests/MembershipDetailsModal";
import FoundationTab from "./requests/FoundationTab";
import FoundationDetailsModal from "./requests/FoundationDetailsModal";
import EventSignupsTab from "./requests/EventSignupsTab";
import EventSignupDetailsModal from "./requests/EventSignupDetailsModal";

/**
 * RequestsManager component for managing membership renewals, foundation class enrollments, and event signups
 * @returns {JSX.Element} - RequestsManager component
 */
const RequestsManager = () => {
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Active tab state (membership, foundation, or events)
  const [activeTab, setActiveTab] = useState("membership");

  // Membership renewal states
  const [renewals, setRenewals] = useState([]);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [showRenewalDetails, setShowRenewalDetails] = useState(false);

  // Foundation class states
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showEnrollmentDetails, setShowEnrollmentDetails] = useState(false);

  // Event signup request states
  const [eventSignups, setEventSignups] = useState([]);
  const [selectedEventSignup, setSelectedEventSignup] = useState(null);
  const [showEventSignupDetails, setShowEventSignupDetails] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "membership") {
      fetchRenewals();
    } else if (activeTab === "foundation") {
      fetchEnrollments();
    } else if (activeTab === "events") {
      fetchEventSignups();
    }
  }, [activeTab]);

  // Fetch membership renewals
  const fetchRenewals = async () => {
    try {
      setLoading(true);

      const data = await RequestsService.getMembershipRenewals();
      setRenewals(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching membership renewals:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to load membership renewals. Please try again.";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch foundation class enrollments
  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const data = await RequestsService.getFoundationClassRegistrations();
      setEnrollments(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching foundation class enrollments:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to load foundation class enrollments. Please try again.";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch event signup requests
  const fetchEventSignups = async () => {
    try {
      setLoading(true);

      let data;
      if (eventTypeFilter === "all") {
        data = await RequestsService.getEventSignupRequests();
      } else {
        data = await RequestsService.getEventSignupRequestsByType(eventTypeFilter);
      }
      
      setEventSignups(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching event signup requests:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to load event signup requests. Please try again.";
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle membership renewal status change
  const handleMembershipStatusChange = async (id, newStatus) => {
    // Validate the status value
    const { isValid, error } = validateMembershipStatusChange(newStatus);
    if (!isValid) {
      toast.error(`Validation error: ${error}`);
      return;
    }

    try {
      // Update the status on the server
      await RequestsService.updateMembershipRenewalStatus(id, newStatus);

      // Update the local state to reflect the change
      setRenewals(
        renewals.map((renewal) =>
          renewal.id === id ? { ...renewal, status: newStatus } : renewal
        )
      );

      // If the currently selected renewal was updated, update it too
      if (selectedRenewal && selectedRenewal.id === id) {
        setSelectedRenewal({ ...selectedRenewal, status: newStatus });
      }

      // Show success message
      toast.success(`Membership renewal status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating renewal status:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to update status. Please try again.";
      setError(errorMessage);
      toast.error(`Status update failed: ${errorMessage}`);
    }
  };

  // Handle foundation class enrollment status change
  const handleEnrollmentStatusChange = async (id, newStatus) => {
    // Validate the status value
    const { isValid, error } = validateFoundationClassStatusChange(newStatus);
    if (!isValid) {
      toast.error(`Validation error: ${error}`);
      return;
    }

    try {
      // Update the status on the server
      await RequestsService.updateFoundationClassStatus(id, newStatus);

      // Update the local state to reflect the change
      setEnrollments(
        enrollments.map((enrollment) =>
          enrollment.id === id
            ? { ...enrollment, status: newStatus }
            : enrollment
        )
      );

      // If the currently selected enrollment was updated, update it too
      if (selectedEnrollment && selectedEnrollment.id === id) {
        setSelectedEnrollment({ ...selectedEnrollment, status: newStatus });
      }

      // Show success message
      toast.success(`Class enrollment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating enrollment status:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to update status. Please try again.";
      setError(errorMessage);
      toast.error(`Class status update failed: ${errorMessage}`);
    }
  };

  // Handle event signup request status change
  const handleEventSignupStatusChange = async (id, newStatus) => {
    // Validate the status value
    const { isValid, error } = validateEventSignupStatusChange(newStatus);
    if (!isValid) {
      toast.error(`Validation error: ${error}`);
      return;
    }

    try {
      // Update the status on the server
      await RequestsService.updateEventSignupRequestStatus(id, newStatus);

      // Update the local state to reflect the change
      setEventSignups(
        eventSignups.map((signup) =>
          signup.id === id
            ? { ...signup, status: newStatus }
            : signup
        )
      );

      // If the currently selected signup was updated, update it too
      if (selectedEventSignup && selectedEventSignup.id === id) {
        setSelectedEventSignup({ ...selectedEventSignup, status: newStatus });
      }

      // Show success message
      toast.success(`Event signup request status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating event signup status:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to update status. Please try again.";
      setError(errorMessage);
      toast.error(`Event signup status update failed: ${errorMessage}`);
    }
  };

  // Approve and notify member
  const approveAndNotifyMember = async (renewal) => {
    try {
      setActionLoading(true);

      // Validate the renewal data before proceeding
      const { isValid, errors } = validateMembershipRenewal(renewal);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleMembershipStatusChange(renewal.id, "approved");

      // Then send notification
      await NotificationService.sendMembershipApprovalNotification(renewal);

      toast.success(`Approval notification sent to ${renewal.fullName}`);
      setShowRenewalDetails(false);
    } catch (err) {
      console.error("Error approving and notifying member:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Decline and notify member
  const declineAndNotifyMember = async (renewal) => {
    try {
      setActionLoading(true);

      // Validate the renewal data before proceeding
      const { isValid, errors } = validateMembershipRenewal(renewal);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleMembershipStatusChange(renewal.id, "declined");

      // Then send notification
      await NotificationService.sendMembershipDeclinedNotification(renewal);

      toast.info(`Decline notification sent to ${renewal.fullName}`);
      setShowRenewalDetails(false);
    } catch (err) {
      console.error("Error declining and notifying member:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Approve and send schedule to enrollee
  const approveAndSendSchedule = async (enrollment) => {
    try {
      setActionLoading(true);

      // Validate the enrollment data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "attending");

      // Then send notification
      await NotificationService.sendFoundationClassScheduleNotification(
        enrollment
      );

      toast.success(`Schedule sent to ${enrollment.fullName}`);
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error approving and sending schedule:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send schedule";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel and notify enrollee
  const cancelAndNotifyEnrollee = async (enrollment) => {
    try {
      setActionLoading(true);

      // Validate the enrollment data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "cancelled");

      // Then send notification
      await NotificationService.sendFoundationClassCancellationNotification(
        enrollment
      );

      toast.info(`Cancellation notification sent to ${enrollment.fullName}`);
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error cancelling and notifying enrollee:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as completed and notify member
  const completeAndNotifyMember = async (enrollment) => {
    try {
      setActionLoading(true);

      // Validate the enrollment data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "completed");

      // Then send notification
      await NotificationService.sendFoundationClassCompletionNotification(
        enrollment
      );

      toast.success(`Completion notification sent to ${enrollment.fullName}`);
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error completing and notifying member:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Approve and notify event signup request
  const approveAndNotifyEventSignup = async (request) => {
    try {
      setActionLoading(true);

      // Validate the request data before proceeding
      const { isValid, errors } = validateEventSignupRequest(request);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEventSignupStatusChange(request.id, "approved");

      // Then send notification
      await NotificationService.sendEventSignupApprovalNotification(request);

      toast.success(`Approval notification sent to ${request.fullName}`);
      setShowEventSignupDetails(false);
    } catch (err) {
      console.error("Error approving and notifying signup:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Decline and notify event signup request
  const declineAndNotifyEventSignup = async (request) => {
    try {
      setActionLoading(true);

      // Validate the request data before proceeding
      const { isValid, errors } = validateEventSignupRequest(request);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEventSignupStatusChange(request.id, "declined");

      // Then send notification
      await NotificationService.sendEventSignupDeclinedNotification(request);

      toast.info(`Decline notification sent to ${request.fullName}`);
      setShowEventSignupDetails(false);
    } catch (err) {
      console.error("Error declining and notifying signup:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send notification";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a membership renewal
  const deleteMembershipRenewal = async (renewal) => {
    // Validate the renewal data before proceeding
    const { isValid, errors } = validateMembershipRenewal(renewal);
    if (!isValid) {
      const errorMessages = Object.values(errors).join(", ");
      toast.error(`Cannot delete invalid renewal: ${errorMessages}`);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${renewal.fullName}'s membership renewal?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await RequestsService.deleteMembershipRenewal(renewal.id);
      toast.success(
        `${renewal.fullName}'s membership renewal has been deleted`
      );

      // Refresh the list
      fetchRenewals();

      // Close the details modal if open
      if (showRenewalDetails && selectedRenewal?.id === renewal.id) {
        setShowRenewalDetails(false);
      }
    } catch (err) {
      console.error("Error deleting membership renewal:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to delete membership renewal";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a foundation class registration
  const deleteFoundationClassRegistration = async (registration) => {
    // Validate the registration data before proceeding
    const { isValid, errors } =
      validateFoundationClassRegistration(registration);
    if (!isValid) {
      const errorMessages = Object.values(errors).join(", ");
      toast.error(`Cannot delete invalid registration: ${errorMessages}`);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${registration.fullName}'s foundation class registration?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await RequestsService.deleteFoundationClassRegistration(registration.id);
      toast.success(
        `${registration.fullName}'s foundation class registration has been deleted`
      );

      // Refresh the list
      fetchEnrollments();

      // Close the details modal if open
      if (showEnrollmentDetails && selectedEnrollment?.id === registration.id) {
        setShowEnrollmentDetails(false);
      }
    } catch (err) {
      console.error("Error deleting foundation class registration:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to delete foundation class registration";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete an event signup request
  const deleteEventSignupRequest = async (request) => {
    // Validate the request data before proceeding
    const { isValid, errors } = validateEventSignupRequest(request);
    if (!isValid) {
      const errorMessages = Object.values(errors).join(", ");
      toast.error(`Cannot delete invalid request: ${errorMessages}`);
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${request.fullName}'s ${request.eventType} signup request?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await RequestsService.deleteEventSignupRequest(request.id);
      toast.success(
        `${request.fullName}'s ${request.eventType} signup request has been deleted`
      );

      // Refresh the list
      fetchEventSignups();

      // Close the details modal if open
      if (showEventSignupDetails && selectedEventSignup?.id === request.id) {
        setShowEventSignupDetails(false);
      }
    } catch (err) {
      console.error("Error deleting event signup request:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to delete event signup request";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Download members list
  const downloadMembersList = async () => {
    try {
      setActionLoading(true);
      await RequestsService.downloadMembersList();
      toast.success("Members list downloaded successfully");
    } catch (err) {
      console.error("Error downloading members list:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to download members list";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Download foundation class graduates list
  const downloadFoundationGraduatesList = async () => {
    try {
      setActionLoading(true);
      await RequestsService.downloadFoundationGraduatesList();
      toast.success("Foundation class graduates list downloaded successfully");
    } catch (err) {
      console.error("Error downloading graduates list:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to download graduates list";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // View membership renewal details
  const viewRenewalDetails = (renewal) => {
    setSelectedRenewal(renewal);
    setShowRenewalDetails(true);
  };

  // View foundation class enrollment details
  const viewEnrollmentDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEnrollmentDetails(true);
  };

  // View event signup details
  const viewEventSignupDetails = (signup) => {
    setSelectedEventSignup(signup);
    setShowEventSignupDetails(true);
  };

  // Filter membership renewals based on search term and status filter
  const filteredRenewals = renewals.filter((renewal) => {
    const matchesSearch =
      renewal.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renewal.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || renewal.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort membership renewals by date (newest first)
  const sortedRenewals = [...filteredRenewals].sort(
    (a, b) => new Date(b.renewalDate) - new Date(a.renewalDate)
  );

  // Filter foundation class enrollments based on search term and status filter
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const matchesSearch =
      enrollment.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || enrollment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Sort foundation class enrollments by date (newest first)
  const sortedEnrollments = [...filteredEnrollments].sort(
    (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
  );

  // Filter event signup requests based on search term, status filter, and event type filter
  const filteredEventSignups = eventSignups.filter((signup) => {
    const matchesSearch =
      signup.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      signup.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || signup.status === filterStatus;

    const matchesEventType =
      eventTypeFilter === "all" || signup.eventType === eventTypeFilter;

    return matchesSearch && matchesStatus && matchesEventType;
  });

  // Sort event signup requests by date (newest first)
  const sortedEventSignups = [...filteredEventSignups].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  // Loading indicator
  if (
    loading &&
    ((activeTab === "membership" && renewals.length === 0) ||
      (activeTab === "foundation" && enrollments.length === 0) ||
      (activeTab === "events" && eventSignups.length === 0))
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Requests Manager</h2>
        <button
          onClick={
            activeTab === "membership"
              ? fetchRenewals
              : activeTab === "foundation"
              ? fetchEnrollments
              : fetchEventSignups
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <RequestsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Search and Filters */}
      <SearchFilters
        activeTab={activeTab}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        eventTypeFilter={eventTypeFilter}
        setEventTypeFilter={setEventTypeFilter}
        fetchEventSignups={fetchEventSignups}
        downloadMembersList={downloadMembersList}
        downloadFoundationGraduatesList={downloadFoundationGraduatesList}
        actionLoading={actionLoading}
      />

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {activeTab === "membership" ? (
        <MembershipTab
          sortedRenewals={sortedRenewals}
          viewRenewalDetails={viewRenewalDetails}
          approveAndNotifyMember={approveAndNotifyMember}
          declineAndNotifyMember={declineAndNotifyMember}
          deleteMembershipRenewal={deleteMembershipRenewal}
          actionLoading={actionLoading}
        />
      ) : activeTab === "foundation" ? (
        <FoundationTab
          sortedEnrollments={sortedEnrollments}
          viewEnrollmentDetails={viewEnrollmentDetails}
          approveAndSendSchedule={approveAndSendSchedule}
          cancelAndNotifyEnrollee={cancelAndNotifyEnrollee}
          completeAndNotifyMember={completeAndNotifyMember}
          deleteFoundationClassRegistration={deleteFoundationClassRegistration}
          actionLoading={actionLoading}
        />
      ) : (
        <EventSignupsTab
          sortedEventSignups={sortedEventSignups}
          viewEventSignupDetails={viewEventSignupDetails}
          approveAndNotifyEventSignup={approveAndNotifyEventSignup}
          declineAndNotifyEventSignup={declineAndNotifyEventSignup}
          deleteEventSignupRequest={deleteEventSignupRequest}
          actionLoading={actionLoading}
        />
      )}

      {/* Membership Renewal Details Modal */}
      {showRenewalDetails && selectedRenewal && (
        <MembershipDetailsModal
          selectedRenewal={selectedRenewal}
          setShowRenewalDetails={setShowRenewalDetails}
          approveAndNotifyMember={approveAndNotifyMember}
          declineAndNotifyMember={declineAndNotifyMember}
          deleteMembershipRenewal={deleteMembershipRenewal}
          actionLoading={actionLoading}
        />
      )}

      {/* Foundation Class Enrollment Details Modal */}
      {showEnrollmentDetails && selectedEnrollment && (
        <FoundationDetailsModal
          selectedEnrollment={selectedEnrollment}
          setShowEnrollmentDetails={setShowEnrollmentDetails}
          approveAndSendSchedule={approveAndSendSchedule}
          cancelAndNotifyEnrollee={cancelAndNotifyEnrollee}
          completeAndNotifyMember={completeAndNotifyMember}
          deleteFoundationClassRegistration={deleteFoundationClassRegistration}
          actionLoading={actionLoading}
        />
      )}

      {/* Event Signup Request Details Modal */}
      {showEventSignupDetails && selectedEventSignup && (
        <EventSignupDetailsModal
          selectedEventSignup={selectedEventSignup}
          setShowEventSignupDetails={setShowEventSignupDetails}
          approveAndNotifyEventSignup={approveAndNotifyEventSignup}
          declineAndNotifyEventSignup={declineAndNotifyEventSignup}
          deleteEventSignupRequest={deleteEventSignupRequest}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default RequestsManager;
