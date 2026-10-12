import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile, ChatMessage } from '../types';
import { StorageService } from '../services/storageService';
import {
  Send,
  MessageSquare,
  Calendar,
  Sparkles,
  User,
  Clock,
  CheckCheck,
  Search,
} from 'lucide-react';

interface MessagesPageProps {
  currentStudent: StudentProfile;
  initialPartner?: StudentProfile | null;
  onOpenScheduleModal: (partner: StudentProfile) => void;
  onOpenProfileModal: (student: StudentProfile) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  currentStudent,
  initialPartner,
  onOpenScheduleModal,
  onOpenProfileModal,
}) => {
  const connections = StorageService.getUserConnections(currentStudent.id);
  const [selectedPartner, setSelectedPartner] = useState<StudentProfile | null>(
    initialPartner || (connections.length > 0 ? connections[0] : null)
  );
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync if initial partner changes
  useEffect(() => {
    if (initialPartner) {
      setSelectedPartner(initialPartner);
    }
  }, [initialPartner]);

  // Load messages whenever selectedPartner changes
  useEffect(() => {
    if (selectedPartner) {
      const msgs = StorageService.getMessagesForConversation(currentStudent.id, selectedPartner.id);
      setMessages(msgs);
      StorageService.markMessagesAsRead(currentStudent.id, selectedPartner.id);
    } else {
      setMessages([]);
    }
  }, [selectedPartner, currentStudent.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedPartner) return;

    const newMsg = StorageService.sendMessage(
      currentStudent.id,
      selectedPartner.id,
      inputText.trim()
    );

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleQuickTemplate = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden h-[calc(100vh-8.5rem)] flex flex-col md:flex-row animate-in fade-in duration-300">
      {/* Left Column: Conversations List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-base font-bold text-slate-900">Direct Messages</h2>
          <p className="text-xs text-slate-500">Connected learning partners</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {connections.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">No active connections yet.</p>
              <p className="text-[11px] text-slate-400 mt-1">Connect with peers to start chatting.</p>
            </div>
          ) : (
            connections.map((partner) => {
              const isSelected = selectedPartner?.id === partner.id;
              const convMsgs = StorageService.getMessagesForConversation(
                currentStudent.id,
                partner.id
              );
              const lastMsg = convMsgs[convMsgs.length - 1];
              const unreadCount = convMsgs.filter(
                (m) => m.receiverId === currentStudent.id && !m.read
              ).length;

              return (
                <button
                  key={partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`w-full text-left p-3.5 flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-white bg-transparent'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {partner.fullName}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(lastMsg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 truncate">
                      {lastMsg ? lastMsg.text : `Connected with ${partner.fullName.split(' ')[0]}`}
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-indigo-600 font-semibold truncate">
                        {partner.teachingSkills[0]?.name || 'Skills'}
                      </span>
                      {unreadCount > 0 && (
                        <span className="ml-auto text-[10px] font-bold bg-indigo-600 text-white rounded-full px-1.5 py-0.2">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      {selectedPartner ? (
        <div className="flex-1 flex flex-col bg-white h-full">
          {/* Chat Header */}
          <div className="p-3.5 px-5 border-b border-slate-200 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-3">
              <img
                src={selectedPartner.avatarUrl}
                alt={selectedPartner.fullName}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 cursor-pointer"
                onClick={() => onOpenProfileModal(selectedPartner)}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    onClick={() => onOpenProfileModal(selectedPartner)}
                    className="font-bold text-slate-900 text-sm hover:underline cursor-pointer"
                  >
                    {selectedPartner.fullName}
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                    Active Partner
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  {selectedPartner.department} • Teaches: {selectedPartner.teachingSkills.map((s) => s.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenScheduleModal(selectedPartner)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Session</span>
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
            {/* Conversation starter pill */}
            <div className="text-center py-2">
              <span className="text-[11px] font-medium text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                Connected for peer learning • Messages are end-to-end encrypted
              </span>
            </div>

            {messages.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <p className="text-xs">No messages yet between you and {selectedPartner.fullName}.</p>
                <p className="text-xs text-indigo-600 mt-1">Say hi or propose a study session!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.senderId === currentStudent.id;

                return (
                  <div
                    key={m.id}
                    className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMine && (
                      <img
                        src={selectedPartner.avatarUrl}
                        alt={selectedPartner.fullName}
                        className="w-7 h-7 rounded-full object-cover mb-1 border border-slate-200"
                      />
                    )}

                    <div
                      className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMine
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                      <div
                        className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                          isMine ? 'text-indigo-200' : 'text-slate-400'
                        }`}
                      >
                        <span>
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMine && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions / Templates */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-600">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Quick:
            </span>
            <button
              onClick={() => handleQuickTemplate("Hey! When are you free for our next session?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 shrink-0 text-slate-700 transition-colors"
            >
              When are you free?
            </button>
            <button
              onClick={() => handleQuickTemplate(`I can help you with ${currentStudent.teachingSkills[0]?.name || 'skills'} this weekend.`)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 shrink-0 text-slate-700 transition-colors"
            >
              Offer help this weekend
            </button>
            <button
              onClick={() => handleQuickTemplate("Here's our meeting link: https://meet.google.com/psep-study")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 shrink-0 text-slate-700 transition-colors"
            >
              Share Google Meet link
            </button>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message ${selectedPartner.fullName.split(' ')[0]}...`}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400">
          <div>
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-700">Select a partner to chat</h3>
            <p className="text-xs text-slate-400 mt-1">Connect with peers to unlock real-time messaging.</p>
          </div>
        </div>
      )}
    </div>
  );
};
