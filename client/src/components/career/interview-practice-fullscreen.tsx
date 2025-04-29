import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InterviewPracticeRedesigned from '@/components/interview-practice-redesigned';
import SwipeToClose from '@/components/ui/swipe-to-close';

// Interview Practice Fullscreen Component
export default function InterviewPracticeFullscreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b shadow-sm">
        <h1 className="text-xl font-semibold text-blue-900">Interview Practice</h1>
        <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <SwipeToClose onClose={onClose} threshold={120}>
        <div className="overflow-auto h-[calc(100vh-56px)] p-4">
          <InterviewPracticeRedesigned />
        </div>
      </SwipeToClose>
    </div>
  );
}