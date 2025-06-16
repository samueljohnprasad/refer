# 📝 Backend Tasks — ReferNet (Node.js + TypeScript)

## Phase 1 (MVP)

### 1. Authentication & User System
- [ ] Auth endpoints (email, phone/OTP, WhatsApp)
    - [ ] Design user schema/model
    - [ ] Implement email/password signup
    - [ ] Implement email/password login
    - [ ] Implement company email verification logic
    - [ ] Implement phone/OTP signup
    - [ ] Integrate WhatsApp signup (placeholder)
    - [ ] Implement JWT token generation
    - [ ] Implement JWT token validation middleware
    - [ ] Write unit tests for auth endpoints
    - [ ] Document API endpoints for auth
- [ ] User roles management API
    - [ ] Add role field to user model
    - [ ] Implement endpoint to set/switch user role
    - [ ] Implement endpoint to fetch user role
    - [ ] Add role-based access middleware
    - [ ] Write unit tests for role management
- [ ] Profile privacy settings API
    - [ ] Add privacy settings to user model
    - [ ] Implement update privacy settings endpoint
    - [ ] Implement fetch privacy settings endpoint
    - [ ] Write unit tests for privacy settings
- [ ] Company email verification logic
    - [ ] Send verification email to company domain
    - [ ] Implement verification token logic
    - [ ] Add verified badge to user upon verification
    - [ ] Write tests for verification logic
- [ ] Badge assignment logic
    - [ ] Define badge types (Verified Employee, Seeker, Super Referrer)
    - [ ] Implement badge assignment function
    - [ ] Implement endpoint to fetch badges
    - [ ] Write tests for badge logic

### 2. Resume & Profile
- [ ] Resume upload endpoint (integrate S3/Cloudinary)
    - [ ] Configure S3/Cloudinary SDK
    - [ ] Implement file upload endpoint
    - [ ] Validate file type/size
    - [ ] Store resume URL in user profile
    - [ ] Write tests for upload endpoint
- [ ] Resume builder endpoint (basic placeholder)
    - [ ] Define resume builder data structure
    - [ ] Implement create/update resume builder endpoint
    - [ ] Implement fetch resume builder data endpoint
    - [ ] Write tests for resume builder endpoints
- [ ] Profile CRUD endpoints
    - [ ] Implement create profile endpoint
    - [ ] Implement fetch profile endpoint
    - [ ] Implement update profile endpoint
    - [ ] Implement delete profile endpoint
    - [ ] Write tests for profile CRUD

### 3. Job & Referral Posts
- [ ] Job seeker post CRUD endpoints
    - [ ] Define job seeker post schema
    - [ ] Implement create post endpoint
    - [ ] Implement fetch posts endpoint
    - [ ] Implement update post endpoint
    - [ ] Implement delete post endpoint
    - [ ] Write tests for job seeker post endpoints
- [ ] Referrer post CRUD endpoints
    - [ ] Define referrer post schema
    - [ ] Implement create referrer post endpoint
    - [ ] Implement fetch referrer posts endpoint
    - [ ] Implement update referrer post endpoint
    - [ ] Implement delete referrer post endpoint
    - [ ] Write tests for referrer post endpoints
- [ ] Post auto-expiration logic
    - [ ] Add expiration field to post schema
    - [ ] Implement scheduled job to expire posts
    - [ ] Write tests for expiration logic
- [ ] Post privacy controls
    - [ ] Add privacy field to post schema
    - [ ] Enforce privacy in fetch endpoints
    - [ ] Write tests for privacy controls

### 4. Public Viewing
- [ ] Public posts endpoint
    - [ ] Implement endpoint to fetch public posts
    - [ ] Filter by privacy settings
    - [ ] Write tests for public posts endpoint
- [ ] Public profile endpoint
    - [ ] Implement endpoint to fetch public profiles
    - [ ] Filter by profile privacy
    - [ ] Write tests for public profile endpoint

### 5. Chat System
- [ ] Chat backend (Socket.io or similar)
    - [ ] Set up Socket.io server
    - [ ] Implement chat room creation on referral acceptance
    - [ ] Implement message send/receive events
    - [ ] Store chat messages in DB
    - [ ] Write tests for chat events
- [ ] Chat history per referral
    - [ ] Implement fetch chat history endpoint
    - [ ] Filter chat by referral ID
    - [ ] Write tests for chat history

### 6. Notifications
- [ ] Notification service (email only, MVP)
    - [ ] Integrate email service (e.g., Nodemailer)
    - [ ] Implement notification send function
    - [ ] Trigger notifications on status changes
    - [ ] Write tests for notification service
- [ ] Notification settings API
    - [ ] Add notification settings to user model
    - [ ] Implement update notification settings endpoint
    - [ ] Implement fetch notification settings endpoint
    - [ ] Write tests for notification settings

### 7. Company Profiles
- [ ] Company profile endpoints
    - [ ] Define company profile schema
    - [ ] Implement create company profile endpoint
    - [ ] Implement fetch company profile endpoint
    - [ ] Implement update company profile endpoint
    - [ ] Write tests for company profile endpoints

### 8. Content Moderation
- [ ] Basic moderation filter (block memes, video, NSFW)
    - [ ] Integrate basic content filter (e.g., file type, keywords)
    - [ ] Block uploads of images/videos in posts
    - [ ] Block NSFW content (placeholder for ML)
    - [ ] Write tests for moderation filter
- [ ] Manual flag/report endpoint
    - [ ] Implement flag/report endpoint
    - [ ] Store flags/reports in DB
    - [ ] Implement admin review logic (placeholder)
    - [ ] Write tests for flag/report endpoint

### 9. General
- [ ] Database schema & migrations
    - [ ] Design initial DB schema (users, posts, chat, etc.)
    - [ ] Write migration scripts
    - [ ] Run migrations in dev/test environments
- [ ] Seed scripts for roles, badges
    - [ ] Write seed script for user roles
    - [ ] Write seed script for badges
    - [ ] Test seed scripts
- [ ] Error handling and logging
    - [ ] Set up error handling middleware
    - [ ] Integrate logging library (e.g., Winston)
    - [ ] Write tests for error scenarios

---

## How to use
- Check off tasks as completed.
- Add notes/dates next to each item as needed.
