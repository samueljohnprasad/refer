# 📝 Frontend Tasks — ReferNet (React + Vite + TypeScript)

## Phase 1 (MVP)

### 1. Authentication & User Roles
- [ ] Implement login/signup UI (email, phone/OTP, WhatsApp)
    - [ ] Design authentication page layout
    - [ ] Create email/password login form
    - [ ] Create email/password signup form
    - [ ] Add phone/OTP login/signup form
    - [ ] Add WhatsApp login/signup form (placeholder)
    - [ ] Implement form validation and error display
    - [ ] Integrate with backend auth API
    - [ ] Show loading and success/error states
    - [ ] Write unit tests for auth components
- [ ] Show verified badge in UI if company email used
    - [ ] Detect verified status from user profile API
    - [ ] Display badge in navbar/profile
    - [ ] Add tooltip/info for badge
- [ ] Profile privacy settings UI
    - [ ] Add privacy settings section to profile page
    - [ ] Implement toggle/switch for privacy options
    - [ ] Integrate with backend privacy API
    - [ ] Show current privacy status

### 2. Resume & Profile
- [ ] User Profile Implementation
    - [ ] Profile Page Layout
        - [ ] Design responsive profile page with header, info sections
        - [ ] Create profile header with avatar, name, and basic info
        - [ ] Add edit profile button and action menu
        - [ ] Implement tabbed interface for different profile sections
    - [ ] Personal Information Section
        - [ ] Display user's full name, email, phone
        - [ ] Show verified badge for company email
        - [ ] Add edit mode with form validation
        - [ ] Integrate with profile update API
    - [ ] Professional Details
        - [ ] Display current company and position
        - [ ] Show work experience timeline
        - [ ] Add education history
        - [ ] Include skills and endorsements section
    - [ ] Profile Completion
        - [ ] Add profile completion progress indicator
        - [ ] Show missing required fields
        - [ ] Add prompts to complete profile

- [ ] Resume Management
    - [ ] Resume upload form
        - [ ] Design resume upload UI with drag-and-drop
        - [ ] Support multiple file formats (PDF, DOCX)
        - [ ] Show upload progress and error handling
        - [ ] Integrate with backend upload endpoint
        - [ ] Display uploaded resume with preview option
    - [ ] Resume builder UI
        - [ ] Create multi-step resume builder form
        - [ ] Add sections for experience, education, skills
        - [ ] Include template selection
        - [ ] Add preview mode
        - [ ] Save draft functionality
        - [ ] Integrate with backend resume builder API

- [ ] Profile Settings
    - [ ] Privacy Settings
        - [ ] Add privacy controls for profile visibility
        - [ ] Implement toggle for public/private profile
        - [ ] Add option to hide specific sections
        - [ ] Integrate with backend privacy API
    - [ ] Notification Preferences
        - [ ] Add notification settings section
        - [ ] Include email notification toggles
        - [ ] Add in-app notification preferences
        - [ ] Save preferences to backend

- [ ] Profile View Modes
    - [ ] Edit Mode
        - [ ] Implement inline editing for profile fields
        - [ ] Add form validation
        - [ ] Show save/cancel buttons
        - [ ] Handle loading and error states
    - [ ] Public View
        - [ ] Design public profile layout
        - [ ] Hide private information based on privacy settings
        - [ ] Custom Profile URLs
            - [ ] Implement username-based URLs (refernet.com/username)
            - [ ] Add username validation and availability check
            - [ ] Create username setup/change flow
            - [ ] Handle legacy profile IDs for backward compatibility
        - [ ] Shareable Profile Links
            - [ ] Add copy link button with feedback
            - [ ] Support social sharing options
            - [ ] Add QR code generation for profile link
            - [ ] Track link shares and views
        - [ ] User Status
            - [ ] Show 'Last Active' status
            - [ ] Add online/offline indicator
            - [ ] Implement 'Active Now' status for recent activity
            - [ ] Add privacy control for activity status
        - [ ] Public profile access control
            - [ ] Allow viewing without login
            - [ ] Respect user's privacy settings
            - [ ] Show limited profile for non-logged-in users
            - [ ] Add signup/login prompts for contact actions
        - [ ] Public contact options
            - [ ] Add contact form for public users
            - [ ] Show available contact methods
            - [ ] Implement rate limiting for public access
            - [ ] Add reporting mechanism for abuse

