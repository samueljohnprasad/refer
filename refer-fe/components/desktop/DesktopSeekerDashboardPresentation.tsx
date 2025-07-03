import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { 
  SeekerMetrics, 
  ReferralRequest, 
  NetworkContact, 
  JobOpportunity, 
  RequestActivity 
} from './DesktopSeekerDashboard';

interface DesktopSeekerDashboardPresentationProps {
  theme: EnhancedThemeInterface;
  activeTab: 'overview' | 'requests' | 'network' | 'opportunities' | 'composer';
  selectedTimeRange: 'week' | 'month' | 'quarter' | 'year';
  loading: boolean;
  metrics: SeekerMetrics;
  requests: ReferralRequest[];
  networkContacts: NetworkContact[];
  opportunities: JobOpportunity[];
  activities: RequestActivity[];
  onTabChange: (tab: 'overview' | 'requests' | 'network' | 'opportunities' | 'composer') => void;
  onTimeRangeChange: (range: 'week' | 'month' | 'quarter' | 'year') => void;
  onRequestAction: (requestId: string, action: 'view' | 'message' | 'follow_up' | 'withdraw') => void;
  onNetworkAction: (contactId: string, action: 'message' | 'view_profile' | 'request_referral') => void;
  onOpportunityAction: (opportunityId: string, action: 'apply' | 'request_referral' | 'save' | 'dismiss') => void;
  onActivityAction: (activityId: string, action: 'mark_read' | 'view_details' | 'dismiss') => void;
  onCreateRequest: (requestData: Partial<ReferralRequest>) => void;
  onRefresh: () => void;
}

// Main Container (reusing styles from referrer dashboard)
const DashboardContainer = styled.View`
  flex: 1;
  background-color: #FAFBFC;
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
  border-bottom-color: #E5E7EB;
  margin-bottom: 32px;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const DashboardTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #1A202C;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
`;

const DashboardSubtitle = styled.Text`
  font-size: 16px;
  color: #718096;
  font-weight: 500;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const TimeRangeSelector = styled.View`
  flex-direction: row;
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  padding: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const TimeRangeButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 6px;
  background-color: ${props => props.active ? '#4299E1' : 'transparent'};
`;

const TimeRangeText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#FFFFFF' : '#4A5568'};
`;

const RefreshButton = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
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
  color: #4A5568;
`;

const CreateRequestButton = styled.TouchableOpacity`
  background-color: #4299E1;
  border-radius: 8px;
  padding: 10px 16px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const CreateRequestText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
`;

// Navigation Tabs (reusing from referrer)
const NavigationTabs = styled.ScrollView`
  margin-bottom: 32px;
`;

const TabsContainer = styled.View`
  flex-direction: row;
  gap: 8px;
  padding-bottom: 4px;
`;

const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${props => props.active ? '#4299E1' : '#FFFFFF'};
  border: 1px solid ${props => props.active ? '#4299E1' : '#E5E7EB'};
  border-radius: 8px;
  padding: 12px 20px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 120px;
`;

const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#FFFFFF' : '#4A5568'};
`;

const TabBadge = styled.View`
  background-color: #EF4444;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

const TabBadgeText = styled.Text`
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
`;

// Main Content Area
const ContentContainer = styled.View`
  flex: 1;
`;

const ContentGrid = styled.View`
  flex-direction: row;
  gap: 24px;
  align-items: flex-start;
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
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.View`
  padding: 20px 24px 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: #F1F5F9;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
