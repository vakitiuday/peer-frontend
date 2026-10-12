import React from 'react';
import { StudentProfile } from '../types';
import { StorageService } from '../services/storageService';
import {
  X,
  Star,
  BookOpen,
  GraduationCap,
  Calendar,
  Globe,
  Award,
  MessageSquare,
  UserPlus,
  CheckCircle2,
} from 'lucide-react';

interface ProfileModalProps {
  student: StudentProfile | null;
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onConnectClick?: (student: StudentProfile) => void;
  onChatClick?: (student: StudentProfile) => void;
  onScheduleClick?: (student: StudentProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  student,
  currentUserId,
  isOpen,
  onClose,
  onConnectClick,
  onChatClick,
  onScheduleClick,
}) => {
  if (!isOpen || !student) return null;

  const isConnected = StorageService.isConnected(currentUserId, student.id);
  const isSelf = currentUserId === student.id;
  const reviews = StorageService.getReviews().filter((r) => r.revieweeId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{student.fullName}</h3>
                {isConnected && (
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {student.department} • {student.year}
              </p>
              <p className="text-xs text-indigo-700 font-medium">{student.college}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 my-4 bg-slate-50 p-3 rounded-xl text-center border border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Peer Rating</div>
            <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{student.averageRating.toFixed(1)}</span>
              <span className="text-xs font-normal text-slate-400">({student.totalReviews})</span>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Sessions Completed</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {student.completedSessionsCount} sessions
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Languages</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 truncate px-1">
              {student.languages.join(', ')}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">About Me</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/60 p-3 rounded-xl border border-slate-100">
            {student.bio}
          </p>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Can Teach */}
          <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Can Teach ({student.teachingSkills.length})</span>
            </h4>
            <div className="space-y-2">
              {student.teachingSkills.map((s) => (
                <div key={s.id} className="bg-white p-2 rounded-lg border border-emerald-100 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{s.name}</span>
                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      {s.level || 'Expert'}
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-[11px] text-slate-500 mt-1">{s.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wants to Learn */}
          <div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Wants to Learn ({student.learningSkills.length})</span>
            </h4>
            <div className="space-y-2">
              {student.learningSkills.map((s) => (
                <div key={s.id} className="bg-white p-2 rounded-lg border border-indigo-100 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{s.name}</span>
                    <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                      {s.priority || 'High'} Priority
                    </span>
                  </div>
                  {s.description && (
                    <p className="text-[11px] text-slate-500 mt-1">{s.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Availability & Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Availability Slots
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.availability.map((a, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-slate-500" /> Interests & Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {student.interests.map((it, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
                >
                  #{it}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Peer Reviews section */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Recent Peer Reviews ({reviews.length})
          </h4>
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-lg">
              No public reviews yet for this student.
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {reviews.map((rev) => {
                const reviewer = StorageService.getStudentById(rev.reviewerId);
                return (
                  <div key={rev.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-800">{reviewer?.fullName || 'Peer'}</span>
                        <span className="text-[10px] text-slate-400">({rev.topicSkill})</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 italic">"{rev.feedback}"</p>
                    {rev.tags && rev.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {rev.tags.map((t, i) => (
                          <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-500">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isSelf && (
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            {isConnected ? (
              <>
                {onChatClick && (
                  <button
                    onClick={() => {
                      onClose();
                      onChatClick(student);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                )}
                {onScheduleClick && (
                  <button
                    onClick={() => {
                      onClose();
                      onScheduleClick(student);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Schedule Session</span>
                  </button>
                )}
              </>
            ) : (
              onConnectClick && (
                <button
                  onClick={() => {
                    onClose();
                    onConnectClick(student);
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Send Connection Request</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
