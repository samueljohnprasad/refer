import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../../context/ThemeContext";
import PostCard from "@/components/PostCard";
import GroupedPostList from "@/components/GroupedPostList";
import FilterBar, { FilterConfig } from "@/components/FilterBar";
import { ThemeInterface } from "@/constants/theme";
import SwipeableTabs from "@/components/common/SwipeableTabs";
import ReferralModal from "@/components/ReferralModal";
import { useNotifications } from "@/hooks/useNotifications";
import { jobSeekerPostService } from "@/services/jobSeekerPost.service";
import { Post, JobSeekerPost, ReferrerPost } from "@/types/posts";

// Local types are removed

const referrerPosts: ReferrerPost[] = []; // Keep for now, will be replaced by API data

type TabProps = {
    active: boolean;
};

const TabButton = styled.TouchableOpacity<TabProps>`
    flex: 1;
    padding: 12px;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.active ? props.theme.colors.primary : props.theme.colors.card};
    border-radius: 8px;
    margin: 0 4px;
    border-width: ${(props) => (props.active ? 0 : 1)}px;
    border-color: ${(props) => props.theme.colors.border};
`;

const TabText = styled.Text<TabProps>`
    font-size: 16px;
    font-weight: ${(props) => (props.active ? "bold" : "normal")};
    color: ${(props) => (props.active ? "white" : props.theme.colors.text)};
`;

const TabContainer = styled.View`
    flex-direction: row;
    margin: 8px 16px 16px 16px;
    border-radius: 8px;
    overflow: hidden;
    padding: 4px;
    background-color: ${(props) => props.theme.colors.background};
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 12px;
    padding-bottom: 12px;
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme.colors.border};
    background-color: ${(props) => props.theme.colors.card};
`;

const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
`;

const CreatePostButton = styled.TouchableOpacity`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background-color: ${(props) => props.theme.colors.primary};
    justify-content: center;
    align-items: center;
`;

const NotificationBadge = styled.View`
    position: absolute;
    right: -5px;
    top: -5px;
    background-color: ${props => props.theme.colors.error};
    border-radius: 12px;
    width: 20px;
    height: 20px;
    justify-content: center;
    align-items: center;
    border: 2px solid ${props => props.theme.colors.card};
`;

const BadgeText = styled.Text`
    color: white;
    font-size: 10px;
    font-weight: bold;
`;

// EmptyState component for when there are no posts
const EmptyState = styled.View`
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
    opacity: 0.8;
`;

const EmptyStateText = styled.Text`
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    margin-top: 12px;
    text-align: center;
