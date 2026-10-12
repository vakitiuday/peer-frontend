import React from 'react';
import { MatchScoreBreakdown } from '../types';
import { Sparkles, Calendar, BookOpen, Globe, CheckCircle2 } from 'lucide-react';

interface MatchScoreBadgeProps {
  score: number;
  breakdown?: MatchScoreBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score,
  breakdown,
  size = 'md',
  showDetails = false,
}) => {
  // Score color tiers
  const getBadgeColor = (val: number) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200 ring-emerald-500/20';
    if (val >= 70) return 'text-blue-700 bg-blue-50 border-blue-200 ring-blue-500/20';
    if (val >= 50) return 'text-amber-700 bg-amber-50 border-amber-200 ring-amber-500/20';
    return 'text-slate-600 bg-slate-50 border-slate-200 ring-slate-500/20';
  };

  const getBarColor = (val: number) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-blue-600';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  if (size === 'sm') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-md border px-2 py-0.5 text-xs ${getBadgeColor(
          score
        )}`}
      >
        <Sparkles className="w-3 h-3" />
        {score}% Match
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-lg border px-2.5 py-1 text-sm shadow-xs ${getBadgeColor(
            score
          )}`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{score}% Compatibility</span>
          {breakdown?.isReciprocal && (
            <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded ml-1">
              Reciprocal
            </span>
          )}
        </span>

        {breakdown && (
          <span className="text-xs text-slate-500 font-medium">
            Weighted Score
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getBarColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {showDetails && breakdown && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1 text-slate-600" title="Reciprocal Skills (Max 70%)">
            <BookOpen className="w-3 h-3 text-indigo-600" />
            <span>Skills: <strong>{breakdown.reciprocalSkillScore}/70</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-600" title="Availability Match (Max 15%)">
            <Calendar className="w-3 h-3 text-blue-600" />
            <span>Hours: <strong>{breakdown.availabilityScore}/15</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-600" title="Shared Interests (Max 10%)">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Interests: <strong>{breakdown.interestsScore}/10</strong></span>
          </div>
          <div className="flex items-center gap-1 text-slate-600" title="Language Match (Max 5%)">
            <Globe className="w-3 h-3 text-violet-600" />
            <span>Lang: <strong>{breakdown.languageScore}/5</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
