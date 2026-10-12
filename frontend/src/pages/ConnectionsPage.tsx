import React, { useState } from 'react';
import { StudentProfile, ConnectionRequest } from '../types';
import { StorageService } from '../services/storageService';
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Check,
  X,
  MessageSquare,
  Calendar,
  ArrowRightLeft,
  Search,
} from 'lucide-react';

interface ConnectionsPageProps {
  currentStudent: StudentProfile;
  setActiveTab: (tab: string) => void;
  onOpenScheduleModal: (partner: StudentProfile) => void;
  onOpenChatWith: (student: StudentProfile) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = ({
  currentStudent,
  setActiveTab,
  onOpenScheduleModal,
  onOpenChatWith,
  onOpenProfileModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'connections' | 'incoming' | 'outgoing'>(
    'connections'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Fresh data
  const connections = StorageService.getUserConnections(currentStudent.id);
  const allRequests = StorageService.getRequests();

  const incomingRequests = allRequests.filter(
    (r) => r.receiverId === currentStudent.id && r.status === 'pending'
  );

  const outgoingRequests = allRequests.filter(
    (r) => r.senderId === currentStudent.id && r.status === 'pending'
  );

  const handleAccept = (reqId: string) => {
    try {
      StorageService.acceptConnectionRequest(reqId);
      setActionMessage('Connection request accepted! You can now chat and schedule sessions.');
      setTimeout(() => setActionMessage(null), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReject = (reqId: string) => {
    try {
      StorageService.rejectConnectionRequest(reqId);
      setActionMessage('Connection request declined.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCancel = (reqId: string) => {
    try {
      StorageService.cancelConnectionRequest(reqId);
      setActionMessage('Outgoing connection request cancelled.');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Filter connections by search term
  const filteredConnections = connections.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.college.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q) ||
      c.teachingSkills.some((s) => s.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Peer Connections & Requests
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your network of student study partners and reciprocal skill mentors.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('discover')}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Find New Peers</span>
          </button>
        </div>

        {actionMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium animate-in fade-in">
            {actionMessage}
          </div>
        )}

        {/* Sub-tabs bar */}
        <div className="flex items-center gap-2 border-b border-slate-100 pt-2">
          <button
            onClick={() => setActiveSubTab('connections')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'connections'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Connections ({connections.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('incoming')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'incoming'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Incoming Requests</span>
            {incomingRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {incomingRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('outgoing')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeSubTab === 'outgoing'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Sent Requests ({outgoingRequests.length})</span>
          </button>
        </div>
      </div>

      {/* 1. Accepted Connections Tab */}
      {activeSubTab === 'connections' && (
        <div className="space-y-4">
          {connections.length > 0 && (
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search connected partners..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {filteredConnections.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No connections yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Once a peer accepts your connection request, they will appear here for messaging and scheduling.
              </p>
              <button
                onClick={() => setActiveTab('matches')}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl hover:bg-indigo-700 shadow-xs"
              >
                Explore Recommended Matches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConnections.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={partner.avatarUrl}
                        alt={partner.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{partner.fullName}</h3>
                        <p className="text-[11px] text-slate-500">{partner.department}</p>
                        <p className="text-[10px] text-indigo-700 font-medium">{partner.college}</p>
                      </div>
                    </div>

                    <div className="my-2.5 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="font-semibold text-emerald-800">Teaches:</span>
                        <span className="truncate">{partner.teachingSkills.map((s) => s.name).join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <span className="font-semibold text-indigo-800">Learns:</span>
                        <span className="truncate">{partner.learningSkills.map((s) => s.name).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => onOpenProfileModal(partner)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Profile
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenChatWith(partner)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </button>
                      <button
                        onClick={() => onOpenScheduleModal(partner)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Incoming Requests Tab */}
      {activeSubTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No pending incoming requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                When other students request to connect with you, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => {
                const sender = StorageService.getStudentById(req.senderId);
                if (!sender) return null;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={sender.avatarUrl}
                        alt={sender.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{sender.fullName}</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {sender.year}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{sender.department} • {sender.college}</p>

                        {/* Proposal note */}
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 text-xs text-slate-700 italic border border-slate-100">
                          "{req.note}"
                        </div>

                        {req.proposedSkillExchange && (
                          <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-slate-600">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                            <span>
                              They offer: <strong>{req.proposedSkillExchange.teachSkill}</strong> ↔ Wants to learn: <strong>{req.proposedSkillExchange.learnSkill}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center self-end">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept & Connect</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. Outgoing Requests Tab */}
      {activeSubTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No pending sent requests</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You haven't sent any pending connection requests.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {outgoingRequests.map((req) => {
                const receiver = StorageService.getStudentById(req.receiverId);
                if (!receiver) return null;

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={receiver.avatarUrl}
                        alt={receiver.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{receiver.fullName}</h4>
                          <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded border border-amber-200">
                            Pending Response
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{receiver.department} • {receiver.college}</p>
                        <p className="text-xs text-slate-600 mt-1 italic">"{req.note}"</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCancel(req.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors self-end sm:self-center"
                    >
                      Cancel Request
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
