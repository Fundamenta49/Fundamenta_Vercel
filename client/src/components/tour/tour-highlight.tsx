import React from 'react';

// Styling for elements highlighted during the tour
const TourHighlight = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        .tour-highlight {
          position: relative;
          z-index: 50;
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4);
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