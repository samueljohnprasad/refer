import { Platform } from 'react-native';
import api from './api';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// This is the configuration for how notifications should behave when the app is in the foreground.
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    console.log('Starting push notification registration...');

    if (Platform.OS === 'android') {
        console.log('Setting up Android notification channel...');
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        console.log('Device detected, checking permissions...');
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        console.log('Existing permission status:', existingStatus);

        if (existingStatus !== 'granted') {
            console.log('Requesting notification permissions...');
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
            console.log('New permission status:', status);
        }

        if (finalStatus !== 'granted') {
            // We could show an alert here to explain why notifications are useful
            console.log('Failed to get push token for push notification! Permission denied.');
            return;
        }
        
        // Use the default Expo push token
        console.log('Getting Expo push token...');
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);

    } else {
        console.log('⚠️  SIMULATOR DETECTED: Push notifications require a physical device');
        console.log('📱 To test notifications, use a physical device with Expo Go app');
        console.log('🔧 For now, we\'ll simulate the notification flow for testing');
        
        // Simulate a token for testing purposes
        token = 'ExponentPushToken[simulator-test-token]';
        console.log('📝 Using simulated token for testing:', token);
    }

    return token;
}

export const getNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error;
    }
}

export const markNotificationsAsRead = async () => {
    try {
        await api.post('/notifications/mark-read');
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        // Don't throw, as this is not a critical failure for the user
    }
} 