import React, { useState, useMemo } from 'react';
import { StudentProfile, MatchResult } from '../types';
import { StorageService } from '../services/storageService';
import { calculateMatchScore } from '../utils/matchingEngine';
import { MatchScoreBadge } from '../components/MatchScoreBadge';
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  MessageSquare,
  Calendar,
  GraduationCap,
  BookOpen,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DiscoverPeersPageProps {
  currentStudent: StudentProfile;
  setActiveTab: (tab: string) => void;
  onOpenConnectModal: (peer: StudentProfile) => void;
  onOpenScheduleModal: (partner: StudentProfile) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
  onOpenChatWith: (student: StudentProfile) => void;
}

export const DiscoverPeersPage: React.FC<DiscoverPeersPageProps> = ({
  currentStudent,
  setActiveTab,
  onOpenConnectModal,
  onOpenScheduleModal,
  onOpenProfileModal,
  onOpenChatWith,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [collegeFilter, setCollegeFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'compatibility' | 'rating' | 'sessions' | 'name'>('compatibility');

  const allStudents = StorageService.getStudents();
  const requests = StorageService.getRequests();

  // Extract unique departments and colleges
  const departments = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => set.add(s.department));
    return ['All', ...Array.from(set)];
  }, [allStudents]);

  const colleges = useMemo(() => {
    const set = new Set<string>();
    allStudents.forEach((s) => set.add(s.college));
    return ['All', ...Array.from(set)];
  }, [allStudents]);

  // Compute matches and filter
  const peerList = useMemo(() => {
    return allStudents
      .filter((s) => s.id !== currentStudent.id)
      .map((student) => {
        const match = calculateMatchScore(currentStudent, student);
        const isConn = StorageService.isConnected(currentStudent.id, student.id);
        const sentReq = requests.find(
          (r) => r.senderId === currentStudent.id && r.receiverId === student.id && r.status === 'pending'
        );
        const recvReq = requests.find(
          (r) => r.senderId === student.id && r.receiverId === currentStudent.id && r.status === 'pending'
        );

        let status: MatchResult['connectionStatus'] = 'none';
        if (isConn) status = 'connected';
        else if (sentReq) status = 'pending_sent';
        else if (recvReq) status = 'pending_received';

        return {
          student,
          match,
          connectionStatus: status,
        };
      })
      .filter(({ student }) => {
        if (departmentFilter !== 'All' && student.department !== departmentFilter) return false;
        if (collegeFilter !== 'All' && student.college !== collegeFilter) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchName = student.fullName.toLowerCase().includes(query);
          const matchBio = student.bio.toLowerCase().includes(query);
          const matchTeach = student.teachingSkills.some((s) => s.name.toLowerCase().includes(query));
          const matchLearn = student.learningSkills.some((s) => s.name.toLowerCase().includes(query));
          const matchDept = student.department.toLowerCase().includes(query);
          if (!matchName && !matchBio && !matchTeach && !matchLearn && !matchDept) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'compatibility') return b.match.totalScore - a.match.totalScore;
        if (sortBy === 'rating') return b.student.averageRating - a.student.averageRating;
        if (sortBy === 'sessions') return b.student.completedSessionsCount - a.student.completedSessionsCount;
        return a.student.fullName.localeCompare(b.student.fullName);
      });
  }, [allStudents, currentStudent, requests, departmentFilter, collegeFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Discover Student Peers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse students across all colleges and find potential study partners by skill or major.
          </p>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, skill (e.g. Python, Figma, React, SQL), or department..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters and Sorting Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">College</label>
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {colleges.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sort Results By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="compatibility">Highest Compatibility Match</option>
              <option value="rating">Highest Rated Peers (★)</option>
              <option value="sessions">Most Completed Sessions</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Peer Grid */}
      {peerList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No students found matching your search</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try searching for another skill like "Python", "UI/UX", "Java", or clear filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDepartmentFilter('All');
              setCollegeFilter('All');
            }}
            className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl hover:bg-indigo-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {peerList.map(({ student, match, connectionStatus }) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top: Avatar & Compatibility Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatarUrl}
                      alt={student.fullName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{student.fullName}</h3>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {student.department}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {student.college}
                      </p>
                    </div>
                  </div>

                  <MatchScoreBadge score={match.totalScore} size="sm" />
                </div>

                {/* Rating & Sessions strip */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pb-3 border-b border-slate-100">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    {student.averageRating.toFixed(1)}
                  </span>
                  <span>•</span>
                  <span>{student.completedSessionsCount} sessions completed</span>
                </div>

                {/* Teaching Skills */}
                <div className="my-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    Teaches:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.teachingSkills.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-medium border border-emerald-100"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learning Wishlist */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 block mb-1">
                    Wants to Learn:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.learningSkills.map((s) => (
                      <span
                        key={s.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 font-medium border border-indigo-100"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bio snippet */}
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {student.bio}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenProfileModal(student)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Profile
                </button>

                {connectionStatus === 'connected' ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenChatWith(student)}
                      className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg"
                      title="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenScheduleModal(student)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                    >
                      Schedule
                    </button>
                  </div>
                ) : connectionStatus === 'pending_sent' ? (
                  <span className="text-[11px] px-2.5 py-1 text-amber-700 bg-amber-50 rounded-lg font-medium border border-amber-200">
                    Request Sent
                  </span>
                ) : (
                  <button
                    onClick={() => onOpenConnectModal(student)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
