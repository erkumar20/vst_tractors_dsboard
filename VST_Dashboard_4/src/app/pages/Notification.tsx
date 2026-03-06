import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Bell, AlertCircle, CheckCircle, Info, Trash2, Settings } from "lucide-react";
import { notificationData as initialNotificationData } from "../data/mockData";
import { toast } from "sonner";

export default function Notification() {
  const [notifications, setNotifications] = useState(initialNotificationData);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    highPriorityOnly: false,
    dailySummary: true,
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 border-red-300">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700 border-green-300">Low</Badge>;
      default:
        return null;
    }
  };

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleSaveSettings = () => {
    toast.success("Notification settings saved successfully");
    setShowSettings(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex flex-wrap justify-end gap-3 lg:justify-start">
          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="whitespace-nowrap"
          >
            Mark All as Read
          </Button>
          <Button
            className="gap-2 bg-[#006847] hover:bg-[#005038] whitespace-nowrap text-white"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="w-4 h-4" />
            Notification Settings
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center shadow-md">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getSeverityBorderColor(notification.severity)} shadow-md transition-all hover:shadow-lg ${!notification.read ? 'bg-blue-50/30' : ''
                }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getSeverityIcon(notification.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="flex-1">
                        <p className={`text-lg text-gray-900 leading-snug ${!notification.read ? 'font-bold' : 'font-medium'}`}>
                          {notification.message}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-sm text-gray-500 font-medium">
                          <Bell className="w-3.5 h-3.5" />
                          {notification.timestamp}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {getSeverityBadge(notification.severity)}
                        {!notification.read && (
                          <Badge className="bg-[#f59e0b] text-white border-0 px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3 mt-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-[#006847] hover:text-[#005038] hover:bg-green-50 font-semibold"
                        >
                          Mark Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription>
              Configure how you receive SOB dashboard notifications.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-alerts" className="font-semibold">Email Alerts</Label>
                <p className="text-sm text-gray-600">Receive notifications via email</p>
              </div>
              <Switch
                id="email-alerts"
                checked={notificationSettings.emailAlerts}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, emailAlerts: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications" className="font-semibold">Push Notifications</Label>
                <p className="text-sm text-gray-600">Receive browser push notifications</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="high-priority" className="font-semibold">High Priority Only</Label>
                <p className="text-sm text-gray-600">Only show high priority alerts</p>
              </div>
              <Switch
                id="high-priority"
                checked={notificationSettings.highPriorityOnly}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, highPriorityOnly: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-summary" className="font-semibold">Daily Summary</Label>
                <p className="text-sm text-gray-600">Receive daily summary emails</p>
              </div>
              <Switch
                id="daily-summary"
                checked={notificationSettings.dailySummary}
                onCheckedChange={(checked) =>
                  setNotificationSettings({ ...notificationSettings, dailySummary: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#006847] hover:bg-[#005038]"
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}