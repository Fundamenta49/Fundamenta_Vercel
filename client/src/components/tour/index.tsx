import React from 'react';
import TourModal from './tour-modal';
import TourHighlight from './tour-highlight';

// Main tour component that includes all tour-related subcomponents
const Tour = () => {
  return (
    <>
      <TourModal />
      <TourHighlight />
    </>
  );
};

export default Tour;