### 3. Job & Referral Posts
- [ ] Job seeker post creation form
    - [ ] Design post creation form UI
    - [ ] Add fields for resume, interest statement, privacy
    - [ ] Implement form validation
    - [ ] Integrate with backend post creation endpoint
    - [ ] Show success/error states
- [ ] Referrer post creation form
    - [ ] Design referrer post form UI
    - [ ] Add company tag field
    - [ ] Add resume approval/rejection toggle
    - [ ] Integrate with backend referrer post endpoint
    - [ ] Show success/error states
- [ ] Post listing (feed) page
    - [ ] Design feed layout
    - [ ] Fetch posts from backend
    - [ ] Filter/sort posts (public, private, anonymous)
    - [ ] Show loading, empty, and error states
- [ ] Post detail page
    - [ ] Design post detail layout
    - [ ] Display post info and user details
    - [ ] Add apply/request referral button
    - [ ] Show post status (applied, accepted, pending)
- [ ] Auto-expiration UI for posts
    - [ ] Show expiration date on posts
    - [ ] Add option to adjust expiration date
    - [ ] Indicate expired posts visually

### 4. Public Viewing
- [ ] Public posts page (for non-logged-in users)
    - [ ] Design public posts layout
    - [ ] Fetch only public posts from backend
    - [ ] Show login/signup prompt for actions
- [ ] Public profile view (if profile is public)
    - [ ] Design public profile layout
    - [ ] Fetch public profile info from backend
    - [ ] Hide private info for non-logged-in users

### 5. Chat System
- [ ] Basic chat UI (opens on referral acceptance)
    - [ ] Design chat window/component
    - [ ] Integrate with backend chat (Socket.io or similar)
    - [ ] Implement message send/receive
    - [ ] Show typing/loading indicators
    - [ ] Display chat status (active, closed)
- [ ] Show chat history per referral
    - [ ] Fetch chat history from backend
    - [ ] Group messages by referral
    - [ ] Show timestamps and sender info

### 6. Notifications
- [ ] Notification UI (email only, MVP)
    - [ ] Design notification dropdown/toast
    - [ ] Fetch notifications from backend
    - [ ] Show unread/read status
    - [ ] Mark notifications as read
- [ ] Notification settings/toggle
    - [ ] Add notification settings to profile/settings page
    - [ ] Implement toggle for email notifications
    - [ ] Integrate with backend notification settings API

### 7. Company Profiles
- [ ] Company profile page (basic info, posts)
    - [ ] Design company profile layout
    - [ ] Fetch company info and posts from backend
    - [ ] Show company logo and description
    - [ ] List all related posts/referrers

### 8. Content Moderation
- [ ] Show moderation status on post (basic)
    - [ ] Display moderation status (pending, approved, rejected)
    - [ ] Show reason for rejection if any
- [ ] Manual flag/report button
    - [ ] Add flag/report button to posts
    - [ ] Show confirmation dialog on flag
    - [ ] Integrate with backend flag/report endpoint

### 9. General
- [ ] Navigation bar (role switching, profile, logout)
    - [ ] Design and implement navbar
    - [ ] Add links for switching roles, profile, logout
    - [ ] Show current user/role info
- [ ] Responsive layout
    - [ ] Implement responsive design for all pages
    - [ ] Test on mobile, tablet, desktop
- [ ] Error/loading states for all forms
    - [ ] Add loading spinners to all forms/pages
    - [ ] Show error messages for failed actions
    - [ ] Implement global error boundary

---

## How to use
- Check off tasks as completed.
- Add notes/dates next to each item as needed.

---

## How to use
- Check off tasks as completed.
- Add notes/dates next to each item as needed.
