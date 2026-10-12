# Peer Skill Exchange Platform - Backend & Firebase Architecture

## Overview
The **Peer Skill Exchange Platform** features a dual-mode backend architecture:
1. **Interactive Demo Mode (Default)**: Preloaded with 8+ rich student personas with complementary skill pairs (Ananya & Rahul, Priya & Arjun, Sneha & Kiran, David & Elena), persistent in browser storage with instant persona switching.
2. **Production Firebase Mode**: Direct connection to Firebase Authentication and Cloud Firestore using strict security rules and collections.

---

## Firestore Database Collections & Schemas

### 1. `students` (Profiles)
- `id`: string (Firebase Auth UID)
- `email`: string
- `fullName`: string
- `avatarUrl`: string
- `college`: string
- `department`: string
- `year`: string ("1st Year" | "2nd Year" | "3rd Year" | "4th Year" | "Postgraduate")
- `bio`: string
- `teachingSkills`: Array<{ id, name, category, level, description }>
- `learningSkills`: Array<{ id, name, category, priority, description }>
- `languages`: Array<string>
- `availability`: Array<string> (e.g., "Weekend Mornings", "Weekday Evenings")
- `interests`: Array<string>
- `averageRating`: number (1.0 to 5.0)
- `totalReviews`: number
- `completedSessionsCount`: number
- `createdAt`: ISO 8601 string
- `updatedAt`: ISO 8601 string

### 2. `connectionRequests`
- `id`: string
- `senderId`: string (UID)
- `receiverId`: string (UID)
- `note`: string
- `proposedSkillExchange`: { teachSkill: string, learnSkill: string }
- `status`: "pending" | "accepted" | "rejected" | "cancelled"
- `createdAt`: ISO 8601 string
- `updatedAt`: ISO 8601 string

### 3. `connections`
- `id`: string
- `userIds`: [string, string]
- `connectedAt`: ISO 8601 string

### 4. `sessions` (Learning Sessions)
- `id`: string
- `connectionId`: string
- `requesterId`: string
- `partnerId`: string
- `topicSkill`: string
- `direction`: "requester_teaching" | "requester_learning"
- `scheduledDate`: string (YYYY-MM-DD)
- `startTime`: string (HH:MM)
- `durationMinutes`: number (30 | 45 | 60 | 90)
- `meetingPlatform`: "Google Meet" | "Zoom" | "Microsoft Teams" | "Campus In-Person"
- `meetingLink`: string
- `agenda`: string
- `status`: "proposed" | "confirmed" | "completed" | "declined" | "cancelled"
- `notes`: string
- `reviewedByRequester`: boolean
- `reviewedByPartner`: boolean
- `createdAt`: ISO 8601 string
- `updatedAt`: ISO 8601 string

### 5. `messages`
- `id`: string
- `conversationId`: string (`uidA_uidB` sorted)
- `senderId`: string
- `receiverId`: string
- `text`: string
- `timestamp`: ISO 8601 string
- `read`: boolean

### 6. `reviews`
- `id`: string
- `sessionId`: string
- `reviewerId`: string
- `revieweeId`: string
- `rating`: number (1 to 5)
- `feedback`: string
- `tags`: Array<string>
- `topicSkill`: string
- `createdAt`: ISO 8601 string

### 7. `notifications`
- `id`: string
- `userId`: string
- `actorId`: string
- `type`: "connection_request" | "connection_accepted" | "session_proposed" | "session_confirmed" | "session_completed" | "new_message" | "new_review"
- `title`: string
- `message`: string
- `linkTab`: string
- `linkId`: string
- `read`: boolean
- `createdAt`: ISO 8601 string

---

## Recommended Firestore Indexes

For optimal querying at scale, configure the following composite indexes in Firebase Console:

1. **`connectionRequests`**
   - Fields: `receiverId` (ASC), `status` (ASC), `createdAt` (DESC)
   - Fields: `senderId` (ASC), `status` (ASC), `createdAt` (DESC)

2. **`sessions`**
   - Fields: `requesterId` (ASC), `status` (ASC), `scheduledDate` (ASC)
   - Fields: `partnerId` (ASC), `status` (ASC), `scheduledDate` (ASC)

3. **`messages`**
   - Fields: `conversationId` (ASC), `timestamp` (ASC)

4. **`reviews`**
   - Fields: `revieweeId` (ASC), `createdAt` (DESC)

---

## Connecting Live Firebase in AI Studio / Production

Add the following environment variables in `.env` or enter them inside the **Settings & Firebase** tab in the platform UI:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```
