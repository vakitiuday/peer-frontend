import React, { useState } from 'react';
import { StudentProfile, LearningSession, Review } from '../types';
import { StorageService } from '../services/storageService';
import { Star, X, MessageSquare, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReviewModalProps {
  currentStudent: StudentProfile;
  session: LearningSession;
  partner: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (review: Review) => void;
}

const TAG_OPTIONS = [
  'Patient Mentor',
  'Clear Explanations',
  'Well Prepared',
  'Hands-on Guidance',
  'Fast Learner',
  'Great Communicator',
  'Punctual & Reliable',
  'Practical Examples',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  currentStudent,
  session,
  partner,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Patient Mentor', 'Clear Explanations']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError('Please provide written feedback for your peer.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newReview = StorageService.submitReview(
        session.id,
        currentStudent.id,
        partner.id,
        rating,
        feedback,
        selectedTags,
        session.topicSkill
      );

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if not supported
      }

      onSuccess(newReview);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rate & Review Peer</h3>
              <p className="text-xs text-slate-500">Provide constructive feedback for {partner.fullName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Session context */}
        <div className="my-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-900">Topic: {session.topicSkill}</div>
            <div className="text-[11px] text-slate-500">
              Completed on {session.scheduledDate} • {session.durationMinutes} mins
            </div>
          </div>
          <img
            src={partner.avatarUrl}
            alt={partner.fullName}
            className="w-9 h-9 rounded-full object-cover border border-slate-200"
          />
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star selector */}
          <div className="text-center py-2">
            <div className="text-xs font-semibold text-slate-600 mb-2">Overall Learning Experience</div>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-115"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-slate-700 mt-2">
              {rating === 5 && '🌟 Exceptional Session!'}
              {rating === 4 && '👍 Very Good Experience'}
              {rating === 3 && '👌 Good / Average'}
              {rating === 2 && '👎 Needs Improvement'}
              {rating === 1 && '⚠️ Unsatisfactory'}
            </div>
          </div>

          {/* Quick tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Select Highlights & Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Written Feedback
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What went well? How clearly did they explain the topic or apply the skills?"
              className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
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
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
