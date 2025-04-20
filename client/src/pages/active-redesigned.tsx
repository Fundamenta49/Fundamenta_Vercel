import React, { useEffect, useState } from 'react';
import ActiveYouModule from '../modules/active-you';
import { useLocation } from 'wouter';
import { ExerciseType } from '../modules/active-you/context/module-context';

export default function ActivePage() {
  // Get the section from URL parameters
  const [location] = useLocation();
  const [section, setSection] = useState<ExerciseType>('meditation');
  
  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const sectionParam = params.get('section');
    
    if (sectionParam) {
      // Validate that it's a valid section type
      const validSections: ExerciseType[] = ['activeyou', 'meditation', 'weightlifting', 'yoga', 'running', 'hiit', 'stretch'];
      if (validSections.includes(sectionParam as ExerciseType)) {
        setSection(sectionParam as ExerciseType);
      }
    }
  }, [location]);

  return <ActiveYouModule defaultTab={section} />;
}