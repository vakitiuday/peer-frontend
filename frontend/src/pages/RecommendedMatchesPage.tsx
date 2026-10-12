import React, { useState, useMemo } from 'react';
import { StudentProfile, MatchResult } from '../types';
import { StorageService } from '../services/storageService';
import { calculateMatchScore, POPULAR_SKILLS, AVAILABILITY_OPTIONS } from '../utils/matchingEngine';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import {
  Sparkles,
  Filter,
  Search,
  CheckCircle2,
  Calendar,
  BookOpen,
  ArrowRightLeft,
  UserPlus,
  MessageSquare,
  SlidersHorizontal,
  Info,
  Clock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

interface RecommendedMatchesPageProps {
  currentStudent: StudentProfile;
  setActiveTab: (tab: string) => void;
  onOpenConnectModal: (peer: StudentProfile, teachSkill?: string, learnSkill?: string) => void;
  onOpenScheduleModal: (partner: StudentProfile, topicSkill?: string) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
  onOpenChatWith: (student: StudentProfile) => void;
}

export const RecommendedMatchesPage: React.FC<RecommendedMatchesPageProps> = ({
  currentStudent,
  setActiveTab,
  onOpenConnectModal,
  onOpenScheduleModal,
  onOpenProfileModal,
  onOpenChatWith,
}) => {
  const [minScore, setMinScore] = useState<number>(50);
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [reciprocalOnly, setReciprocalOnly] = useState<boolean>(false);
  const [showFormula, setShowFormula] = useState<boolean>(false);

  const allStudents = StorageService.getStudents();
  const requests = StorageService.getRequests();

  // Compute matches
  const matches: MatchResult[] = useMemo(() => {
    return allStudents
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
  }, [allStudents, currentStudent, requests]);

  // Apply filters
  const filteredMatches = matches.filter((item) => {
    if (item.match.totalScore < minScore) return false;
    if (reciprocalOnly && !item.match.isReciprocal) return false;

    if (selectedSkill !== 'All') {
      const teaches = item.student.teachingSkills.some(
        (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
      );
      const learns = item.student.learningSkills.some(
        (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
      );
      if (!teaches && !learns) return false;
    }

    if (selectedAvailability !== 'All') {
      if (
        !item.student.availability.includes(selectedAvailability) &&
        !item.student.availability.includes('Flexible')
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Intelligent Complementary Matches
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Students whose teaching offers and learning wishlists complement yours.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowFormula(!showFormula)}
            className="self-start md:self-center inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Info className="w-4 h-4 text-indigo-600" />
            <span>{showFormula ? 'Hide Algorithm Formula' : 'View Scoring Model'}</span>
          </button>
        </div>

        {/* Algorithm Math Explainer */}
        {showFormula && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 text-xs text-slate-700 space-y-2 animate-in fade-in duration-200">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <span>Weighted Matching Algorithm Logic:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-indigo-800 font-bold">70% Reciprocal Skills</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Bidirectional overlap between teach & learn</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-blue-800 font-bold">15% Availability Match</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Shared day & time slots or flexible calendar</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-emerald-800 font-bold">10% Shared Interests</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Hackathons, Open Source, AI research tags</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                <div className="text-violet-800 font-bold">5% Spoken Language</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Mutual language of instruction</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              Formula: <code>TotalScore = Min(100, Round(SkillScore_70 + AvailScore_15 + InterestScore_10 + LangScore_5))</code>
            </p>
          </div>
        )}

        {/* Filters bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Min Compatibility Slider */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-slate-700">Min Compatibility</span>
              <span className="font-bold text-indigo-600">{minScore}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Skill Filter */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="block font-semibold text-slate-700 mb-1">Filter by Skill</label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Skills</option>
              {POPULAR_SKILLS.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <label className="block font-semibold text-slate-700 mb-1">Availability</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">Any Time Slot</option>
              {AVAILABILITY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Reciprocal only toggle */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div>
              <span className="block font-semibold text-slate-700">2-Way Reciprocal</span>
              <span className="text-[10px] text-slate-400">Both teach each other</span>
            </div>
            <input
              type="checkbox"
              checked={reciprocalOnly}
              onChange={(e) => setReciprocalOnly(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No matching peers found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Try adjusting your minimum compatibility threshold or clearing skill filters.
            </p>
            <button
              onClick={() => {
                setMinScore(0);
                setSelectedSkill('All');
                setSelectedAvailability('All');
                setReciprocalOnly(false);
              }}
              className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMatches.map(({ student, match, connectionStatus }) => {
            const teachOffer = match.youCanTeachThem[0];
            const learnOffer = match.theyCanTeachYou[0];

            return (
              <div
                key={student.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all"
              >
                {/* Header row: Student info & score badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={student.avatarUrl}
                      alt={student.fullName}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{student.fullName}</h3>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                          {student.year}
                        </span>
                        {connectionStatus === 'connected' && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Connected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        {student.department} • {student.college}
                      </p>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3">
                        <span>⭐ <strong>{student.averageRating.toFixed(1)}</strong> ({student.totalReviews} reviews)</span>
                        <span>•</span>
                        <span>{student.completedSessionsCount} sessions completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <MatchScoreBadge
                      score={match.totalScore}
                      breakdown={match}
                      size="md"
                      showDetails={true}
                    />
                  </div>
                </div>

                {/* Reciprocal Exchange Box */}
                <div className="mt-4 p-4 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Direction 1: You Teach */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                          You Can Teach Them:
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          ({match.youCanTeachThem.length} matched)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.youCanTeachThem.length > 0 ? (
                          match.youCanTeachThem.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg border border-emerald-200"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No direct overlap</span>
                        )}
                      </div>
                    </div>

                    {/* Direction 2: They Teach */}
                    <div className="p-3 bg-white rounded-xl border border-indigo-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                          They Can Teach You:
                        </span>
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          ({match.theyCanTeachYou.length} matched)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {match.theyCanTeachYou.length > 0 ? (
                          match.theyCanTeachYou.map((s, i) => (
                            <span
                              key={i}
                              className="text-xs bg-indigo-50 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg border border-indigo-200"
                            >
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No direct overlap</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Explanation statement */}
                  <div className="mt-3 text-xs text-slate-600 leading-relaxed flex items-start gap-2 pt-2 border-t border-slate-200/60">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{match.explanation}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Free on: <strong>{student.availability.join(', ') || 'Flexible'}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProfileModal(student)}
                      className="px-3 py-1.5 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      View Profile
                    </button>

                    {connectionStatus === 'connected' ? (
                      <>
                        <button
                          onClick={() => onOpenChatWith(student)}
                          className="px-3 py-1.5 font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat</span>
                        </button>
                        <button
                          onClick={() => onOpenScheduleModal(student, learnOffer || teachOffer)}
                          className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Schedule Session</span>
                        </button>
                      </>
                    ) : connectionStatus === 'pending_sent' ? (
                      <span className="px-3.5 py-1.5 text-amber-700 bg-amber-50 border border-amber-200 rounded-lg font-medium">
                        Request Sent (Pending)
                      </span>
                    ) : connectionStatus === 'pending_received' ? (
                      <button
                        onClick={() => setActiveTab('requests')}
                        className="px-3.5 py-1.5 font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                      >
                        Respond to Request
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenConnectModal(student, teachOffer, learnOffer)}
                        className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Send Connection Request</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
