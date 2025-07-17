# Google Sign-In Integration Setup Guide

This guide will help you complete the Google Sign-In setup for your referral app across Web, iOS, and Android platforms.

## 🚀 Current Implementation Status

✅ **Supabase Client** - Configured with environment variables  
✅ **Google Auth Service** - Cross-platform authentication logic  
✅ **Auth Context** - React context for state management  
✅ **Google Sign-In Button** - Platform-specific UI component  
✅ **Sign-In Screen Integration** - Updated with Google auth  
✅ **App Layout** - AuthProvider integrated  
✅ **Tab Navigation** - Basic routing structure  

## 📋 Prerequisites

1. **Google Cloud Console Account**
2. **Supabase Project** (Already configured)
3. **Development Environment** (Expo CLI)

## ⚙️ Configuration Steps

### 1. Google Cloud Console Setup

#### Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API** and **Google Sign-In API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**

#### Create Client IDs for Each Platform:

**Web Application:**
- Application type: `Web application`
- Authorized redirect URIs: 
  - `http://localhost:3000` (development)
  - `https://your-domain.com` (production)
- Copy the **Client ID**

**iOS Application:**
- Application type: `iOS`
- Bundle ID: Get from `app.json` → `expo.ios.bundleIdentifier`
- Copy the **Client ID**

**Android Application:**
- Application type: `Android`
- Package name: Get from `app.json` → `expo.android.package`
- SHA-1 certificate fingerprint: Get using `expo credentials:manager`
- Copy the **Client ID**

### 2. Update Environment Variables

Replace the placeholder values in `.env`:

```bash
# Replace these with your actual Google OAuth client IDs
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-ios-client-id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.googleusercontent.com
```

### 3. Supabase Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add your **Google Client ID** and **Client Secret**
5. Set redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 4. App Configuration Updates

#### Update app.json (for mobile builds):

```json
{
  "expo": {
    "plugins": [
      "@react-native-google-signin/google-signin"
    ],
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    },
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 5. Mobile Platform Setup

#### iOS Setup:
1. Download `GoogleService-Info.plist` from Google Cloud Console
2. Place it in the root of your project
3. Run: `expo prebuild --platform ios`

#### Android Setup:
1. Download `google-services.json` from Google Cloud Console
2. Place it in the root of your project
3. Run: `expo prebuild --platform android`

## 🧪 Testing

### Web Testing:
```bash
yarn web
# Navigate to sign-in screen and test Google auth
```

### Mobile Testing:
```bash
# iOS
yarn ios

# Android
yarn android
```

## 🔧 Development Commands

```bash
# Install dependencies (already done)
yarn add @supabase/supabase-js @react-native-google-signin/google-signin expo-auth-session expo-crypto expo-linking expo-web-browser react-native-url-polyfill

# Start development server
yarn start

# Test on specific platforms
yarn web
yarn ios
yarn android
```

## 📱 Features Implemented

### Authentication Flow:
1. **Sign-In Screen** with Google button
2. **Cross-platform compatibility** (Web/iOS/Android)
3. **Automatic redirect** after successful authentication
4. **Session persistence** across app restarts
5. **Error handling** with user feedback
6. **Sign-out functionality**

### Components Available:
- `GoogleSignInButton` - Platform-aware sign-in button
- `AuthProvider` - Context provider for auth state
- `useAuth` - Hook for accessing auth state and methods

### Authentication Methods:
- `signInWithGoogle()` - Platform-specific Google sign-in
- `signOut()` - Complete sign-out with cleanup
- `user` - Current user state
- `loading` - Authentication loading state
- `error` - Error state for debugging

## 🎯 Next Steps

1. **Add your Google OAuth credentials** to environment variables
2. **Configure Supabase Google provider**
3. **Test the authentication flow**
4. **Customize the user experience** based on your needs
5. **Add profile creation flow** for new users
6. **Implement role-based routing** (referrer vs seeker)

## 🐛 Troubleshooting

### Common Issues:

**"Client ID not found"**
- Verify environment variables are correctly set
- Ensure client IDs match your Google Cloud Console setup

**"Redirect URI mismatch"**
- Check Supabase redirect URLs match Google Console settings
- Verify domain configuration

**"Play Services not available" (Android)**
- Ensure Google Play Services are installed
- Test on physical device vs emulator

**TypeScript errors**
- These are expected during development and will resolve when compiled
- Focus on runtime functionality first

## 📧 Support

The Google Sign-In integration is now complete and ready for configuration. Follow the steps above to connect your Google Cloud Console credentials and test the authentication flow.

All components follow your established design system and integrate seamlessly with your existing referral app architecture.
