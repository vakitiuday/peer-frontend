import React, { useState } from 'react';
import { StudentProfile, MeetingPlatform, LearningSession } from '../types';
import { StorageService } from '../services/storageService';
import { Calendar, Clock, Video, Link, BookOpen, X, Check } from 'lucide-react';

interface ScheduleSessionModalProps {
  currentStudent: StudentProfile;
  partner: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: LearningSession) => void;
  initialTopicSkill?: string;
  initialDirection?: 'requester_teaching' | 'requester_learning';
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  currentStudent,
  partner,
  isOpen,
  onClose,
  onSuccess,
  initialTopicSkill,
  initialDirection = 'requester_learning',
}) => {
  const [topicSkill, setTopicSkill] = useState(
    initialTopicSkill || partner.teachingSkills[0]?.name || currentStudent.teachingSkills[0]?.name || 'Python'
  );
  const [direction, setDirection] = useState<'requester_teaching' | 'requester_learning'>(
    initialDirection
  );
  
  // Default to tomorrow at 18:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [scheduledDate, setScheduledDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState('17:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [meetingPlatform, setMeetingPlatform] = useState<MeetingPlatform>('Google Meet');
  const [meetingLink, setMeetingLink] = useState(
    `https://meet.google.com/${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`
  );
  const [agenda, setAgenda] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const connId = StorageService.getConnectionId(currentStudent.id, partner.id) || `conn-${Date.now()}`;
      
      const newSession = StorageService.proposeSession({
        connectionId: connId,
        requesterId: currentStudent.id,
        partnerId: partner.id,
        topicSkill,
        direction,
        scheduledDate,
        startTime,
        durationMinutes: Number(durationMinutes),
        meetingPlatform,
        meetingLink: meetingLink.trim(),
        agenda: agenda.trim() || `Collaborative peer learning session on ${topicSkill}`,
      });

      onSuccess(newSession);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to schedule session');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Propose Learning Session</h3>
              <p className="text-xs text-slate-500">Coordinate topic, time, and meeting details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Partner preview */}
        <div className="flex items-center gap-3 p-3 my-4 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={partner.avatarUrl}
            alt={partner.fullName}
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">{partner.fullName}</h4>
            <p className="text-[11px] text-slate-500 truncate">{partner.department} • {partner.college}</p>
          </div>
          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-1 rounded-md border border-emerald-200">
            Connected Partner
          </span>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Exchange direction */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Session Focus & Role
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setDirection('requester_learning')}
                className={`p-2.5 rounded-xl border font-medium text-left transition-all ${
                  direction === 'requester_learning'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="font-semibold text-xs">They Teach You</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Learn from {partner.fullName.split(' ')[0]}</div>
              </button>

              <button
                type="button"
                onClick={() => setDirection('requester_teaching')}
                className={`p-2.5 rounded-xl border font-medium text-left transition-all ${
                  direction === 'requester_teaching'
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="font-semibold text-xs">You Teach Them</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Mentor {partner.fullName.split(' ')[0]}</div>
              </button>
            </div>
          </div>

          {/* Topic Skill */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Topic or Skill
            </label>
            <div className="relative">
              <input
                type="text"
                value={topicSkill}
                onChange={(e) => setTopicSkill(e.target.value)}
                placeholder="e.g. Python Scripting, Figma Auto-Layout, SQL Joins"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            {/* Quick suggested chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(direction === 'requester_learning' ? partner.teachingSkills : currentStudent.teachingSkills).map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setTopicSkill(s.name)}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition-colors ${
                    topicSkill === s.name
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date, Time, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={30}>30 mins</option>
                <option value={45}>45 mins</option>
                <option value={60}>60 mins (1 hr)</option>
                <option value={90}>90 mins</option>
              </select>
            </div>
          </div>

          {/* Platform & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meeting Platform
              </label>
              <select
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value as MeetingPlatform)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Google Meet">Google Meet</option>
                <option value="Zoom">Zoom</option>
                <option value="Microsoft Teams">Microsoft Teams</option>
                <option value="Campus In-Person">Campus In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meeting Link or Location
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Agenda & Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Session Agenda & Preparation
            </label>
            <textarea
              rows={2}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="What specific problems or topics will be tackled in this session?"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Proposing...' : 'Send Session Proposal'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
