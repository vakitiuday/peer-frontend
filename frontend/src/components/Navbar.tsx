import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, NotificationItem } from '../types';
import { StorageService } from '../services/storageService';
import { PersonaSwitcher } from './PersonaSwitcher';
import {
  Bell,
  Menu,
  X,
  Database,
  CheckCircle,
  ExternalLink,
  User,
  LogOut,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';

interface NavbarProps {
  currentStudent: StudentProfile;
  onSwitchPersona: (student: StudentProfile) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenFirebaseModal: () => void;
  isFirebaseActive: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStudent,
  onSwitchPersona,
  activeTab,
  setActiveTab,
  onOpenFirebaseModal,
  isFirebaseActive,
  mobileMenuOpen,
  setMobileMenuOpen,
  onLogout,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const notifications = StorageService.getUserNotifications(currentStudent.id);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (item: NotificationItem) => {
    StorageService.markNotificationRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
    }
    setNotificationsOpen(false);
  };

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentStudent.id);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                  Peer Skill Exchange
                  <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                    Platform
                  </span>
                </span>
                <span className="text-[10px] text-slate-500 hidden sm:block">
                  Collaborative Student Learning & Matching
                </span>
              </div>
            </button>
          </div>

          {/* Right: Mode Badge, Switcher, Notifs, Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Backend mode pill */}
            <button
              onClick={onOpenFirebaseModal}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isFirebaseActive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Click to view Architecture, Firestore rules & Firebase connection settings"
            >
              <Database className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isFirebaseActive ? 'Live Firebase Mode' : 'Demo Mode (Local State)'}</span>
              <span className="text-[10px] text-slate-400 bg-white border border-slate-200 px-1 py-0.2 rounded font-normal">
                Inspect
              </span>
            </button>

            {/* Persona Switcher */}
            <PersonaSwitcher
              currentStudent={currentStudent}
              onSwitch={onSwitchPersona}
            />

            {/* Notification Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                        Notifications
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] text-indigo-600 font-semibold hover:text-indigo-800"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-3 ${
                            n.read ? 'hover:bg-slate-50 text-slate-600' : 'bg-indigo-50/50 hover:bg-indigo-50/80 text-slate-900 font-medium'
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-indigo-600 opacity-80" />
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-xs text-slate-900">{n.title}</div>
                            <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setNotificationsOpen(false);
                      }}
                      className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 inline-flex items-center gap-1"
                    >
                      <span>View all notifications</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-xs font-semibold text-slate-800 hidden md:inline pr-1">
                  {currentStudent.fullName.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{currentStudent.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentStudent.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-slate-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('sessions');
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>My Sessions</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenFirebaseModal();
                      setUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <Database className="w-4 h-4 text-slate-500" />
                    <span>Architecture & Firebase</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch to Guest</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