`;

const SectionAction = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const SectionActionText = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #4299E1;
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
  background-color: #F7FAFC;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const DesktopSeekerDashboardPresentation: React.FC<DesktopSeekerDashboardPresentationProps> = ({
  theme,
  activeTab,
  selectedTimeRange,
  loading,
  metrics,
  requests,
  networkContacts,
  opportunities,
  activities,
  onTabChange,
  onTimeRangeChange,
  onRequestAction,
  onNetworkAction,
  onOpportunityAction,
  onActivityAction,
  onCreateRequest,
  onRefresh
}) => {
  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'dashboard', badge: null },
    { key: 'requests', label: 'My Requests', icon: 'send', badge: metrics.activeRequests },
    { key: 'network', label: 'Network', icon: 'people', badge: null },
    { key: 'opportunities', label: 'Opportunities', icon: 'work', badge: opportunities.length },
    { key: 'composer', label: 'New Request', icon: 'add-circle', badge: null }
  ] as const;

  const timeRanges = [
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'quarter', label: 'Quarter' },
    { key: 'year', label: 'Year' }
  ] as const;

  const unreadActivities = activities.filter(activity => !activity.read).length;

  const renderTabContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <MaterialIcons name="hourglass-empty" size={48} color="#4299E1" />
          <LoadingText>Loading your referral requests...</LoadingText>
        </LoadingContainer>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <ContentGrid>
            <MainContent>
              <SectionCard>
                <SectionHeader>
                  <SectionTitle>Request Overview</SectionTitle>
                </SectionHeader>
                <SectionContent>
                  <PlaceholderContent>
                    <PlaceholderIcon>
                      <MaterialIcons name="dashboard" size={32} color="#4299E1" />
                    </PlaceholderIcon>
                    <PlaceholderText>
                      Welcome to your referral request dashboard! Track your active requests, manage your network, and discover new opportunities.
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
                    <SectionActionText>View All</SectionActionText>
                    <MaterialIcons name="arrow-forward" size={16} color="#4299E1" />
                  </SectionAction>
                </SectionHeader>
                <SectionContent>
                  <PlaceholderContent>
                    <PlaceholderIcon>
                      <MaterialIcons name="notifications" size={32} color="#4299E1" />
                    </PlaceholderIcon>
                    <PlaceholderText>
                      Your recent referral request activities will appear here.
                    </PlaceholderText>
                  </PlaceholderContent>
                </SectionContent>
              </SectionCard>
            </Sidebar>
          </ContentGrid>
        );

      case 'requests':
        return (
          <SectionCard>
            <SectionHeader>
              <SectionTitle>My Referral Requests</SectionTitle>
              <SectionAction>
                <SectionActionText>View All</SectionActionText>
                <MaterialIcons name="arrow-forward" size={16} color="#4299E1" />
              </SectionAction>
            </SectionHeader>
            <SectionContent>
              <PlaceholderContent>
                <PlaceholderIcon>
                  <MaterialIcons name="send" size={32} color="#4299E1" />
                </PlaceholderIcon>
                <PlaceholderText>
                  Track the status of all your referral requests from submission to successful placement.
                </PlaceholderText>
              </PlaceholderContent>
            </SectionContent>
          </SectionCard>
        );

      case 'network':
        return (
          <SectionCard>
            <SectionHeader>
              <SectionTitle>My Network</SectionTitle>
              <SectionAction>
                <SectionActionText>Expand Network</SectionActionText>
                <MaterialIcons name="add" size={16} color="#4299E1" />
              </SectionAction>
            </SectionHeader>
            <SectionContent>
              <PlaceholderContent>
                <PlaceholderIcon>
                  <MaterialIcons name="people" size={32} color="#4299E1" />
                </PlaceholderIcon>
                <PlaceholderText>
                  Explore your professional network and discover who can help with referrals at target companies.
                </PlaceholderText>
              </PlaceholderContent>
            </SectionContent>
          </SectionCard>
        );

      case 'opportunities':
        return (
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Job Opportunities</SectionTitle>
              <SectionAction>
                <SectionActionText>View All Jobs</SectionActionText>
                <MaterialIcons name="arrow-forward" size={16} color="#4299E1" />
              </SectionAction>
            </SectionHeader>
            <SectionContent>
              <PlaceholderContent>
                <PlaceholderIcon>
                  <MaterialIcons name="work" size={32} color="#4299E1" />
                </PlaceholderIcon>
                <PlaceholderText>
                  Discover job opportunities where you have potential referrers in your network.
                </PlaceholderText>
              </PlaceholderContent>
            </SectionContent>
          </SectionCard>
        );

      case 'composer':
        return (
          <SectionCard>
            <SectionHeader>
              <SectionTitle>Create Referral Request</SectionTitle>
              <SectionAction>
                <SectionActionText>Templates</SectionActionText>
                <MaterialIcons name="library-books" size={16} color="#4299E1" />
              </SectionAction>
            </SectionHeader>
            <SectionContent>
              <PlaceholderContent>
                <PlaceholderIcon>
                  <MaterialIcons name="add-circle" size={32} color="#4299E1" />
                </PlaceholderIcon>
                <PlaceholderText>
                  Create and send personalized referral requests to your network connections.
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
          <DashboardSubtitle>Manage your referral requests and track opportunities</DashboardSubtitle>
        </HeaderLeft>

        <HeaderRight>
          <TimeRangeSelector>
            {timeRanges.map((range) => (
              <TimeRangeButton
                key={range.key}
                active={selectedTimeRange === range.key}
                onPress={() => onTimeRangeChange(range.key)}
              >
                <TimeRangeText active={selectedTimeRange === range.key}>
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

          <CreateRequestButton onPress={() => onTabChange('composer')}>
            <MaterialIcons 
              name="add" 
              size={16} 
              color="#FFFFFF" 
            />
            <CreateRequestText>New Request</CreateRequestText>
          </CreateRequestButton>
        </HeaderRight>
      </DashboardHeader>

      <NavigationTabs horizontal showsHorizontalScrollIndicator={false}>
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
                color={activeTab === tab.key ? '#FFFFFF' : '#4A5568'} 
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
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default DesktopSeekerDashboardPresentation;
