import {
  StudentProfile,
  ConnectionRequest,
  Connection,
  LearningSession,
  Review,
  ChatMessage,
  NotificationItem,
  SkillItem,
  FirebaseConfigState,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_CONNECTIONS,
  INITIAL_REQUESTS,
  INITIAL_SESSIONS,
  INITIAL_REVIEWS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
} from '../data/demoData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'psep_current_user_id',
  STUDENTS: 'psep_students',
  CONNECTIONS: 'psep_connections',
  REQUESTS: 'psep_requests',
  SESSIONS: 'psep_sessions',
  REVIEWS: 'psep_reviews',
  MESSAGES: 'psep_messages',
  NOTIFICATIONS: 'psep_notifications',
  FIREBASE_CONFIG: 'psep_firebase_config',
};

// Safe local storage helpers
function getItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

export class StorageService {
  // Current user state
  static getCurrentUserId(): string {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!saved) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-ananya');
      return 'user-ananya';
    }
    return saved;
  }

  static setCurrentUserId(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Students
  static getStudents(): StudentProfile[] {
    const students = getItem<StudentProfile[]>(STORAGE_KEYS.STUDENTS, []);
    if (!students || students.length === 0) {
      setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
      return INITIAL_STUDENTS;
    }
    return students;
  }

  static getStudentById(id: string): StudentProfile | undefined {
    return this.getStudents().find((s) => s.id === id);
  }

  static getCurrentUser(): StudentProfile {
    const currentId = this.getCurrentUserId();
    const students = this.getStudents();
    const found = students.find((s) => s.id === currentId);
    if (found) return found;
    // Fallback to first student or default
    return students[0] || INITIAL_STUDENTS[0];
  }

  static updateStudentProfile(userId: string, updates: Partial<StudentProfile>): StudentProfile {
    const students = this.getStudents();
    const index = students.findIndex((s) => s.id === userId);
    if (index === -1) throw new Error('Student not found');

    const updated: StudentProfile = {
      ...students[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    students[index] = updated;
    setItem(STORAGE_KEYS.STUDENTS, students);
    return updated;
  }

  static createStudent(profile: Omit<StudentProfile, 'id' | 'createdAt' | 'updatedAt' | 'averageRating' | 'totalReviews' | 'completedSessionsCount'>): StudentProfile {
    const students = this.getStudents();
    const newStudent: StudentProfile = {
      ...profile,
      id: `user-${Date.now()}`,
      averageRating: 5.0,
      totalReviews: 0,
      completedSessionsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    students.push(newStudent);
    setItem(STORAGE_KEYS.STUDENTS, students);
    return newStudent;
  }

  // Connections
  static getConnections(): Connection[] {
    const conns = getItem<Connection[]>(STORAGE_KEYS.CONNECTIONS, []);
    if (!conns || conns.length === 0) {
      setItem(STORAGE_KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
      return INITIAL_CONNECTIONS;
    }
    return conns;
  }

  static isConnected(userAId: string, userBId: string): boolean {
    const conns = this.getConnections();
    return conns.some(
      (c) =>
        (c.userIds[0] === userAId && c.userIds[1] === userBId) ||
        (c.userIds[0] === userBId && c.userIds[1] === userAId)
    );
  }

  static getConnectionId(userAId: string, userBId: string): string | undefined {
    const conns = this.getConnections();
    const match = conns.find(
      (c) =>
        (c.userIds[0] === userAId && c.userIds[1] === userBId) ||
        (c.userIds[0] === userBId && c.userIds[1] === userAId)
    );
    return match?.id;
  }

  static getUserConnections(userId: string): StudentProfile[] {
    const conns = this.getConnections();
    const userConns = conns.filter((c) => c.userIds.includes(userId));
    const students = this.getStudents();

    const partnerIds = userConns.map((c) =>
      c.userIds[0] === userId ? c.userIds[1] : c.userIds[0]
    );

    return students.filter((s) => partnerIds.includes(s.id));
  }

  // Connection Requests
  static getRequests(): ConnectionRequest[] {
    const reqs = getItem<ConnectionRequest[]>(STORAGE_KEYS.REQUESTS, []);
    if (!reqs || reqs.length === 0) {
      setItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
      return INITIAL_REQUESTS;
    }
    return reqs;
  }

  static sendConnectionRequest(
    senderId: string,
    receiverId: string,
    note: string,
    proposedSkillExchange?: { teachSkill: string; learnSkill: string }
  ): ConnectionRequest {
    if (senderId === receiverId) {
      throw new Error('You cannot send a connection request to yourself.');
    }
    if (this.isConnected(senderId, receiverId)) {
      throw new Error('You are already connected with this student.');
    }

    const requests = this.getRequests();
    // Check if existing pending
    const existing = requests.find(
      (r) =>
        ((r.senderId === senderId && r.receiverId === receiverId) ||
          (r.senderId === receiverId && r.receiverId === senderId)) &&
        r.status === 'pending'
    );

    if (existing) {
      throw new Error('A connection request is already pending between you.');
    }

    const newRequest: ConnectionRequest = {
      id: `req-${Date.now()}`,
      senderId,
      receiverId,
      note: note.trim() || 'Hi! Let us connect and exchange skills on Peer Skill Exchange Platform.',
      proposedSkillExchange,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    setItem(STORAGE_KEYS.REQUESTS, requests);

    // Notify receiver
    const sender = this.getStudentById(senderId);
    this.createNotification({
      userId: receiverId,
      actorId: senderId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${sender?.fullName || 'A student'} sent you a connection request.`,
      linkTab: 'requests',
      linkId: newRequest.id,
    });

    return newRequest;
  }

  static acceptConnectionRequest(requestId: string): void {
    const requests = this.getRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    const req = requests[reqIndex];
    if (req.status !== 'pending') throw new Error('Request is no longer pending');

    req.status = 'accepted';
    req.updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.REQUESTS, requests);

    // Add to connections
    const conns = this.getConnections();
    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      userIds: [req.senderId, req.receiverId],
      connectedAt: new Date().toISOString(),
    };
    conns.push(newConn);
    setItem(STORAGE_KEYS.CONNECTIONS, conns);

    // Notify sender
    const receiver = this.getStudentById(req.receiverId);
    this.createNotification({
      userId: req.senderId,
      actorId: req.receiverId,
      type: 'connection_accepted',
      title: 'Connection Accepted! 🎉',
      message: `${receiver?.fullName || 'A student'} accepted your connection request. You can now schedule sessions and chat!`,
      linkTab: 'connections',
      linkId: newConn.id,
    });
  }

  static rejectConnectionRequest(requestId: string): void {
    const requests = this.getRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    requests[reqIndex].status = 'rejected';
    requests[reqIndex].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.REQUESTS, requests);
  }

  static cancelConnectionRequest(requestId: string): void {
    const requests = this.getRequests();
    const reqIndex = requests.findIndex((r) => r.id === requestId);
    if (reqIndex === -1) throw new Error('Request not found');

    requests[reqIndex].status = 'cancelled';
    requests[reqIndex].updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.REQUESTS, requests);
  }

  // Learning Sessions
  static getSessions(): LearningSession[] {
    const sessions = getItem<LearningSession[]>(STORAGE_KEYS.SESSIONS, []);
    if (!sessions || sessions.length === 0) {
      setItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
      return INITIAL_SESSIONS;
    }
    return sessions;
  }

  static proposeSession(sessionData: Omit<LearningSession, 'id' | 'status' | 'createdAt' | 'updatedAt'>): LearningSession {
    const sessions = this.getSessions();
    const newSession: LearningSession = {
      ...sessionData,
      id: `sess-${Date.now()}`,
      status: 'proposed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    sessions.unshift(newSession);
    setItem(STORAGE_KEYS.SESSIONS, sessions);

    // Notify partner
    const requester = this.getStudentById(sessionData.requesterId);
    this.createNotification({
      userId: sessionData.partnerId,
      actorId: sessionData.requesterId,
      type: 'session_proposed',
      title: 'New Session Proposal',
      message: `${requester?.fullName || 'Your peer'} proposed a learning session on "${sessionData.topicSkill}".`,
      linkTab: 'sessions',
      linkId: newSession.id,
    });

    return newSession;
  }

  static updateSessionStatus(sessionId: string, status: LearningSession['status']): void {
    const sessions = this.getSessions();
    const index = sessions.findIndex((s) => s.id === sessionId);
    if (index === -1) throw new Error('Session not found');

    const session = sessions[index];
    session.status = status;
    session.updatedAt = new Date().toISOString();

    setItem(STORAGE_KEYS.SESSIONS, sessions);

    if (status === 'confirmed') {
      const currentUserId = this.getCurrentUserId();
      const otherUserId = session.requesterId === currentUserId ? session.partnerId : session.requesterId;
      const user = this.getStudentById(currentUserId);

      this.createNotification({
        userId: otherUserId,
        actorId: currentUserId,
        type: 'session_confirmed',
        title: 'Session Confirmed!',
        message: `${user?.fullName || 'Your peer'} confirmed the session on "${session.topicSkill}".`,
        linkTab: 'sessions',
        linkId: session.id,
      });
    }

    if (status === 'completed') {
      // Increment completed sessions count for both participants
      const students = this.getStudents();
      [session.requesterId, session.partnerId].forEach((uid) => {
        const sIdx = students.findIndex((s) => s.id === uid);
        if (sIdx !== -1) {
          students[sIdx].completedSessionsCount = (students[sIdx].completedSessionsCount || 0) + 1;
        }
      });
      setItem(STORAGE_KEYS.STUDENTS, students);

      // Notify both about review availability
      this.createNotification({
        userId: session.requesterId,
        actorId: session.partnerId,
        type: 'session_completed',
        title: 'Session Marked Completed! ⭐',
        message: `Please share feedback and rate your session on "${session.topicSkill}".`,
        linkTab: 'sessions',
        linkId: session.id,
      });
      this.createNotification({
        userId: session.partnerId,
        actorId: session.requesterId,
        type: 'session_completed',
        title: 'Session Marked Completed! ⭐',
        message: `Please share feedback and rate your session on "${session.topicSkill}".`,
        linkTab: 'sessions',
        linkId: session.id,
      });
    }
  }

  // Reviews
  static getReviews(): Review[] {
    const reviews = getItem<Review[]>(STORAGE_KEYS.REVIEWS, []);
    if (!reviews || reviews.length === 0) {
      setItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
      return INITIAL_REVIEWS;
    }
    return reviews;
  }

  static submitReview(
    sessionId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    feedback: string,
    tags: string[],
    topicSkill: string
  ): Review {
    const reviews = this.getReviews();

    // Check if already reviewed for this session
    const existing = reviews.find(
      (r) => r.sessionId === sessionId && r.reviewerId === reviewerId
    );
    if (existing) {
      throw new Error('You have already submitted a review for this session.');
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      sessionId,
      reviewerId,
      revieweeId,
      rating: Math.min(5, Math.max(1, rating)),
      feedback: feedback.trim(),
      tags,
      topicSkill,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    setItem(STORAGE_KEYS.REVIEWS, reviews);

    // Update review flag on session
    const sessions = this.getSessions();
    const sessIdx = sessions.findIndex((s) => s.id === sessionId);
    if (sessIdx !== -1) {
      if (sessions[sessIdx].requesterId === reviewerId) {
        sessions[sessIdx].reviewedByRequester = true;
      } else {
        sessions[sessIdx].reviewedByPartner = true;
      }
      setItem(STORAGE_KEYS.SESSIONS, sessions);
    }

    // Recalculate reviewee's average rating
    const revieweeReviews = reviews.filter((r) => r.revieweeId === revieweeId);
    const sum = revieweeReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / revieweeReviews.length).toFixed(2));

    const students = this.getStudents();
    const stIndex = students.findIndex((s) => s.id === revieweeId);
    if (stIndex !== -1) {
      students[stIndex].averageRating = avg;
      students[stIndex].totalReviews = revieweeReviews.length;
      setItem(STORAGE_KEYS.STUDENTS, students);
    }

    // Send notification
    const reviewer = this.getStudentById(reviewerId);
    this.createNotification({
      userId: revieweeId,
      actorId: reviewerId,
      type: 'new_review',
      title: `New ${rating}-Star Review!`,
      message: `${reviewer?.fullName || 'Your peer'} left feedback for "${topicSkill}".`,
      linkTab: 'reviews',
      linkId: newReview.id,
    });

    return newReview;
  }

  // Messaging
  static getMessages(): ChatMessage[] {
    const msgs = getItem<ChatMessage[]>(STORAGE_KEYS.MESSAGES, []);
    if (!msgs || msgs.length === 0) {
      setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      return INITIAL_MESSAGES;
    }
    return msgs;
  }

  static getConversationId(userAId: string, userBId: string): string {
    return [userAId, userBId].sort().join('_');
  }

  static getMessagesForConversation(userAId: string, userBId: string): ChatMessage[] {
    const convId = this.getConversationId(userAId, userBId);
    return this.getMessages().filter((m) => m.conversationId === convId);
  }

  static sendMessage(senderId: string, receiverId: string, text: string): ChatMessage {
    const messages = this.getMessages();
    const convId = this.getConversationId(senderId, receiverId);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      senderId,
      receiverId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    messages.push(newMsg);
    setItem(STORAGE_KEYS.MESSAGES, messages);

    // Notify receiver
    const sender = this.getStudentById(senderId);
    this.createNotification({
      userId: receiverId,
      actorId: senderId,
      type: 'new_message',
      title: `Message from ${sender?.fullName || 'Peer'}`,
      message: text.length > 50 ? `${text.slice(0, 50)}...` : text,
      linkTab: 'messages',
      linkId: senderId,
    });

    return newMsg;
  }

  static markMessagesAsRead(currentUserId: string, partnerId: string): void {
    const messages = this.getMessages();
    const convId = this.getConversationId(currentUserId, partnerId);
    let changed = false;

    messages.forEach((m) => {
      if (m.conversationId === convId && m.receiverId === currentUserId && !m.read) {
        m.read = true;
        changed = true;
      }
    });

    if (changed) {
      setItem(STORAGE_KEYS.MESSAGES, messages);
    }
  }

  // Notifications
  static getNotifications(): NotificationItem[] {
    const notifs = getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    if (!notifs || notifs.length === 0) {
      setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return notifs;
  }

  static getUserNotifications(userId: string): NotificationItem[] {
    return this.getNotifications().filter((n) => n.userId === userId);
  }

  static createNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...data,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };

    notifs.unshift(newNotif);
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    return newNotif;
  }

  static markNotificationRead(notifId: string): void {
    const notifs = this.getNotifications();
    const idx = notifs.findIndex((n) => n.id === notifId);
    if (idx !== -1) {
      notifs[idx].read = true;
      setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  }

  static markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications();
    notifs.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  }

  // Firebase Configuration & Demo Mode
  static getFirebaseConfig(): FirebaseConfigState {
    const saved = getItem<FirebaseConfigState | null>(STORAGE_KEYS.FIREBASE_CONFIG, null);
    if (saved) return saved;

    return {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: '',
      isConfigured: false,
    };
  }

  static saveFirebaseConfig(config: FirebaseConfigState): void {
    setItem(STORAGE_KEYS.FIREBASE_CONFIG, config);
  }

  // Reset to full fresh demo state
  static resetToDemoData(): void {
    setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user-ananya');
    setItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
    setItem(STORAGE_KEYS.CONNECTIONS, INITIAL_CONNECTIONS);
    setItem(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    setItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    setItem(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    setItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
}
