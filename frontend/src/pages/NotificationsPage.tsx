import React, { useState } from 'react';
import { StudentProfile, NotificationItem } from '../types';
import { StorageService } from '../services/storageService';
import {
  Bell,
  CheckCircle2,
  Calendar,
  UserPlus,
  MessageSquare,
  Star,
  Check,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface NotificationsPageProps {
  currentStudent: StudentProfile;
  setActiveTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  currentStudent,
  setActiveTab,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const notifications = StorageService.getUserNotifications(currentStudent.id);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifs = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentStudent.id);
  };

  const handleItemClick = (notif: NotificationItem) => {
    StorageService.markNotificationRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'connection_request':
        return <UserPlus className="w-4 h-4 text-indigo-600" />;
      case 'connection_accepted':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'session_proposed':
      case 'session_confirmed':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-violet-600" />;
      case 'new_review':
        return <Star className="w-4 h-4 text-amber-500 fill-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Notifications & Activity Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time events for connection requests, study sessions, and feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === 'unread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When peers interact with your profile or proposed sessions, you will be notified here.
            </p>
          </div>
        ) : (
          filteredNotifs.map((n) => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                n.read
                  ? 'bg-white border-slate-200/80 hover:border-slate-300'
                  : 'bg-indigo-50/40 border-indigo-200/80 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                {getIcon(n.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-xs sm:text-sm ${n.read ? 'font-semibold text-slate-800' : 'font-bold text-slate-900'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>

                {n.linkTab && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 mt-2 hover:underline">
                    <span>Go to {n.linkTab}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
