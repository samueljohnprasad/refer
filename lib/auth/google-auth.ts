import { Platform } from 'react-native';
import { supabase } from '../supabase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// For native apps (iOS/Android)
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export interface GoogleAuthConfig {
  webClientId: string;
  iosClientId?: string;
  androidClientId?: string;
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private config: GoogleAuthConfig | null = null;

  private constructor() {}

  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public configure(config: GoogleAuthConfig) {
    this.config = config;
    
    if (Platform.OS !== 'web') {
      GoogleSignin.configure({
        webClientId: config.webClientId,
        iosClientId: config.iosClientId,
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });
    }
  }

  public async signInWithGoogle() {
    try {
      if (Platform.OS === 'web') {
        return await this.signInWithGoogleWeb();
      } else {
        return await this.signInWithGoogleNative();
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  }

  private async signInWithGoogleWeb() {
    if (!this.config) {
      throw new Error('Google Auth not configured');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: Linking.createURL('/(tabs)/profile'),
        queryParams: {
          access_type: 'offline',
          // prompt: 'consent',
        },
      },
    });

    if (error) throw error;

    if (data.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        Linking.createURL('/(tabs)/profile')
      );

      if (result.type === 'success') {
        return data;
      }
    }

    throw new Error('Google Sign-In was cancelled or failed');
  }

  private async signInWithGoogleNative() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if (userInfo.data?.idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: userInfo.data.idToken,
        });

        if (error) throw error;
        return data;
      } else {
        throw new Error('No ID token received from Google');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Google Sign-In was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Google Sign-In is already in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services not available');
      } else {
        throw error;
      }
    }
  }

  public async signOut() {
    try {
      if (Platform.OS !== 'web') {
        await GoogleSignin.signOut();
      }
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  public async getCurrentUser() {
    try {
      if (Platform.OS !== 'web') {
        return await GoogleSignin.getCurrentUser();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public async isSignedIn() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }
}

export const googleAuthService = GoogleAuthService.getInstance();
