import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Dimensions } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useGetJobSeekerPostsQuery } from "../../services/apiSlice";
import {
    Post,
    JobSeekerPost,
    ReferrerPost,
    TabType,
    SortOption,
} from "../../types/posts";
import { FilterConfig } from "../FilterBar";
import DesktopFeedPresentation from "./DesktopFeedPresentation";

interface DesktopFeedContainerProps {
    onRefer?: (post: JobSeekerPost) => void;
}

// Sample referrer posts data - replace with real API call later
const sampleReferrerPosts: ReferrerPost[] = [
    {
        id: "1",
        type: "referrer",
        user: "Beats Corporation Inc.com",
        company: "Beats Corporation Inc.com",
        role: "Principal Designer",
        description:
            "Lead the design vision, create intuitive user experiences, and collaborate with cross-functional teams to drive innovation.",
        status: "active",
        skills: ["UI/UX Design", "Product Design", "Leadership"],
        expiresAt: "2024-12-31T23:59:59Z",
        createdAt: "2024-06-27T10:00:00Z",
    },
    {
        id: "2",
        type: "referrer",
        user: "Word Flow",
        company: "Word Flow",
        role: "Frontend Developer",
        description:
            "Build responsive UIs with modern frameworks, ensuring great performance and user experience as a Frontend Designer.",
        status: "active",
        skills: ["React", "TypeScript", "JavaScript", "CSS"],
        expiresAt: "2024-12-31T23:59:59Z",
        createdAt: "2024-06-26T14:30:00Z",
    },
    {
        id: "3",
        type: "referrer",
        user: "TuneIn Radio",
        company: "TuneIn Radio",
        role: "Product Manager",
        description:
            "Define product strategy, prioritize features, and align teams to deliver impactful solutions that meet business and user needs.",
        status: "active",
        skills: ["Product Strategy", "Analytics", "Leadership"],
        expiresAt: "2024-12-31T23:59:59Z",
        createdAt: "2024-06-25T09:15:00Z",
    },
];

