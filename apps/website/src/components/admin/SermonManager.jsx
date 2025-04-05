import { useState, useEffect, useCallback } from "react";
import {
  getSermons,
  createSermon,
  updateSermon,
  deleteSermon,
  getMedia,
} from "../../services/api";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  VideoCameraIcon,
  ClockIcon,
  UserIcon,
  CalendarIcon,
  PhotoIcon as PhotographIcon,
  XMarkIcon as XIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon as SearchIcon,
  FunnelIcon as FilterIcon,
  ArrowUpIcon as SortAscendingIcon,
  ArrowPathIcon as RefreshIcon,
} from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import config from "../../config";

const API_URL = config.API_URL;

const SermonManager = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [currentSermon, setCurrentSermon] = useState({
    title: "",
    speaker: "",
    date: format(new Date(), "yyyy-MM-dd"),
    videoId: "",
    duration: "",
    imageUrl: "",
    image: null,
    description: "",
    series: "",
    tags: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeries, setFilterSeries] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [successMessage, setSuccessMessage] = useState("");
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'recent', 'past'
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false);
  const [mediaSearchTerm, setMediaSearchTerm] = useState("");
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [selectedMediaItem, setSelectedMediaItem] = useState(null);

  // Get unique series from sermons for filter dropdown
  const seriesList = [
    "all",
    ...new Set(sermons.filter((s) => s.series).map((s) => s.series)),
  ];

  const fetchSermons = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSermons();
      setSermons(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching sermons:", err);
      setError("Failed to load sermons. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  useEffect(() => {
    if (isMediaSelectorOpen) {
      const fetchMediaItems = async () => {
        try {
          setIsLoadingMedia(true);
          const mediaData = await getMedia();
          console.log("Fetched media items:", mediaData);
          setMediaItems(mediaData);
        } catch (error) {
          console.error("Error fetching media:", error);
        } finally {
          setIsLoadingMedia(false);
        }
      };

      fetchMediaItems();
    }
  }, [isMediaSelectorOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSermon((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    setCurrentSermon((prev) => ({ ...prev, tags }));
  };

  const getImagePreviewUrl = (imageUrl) => {
    if (!imageUrl) return null;
    console.log("Getting preview for:", imageUrl);
    const fullUrl = imageUrl.startsWith("/")
      ? `${API_URL}${imageUrl}`
      : imageUrl;
    console.log("Full preview URL:", fullUrl);
    return fullUrl;
  };

  // Base64 encoded small gray placeholder image
  const placeholderImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAYAAADGFbfiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAzLTA1VDIyOjMzOjMwLTA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMy0xM1QxMDowNTozOC0wNzowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo0ZGYyZjI5Yi1iOGNiLTZlNDktYWE4Ni0yYzAzODJjY2M5YjkiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2ZWJiZDlkOS0zYTVkLWM5NGMtOTVjNS0wNmM1Mzc0YmJhOTgiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjZlYmJkOWQ5LTNhNWQtYzk0Yy05NWM1LTA2YzUzNzRiYmE5OCIgc3RFdnQ6d2hlbj0iMjAyMC0wMy0wNVQyMjozMzozMC0wODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmYjRjYzkwZC1mNWRhLTRiNGMtOWVjYi0wYjgyODM0YzUxMmMiIHN0RXZ0OndoZW49IjIwMjAtMDMtMTNUMTA6MDU6MzgtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7JL8VBAAAF/UlEQVR4nO3dMW4bSRRA0TbgDbiJl+MluONGK3DGJVfoNbgEL8GdOzCgDowBDDPkkGxO/ycwGAgEWU3d4qtXPZ+engAAe/3v1QcAAO9JQAAgEhAA";

  const resetForm = () => {
    setCurrentSermon({
      title: "",
      speaker: "",
      date: format(new Date(), "yyyy-MM-dd"),
      videoId: "",
      duration: "",
      imageUrl: "",
      image: null,
      description: "",
      series: "",
      tags: [],
    });
    setSelectedMediaItem(null);
    setMediaSearchTerm("");
    setFormMode("add");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Format date for display
      const formattedSermon = {
        ...currentSermon,
        date: format(parseISO(currentSermon.date), "MMMM d, yyyy"),
      };

      // Ensure we're setting the image properly
      // If we have a selected Media object with an ID, use that as image reference
      if (currentSermon.image && currentSermon.image.id) {
        formattedSermon.image = currentSermon.image.id;
      }
      // If we only have an imageUrl but no image reference, keep the imageUrl
      else if (currentSermon.imageUrl && !formattedSermon.image) {
        formattedSermon.imageUrl = currentSermon.imageUrl;
        // Delete any invalid image reference
        delete formattedSermon.image;
      }

      console.log("Saving sermon with data:", formattedSermon);

      if (formMode === "add") {
        await createSermon({
          ...formattedSermon,
          id: Date.now(),
        });
        setSuccessMessage("Sermon added successfully!");
      } else {
        await updateSermon(currentSermon.id, formattedSermon);
        setSuccessMessage("Sermon updated successfully!");
      }

      await fetchSermons();
      resetForm();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving sermon:", err);
      setError("Failed to save sermon. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sermon) => {
    // Convert display date back to ISO format for input
    const isoDate = format(new Date(sermon.date), "yyyy-MM-dd");
    setCurrentSermon({
      ...sermon,
      date: isoDate,
      tags: sermon.tags || [],
    });
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sermon?")) {
      try {
        setLoading(true);
        await deleteSermon(id);
        setSuccessMessage("Sermon deleted successfully!");
        await fetchSermons();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        console.error("Error deleting sermon:", err);
        setError("Failed to delete sermon. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter and sort sermons
  const filteredSermons = sermons
    .filter((sermon) => {
      const matchesSearch =
        searchTerm === "" ||
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.tags?.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSeries =
        filterSeries === "all" || sermon.series === filterSeries;

      // Date filtering
      let matchesDateFilter = true;
      if (dateFilter !== "all") {
        const sermonDate = new Date(sermon.date);
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);

        if (dateFilter === "recent") {
          // Recent sermons (last 30 days)
          matchesDateFilter = sermonDate >= thirtyDaysAgo;
        } else if (dateFilter === "past") {
          // Past sermons (older than 30 days)
          matchesDateFilter = sermonDate < thirtyDaysAgo;
        }
      }

      return matchesSearch && matchesSeries && matchesDateFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a[sortBy]);
      const dateB = new Date(b[sortBy]);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  // Handle image error
  const handleImageError = (e) => {
    console.error("Failed to load image:", e.target.src);
    // Use the base64 encoded placeholder image that's already defined above
    e.target.src = placeholderImage;
    e.target.onerror = null; // Prevent infinite error loop
  };

  const handleMediaSelection = () => {
    if (selectedMediaItem) {
      const imagePath = selectedMediaItem.path
        ? selectedMediaItem.path
        : `/uploads/${selectedMediaItem.filename}`;
      console.log("Selected media item:", selectedMediaItem);
      console.log("Using image path:", imagePath);

      // Set both the imageUrl for display and the image object reference for the database
      setCurrentSermon((prev) => ({
        ...prev,
        // Set imageUrl for display purposes
        imageUrl: imagePath,
        // Set the whole media object to extract ID during save
        image: selectedMediaItem,
      }));
      setSelectedMediaItem(null);
      setIsMediaSelectorOpen(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sermons</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your sermon library
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setFormMode("add");
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Sermon
          </button>

          <button
            onClick={fetchSermons}
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
            title="Refresh sermons"
          >
            <RefreshIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sermons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filterSeries}
            onChange={(e) => setFilterSeries(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="all">All Series</option>
            {seriesList
              .filter((s) => s !== "all")
              .map((series) => (
                <option key={series} value={series}>
                  {series}
                </option>
              ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="all">All Dates</option>
            <option value="recent">Recent Sermons</option>
            <option value="past">Past Sermons</option>
          </select>

          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
            title="Toggle sort order"
          >
            <SortAscendingIcon
              className={`h-5 w-5 transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Sermons List */}
      {loading && sermons.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : filteredSermons.length === 0 ? (
        <div className="text-center py-12">
          <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No sermons found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterSeries !== "all"
              ? "Try adjusting your search or filter settings"
              : "Get started by adding a new sermon"}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {filteredSermons.map((sermon) => (
              <li key={sermon.id} className="hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {sermon.title}
                      </h4>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{sermon.speaker}</span>
                        <CalendarIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400" />
                        <span>{sermon.date}</span>
                        {sermon.duration && (
                          <>
                            <ClockIcon className="flex-shrink-0 ml-4 mr-1.5 h-5 w-5 text-gray-400" />
                            <span>{sermon.duration}</span>
                          </>
                        )}
                      </div>
                      {sermon.series && (
                        <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {sermon.series}
                        </span>
                      )}
                      {sermon.tags && sermon.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sermon.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(sermon)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title="Edit"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sermon.id)}
                        className="p-2 text-red-400 hover:text-red-500"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {formMode === "add" ? "Add New Sermon" : "Edit Sermon"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Fill in the sermon details below
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={currentSermon.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="speaker"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Speaker
                      </label>
                      <input
                        type="text"
                        id="speaker"
                        name="speaker"
                        value={currentSermon.speaker}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={currentSermon.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="videoId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        YouTube Video ID
                      </label>
                      <input
                        type="text"
                        id="videoId"
                        name="videoId"
                        value={currentSermon.videoId}
                        onChange={handleInputChange}
                        placeholder="e.g. dQw4w9WgXcQ"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Found in the YouTube URL after "v="
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Duration
                      </label>
                      <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={currentSermon.duration}
                        onChange={handleInputChange}
                        placeholder="e.g. 1:05:38"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="series"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Series
                      </label>
                      <input
                        type="text"
                        id="series"
                        name="series"
                        value={currentSermon.series}
                        onChange={handleInputChange}
                        placeholder="e.g. Easter 2024"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="tags"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tags
                      </label>
                      <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={currentSermon.tags?.join(", ") || ""}
                        onChange={handleTagsChange}
                        placeholder="faith, prayer, healing"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Separate tags with commas
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={currentSermon.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="imageUrl"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Thumbnail Image
                      </label>
                      <div className="mt-1 flex flex-col space-y-2">
                        {/* Media selector with preview */}
                        <div className="flex items-start space-x-2">
                          {/* Image preview */}
                          <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            {currentSermon.imageUrl ? (
                              <img
                                src={getImagePreviewUrl(currentSermon.imageUrl)}
                                alt="Sermon thumbnail"
                                className="w-full h-full object-cover"
                                onError={handleImageError}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <PhotographIcon className="h-12 w-12" />
                              </div>
                            )}
                          </div>

                          {/* Media selection controls */}
                          <div className="flex-1 flex flex-col">
                            {/* Media library popup button */}
                            <div className="mb-2">
                              <button
                                type="button"
                                onClick={() => setIsMediaSelectorOpen(true)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <PhotographIcon className="h-5 w-5 mr-2 text-gray-400" />
                                Browse Media Library
                              </button>
                            </div>

                            {/* URL input field (fallback method) */}
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                id="imageUrl"
                                name="imageUrl"
                                value={currentSermon.imageUrl}
                                onChange={handleInputChange}
                                placeholder="/uploads/image.jpg"
                                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                              />
                              {currentSermon.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCurrentSermon((prev) => ({
                                      ...prev,
                                      imageUrl: "",
                                      image: null,
                                    }))
                                  }
                                  className="p-1 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300"
                                >
                                  <XIcon className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                              Enter image path manually or select from Media
                              Library
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
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
                        Saving...
                      </>
                    ) : (
                      "Save Sermon"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Media Selector Modal */}
      {isMediaSelectorOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsMediaSelectorOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg font-medium text-gray-900">
                      Select Thumbnail Image
                    </h3>
                    <div className="mt-4">
                      {/* Search bar */}
                      <div className="relative mb-4">
                        <input
                          type="text"
                          placeholder="Search media..."
                          value={mediaSearchTerm}
                          onChange={(e) => setMediaSearchTerm(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Loading indicator */}
                      {isLoadingMedia ? (
                        <div className="flex justify-center p-12">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                        </div>
                      ) : mediaItems.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          No media items found
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2">
                          {mediaItems
                            .filter(
                              (item) =>
                                !mediaSearchTerm ||
                                item.title
                                  ?.toLowerCase()
                                  .includes(mediaSearchTerm.toLowerCase()) ||
                                item.filename
                                  ?.toLowerCase()
                                  .includes(mediaSearchTerm.toLowerCase())
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className={`cursor-pointer rounded-lg overflow-hidden border-2 ${selectedMediaItem?.id === item.id ? "border-blue-500" : "border-transparent"} hover:border-blue-300`}
                                onClick={() => setSelectedMediaItem(item)}
                              >
                                <div className="relative aspect-w-1 aspect-h-1 bg-gray-200">
                                  <img
                                    src={
                                      item.path
                                        ? `${API_URL}${item.path}`
                                        : `${API_URL}/uploads/${item.filename}`
                                    }
                                    alt={item.title || item.filename}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.error(
                                        `Failed to load image: ${item.path || item.filename}`
                                      );
                                      e.target.src = placeholderImage;
                                    }}
                                  />
                                </div>
                                <div className="p-1 text-xs text-center truncate">
                                  {item.title || item.filename}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={!selectedMediaItem}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    !selectedMediaItem ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleMediaSelection}
                >
                  Select Image
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsMediaSelectorOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SermonManager;
