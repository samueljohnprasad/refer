import { Expo } from 'expo-server-sdk';
import User from '../models/user.model';
import { IUserDocument } from '../models/user.model';

// Create a new Expo SDK client
const expo = new Expo();

export const sendPushNotification = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.pushTokens || user.pushTokens.length === 0) {
      console.log(`User ${userId} has no push tokens.`);
      return;
    }

    const messages = user.pushTokens
      .filter(token => Expo.isExpoPushToken(token))
      .map(pushToken => ({
        to: pushToken,
        sound: 'default' as const,
        title,
        body,
        data,
      }));

    if (messages.length > 0) {
      const chunks = expo.chunkPushNotifications(messages);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
          console.error('Error sending push notification chunk:', error);
        }
      }
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}; 