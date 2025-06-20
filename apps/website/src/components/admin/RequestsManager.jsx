import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

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
import ConfirmationModal from "../common/ConfirmationModal"; // Added import

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

  // Confirmation Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

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
        data =
          await RequestsService.getEventSignupRequestsByType(eventTypeFilter);
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
        err.response?.data?.error ||
        "Failed to update status. Please try again.";
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
          signup.id === id ? { ...signup, status: newStatus } : signup
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
      const { isValid, errors } =
        validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "attending");

      // Then send notification
      await NotificationService.sendClassScheduleNotification(enrollment);

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
      const { isValid, errors } =
        validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "cancelled");

      // Then send notification
      await NotificationService.sendClassCancellationNotification(enrollment);

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
      const { isValid, errors } =
        validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollment.id, "completed");

      // Then send notification
      await NotificationService.sendClassCompletionNotification(enrollment);

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

    setConfirmModalProps({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${renewal.fullName}'s membership renewal? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await RequestsService.deleteMembershipRenewal(renewal.id);
          setRenewals(renewals.filter((r) => r.id !== renewal.id));
          toast.success(
            `${renewal.fullName}'s membership renewal has been deleted.`
          );
          if (selectedRenewal && selectedRenewal.id === renewal.id) {
            setShowRenewalDetails(false);
            setSelectedRenewal(null);
          }
        } catch (err) {
          console.error("Error deleting membership renewal:", err);
          const errorMessage =
            err.response?.data?.error ||
            "Failed to delete renewal. Please try again.";
          setError(errorMessage);
          toast.error(`Delete failed: ${errorMessage}`);
        } finally {
          setActionLoading(false);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
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

    setConfirmModalProps({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${registration.fullName}'s foundation class registration? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await RequestsService.deleteFoundationClassRegistration(
            registration.id
          );
          setEnrollments(enrollments.filter((e) => e.id !== registration.id));
          toast.success(
            `${registration.fullName}'s foundation class registration has been deleted.`
          );
          if (selectedEnrollment && selectedEnrollment.id === registration.id) {
            setShowEnrollmentDetails(false);
            setSelectedEnrollment(null);
          }
        } catch (err) {
          console.error("Error deleting foundation class registration:", err);
          const errorMessage =
            err.response?.data?.error ||
            "Failed to delete registration. Please try again.";
          setError(errorMessage);
          toast.error(`Delete failed: ${errorMessage}`);
        } finally {
          setActionLoading(false);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
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

    setConfirmModalProps({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${request.fullName}'s event signup request for ${request.eventName}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await RequestsService.deleteEventSignupRequest(request.id);
          setEventSignups(eventSignups.filter((s) => s.id !== request.id));
          toast.success(
            `${request.fullName}'s event signup request for ${request.eventName} has been deleted.`
          );
          if (selectedEventSignup && selectedEventSignup.id === request.id) {
            setShowEventSignupDetails(false);
            setSelectedEventSignup(null);
          }
        } catch (err) {
          console.error("Error deleting event signup request:", err);
          const errorMessage =
            err.response?.data?.error ||
            "Failed to delete request. Please try again.";
          setError(errorMessage);
          toast.error(`Delete failed: ${errorMessage}`);
        } finally {
          setActionLoading(false);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
  };

  // Download members list
  const downloadMembersList = async () => {
    try {
      const data = await RequestsService.downloadMembersList();
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "members-list.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Members list downloaded successfully.");
    } catch (err) {
      console.error("Error downloading members list:", err);
      toast.error("Failed to download members list.");
    }
  };

  // Download foundation graduates list
  const downloadFoundationGraduatesList = async () => {
    try {
      const data = await RequestsService.downloadFoundationGraduatesList();
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "foundation-graduates-list.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Foundation graduates list downloaded successfully.");
    } catch (err) {
      console.error("Error downloading foundation graduates list:", err);
      toast.error("Failed to download foundation graduates list.");
    }
  };

  // View renewal details
  const viewRenewalDetails = (renewal) => {
    setSelectedRenewal(renewal);
    setShowRenewalDetails(true);
  };

  // View enrollment details
  const viewEnrollmentDetails = (enrollment) => {
    setSelectedEnrollment(enrollment);
    setShowEnrollmentDetails(true);
  };

  // View event signup details
  const viewEventSignupDetails = (signup) => {
    setSelectedEventSignup(signup);
    setShowEventSignupDetails(true);
  };

  // Filtered data based on search term and status
  const filteredRenewals = renewals.filter(
    (renewal) =>
      (renewal.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renewal.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renewal.phoneNumber?.includes(searchTerm)) &&
      (filterStatus === "all" || renewal.status === filterStatus)
  );

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      (enrollment.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.phoneNumber?.includes(searchTerm)) &&
      (filterStatus === "all" || enrollment.status === filterStatus)
  );

  const filteredEventSignups = eventSignups.filter(
    (signup) =>
      (signup.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.phoneNumber?.includes(searchTerm) ||
        signup.eventName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || signup.status === filterStatus)
  );

  // Refresh data based on active tab
  const refreshData = () => {
    if (activeTab === "membership") {
      fetchRenewals();
    } else if (activeTab === "foundation") {
      fetchEnrollments();
    } else if (activeTab === "events") {
      fetchEventSignups();
    }
  };

  if (
    loading &&
    !renewals.length &&
    !enrollments.length &&
    !eventSignups.length
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-gray-500 animate-spin" />
        <p className="ml-2 text-gray-500">Loading requests...</p>
      </div>
    );
  }

  if (
    error &&
    !renewals.length &&
    !enrollments.length &&
    !eventSignups.length
  ) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-md">
        <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Error Loading Data
        </h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Requests</h1>
        <button
          onClick={refreshData}
          disabled={loading}
          className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
          title="Refresh Data"
        >
          <ArrowPathIcon
            className={`h-6 w-6 text-gray-600 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <RequestsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <SearchFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        activeTab={activeTab}
        onDownloadMembers={downloadMembersList}
        onDownloadGraduates={downloadFoundationGraduatesList}
        eventTypeFilter={eventTypeFilter}
        onEventTypeFilterChange={setEventTypeFilter}
        onFetchEventSignups={fetchEventSignups}
      />

      <div className="mt-6 bg-white shadow-lg rounded-lg p-6">
        {activeTab === "membership" && (
          <MembershipTab
            sortedRenewals={filteredRenewals}
            viewRenewalDetails={viewRenewalDetails}
            approveAndNotifyMember={approveAndNotifyMember}
            declineAndNotifyMember={declineAndNotifyMember}
            deleteMembershipRenewal={deleteMembershipRenewal}
            actionLoading={actionLoading}
          />
        )}
        {activeTab === "foundation" && (
          <FoundationTab
            sortedEnrollments={filteredEnrollments}
            viewEnrollmentDetails={viewEnrollmentDetails}
            approveAndSendSchedule={approveAndSendSchedule}
            cancelAndNotifyEnrollee={cancelAndNotifyEnrollee}
            completeAndNotifyMember={completeAndNotifyMember}
            deleteFoundationClassRegistration={
              deleteFoundationClassRegistration
            }
            actionLoading={actionLoading}
          />
        )}
        {activeTab === "events" && (
          <EventSignupsTab
            sortedEventSignups={filteredEventSignups}
            viewEventSignupDetails={viewEventSignupDetails}
            approveAndNotifyEventSignup={approveAndNotifyEventSignup}
            declineAndNotifyEventSignup={declineAndNotifyEventSignup}
            deleteEventSignupRequest={deleteEventSignupRequest}
            actionLoading={actionLoading}
          />
        )}
      </div>

      {/* Modals */}
      {showRenewalDetails && selectedRenewal && (
        <MembershipDetailsModal
          renewal={selectedRenewal}
          onClose={() => setShowRenewalDetails(false)}
          onApprove={approveAndNotifyMember}
          onDecline={declineAndNotifyMember}
          onDelete={deleteMembershipRenewal} // This now triggers the confirmation modal
          actionLoading={actionLoading}
        />
      )}
      {showEnrollmentDetails && selectedEnrollment && (
        <FoundationDetailsModal
          selectedEnrollment={selectedEnrollment}
          setShowEnrollmentDetails={() => setShowEnrollmentDetails(false)}
          approveAndSendSchedule={approveAndSendSchedule}
          cancelAndNotifyEnrollee={cancelAndNotifyEnrollee}
          completeAndNotifyMember={completeAndNotifyMember}
          deleteFoundationClassRegistration={deleteFoundationClassRegistration}
          actionLoading={actionLoading}
        />
      )}
      {showEventSignupDetails && selectedEventSignup && (
        <EventSignupDetailsModal
          request={selectedEventSignup}
          onClose={() => setShowEventSignupDetails(false)}
          onApprove={approveAndNotifyEventSignup}
          onDecline={declineAndNotifyEventSignup}
          onDelete={deleteEventSignupRequest} // This now triggers the confirmation modal
          actionLoading={actionLoading}
        />
      )}

      {/* Confirmation Modal for Deletions */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmModalProps.onConfirm}
        title={confirmModalProps.title}
        message={confirmModalProps.message}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default RequestsManager;
