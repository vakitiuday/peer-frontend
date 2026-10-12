import React from 'react';
import { StorageService } from '../services/storageService';
import { StudentProfile } from '../types';
import { UserCheck, Sparkles, ChevronDown } from 'lucide-react';

interface PersonaSwitcherProps {
  currentStudent: StudentProfile;
  onSwitch: (student: StudentProfile) => void;
}

export const PersonaSwitcher: React.FC<PersonaSwitcherProps> = ({ currentStudent, onSwitch }) => {
  const students = StorageService.getStudents();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (s: StudentProfile) => {
    StorageService.setCurrentUserId(s.id);
    onSwitch(s);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors shadow-xs"
        title="Switch persona to test reciprocal matching and messaging from other students' perspectives"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="hidden sm:inline text-indigo-900 font-semibold">Active Persona:</span>
        <span className="font-bold truncate max-w-[110px] sm:max-w-none">{currentStudent.fullName}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Switch Student Persona
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                Demo Tester
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Test two-way reciprocal skill matches, incoming requests, and chat replies from different students.
            </p>
          </div>

          <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-50">
            {students.map((student) => {
              const isSelected = student.id === currentStudent.id;
              const topTeach = student.teachingSkills[0]?.name || 'Skills';
              const topLearn = student.learningSkills[0]?.name || 'Skills';

              return (
                <button
                  key={student.id}
                  onClick={() => handleSelect(student)}
                  className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors ${
                    isSelected ? 'bg-indigo-50/80 text-indigo-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <img
                    src={student.avatarUrl}
                    alt={student.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{student.fullName}</span>
                      {isSelected && <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{student.college}</div>
                    <div className="text-[10px] flex items-center gap-1 mt-0.5">
                      <span className="text-emerald-700 font-medium">Teaches: {topTeach}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-indigo-600 font-medium">Learns: {topLearn}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 text-center">
            Tip: Switch to <strong>Rahul Verma</strong> to see Ananya's pending requests and reciprocal score!
          </div>
        </div>
      )}
    </div>
  );
};
