import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { isFirebaseConfigured, initializeFirebase } from '../services/firebaseService';
import {
  Layers,
  Database,
  ShieldCheck,
  RefreshCw,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Lock,
  GitBranch,
  Sparkles,
  Key,
} from 'lucide-react';

interface SettingsPageProps {
  onDataReset: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onDataReset }) => {
  const [config, setConfig] = useState(StorageService.getFirebaseConfig());
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(isFirebaseConfigured());

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveFirebaseConfig({
      ...config,
      isConfigured: Boolean(config.apiKey && config.projectId),
    });
    initializeFirebase();
    setIsLive(isFirebaseConfigured());
    setSaveMsg('Firebase configuration saved successfully!');
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default initial state? This will restore the 8 student personas and sample sessions.')) {
      StorageService.resetToDemoData();
      onDataReset();
      alert('Data reset to default demo state successfully.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                System Architecture & Technical Specifications
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                End-to-end platform design, matching algorithms, and database models.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleResetData}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Dataset</span>
        </button>
      </div>

      {/* Operational Flowchart Diagram (from PDF Page 2) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              System Execution Model
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Platform Operational Flowchart
            </h2>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-800 font-semibold px-2.5 py-1 rounded-lg border border-indigo-200">
            End-to-End Execution Sequence
          </span>
        </div>

        {/* Visual Workflow Steps */}
        <div className="mt-6 flex flex-col items-center max-w-xl mx-auto space-y-3 text-center text-xs">
          {/* Step 1 */}
          <div className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-xl font-bold shadow-xs">
            User Registration / Login
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Step 2 */}
          <div className="w-full bg-white border-2 border-slate-300 text-slate-800 py-2.5 px-4 rounded-xl font-semibold">
            Create Profile & Define Skills
            <div className="text-[10px] text-slate-500 font-normal">Specify "Skills to Teach" & "Skills to Learn"</div>
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Step 3 */}
          <div className="w-full bg-blue-50 border-2 border-blue-400 text-blue-900 py-2.5 px-4 rounded-xl font-bold shadow-xs">
            Intelligent Matching Engine
            <div className="text-[10px] text-blue-600 font-normal">Cross-analyze complementary skill requirements</div>
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Step 4 */}
          <div className="w-full bg-white border-2 border-slate-300 text-slate-800 py-2.5 px-4 rounded-xl font-semibold">
            Browse Recommendations & Send Request
            <div className="text-[10px] text-slate-500 font-normal">Select compatible peer and initiate contact</div>
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Decision Node */}
          <div className="w-48 bg-amber-50 border-2 border-amber-400 text-amber-900 py-2 px-3 rounded-xl font-bold">
            Connection Accepted?
          </div>

          <div className="flex items-center justify-center gap-8 text-[11px] font-semibold text-slate-500">
            <span className="text-rose-600">No → Refine Criteria</span>
            <span className="text-emerald-600 font-bold">Yes ↓</span>
          </div>

          {/* Step 5 */}
          <div className="w-full bg-white border-2 border-slate-300 text-slate-800 py-2.5 px-4 rounded-xl font-semibold">
            Session Scheduling & Messaging
            <div className="text-[10px] text-slate-500 font-normal">Coordinate session timing via integrated chat</div>
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Step 6 */}
          <div className="w-full bg-emerald-50 border-2 border-emerald-400 text-emerald-900 py-2.5 px-4 rounded-xl font-bold shadow-xs">
            Conduct Learning Session & Review
            <div className="text-[10px] text-emerald-700 font-normal">Complete exchange, submit ratings & feedback</div>
          </div>
          <div className="text-slate-300 font-bold">↓</div>

          {/* Step 7 */}
          <div className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-xl font-bold shadow-xs">
            Update Profile & Match Model
          </div>
        </div>

        {/* 3 Phases Callout Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">PHASE I</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Onboarding & Profiling</div>
            <p className="text-slate-600 mt-1.5 leading-relaxed text-[11px]">
              Users authenticate and index their skills into teaching and learning taxonomies for algorithm indexing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">PHASE II</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Matching & Connection</div>
            <p className="text-slate-600 mt-1.5 leading-relaxed text-[11px]">
              Backend matches complementary needs; users connect, send requests, and negotiate schedules.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">PHASE III</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">Exchange & Feedback</div>
            <p className="text-slate-600 mt-1.5 leading-relaxed text-[11px]">
              Peer session takes place; mutual ratings are captured to reinforce trust and update matching algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Backend & Firebase Integration Configuration */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Backend & Firebase Configuration</h3>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-bold ${
              isLive
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isLive ? 'Connected to Firebase' : 'Interactive Demo Mode (Local Storage)'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The application functions with local browser persistence (with 8 pre-seeded student personas including Ananya, Rahul, Priya, Arjun, Sneha, and Kiran). You can connect your live Firebase project below or via environment variables:
        </p>

        {saveMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            {saveMsg}
          </div>
        )}

        <form onSubmit={handleSaveConfig} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Firebase API Key</label>
            <input
              type="text"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Firebase Project ID</label>
            <input
              type="text"
              value={config.projectId}
              onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
              placeholder="peer-skill-exchange"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Auth Domain</label>
            <input
              type="text"
              value={config.authDomain}
              onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
              placeholder="project-id.firebaseapp.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Storage Bucket</label>
            <input
              type="text"
              value={config.storageBucket}
              onChange={(e) => setConfig({ ...config, storageBucket: e.target.value })}
              placeholder="project-id.appspot.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Save Firebase Settings
            </button>
          </div>
        </form>
      </div>

      {/* Firestore Security Rules Display */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-base">Firestore Security Rules</h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
            firestore.rules
          </span>
        </div>

        <p className="text-xs text-slate-600">
          Enforces RBAC, participants-only access on private messages, sessions, and connections:
        </p>

        <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only student owner can update their own profile
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && request.auth.uid == studentId;
    }
    // Only participants can read or update sessions
    match /sessions/{sessionId} {
      allow read, update: if request.auth != null && (
        resource.data.requesterId == request.auth.uid ||
        resource.data.partnerId == request.auth.uid
      );
    }
    // Only conversation participants can view or send messages
    match /messages/{messageId} {
      allow read: if request.auth != null && (
        resource.data.senderId == request.auth.uid ||
        resource.data.receiverId == request.auth.uid
      );
    }
    // Social reviews: readable by all authenticated peers
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.reviewerId == request.auth.uid;
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};
