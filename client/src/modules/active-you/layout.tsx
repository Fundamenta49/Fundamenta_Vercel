import React from 'react';
import { ActiveYouProvider } from './context/module-context';
import Sidebar from './components/sidebar';
import { ExerciseType } from './context/module-context';

interface LayoutProps {
  children: React.ReactNode;
  defaultTab?: ExerciseType;
}

export default function Layout({ children, defaultTab = 'meditation' }: LayoutProps) {
  return (
    <ActiveYouProvider defaultTab={defaultTab}>
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </ActiveYouProvider>
  );
}