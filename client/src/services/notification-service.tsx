import { CalendarEvent } from './calendar-service';
import { toast } from '@/hooks/use-toast';
import { addMinutes, isBefore, isAfter, isSameDay, format } from 'date-fns';
import * as React from 'react';

// Notification types
export enum NotificationType {
  UPCOMING_EVENT = 'upcoming-event',
  LEARNING_REMINDER = 'learning-reminder',
  EVENT_STARTED = 'event-started',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  timestamp: Date;
  read: boolean;
  eventId?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private checkInterval: number = 60000; // Check every minute
  private intervalId: NodeJS.Timeout | null = null;
  private reminderTimes: number[] = [15, 60]; // Remind 15 minutes and 1 hour before events

  constructor() {
    this.loadFromStorage();
  }

  // Start monitoring for events that need notifications
  public startMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    // Immediately check for notifications on startup
    this.checkForEventNotifications();
    
    // Set up interval for checking
    this.intervalId = setInterval(() => {
      this.checkForEventNotifications();
    }, this.checkInterval);

    console.log('Notification monitoring started');
  }

  // Stop monitoring
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Notification monitoring stopped');
    }
  }

  // Check for events that need notifications
  private checkForEventNotifications(): void {
    // Get events from calendar service
    let events: CalendarEvent[] = [];
    try {
      const calendarService = require('./calendar-service').calendarService;
      events = calendarService.getEvents();
    } catch (error) {
      console.error('Error loading events for notifications:', error);
      return;
    }

    const now = new Date();
    
    // Check each event
    events.forEach(event => {
      // Skip past events
      if (!event.startTime || isBefore(event.startTime, now)) {
        return;
      }
      
      // Check if event is today
      if (isSameDay(event.date, now)) {
        // Check for upcoming reminders
        this.reminderTimes.forEach(minutes => {
          const reminderTime = addMinutes(event.startTime!, -minutes);
          
          // If we're within 1 minute of the reminder time, create notification
          if (
            isAfter(now, addMinutes(reminderTime, -1)) && 
            isBefore(now, addMinutes(reminderTime, 1))
          ) {
            this.createEventReminder(event, minutes);
          }
        });
        
        // Check if event is just starting (within the last minute)
        if (
          isAfter(now, addMinutes(event.startTime!, -1)) && 
          isBefore(now, addMinutes(event.startTime!, 1))
        ) {
          this.createEventStartedNotification(event);
        }
      }
    });
  }

  // Create a reminder notification for an upcoming event
  private createEventReminder(event: CalendarEvent, minutesBefore: number): void {
    // Check if we already sent this notification
    const existingNotification = this.notifications.find(
      n => n.eventId === event.id && 
           n.type === NotificationType.UPCOMING_EVENT &&
           n.message.includes(`${minutesBefore} minute`)
    );
    
    if (existingNotification) {
      return;
    }

    const isLearningEvent = !!event.learningResourceId;
    const notificationType = isLearningEvent 
      ? NotificationType.LEARNING_REMINDER 
      : NotificationType.UPCOMING_EVENT;
    
    const title = isLearningEvent 
      ? 'Learning Session Reminder' 
      : 'Upcoming Event';
    
    const message = isLearningEvent
      ? `Your "${event.title}" learning session is scheduled to start in ${minutesBefore} minute${minutesBefore !== 1 ? 's' : ''}. Would you like to start now?`
      : `Your event "${event.title}" starts in ${minutesBefore} minute${minutesBefore !== 1 ? 's' : ''}.`;
    
    const actionUrl = isLearningEvent 
      ? `/learning/courses/${event.learningResourceId}` 
      : undefined;
    
    const actionLabel = isLearningEvent ? 'Start Learning' : undefined;

    const notification: Notification = {
      id: `${event.id}-reminder-${minutesBefore}-${new Date().getTime()}`,
      type: notificationType,
      title,
      message,
      actionUrl,
      actionLabel,
      timestamp: new Date(),
      read: false,
      eventId: event.id,
    };

    this.addNotification(notification);
    
    // Show toast for the notification
    toast({
      title,
      description: message,
      duration: 10000, // 10 seconds
      action: actionLabel && actionUrl ? (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          onClick={() => {
            window.location.href = actionUrl;
            this.markAsRead(notification.id);
          }}
        >
          {actionLabel}
        </button>
      ) : undefined,
    });
  }

  // Create a notification for an event that just started
  private createEventStartedNotification(event: CalendarEvent): void {
    // Check if we already sent this notification
    const existingNotification = this.notifications.find(
      n => n.eventId === event.id && n.type === NotificationType.EVENT_STARTED
    );
    
    if (existingNotification) {
      return;
    }
    
    const isLearningEvent = !!event.learningResourceId;
    const title = isLearningEvent ? 'Learning Session Started' : 'Event Started';
    const message = isLearningEvent
      ? `Your "${event.title}" learning session is starting now. Would you like to begin?`
      : `Your event "${event.title}" is starting now.`;
    
    const actionUrl = isLearningEvent 
      ? `/learning/courses/${event.learningResourceId}` 
      : undefined;
    
    const actionLabel = isLearningEvent ? 'Start Learning' : undefined;

    const notification: Notification = {
      id: `${event.id}-started-${new Date().getTime()}`,
      type: NotificationType.EVENT_STARTED,
      title,
      message,
      actionUrl,
      actionLabel,
      timestamp: new Date(),
      read: false,
      eventId: event.id,
    };

    this.addNotification(notification);
    
    // Show toast for the notification
    toast({
      title,
      description: message,
      duration: 10000, // 10 seconds
      action: actionLabel && actionUrl ? (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          onClick={() => {
            window.location.href = actionUrl;
            this.markAsRead(notification.id);
          }}
        >
          {actionLabel}
        </button>
      ) : undefined,
    });
  }

  // Add a notification to the list
  public addNotification(notification: Notification): void {
    this.notifications.unshift(notification); // Add to the beginning
    this.saveToStorage();
  }

  // Get all notifications
  public getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications count
  public getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  // Mark a notification as read
  public markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
    }
  }

  // Mark all notifications as read
  public markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveToStorage();
  }

  // Delete a notification
  public deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
  }

  // Clear all notifications
  public clearAllNotifications(): void {
    this.notifications = [];
    this.saveToStorage();
  }

  // Save notifications to localStorage
  private saveToStorage(): void {
    try {
      localStorage.setItem('fundi_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // Load notifications from localStorage
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('fundi_notifications');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert string timestamps back to Date objects
        this.notifications = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      this.notifications = [];
    }
  }
}

export const notificationService = new NotificationService();

// Initialize the notification service when this module is imported
setTimeout(() => {
  notificationService.startMonitoring();
}, 2000); // Wait 2 seconds after app startup