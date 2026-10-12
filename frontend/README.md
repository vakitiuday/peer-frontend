# Peer Skill Exchange Platform

A collaborative peer-to-peer knowledge sharing and intelligent skill matching web application built for university student communities.

---

## 1. Project Overview

Students frequently possess strong mastery in specific topics (e.g., Python algorithms, systems scripting, or data structures) while seeking to learn complementary skills (e.g., UI/UX design, Figma, or frontend development). 

**Peer Skill Exchange Platform** bridges this gap by cross-analyzing students' **Skills to Teach** against other students' **Skills to Learn** to identify optimal reciprocal exchange opportunities.

### Key Example:
- **Ananya Sharma** teaches *Python & Data Structures* and wants to learn *UI/UX Design*.
- **Rahul Verma** teaches *UI/UX Design & Figma* and wants to learn *Python*.
- The system calculates a **96% Reciprocal Match** and provides a one-click connection and scheduling workflow.

---

## 2. Core Features

1. **Interactive Profile Management**:
   - Academic details (College, Department, Year, Bio, Languages, Availability slots).
   - Dynamic skill manager with proficiency tiers (*Beginner*, *Intermediate*, *Advanced*, *Expert*) for teaching skills, and priority tiers (*High*, *Medium*, *Low*) for learning skills.
   - Popular skill taxonomies + custom skill input.

2. **Intelligent Complementary Matching Engine**:
   - Transparent, weighted algorithmic scoring model:
     - **Reciprocal Skill Compatibility: 70%** (bidirectional teaching & learning overlap)
     - **Availability Compatibility: 15%** (intersection of active schedules or flexible hours)
     - **Shared Academic/Tech Interests: 10%** (hackathons, open source, AI research, product design)
     - **Language Compatibility: 5%** (shared language of instruction)
   - Real-time recalculation upon profile edits.
   - Filter by minimum compatibility, skills, college, and 2-way reciprocal toggle.

3. **Discover Peers**:
   - Multi-field search across student names, colleges, departments, and skill names.
   - Sorting by Compatibility Match, Highest Rating (★), or Most Completed Sessions.

4. **Connection Requests Workflow**:
   - Send requests with personalized notes and proposed skill exchanges.
   - Incoming and outgoing request queues.
   - Status transitions: `pending`, `accepted`, `rejected`, `cancelled`.
   - Notifications dispatched on events.

5. **Learning Session Scheduling**:
   - Propose sessions between connected study partners.
   - Configure Topic, Direction (You teach them vs. They teach you), Date, Time, Duration (30, 45, 60, 90 mins).
   - Meeting link generation (Google Meet, Zoom, Microsoft Teams, Campus In-Person).
   - Session status tracking (`proposed`, `confirmed`, `completed`, `declined`, `cancelled`).

6. **Messaging & Real-time Chat**:
   - In-app text chat exclusively between accepted connections.
   - Message timestamps, delivery ticks, unread indicators, and quick meeting coordination shortcuts.

7. **Peer Evaluations & Star Reviews**:
   - 1-to-5 star rating and written reviews after completed learning sessions.
   - Predefined constructive skill highlight tags (*Patient Mentor*, *Clear Explanations*, *Well Prepared*, *Hands-on Guidance*).
   - Dynamic aggregation of average ratings and total review counts on student profiles.

8. **In-App Notifications**:
   - Real-time alerts for incoming requests, accepted partnerships, proposed sessions, confirmed meetings, and new reviews.

9. **Dual-Mode Backend Support**:
   - **Interactive Demo Mode (Default)**: Preloaded with 8 realistic student personas with complementary skill pairs.
   - **Production Firebase Mode**: Fully supported with `firestore.rules` and configuration UI.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Icons & Motion**: Lucide React, Motion
- **Database & Auth (Dual-Mode)**: Cloud Firestore & Firebase Auth + LocalStorage Persistence
- **Celebration Effects**: Canvas Confetti

---

## 4. Pre-Seeded Student Personas (Demo Accounts)

You can easily switch between any of the following 8 personas via the **"Active Persona"** dropdown in the top navigation bar:

1. **Ananya Sharma** (Default User) — Teaches *Python, DSA, Git*; Learns *UI/UX Design, Figma*.
2. **Rahul Verma** — Teaches *UI/UX Design, Figma, Graphic Design*; Learns *Python, DSA*. (Reciprocal with Ananya: 96%)
3. **Priya Patel** — Teaches *Java, SQL, Git*; Learns *React, Tailwind CSS, TypeScript*.
4. **Arjun Mehta** — Teaches *React, Tailwind CSS, JavaScript*; Learns *Java, DSA*. (Reciprocal with Priya: 94%)
5. **Sneha Roy** — Teaches *SQL, PostgreSQL, DSA*; Learns *Machine Learning, Python*.
6. **Kiran Nair** — Teaches *Machine Learning, Python*; Learns *SQL, PostgreSQL*. (Reciprocal with Sneha: 95%)
7. **David Chen** — Teaches *Linux & Bash, Cybersecurity, Docker*; Learns *Public Speaking*.
8. **Elena Gomez** — Teaches *Public Speaking, Communication, Video Editing*; Learns *Linux & Bash*. (Reciprocal with David: 92%)

---

## 5. Local Setup & Running Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server on port 3000:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

---

## 6. Firebase Configuration

To connect a live Firebase project, provide the credentials in `.env` or in the **Architecture & Settings** tab:

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="peer-skill-exchange.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="peer-skill-exchange"
VITE_FIREBASE_STORAGE_BUCKET="peer-skill-exchange.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

Security rules are pre-configured in `firestore.rules`.
