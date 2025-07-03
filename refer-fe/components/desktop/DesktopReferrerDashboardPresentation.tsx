import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { EnhancedThemeInterface } from "../../constants/enhancedTheme";
import ReferralPipeline from "./ReferralPipeline";
import {
    ReferralMetrics,
    ReferralItem,
    NetworkConnection,
    ReferralOpportunity,
    DashboardActivity,
} from "./DesktopReferrerDashboard";

interface DesktopReferrerDashboardPresentationProps {
    theme: EnhancedThemeInterface;
    activeTab:
        | "overview"
        | "pipeline"
        | "network"
        | "opportunities"
        | "analytics";
    selectedTimeRange: "week" | "month" | "quarter" | "year";
    loading: boolean;
    metrics: ReferralMetrics;
    referrals: ReferralItem[];
    networkConnections: NetworkConnection[];
    opportunities: ReferralOpportunity[];
    activities: DashboardActivity[];
    onTabChange: (
        tab: "overview" | "pipeline" | "network" | "opportunities" | "analytics"
    ) => void;
    onTimeRangeChange: (range: "week" | "month" | "quarter" | "year") => void;
    onReferralAction: (
        referralId: string,
        action: "view" | "message" | "follow_up"
    ) => void;
    onOpportunityAction: (
        opportunityId: string,
        action: "refer" | "save" | "dismiss"
    ) => void;
    onNetworkAction: (
        connectionId: string,
        action: "message" | "view_profile" | "request_referral"
    ) => void;
    onActivityAction: (
        activityId: string,
        action: "mark_read" | "take_action" | "dismiss"
    ) => void;
    onRefresh: () => void;
}

// Main Container
const DashboardContainer = styled.View`
    flex: 1;
    background-color: #fafbfc;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
`;

const DashboardHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 32px 0 24px 0;
    border-bottom-width: 1px;
    border-bottom-color: #e5e7eb;
    margin-bottom: 32px;
`;

const HeaderLeft = styled.View`
    flex: 1;
`;

const DashboardTitle = styled.Text`
    font-size: 24px;
    font-weight: 700;
    color: #1a202c;
    letter-spacing: -0.5px;
    margin-bottom: 4px;
`;

const DashboardSubtitle = styled.Text`
    font-size: 15px;
    color: #718096;
    font-weight: 400;
`;

const HeaderRight = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 16px;
`;

const TimeRangeSelector = styled.View`
    flex-direction: row;
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    padding: 4px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TimeRangeButton = styled.TouchableOpacity<{ active: boolean }>`
    padding: 8px 16px;
    border-radius: 6px;
    background-color: ${(props) => (props.active ? "#4299E1" : "transparent")};
`;

const TimeRangeText = styled.Text<{ active: boolean }>`
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => (props.active ? "#FFFFFF" : "#4A5568")};
`;

const RefreshButton = styled.TouchableOpacity`
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 16px;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const RefreshButtonText = styled.Text`
    font-size: 14px;
    font-weight: 600;
    color: #4a5568;
`;

// Navigation Tabs
const NavigationTabs = styled.View`
    margin-bottom: 24px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const TabsContainer = styled.View`
    flex-direction: row;
    gap: 24px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 8px 0;
    border-bottom-width: ${(props) => (props.active ? '2px' : '0')};
    border-bottom-color: ${(props) => (props.active ? '#4299E1' : 'transparent')};
`;

const TabText = styled.Text<{ active: boolean }>`
    font-size: 14px;
    font-weight: ${(props) => (props.active ? '600' : '500')};
    color: ${(props) => (props.active ? '#1A202C' : '#718096')};
`;

const TabBadge = styled.View`
    background-color: #ef4444;
    border-radius: 12px;
    min-width: 20px;
    height: 20px;
    align-items: center;
    justify-content: center;
    padding: 0 6px;
`;

const TabBadgeText = styled.Text`
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
`;

// Main Content Area
const ContentContainer = styled.View`
    flex: 1;
    min-height: 400px;
`;

const ContentGrid = styled.View`
    flex-direction: row;
    gap: 24px;
    align-items: flex-start;
    width: 100%;
    padding: 0 24px;
`;

const MainContent = styled.View`
    flex: 2;
    gap: 24px;
`;

const Sidebar = styled.View`
    flex: 1;
    gap: 24px;
    max-width: 380px;
`;

// Section Components
const SectionCard = styled.View`
    background-color: #ffffff;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.View`
    padding: 20px 24px 16px 24px;
    border-bottom-width: 1px;
    border-bottom-color: #f1f5f9;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.Text`
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
`;

const SectionAction = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    gap: 4px;
`;

