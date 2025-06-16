# 📄 Product Requirements Document (PRD)

## 📌 Product Name

ReferNet (placeholder)

## 🧑‍💼 Owner

Samuel Prasad  
**Date**: June 15, 2025  
**Version**: 1.s

---

## 🎯 Objective

Build a **community-driven job referral platform** enabling seamless interaction between **job seekers** and **referrers**, with public visibility, robust trust and verification systems, referral analytics, and privacy controls.

---

## 🧑‍🤝‍🧑 Target Users

- **Job Seekers** (students, professionals)
- **Job Referrers** (employees at companies)
- **Companies** (for branding/advertising)
- **Recruiters**
- **Visitors** (non-registered users)

---

## 🔑 Key Features

### A. User System

#### 1. Authentication & Verification

- Login/Signup via Email (Company/Personal), Phone (OTP), or WhatsApp
- Company email triggers **verified badge**
- Badge system: Verified Employee, Verified Seeker, Super Referrer
- Easy sign-up flow with role selection (Job Seeker, Referrer, Both)

#### 2. User Roles

- Users can switch or hold dual roles
- Profile privacy settings
- Resume upload, builder, and visibility control

---

### B. Job & Referral Posts

#### 1. Job Seeker Posts

- Resume + interest statement (auto-template support)
- Privacy: Public, Private, Anonymous
- Auto-expiration (default 6 months, adjustable)

#### 2. Referrer Posts

- Company-tagged
- Resume approval/rejection before referral
- Status: Applied, Accepted, Pending
- Restriction: Must match company of email OR validated link domain match

#### 3. Public Viewing

- Non-logged-in users can view posts, profiles (if public)

#### 4. Post Moderation

- ML-based filter (blocks memes, video content, NSFW)
- Manual flag & review
- Allow only resume or verified doc format

---

### C. Referral System

#### 1. Workflow

- Job seekers request referral from post
- Referrer can accept/reject
- On acceptance → chat opens
- Status tracking per candidate: Applied → Accepted → Referred → Hired

#### 2. Referrer Dashboard

- Track referral requests, statuses
- Success metrics
- Referral history + conversion rates

#### 3. Success Stories

- Share success publicly
- User acknowledgment & badge rewards

---

### D. Content & Community

- Chat System (real-time, auto-enabled upon referral)
- Follower System
- Group Discussions (private/public)
- Feedback Section

---

### E. Profile & Resume Tools

- Resume builder with export (PDF)
- Upload resume with parsing and skill extraction
- Public profile link with visibility settings

---

### F. Search & Discovery

- Company pages (referral feed, active openings)
- Search/filter by:
  - Role
  - Referrer
  - Company
  - Verified-only
- Resume matching engine for seekers

---

### G. Notifications

- Email, SMS, WhatsApp toggleable
- Notification Types:
  - Referral status change
  - Chat messages
  - New job matches
  - Platform updates

---

### H. Analytics & Insights

- Personalized profile stats: "X% more profile views"
- Industry hiring trends dashboard
- Job application success ratios
- Resume vs post match %s

---

### I. Security & Trust

- Company email or LinkedIn validation for posters
- Resume doc validation
- Fake content/posting detection (AI + community flagging)
- Role-based access
- Anonymous posting option

---

### J. Monetization (Phase 2)

- Ad section for companies
- Featured job postings
- Premium analytics access for companies/recruiters
- Referral monetization (token/credits system)

---

## 🧱 Tech Stack

| Component      | Stack                         |
| -------------- | ----------------------------- |
| Frontend       | React (Vite, TypeScript)      |
| Backend        | Node.js (TypeScript)          |
| Database       | MongoDB                       |
| Auth           | simple one                    |
| File Upload    | AWS S3 / Cloudinary           |
| Notification   | Twilio, WhatsApp, Email APIs  |
| Real-Time Chat | Socket.io                     |

---

## 🚦 Milestones / Phases

### Phase 1 (MVP)

- User Roles + Auth + Resume Upload
- Job Seeker + Referrer Posting
- Basic Referral Workflow + Chat
- Public Post Viewing
- Content Moderation (Basic)
- Notifications (Email only)
- Company profile pages

### Phase 2

- Referrer Dashboard + Metrics
- Resume Builder
- Search/Filtering
- Success Stories
- Profile Statistics
- Chat Enhancements

### Phase 3

- Ads + Monetization
- WhatsApp + SMS Alerts
- Smart Matching + AI Trends
- Fraud Detection
- Group Discussions
- Premium Features + Analytics

---

## 📊 KPIs

- # of Referrals initiated & accepted
- % of job posts leading to referral
- Post-to-hire conversion rate
- Daily/Monthly Active Users
- Resume uploads per user
- Referral success stories posted

---

## ⚠️ Risks & Mitigation

| Risk                    | Mitigation                                   |
| ----------------------- | -------------------------------------------- |
| Fake job/referral posts | Email verification, moderation AI, reporting |
| Privacy issues          | Strong privacy settings, GDPR-compliant      |
| Spam/chat abuse         | Rate limits, reporting system, badges        |
| Low initial engagement  | Beta user seeding, early referrer incentives |

---

## ❓ Open Questions

- Should there be incentives for successful referrers?
- What is the moderation escalation flow (community/mod/admin)?
- Will anonymous referrals be allowed with verified tracking?

---

## 💡 Future Enhancements

- **Mentorship Matching**
- **Smart Referrer Suggestions**
- **Recognition Badges for Referrers**
- **Alumni Network Tagging**
- **B2B Company Partnerships**
- **Compensation Model for Referrers**
