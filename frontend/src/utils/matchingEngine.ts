import { MatchScoreBreakdown, StudentProfile } from '../types';

/**
 * Normalizes skill strings for fuzzy/case-insensitive comparison
 * e.g., "UI/UX Design" matches "ui/ux", "React.js" matches "react"
 */
export function normalizeSkill(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.\-_/\s]/g, '')
    .trim();
}

/**
 * Checks if two skill names match closely
 */
export function skillsMatch(skillA: string, skillB: string): boolean {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);

  if (normA === normB) return true;
  if (normA.includes(normB) || normB.includes(normA)) {
    // Only substring match if length is reasonable to avoid false positives (e.g. "c" in "react")
    const minLen = Math.min(normA.length, normB.length);
    if (minLen >= 3) return true;
  }
  return false;
}

/**
 * Calculates matching score and detailed breakdown between current student and a candidate peer.
 * Weight Distribution:
 * - Reciprocal Skill Compatibility: 70%
 * - Availability Compatibility: 15%
 * - Shared Academic/Tech Interests: 10%
 * - Language Compatibility: 5%
 */
export function calculateMatchScore(
  user: StudentProfile,
  candidate: StudentProfile
): MatchScoreBreakdown {
  if (user.id === candidate.id) {
    return {
      reciprocalSkillScore: 0,
      availabilityScore: 0,
      interestsScore: 0,
      languageScore: 0,
      totalScore: 0,
      youCanTeachThem: [],
      theyCanTeachYou: [],
      sharedAvailability: [],
      sharedInterests: [],
      sharedLanguages: [],
      explanation: 'Self comparison',
      isReciprocal: false,
    };
  }

  // 1. Skill Matching Directions
  // Direction A: What user can teach that candidate wants to learn
  const youCanTeachThem: string[] = [];
  user.teachingSkills.forEach((userTeach) => {
    candidate.learningSkills.forEach((candidateLearn) => {
      if (skillsMatch(userTeach.name, candidateLearn.name)) {
        if (!youCanTeachThem.includes(userTeach.name)) {
          youCanTeachThem.push(userTeach.name);
        }
      }
    });
  });

  // Direction B: What candidate can teach that user wants to learn
  const theyCanTeachYou: string[] = [];
  candidate.teachingSkills.forEach((candidateTeach) => {
    user.learningSkills.forEach((userLearn) => {
      if (skillsMatch(candidateTeach.name, userLearn.name)) {
        if (!theyCanTeachYou.includes(candidateTeach.name)) {
          theyCanTeachYou.push(candidateTeach.name);
        }
      }
    });
  });

  const isReciprocal = youCanTeachThem.length > 0 && theyCanTeachYou.length > 0;

  // Reciprocal Skill Score (Max 70 points)
  let reciprocalSkillScore = 0;
  if (isReciprocal) {
    // Perfect bidirectional match! Base 50 points + up to 20 points for count & depth
    const totalMatchedSkills = youCanTeachThem.length + theyCanTeachYou.length;
    const bonus = Math.min(20, (totalMatchedSkills - 2) * 5 + 15);
    reciprocalSkillScore = Math.min(70, 50 + bonus);
  } else if (youCanTeachThem.length > 0) {
    // One-way: User can mentor candidate (max 35)
    reciprocalSkillScore = Math.min(35, youCanTeachThem.length * 18);
  } else if (theyCanTeachYou.length > 0) {
    // One-way: Candidate can mentor user (max 35)
    reciprocalSkillScore = Math.min(35, theyCanTeachYou.length * 18);
  } else {
    // No direct skill intersection
    reciprocalSkillScore = 0;
  }

  // 2. Availability Compatibility (Max 15 points)
  const userAvail = user.availability || [];
  const candAvail = candidate.availability || [];
  const sharedAvailability = userAvail.filter((slot) =>
    candAvail.some((cSlot) => cSlot.toLowerCase() === slot.toLowerCase())
  );

  let availabilityScore = 0;
  if (
    userAvail.includes('Flexible') ||
    candAvail.includes('Flexible') ||
    userAvail.length === 0 ||
    candAvail.length === 0
  ) {
    // Generous default if flexible or not specified
    availabilityScore = 12;
  } else if (sharedAvailability.length > 0) {
    availabilityScore = Math.min(15, sharedAvailability.length * 6 + 6);
  } else {
    availabilityScore = 4; // Partial credit for differing schedules that can be negotiated
  }

  // 3. Shared Interests (Max 10 points)
  const userInterests = user.interests || [];
  const candInterests = candidate.interests || [];
  const sharedInterests = userInterests.filter((interest) =>
    candInterests.some((cInterest) => cInterest.toLowerCase() === interest.toLowerCase())
  );

  let interestsScore = 0;
  if (sharedInterests.length > 0) {
    interestsScore = Math.min(10, sharedInterests.length * 4);
  } else if (userInterests.length === 0 || candInterests.length === 0) {
    interestsScore = 6; // neutral if unpopulated
  } else {
    interestsScore = 3;
  }

  // 4. Language Compatibility (Max 5 points)
  const userLangs = user.languages || ['English'];
  const candLangs = candidate.languages || ['English'];
  const sharedLanguages = userLangs.filter((lang) =>
    candLangs.some((cLang) => cLang.toLowerCase() === lang.toLowerCase())
  );

  let languageScore = 0;
  if (sharedLanguages.length > 0) {
    languageScore = 5;
  } else {
    languageScore = 1;
  }

  const rawTotal =
    reciprocalSkillScore + availabilityScore + interestsScore + languageScore;
  const totalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  // Generate clear human-friendly explanation
  let explanation = '';
  if (isReciprocal) {
    explanation = `High 2-way match! You can teach ${candidate.fullName.split(' ')[0]} ${youCanTeachThem.join(
      ', '
    )} and in return they can teach you ${theyCanTeachYou.join(', ')}.`;
  } else if (youCanTeachThem.length > 0) {
    explanation = `Mentorship match: You can teach ${candidate.fullName.split(' ')[0]} ${youCanTeachThem.join(
      ', '
    )} which they actively want to learn.`;
  } else if (theyCanTeachYou.length > 0) {
    explanation = `Learning match: ${candidate.fullName.split(' ')[0]} can teach you ${theyCanTeachYou.join(
      ', '
    )} which is on your wishlist.`;
  } else {
    explanation = `Shared academic interests in ${
      sharedInterests[0] || candidate.department
    }. Explore cross-disciplinary learning!`;
  }

  if (sharedAvailability.length > 0) {
    explanation += ` Compatible hours: ${sharedAvailability.slice(0, 2).join(', ')}.`;
  }

  return {
    reciprocalSkillScore: Math.round(reciprocalSkillScore),
    availabilityScore: Math.round(availabilityScore),
    interestsScore: Math.round(interestsScore),
    languageScore: Math.round(languageScore),
    totalScore,
    youCanTeachThem,
    theyCanTeachYou,
    sharedAvailability,
    sharedInterests,
    sharedLanguages,
    explanation,
    isReciprocal,
  };
}

