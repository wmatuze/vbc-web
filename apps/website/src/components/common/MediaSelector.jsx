import { useState, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { getImageUrl } from "../../utils/imageUtils";
import { getMedia } from "../../services/api";
import { XMarkIcon as XIcon, MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";
import config from "../../config";

const API_URL = config.API_URL;

/**
 * Media selector modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onSelect - Function to call when a media item is selected
 */
const MediaSelector = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch media items when modal is opened
  useEffect(() => {
    if (isOpen) {
      fetchMediaItems();
    }
  }, [isOpen]);
  
  // Function to fetch media items directly from API
  const fetchMediaItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const items = await getMedia();
      console.log("Fetched media items:", items);
      
      // Ensure items have proper URLs
      const processedItems = items.map(item => ({
        ...item,
        id: item._id || item.id, // Normalize ID
        // Ensure path is set
        path: item.path || (item.filename ? `/uploads/${item.filename}` : null),
      }));
      
      setMediaItems(processedItems);
    } catch (err) {
      console.error("Error fetching media items:", err);
      setError("Failed to load media. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get proper image URL with API_URL prefix when needed
  const getMediaImageUrl = (item) => {
    if (!item) return "";
    
    // If it's a full URL
    if (item.path && item.path.startsWith("http")) {
      return item.path;
    }
    
    // If path is available
    if (item.path) {
      return `${API_URL}${item.path}`;
    }
    
    // Fallback to filename
    if (item.filename) {
      return `${API_URL}/uploads/${item.filename}`;
    }
    
    return "";
  };
  
  // Filter media items by search term
  const filteredItems = searchTerm 
    ? mediaItems.filter(item => 
        (item.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.filename?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : mediaItems;
    
  const handleSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem);
      setSelectedItem(null);
    }
  };
  
  const handleRefresh = () => {
    fetchMediaItems();
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 overflow-y-auto z-50">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Select Media
                  </h3>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="text-gray-400 hover:text-gray-500"
                    title="Refresh media"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search media items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : error ? (
                    <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-3 rounded">
                      {typeof error === 'string' ? error : (error.message || 'An unknown error occurred')}
                      <button 
                        onClick={handleRefresh}
                        className="ml-2 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="text-center p-6 text-gray-500 dark:text-gray-400">
                      {mediaItems.length === 0 ? 
                        "No media items found. Upload some media in the Media Manager." : 
                        "No matching media items. Try a different search term."}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-80">
                      {filteredItems.map((item) => (
                        <div
                          key={item._id || item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`cursor-pointer border rounded-md overflow-hidden ${
                            selectedItem?._id === item._id ||
                            selectedItem?.id === item.id
                              ? "ring-2 ring-blue-500 dark:ring-blue-400"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="h-24 bg-gray-100 dark:bg-gray-700 relative">
                            <img
                              src={getMediaImageUrl(item)}
                              alt={item.title || item.filename || "Media item"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
                              }}
                            />
                          </div>
                          <div className="p-2">
                            <p className="text-xs text-gray-900 dark:text-white truncate">
                              {item.title || item.filename || "Untitled"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={!selectedItem}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                !selectedItem ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleSelect}
            >
              Select Image
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaSelector; 