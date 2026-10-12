import React, { useState } from 'react';
import { StudentProfile, SkillItem, SkillLevel, SkillPriority } from '../types';
import { StorageService } from '../services/storageService';
import {
  POPULAR_SKILLS,
  AVAILABILITY_OPTIONS,
  LANGUAGE_OPTIONS,
  INTEREST_OPTIONS,
} from '../utils/matchingEngine';
import {
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Globe,
  Award,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ProfilePageProps {
  currentStudent: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  setActiveTab: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentStudent,
  onProfileUpdated,
  setActiveTab,
}) => {
  const [fullName, setFullName] = useState(currentStudent.fullName);
  const [avatarUrl, setAvatarUrl] = useState(currentStudent.avatarUrl);
  const [college, setCollege] = useState(currentStudent.college);
  const [department, setDepartment] = useState(currentStudent.department);
  const [year, setYear] = useState(currentStudent.year);
  const [bio, setBio] = useState(currentStudent.bio);

  const [teachingSkills, setTeachingSkills] = useState<SkillItem[]>([...currentStudent.teachingSkills]);
  const [learningSkills, setLearningSkills] = useState<SkillItem[]>([...currentStudent.learningSkills]);

  const [availability, setAvailability] = useState<string[]>([...currentStudent.availability]);
  const [languages, setLanguages] = useState<string[]>([...currentStudent.languages]);
  const [interests, setInterests] = useState<string[]>([...currentStudent.interests]);

  // Skill input helper states
  const [newTeachSkillName, setNewTeachSkillName] = useState('');
  const [newTeachSkillLevel, setNewTeachSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newLearnSkillName, setNewLearnSkillName] = useState('');
  const [newLearnSkillPriority, setNewLearnSkillPriority] = useState<SkillPriority>('High');

  const [customInterest, setCustomInterest] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Teaching skills handlers
  const handleAddTeachingSkill = (name: string, level: SkillLevel = 'Intermediate') => {
    if (!name.trim()) return;
    if (teachingSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    const newSkill: SkillItem = {
      id: `teach-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: name.trim(),
      category: 'General',
      level,
    };
    setTeachingSkills([...teachingSkills, newSkill]);
    setNewTeachSkillName('');
  };

  const handleRemoveTeachingSkill = (id: string) => {
    setTeachingSkills(teachingSkills.filter((s) => s.id !== id));
  };

  // Learning skills handlers
  const handleAddLearningSkill = (name: string, priority: SkillPriority = 'High') => {
    if (!name.trim()) return;
    if (learningSkills.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;

    const newSkill: SkillItem = {
      id: `learn-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: name.trim(),
      category: 'General',
      priority,
    };
    setLearningSkills([...learningSkills, newSkill]);
    setNewLearnSkillName('');
  };

  const handleRemoveLearningSkill = (id: string) => {
    setLearningSkills(learningSkills.filter((s) => s.id !== id));
  };

  // Multi-select toggle helper
  const toggleArrayItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = StorageService.updateStudentProfile(currentStudent.id, {
      fullName,
      avatarUrl,
      college,
      department,
      year,
      bio,
      teachingSkills,
      learningSkills,
      availability,
      languages,
      interests,
    });

    onProfileUpdated(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Profile & Skill Taxonomies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update your skills to refine match recommendations across the platform.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile updated & matches recalculated!
              </span>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Academic & Personal Details</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department / Major</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Year of Study</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Final)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block font-semibold text-slate-700 mb-1">Short Biography</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your learning style, hackathon experience, or academic interests..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Skill Management Split: Teaching vs Learning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Skills to Teach */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm">Skills I Can Teach ({teachingSkills.length})</h3>
              </div>
              <span className="text-[11px] text-slate-400">Offered to peers</span>
            </div>

            {/* List of current teaching skills */}
            <div className="space-y-2">
              {teachingSkills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                      {s.level || 'Intermediate'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeachingSkill(s.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new teaching skill */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Add Teaching Skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTeachSkillName}
                  onChange={(e) => setNewTeachSkillName(e.target.value)}
                  placeholder="e.g. Python, SQL, UI/UX"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newTeachSkillLevel}
                  onChange={(e) => setNewTeachSkillLevel(e.target.value as SkillLevel)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleAddTeachingSkill(newTeachSkillName, newTeachSkillLevel)}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-2.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Quick Suggestions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SKILLS.slice(0, 10).map((ps) => (
                    <button
                      key={ps.name}
                      type="button"
                      onClick={() => handleAddTeachingSkill(ps.name)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 transition-colors"
                    >
                      + {ps.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Skills to Learn */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-indigo-800">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm">Skills I Want to Learn ({learningSkills.length})</h3>
              </div>
              <span className="text-[11px] text-slate-400">Wishlist & goals</span>
            </div>

            {/* List of current learning skills */}
            <div className="space-y-2">
              {learningSkills.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{s.name}</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-semibold">
                      {s.priority || 'High'} Priority
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLearningSkill(s.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new learning skill */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Add Wishlist Skill
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLearnSkillName}
                  onChange={(e) => setNewLearnSkillName(e.target.value)}
                  placeholder="e.g. Machine Learning, React, Figma"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newLearnSkillPriority}
                  onChange={(e) => setNewLearnSkillPriority(e.target.value as SkillPriority)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleAddLearningSkill(newLearnSkillName, newLearnSkillPriority)}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions */}
              <div className="mt-2.5">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                  Quick Suggestions:
                </span>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SKILLS.slice(10, 20).map((ps) => (
                    <button
                      key={ps.name}
                      type="button"
                      onClick={() => handleAddLearningSkill(ps.name)}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-800 transition-colors"
                    >
                      + {ps.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Availability, Languages, Interests */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
          {/* Availability */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Available Time Slots</span>
            </h4>
            <div className="space-y-1.5">
              {AVAILABILITY_OPTIONS.map((slot) => {
                const selected = availability.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleArrayItem(availability, setAvailability, slot)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                      selected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{slot}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-violet-600" />
              <span>Languages Spoken</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => {
                const selected = languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleArrayItem(languages, setLanguages, lang)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-violet-50 border-violet-300 text-violet-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interests */}
          <div>
            <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Academic & Tech Interests</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {INTEREST_OPTIONS.map((int) => {
                const selected = interests.includes(int);
                return (
                  <button
                    key={int}
                    type="button"
                    onClick={() => toggleArrayItem(interests, setInterests, int)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    #{int}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
