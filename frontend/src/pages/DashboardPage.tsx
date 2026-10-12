import React, { useState } from 'react';
import { StudentProfile, MatchResult, LearningSession } from '../types';
import { StorageService } from '../services/storageService';
import { calculateMatchScore } from '../utils/matchingEngine';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import {
  Sparkles,
  Users,
  Calendar,
  Award,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Clock,
  Video,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  UserPlus,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

interface DashboardPageProps {
  currentStudent: StudentProfile;
  setActiveTab: (tab: string) => void;
  onOpenScheduleModal: (partner?: StudentProfile) => void;
  onOpenConnectModal: (peer: StudentProfile) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
  onOpenReviewModal: (session: LearningSession, partner: StudentProfile) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentStudent,
  setActiveTab,
  onOpenScheduleModal,
  onOpenConnectModal,
  onOpenProfileModal,
  onOpenReviewModal,
}) => {
  const allStudents = StorageService.getStudents();
  const connections = StorageService.getUserConnections(currentStudent.id);
  const requests = StorageService.getRequests();
  const sessions = StorageService.getSessions().filter(
    (s) => s.requesterId === currentStudent.id || s.partnerId === currentStudent.id
  );

  const pendingIncoming = requests.filter(
    (r) => r.receiverId === currentStudent.id && r.status === 'pending'
  );

  const upcomingSessions = sessions.filter(
    (s) => s.status === 'confirmed' || s.status === 'proposed'
  );

  const completedSessions = sessions.filter((s) => s.status === 'completed');

  // Compute profile completion percentage
  let profileScore = 20; // Base account
  if (currentStudent.bio && currentStudent.bio.length > 20) profileScore += 20;
  if (currentStudent.teachingSkills.length >= 2) profileScore += 25;
  if (currentStudent.learningSkills.length >= 2) profileScore += 20;
  if (currentStudent.availability.length > 0) profileScore += 15;

  // Compute matches
  const matchCandidates: MatchResult[] = allStudents
    .filter((s) => s.id !== currentStudent.id)
    .map((candidate) => {
      const breakdown = calculateMatchScore(currentStudent, candidate);
      const isConn = StorageService.isConnected(currentStudent.id, candidate.id);
      const sentReq = requests.find(
        (r) => r.senderId === currentStudent.id && r.receiverId === candidate.id && r.status === 'pending'
      );
      const recvReq = requests.find(
        (r) => r.senderId === candidate.id && r.receiverId === currentStudent.id && r.status === 'pending'
      );

      let status: MatchResult['connectionStatus'] = 'none';
      if (isConn) status = 'connected';
      else if (sentReq) status = 'pending_sent';
      else if (recvReq) status = 'pending_received';

      return {
        student: candidate,
        match: breakdown,
        connectionStatus: status,
      };
    })
    .sort((a, b) => b.match.totalScore - a.match.totalScore);

  const topMatch = matchCandidates[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-blue-700 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Peer Exchange Engine Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentStudent.fullName}!
            </h1>
            <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed">
              You are offering to teach <strong>{currentStudent.teachingSkills.map((s) => s.name).join(', ')}</strong> and seeking to learn <strong>{currentStudent.learningSkills.map((s) => s.name).join(', ')}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('matches')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>View Matches ({matchCandidates.length})</span>
            </button>
            <button
              onClick={() => onOpenScheduleModal()}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-white font-semibold text-xs sm:text-sm border border-indigo-400/40 backdrop-blur-xs transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Propose Session</span>
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connections */}
        <div
          onClick={() => setActiveTab('requests')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Connections</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {connections.length}
            </span>
            <span className="text-xs text-slate-400">peers</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>{pendingIncoming.length} incoming pending</span>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div
          onClick={() => setActiveTab('sessions')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Upcoming Sessions</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {upcomingSessions.length}
            </span>
            <span className="text-xs text-slate-400">scheduled</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium">
            Next: {upcomingSessions[0]?.scheduledDate || 'None pending'}
          </div>
        </div>

        {/* Completed Exchanges */}
        <div
          onClick={() => setActiveTab('sessions')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Sessions</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {completedSessions.length}
            </span>
            <span className="text-xs text-slate-400">exchanges</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {currentStudent.completedSessionsCount} all-time recorded
          </div>
        </div>

        {/* Peer Rating */}
        <div
          onClick={() => setActiveTab('reviews')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Average Rating</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentStudent.averageRating.toFixed(1)}
            </span>
            <span className="text-xs text-amber-500 font-bold">★ / 5.0</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Based on {currentStudent.totalReviews} peer review{currentStudent.totalReviews === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Main Grid: Spotlight Match & Profile Strength */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Recommended Match Spotlight */}
        <div className="lg:col-span-2 space-y-6">
          {topMatch && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm sm:text-base font-bold text-slate-900">
                      Top Recommended Skill Match
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Highest reciprocal compatibility found by the matching algorithm
                    </p>
                  </div>
                </div>

                <MatchScoreBadge
                  score={topMatch.match.totalScore}
                  breakdown={topMatch.match}
                  size="md"
                />
              </div>

              {/* Peer profile snippet */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={topMatch.student.avatarUrl}
                    alt={topMatch.student.fullName}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {topMatch.student.fullName}
                      </h3>
                      <span className="text-[10px] bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {topMatch.student.year}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {topMatch.student.department} • {topMatch.student.college}
                    </p>
                    <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                      ⭐ {topMatch.student.averageRating.toFixed(1)} rating ({topMatch.student.completedSessionsCount} sessions completed)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenProfileModal(topMatch.student)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    View Profile
                  </button>
                  {topMatch.connectionStatus === 'connected' ? (
                    <button
                      onClick={() => onOpenScheduleModal(topMatch.student)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors"
                    >
                      Schedule
                    </button>
                  ) : topMatch.connectionStatus === 'pending_sent' ? (
                    <span className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                      Request Pending
                    </span>
                  ) : (
                    <button
                      onClick={() => onOpenConnectModal(topMatch.student)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Two-way exchange breakdown */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    You can teach them:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {topMatch.match.youCanTeachThem.length > 0 ? (
                      topMatch.match.youCanTeachThem.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Exploring new skills</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                    They can teach you:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {topMatch.match.theyCanTeachYou.length > 0 ? (
                      topMatch.match.theyCanTeachYou.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white text-indigo-800 font-semibold px-2 py-0.5 rounded border border-indigo-200"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">Exploring new skills</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Why is this a match text */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{topMatch.match.explanation}</span>
              </div>
            </div>
          )}

          {/* Upcoming Learning Sessions Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Upcoming & Pending Sessions
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('sessions')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View all ({sessions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingSessions.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">No sessions scheduled right now.</p>
                <button
                  onClick={() => onOpenScheduleModal()}
                  className="mt-3 text-xs text-indigo-600 font-bold hover:underline"
                >
                  Propose your first session →
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                {upcomingSessions.slice(0, 3).map((sess) => {
                  const partnerId =
                    sess.requesterId === currentStudent.id ? sess.partnerId : sess.requesterId;
                  const partner = StorageService.getStudentById(partnerId);
                  const isMentor =
                    (sess.requesterId === currentStudent.id && sess.direction === 'requester_teaching') ||
                    (sess.partnerId === currentStudent.id && sess.direction === 'requester_learning');

                  return (
                    <div
                      key={sess.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={partner?.avatarUrl}
                          alt={partner?.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{sess.topicSkill}</span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isMentor
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {isMentor ? 'You are Teaching' : 'You are Learning'}
                            </span>
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                sess.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {sess.status === 'confirmed' ? 'Confirmed' : 'Pending Proposal'}
                            </span>
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            Partner: <strong>{partner?.fullName}</strong> • {sess.scheduledDate} at {sess.startTime} ({sess.durationMinutes}m)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {sess.meetingLink && (
                          <a
                            href={sess.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join</span>
                          </a>
                        )}
                        <button
                          onClick={() => setActiveTab('sessions')}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium text-xs"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Profile Strength & Quick Actions */}
        <div className="space-y-6">
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm">Profile Strength</h3>
              <span className="text-xs font-extrabold text-indigo-600">{profileScore}%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileScore}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Complete your profile to help our complementary matching algorithm rank you higher among students!
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Teaching Skills ({currentStudent.teachingSkills.length})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Learning Wishlist ({currentStudent.learningSkills.length})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className={`w-4 h-4 ${currentStudent.availability.length > 0 ? 'text-emerald-500' : 'text-slate-300'} shrink-0`} />
                <span>Availability Preferences</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className="w-full mt-4 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-indigo-700 font-semibold text-xs rounded-xl transition-colors text-center"
            >
              Edit Profile & Add Skills →
            </button>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Quick Actions</h3>

            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('matches')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-900">
                      Smart Matches
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Find students who can teach you
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </button>

              <button
                onClick={() => setActiveTab('discover')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                      Explore Skills
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Search Python, React, UI/UX...
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </button>

              <button
                onClick={() => onOpenScheduleModal()}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                      Schedule Session
                    </div>
                    <div className="text-[11px] text-slate-500">
                      With an accepted connection
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/40 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 group-hover:text-violet-900">
                      Direct Messaging
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Chat with study partners
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
