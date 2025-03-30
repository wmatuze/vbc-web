import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, ExternalLink } from 'lucide-react';

const TimelineEvent = ({ 
  event, 
  onPrev, 
  onNext, 
  currentIndex, 
  totalEvents, 
  isModal = false,
  onOpenModal 
}) => {
  // Determine if we should show the detailed view
  const showDetailedView = isModal || window.innerWidth >= 1024;
  
  // Function to render image with fallback
  const renderImage = () => {
    if (!event.image) return null;
    
    return (
      <div className={`${isModal ? 'w-full lg:w-1/2' : 'w-full'} relative overflow-hidden rounded-lg`}>
        <img 
          src={`/images/timeline/${event.image}`}
          alt={event.title}
          className="w-full h-auto object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/placeholder.jpg";
          }}
        />
      </div>
    );
  };

  return (
    <div className={`w-full text-gray-800 dark:text-gray-200 ${isModal ? 'p-0' : 'p-6'}`}>
      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="p-2 disabled:opacity-50 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Previous event"
          type="button"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm font-medium">
          {currentIndex + 1} of {totalEvents}
        </span>
        
        <button
          onClick={onNext}
          disabled={currentIndex === totalEvents - 1}
          className="p-2 disabled:opacity-50 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          aria-label="Next event"
          type="button"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Event Content */}
      <div className={`${isModal ? 'flex flex-col lg:flex-row gap-8' : ''}`}>
        {isModal && renderImage()}
        
        <div className={`${isModal ? 'w-full lg:w-1/2' : 'w-full'} space-y-6`}>
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">{event.year}</span>
            
            {event.location && (
              <>
                <span className="mx-2">•</span>
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{event.location}</span>
              </>
            )}
            
            {event.date && (
              <>
                <span className="mx-2">•</span>
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{event.date}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl font-bold leading-tight">
            {event.title}
          </h1>
          
          {!isModal && renderImage()}
          
          <div className="mt-4">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {isModal ? event.description : 
                event.description.length > 150 
                  ? `${event.description.substring(0, 150)}...` 
                  : event.description
              }
            </p>
            
            {!isModal && event.description.length > 150 && (
              <button 
                onClick={onOpenModal}
                className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center"
                type="button"
              >
                Read more <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
          
          {/* Additional event details in modal view */}
          {isModal && event.additionalDetails && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Additional Details</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {event.additionalDetails}
              </p>
            </div>
          )}
          
          {/* Related links in modal view */}
          {isModal && event.links && event.links.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Related Links</h3>
              <ul className="space-y-2">
                {event.links.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineEvent;
