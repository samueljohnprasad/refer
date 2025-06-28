import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/context/ThemeContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Stack, useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Container = styled.View`
    flex: 1;
    background-color: ${props => props.theme.colors.background};
`;

const NotificationItem = styled.TouchableOpacity<{ isRead: boolean }>`
    background-color: ${props => props.isRead ? props.theme.colors.card : props.theme.colors.primary + '20'};
    padding: 16px;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.colors.border};
    flex-direction: row;
    align-items: center;
`;

const NotificationText = styled.Text`
    font-size: 16px;
    color: ${props => props.theme.colors.text};
`;

const TimestampText = styled.Text`
    font-size: 12px;
    color: ${props => props.theme.colors.text};
    opacity: 0.6;
    margin-top: 4px;
`;

const EmptyContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 20px;
`;

const EmptyText = styled.Text`
    font-size: 18px;
    color: ${props => props.theme.colors.text};
    opacity: 0.7;
    text-align: center;
    margin-top: 16px;
`;

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { notifications, isLoading, unreadCount, markAsRead } = useNotifications();

    useEffect(() => {
        // Mark notifications as read when the screen is opened
        if (unreadCount > 0) {
            markAsRead();
        }
    }, []);

    const handleNotificationPress = (link?: string) => {
        if (link) {
            router.push(link as any);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <NotificationItem 
            isRead={item.isRead}
            onPress={() => handleNotificationPress(item.link)}
        >
            <FontAwesome 
                name={item.type === 'NEW_REFERRAL' ? 'user-plus' : 'bell'} 
                size={24} 
                color={theme.colors.primary}
                style={{ marginRight: 16 }}
            />
            <View style={{ flex: 1 }}>
                <NotificationText>{item.message}</NotificationText>
                <TimestampText>{new Date(item.createdAt).toLocaleString()}</TimestampText>
            </View>
        </NotificationItem>
    );

    if (isLoading && notifications.length === 0) {
        return (
            <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </Container>
        );
    }

    return (
        <Container>
            <Stack.Screen options={{ title: 'Notifications' }} />
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <EmptyContainer>
                        <FontAwesome name="inbox" size={60} color={theme.colors.text} style={{ opacity: 0.3 }}/>
                        <EmptyText>You have no notifications yet. We'll let you know when something new comes up!</EmptyText>
                    </EmptyContainer>
                }
            />
        </Container>
    );
} 
// FLvxrqeSn4ynLFCq