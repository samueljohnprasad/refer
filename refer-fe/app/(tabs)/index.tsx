import React, { useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "../../context/ThemeContext";
import PostCard from "@/components/PostCard";
import GroupedPostList from "@/components/GroupedPostList";
import { ThemeInterface } from "@/constants/theme";
import SwipeableTabs from "@/components/common/SwipeableTabs";

// Define post types
type JobSeekerPost = {
    id: string;
    type: string;
    user: string;
    resume: string;
    interest: string;
    privacy: string;
    skills: string[];
    expiresAt: number;
    createdAt: string;
    category: string;
};

type ReferrerPost = {
    id: string;
    type: string;
    user: string;
    company: string;
    role: string;
    description: string;
    status: string;
    expiresAt: number;
    createdAt: string;
};

type Post = JobSeekerPost | ReferrerPost;

// Dummy data for demonstration
const jobSeekerPosts: JobSeekerPost[] = [
    {
        id: "1",
        type: "Job Seeker",
        user: "Alice Johnson",
        resume: "Full Stack Developer.pdf",
        interest:
            "Looking for frontend development roles in React/React Native",
        privacy: "Public",
        skills: ["React", "TypeScript", "Node.js", "MongoDB"],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 5)
        ).toISOString(), // 5 days ago
        category: "Software Development",
    },
    {
        id: "2",
        type: "Job Seeker",
        user: "Michael Chen",
        resume: "Data_Engineer_Resume.pdf",
        interest:
            "Seeking data engineering positions with expertise in ETL pipelines",
        privacy: "Public",
        skills: ["Python", "SQL", "Spark", "AWS", "Airflow"],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 15, // 15 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 1)
        ).toISOString(), // 1 day ago (NEW)
        category: "Data Science",
    },
    {
        id: "3",
        type: "Job Seeker",
        user: "Sarah Williams",
        resume: "UX_Designer_Portfolio.pdf",
        interest:
            "UX/UI Designer with focus on user research and accessibility",
        privacy: "Anonymous",
        skills: ["Figma", "User Research", "Wireframing", "Prototyping"],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 45, // 45 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 2)
        ).toISOString(), // 2 days ago (NEW)
        category: "Design",
    },
    {
        id: "4",
        type: "Job Seeker",
        user: "David Lee",
        resume: "Senior_Frontend_Developer_Resume.pdf",
        interest:
            "Senior Frontend Developer with expertise in React and Node.js",
        privacy: "Public",
        skills: ["React", "TypeScript", "Node.js", "MongoDB"],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 20, // 20 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 10)
        ).toISOString(), // 10 days ago
        category: "Software Development",
    },
    {
        id: "5",
        type: "Job Seeker",
        user: "Jessica Kim",
        resume: "Machine_Learning_Engineer_Resume.pdf",
        interest:
            "Machine Learning Engineer with expertise in PyTorch and computer vision",
        privacy: "Private",
        skills: ["Python", "PyTorch", "Computer Vision", "Machine Learning"],
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 10, // 10 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 3)
        ).toISOString(), // 3 days ago
        category: "Data Science",
    },
];

const referrerPosts: ReferrerPost[] = [
    {
        id: "4",
        type: "Referrer",
        user: "David Lee",
        company: "TechCorp",
        role: "Senior Frontend Developer",
        description:
            "Looking to refer experienced React developers for our team",
        status: "Active",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 20, // 20 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 1)
        ).toISOString(), // 1 day ago (NEW)
    },
    {
        id: "5",
        type: "Referrer",
        user: "Jessica Kim",
        company: "DataWorks Inc.",
        role: "Machine Learning Engineer",
        description:
            "Offering referrals for ML engineers with PyTorch experience",
        status: "Active",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 10, // 10 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 7)
        ).toISOString(), // 7 days ago
    },
    {
        id: "6",
        type: "Referrer",
        user: "Robert Garcia",
        company: "CloudScale",
        role: "DevOps Engineer",
        description:
            "Referring candidates with experience in Kubernetes and CI/CD pipelines",
        status: "Active",
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 25, // 25 days
        createdAt: new Date(
            new Date().setDate(new Date().getDate() - 2)
        ).toISOString(), // 2 days ago (NEW)
    },
];

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
    const [activeTab, setActiveTab] = useState<"jobSeeker" | "referrer">(
        "jobSeeker"
    );
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback((): void => {
        setRefreshing(true);
        // In a real app, fetch new data here
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    // Group job seeker posts by category
    const groupedJobSeekerPosts = useMemo(() => {
        // Group by category
        const groupByCategory = jobSeekerPosts.reduce<
            Record<string, JobSeekerPost[]>
        >((groups, post) => {
            const category = post.category || "Uncategorized";
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(post);
            return groups;
        }, {});

        // Convert to section format
        return Object.entries(groupByCategory).map(([category, posts]) => ({
            title: category,
            data: posts,
            id: `category-${category}`,
        }));
    }, [jobSeekerPosts]);

    // Group referrer posts by company
    const groupedReferrerPosts = useMemo(() => {
        // Group by company
        const groupByCompany = referrerPosts.reduce<
            Record<string, ReferrerPost[]>
        >((groups, post) => {
            const company = post.company || "Other";
            if (!groups[company]) {
                groups[company] = [];
            }
            groups[company].push(post);
            return groups;
        }, {});

        // Convert to section format
        return Object.entries(groupByCompany).map(([company, posts]) => ({
            title: company,
            data: posts,
            id: `company-${company}`,
        }));
    }, [referrerPosts]);

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

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
        >
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

            <View style={{ flex: 1 }}>
                {activeTab === "jobSeeker" ? jobSeekerList : referrerList}
            </View>
            <FlatList<Post>
                data={
                    activeTab === "jobSeeker" ? jobSeekerPosts : referrerPosts
                }
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PostCard post={item} />}
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
        </SafeAreaView>
    );
}
