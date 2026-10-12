export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillPriority = 'High' | 'Medium' | 'Low';

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level?: SkillLevel; // for teaching skills
  priority?: SkillPriority; // for learning skills
  description?: string;
}

export interface StudentProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  college: string;
  department: string;
  year: string;
  bio: string;
  teachingSkills: SkillItem[];
  learningSkills: SkillItem[];
  languages: string[];
  availability: string[];
  interests: string[];
  averageRating: number;
  totalReviews: number;
  completedSessionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatchScoreBreakdown {
  reciprocalSkillScore: number; // max 70
  availabilityScore: number;    // max 15
  interestsScore: number;       // max 10
  languageScore: number;        // max 5
  totalScore: number;           // max 100
  youCanTeachThem: string[];
  theyCanTeachYou: string[];
  sharedAvailability: string[];
  sharedInterests: string[];
  sharedLanguages: string[];
  explanation: string;
  isReciprocal: boolean;
}

export interface MatchResult {
  student: StudentProfile;
  match: MatchScoreBreakdown;
  connectionStatus: 'none' | 'pending_sent' | 'pending_received' | 'connected';
  requestId?: string;
  connectionId?: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  note: string;
  proposedSkillExchange?: {
    teachSkill: string;
    learnSkill: string;
  };
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Connection {
  id: string;
  userIds: [string, string];
  connectedAt: string;
}

export type SessionStatus = 'proposed' | 'confirmed' | 'completed' | 'declined' | 'cancelled';
export type MeetingPlatform = 'Google Meet' | 'Zoom' | 'Microsoft Teams' | 'Campus In-Person';

export interface LearningSession {
  id: string;
  connectionId: string;
  requesterId: string;
  partnerId: string;
  topicSkill: string;
  direction: 'requester_teaching' | 'requester_learning';
  scheduledDate: string; // YYYY-MM-DD
  startTime: string;     // HH:MM (24h)
  durationMinutes: number; // e.g. 45, 60
  meetingPlatform: MeetingPlatform;
  meetingLink: string;
  agenda: string;
  status: SessionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reviewedByRequester?: boolean;
  reviewedByPartner?: boolean;
}

export interface Review {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number; // 1 to 5
  feedback: string;
  tags: string[];
  topicSkill: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string; // sorted participant ids: minId_maxId
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'session_proposed'
  | 'session_confirmed'
  | 'session_completed'
  | 'new_message'
  | 'new_review';

export interface NotificationItem {
  id: string;
  userId: string;
  actorId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTab?: string;
  linkId?: string;
  read: boolean;
  createdAt: string;
}

export interface FirebaseConfigState {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  isConfigured: boolean;
}
