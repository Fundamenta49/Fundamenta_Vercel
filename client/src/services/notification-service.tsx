import { toast } from '@/hooks/use-toast';
import * as React from 'react';

// Notification types (calendar types removed)
export enum NotificationType {
  FUNDI_COMMENT = 'fundi-comment',
  ACHIEVEMENT_UNLOCKED = 'achievement-unlocked'
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
  userId?: string;
  metadata?: Record<string, any>;
}

class NotificationService {
  private notifications: Notification[] = [];

  constructor() {
    this.loadFromStorage();
  }

  // Start monitoring for notifications
  public startMonitoring(): void {
    console.log('Notification monitoring started (calendar functionality removed)');
  }

  // Stop monitoring
  public stopMonitoring(): void {
    console.log('Notification monitoring stopped');
  }

  // Add a notification to the list
  public addNotification(notification: Notification): void {
    this.notifications.unshift(notification); // Add to the beginning
    this.saveToStorage();
    
    // Show toast for the notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 10000, // 10 seconds
      action: notification.actionLabel && notification.actionUrl ? (
        <button 
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
          onClick={() => {
            window.location.href = notification.actionUrl!;
            this.markAsRead(notification.id);
          }}
        >
          {notification.actionLabel}
        </button>
      ) : undefined,
    });
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