import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { StorageService } from '../services/storageService';
import { UserPlus, X, Send, Sparkles, ArrowRightLeft } from 'lucide-react';

interface ConnectModalProps {
  currentStudent: StudentProfile;
  peer: StudentProfile;
  suggestedTeachSkill?: string;
  suggestedLearnSkill?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  currentStudent,
  peer,
  suggestedTeachSkill,
  suggestedLearnSkill,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [note, setNote] = useState(
    `Hi ${peer.fullName.split(' ')[0]}! I'd love to connect with you on Peer Skill Exchange Platform to collaborate and learn together.`
  );
  const [teachSkill, setTeachSkill] = useState(
    suggestedTeachSkill || currentStudent.teachingSkills[0]?.name || ''
  );
  const [learnSkill, setLearnSkill] = useState(
    suggestedLearnSkill || peer.teachingSkills[0]?.name || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      StorageService.sendConnectionRequest(
        currentStudent.id,
        peer.id,
        note,
        teachSkill && learnSkill ? { teachSkill, learnSkill } : undefined
      );
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to send request');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Send Connection Request</h3>
              <p className="text-xs text-slate-500">Initiate peer learning partnership</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Peer preview */}
        <div className="flex items-center gap-3 p-3 my-4 bg-slate-50 rounded-xl border border-slate-100">
          <img
            src={peer.avatarUrl}
            alt={peer.fullName}
            className="w-12 h-12 rounded-full object-cover border border-slate-200"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-slate-900 text-sm">{peer.fullName}</h4>
            <p className="text-xs text-slate-500 truncate">{peer.department} • {peer.college}</p>
            <div className="text-[11px] text-indigo-600 font-medium mt-0.5">
              ⭐ {peer.averageRating.toFixed(1)} ({peer.completedSessionsCount} sessions completed)
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Skill exchange proposal preview */}
          <div className="bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-2">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              <span>Proposed Complementary Exchange</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">You will teach:</label>
                <select
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {currentStudent.teachingSkills.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.level || 'Teaching'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">You want to learn:</label>
                <select
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {peer.teachingSkills.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.level || 'Peer teaches'})
                    </option>
                  ))}
                  {currentStudent.learningSkills.map((s) => (
                    <option key={`learn-${s.id}`} value={s.name}>
                      {s.name} (Wishlist)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Personalized Introduction Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Introduce yourself and specify when you're available..."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Adding a friendly note increases response rates by 80%.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
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
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
