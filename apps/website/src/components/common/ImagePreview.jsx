import { XMarkIcon as XIcon } from "@heroicons/react/24/outline";

/**
 * Image preview modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.imageUrl - URL of the image to preview
 * @param {Function} props.onClose - Function to call when the modal is closed
 */
const ImagePreview = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center">
      <div className="relative max-w-3xl mx-auto">
        <img 
          src={imageUrl} 
          alt="Image preview" 
          className="max-h-screen max-w-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E`;
          }}
        />
        <button
          className="absolute top-4 right-4 rounded-full bg-gray-800 bg-opacity-70 p-2 text-white hover:bg-gray-700"
          onClick={onClose}
        >
          <XIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ImagePreview; 