`;

export default function HomeScreen() {
    const { theme, isDarkMode } = useTheme();
    const router = useRouter();
    const { unreadCount } = useNotifications();
    const [activeTab, setActiveTab] = useState<"jobSeeker" | "referrer">(
        "jobSeeker"
    );
    const [jobSeekerPosts, setJobSeekerPosts] = useState<JobSeekerPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [refreshing, setRefreshing] = useState(false);
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({
        query: "",
        sortBy: "newest",
        categories: [],
        skills: [],
    });

    const [isReferralModalVisible, setReferralModalVisible] = useState(false);
    const [selectedPostForReferral, setSelectedPostForReferral] = useState<JobSeekerPost | null>(null);

    const fetchJobSeekerPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { posts } = await jobSeekerPostService.getJobSeekerPosts();
            console.log('sdfsdfdfsdfdsfdsfsd',posts);
            setJobSeekerPosts(posts);
        } catch (err) {
            setError("Failed to fetch job seeker posts. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "jobSeeker") {
            fetchJobSeekerPosts();
        }
    }, [activeTab, fetchJobSeekerPosts]);

    const handleOpenReferralModal = (post: JobSeekerPost) => {
        setSelectedPostForReferral(post);
        setReferralModalVisible(true);
    };

    const handleCloseReferralModal = () => {
        setReferralModalVisible(false);
        setSelectedPostForReferral(null);
    };

    // This logic needs to be updated once referrer posts are fetched from the backend
    const availableCategories = useMemo(() => {
        const categories = jobSeekerPosts.map((post) => post.title || '');
        return Array.from(new Set(categories)).filter(Boolean);
    }, [jobSeekerPosts]);

    const availableSkills = useMemo(() => {
        const skills = [
            ...jobSeekerPosts.flatMap((post) => post.skills || []),
            ...referrerPosts.flatMap((post) => post.skills || []),
        ];
        return Array.from(new Set(skills)).filter(Boolean);
    }, [jobSeekerPosts, referrerPosts]);

    const onRefresh = React.useCallback((): void => {
        setRefreshing(true);
        if (activeTab === 'jobSeeker') {
            fetchJobSeekerPosts().finally(() => setRefreshing(false));
        } else {
            // Placeholder for refreshing referrer posts
            setTimeout(() => setRefreshing(false), 1500);
        }
    }, [activeTab, fetchJobSeekerPosts]);

    const filteredJobSeekerPosts = useMemo(() => {
        return jobSeekerPosts.filter((post) => {
            if (
                filterConfig.query &&
                !(
                    post.interestStatement?.toLowerCase().includes(filterConfig.query.toLowerCase()) ||
                    post.skills?.some((skill) => skill.toLowerCase().includes(filterConfig.query.toLowerCase())) ||
                    post.title?.toLowerCase().includes(filterConfig.query.toLowerCase())
                )
            ) {
                return false;
            }
            if (filterConfig.categories.length > 0 && !filterConfig.categories.includes(post.title || '')) {
                return false;
            }
            if (filterConfig.skills.length > 0 && !post.skills?.some((skill) => filterConfig.skills.includes(skill))) {
                return false;
            }
            return true;
        });
    }, [jobSeekerPosts, filterConfig]);

    const filteredReferrerPosts = useMemo(() => {
        // This will be empty until referrer posts are fetched
        return referrerPosts;
    }, [filterConfig]);

    // Sort posts based on the sort option
    const sortPosts = useCallback(
        <T extends Post>(posts: T[]): T[] => {
            const sortedPosts = [...posts];

            switch (filterConfig.sortBy) {
                case "newest":
                    return sortedPosts.sort((a, b) => {
                        const dateA = new Date(a.createdAt || '').getTime();
                        const dateB = new Date(b.createdAt || '').getTime();
                        return dateB - dateA;
                    });
                case "expiring":
                    return sortedPosts.sort((a, b) => {
                        const expiryA = new Date(a.expiresAt || '').getTime();
                        const expiryB = new Date(b.expiresAt || '').getTime();
                        return expiryA - expiryB;
                    });
                default:
                    return sortedPosts;
            }
        },
        [filterConfig.sortBy]
    );

    // Apply sorting
    const sortedJobSeekerPosts = useMemo(
        () => sortPosts(filteredJobSeekerPosts),
        [filteredJobSeekerPosts, sortPosts]
    );

    const sortedReferrerPosts = useMemo(
        () => sortPosts(filteredReferrerPosts),
        [filteredReferrerPosts, sortPosts]
    );

    // Group job seeker posts by category
    const groupedJobSeekerPosts = useMemo(() => {
        const groupByCategory = sortedJobSeekerPosts.reduce<Record<string, JobSeekerPost[]>>((groups, post) => {
            const category = post.title || "Uncategorized";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(post);
            return groups;
        }, {});
        return Object.entries(groupByCategory).map(([category, posts]) => ({
            title: category,
            data: posts,
            id: `category-${category}`,
        }));
    }, [sortedJobSeekerPosts]);

    const groupedReferrerPosts = useMemo(() => {
        // This will be empty
        return [];
    }, [sortedReferrerPosts]);

    // Render job seeker posts with grouping
    const jobSeekerList = (
        <GroupedPostList
            sections={groupedJobSeekerPosts}
            refreshing={refreshing}
            onRefresh={onRefresh}
            emptyMessage="No job seeker posts found"
        />
    );

    // Render referrer posts with grouping
    const referrerList = (
        <GroupedPostList
            sections={groupedReferrerPosts}
            refreshing={refreshing}
            onRefresh={onRefresh}
            emptyMessage="No referrer posts found"
        />
    );

    const isJobSeekerPost = (post: Post): post is JobSeekerPost => {
        return 'interestStatement' in post;
    };

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ReferralModal 
                visible={isReferralModalVisible}
                onClose={handleCloseReferralModal}
                post={selectedPostForReferral}
            />
            <HeaderContainer>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome
                        name="feed"
                        size={22}
                        color={theme.colors.primary}
                        style={{ marginRight: 10 }}
                    />
                    <HeaderTitle>ReferNet Feed</HeaderTitle>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={{ marginRight: 16 }}>
                        <FontAwesome
                            name="bell"
                            size={24}
                            color={theme.colors.text}
                        />
                        {unreadCount > 0 && (
                            <NotificationBadge>
                                <BadgeText>{unreadCount}</BadgeText>
                            </NotificationBadge>
                        )}
                    </TouchableOpacity>
                    <CreatePostButton
                        style={{
                            shadowColor: theme.colors.primary,
                            shadowOpacity: 0.4,
                            shadowRadius: 8,
                            shadowOffset: { width: 0, height: 3 },
                            elevation: 5,
                        }}
                        onPress={() => {
                            // Navigate to the appropriate post creation screen
                            if (activeTab === "jobSeeker") {
                                router.push("/create-job-post" as any);
                            } else {
                                router.push("/create-referrer-post" as any);
                            }
                        }}
                    >
                        <FontAwesome
                            name="plus"
                            size={20}
                            color="white"
                        />
                    </CreatePostButton>
                </View>
            </HeaderContainer>

            <TabContainer>
                <TabButton
                    active={activeTab === "jobSeeker"}
                    onPress={() => setActiveTab("jobSeeker")}
                >
                    <TabText active={activeTab === "jobSeeker"}>
                        Job Seekers
                    </TabText>
                </TabButton>
                <TabButton
                    active={activeTab === "referrer"}
                    onPress={() => setActiveTab("referrer")}
                >
                    <TabText active={activeTab === "referrer"}>
                        Referrers
                    </TabText>
                </TabButton>
            </TabContainer>

            <FilterBar
                availableCategories={availableCategories}
                availableSkills={availableSkills}
                onFilterChange={setFilterConfig}
                initialConfig={filterConfig}
            />

            {loading && activeTab === 'jobSeeker' ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : error && activeTab === 'jobSeeker' ? (
                 <EmptyState>
                    <FontAwesome
                        name="exclamation-triangle"
                        size={50}
                        color={theme.colors.error}
                        style={{ opacity: 0.8 }}
                    />
                    <EmptyStateText style={{color: theme.colors.error}}>
                        {error}
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <FlatList
                    data={activeTab === "jobSeeker" ? (sortedJobSeekerPosts as Post[]) : (sortedReferrerPosts as Post[])}
                    keyExtractor={(item) => isJobSeekerPost(item) ? item._id || '' : item.id || ''}
                    renderItem={({ item }) => (
                        <PostCard 
                            post={item} 
                            onRefer={isJobSeekerPost(item) ? () => handleOpenReferralModal(item) : undefined}
                        />
                    )}
                    contentContainerStyle={{ padding: 16, paddingTop: 8 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[theme.colors.primary]}
                            tintColor={theme.colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <EmptyState>
                            <FontAwesome
                                name={
                                    activeTab === "jobSeeker"
                                        ? "user-circle"
                                        : "building"
                                }
                                size={50}
                                color={theme.colors.text}
                                style={{ opacity: 0.5 }}
                            />
                            <EmptyStateText>
                                {activeTab === "jobSeeker"
                                    ? "No job seeker posts yet. Be the first to post!"
                                    : "No referrer posts available. Check back later or create one!"}
                            </EmptyStateText>
                        </EmptyState>
                    }
                />
            )}
        </SafeAreaView>
    );
}
