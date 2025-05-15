import React from 'react';
import JungleHub from '@/components/jungle/JungleHub';
import { LearningThemeProvider } from "@/contexts/LearningThemeContext";

export default function MyPathJungleHub() {
  return (
    <LearningThemeProvider initialTheme="jungle">
      <JungleHub />
    </LearningThemeProvider>
  );
}