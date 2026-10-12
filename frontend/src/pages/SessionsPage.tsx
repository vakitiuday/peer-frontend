import React, { useState } from 'react';
import { StudentProfile, LearningSession } from '../types';
import { StorageService } from '../services/storageService';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  XCircle,
  Plus,
  Star,
  ExternalLink,
  UserCheck,
  AlertCircle,
  MapPin,
} from 'lucide-react';

interface SessionsPageProps {
  currentStudent: StudentProfile;
  onOpenScheduleModal: () => void;
  onOpenReviewModal: (session: LearningSession, partner: StudentProfile) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
}

export const SessionsPage: React.FC<SessionsPageProps> = ({
  currentStudent,
  onOpenScheduleModal,
  onOpenReviewModal,
  onOpenProfileModal,
}) => {
  const [filterTab, setFilterTab] = useState<'upcoming' | 'proposed' | 'completed' | 'all'>('upcoming');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const allSessions = StorageService.getSessions().filter(
    (s) => s.requesterId === currentStudent.id || s.partnerId === currentStudent.id
  );

  const upcomingSessions = allSessions.filter((s) => s.status === 'confirmed');
  const proposedSessions = allSessions.filter((s) => s.status === 'proposed');
  const completedSessions = allSessions.filter((s) => s.status === 'completed');

  const filteredList =
    filterTab === 'upcoming'
      ? upcomingSessions
      : filterTab === 'proposed'
      ? proposedSessions
      : filterTab === 'completed'
      ? completedSessions
      : allSessions;

  const handleUpdateStatus = (sessionId: string, newStatus: LearningSession['status']) => {
    try {
      StorageService.updateSessionStatus(sessionId, newStatus);
      if (newStatus === 'confirmed') {
        setActionAlert('Session confirmed! Meeting details have been locked in.');
      } else if (newStatus === 'completed') {
        setActionAlert('Session marked as completed! Feedback invitation sent.');
      } else if (newStatus === 'cancelled') {
        setActionAlert('Session has been cancelled.');
      } else if (newStatus === 'declined') {
        setActionAlert('Session proposal declined.');
      }
      setTimeout(() => setActionAlert(null), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Peer Learning Sessions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Schedule, track, and review collaborative knowledge exchange sessions.
            </p>
          </div>

          <button
            onClick={onOpenScheduleModal}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Session</span>
          </button>
        </div>

        {actionAlert && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            {actionAlert}
          </div>
        )}

        {/* Filter subtabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pt-2 overflow-x-auto">
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterTab === 'upcoming'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Confirmed Upcoming ({upcomingSessions.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('proposed')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterTab === 'proposed'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending Proposals ({proposedSessions.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('completed')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              filterTab === 'completed'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed ({completedSessions.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              filterTab === 'all'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            All Sessions ({allSessions.length})
          </button>
        </div>
      </div>

      {/* Sessions Cards */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No sessions found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {filterTab === 'upcoming'
              ? 'No confirmed upcoming sessions right now.'
              : filterTab === 'proposed'
              ? 'No pending proposals awaiting confirmation.'
              : 'You have not completed any sessions in this view.'}
          </p>
          <button
            onClick={onOpenScheduleModal}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 shadow-xs"
          >
            Schedule a Session Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((session) => {
            const isRequester = session.requesterId === currentStudent.id;
            const partnerId = isRequester ? session.partnerId : session.requesterId;
            const partner = StorageService.getStudentById(partnerId);

            const isTeaching =
              (isRequester && session.direction === 'requester_teaching') ||
              (!isRequester && session.direction === 'requester_learning');

            // Check if reviewed by current student
            const hasReviewed = isRequester
              ? session.reviewedByRequester
              : session.reviewedByPartner;

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-indigo-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={partner?.avatarUrl}
                    alt={partner?.fullName}
                    className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shrink-0 cursor-pointer"
                    onClick={() => partner && onOpenProfileModal(partner)}
                  />

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {session.topicSkill}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isTeaching
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-indigo-100 text-indigo-800'
                        }`}
                      >
                        {isTeaching ? 'You are Teaching' : 'You are Learning'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          session.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : session.status === 'proposed'
                            ? 'bg-amber-100 text-amber-800'
                            : session.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {session.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Partner:{' '}
                      <strong
                        onClick={() => partner && onOpenProfileModal(partner)}
                        className="text-slate-800 hover:underline cursor-pointer"
                      >
                        {partner?.fullName}
                      </strong>{' '}
                      • {partner?.department} ({partner?.college})
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {session.scheduledDate} at {session.startTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {session.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {session.meetingPlatform}
                      </span>
                    </div>

                    {session.agenda && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                        <strong>Agenda:</strong> {session.agenda}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex flex-wrap lg:flex-col items-end gap-2 lg:min-w-[180px] shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* Join Link button if confirmed */}
                  {session.status === 'confirmed' && session.meetingLink && (
                    <a
                      href={session.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Meeting</span>
                    </a>
                  )}

                  {/* If proposed: recipient can accept or decline */}
                  {session.status === 'proposed' && !isRequester && (
                    <div className="w-full flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'confirmed')}
                        className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                      >
                        Accept Proposal
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'declined')}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {/* If proposed & is requester: pending status */}
                  {session.status === 'proposed' && isRequester && (
                    <div className="w-full flex items-center justify-between gap-2">
                      <span className="text-xs text-amber-700 font-medium">Awaiting partner response</span>
                      <button
                        onClick={() => handleUpdateStatus(session.id, 'cancelled')}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Mark as Completed */}
                  {session.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(session.id, 'completed')}
                      className="w-full px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}

                  {/* Review Button if completed */}
                  {session.status === 'completed' && partner && (
                    <>
                      {hasReviewed ? (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Review Submitted</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenReviewModal(session, partner)}
                          className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Rate & Review Peer</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
