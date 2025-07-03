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
    console.log(`Attempting to send push notification to user ${userId}`);
    console.log(`Title: ${title}, Body: ${body}, Data:`, data);
    
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User ${userId} not found.`);
      return;
    }
    
    console.log(`User found: ${user.firstName} ${user.lastName}`);
    console.log(`User push tokens:`, user.pushTokens);
    
    if (!user.pushTokens || user.pushTokens.length === 0) {
      console.log(`User ${userId} has no push tokens.`);
      return;
    }

    const messages = user.pushTokens
      .filter(token => {
        const isValid = Expo.isExpoPushToken(token);
        console.log(`Token ${token} is valid: ${isValid}`);
        return isValid;
      })
      .map(pushToken => ({
        to: pushToken,
        sound: 'default' as const,
        title,
        body,
        data,
      }));

    console.log(`Prepared ${messages.length} messages to send`);

    if (messages.length > 0) {
      const chunks = expo.chunkPushNotifications(messages);
      console.log(`Split into ${chunks.length} chunks`);
      
      for (const chunk of chunks) {
        try {
          console.log(`Sending chunk with ${chunk.length} messages`);
          const result = await expo.sendPushNotificationsAsync(chunk);
          console.log('Push notification result:', result);
        } catch (error) {
          console.error('Error sending push notification chunk:', error);
        }
      }
    } else {
      console.log('No valid push tokens found to send notifications to');
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
}; 