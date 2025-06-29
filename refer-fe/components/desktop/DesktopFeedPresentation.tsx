import React from 'react';
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Post, TabType } from '../../types/posts';
import { FilterConfig } from '../FilterBar';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import DesktopSearchHeader from './DesktopSearchHeader';
import DesktopFilterBar from './DesktopFilterBar';
import DesktopJobCard from './DesktopJobCard';
import DesktopTabSwitcher from './DesktopTabSwitcher';
import DesktopJobListHeader from './DesktopJobListHeader';

interface DesktopFeedPresentationProps {
  // Data props
  posts: Post[];
  isLoading: boolean;
  error: any;
  refreshing: boolean;
  isFetching: boolean;
  
  // State props
  activeTab: TabType;
  searchQuery: string;
  locationQuery: string;
  filterConfig: FilterConfig;
  availableCategories: string[];
  availableSkills: string[];
  
  // Action props
  onTabChange: (tab: TabType) => void;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: string) => void;
  onFilterChange: (config: FilterConfig) => void;
  onRefresh: () => void;
  onApply: (post: Post) => void;
  onRefer: (post: Post) => void;
  
  // Theme
  theme: EnhancedThemeInterface;
  isDesktop: boolean;
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  max-width: 1400px;
  align-self: center;
  width: 100%;
`;

const Header = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing['2xl']}px ${props => props.theme.spacing['3xl']}px;
`;

const MainContent = styled.View`
  flex: 1;
  flex-direction: row;
  padding: ${props => props.theme.spacing['3xl']}px;
  gap: ${props => props.theme.spacing['3xl']}px;
`;

const LeftColumn = styled.View`
  flex: 2;
  min-height: 100%;
`;

const RightColumn = styled.View`
  flex: 1;
  min-width: 300px;
  max-width: 400px;
`;

const JobsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const JobsCount = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.typography.fontFamily.primary};
`;

const SortBy = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.Text`
  font-size: 14px;
  color: #6B7280;
`;

const SortButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 6px;
  border-width: 1px;
  border-color: #E5E7EB;
  background-color: #FFFFFF;
`;

const SortButtonText = styled.Text`
  font-size: 14px;
  color: #374151;
`;

const JobsList = styled.ScrollView`
  flex: 1;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['3xl']}px;
`;

const ErrorText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.error};
  text-align: center;
`;

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing['3xl']}px;
`;

const EmptyStateText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const RightSidebar = styled.View`
  background-color: #FFFFFF;
  border-radius: 8px;
  border-width: 1px;
  border-color: #E5E7EB;
  padding: 20px;
  height: fit-content;
`;

const SidebarTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px;
`;

const SidebarContent = styled.Text`
  font-size: 14px;
  color: #6B7280;
  line-height: 20px;
`;

const DesktopFeedPresentation: React.FC<DesktopFeedPresentationProps> = ({
  posts,
  isLoading,
  error,
  refreshing,
  isFetching,
  activeTab,
  searchQuery,
  locationQuery,
  filterConfig,
  availableCategories,
  availableSkills,
  onTabChange,
  onSearchChange,
  onLocationChange,
  onFilterChange,
  onRefresh,
  onApply,
  onRefer,
  theme,
  isDesktop
}) => {
  const jobsCountText = `${posts.length} Job${posts.length !== 1 ? 's' : ''} Found`;

  if (!isDesktop) {
    // Fallback to mobile view if not desktop
    return null;
  }

  const renderContent = (): React.ReactElement => {
    if (isLoading && !refreshing) {
      return (
        <LoadingContainer>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </LoadingContainer>
      );
    }

    if (error) {
      return (
        <ErrorContainer>
          <ErrorText>
            Failed to load posts. Please try again.
          </ErrorText>
        </ErrorContainer>
      );
    }

    if (posts.length === 0) {
      return (
        <EmptyState>
          <EmptyStateText>
            No jobs found matching your criteria.{'\n'}
            Try adjusting your filters or search terms.
          </EmptyStateText>
        </EmptyState>
      );
    }

    return (
      <JobsList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      >
        <DesktopJobListHeader 
          jobCount={posts.length}
          onSortChange={(sortType) => console.log('Sort by:', sortType)}
          theme={theme}
        />
        {posts.map((post, index) => (
          <DesktopJobCard
            key={('_id' in post ? post._id : post.id) || index}
            post={post}
            onApply={() => onApply(post)}
            onRefer={() => onRefer(post)}
            theme={theme}
            index={index}
          />
        ))}
      </JobsList>
    );
  };

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <DesktopSearchHeader
          searchQuery={searchQuery}
          locationQuery={locationQuery}
          onSearchChange={onSearchChange}
          onLocationChange={onLocationChange}
          theme={theme}
        />
        
        <View style={{ marginTop: theme.spacing.md }}>
          <DesktopFilterBar
            filterConfig={filterConfig}
            availableCategories={availableCategories}
            availableSkills={availableSkills}
            onFilterChange={onFilterChange}
            theme={theme}
          />
        </View>
      </Header>

      <MainContent theme={theme}>
        <LeftColumn>
          <DesktopTabSwitcher
            activeTab={activeTab}
            onTabChange={onTabChange}
            theme={theme}
            jobSeekerCount={activeTab === TabType.JobSeeker ? posts.length : 0}
            referrerCount={activeTab === TabType.Referrer ? posts.length : 0}
          />

          {renderContent()}
        </LeftColumn>

        <RightColumn>
          <RightSidebar theme={theme}>
            <SidebarTitle theme={theme}>Quick Tips</SidebarTitle>
            <SidebarContent theme={theme}>
              • Use specific keywords in your search{'\n'}
              • Filter by skills to find relevant opportunities{'\n'}
              • Check back regularly for new postings{'\n'}
              • Apply early for better chances
            </SidebarContent>
          </RightSidebar>
        </RightColumn>
      </MainContent>
    </Container>
  );
};

export default DesktopFeedPresentation;
