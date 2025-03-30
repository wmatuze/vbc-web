import { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import TimelineEvent from './TimelineEvent';
import timelineData from './config.jsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Timeline = () => {
  const [selectedYear, setSelectedYear] = useState(timelineData[0].year);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const scrollRef = useRef(null);

  const handleYearClick = (year, index) => {
    setSelectedYear(year);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleNavigation = (direction) => {
    const newIndex = direction === 'next' 
      ? Math.min(currentIndex + 1, timelineData.length - 1)
      : Math.max(currentIndex - 1, 0);
    setCurrentIndex(newIndex);
    setSelectedYear(timelineData[newIndex].year);
    
    // Smooth scroll to the selected year marker
    const timelineElem = document.getElementById(`year-${timelineData[newIndex].year}`);
    if (timelineElem && scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollPosition = timelineElem.offsetLeft - (containerWidth / 2) + (timelineElem.clientWidth / 2);
      scrollRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 py-12 px-4 min-h-screen">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Journey Through Time</h2>
        
        {/* Horizontal Timeline */}
        <div className="relative mb-16">
          {/* Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-700 transform -translate-y-1/2" />
          
          {/* Scroll Container */}
          <div 
            ref={scrollRef}
            className="relative overflow-x-auto pb-8 hide-scrollbar" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center space-x-24 px-12 py-8 min-w-max">
              {timelineData.map((event, index) => (
                <div
                  id={`year-${event.year}`}
                  key={event.year}
                  className="relative flex flex-col items-center"
                >
                  <button
                    onClick={() => handleYearClick(event.year, index)}
                    className="group flex flex-col items-center"
                    type="button"
                  >
                    <div className={`w-6 h-6 rounded-full transition-all duration-300 z-10 border-2 ${
                      selectedYear === event.year
                        ? 'bg-blue-600 border-blue-600 scale-125'
                        : 'bg-white dark:bg-gray-800 border-gray-400 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                    }`} />
                    
                    <span className="mt-4 text-gray-800 dark:text-gray-200 font-bold text-lg">
                      {event.year}
                    </span>
                    
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg max-w-[150px] text-center">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{event.title}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Controls */}
          <button 
            onClick={() => handleNavigation('prev')} 
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
            type="button"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
          
          <button 
            onClick={() => handleNavigation('next')} 
            disabled={currentIndex === timelineData.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed z-10"
            type="button"
          >
            <ChevronRight className="w-6 h-6 text-gray-800 dark:text-gray-200" />
          </button>
        </div>
        
        {/* Current Event Featured Display */}
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-4xl mx-auto"
        >
          <TimelineEvent 
            event={timelineData[currentIndex]}
            onPrev={() => handleNavigation('prev')}
            onNext={() => handleNavigation('next')}
            currentIndex={currentIndex}
            totalEvents={timelineData.length}
            isModal={false}
            onOpenModal={() => setShowModal(true)}
          />
        </motion.div>
      </div>
      
      {/* Modal View */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={closeModal}>
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <TimelineEvent 
              event={timelineData[currentIndex]}
              onPrev={() => handleNavigation('prev')}
              onNext={() => handleNavigation('next')}
              currentIndex={currentIndex}
              totalEvents={timelineData.length}
              isModal={true}
            />
          </div>
        </div>
      )}
      
      {/* Custom scrollbar style */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Timeline;