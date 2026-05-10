import { useState, useEffect } from "react";
import { getMedia } from "../../services/api/media";
import {
  XMarkIcon as XIcon,
  MagnifyingGlassIcon as SearchIcon,
  ArrowPathIcon as RefreshIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import config from "../../config";

const API_URL = config.API_URL;

const CATEGORIES = [
  { value: "all",        label: "All" },
  { value: "general",    label: "General" },
  { value: "sermon",     label: "Sermons" },
  { value: "event",      label: "Events" },
  { value: "leadership", label: "Leadership" },
  { value: "cell-group", label: "Cell Groups" },
  { value: "banner",     label: "Banners" },
  { value: "gallery",    label: "Gallery" },
];

const getMediaImageUrl = (item) => {
  if (!item) return "";
  if (item.path?.startsWith("http")) return item.path;
  if (item.path) return `${API_URL}${item.path}`;
  if (item.filename) return `${API_URL}/uploads/${item.filename}`;
  return "";
};

/**
 * Media picker modal — single-click selects and closes immediately.
 * Props: isOpen, onClose, onSelect(item)
 */
const MediaSelector = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm,     setSearchTerm]     = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [mediaItems,     setMediaItems]     = useState([]);
  const [isLoading,      setIsLoading]      = useState(false);
  const [error,          setError]          = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
      setSearchTerm("");
      setFilterCategory("all");
    }
  }, [isOpen]);

  const fetchMediaItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await getMedia();
      setMediaItems(
        items.map(item => ({
          ...item,
          id: item.id || item._id?.toString(),
          path: item.path || (item.filename ? `/uploads/${item.filename}` : null),
        }))
      );
    } catch (err) {
      setError("Failed to load media. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    if (filterCategory !== "all" && item.category !== filterCategory) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return item.title?.toLowerCase().includes(s)
          || item.filename?.toLowerCase().includes(s);
    }
    return true;
  });

  // Single click — select and close immediately
  const handlePick = (item) => {
    onSelect(item);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Choose from Media Library</h3>
          <div className="flex items-center gap-2">
            <button onClick={fetchMediaItems} disabled={isLoading}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors" title="Refresh">
              <RefreshIcon className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search + category pills */}
        <div className="flex flex-wrap gap-2 px-5 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex-1 min-w-[160px] relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search…" value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
          </div>
          <div className="flex flex-wrap gap-1">
            {CATEGORIES.map(c => (
              <button key={c.value} type="button" onClick={() => setFilterCategory(c.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  filterCategory === c.value
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <p className="px-5 pt-3 pb-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
          Click an image to select it — the library will close automatically
        </p>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              <button onClick={fetchMediaItems} className="text-sm text-gray-600 dark:text-gray-400 underline">Try again</button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400 dark:text-gray-500">
              <PhotoIcon className="h-10 w-10" />
              <p className="text-sm text-center">
                {mediaItems.length === 0
                  ? "No media uploaded yet.\nUpload images in the Media Library first."
                  : "No images match your search."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {filteredItems.map(item => (
                <button key={item.id || item._id} type="button" onClick={() => handlePick(item)}
                  className="group text-left rounded-lg overflow-hidden border-2 border-transparent hover:border-red-600 focus:outline-none focus:border-red-600 transition-all bg-gray-100 dark:bg-gray-700 shadow-sm hover:shadow-md">
                  <div className="relative pb-[70%] bg-gray-200 dark:bg-gray-600">
                    <img src={getMediaImageUrl(item)} alt={item.title || item.filename || ""}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={e => { e.target.style.display = "none"; }} />
                  </div>
                  <div className="p-1.5">
                    <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{item.title || item.filename || "Untitled"}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {filteredItems.length} {filteredItems.length === 1 ? "image" : "images"}
          </span>
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default MediaSelector;
