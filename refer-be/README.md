# ReferNet Backend

Backend for ReferNet - a community-driven job referral platform enabling seamless interaction between job seekers and referrers.

## Tech Stack

- **Framework**: Node.js + Express
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose)
- **Auth**: JWT + Custom Authentication
- **Validation**: Joi
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas URI)

### Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

## Authentication API Documentation

### User Registration

- **POST** `/api/auth/register`
- **Description**: Register a new user with email and password
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890", // Optional
    "company": "Example Inc.", // Optional
    "companyEmail": "john@example-inc.com", // Optional
    "role": "JOB_SEEKER" // Optional (JOB_SEEKER, REFERRER, BOTH)
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User registered successfully. Please verify your email.",
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "JOB_SEEKER",
        "isVerified": false
      },
      "token": "jwt_token"
    }
  }
  ```

### User Login

- **POST** `/api/auth/login`
- **Description**: Login with email and password
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "JOB_SEEKER",
        "isVerified": true,
        "badges": ["VERIFIED_EMPLOYEE"]
      },
      "token": "jwt_token"
    }
  }
  ```

### Request OTP (Phone Authentication)

- **POST** `/api/auth/otp/request`
- **Description**: Request OTP for phone login/signup
- **Body**:
  ```json
  {
    "phone": "1234567890"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "data": {
      "isNewUser": true
    }
  }
  ```

### Verify OTP (Phone Authentication)

- **POST** `/api/auth/otp/verify`
- **Description**: Verify OTP and login/signup
- **Body**:
  ```json
  {
    "phone": "1234567890",
    "otp": "123456",
    "firstName": "John", // Required for new users
    "lastName": "Doe", // Required for new users
    "isNewUser": true
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": {
      "user": {
        "id": "user_id",
        "phone": "1234567890",
        "firstName": "John",
        "lastName": "Doe",
        "role": "JOB_SEEKER",
        "isVerified": true,
        "badges": []
      },
      "token": "jwt_token"
    }
  }
  ```

### Verify Email

- **GET** `/api/auth/verify-email/:token`
- **Description**: Verify user email with token
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Email verified successfully"
  }
  ```

### Verify Company Email

- **GET** `/api/auth/verify-company/:token`
- **Description**: Verify user's company email for badge
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Company email verified successfully. Verified Employee badge added."
  }
  ```

### Forgot Password

- **POST** `/api/auth/forgot-password`
- **Description**: Request password reset
- **Body**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "If a user with this email exists, a password reset link has been sent."
  }
  ```

### Reset Password

- **POST** `/api/auth/reset-password`
- **Description**: Reset password with token
- **Body**:
  ```json
  {
    "token": "reset_token",
    "password": "new_password"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Password reset successful. Please login with your new password."
  }
  ```

### Get Current User (Protected)

- **GET** `/api/auth/me`
- **Description**: Get current user profile (requires authentication)
- **Headers**:
  ```
  Authorization: Bearer jwt_token
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "phone": "1234567890",
        "firstName": "John",
        "lastName": "Doe",
        "company": "Example Inc.",
        "companyEmail": "john@example-inc.com",
        "isCompanyEmailVerified": true,
        "role": "JOB_SEEKER",
        "badges": ["VERIFIED_EMPLOYEE"],
        "privacySettings": {
          "profileVisibility": "public",
          "resumeVisibility": "connections",
          "contactInfoVisibility": "private"
        },
        "notificationSettings": {
          "email": true,
          "sms": false,
          "whatsapp": false,
          "referralUpdates": true,
          "chatMessages": true,
          "jobMatches": true,
          "platformUpdates": true
        },
        "profilePicture": "url",
        "bio": "User bio",
        "isVerified": true,
        "createdAt": "timestamp",
        "updatedAt": "timestamp",
        "lastLogin": "timestamp"
      }
    }
  }
  ```

### Update User Role (Protected)

- **PUT** `/api/auth/role`
- **Description**: Update user role (requires authentication)
- **Headers**:
  ```
  Authorization: Bearer jwt_token
  ```
- **Body**:
  ```json
  {
    "role": "REFERRER" // JOB_SEEKER, REFERRER, BOTH
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User role updated successfully",
    "data": {
      "role": "REFERRER"
    }
  }
  ```

### Update Privacy Settings (Protected)

- **PUT** `/api/auth/privacy`
- **Description**: Update privacy settings (requires authentication)
- **Headers**:
  ```
  Authorization: Bearer jwt_token
  ```
- **Body**:
  ```json
  {
    "profileVisibility": "private", // public, private, connections
    "resumeVisibility": "private",
    "contactInfoVisibility": "connections"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "Privacy settings updated successfully",
    "data": {
      "privacySettings": {
        "profileVisibility": "private",
        "resumeVisibility": "private",
        "contactInfoVisibility": "connections"
      }
    }
  }
  ```

## Running Tests

```bash
npm test
```

## License

This project is proprietary and confidential.
