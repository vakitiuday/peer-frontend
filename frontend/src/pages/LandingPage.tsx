import React from 'react';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';
import { POPULAR_SKILLS } from '../utils/matchingEngine';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onQuickDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLoginClick,
  onQuickDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">
                Peer Skill Exchange
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.5 rounded ml-1.5 uppercase">
                Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={onQuickDemo}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl transition-all border border-indigo-200"
            >
              Instant Demo
            </button>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all"
            >
              Join Platform
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>A Collaborative Peer-to-Peer Knowledge Sharing System</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Teach What You Know.{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                Learn What You Need.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Connect with fellow university students based on complementary skill sets. Student A teaches Python to learn UI/UX, while Student B teaches UI/UX to learn Python.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onQuickDemo}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 shadow-xs transition-all"
              >
                Register Student Account
              </button>
            </div>

            {/* Reciprocal match visualization pill */}
            <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm max-w-lg mx-auto flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-left">
                <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <div>
                  <div className="font-bold text-slate-900">Ananya teaches Python</div>
                  <div className="text-[10px] text-slate-500">Wants UI/UX Design</div>
                </div>
              </div>

              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
                <ArrowRightLeft className="w-4 h-4" />
              </div>

              <div className="flex items-center gap-2 text-right">
                <div>
                  <div className="font-bold text-slate-900">Rahul teaches UI/UX</div>
                  <div className="text-[10px] text-slate-500">Wants Python</div>
                </div>
                <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                  R
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics Strip */}
      <section className="py-8 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">8+</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Active Student Personas</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">96%</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Top Complementary Match</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">70+</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Skills in Taxonomy</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-500">4.9 ★</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Average Peer Rating</div>
          </div>
        </div>
      </section>

      {/* How It Works (3 Phases from PDF) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              System Execution Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Three-Phase Peer Learning Sequence
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed according to the platform technical architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                Phase I
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Onboarding & Profiling</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students create an authenticated academic profile, indexing their proficiencies into <em>Skills to Teach</em> and their targets into <em>Skills to Learn</em> taxonomies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                Phase II
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Matching & Connection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The intelligent matching engine calculates 2-way reciprocal scores (70% skills, 15% availability, 10% interests, 5% language). Peers send connection requests and arrange schedules.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                Phase III
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">Exchange & Feedback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students join video sessions, learn together hands-on, and submit 1-5 star reviews with highlight tags to reinforce trust and community accountability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills Showcase */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Popular Exchange Skills</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8 max-w-xl mx-auto">
            From technical stacks like Python, React, and Machine Learning to essential soft skills like Public Speaking and Technical Communication.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {POPULAR_SKILLS.map((s) => (
              <span
                key={s.name}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-700 transition-colors cursor-default"
              >
                {s.name}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <button
              onClick={onQuickDemo}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore All Peers in Demo Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white">Peer Skill Exchange Platform</span> • Technical Training Program Project
          </div>
          <div>
            Full-Stack EdTech Architecture • React, TypeScript, Tailwind CSS & Cloud Firestore
          </div>
        </div>
      </footer>
    </div>
  );
};
