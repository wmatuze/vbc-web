import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from 'lucide-react';
import timelineData from './config.jsx';

const Timeline = () => {
  const [selectedYear, setSelectedYear] = useState(timelineData[0]?.year);
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const eventsByYear = timelineData.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = [];
    acc[event.year].push(event);
    return acc;
  }, {});

  const years = Object.keys(eventsByYear).sort((a, b) => b - a);
  const currentEvents = eventsByYear[selectedYear] || [];
  const currentEvent = currentEvents[selectedEventIndex] || currentEvents[0];

  const handleYearSelect = useCallback((year) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setSelectedYear(parseInt(year));
    setSelectedEventIndex(0);
    setTimeout(() => setIsTransitioning(false), 500);
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

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isTransitioning) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const i = years.indexOf(selectedYear.toString());
        if (i > 0) handleYearSelect(years[i - 1]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const i = years.indexOf(selectedYear.toString());
        if (i < years.length - 1) handleYearSelect(years[i + 1]);
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
      <style>{`
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="h-screen bg-vbc-dark overflow-hidden flex">

        {/* Left sidebar — year list */}
        <div className="w-64 bg-vbc-section border-r border-white/10 overflow-y-auto hide-scrollbar flex-shrink-0 flex flex-col">
          <div className="px-8 pt-10 pb-6">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-10">
              Timeline
            </p>

            {/* Year list */}
            <div className="relative">
              {/* Vertical red line */}
              <div className="absolute left-[5px] top-0 bottom-0 w-px bg-brand-red/25" />

              <div className="space-y-7 pl-7">
                {years.map((year) => {
                  const yearInt = parseInt(year);
                  const events = eventsByYear[year];
                  const isSelected = selectedYear === yearInt;

                  return (
                    <div key={year} className="relative flex items-center">
                      {/* Square dot marker */}
                      <button
                        onClick={() => handleYearSelect(year)}
                        disabled={isTransitioning}
                        className={`absolute -left-7 w-[11px] h-[11px] transition-all duration-300 disabled:cursor-not-allowed focus:outline-none ${
                          isSelected
                            ? 'bg-brand-red scale-125'
                            : 'bg-white/15 hover:bg-white/35'
                        }`}
                        aria-label={`View events from ${year}`}
                      />

                      <button
                        onClick={() => handleYearSelect(year)}
                        disabled={isTransitioning}
                        className="text-left group disabled:cursor-not-allowed focus:outline-none"
                      >
                        <div className={`text-2xl font-light tracking-tight transition-colors leading-none ${
                          isSelected
                            ? 'text-white'
                            : 'text-white/25 group-hover:text-white/55'
                        }`}>
                          {year}
                        </div>
                        {events.length > 1 && (
                          <div className={`text-xs mt-0.5 transition-colors ${
                            isSelected ? 'text-brand-red' : 'text-white/15'
                          }`}>
                            {events.length} events
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="mt-auto px-8 pb-8">
            <p className="text-white/15 text-xs uppercase tracking-widest leading-relaxed">
              ↑ ↓ navigate years<br />
              ← → navigate events
            </p>
          </div>
        </div>

        {/* Right content panel */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentEvent && (
              <motion.div
                key={`${selectedYear}-${selectedEventIndex}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.45, ease: [0.4, 0.0, 0.2, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                {/* Background image — very subtle */}
                {currentEvent.image && (
                  <div className="absolute inset-0">
                    <img
                      src={`/images/timeline/${currentEvent.image}`}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover opacity-[0.06]"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-vbc-dark via-vbc-dark/60 to-transparent" />
                  </div>
                )}

                {/* Ghost year watermark */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 right-0 font-black text-white leading-none select-none pointer-events-none"
                  style={{ fontSize: 'clamp(8rem, 22vw, 20rem)', opacity: 0.03 }}
                >
                  {selectedYear}
                </span>

                {/* Event content */}
                <div className="relative z-10 px-12 lg:px-20 py-12 max-w-3xl">
                  {/* Date + location eyebrow */}
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
                      {currentEvent.date}
                    </p>
                    <span className="text-white/20">·</span>
                    <p className="text-white/40 text-xs uppercase tracking-[0.15em]">
                      {currentEvent.location}
                    </p>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                    {currentEvent.title}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-4">
                    {currentEvent.description}
                  </p>
                  {currentEvent.additionalDetails && (
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {currentEvent.additionalDetails}
                    </p>
                  )}
                </div>

                {/* Transition overlay */}
                {isTransitioning && (
                  <div className="absolute inset-0 bg-vbc-dark/60 flex items-center justify-center z-20">
                    <div className="w-5 h-5 border border-white/20 border-t-white/50 rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event navigation — bottom right */}
          {currentEvents.length > 1 && (
            <div className="absolute bottom-8 right-8 flex items-center gap-4 z-20">
              <span className="text-white/25 text-xs uppercase tracking-widest">
                {selectedEventIndex + 1} / {currentEvents.length}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEventNavigation('prev')}
                  disabled={selectedEventIndex === 0 || isTransitioning}
                  className="p-2.5 border border-white/15 text-white/40 disabled:opacity-25 disabled:cursor-not-allowed hover:border-white/30 hover:text-white/70 transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEventNavigation('next')}
                  disabled={selectedEventIndex === currentEvents.length - 1 || isTransitioning}
                  className="p-2.5 border border-white/15 text-white/40 disabled:opacity-25 disabled:cursor-not-allowed hover:border-white/30 hover:text-white/70 transition-colors"
                  aria-label="Next event"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default Timeline;
