import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { notificationService, Notification } from '@/services/notification-service';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [, navigate] = useLocation();

  // Load notifications from the service
  useEffect(() => {
    // Initial load
    loadNotifications();

    // Set up interval to check for new notifications
    const intervalId = setInterval(() => {
      loadNotifications();
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(notificationService.getUnreadCount());
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    
    // Mark all as read when opening
    if (!isOpen) {
      notificationService.markAllAsRead();
      loadNotifications();
    }
  };

  const handleClearAll = () => {
    notificationService.clearAllNotifications();
    loadNotifications();
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    loadNotifications();
  };

  const handleActionClick = (notification: Notification) => {
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      notificationService.markAsRead(notification.id);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Button
        size="icon"
        variant="ghost"
        onClick={handleToggle}
        className="relative"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5 text-muted-foreground" />}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border rounded-md shadow-lg z-50 max-h-[80vh] overflow-auto animate-in slide-in-from-top-5 fade-in-50"
          style={{ top: '100%' }}
        >
          <div className="p-3 border-b flex justify-between items-center sticky top-0 bg-card">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Clear all
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <BellOff className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`border-0 rounded-none ${notification.read ? 'bg-card' : 'bg-accent/10'}`}
                >
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Badge variant="outline" className="h-5 px-1 text-xs bg-primary/10">New</Badge>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6" 
                          onClick={() => handleDelete(notification.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm mt-1">{notification.message}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                      </span>
                      {notification.actionUrl && (
                        <Button 
                          size="sm" 
                          onClick={() => handleActionClick(notification)}
                        >
                          {notification.actionLabel || 'View'}
                          <Check className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;