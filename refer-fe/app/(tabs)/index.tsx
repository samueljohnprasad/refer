import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../../context/ThemeContext";
import PostCard from "@/components/PostCard";
import FilterBar, { FilterConfig } from "@/components/FilterBar";
import SwipeableTabs from "@/components/common/SwipeableTabs";
import ReferralModal from "@/components/ReferralModal";
import { useNotifications } from "@/hooks/useNotifications";
import { jobSeekerPostService } from "@/services/jobSeekerPost.service";
import { Post, JobSeekerPost, ReferrerPost, TabType, SortOption } from "@/types/posts";
import { useGetJobSeekerPostsQuery } from '@/services/apiSlice';
import DesktopFeedContainer from "@/components/desktop/DesktopFeedContainer";

// Local types are removed

const referrerPosts: ReferrerPost[] = []; // Keep for now, will be replaced by API data

type TabProps = {
    active: boolean;
};

const TabContainer = styled.View`
    flex-direction: row;
    margin: 16px 16px 24px 16px;
    border-radius: 12px;
    background-color: ${(props) => props.theme.colors.card};
    box-shadow: 0px 2px 8px rgba(0,0,0,0.04);
    elevation: 2;
    overflow: hidden;
`;

const TabButton = styled.TouchableOpacity<TabProps>`
    flex: 1;
    padding: 14px 0;
    justify-content: center;
    align-items: center;
    background-color: ${(props) =>
        props.active ? props.theme.colors.primary : 'transparent'};
    border-radius: 12px;
    transition: background-color 0.2s;
`;

const TabText = styled.Text<TabProps>`
    font-size: 16px;
    font-weight: ${(props) => (props.active ? 'bold' : '600')};
    color: ${(props) =>
        props.active ? 'white' : props.theme.colors.primary};
    transition: color 0.2s;
`;

const PlusButtonContainer = styled.View`
    align-items: center;
    margin: -18px 0 4px 0;
`;

const FabContainer = styled.View`
    position: absolute;
    bottom: 24px;
    right: 24px;
    z-index: 100;
`;

const CreatePostButton = styled.TouchableOpacity<{ pressed: boolean }>`
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background-color: ${(props) => props.theme.colors.primary};
    justify-content: center;
    align-items: center;
    border-width: 2px;
    border-color: rgba(255,255,255,0.7);
    shadow-color: #000;
    shadow-opacity: 0.15;
    shadow-radius: 8px;
    shadow-offset: 0px 4px;
    elevation: 6;
    transform: scale(${props => (props.pressed ? 0.93 : 1)});
`;

const HeaderContainer = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background-color: ${(props) => props.theme.colors.card};
    border-bottom-width: 1px;
    border-bottom-color: ${(props) => props.theme.colors.border};
`;

const LeftSection = styled.View`
    flex-direction: row;
    align-items: center;
`;

const RightSection = styled.View`
    flex-direction: row;
    align-items: center;
