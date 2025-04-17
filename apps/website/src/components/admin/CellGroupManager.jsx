import { useState, useEffect } from "react";
import {
  createCellGroup,
  updateCellGroup,
  deleteCellGroup,
} from "../../services/api";
import { useCellGroupsQuery } from "../../hooks/useCellGroupsQuery";

const CellGroupManager = () => {
  // Use React Query for fetching cell groups
  const {
    data: cellGroups = [],
    isLoading: cellGroupsLoading,
    error: cellGroupsError,
    refetch: refetchCellGroups,
  } = useCellGroupsQuery();

  // Local state for operations other than fetching
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formMode, setFormMode] = useState("add"); // 'add' or 'edit'
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
  });

  // Display any query errors
  useEffect(() => {
    if (cellGroupsError) {
      setError("Failed to load cell groups. Please try again.");
    }
  }, [cellGroupsError]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "tags") {
      // Handle array values for tags
      setCurrentGroup((prev) => ({
        ...prev,
        tags: value.split(",").map((item) => item.trim()),
      }));
    } else if (name === "lat" || name === "lng") {
      // Handle nested coordinates
      setCurrentGroup((prev) => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value) || 0,
        },
      }));
    } else {
      // Handle regular fields
      setCurrentGroup((prev) => ({ ...prev, [name]: value }));
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
    });
    setFormMode("add");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (formMode === "add") {
        // For new groups, we need to create a new ID
        const newGroup = {
          ...currentGroup,
          id: Date.now(), // Simple way to generate a unique ID
        };
        await createCellGroup(newGroup);
      } else {
        // For editing, we keep the existing ID
        await updateCellGroup(currentGroup.id, currentGroup);
      }

      await refetchCellGroups();
      resetForm();
    } catch (err) {
      console.error("Error saving cell group:", err);
      setError("Failed to save cell group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group) => {
    // Convert tags array to string for editing
    setCurrentGroup({
      ...group,
      tags: group.tags ? group.tags.join(", ") : "",
    });
    setFormMode("edit");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this cell group?")) {
      try {
        setLoading(true);
        await deleteCellGroup(id);
        await refetchCellGroups();
      } catch (err) {
        console.error("Error deleting cell group:", err);
        setError("Failed to delete cell group. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Get all unique locations and meeting days for dropdowns
  const allLocations = [
    ...new Set(cellGroups.map((group) => group.location).filter(Boolean)),
  ];
  const allMeetingDays = [
    ...new Set(cellGroups.map((group) => group.meetingDay).filter(Boolean)),
  ];

  if (cellGroupsLoading && cellGroups.length === 0) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Cell Groups</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form for adding/editing cell groups */}
      <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {formMode === "add" ? "Add New Cell Group" : "Edit Cell Group"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <input
              type="text"
              name="name"
              value={currentGroup.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={currentGroup.location}
              onChange={handleInputChange}
              list="locationOptions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <datalist id="locationOptions">
              {allLocations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leader Name
            </label>
            <input
              type="text"
              name="leader"
              value={currentGroup.leader}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contact"
              value={currentGroup.contact}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Day
            </label>
            <input
              type="text"
              name="meetingDay"
              value={currentGroup.meetingDay}
              onChange={handleInputChange}
              list="meetingDayOptions"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Time
            </label>
            <input
              type="text"
              name="meetingTime"
              value={currentGroup.meetingTime}
              onChange={handleInputChange}
              placeholder="e.g. 18:30"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="text"
              name="capacity"
              value={currentGroup.capacity}
              onChange={handleInputChange}
              placeholder="e.g. 15-20 people"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="text"
              name="imageUrl"
              value={currentGroup.imageUrl}
              onChange={handleInputChange}
              placeholder="/assets/cell-groups/group-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={currentGroup.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              type="number"
              name="lat"
              value={currentGroup.coordinates?.lat || 0}
              onChange={handleInputChange}
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              type="number"
              name="lng"
              value={currentGroup.coordinates?.lng || 0}
              onChange={handleInputChange}
              step="0.000001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Cell Group"}
          </button>

          {formMode === "edit" && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
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
          <p className="text-gray-500">
            No cell groups found. Add your first cell group above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cellGroups.map((group) => (
                  <tr key={group.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {group.name}
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
  );
};

export default CellGroupManager;
