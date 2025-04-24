import { useState, useEffect } from "react";
import {
  createCellGroup,
  updateCellGroup,
  deleteCellGroup,
  getZones,
  createZone,
  updateZone,
  deleteZone,
  isAuthenticated,
  login,
} from "../../services/api";
import { useCellGroupsQuery } from "../../hooks/useCellGroupsQuery";
import { useZonesQuery } from "../../hooks/useZonesQuery";
import useErrorHandler from "../../hooks/useErrorHandler";
import { validateField } from "../../utils/validationUtils";
import {
  validateCellGroup,
  validateZone,
  cellGroupValidationRules,
  zoneValidationRules,
} from "../../utils/cellGroupValidation";
import FormField from "../common/FormField";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa";

const CellGroupManager = ({ darkMode }) => {
  // State for active tab (zones or cell groups)
  const [activeTab, setActiveTab] = useState("cellGroups"); // 'zones' or 'cellGroups'

  // Use React Query for fetching cell groups
  const {
    data: cellGroups = [],
    isLoading: cellGroupsLoading,
    error: cellGroupsError,
    refetch: refetchCellGroups,
  } = useCellGroupsQuery();

  // Use React Query for fetching zones
  const {
    data: zones = [],
    isLoading: zonesLoading,
    error: zonesError,
    refetch: refetchZones,
  } = useZonesQuery();

  // Use our custom error handling hook
  const { error, errorMessage, handleError, clearError, withErrorHandling } =
    useErrorHandler("CellGroupManager");

  // Local state for operations other than fetching
  const [loading, setLoading] = useState(false);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
  const [formErrors, setFormErrors] = useState({});
  const [zoneFormErrors, setZoneFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [currentGroup, setCurrentGroup] = useState({
    name: "",
    location: "",
    leader: "",
    contact: "",
    meetingDay: "",
    meetingTime: "",
    capacity: "",
    description: "",
    tags: [],
    coordinates: { lat: 0, lng: 0 },
    imageUrl: "",
    zone: "", // Add zone field
  });

  // State for zone management
  const [currentZone, setCurrentZone] = useState({
    name: "",
    location: "",
    description: "",
    elder: {
      name: "",
      title: "Zone Elder",
      bio: "",
      contact: "",
      phone: "",
    },
    iconName: "FaUsers",
  });

  const [zoneFormMode, setZoneFormMode] = useState("add"); // 'add' or 'edit'

  // Display any query errors
  useEffect(() => {
    if (cellGroupsError) {
      handleError(cellGroupsError, "Cell Groups Query");
    }
  }, [cellGroupsError, handleError]);

  // Display any zone query errors
  useEffect(() => {
    if (zonesError) {
      handleError(zonesError, "Zones Query");
    }
  }, [zonesError, handleError]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        // If not authenticated, try to log in with default credentials
        try {
          // Use default admin credentials (this is just for development)
          await login("admin", "admin123");
          console.log("Auto-login successful");
        } catch (err) {
          console.error("Auto-login failed:", err);
          setError(
            "Authentication failed. Please log in through the admin page."
          );
        }
      }
    };

    checkAuth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      // Handle array values for tags
      setCurrentGroup((prev) => ({
        ...prev,
        tags: value.split(",").map((item) => item.trim()),
      }));

      // Validate tags field
      validateField(
        "tags",
        value.split(",").map((item) => item.trim()),
        cellGroupValidationRules.tags,
        formErrors,
        setFormErrors
      );
    } else if (name === "lat" || name === "lng") {
      // Handle nested coordinates
      const coordValue = parseFloat(value) || 0;
      setCurrentGroup((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: coordValue,
        },
      }));

      // Validate coordinates field
      const fieldName = name === "lat" ? "coordinates.lat" : "coordinates.lng";
      const rule =
        name === "lat"
          ? cellGroupValidationRules.coordinates.properties.lat
          : cellGroupValidationRules.coordinates.properties.lng;

      validateField(fieldName, coordValue, rule, formErrors, setFormErrors);
    } else if (name === "zone") {
      // Handle zone selection specifically
      console.log(`Zone selected: ${value}`);
      setCurrentGroup((prev) => ({
        ...prev,
        zone: value.toString(), // Ensure zone is stored as a string
      }));

      // Validate zone field
      validateField(
        "zone",
        value,
        cellGroupValidationRules.zone,
        formErrors,
        setFormErrors
      );
    } else {
      // Handle regular fields
      setCurrentGroup((prev) => ({ ...prev, [name]: value }));

      // Validate the field if it has validation rules
      if (cellGroupValidationRules[name]) {
        validateField(
          name,
          value,
          cellGroupValidationRules[name],
          formErrors,
          setFormErrors
        );
      }
    }
  };

  const handleZoneInputChange = (e) => {
    const { name, value } = e.target;

    // Handle nested elder properties
    if (name.startsWith("elder.")) {
      const elderProperty = name.split(".")[1];
      setCurrentZone({
        ...currentZone,
        elder: {
          ...currentZone.elder,
          [elderProperty]: value,
        },
      });

      // Validate elder property
      if (zoneValidationRules.elder.properties[elderProperty]) {
        validateField(
          name,
          value,
          zoneValidationRules.elder.properties[elderProperty],
          zoneFormErrors,
          setZoneFormErrors
        );
      }
    } else {
      setCurrentZone({
        ...currentZone,
        [name]: value,
      });

      // Validate the field if it has validation rules
      if (zoneValidationRules[name]) {
        validateField(
          name,
          value,
          zoneValidationRules[name],
          zoneFormErrors,
          setZoneFormErrors
        );
      }
    }
  };

  const resetForm = () => {
    setCurrentGroup({
      name: "",
      location: "",
      leader: "",
      contact: "",
      meetingDay: "",
      meetingTime: "",
      capacity: "",
      description: "",
      tags: [],
      coordinates: { lat: 0, lng: 0 },
      imageUrl: "",
      zone: "", // Reset zone field
    });
    setFormMode("add");
    setFormErrors({});
    setSuccessMessage("");
  };

  const resetZoneForm = () => {
    setCurrentZone({
      name: "",
      location: "",
      description: "",
      elder: {
        name: "",
        title: "Zone Elder",
        bio: "",
        contact: "",
        phone: "",
      },
      iconName: "FaUsers",
    });
    setZoneFormMode("add");
    setZoneFormErrors({});
    setSuccessMessage("");
  };

  const handleSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate all fields before submission
      const { isValid, errors } = validateCellGroup(currentGroup);

      if (!isValid) {
        // Update form errors and stop submission
        setFormErrors(errors);
        // Show error message
        handleError(
          new Error("Please fix the form errors before submitting"),
          "Form Validation"
        );
        return;
      }

      // Prepare the data for submission
      // Ensure zone is properly set as a string
      const zoneId = currentGroup.zone ? currentGroup.zone.toString() : "";
      console.log("Submitting cell group with zone ID:", zoneId);

      const groupData = {
        ...currentGroup,
        // Ensure zone is properly set as a string
        zone: zoneId,
      };

      setLoading(true);

      try {
        if (formMode === "add") {
          // For new groups, we need to create a new ID
          const newGroup = {
            ...groupData,
            id: Date.now(), // Simple way to generate a unique ID
          };
          await createCellGroup(newGroup);
          setSuccessMessage("Cell group created successfully!");
        } else {
          // For editing, we keep the existing ID
          await updateCellGroup(currentGroup.id, groupData);
          setSuccessMessage("Cell group updated successfully!");
        }

        // Refresh the data with a forced refetch to ensure we get the latest data
        await refetchCellGroups({ force: true });
        await refetchZones({ force: true }); // Also refresh zones to ensure consistency
        resetForm();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    },
    {
      context: "Cell Group Form Submission",
    }
  );

  const handleEdit = (group) => {
    // Convert tags array to string for editing
    // Extract zone ID, handling both string and object formats
    let zoneId = "";
    if (group.zone) {
      if (typeof group.zone === "object") {
        // If zone is an object, try to get the ID from it
        zoneId = group.zone._id || group.zone.id || "";
      } else {
        // If zone is a string or other primitive
        zoneId = group.zone.toString();
      }
    }

    console.log("Editing cell group with zone ID:", zoneId);

    setCurrentGroup({
      ...group,
      tags: group.tags ? group.tags.join(", ") : "",
      zone: zoneId, // Ensure zone is set as a string
    });
    setFormMode("edit");
  };

  const handleDelete = withErrorHandling(
    async (id) => {
      if (window.confirm("Are you sure you want to delete this cell group?")) {
        try {
          setLoading(true);
          await deleteCellGroup(id);
          await refetchCellGroups();
          setSuccessMessage("Cell group deleted successfully!");

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(""), 3000);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      context: "Cell Group Deletion",
    }
  );

  const handleZoneSubmit = withErrorHandling(
    async (e) => {
      e.preventDefault();

      // Validate all fields before submission
      const { isValid, errors } = validateZone(currentZone);

      if (!isValid) {
        // Update form errors and stop submission
        setZoneFormErrors(errors);
        // Show error message
        handleError(
          new Error("Please fix the form errors before submitting"),
          "Zone Form Validation"
        );
        return;
      }

      setLoading(true);

      try {
        // Prepare the data for submission
        const zoneData = {
          ...currentZone,
          // Ensure elder object is properly structured
          elder: {
            ...currentZone.elder,
            name: currentZone.elder.name.trim(),
          },
        };

        if (zoneFormMode === "add") {
          await createZone(zoneData);
          setSuccessMessage("Zone created successfully!");
        } else {
          await updateZone(currentZone.id, zoneData);
          setSuccessMessage("Zone updated successfully!");
        }

        // Refresh both zones and cell groups to ensure consistency
        await refetchZones();
        await refetchCellGroups();
        resetZoneForm();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } finally {
        setLoading(false);
      }
    },
    {
      context: "Zone Form Submission",
    }
  );

  const handleZoneEdit = (zone) => {
    setCurrentZone(zone);
    setZoneFormMode("edit");
  };

  const handleZoneDelete = withErrorHandling(
    async (id) => {
      // Check if there are cell groups in this zone
      const cellGroupsInZone = cellGroups.filter(
        (group) => String(group.zone) === String(id)
      );

      if (cellGroupsInZone.length > 0) {
        // There are cell groups in this zone
        const message = `This zone contains ${cellGroupsInZone.length} cell group${cellGroupsInZone.length > 1 ? "s" : ""}. You must reassign or delete these cell groups before deleting the zone.`;
        handleError(new Error(message), "Zone Deletion");
        return;
      }

      if (window.confirm("Are you sure you want to delete this zone?")) {
        try {
          setLoading(true);
          await deleteZone(id);
          await refetchZones();
          setSuccessMessage("Zone deleted successfully!");

          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(""), 3000);
        } finally {
          setLoading(false);
        }
      }
    },
    {
      context: "Zone Deletion",
    }
  );

  // Get all unique locations and meeting days for dropdowns
  const allLocations = [
    ...new Set(cellGroups.map((group) => group.location).filter(Boolean)),
  ];
  const allMeetingDays = [
    ...new Set(cellGroups.map((group) => group.meetingDay).filter(Boolean)),
  ];

  if (
    (cellGroupsLoading && cellGroups.length === 0) ||
    (zonesLoading && zones.length === 0)
  ) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className={`${darkMode ? "text-white" : "text-gray-800"}`}>
      <h2 className="text-2xl font-bold mb-6">Cell Group & Zone Management</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
          <button
            onClick={clearError}
            className="ml-2 text-xs text-red-500 hover:text-red-700 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("cellGroups")}
          className={`py-2 px-4 font-medium ${
            activeTab === "cellGroups"
              ? darkMode
                ? "border-b-2 border-blue-400 text-blue-400"
                : "border-b-2 border-blue-600 text-blue-600"
              : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaUsers className="inline mr-2" /> Cell Groups
        </button>
        <button
          onClick={() => setActiveTab("zones")}
          className={`py-2 px-4 font-medium ${
            activeTab === "zones"
              ? darkMode
                ? "border-b-2 border-blue-400 text-blue-400"
                : "border-b-2 border-blue-600 text-blue-600"
              : darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FaLayerGroup className="inline mr-2" /> Zones
        </button>
      </div>

      {/* Cell Groups Tab Content */}
      {activeTab === "cellGroups" && (
        <div>
          {/* Form for adding/editing cell groups */}
          <form
            onSubmit={handleSubmit}
            className={`mb-8 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h3 className="text-lg font-medium mb-4">
              {formMode === "add" ? "Add New Cell Group" : "Edit Cell Group"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Group Name"
                name="name"
                type="text"
                value={currentGroup.name}
                onChange={handleInputChange}
                placeholder="Enter group name"
                required={true}
                validation={cellGroupValidationRules.name}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
              />

              <div>
                <label className="block text-sm font-medium mb-1">Zone*</label>
                <select
                  name="zone"
                  value={currentGroup.zone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.zone ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                  required
                >
                  <option value="">Select a Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
                {formErrors.zone && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.zone}</p>
                )}
                {formMode === "edit" && !formErrors.zone && (
                  <div className="text-xs mt-1 text-gray-500">
                    <p>
                      Current zone ID:{" "}
                      {currentGroup.zone
                        ? currentGroup.zone.toString()
                        : "none"}
                    </p>
                    <p>
                      Selected zone:{" "}
                      {zones.find(
                        (z) => String(z.id) === String(currentGroup.zone)
                      )
                        ? zones.find(
                            (z) => String(z.id) === String(currentGroup.zone)
                          ).name
                        : "None selected"}
                    </p>
                  </div>
                )}
              </div>

              <FormField
                label="Location"
                name="location"
                type="text"
                value={currentGroup.location}
                onChange={handleInputChange}
                placeholder="Enter location"
                required={true}
                validation={cellGroupValidationRules.location}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
                list="locationOptions"
                datalist={
                  <datalist id="locationOptions">
                    {allLocations.map((location) => (
                      <option key={location} value={location} />
                    ))}
                  </datalist>
                }
              />

              <FormField
                label="Leader Name"
                name="leader"
                type="text"
                value={currentGroup.leader}
                onChange={handleInputChange}
                placeholder="Enter leader name"
                required={true}
                validation={cellGroupValidationRules.leader}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
              />

              <FormField
                label="Contact Email"
                name="contact"
                type="email"
                value={currentGroup.contact}
                onChange={handleInputChange}
                placeholder="Enter contact email"
                required={true}
                validation={cellGroupValidationRules.contact}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
              />

              <FormField
                label="Meeting Day"
                name="meetingDay"
                type="text"
                value={currentGroup.meetingDay}
                onChange={handleInputChange}
                placeholder="Select meeting day"
                required={true}
                validation={cellGroupValidationRules.meetingDay}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
                list="meetingDayOptions"
                datalist={
                  <datalist id="meetingDayOptions">
                    {[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((day) => (
                      <option key={day} value={day} />
                    ))}
                  </datalist>
                }
              />

              <FormField
                label="Meeting Time"
                name="meetingTime"
                type="text"
                value={currentGroup.meetingTime}
                onChange={handleInputChange}
                placeholder="e.g. 18:30 or 6:30 PM"
                required={true}
                validation={cellGroupValidationRules.meetingTime}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
                helpText="Format: HH:MM or HH:MM AM/PM"
              />

              <FormField
                label="Capacity"
                name="capacity"
                type="text"
                value={currentGroup.capacity}
                onChange={handleInputChange}
                placeholder="e.g. 15-20 people"
                required={false}
                validation={cellGroupValidationRules.capacity}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
              />

              <FormField
                label="Image URL"
                name="imageUrl"
                type="text"
                value={currentGroup.imageUrl}
                onChange={handleInputChange}
                placeholder="/assets/cell-groups/group-image.jpg"
                required={false}
                validation={cellGroupValidationRules.imageUrl}
                errors={formErrors}
                setErrors={setFormErrors}
                darkMode={darkMode}
              />

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${formErrors.description ? "text-red-500" : ""}`}
                >
                  Description*
                </label>
                <textarea
                  name="description"
                  value={currentGroup.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.description ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                  required
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${formErrors.tags ? "text-red-500" : ""}`}
                >
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={
                    typeof currentGroup.tags === "string"
                      ? currentGroup.tags
                      : currentGroup.tags.join(", ")
                  }
                  onChange={handleInputChange}
                  placeholder="e.g. Young Adults, Bible Study, Prayer"
                  className={`w-full px-3 py-2 border rounded-md ${formErrors.tags ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {formErrors.tags ? (
                  <p className="mt-1 text-xs text-red-500">{formErrors.tags}</p>
                ) : (
                  <p
                    className={`text-xs mt-1 ${darkMode ? "text-gray-300" : "text-gray-500"}`}
                  >
                    Separate multiple tags with commas
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${formErrors["coordinates.lat"] ? "text-red-500" : ""}`}
                >
                  Latitude
                </label>
                <input
                  type="number"
                  name="lat"
                  value={currentGroup.coordinates?.lat || 0}
                  onChange={handleInputChange}
                  step="0.000001"
                  className={`w-full px-3 py-2 border rounded-md ${formErrors["coordinates.lat"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {formErrors["coordinates.lat"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors["coordinates.lat"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${formErrors["coordinates.lng"] ? "text-red-500" : ""}`}
                >
                  Longitude
                </label>
                <input
                  type="number"
                  name="lng"
                  value={currentGroup.coordinates?.lng || 0}
                  onChange={handleInputChange}
                  step="0.000001"
                  className={`w-full px-3 py-2 border rounded-md ${formErrors["coordinates.lng"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {formErrors["coordinates.lng"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors["coordinates.lng"]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Cell Group"}
              </button>

              {formMode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className={`ml-2 py-2 px-4 border rounded-md ${darkMode ? "border-gray-600 hover:bg-gray-600" : "border-gray-300 hover:bg-gray-100"}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List of existing cell groups */}
          <div>
            <h3 className="text-lg font-medium mb-2">Existing Cell Groups</h3>

            {cellGroups.length === 0 ? (
              <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
                No cell groups found. Add your first cell group above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full divide-y ${darkMode ? "divide-gray-600" : "divide-gray-200"}`}
                >
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Zone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Leader
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Meeting Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${darkMode ? "divide-gray-600 bg-gray-800" : "divide-gray-200 bg-white"}`}
                  >
                    {cellGroups.map((group) => (
                      <tr key={group.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            // Extract zone ID, handling both string and object formats
                            let zoneId = "";
                            if (group.zone) {
                              if (typeof group.zone === "object") {
                                // If zone is an object, try to get the ID from it
                                zoneId = group.zone._id || group.zone.id || "";
                              } else {
                                // If zone is a string or other primitive
                                zoneId = group.zone.toString();
                              }
                            }

                            console.log(
                              `Cell group ${group.name} has zone ID: ${zoneId}`
                            );

                            // Find the zone with matching ID
                            const zone = zones.find((z) => {
                              const zId = z._id || z.id;
                              return String(zId) === String(zoneId);
                            });

                            return zone ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {zone.name}
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                No Zone
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.leader}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {group.meetingDay} at {group.meetingTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEdit(group)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(group.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Zones Tab Content */}
      {activeTab === "zones" && (
        <div>
          {/* Form for adding/editing zones */}
          <form
            onSubmit={handleZoneSubmit}
            className={`mb-8 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <h3 className="text-lg font-medium mb-4">
              {zoneFormMode === "add" ? "Add New Zone" : "Edit Zone"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField
                label="Zone Name"
                name="name"
                type="text"
                value={currentZone.name}
                onChange={handleZoneInputChange}
                placeholder="Enter zone name"
                required={true}
                validation={zoneValidationRules.name}
                errors={zoneFormErrors}
                setErrors={setZoneFormErrors}
                darkMode={darkMode}
              />

              <FormField
                label="Location"
                name="location"
                type="text"
                value={currentZone.location}
                onChange={handleZoneInputChange}
                placeholder="Enter zone location"
                required={true}
                validation={zoneValidationRules.location}
                errors={zoneFormErrors}
                setErrors={setZoneFormErrors}
                darkMode={darkMode}
              />

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors.iconName ? "text-red-500" : ""}`}
                >
                  Icon Name
                </label>
                <select
                  name="iconName"
                  value={currentZone.iconName}
                  onChange={handleZoneInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors.iconName ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                >
                  <option value="FaUsers">Users (Default)</option>
                  <option value="FaHome">Home</option>
                  <option value="FaHeart">Heart</option>
                  <option value="FaHandsHelping">Helping Hands</option>
                  <option value="FaPray">Prayer</option>
                  <option value="FaBible">Bible</option>
                </select>
                {zoneFormErrors.iconName && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors.iconName}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors.description ? "text-red-500" : ""}`}
                >
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentZone.description}
                  onChange={handleZoneInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors.description ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {zoneFormErrors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors.description}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold mt-2 mb-3">
                  Zone Elder Information
                </h4>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors["elder.name"] ? "text-red-500" : ""}`}
                >
                  Elder Name*
                </label>
                <input
                  type="text"
                  name="elder.name"
                  value={currentZone.elder.name}
                  onChange={handleZoneInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors["elder.name"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                  required
                />
                {zoneFormErrors["elder.name"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors["elder.name"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors["elder.title"] ? "text-red-500" : ""}`}
                >
                  Elder Title
                </label>
                <input
                  type="text"
                  name="elder.title"
                  value={currentZone.elder.title}
                  onChange={handleZoneInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors["elder.title"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {zoneFormErrors["elder.title"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors["elder.title"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors["elder.contact"] ? "text-red-500" : ""}`}
                >
                  Elder Contact Email
                </label>
                <input
                  type="email"
                  name="elder.contact"
                  value={currentZone.elder.contact}
                  onChange={handleZoneInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors["elder.contact"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {zoneFormErrors["elder.contact"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors["elder.contact"]}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors["elder.phone"] ? "text-red-500" : ""}`}
                >
                  Elder Phone
                </label>
                <input
                  type="text"
                  name="elder.phone"
                  value={currentZone.elder.phone}
                  onChange={handleZoneInputChange}
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors["elder.phone"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                  placeholder="e.g. +1 (555) 123-4567"
                />
                {zoneFormErrors["elder.phone"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors["elder.phone"]}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-1 ${zoneFormErrors["elder.bio"] ? "text-red-500" : ""}`}
                >
                  Elder Bio
                </label>
                <textarea
                  name="elder.bio"
                  value={currentZone.elder.bio}
                  onChange={handleZoneInputChange}
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md ${zoneFormErrors["elder.bio"] ? "border-red-500" : "border-gray-300"} ${darkMode ? "bg-gray-600 text-white" : "bg-white"}`}
                />
                {zoneFormErrors["elder.bio"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {zoneFormErrors["elder.bio"]}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : zoneFormMode === "add"
                    ? "Add Zone"
                    : "Update Zone"}
              </button>

              {zoneFormMode === "edit" && (
                <button
                  type="button"
                  onClick={resetZoneForm}
                  className={`ml-2 py-2 px-4 border rounded-md ${darkMode ? "border-gray-600 hover:bg-gray-600" : "border-gray-300 hover:bg-gray-100"}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List of existing zones */}
          <div>
            <h3 className="text-lg font-medium mb-2">Existing Zones</h3>

            {zones.length === 0 ? (
              <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
                No zones found. Add your first zone using the form above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className={`min-w-full divide-y ${darkMode ? "divide-gray-600" : "divide-gray-200"}`}
                >
                  <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Zone Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Elder
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Cell Groups
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y ${darkMode ? "divide-gray-600 bg-gray-800" : "divide-gray-200 bg-white"}`}
                  >
                    {zones.map((zone) => (
                      <tr key={zone.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {zone.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-500" />
                            {zone.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FaUser className="mr-2 text-gray-500" />
                            {zone.elder?.name || "Not assigned"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            // Count cell groups in this zone
                            const count = cellGroups.filter((group) => {
                              // Compare as strings to ensure consistent comparison
                              return String(group.zone) === String(zone.id);
                            }).length;
                            return `${count} ${count === 1 ? "group" : "groups"}`;
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleZoneEdit(zone)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleZoneDelete(zone.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {zones.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No zones found. Add your first zone using the form.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CellGroupManager;
