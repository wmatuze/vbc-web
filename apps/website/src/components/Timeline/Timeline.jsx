import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, MapPin, Calendar } from 'lucide-react';
import timelineData from './config.jsx';

const Timeline = () => {
  const [selectedYear, setSelectedYear] = useState(timelineData[0]?.year);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [visibleYears, setVisibleYears] = useState(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timelineRef = useRef(null);

  // Group events by year
  const eventsByYear = timelineData.reduce((acc, event) => {
    if (!acc[event.year]) {
      acc[event.year] = [];
    }
    acc[event.year].push(event);
    return acc;
  }, {});

  const years = Object.keys(eventsByYear).sort((a, b) => b - a);
  const currentEvents = eventsByYear[selectedYear] || [];
  const currentEvent = currentEvents[selectedEventIndex] || currentEvents[0];

  const handleYearSelect = useCallback(async (year) => {
    if (isTransitioning) return; // Prevent multiple rapid clicks
    
    setIsTransitioning(true);
    setSelectedYear(parseInt(year));
    setSelectedEventIndex(0); // Reset to first event of the year
    
    // Add a small delay for smooth transition
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [isTransitioning]);

  const handleEventNavigation = useCallback((direction) => {
    if (isTransitioning) return;
    
    const maxIndex = currentEvents.length - 1;
    if (direction === 'next' && selectedEventIndex < maxIndex) {
      setSelectedEventIndex(prev => prev + 1);
    } else if (direction === 'prev' && selectedEventIndex > 0) {
      setSelectedEventIndex(prev => prev - 1);
    }
  }, [selectedEventIndex, currentEvents.length, isTransitioning]);

  // Intersection Observer for timeline visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const year = parseInt(entry.target.dataset.year);
            setVisibleYears(prev => new Set([...prev, year]));
          }
        });
      },
      { threshold: 0.3 }
    );

    const yearElements = document.querySelectorAll('[data-year]');
    yearElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isTransitioning) return;
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = years.indexOf(selectedYear.toString());
        if (currentIndex > 0) {
          handleYearSelect(years[currentIndex - 1]);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = years.indexOf(selectedYear.toString());
        if (currentIndex < years.length - 1) {
          handleYearSelect(years[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowLeft') {
        handleEventNavigation('prev');
      } else if (e.key === 'ArrowRight') {
        handleEventNavigation('next');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedYear, years, handleYearSelect, handleEventNavigation, isTransitioning]);

  return (
    <>
      {/* Custom CSS to hide scrollbars */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      <div className="h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white mb-4 tracking-tight">
                Our Journey
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
                Exploring the milestones that shaped our story
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content - Full Screen Layout */}
        <div className="max-w-7xl mx-auto h-[calc(100vh-180px)] flex">
          {/* Left Sidebar - Timeline */}
          <div className="w-80 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 overflow-y-auto hide-scrollbar">


            {/* Timeline Years */}
            <div className="relative px-4 py-4">
              {/* Vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-600"></div>
              
              <div className="space-y-6">
                {years.map((year, index) => {
                  const yearInt = parseInt(year);
                  const events = eventsByYear[year];
                  const isSelected = selectedYear === yearInt;
                  const isVisible = visibleYears.has(yearInt);

                  return (
                    <motion.div
                      key={year}
                      data-year={yearInt}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ 
                        opacity: isVisible ? 1 : 0.5,
                        x: 0 
                      }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-center"
                    >
                      {/* Year marker */}
                      <button
                        onClick={() => handleYearSelect(year)}
                        disabled={isTransitioning}
                        className={`relative z-10 w-5 h-5 rounded-full border-3 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
                          isSelected
                            ? 'bg-gray-800 dark:bg-white border-gray-800 dark:border-white scale-110'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}
                        aria-label={`View events from ${year}`}
                      >
                        {isSelected && (
                          <div className="absolute inset-0.5 bg-white dark:bg-gray-800 rounded-full"></div>
                        )}
                      </button>

                      {/* Year label and event count */}
                      <div className="ml-4 flex-1">
                        <button
                          onClick={() => handleYearSelect(year)}
                          disabled={isTransitioning}
                          className="text-left group focus:outline-none disabled:cursor-not-allowed"
                        >
                          <div className={`text-xl font-light transition-colors ${
                            isSelected 
                              ? 'text-gray-900 dark:text-white' 
                              : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                          }`}>
                            {year}
                          </div>
                          {events.length > 1 && (
                            <div className={`text-xs font-medium transition-colors ${
                              isSelected 
                                ? 'text-blue-600 dark:text-blue-400' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}>
                              +{events.length}
                            </div>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Content Area - Scrollable Viewport */}
          <div className="flex-1 relative overflow-y-auto hide-scrollbar">
            <AnimatePresence mode="wait">
              {currentEvent && (
                <motion.div
                  key={`${selectedYear}-${selectedEventIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for smooth feel
                    opacity: { duration: 0.4 }
                  }}
                  className="relative min-h-full"
                >
                  {/* Background Image with Enhanced Gradient */}
                  {currentEvent.image && (
                    <div className="absolute inset-0">
                      <img 
                        src={`/images/timeline/${currentEvent.image}`}
                        alt={currentEvent.title}
                        className="w-full h-full object-cover opacity-25"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {/* Enhanced Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative z-10 min-h-full flex flex-col justify-center px-8 lg:px-12 py-8">
                    {/* Large Year Display - Compact Size */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mb-6 flex-shrink-0"
                    >
                      <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-gray-900 dark:text-white leading-none tracking-tight">
                        {selectedYear}
                      </div>
                    </motion.div>

                    {/* Event Content - Scrollable */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="max-w-4xl flex-grow"
                    >
                      {/* Event Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-light text-gray-900 dark:text-white mb-4 leading-tight uppercase tracking-wider">
                        {currentEvent.title}
                      </h2>

                      {/* Event Metadata */}
                      <div className="flex flex-wrap gap-4 mb-6 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          <span className="font-medium">{currentEvent.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5" />
                          <span className="font-medium">{currentEvent.location}</span>
                        </div>
                      </div>

                      {/* Event Description */}
                      <div className="space-y-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                        <p>{currentEvent.description}</p>
                        {currentEvent.additionalDetails && (
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                            {currentEvent.additionalDetails}
                          </p>
                        )}
                      </div>
                    </motion.div>

                    {/* Add bottom padding for navigation controls */}
                    <div className="pb-16"></div>

                    {/* Transition Loading Indicator */}
                    {isTransitioning && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center"
                      >
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Fixed Navigation Controls */}
            {currentEvents.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 right-6 flex gap-2 z-20"
              >
                <button
                  onClick={() => handleEventNavigation('prev')}
                  disabled={selectedEventIndex === 0 || isTransitioning}
                  className="p-3 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
                <button
                  onClick={() => handleEventNavigation('next')}
                  disabled={selectedEventIndex === currentEvents.length - 1 || isTransitioning}
                  className="p-3 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30 dark:hover:bg-gray-700/50 transition-colors"
                  aria-label="Next event"
                >
                  <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </motion.div>
            )}

            {/* Fixed Event Counter */}
            {currentEvents.length > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-8 lg:left-12 z-20"
              >
                <div className="px-4 py-2 bg-white/20 dark:bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedEventIndex + 1} of {currentEvents.length}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Timeline;