/**
 * Common skill dictionary for suggestions and tag autocomplete
 */
export const POPULAR_SKILLS = [
  { name: 'Python', category: 'Programming' },
  { name: 'Java', category: 'Programming' },
  { name: 'C', category: 'Programming' },
  { name: 'C++', category: 'Programming' },
  { name: 'JavaScript', category: 'Web Development' },
  { name: 'TypeScript', category: 'Web Development' },
  { name: 'React', category: 'Web Development' },
  { name: 'HTML & CSS', category: 'Web Development' },
  { name: 'Tailwind CSS', category: 'Web Development' },
  { name: 'UI/UX Design', category: 'Design' },
  { name: 'Figma', category: 'Design' },
  { name: 'Data Structures & Algorithms', category: 'Computer Science' },
  { name: 'Machine Learning', category: 'AI & Data Science' },
  { name: 'Deep Learning', category: 'AI & Data Science' },
  { name: 'SQL', category: 'Databases' },
  { name: 'PostgreSQL', category: 'Databases' },
  { name: 'Graphic Design', category: 'Design' },
  { name: 'Public Speaking', category: 'Communication & Soft Skills' },
  { name: 'Technical Communication', category: 'Communication & Soft Skills' },
  { name: 'Video Editing', category: 'Content & Media' },
  { name: 'Linux & Bash', category: 'Systems & DevOps' },
  { name: 'Docker', category: 'DevOps' },
  { name: 'Cybersecurity Basics', category: 'Security' },
  { name: 'Git & GitHub', category: 'Tools' },
];

export const AVAILABILITY_OPTIONS = [
  'Weekday Mornings',
  'Weekday Afternoons',
  'Weekday Evenings',
  'Weekend Mornings',
  'Weekend Afternoons',
  'Weekend Evenings',
  'Flexible',
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Mandarin',
  'Japanese',
  'Telugu',
  'Tamil',
  'Bengali',
];

export const INTEREST_OPTIONS = [
  'Open Source',
  'Hackathons',
  'Competitive Programming',
  'Web3 & Crypto',
  'AI Research',
  'Startups & Entrepreneurship',
  'Product Design',
  'Mobile Apps',
  'Game Development',
  'Robotics',
  'Coffee & Code',
];
