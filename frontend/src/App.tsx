/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { isFirebaseConfigured, initializeFirebase } from './services/firebaseService';
import { StudentProfile, LearningSession, Review } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ConnectModal } from './components/ConnectModal';
import { ScheduleSessionModal } from './components/ScheduleSessionModal';
import { ReviewModal } from './components/ReviewModal';
import { ProfileModal } from './components/ProfileModal';
import { FirebaseModal } from './components/FirebaseModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendedMatchesPage } from './pages/RecommendedMatchesPage';
import { DiscoverPeersPage } from './pages/DiscoverPeersPage';
import { ConnectionsPage } from './pages/ConnectionsPage';
import { MessagesPage } from './pages/MessagesPage';
import { SessionsPage } from './pages/SessionsPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthModal } from './pages/AuthModals';

export default function App() {
  // Current student session state
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    return StorageService.getCurrentUser();
  });

  // Routing / View state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default to interactive student dashboard
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState<boolean>(isFirebaseConfigured());

  // Modal states
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' | 'forgot' }>({
    isOpen: false,
    mode: 'login',
  });

  const [connectModal, setConnectModal] = useState<{
    isOpen: boolean;
    peer: StudentProfile | null;
    teachSkill?: string;
    learnSkill?: string;
  }>({
    isOpen: false,
    peer: null,
  });

  const [scheduleModal, setScheduleModal] = useState<{
    isOpen: boolean;
    partner: StudentProfile | null;
    initialTopicSkill?: string;
  }>({
    isOpen: false,
    partner: null,
  });

  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    session: LearningSession | null;
    partner: StudentProfile | null;
  }>({
    isOpen: false,
    session: null,
    partner: null,
  });

  const [profileModal, setProfileModal] = useState<{
    isOpen: boolean;
    student: StudentProfile | null;
  }>({
    isOpen: false,
    student: null,
  });

  const [firebaseModalOpen, setFirebaseModalOpen] = useState<boolean>(false);

  // Active chat partner pointer (when navigating from peers to chat)
  const [chatPartner, setChatPartner] = useState<StudentProfile | null>(null);

  // Initialize Firebase attempt on mount
  useEffect(() => {
    initializeFirebase();
    setIsFirebaseActive(isFirebaseConfigured());
  }, []);

  // Handlers for Persona Switch
  const handleSwitchPersona = (newStudent: StudentProfile) => {
    setCurrentStudent(newStudent);
  };

  // Handlers for modal interactions
  const handleOpenConnect = (peer: StudentProfile, teachSkill?: string, learnSkill?: string) => {
    setConnectModal({
      isOpen: true,
      peer,
      teachSkill,
      learnSkill,
    });
  };

  const handleOpenSchedule = (partner?: StudentProfile, topicSkill?: string) => {
    const connections = StorageService.getUserConnections(currentStudent.id);
    const targetPartner = partner || (connections.length > 0 ? connections[0] : null);

    if (!targetPartner) {
      alert('You need at least one accepted connection to schedule a session. Connect with a peer first!');
      setActiveTab('matches');
      return;
    }

    setScheduleModal({
      isOpen: true,
      partner: targetPartner,
      initialTopicSkill: topicSkill,
    });
  };

  const handleOpenReview = (session: LearningSession, partner: StudentProfile) => {
    setReviewModal({
      isOpen: true,
      session,
      partner,
    });
  };

  const handleOpenProfile = (student: StudentProfile) => {
    setProfileModal({
      isOpen: true,
      student,
    });
  };

  const handleOpenChatWith = (student: StudentProfile) => {
    setChatPartner(student);
    setActiveTab('messages');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = (student: StudentProfile) => {
    setCurrentStudent(student);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  // Data reset trigger
  const handleDataReset = () => {
    setCurrentStudent(StorageService.getCurrentUser());
  };

  // If not authenticated, render public Landing Page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setAuthModal({ isOpen: true, mode: 'register' })}
          onLoginClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
          onQuickDemo={() => {
            const defaultUser = StorageService.getCurrentUser();
            setCurrentStudent(defaultUser);
            setIsAuthenticated(true);
            setActiveTab('dashboard');
          }}
        />

        <AuthModal
          mode={authModal.mode}
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          onLoginSuccess={handleLoginSuccess}
          onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentStudent={currentStudent}
        onSwitchPersona={handleSwitchPersona}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFirebaseModal={() => setFirebaseModalOpen(true)}
        isFirebaseActive={isFirebaseActive}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
      />

      {/* Main Workspace with Sticky/Fixed Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          currentStudent={currentStudent}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onOpenScheduleModal={() => handleOpenSchedule()}
        />

        {/* Dynamic Main Page Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardPage
              currentStudent={currentStudent}
              setActiveTab={setActiveTab}
              onOpenScheduleModal={handleOpenSchedule}
              onOpenConnectModal={handleOpenConnect}
              onOpenProfileModal={handleOpenProfile}
              onOpenReviewModal={handleOpenReview}
            />
          )}

          {activeTab === 'matches' && (
            <RecommendedMatchesPage
              currentStudent={currentStudent}
              setActiveTab={setActiveTab}
              onOpenConnectModal={handleOpenConnect}
              onOpenScheduleModal={handleOpenSchedule}
              onOpenProfileModal={handleOpenProfile}
              onOpenChatWith={handleOpenChatWith}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverPeersPage
              currentStudent={currentStudent}
              setActiveTab={setActiveTab}
              onOpenConnectModal={handleOpenConnect}
              onOpenScheduleModal={handleOpenSchedule}
              onOpenProfileModal={handleOpenProfile}
              onOpenChatWith={handleOpenChatWith}
            />
          )}

          {activeTab === 'requests' && (
            <ConnectionsPage
              currentStudent={currentStudent}
              setActiveTab={setActiveTab}
              onOpenScheduleModal={handleOpenSchedule}
              onOpenChatWith={handleOpenChatWith}
              onOpenProfileModal={handleOpenProfile}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesPage
              currentStudent={currentStudent}
              initialPartner={chatPartner}
              onOpenScheduleModal={handleOpenSchedule}
              onOpenProfileModal={handleOpenProfile}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsPage
              currentStudent={currentStudent}
              onOpenScheduleModal={() => handleOpenSchedule()}
              onOpenReviewModal={handleOpenReview}
              onOpenProfileModal={handleOpenProfile}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsPage
              currentStudent={currentStudent}
              onOpenProfileModal={handleOpenProfile}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              currentStudent={currentStudent}
              onProfileUpdated={(updated) => setCurrentStudent(updated)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsPage
              currentStudent={currentStudent}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage onDataReset={handleDataReset} />
          )}
        </main>
      </div>

      {/* Shared Modals */}
      {connectModal.isOpen && connectModal.peer && (
        <ConnectModal
          currentStudent={currentStudent}
          peer={connectModal.peer}
          suggestedTeachSkill={connectModal.teachSkill}
          suggestedLearnSkill={connectModal.learnSkill}
          isOpen={connectModal.isOpen}
          onClose={() => setConnectModal({ isOpen: false, peer: null })}
          onSuccess={() => {
            // Trigger state refresh
            setCurrentStudent({ ...currentStudent });
          }}
        />
      )}

      {scheduleModal.isOpen && scheduleModal.partner && (
        <ScheduleSessionModal
          currentStudent={currentStudent}
          partner={scheduleModal.partner}
          initialTopicSkill={scheduleModal.initialTopicSkill}
          isOpen={scheduleModal.isOpen}
          onClose={() => setScheduleModal({ isOpen: false, partner: null })}
          onSuccess={() => {
            setActiveTab('sessions');
          }}
        />
      )}

      {reviewModal.isOpen && reviewModal.session && reviewModal.partner && (
        <ReviewModal
          currentStudent={currentStudent}
          session={reviewModal.session}
          partner={reviewModal.partner}
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, session: null, partner: null })}
          onSuccess={() => {
            setCurrentStudent(StorageService.getCurrentUser());
          }}
        />
      )}

      {profileModal.isOpen && profileModal.student && (
        <ProfileModal
          student={profileModal.student}
          currentUserId={currentStudent.id}
          isOpen={profileModal.isOpen}
          onClose={() => setProfileModal({ isOpen: false, student: null })}
          onConnectClick={(s) => handleOpenConnect(s)}
          onChatClick={(s) => handleOpenChatWith(s)}
          onScheduleClick={(s) => handleOpenSchedule(s)}
        />
      )}

      {firebaseModalOpen && (
        <FirebaseModal
          isOpen={firebaseModalOpen}
          onClose={() => setFirebaseModalOpen(false)}
          onRefresh={() => setIsFirebaseActive(isFirebaseConfigured())}
        />
      )}
    </div>
  );
}
