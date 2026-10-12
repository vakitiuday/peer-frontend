import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { isFirebaseConfigured, initializeFirebase } from '../services/firebaseService';
import { Database, ShieldCheck, X, CheckCircle2, RefreshCw, Key, Code2 } from 'lucide-react';

interface FirebaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const FirebaseModal: React.FC<FirebaseModalProps> = ({
  isOpen,
  onClose,
  onRefresh,
}) => {
  const [config, setConfig] = useState(StorageService.getFirebaseConfig());
  const [activeTab, setActiveTab] = useState<'status' | 'config' | 'rules'>('status');
  const [msg, setMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isLive = isFirebaseConfigured();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveFirebaseConfig({
      ...config,
      isConfigured: Boolean(config.apiKey && config.projectId),
    });
    initializeFirebase();
    setMsg('Firebase settings saved!');
    setTimeout(() => setMsg(null), 3000);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Backend & Firebase Status</h3>
              <p className="text-xs text-slate-500">Dual-Mode Architecture & Cloud Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pt-3">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'status'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Backend Mode Status
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Firebase Credentials
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'rules'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Security Rules (firestore.rules)
          </button>
        </div>

        {msg && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
            {msg}
          </div>
        )}

        {/* Tab 1: Status */}
        {activeTab === 'status' && (
          <div className="py-4 space-y-4 text-xs">
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              isLive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
            }`}>
              <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">
                  {isLive ? 'Live Firebase Mode Connected' : 'Interactive Demo Mode (Persistent Local Storage)'}
                </h4>
                <p className="mt-1 leading-relaxed text-slate-600">
                  {isLive
                    ? 'Connected directly to Google Firebase Authentication & Cloud Firestore.'
                    : 'Running in educational demo mode with 8 realistic university student personas with complementary skills (Ananya & Rahul, Priya & Arjun, Sneha & Kiran, David & Elena). Changes persist in your browser.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Preloaded Personas</span>
                <span className="text-slate-500 mt-1 block">8 complementary students with ratings & sessions</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block">Testing Capabilities</span>
                <span className="text-slate-500 mt-1 block">Use the top persona switcher to test both sides</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Config */}
        {activeTab === 'config' && (
          <form onSubmit={handleSave} className="py-4 space-y-3 text-xs">
            <p className="text-slate-600">
              Enter your Firebase project details to connect real Cloud Firestore:
            </p>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">API Key</label>
              <input
                type="text"
                value={config.apiKey}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Project ID</label>
              <input
                type="text"
                value={config.projectId}
                onChange={(e) => setConfig({ ...config, projectId: e.target.value })}
                placeholder="peer-skill-exchange"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Auth Domain</label>
              <input
                type="text"
                value={config.authDomain}
                onChange={(e) => setConfig({ ...config, authDomain: e.target.value })}
                placeholder="project-id.firebaseapp.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-2"
            >
              Save & Initialize Firebase
            </button>
          </form>
        )}

        {/* Tab 3: Security rules */}
        {activeTab === 'rules' && (
          <div className="py-4 space-y-2 text-xs">
            <p className="text-slate-600">Configured in <code>firestore.rules</code>:</p>
            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-60">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{studentId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == studentId;
    }
    match /sessions/{sessionId} {
      allow read, update: if request.auth.uid in [resource.data.requesterId, resource.data.partnerId];
    }
    match /messages/{messageId} {
      allow read, write: if request.auth.uid in [resource.data.senderId, resource.data.receiverId];
    }
  }
}`}
            </pre>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
