import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Search,
  Users,
  MessageSquare,
  Calendar,
  Star,
  User,
  Sliders,
  LogOut,
  PlusCircle,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { StudentProfile } from '../types';

interface SidebarProps {
  currentStudent: StudentProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onOpenScheduleModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentStudent,
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
  onOpenScheduleModal,
}) => {
  // Compute badge counts
  const incomingRequests = StorageService.getRequests().filter(
    (r) => r.receiverId === currentStudent.id && r.status === 'pending'
  ).length;

  const upcomingSessions = StorageService.getSessions().filter(
    (s) =>
      (s.requesterId === currentStudent.id || s.partnerId === currentStudent.id) &&
      (s.status === 'confirmed' || s.status === 'proposed')
  ).length;

  const unreadMessages = StorageService.getMessages().filter(
    (m) => m.receiverId === currentStudent.id && !m.read
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'matches',
      label: 'Recommended Matches',
      icon: Sparkles,
      badge: 'Smart',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'discover',
      label: 'Discover Peers',
      icon: Search,
    },
    {
      id: 'requests',
      label: 'Connections & Requests',
      icon: Users,
      badge: incomingRequests > 0 ? String(incomingRequests) : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'messages',
      label: 'Messages & Chat',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? String(unreadMessages) : undefined,
      badgeColor: 'bg-indigo-600 text-white',
    },
    {
      id: 'sessions',
      label: 'Learning Sessions',
      icon: Calendar,
      badge: upcomingSessions > 0 ? String(upcomingSessions) : undefined,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'reviews',
      label: 'Reviews & Feedback',
      icon: Star,
    },
    {
      id: 'profile',
      label: 'My Profile & Skills',
      icon: User,
    },
    {
      id: 'settings',
      label: 'Architecture & Settings',
      icon: Sliders,
    },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation list */}
        <div className="p-3.5 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Card & Profile Snippet */}
        <div className="p-3.5 border-t border-slate-100 space-y-3">
          {/* Quick Match Tip card */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/60 p-3 rounded-xl border border-indigo-100/80">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Skill Exchange Tip</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Add at least 3 teaching and 3 learning skills to unlock 90%+ complementary match scores.
            </p>
            <button
              onClick={() => handleNavClick('profile')}
              className="mt-2 text-[11px] text-indigo-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Manage My Skills</span>
              <span>→</span>
            </button>
          </div>

          {/* Current user mini-card */}
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.fullName}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">{currentStudent.fullName}</div>
              <div className="text-[10px] text-slate-500 truncate">{currentStudent.department}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
