import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { notificationService, NotificationType, Notification } from "@/services/notification-service";
import { format, addMinutes } from 'date-fns';

/**
 * Test component to demonstrate notification functionality.
 * This is for testing only and will not be part of the final UI.
 */
const TestNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  const createTestFinancialEvent = () => {
    // Create a test event for demonstrating notifications
    const now = new Date();
    const futureTime = addMinutes(now, 1); // Event will happen in 1 minute
    
    // Create a notification for the test event
    const notification: Notification = {
      id: `test-event-${now.getTime()}`,
      type: NotificationType.LEARNING_REMINDER,
      title: 'Financial Learning Reminder',
      message: 'Your "Financial Basics" learning session is scheduled to start soon. Would you like to start now?',
      actionUrl: '/learning/courses/economics',
      actionLabel: 'Start Learning',
      timestamp: now,
      read: false,
      eventId: 'test-event-id',
    };
    
    notificationService.addNotification(notification);
    
    // Show confirmation
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={createTestFinancialEvent} variant="secondary" size="sm">
        Test Notification
      </Button>
      
      {isVisible && (
        <div className="mt-2 p-2 bg-green-100 text-green-700 rounded-md text-xs animate-in fade-in">
          Test notification created!
        </div>
      )}
    </div>
  );
};

export default TestNotification;