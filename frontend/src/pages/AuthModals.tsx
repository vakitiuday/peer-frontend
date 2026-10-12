import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { StudentProfile } from '../types';
import { X, Lock, Mail, User, GraduationCap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'register' | 'forgot';
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (student: StudentProfile) => void;
  onSwitchMode: (mode: 'login' | 'register' | 'forgot') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  isOpen,
  onClose,
  onLoginSuccess,
  onSwitchMode,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('Tech University');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('3rd Year');
  const [bio, setBio] = useState('');
  const [teachSkill, setTeachSkill] = useState('Python');
  const [learnSkill, setLearnSkill] = useState('UI/UX Design');

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const students = StorageService.getStudents();
    const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());

    if (found) {
      StorageService.setCurrentUserId(found.id);
      onLoginSuccess(found);
      onClose();
    } else {
      // If student not found by email, allow login as first demo user or show friendly error
      const defaultUser = students[0];
      StorageService.setCurrentUserId(defaultUser.id);
      onLoginSuccess(defaultUser);
      onClose();
    }
  };

  const handleQuickDemoLogin = (userId: string) => {
    const student = StorageService.getStudentById(userId);
    if (student) {
      StorageService.setCurrentUserId(student.id);
      onLoginSuccess(student);
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const newStudent = StorageService.createStudent({
        email,
        fullName,
        avatarUrl: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
        college,
        department,
        year,
        bio: bio || `Student in ${department} passionate about peer learning and skill sharing.`,
        teachingSkills: [
          { id: `t-${Date.now()}`, name: teachSkill, category: 'General', level: 'Advanced' },
        ],
        learningSkills: [
          { id: `l-${Date.now()}`, name: learnSkill, category: 'General', priority: 'High' },
        ],
        languages: ['English'],
        availability: ['Weekend Mornings', 'Weekday Evenings'],
        interests: ['Hackathons', 'Open Source'],
      });

      StorageService.setCurrentUserId(newStudent.id);
      onLoginSuccess(newStudent);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(`Password reset instructions sent to ${email || 'your email'}.`);
    setTimeout(() => {
      setMessage(null);
      onSwitchMode('login');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {mode === 'login' && 'Sign In to Platform'}
                {mode === 'register' && 'Create Student Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className="text-[11px] text-slate-500">Peer Skill Exchange Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {/* 1. LOGIN MODE */}
        {mode === 'login' && (
          <div className="mt-4 space-y-4">
            {/* Quick Demo Sign In buttons */}
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 block mb-1.5">
                One-Click Student Demo Sign In:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user-ananya')}
                  className="p-2 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 text-left transition-colors"
                >
                  <div className="font-bold text-slate-900 truncate">Ananya Sharma</div>
                  <div className="text-[10px] text-indigo-700">Teaches Python</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('user-rahul')}
                  className="p-2 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 text-left transition-colors"
                >
                  <div className="font-bold text-slate-900 truncate">Rahul Verma</div>
                  <div className="text-[10px] text-indigo-700">Teaches UI/UX</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ananya.sharma@nit.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => onSwitchMode('forgot')}
                    className="text-[11px] text-indigo-600 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                Sign In
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('register')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Register now
              </button>
            </div>
          </div>
        )}

        {/* 2. REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="mt-4 space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@univ.edu"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Can Teach</label>
                <input
                  type="text"
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  placeholder="e.g. Python"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Wants to Learn</label>
                <input
                  type="text"
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  placeholder="e.g. UI/UX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
            >
              Complete Registration & Enter
            </button>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-indigo-600 font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* 3. FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgot} className="mt-4 space-y-3 text-xs">
            <p className="text-slate-600">
              Enter your registered student email address to receive password reset instructions.
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@univ.edu"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              Send Password Reset Link
            </button>
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onSwitchMode('login')}
                className="text-indigo-600 font-bold hover:underline text-xs"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
