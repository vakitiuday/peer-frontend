import React, { useState } from 'react';
import { StudentProfile, Review } from '../types';
import { StorageService } from '../services/storageService';
import { Star, Award, MessageSquare, ThumbsUp, Calendar, User } from 'lucide-react';

interface ReviewsPageProps {
  currentStudent: StudentProfile;
  onOpenProfileModal: (student: StudentProfile) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  currentStudent,
  onOpenProfileModal,
}) => {
  const [tab, setTab] = useState<'received' | 'given'>('received');
  const allReviews = StorageService.getReviews();

  const reviewsReceived = allReviews.filter((r) => r.revieweeId === currentStudent.id);
  const reviewsGiven = allReviews.filter((r) => r.reviewerId === currentStudent.id);

  // Compute rating breakdown
  const ratingCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsReceived.forEach((r) => {
    ratingCounts[r.rating] = (ratingCounts[r.rating] || 0) + 1;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Peer Evaluations & Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Reviews from completed peer exchanges to build trust and accountability.
        </p>

        {/* Rating Overview Card */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-gradient-to-r from-amber-50/50 via-slate-50 to-indigo-50/30 border border-amber-100">
          {/* Average */}
          <div className="text-center md:border-r border-amber-200/60 pr-4 flex flex-col justify-center">
            <div className="text-4xl sm:text-5xl font-black text-slate-900">
              {currentStudent.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(currentStudent.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Based on {currentStudent.totalReviews} peer evaluation{currentStudent.totalReviews === 1 ? '' : 's'}
            </p>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-1.5 flex flex-col justify-center md:col-span-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingCounts[star] || 0;
              const pct = reviewsReceived.length > 0 ? (count / reviewsReceived.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-600 font-semibold">{star} Stars</span>
                  <div className="flex-1 bg-white rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-medium text-slate-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-100 pt-6">
          <button
            onClick={() => setTab('received')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              tab === 'received'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Reviews Received ({reviewsReceived.length})
          </button>
          <button
            onClick={() => setTab('given')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              tab === 'given'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Reviews You Wrote ({reviewsGiven.length})
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {(tab === 'received' ? reviewsReceived : reviewsGiven).length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">
              {tab === 'received' ? 'No reviews received yet' : 'You have not written any reviews yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Complete a learning session with a student to exchange constructive evaluations.
            </p>
          </div>
        ) : (
          (tab === 'received' ? reviewsReceived : reviewsGiven).map((review) => {
            const otherPersonId = tab === 'received' ? review.reviewerId : review.revieweeId;
            const otherPerson = StorageService.getStudentById(otherPersonId);

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={otherPerson?.avatarUrl}
                      alt={otherPerson?.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 cursor-pointer"
                      onClick={() => otherPerson && onOpenProfileModal(otherPerson)}
                    />
                    <div>
                      <h4
                        className="text-sm font-bold text-slate-900 cursor-pointer hover:underline"
                        onClick={() => otherPerson && onOpenProfileModal(otherPerson)}
                      >
                        {otherPerson?.fullName || 'Student Peer'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {otherPerson?.department} • Topic: <strong>{review.topicSkill}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  "{review.feedback}"
                </p>

                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {review.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-50">
                  Submitted on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
