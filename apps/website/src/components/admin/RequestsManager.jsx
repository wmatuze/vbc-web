import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  AcademicCapIcon,
  IdentificationIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import RequestsService from "../../services/requestsService";
import NotificationService from "../../services/notificationService";
import { toast } from "react-toastify";
import { getAuthToken } from "../../services/config";
import {
  validateMembershipRenewal,
  validateFoundationClassRegistration,
  validateMembershipStatusChange,
  validateFoundationClassStatusChange,
} from "../../utils/requestsValidation";

const RequestsManager = () => {
  const navigate = useNavigate();

  // Active tab state (membership or foundation)
  const [activeTab, setActiveTab] = useState("membership");

  // Shared states for both request types
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Membership renewal states
  const [renewals, setRenewals] = useState([]);
  const [selectedRenewal, setSelectedRenewal] = useState(null);
  const [showRenewalDetails, setShowRenewalDetails] = useState(false);

  // Foundation class states
  const [enrollments, setEnrollments] = useState([]);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showEnrollmentDetails, setShowEnrollmentDetails] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = getAuthToken();
    if (!token) {
      toast.error("You must be logged in to access this page");
      navigate("/login");
      return;
    }

    if (activeTab === "membership") {
      fetchRenewals();
    } else {
      fetchEnrollments();
    }
  }, [activeTab, navigate]);

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

  // Handle membership renewal status change
  const handleRenewalStatusChange = async (id, newStatus) => {
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
      toast.success(`Membership renewal ${newStatus} successfully`);
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

  // Send notification when membership renewal is approved
  const approveAndNotifyMember = async (member) => {
    try {
      setActionLoading(true);

      // Validate the member data before proceeding
      const { isValid, errors } = validateMembershipRenewal(member);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleRenewalStatusChange(member.id, "approved");

      // Then send notification
      await NotificationService.sendMembershipApprovalNotification(member);

      toast.success(`Notification sent to ${member.fullName}`);
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

  // Send notification when membership renewal is declined
  const declineAndNotifyMember = async (member) => {
    try {
      setActionLoading(true);

      // Validate the member data before proceeding
      const { isValid, errors } = validateMembershipRenewal(member);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleRenewalStatusChange(member.id, "declined");

      // Then send notification
      await NotificationService.sendMembershipDeclinedNotification(member);

      toast.info(`Decline notification sent to ${member.fullName}`);
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

  // Send class schedule when enrollment is approved
  const approveAndSendSchedule = async (enrollee) => {
    try {
      setActionLoading(true);

      // Validate the enrollee data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollee);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollee.id, "attending");

      // Then send notification with schedule
      await NotificationService.sendClassScheduleNotification(enrollee);

      toast.success(`Class schedule sent to ${enrollee.fullName}`);
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error approving and sending schedule:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send class schedule";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Send notification when class enrollment is cancelled
  const cancelAndNotifyEnrollee = async (enrollee) => {
    try {
      setActionLoading(true);

      // Validate the enrollee data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollee);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollee.id, "cancelled");

      // Then send notification
      await NotificationService.sendClassCancellationNotification(enrollee);

      toast.info(`Cancellation notice sent to ${enrollee.fullName}`);
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error cancelling and notifying enrollee:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send cancellation notice";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Mark class as completed and notify new church member
  const completeAndNotifyMember = async (enrollee) => {
    try {
      setActionLoading(true);

      // Validate the enrollee data before proceeding
      const { isValid, errors } = validateFoundationClassRegistration(enrollee);
      if (!isValid) {
        const errorMessages = Object.values(errors).join(", ");
        toast.error(`Validation failed: ${errorMessages}`);
        return;
      }

      // First update status
      await handleEnrollmentStatusChange(enrollee.id, "completed");

      // Then send notification
      await NotificationService.sendClassCompletionNotification(enrollee);

      toast.success(
        `${enrollee.fullName} has been notified of new membership status`
      );
      setShowEnrollmentDetails(false);
    } catch (err) {
      console.error("Error completing and notifying new member:", err);
      const errorMessage =
        err.response?.data?.error ||
        "Status updated but failed to send completion notice";
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
        `Are you sure you want to delete ${renewal.fullName}'s membership renewal request?`
      )
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await RequestsService.deleteMembershipRenewal(renewal.id);
      toast.success(
        `${renewal.fullName}'s membership renewal request has been deleted`
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

  // Generate downloadable list of members
  const downloadMembersList = async () => {
    try {
      setActionLoading(true);
      const approvedMembers = renewals.filter(
        (renewal) => renewal.status === "approved"
      );

      if (approvedMembers.length === 0) {
        toast.info("No approved members to download.");
        return;
      }

      // Get the data from API
      const blob = await RequestsService.exportApprovedMembers();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `approved_members_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Member list downloaded successfully");
    } catch (err) {
      console.error("Error downloading members list:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to download members list";
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Generate downloadable list of foundation class graduates
  const downloadFoundationGraduatesList = async () => {
    try {
      setActionLoading(true);
      const completedEnrollments = enrollments.filter(
        (enrollment) => enrollment.status === "completed"
      );

      if (completedEnrollments.length === 0) {
        toast.info("No foundation class graduates to download.");
        setActionLoading(false);
        return;
      }

      // Get the data from API
      const blob = await RequestsService.exportFoundationClassGraduates();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `foundation_class_graduates_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      toast.success("Foundation class graduates list downloaded successfully");
    } catch (err) {
      console.error("Error downloading foundation class graduates list:", err);
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge classes based on status
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-green-100 text-green-800";
      case "declined":
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
      case "registered":
      case "attending":
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case "declined":
      case "cancelled":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case "pending":
      case "registered":
      case "attending":
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
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

  // Sort membership renewals by date (newest first)
  const sortedRenewals = [...filteredRenewals].sort(
    (a, b) => new Date(b.renewalDate) - new Date(a.renewalDate)
  );

  // Sort foundation class enrollments by date (newest first)
  const sortedEnrollments = [...filteredEnrollments].sort(
    (a, b) => new Date(b.registrationDate) - new Date(a.registrationDate)
  );

  // Loading indicator
  if (
    loading &&
    ((activeTab === "membership" && renewals.length === 0) ||
      (activeTab === "foundation" && enrollments.length === 0))
  ) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Requests Manager</h2>
        <button
          onClick={
            activeTab === "membership" ? fetchRenewals : fetchEnrollments
          }
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("membership")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === "membership"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <IdentificationIcon className="h-5 w-5 mr-2" />
            Membership Renewals
          </button>
          <button
            onClick={() => setActiveTab("foundation")}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
              activeTab === "foundation"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Foundation Class Enrollments
          </button>
        </nav>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Content Header with Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="w-full md:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
              >
                <option value="all">All Statuses</option>
                {activeTab === "membership" ? (
                  <>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </>
                ) : (
                  <>
                    <option value="registered">Registered</option>
                    <option value="attending">Attending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            </div>

            {activeTab === "membership" && (
              <button
                onClick={downloadMembersList}
                disabled={actionLoading}
                className={`w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {actionLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download Members List
                  </>
                )}
              </button>
            )}

            {activeTab === "foundation" && (
              <button
                onClick={downloadFoundationGraduatesList}
                disabled={actionLoading}
                className={`w-full md:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              >
                {actionLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    Download Graduates List
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === "membership" ? (
          // Membership Renewals List
          sortedRenewals.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No membership renewals found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Member
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Contact
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Renewal Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRenewals.map((renewal) => (
                    <tr key={renewal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {renewal.fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Member since {renewal.memberSince}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {renewal.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {renewal.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                          {formatDate(renewal.renewalDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(renewal.status)}`}
                        >
                          {getStatusIcon(renewal.status)}
                          <span className="ml-1 capitalize">
                            {renewal.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => viewRenewalDetails(renewal)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            View
                          </button>
                          {renewal.status === "pending" && (
                            <>
                              <button
                                onClick={() => {
                                  approveAndNotifyMember(renewal);
                                }}
                                disabled={actionLoading}
                                className={`text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {actionLoading ? "Processing..." : "Approve"}
                              </button>
                              <button
                                onClick={() => {
                                  declineAndNotifyMember(renewal);
                                }}
                                disabled={actionLoading}
                                className={`text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                              >
                                {actionLoading ? "Processing..." : "Decline"}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              deleteMembershipRenewal(renewal);
                            }}
                            disabled={actionLoading}
                            className={`text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            title="Delete this renewal request"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : // Foundation Class Enrollments List
        sortedEnrollments.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No foundation class enrollments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Enrollee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Preferred Session
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {enrollment.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            Registered:{" "}
                            {formatDate(enrollment.registrationDate)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {enrollment.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {enrollment.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {enrollment.preferredSession}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(enrollment.status)}`}
                      >
                        {getStatusIcon(enrollment.status)}
                        <span className="ml-1 capitalize">
                          {enrollment.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewEnrollmentDetails(enrollment)}
                          className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          View
                        </button>
                        {enrollment.status === "registered" && (
                          <>
                            <button
                              onClick={() => {
                                approveAndSendSchedule(enrollment);
                              }}
                              disabled={actionLoading}
                              className={`text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {actionLoading ? "Processing..." : "Approve"}
                            </button>
                            <button
                              onClick={() => {
                                cancelAndNotifyEnrollee(enrollment);
                              }}
                              disabled={actionLoading}
                              className={`text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              {actionLoading ? "Processing..." : "Cancel"}
                            </button>
                          </>
                        )}
                        {enrollment.status === "attending" && (
                          <button
                            onClick={() => {
                              completeAndNotifyMember(enrollment);
                            }}
                            disabled={actionLoading}
                            className={`text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 flex items-center ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {actionLoading ? (
                              "Processing..."
                            ) : (
                              <>
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Mark Completed
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            deleteFoundationClassRegistration(enrollment);
                          }}
                          disabled={actionLoading}
                          className={`text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                          title="Delete this enrollment"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Renewal Details Modal */}
      {showRenewalDetails && selectedRenewal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Membership Renewal Details
              </h3>
              <button
                onClick={() => setShowRenewalDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Member Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-start">
                      <span className="font-medium w-32">Name:</span>{" "}
                      {selectedRenewal.fullName}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Email:</span>{" "}
                      {selectedRenewal.email}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Phone:</span>{" "}
                      {selectedRenewal.phone}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Member Since:</span>{" "}
                      {selectedRenewal.memberSince}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Birthday:</span>{" "}
                      {formatDate(selectedRenewal.birthday)}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Renewal Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-start">
                      <span className="font-medium w-32">Renewal Date:</span>{" "}
                      {formatDate(selectedRenewal.renewalDate)}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(selectedRenewal.status)}`}
                      >
                        {getStatusIcon(selectedRenewal.status)}
                        <span className="ml-1 capitalize">
                          {selectedRenewal.status}
                        </span>
                      </span>
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Address Change:</span>{" "}
                      {selectedRenewal.addressChange ? "Yes" : "No"}
                    </p>
                    {selectedRenewal.addressChange &&
                      selectedRenewal.newAddress && (
                        <p className="flex items-start">
                          <span className="font-medium w-32">New Address:</span>{" "}
                          {selectedRenewal.newAddress}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {selectedRenewal.ministryInvolvement && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500">
                    Ministry Involvement
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedRenewal.ministryInvolvement}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                {selectedRenewal.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        approveAndNotifyMember(selectedRenewal);
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {actionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Approve & Notify
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        declineAndNotifyMember(selectedRenewal);
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {actionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          Decline
                        </>
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    deleteMembershipRenewal(selectedRenewal);
                  }}
                  disabled={actionLoading}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 ${actionLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-50"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                >
                  <TrashIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Delete Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Foundation Class Enrollment Details Modal */}
      {showEnrollmentDetails && selectedEnrollment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Foundation Class Enrollment Details
              </h3>
              <button
                onClick={() => setShowEnrollmentDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Enrollee Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-start">
                      <span className="font-medium w-32">Name:</span>{" "}
                      {selectedEnrollment.fullName}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Email:</span>{" "}
                      {selectedEnrollment.email}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Phone:</span>{" "}
                      {selectedEnrollment.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Enrollment Information
                  </h4>
                  <div className="mt-2 space-y-2">
                    <p className="flex items-start">
                      <span className="font-medium w-32">
                        Registration Date:
                      </span>{" "}
                      {formatDate(selectedEnrollment.registrationDate)}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">
                        Preferred Session:
                      </span>{" "}
                      {selectedEnrollment.preferredSession}
                    </p>
                    <p className="flex items-start">
                      <span className="font-medium w-32">Status:</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(selectedEnrollment.status)}`}
                      >
                        {getStatusIcon(selectedEnrollment.status)}
                        <span className="ml-1 capitalize">
                          {selectedEnrollment.status}
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedEnrollment.questions && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500">
                    Questions/Comments
                  </h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {selectedEnrollment.questions}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
                {selectedEnrollment.status === "registered" && (
                  <>
                    <button
                      onClick={() => {
                        approveAndSendSchedule(selectedEnrollment);
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {actionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          Approve & Send Schedule
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        cancelAndNotifyEnrollee(selectedEnrollment);
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                    >
                      {actionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          Cancel Enrollment
                        </>
                      )}
                    </button>
                  </>
                )}

                {selectedEnrollment.status === "attending" && (
                  <>
                    <button
                      onClick={() => {
                        completeAndNotifyMember(selectedEnrollment);
                      }}
                      disabled={actionLoading}
                      className={`inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${actionLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      {actionLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          <AcademicCapIcon className="h-5 w-5 mr-2" />
                          Mark as Completed & Notify
                        </>
                      )}
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    deleteFoundationClassRegistration(selectedEnrollment);
                  }}
                  disabled={actionLoading}
                  className={`inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 ${actionLoading ? "bg-gray-100 cursor-not-allowed" : "bg-white hover:bg-gray-50"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
                >
                  <TrashIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Delete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestsManager;