const SectionActionText = styled.Text`
    font-size: 14px;
    font-weight: 600;
    color: #4299e1;
`;

const SectionContent = styled.View`
    padding: 20px 24px;
`;

// Loading States
const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    padding: 60px;
`;

const LoadingText = styled.Text`
    font-size: 16px;
    color: #718096;
    margin-top: 16px;
`;

// Placeholder Content
const PlaceholderContent = styled.View`
    padding: 40px;
    align-items: center;
`;

const PlaceholderText = styled.Text`
    font-size: 16px;
    color: #718096;
    text-align: center;
    line-height: 24px;
`;

const PlaceholderIcon = styled.View`
    width: 64px;
    height: 64px;
    border-radius: 32px;
    background-color: #f7fafc;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
`;

const DesktopReferrerDashboardPresentation: React.FC<
    DesktopReferrerDashboardPresentationProps
> = ({
    theme,
    activeTab,
    selectedTimeRange,
    loading,
    metrics,
    referrals,
    networkConnections,
    opportunities,
    activities,
    onTabChange,
    onTimeRangeChange,
    onReferralAction,
    onOpportunityAction,
    onNetworkAction,
    onActivityAction,
    onRefresh,
}) => {
    const tabs = [
        { key: "overview", label: "Overview", icon: "grid-view", badge: null },
        {
            key: "pipeline",
            label: "My Requests",
            icon: "description",
            badge: metrics.activeReferrals,
        },
        { key: "network", label: "Network", icon: "people", badge: null },
        {
            key: "opportunities",
            label: "Opportunities",
            icon: "work",
            badge: opportunities.length,
        },
        {
            key: "analytics",
            label: "New Request",
            icon: "add-circle-outline",
            badge: null,
        },
    ] as const;

    const timeRanges = [
        { key: "week", label: "Week" },
        { key: "month", label: "Month" },
        { key: "quarter", label: "Quarter" },
        { key: "year", label: "Year" },
    ] as const;

    const renderTabContent = () => {
        if (loading) {
            return (
                <LoadingContainer>
                    <MaterialIcons
                        name="hourglass-empty"
                        size={48}
                        color="#4299E1"
                    />
                    <LoadingText>
                        Loading your referral dashboard...
                    </LoadingText>
                </LoadingContainer>
            );
        }

        switch (activeTab) {
            case "overview":
                return (
                    <ContentGrid>
                        <MainContent>
                            <SectionCard>
                                <SectionHeader>
                                    <SectionTitle>Quick Overview</SectionTitle>
                                </SectionHeader>
                                <SectionContent>
                                    <PlaceholderContent>
                                        <PlaceholderIcon>
                                            <MaterialIcons
                                                name="dashboard"
                                                size={32}
                                                color="#4299E1"
                                            />
                                        </PlaceholderIcon>
                                        <PlaceholderText>
                                            Welcome to your referral dashboard!
                                            Here you'll see key metrics, recent
                                            activities, and actionable insights
                                            to help you succeed.
                                        </PlaceholderText>
                                    </PlaceholderContent>
                                </SectionContent>
                            </SectionCard>
                        </MainContent>

                        <Sidebar>
                            <SectionCard>
                                <SectionHeader>
                                    <SectionTitle>Recent Activity</SectionTitle>
                                    <SectionAction>
                                        <SectionActionText>
                                            View All
                                        </SectionActionText>
                                        <MaterialIcons
                                            name="arrow-forward"
                                            size={16}
                                            color="#4299E1"
                                        />
                                    </SectionAction>
                                </SectionHeader>
                                <SectionContent>
                                    <PlaceholderContent>
                                        <PlaceholderIcon>
                                            <MaterialIcons
                                                name="notifications"
                                                size={32}
                                                color="#4299E1"
                                            />
                                        </PlaceholderIcon>
                                        <PlaceholderText>
                                            Your recent referral activities will
                                            appear here.
                                        </PlaceholderText>
                                    </PlaceholderContent>
                                </SectionContent>
                            </SectionCard>
                        </Sidebar>
                    </ContentGrid>
                );

            case "pipeline":
                return (
                    <ReferralPipeline
                        referrals={referrals}
                        theme={theme}
                        onReferralAction={onReferralAction}
                    />
                );

            case "network":
                return (
                    <SectionCard>
                        <SectionHeader>
                            <SectionTitle>Professional Network</SectionTitle>
                            <SectionAction>
                                <SectionActionText>
                                    Expand Network
                                </SectionActionText>
                                <MaterialIcons
                                    name="add"
                                    size={16}
                                    color="#4299E1"
                                />
                            </SectionAction>
                        </SectionHeader>
                        <SectionContent>
                            <PlaceholderContent>
                                <PlaceholderIcon>
                                    <MaterialIcons
                                        name="people"
                                        size={32}
                                        color="#4299E1"
                                    />
                                </PlaceholderIcon>
                                <PlaceholderText>
                                    Manage your professional connections and
                                    discover new referral opportunities through
                                    your network.
                                </PlaceholderText>
                            </PlaceholderContent>
                        </SectionContent>
                    </SectionCard>
                );

            case "opportunities":
                return (
                    <SectionCard>
                        <SectionHeader>
                            <SectionTitle>Referral Opportunities</SectionTitle>
                            <SectionAction>
                                <SectionActionText>View All</SectionActionText>
                                <MaterialIcons
                                    name="arrow-forward"
                                    size={16}
                                    color="#4299E1"
                                />
                            </SectionAction>
                        </SectionHeader>
                        <SectionContent>
                            <PlaceholderContent>
                                <PlaceholderIcon>
                                    <MaterialIcons
                                        name="lightbulb"
                                        size={32}
                                        color="#4299E1"
                                    />
                                </PlaceholderIcon>
                                <PlaceholderText>
                                    Discover new referral opportunities matched
                                    to your network and expertise.
                                </PlaceholderText>
                            </PlaceholderContent>
                        </SectionContent>
                    </SectionCard>
                );

            case "analytics":
                return (
                    <SectionCard>
                        <SectionHeader>
                            <SectionTitle>Performance Analytics</SectionTitle>
                            <SectionAction>
                                <SectionActionText>
                                    Export Data
                                </SectionActionText>
                                <MaterialIcons
                                    name="download"
                                    size={16}
                                    color="#4299E1"
                                />
                            </SectionAction>
                        </SectionHeader>
                        <SectionContent>
                            <PlaceholderContent>
                                <PlaceholderIcon>
                                    <MaterialIcons
                                        name="bar-chart"
                                        size={32}
                                        color="#4299E1"
                                    />
                                </PlaceholderIcon>
                                <PlaceholderText>
                                    Analyze your referral performance, success
                                    rates, and earnings over time.
                                </PlaceholderText>
                            </PlaceholderContent>
                        </SectionContent>
                    </SectionCard>
                );

            default:
                return null;
        }
    };

    return (
        <DashboardContainer>
            <DashboardHeader>
                <HeaderLeft>
                    <DashboardTitle>My Referral Requests</DashboardTitle>
                    <DashboardSubtitle>
                        Manage your referral requests and track opportunities
                    </DashboardSubtitle>
                </HeaderLeft>

                <HeaderRight>
                    <TimeRangeSelector>
                        {timeRanges.map((range) => (
                            <TimeRangeButton
                                key={range.key}
                                active={selectedTimeRange === range.key}
                                onPress={() => onTimeRangeChange(range.key)}
                            >
                                <TimeRangeText
                                    active={selectedTimeRange === range.key}
                                >
                                    {range.label}
                                </TimeRangeText>
                            </TimeRangeButton>
                        ))}
                    </TimeRangeSelector>

                    <RefreshButton onPress={onRefresh}>
                        <MaterialIcons
                            name="refresh"
                            size={16}
                            color="#4A5568"
                        />
                        <RefreshButtonText>Refresh</RefreshButtonText>
                    </RefreshButton>
                </HeaderRight>
            </DashboardHeader>

            <NavigationTabs>
                <TabsContainer>
                    {tabs.map((tab) => (
                        <TabButton
                            key={tab.key}
                            active={activeTab === tab.key}
                            onPress={() => onTabChange(tab.key)}
                        >
                            <MaterialIcons
                                name={tab.icon as any}
                                size={18}
                                color={activeTab === tab.key ? '#4299E1' : '#718096'}
                            />
                            <TabText active={activeTab === tab.key}>
                                {tab.label}
                            </TabText>
                            {tab.badge && tab.badge > 0 && (
                                <TabBadge>
                                    <TabBadgeText>{tab.badge}</TabBadgeText>
                                </TabBadge>
                            )}
                        </TabButton>
                    ))}
                </TabsContainer>
            </NavigationTabs>

            <ContentContainer>
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
                >
                    {renderTabContent()}
                </ScrollView>
            </ContentContainer>
        </DashboardContainer>
    );
};

export default DesktopReferrerDashboardPresentation;