const DesktopFeedContainer: React.FC<DesktopFeedContainerProps> = ({
    onRefer,
}) => {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>(TabType.JobSeeker);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [locationQuery, setLocationQuery] = useState<string>("");
    const [filterConfig, setFilterConfig] = useState<FilterConfig>({
        query: "",
        skills: [],
        categories: [],
        workType: "all",
        experienceLevel: "all",
        sortBy: SortOption.Newest,
        showExpired: false,
    });

    // Get screen dimensions for responsive behavior
    const { width: screenWidth } = Dimensions.get("window");
    const isDesktop = screenWidth >= theme.breakpoints.lg;

    // Fetch job seeker posts
    const {
        data: jobSeekerPostsData,
        isLoading,
        error,
        refetch,
        isFetching,
    } = useGetJobSeekerPostsQuery({});

    const [refreshing, setRefreshing] = useState<boolean>(false);

    // Handle refresh
    const onRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        try {
            await refetch();
        } finally {
            setRefreshing(false);
        }
    }, [refetch]);

    // Process and filter job seeker posts
    const processedJobSeekerPosts = useMemo((): JobSeekerPost[] => {
        if (!jobSeekerPostsData?.posts) return [];

        return jobSeekerPostsData.posts
            .filter((post: JobSeekerPost) => {
                // Apply search filter
                if (
                    searchQuery &&
                    !post.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) &&
                    !post.interestStatement
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Apply skills filter
                if (filterConfig.skills.length > 0) {
                    const postSkills = post.skills || [];
                    const hasMatchingSkill = filterConfig.skills.some((skill) =>
                        postSkills.some((postSkill) =>
                            postSkill
                                .toLowerCase()
                                .includes(skill.toLowerCase())
                        )
                    );
                    if (!hasMatchingSkill) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (filterConfig.sortBy === SortOption.Newest) {
                    return (
                        new Date(b.createdAt || 0).getTime() -
                        new Date(a.createdAt || 0).getTime()
                    );
                }
                return 0;
            });
    }, [jobSeekerPostsData?.posts, searchQuery, filterConfig]);

    // Process and filter referrer posts
    const processedReferrerPosts = useMemo((): ReferrerPost[] => {
        return sampleReferrerPosts
            .filter((post: ReferrerPost) => {
                // Apply search filter
                if (
                    searchQuery &&
                    !post.role
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) &&
                    !post.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                ) {
                    return false;
                }

                // Apply skills filter
                if (filterConfig.skills.length > 0) {
                    const hasMatchingSkill = filterConfig.skills.some((skill) =>
                        post.skills.some((postSkill) =>
                            postSkill
                                .toLowerCase()
                                .includes(skill.toLowerCase())
                        )
                    );
                    if (!hasMatchingSkill) return false;
                }

                return true;
            })
            .sort((a, b) => {
                if (filterConfig.sortBy === SortOption.Newest) {
                    return (
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                    );
                }
                return 0;
            });
    }, [searchQuery, filterConfig]);

    // Get available categories and skills for filtering
    const availableCategories = useMemo((): string[] => {
        const allPosts = [
            ...processedJobSeekerPosts,
            ...processedReferrerPosts,
        ];
        const categories = new Set<string>();

        allPosts.forEach((post) => {
            if ("role" in post) {
                categories.add(post.role);
            } else if (post.title) {
                categories.add(post.title);
            }
        });

        return Array.from(categories);
    }, [processedJobSeekerPosts, processedReferrerPosts]);

    const availableSkills = useMemo((): string[] => {
        const allPosts = [
            ...processedJobSeekerPosts,
            ...processedReferrerPosts,
        ];
        const skills = new Set<string>();

        allPosts.forEach((post) => {
            if (post.skills) {
                post.skills.forEach((skill) => skills.add(skill));
            }
        });

        return Array.from(skills);
    }, [processedJobSeekerPosts, processedReferrerPosts]);

    // Get current posts based on active tab
    const currentPosts = useMemo((): Post[] => {
        return activeTab === TabType.JobSeeker
            ? processedJobSeekerPosts
            : processedReferrerPosts;
    }, [activeTab, processedJobSeekerPosts, processedReferrerPosts]);

    const handleTabChange = useCallback((tab: TabType): void => {
        setActiveTab(tab);
    }, []);

    const handleSearchChange = useCallback((query: string): void => {
        setSearchQuery(query);
    }, []);

    const handleLocationChange = useCallback((location: string): void => {
        setLocationQuery(location);
    }, []);

    const handleFilterChange = useCallback((newConfig: FilterConfig): void => {
        setFilterConfig(newConfig);
    }, []);

    const handleApply = useCallback((post: Post): void => {
        // Handle job application logic
        console.log("Apply to:", post);
    }, []);

    const handleRefer = useCallback(
        (post: Post): void => {
            if ("title" in post && onRefer) {
                onRefer(post as JobSeekerPost);
            }
        },
        [onRefer]
    );

    return (
        <DesktopFeedPresentation
            // Data props
            posts={currentPosts}
            isLoading={isLoading}
            error={error}
            refreshing={refreshing}
            isFetching={isFetching}
            // State props
            activeTab={activeTab}
            searchQuery={searchQuery}
            locationQuery={locationQuery}
            filterConfig={filterConfig}
            availableCategories={availableCategories}
            availableSkills={availableSkills}
            // Action props
            onTabChange={handleTabChange}
            onSearchChange={handleSearchChange}
            onLocationChange={handleLocationChange}
            onFilterChange={handleFilterChange}
            onRefresh={onRefresh}
            onApply={handleApply}
            onRefer={handleRefer}
            // Theme
            theme={theme}
            isDesktop={isDesktop}
        />
    );
};

export default DesktopFeedContainer;
