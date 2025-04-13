import React from 'react';
import { TourProvider } from '@/contexts/tours/tour-context';
import TourGuide from './tour-guide';
import { availableTours } from './tour-data';
import './tour.css';

/**
 * Main tour component that wraps the application with the tour provider
 * and renders the tour guide when active
 */
export default function TourSystem({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider tours={availableTours}>
      {children}
      <TourGuide />
    </TourProvider>
  );
}

// Export all tour components for individual use
export { default as TourButton } from './tour-button';
export { default as TourGuide } from './tour-guide';
export { availableTours } from './tour-data';
export { useTour } from '@/contexts/tours/tour-context';
export type { Tour, TourStep } from '@/contexts/tours/tour-context';