import React from 'react';

// Styling for elements highlighted during the tour
const TourHighlight = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Style for the elements that should be highlighted */
        .robot-fundi.tour-highlight {
          position: relative;
          z-index: 50;
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
          pointer-events: auto;
        }
        
        /* Generic styles for other elements that may be highlighted */
        .course-list.tour-highlight,
        .finance-tools.tour-highlight,
        .resume-builder.tour-highlight,
        .meditation-guide.tour-highlight,
        .fitness-tracker.tour-highlight,
        .emergency-guides.tour-highlight {
          position: relative;
          z-index: 50;
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
          pointer-events: auto;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
          }
        }
      `
    }} />
  );
};

export default TourHighlight;