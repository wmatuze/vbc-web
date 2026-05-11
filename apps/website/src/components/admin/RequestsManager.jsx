import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Services
import RequestsService from "../../services/requestsService";
import NotificationService from "../../services/notificationService";
import { getApiUrl, getAuthHeaders } from "../../services/api/core";

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
import DiscipleshipTab from "./requests/DiscipleshipTab";
import DiscipleshipDetailsModal from "./requests/DiscipleshipDetailsModal";
import EventSignupsTab from "./requests/EventSignupsTab";
import EventSignupDetailsModal from "./requests/EventSignupDetailsModal";
import VisitorsTab from "./requests/VisitorsTab";
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

  // Active tab — persisted in the URL so refresh keeps the selected tab
  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ["membership", "foundation", "discipleship", "events", "visitors"];
  const activeTab = VALID_TABS.includes(searchParams.get("tab"))
    ? searchParams.get("tab")
    : "membership";
  const setActiveTab = (tab) => setSearchParams({ tab }, { replace: true });

  // Membership renewal states
  const [renewals, setRenewals] = useState([]);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [showRenewalDetails, setShowRenewalDetails] = useState(false);

  // Foundation class states
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showEnrollmentDetails, setShowEnrollmentDetails] = useState(false);

  // Discipleship class states
  const [discipleshipRegistrations, setDiscipleshipRegistrations] = useState([]);
  const [selectedDiscipleshipRegistration, setSelectedDiscipleshipRegistration] = useState(null);
  const [showDiscipleshipDetails, setShowDiscipleshipDetails] = useState(false);

  // Event signup request states
  const [eventSignups, setEventSignups] = useState([]);
  const [selectedEventSignup, setSelectedEventSignup] = useState(null);
  const [showEventSignupDetails, setShowEventSignupDetails] = useState(false);
  const [eventTypeFilter, setEventTypeFilter] = useState("all");

  // Visitor / first-timer states
  const [visitors, setVisitors] = useState([]);
  const [visitorsLoading, setVisitorsLoading] = useState(false);
  const [visitorsError, setVisitorsError] = useState(null);

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
    } else if (activeTab === "discipleship") {
      fetchDiscipleshipRegistrations();
    } else if (activeTab === "events") {
      fetchEventSignups();
    } else if (activeTab === "visitors") {
      fetchVisitors();
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

  // Fetch discipleship registrations
  const fetchDiscipleshipRegistrations = async () => {
    try {
      setLoading(true);

      const data = await RequestsService.getDiscipleshipRegistrations();
      console.log("Discipleship registrations response:", data);
      
      // Ensure we have an array
      const registrations = Array.isArray(data) ? data : (data?.data ? data.data : []);
      setDiscipleshipRegistrations(registrations);
      setError(null);
    } catch (err) {
      console.error("Error fetching discipleship registrations:", err);
      setDiscipleshipRegistrations([]); // Set empty array as fallback
      const errorMessage =
        err.response?.data?.error ||
        "Failed to load discipleship registrations. Please try again.";
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

  // Handle discipleship status change
  const handleDiscipleshipStatusChange = async (id, newStatus) => {
    try {
      setActionLoading(true);

      await RequestsService.updateDiscipleshipStatus(id, newStatus);

      setDiscipleshipRegistrations(prev =>
        prev.map(registration =>
          registration._id === id
            ? { ...registration, status: newStatus }
            : registration
        )
      );

      // Send notification emails on approve/reject
      const registration = discipleshipRegistrations.find(r => r._id === id);
      if (registration) {
        try {
          if (newStatus === "approved") {
            await NotificationService.sendDiscipleshipApprovalNotification(registration);
          } else if (newStatus === "rejected") {
            await NotificationService.sendDiscipleshipRejectedNotification(registration);
          }
        } catch {
          // Notification failure should not block the status update
        }
      }

      toast.success(`Discipleship registration ${newStatus} successfully`);
    } catch (err) {
      console.error("Error updating discipleship status:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Failed to update discipleship status. Please try again.";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a discipleship registration
  const deleteDiscipleshipRegistration = async (registration) => {
    setConfirmModalProps({
      title: "Confirm Deletion",
      message: `Are you sure you want to delete ${registration.fullName}'s discipleship registration? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setActionLoading(true);
          await RequestsService.deleteDiscipleshipRegistration(registration._id);
          setDiscipleshipRegistrations(prev => prev.filter(r => r._id !== registration._id));
          toast.success(`${registration.fullName}'s discipleship registration has been deleted.`);
          if (selectedDiscipleshipRegistration && selectedDiscipleshipRegistration._id === registration._id) {
            setShowDiscipleshipDetails(false);
            setSelectedDiscipleshipRegistration(null);
          }
        } catch (err) {
          console.error("Error deleting discipleship registration:", err);
          const errorMessage = err.response?.data?.error || "Failed to delete registration. Please try again.";
          toast.error(`Delete failed: ${errorMessage}`);
        } finally {
          setActionLoading(false);
          setShowConfirmModal(false);
        }
      },
    });
    setShowConfirmModal(true);
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

  // Helper: try to send a notification, warn but don't fail if email errors
  const tryNotify = async (notifyFn, successMsg, warnMsg) => {
    try {
      await notifyFn();
      toast.success(successMsg);
    } catch {
      toast.warn(warnMsg);
    }
  };

  // Approve and notify member
  const approveAndNotifyMember = async (renewal) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateMembershipRenewal(renewal);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleMembershipStatusChange(renewal.id, "approved");
      setShowRenewalDetails(false);
      await tryNotify(
        () => NotificationService.sendMembershipApprovalNotification(renewal),
        `Approved — notification sent to ${renewal.fullName}`,
        `Approved — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error approving member:", err);
      toast.error("Failed to approve renewal. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Decline and notify member
  const declineAndNotifyMember = async (renewal) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateMembershipRenewal(renewal);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleMembershipStatusChange(renewal.id, "declined");
      setShowRenewalDetails(false);
      await tryNotify(
        () => NotificationService.sendMembershipDeclinedNotification(renewal),
        `Declined — notification sent to ${renewal.fullName}`,
        `Declined — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error declining member:", err);
      toast.error("Failed to decline renewal. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Approve and send schedule to enrollee
  const approveAndSendSchedule = async (enrollment) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleEnrollmentStatusChange(enrollment.id, "attending");
      setShowEnrollmentDetails(false);
      await tryNotify(
        () => NotificationService.sendClassScheduleNotification(enrollment),
        `Approved — schedule sent to ${enrollment.fullName}`,
        `Approved — schedule email could not be sent`
      );
    } catch (err) {
      console.error("Error approving enrollment:", err);
      toast.error("Failed to approve enrollment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel and notify enrollee
  const cancelAndNotifyEnrollee = async (enrollment) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleEnrollmentStatusChange(enrollment.id, "cancelled");
      setShowEnrollmentDetails(false);
      await tryNotify(
        () => NotificationService.sendClassCancellationNotification(enrollment),
        `Cancelled — notification sent to ${enrollment.fullName}`,
        `Cancelled — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error cancelling enrollment:", err);
      toast.error("Failed to cancel enrollment. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark as completed and notify member
  const completeAndNotifyMember = async (enrollment) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateFoundationClassRegistration(enrollment);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleEnrollmentStatusChange(enrollment.id, "completed");
      setShowEnrollmentDetails(false);
      await tryNotify(
        () => NotificationService.sendClassCompletionNotification(enrollment),
        `Completed — notification sent to ${enrollment.fullName}`,
        `Completed — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error completing enrollment:", err);
      toast.error("Failed to mark as completed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Approve and notify event signup request
  const approveAndNotifyEventSignup = async (request) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateEventSignupRequest(request);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleEventSignupStatusChange(request.id, "approved");
      setShowEventSignupDetails(false);
      await tryNotify(
        () => NotificationService.sendEventSignupApprovalNotification(request),
        `Approved — notification sent to ${request.fullName}`,
        `Approved — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error approving event signup:", err);
      toast.error("Failed to approve signup. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Decline and notify event signup request
  const declineAndNotifyEventSignup = async (request) => {
    try {
      setActionLoading(true);
      const { isValid, errors } = validateEventSignupRequest(request);
      if (!isValid) {
        toast.error(`Validation failed: ${Object.values(errors).join(", ")}`);
        return;
      }
      await handleEventSignupStatusChange(request.id, "declined");
      setShowEventSignupDetails(false);
      await tryNotify(
        () => NotificationService.sendEventSignupDeclinedNotification(request),
        `Declined — notification sent to ${request.fullName}`,
        `Declined — notification email could not be sent`
      );
    } catch (err) {
      console.error("Error declining event signup:", err);
      toast.error("Failed to decline signup. Please try again.");
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
  const filteredRenewals = (renewals || []).filter(
    (renewal) =>
      (renewal.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renewal.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        renewal.phoneNumber?.includes(searchTerm)) &&
      (filterStatus === "all" || renewal.status === filterStatus)
  );

  const filteredEnrollments = (enrollments || []).filter(
    (enrollment) =>
      (enrollment.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.phoneNumber?.includes(searchTerm)) &&
      (filterStatus === "all" || enrollment.status === filterStatus)
  );

  const filteredDiscipleshipRegistrations = (discipleshipRegistrations || []).filter(
    (registration) =>
      (registration.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phone?.includes(searchTerm) ||
        registration.classId?.title?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || registration.status === filterStatus)
  );

  const filteredEventSignups = (eventSignups || []).filter(
    (signup) =>
      (signup.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        signup.phoneNumber?.includes(searchTerm) ||
        signup.eventName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || signup.status === filterStatus)
  );

  // Fetch visitor registrations
  const fetchVisitors = async () => {
    try {
      setVisitorsLoading(true);
      setVisitorsError(null);
      const res  = await fetch(`${getApiUrl()}/api/visitors`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setVisitors(data.data || []);
      else setVisitorsError("Failed to load visitor registrations.");
    } catch {
      setVisitorsError("Failed to load visitor registrations.");
    } finally {
      setVisitorsLoading(false);
    }
  };

  // Update visitor status
  const handleVisitorStatusChange = async (id, status) => {
    try {
      const res  = await fetch(`${getApiUrl()}/api/visitors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setVisitors((prev) => prev.map((v) => v._id === id ? { ...v, status } : v));
        toast.success("Visitor status updated.");
      }
    } catch {
      toast.error("Failed to update visitor status.");
    }
  };

  // Delete visitor registration
  const handleDeleteVisitor = (id, name) => {
    setConfirmModalProps({
      title: "Delete Visitor Card",
      message: `Are you sure you want to delete ${name}'s connection card? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res  = await fetch(`${getApiUrl()}/api/visitors/${id}`, {
            method: "DELETE",
            headers: getAuthHeaders(),
          });
          const data = await res.json();
          if (data.success) {
            setVisitors((prev) => prev.filter((v) => v._id !== id));
            toast.success(`${name}'s connection card deleted.`);
          }
        } catch {
          toast.error("Failed to delete visitor card.");
        }
        setShowConfirmModal(false);
      },
    });
    setShowConfirmModal(true);
  };

  // Refresh data based on active tab
  const refreshData = () => {
    if (activeTab === "membership") {
      fetchRenewals();
    } else if (activeTab === "foundation") {
      fetchEnrollments();
    } else if (activeTab === "discipleship") {
      fetchDiscipleshipRegistrations();
    } else if (activeTab === "events") {
      fetchEventSignups();
    } else if (activeTab === "visitors") {
      fetchVisitors();
    }
  };

  // View discipleship registration details
  const viewDiscipleshipDetails = (registration) => {
    setSelectedDiscipleshipRegistration(registration);
    setShowDiscipleshipDetails(true);
  };



  if (
    loading &&
    !renewals.length &&
    !enrollments.length &&
    !discipleshipRegistrations.length &&
    !eventSignups.length
  ) {
    return (
      <div className="flex justify-center items-center h-64 gap-3">
        <ArrowPathIcon className="h-6 w-6 text-gray-400 dark:text-gray-500 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading requests…</p>
      </div>
    );
  }

  if (
    error &&
    !renewals.length &&
    !enrollments.length &&
    !discipleshipRegistrations.length &&
    !eventSignups.length
  ) {
    return (
      <div className="text-center p-10 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <ExclamationCircleIcon className="h-10 w-10 text-red-500 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-red-700 dark:text-red-400 mb-2">
          Error Loading Data
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400 mb-5">
          {error?.message || error?.toString() || "An error occurred"}
        </p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const tabCounts = {
    membership:   filteredRenewals.length,
    foundation:   filteredEnrollments.length,
    discipleship: filteredDiscipleshipRegistrations.length,
    events:       filteredEventSignups.length,
    visitors:     visitors.length,
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Requests
        </h1>
        <button
          onClick={refreshData}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <ArrowPathIcon
            className={`h-5 w-5 text-gray-500 dark:text-gray-400 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <RequestsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={tabCounts}
        />

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
          actionLoading={actionLoading}
        />

        <div className="p-6">
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
        {activeTab === "discipleship" && (
          <DiscipleshipTab
            registrations={filteredDiscipleshipRegistrations}
            onViewDetails={viewDiscipleshipDetails}
            onApprove={(id, status = "approved") => handleDiscipleshipStatusChange(id, status)}
            onReject={(id) => handleDiscipleshipStatusChange(id, "rejected")}
            onDelete={deleteDiscipleshipRegistration}
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
        {activeTab === "visitors" && (
          <VisitorsTab
            visitors={visitors}
            loading={visitorsLoading}
            error={visitorsError}
            onStatusChange={handleVisitorStatusChange}
            onDelete={handleDeleteVisitor}
          />
        )}
        </div>
      </div>

      {/* Modals */}
      {showRenewalDetails && selectedRenewal && (
        <MembershipDetailsModal
          selectedRenewal={selectedRenewal}
          setShowRenewalDetails={() => setShowRenewalDetails(false)}
          approveAndNotifyMember={approveAndNotifyMember}
          declineAndNotifyMember={declineAndNotifyMember}
          deleteMembershipRenewal={deleteMembershipRenewal} // This now triggers the confirmation modal
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
      {showDiscipleshipDetails && selectedDiscipleshipRegistration && (
        <DiscipleshipDetailsModal
          registration={selectedDiscipleshipRegistration}
          onClose={() => setShowDiscipleshipDetails(false)}
          isOpen={showDiscipleshipDetails}
        />
      )}
      {showEventSignupDetails && selectedEventSignup && (
        <EventSignupDetailsModal
          selectedEventSignup={selectedEventSignup}
          setShowEventSignupDetails={() => setShowEventSignupDetails(false)}
          approveAndNotifyEventSignup={approveAndNotifyEventSignup}
          declineAndNotifyEventSignup={declineAndNotifyEventSignup}
          deleteEventSignupRequest={deleteEventSignupRequest} // This now triggers the confirmation modal
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
