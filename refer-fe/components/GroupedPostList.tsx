import React, { useState } from "react";
import { View, Text, TouchableOpacity, SectionList } from "react-native";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../context/ThemeContext";
import PostCard, { Post } from "./PostCard";

// Types
type GroupedPosts<T extends Post> = {
    title: string;
    data: T[];
    id: string;
};

interface GroupedPostListProps<T extends Post> {
    sections: GroupedPosts<T>[];
    onRefresh: () => void;
    refreshing: boolean;
    emptyMessage: string;
}

// Styled components
const Container = styled.View`
    flex: 1;
`;

const SectionHeader = styled.TouchableOpacity`
    flex-direction: row;
    padding: 12px 16px;
    background-color: ${(props) => props.theme.colors.card};
    border-radius: ${(props) => props.theme.borderRadius.md}px;
    margin-left: 16px;
    margin-right: 16px;
    margin-top: 16px;
    margin-bottom: 8px;
    align-items: center;
    justify-content: space-between;
    elevation: 2;
`;

const SectionTitle = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: ${(props) => props.theme.typography.fontSize.md}px;
    font-weight: bold;
`;

const SectionCount = styled.View`
    background-color: ${(props) => props.theme.colors.primary}20;
    border-radius: 12px;
    padding-left: 8px;
    padding-right: 8px;
    padding-top: 2px;
    padding-bottom: 2px;
    margin-left: 8px;
`;

const CountText = styled.Text`
    color: ${(props) => props.theme.colors.primary};
    font-size: ${(props) => props.theme.typography.fontSize.xs}px;
    font-weight: bold;
`;

const NewPostBadge = styled.View`
    background-color: ${(props) => props.theme.colors.success};
    border-radius: 4px;
    padding-left: 6px;
    padding-right: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 1;
`;

const BadgeText = styled.Text`
    color: white;
    font-size: ${(props) => props.theme.typography.fontSize.xs}px;
    font-weight: bold;
`;

const EmptyContainer = styled.View`
    padding: 32px;
    align-items: center;
    justify-content: center;
`;

const EmptyText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: ${(props) => props.theme.typography.fontSize.md}px;
    opacity: 0.7;
    text-align: center;
`;

const TitleRow = styled.View`
    flex-direction: row;
    align-items: center;
`;

export default function GroupedPostList<T extends Post>({
    sections,
    onRefresh,
    refreshing,
    emptyMessage,
}: GroupedPostListProps<T>) {
    const { theme } = useTheme();
    const [collapsedSections, setCollapsedSections] = useState<
        Record<string, boolean>
    >({});

    // Toggle section collapse
    const toggleSection = (id: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    // Check if post is new (less than 3 days old)
    const isNewPost = (post: Post) => {
        const postDate = post.createdAt ? new Date(post.createdAt) : null;
        if (!postDate) return false;

        const now = new Date();
        const threeDaysAgo = new Date(now.setDate(now.getDate() - 3));
        return postDate > threeDaysAgo;
    };

    // Render post with new badge if needed
    const renderPost = ({ item }: { item: T }) => (
        <View style={{ marginBottom: 12, position: "relative" }}>
            {isNewPost(item) && (
                <NewPostBadge>
                    <BadgeText>NEW</BadgeText>
                </NewPostBadge>
            )}
            <PostCard post={item} />
        </View>
    );

    // Render section header with collapse functionality
    const renderSectionHeader = ({ section }: { section: GroupedPosts<T> }) => (
        <SectionHeader
            onPress={() => toggleSection(section.id)}
            style={{
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 2,
            }}
        >
            <TitleRow>
                <SectionTitle>{section.title}</SectionTitle>
                <SectionCount>
                    <CountText>{section.data.length}</CountText>
                </SectionCount>
            </TitleRow>
            <FontAwesome
                name={
                    collapsedSections[section.id]
                        ? "chevron-down"
                        : "chevron-up"
                }
                size={16}
                color={theme.colors.text}
            />
        </SectionHeader>
    );

    if (sections.length === 0) {
        return (
            <EmptyContainer>
                <EmptyText>{emptyMessage}</EmptyText>
            </EmptyContainer>
        );
    }

    // Filter out collapsed sections
    const visibleSections = sections.map((section) => ({
        ...section,
        data: collapsedSections[section.id] ? [] : section.data,
    }));

    return (
        <Container>
            <SectionList
                sections={visibleSections}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </Container>
    );
}
