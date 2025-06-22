import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import api from './api';

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

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            // We could show an alert here to explain why notifications are useful
            console.log('Failed to get push token for push notification!');
            return;
        }
        
        // Use the default Expo push token
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);

    } else {
        console.log('Must use physical device for Push Notifications');
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