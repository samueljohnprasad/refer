import { useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationsAsRead } from '../services/notification.service';
import { useFocusEffect } from 'expo-router';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await getNotifications();
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async () => {
        if (unreadCount > 0) {
            try {
                await markNotificationsAsRead();
                setUnreadCount(0);
                // Optimistically update the UI
                setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            } catch (error) {
                console.error("Failed to mark notifications as read:", error);
            }
        }
    };
    
    // Fetch notifications whenever the screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    return { notifications, unreadCount, isLoading, fetchNotifications, markAsRead };
}; 