`;

const HeaderTitle = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: ${(props) => props.theme.colors.text};
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

const isJobSeekerPost = (post: Post): post is JobSeekerPost => {
    return 'interestStatement' in post;
};

interface PostListContentProps {
    posts: Post[];
    isLoading: boolean;
    error: any;
    refreshing: boolean;
    isFetching: boolean;
    onRefresh: () => void;
    onRefer: ((post: JobSeekerPost) => void) | undefined;
    activeTab: TabType;
    theme: any;
}

const PostListContent: React.FC<PostListContentProps> = ({ 
    posts, 
    isLoading, 
    error, 
    refreshing, 
    isFetching,
    onRefresh,
    onRefer,
    activeTab,
    theme 
}) => {
    if (isLoading && activeTab === TabType.JobSeeker) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error && activeTab === TabType.JobSeeker) {
        return (
            <EmptyState>
                <FontAwesome
                    name="exclamation-triangle"
                    size={50}
                    color={theme.colors.error}
                    style={{ opacity: 0.8 }}
                />
                <EmptyStateText style={{color: theme.colors.error}}>
                    {error?.toString()}
                </EmptyStateText>
            </EmptyState>
        );
    }

    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => {
                if (isJobSeekerPost(item)) {
                    return item._id || String(Math.random());
                }
                return item.id || String(Math.random());
            }}
            renderItem={({ item }) => (
                <PostCard 
                    post={item} 
                    onRefer={isJobSeekerPost(item) ? onRefer : undefined}
                />
            )}
            contentContainerStyle={{ padding: 16, paddingTop: 8 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing || isFetching}
                    onRefresh={onRefresh}
                    colors={[theme.colors.primary]}
                    tintColor={theme.colors.primary}
                />
            }
            ListEmptyComponent={
                <EmptyState>
                    <FontAwesome
                        name={activeTab === TabType.JobSeeker ? "user-circle" : "building"}
                        size={50}
                        color={theme.colors.text}
                        style={{ opacity: 0.5 }}
                    />
                    <EmptyStateText>
                        {activeTab === TabType.JobSeeker
                            ? "No job seeker posts yet. Be the first to post!"
                            : "No referrer posts available. Check back later or create one!"}
                    </EmptyStateText>
                </EmptyState>
            }
        />
    );
};

export default function HomeScreen() {
    const { theme, isDarkMode } = useTheme();
    const { width: screenWidth } = Dimensions.get('window');
    const isDesktop = screenWidth >= theme.breakpoints.lg;
    const router = useRouter();
    const { unreadCount } = useNotifications();
    const [activeTab, setActiveTab] = useState<TabType>(TabType.JobSeeker);
    const [refreshing, setRefreshing] = useState(false);
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({
        query: "",
        sortBy: SortOption.Newest,
        categories: [],
        skills: [],
    });

    const [isReferralModalVisible, setReferralModalVisible] = useState(false);
    const [selectedPostForReferral, setSelectedPostForReferral] = useState<JobSeekerPost | null>(null);
    const [plusPressed, setPlusPressed] = useState(false);

    const { data, isLoading, error, refetch, isFetching } = useGetJobSeekerPostsQuery(filterConfig, { skip: activeTab !== TabType.JobSeeker });
    const jobSeekerPosts = data?.posts || [];

    const handleOpenReferralModal = (post: JobSeekerPost) => {
        setSelectedPostForReferral(post);
        setReferralModalVisible(true);
    };
    
    // If desktop, render desktop version
    if (isDesktop) {
        return <DesktopFeedContainer onRefer={handleOpenReferralModal} />;
    }

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
        if (activeTab === TabType.JobSeeker) {
            refetch();
            setRefreshing(false);
        } else {
            setTimeout(() => setRefreshing(false), 1500);
        }
    }, [activeTab, refetch]);

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
                case SortOption.Newest:
                    return sortedPosts.sort((a, b) => {
                        const dateA = new Date(a.createdAt || '').getTime();
                        const dateB = new Date(b.createdAt || '').getTime();
                        return dateB - dateA;
                    });
                case SortOption.Expiring:
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

    const tabs = [
        {
            key: 'jobSeekers',
            title: 'Job Seekers',
            component: (
                <View style={{ flex: 1 }}>
                    <FilterBar
                        availableCategories={availableCategories}
                        availableSkills={availableSkills}
                        onFilterChange={setFilterConfig}
                        initialConfig={filterConfig}
                    />
                    <PostListContent
                        posts={sortedJobSeekerPosts}
                        isLoading={isLoading}
                        error={error}
                        refreshing={refreshing}
                        isFetching={isFetching}
                        onRefresh={onRefresh}
                        onRefer={handleOpenReferralModal}
                        activeTab={TabType.JobSeeker}
                        theme={theme}
                    />
                </View>
            ),
        },
        {
            key: 'referrers',
            title: 'Referrers',
            component: (
                <View style={{ flex: 1 }}>
                    <FilterBar
                        availableCategories={availableCategories}
                        availableSkills={availableSkills}
                        onFilterChange={setFilterConfig}
                        initialConfig={filterConfig}
                    />
                    <PostListContent
                        posts={sortedReferrerPosts}
                        isLoading={false}
                        error={null}
                        refreshing={refreshing}
                        isFetching={false}
                        onRefresh={onRefresh}
                        onRefer={undefined}
                        activeTab={TabType.Referrer}
                        theme={theme}
                    />
                </View>
            ),
        },
    ];

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
            <ReferralModal 
                visible={isReferralModalVisible}
                onClose={handleCloseReferralModal}
                post={selectedPostForReferral}
            />
            
            <SwipeableTabs
                tabs={tabs}
                initialTab={activeTab === TabType.JobSeeker ? 0 : 1}
            />

            <FabContainer>
                <CreatePostButton
                    pressed={plusPressed}
                    activeOpacity={0.8}
                    onPressIn={() => setPlusPressed(true)}
                    onPressOut={() => setPlusPressed(false)}
                    onPress={() => {
                        if (activeTab === TabType.JobSeeker) {
                            router.push("/create-job-post" as any);
                        } else {
                            router.push("/create-referrer-post" as any);
                        }
                    }}
                >
                    <FontAwesome name="plus" size={28} color="white" />
                </CreatePostButton>
            </FabContainer>
        </SafeAreaView>
    );
}
