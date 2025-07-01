import React, { useState } from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { ReferralItem } from './DesktopReferrerDashboard';

interface ReferralPipelineProps {
  referrals: ReferralItem[];
  theme: EnhancedThemeInterface;
  onReferralAction: (referralId: string, action: 'view' | 'message' | 'follow_up') => void;
}

const PipelineContainer = styled.View`
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const PipelineHeader = styled.View`
  padding: 20px 24px 16px 24px;
  border-bottom-width: 1px;
  border-bottom-color: #F1F5F9;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.View`
  flex: 1;
`;

const PipelineTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 4px;
`;

const PipelineSubtitle = styled.Text`
  font-size: 14px;
  color: #718096;
  font-weight: 500;
`;

const HeaderRight = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const FilterButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background-color: #FFFFFF;
`;

const FilterText = styled.Text`
  font-size: 14px;
  color: #4A5568;
  font-weight: 500;
`;

const PipelineContent = styled.ScrollView`
  padding: 20px 24px;
  max-height: 600px;
`;

// Referral Card Components
const ReferralCard = styled.TouchableOpacity<{ expanded: boolean }>`
  background-color: #FAFBFC;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const CardHeader = styled.View`
  padding: 16px 20px;
  background-color: #FFFFFF;
  border-bottom-width: 1px;
  border-bottom-color: #F1F5F9;
`;

const CardHeaderTop = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CandidateInfo = styled.View`
  flex: 1;
`;

const CandidateName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 4px;
`;

const JobTitle = styled.Text`
  font-size: 14px;
  color: #4A5568;
  font-weight: 500;
  margin-bottom: 2px;
`;

const CompanyName = styled.Text`
  font-size: 14px;
  color: #718096;
  font-weight: 500;
`;

const StatusBadge = styled.View<{ status: ReferralItem['status'] }>`
  padding: 6px 12px;
  border-radius: 12px;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#FEF3C7';
      case 'submitted': return '#DBEAFE';
      case 'reviewing': return '#E0E7FF';
      case 'interviewing': return '#FCE7F3';
      case 'hired': return '#D1FAE5';
      case 'rejected': return '#FEE2E2';
      default: return '#F3F4F6';
    }
  }};
`;

const StatusText = styled.Text<{ status: ReferralItem['status'] }>`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#92400E';
      case 'submitted': return '#1E40AF';
      case 'reviewing': return '#3730A3';
      case 'interviewing': return '#BE185D';
      case 'hired': return '#065F46';
      case 'rejected': return '#DC2626';
      default: return '#4B5563';
    }
  }};
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ProgressBar = styled.View`
  flex: 1;
  height: 6px;
  background-color: #F1F5F9;
  border-radius: 3px;
  margin: 0 12px;
`;

const ProgressFill = styled.View<{ progress: number }>`
  height: 100%;
  background-color: #4299E1;
  border-radius: 3px;
  width: ${props => props.progress}%;
`;

const ProgressStage = styled.Text`
  font-size: 12px;
  color: #718096;
  font-weight: 500;
`;

const CardMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MetaInfo = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const MetaText = styled.Text`
  font-size: 12px;
  color: #718096;
  font-weight: 500;
`;

const RewardBadge = styled.View`
  background-color: #EFF6FF;
  border: 1px solid #DBEAFE;
  padding: 4px 8px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const RewardText = styled.Text`
  font-size: 12px;
  color: #1D4ED8;
  font-weight: 600;
`;

// Expanded Content
const ExpandedContent = styled.View<{ visible: boolean }>`
  display: ${props => props.visible ? 'flex' : 'none'};
  padding: 16px 20px;
  background-color: #FAFBFC;
`;

const NotesSection = styled.View`
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 8px;
`;

const NotesText = styled.Text`
  font-size: 14px;
  color: #4A5568;
  line-height: 20px;
`;

const ActionButtons = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const ActionButton = styled.TouchableOpacity<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 6px;
  background-color: ${props => props.variant === 'primary' ? '#4299E1' : '#FFFFFF'};
  border: 1px solid ${props => props.variant === 'primary' ? '#4299E1' : '#E5E7EB'};
`;

const ActionButtonText = styled.Text<{ variant: 'primary' | 'secondary' }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.variant === 'primary' ? '#FFFFFF' : '#4A5568'};
`;

const EmptyState = styled.View`
  padding: 40px;
  align-items: center;
`;

const EmptyStateIcon = styled.View`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: #F7FAFC;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const EmptyStateTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #2D3748;
  text-align: center;
  margin-bottom: 8px;
`;

const EmptyStateText = styled.Text`
  font-size: 14px;
  color: #718096;
  text-align: center;
  line-height: 20px;
`;

const ReferralPipeline: React.FC<ReferralPipelineProps> = ({
  referrals,
  theme,
  onReferralAction
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<ReferralItem['status'] | 'all'>('all');

  const filteredReferrals = referrals.filter(referral => 
    filterStatus === 'all' || referral.status === filterStatus
  );

  const activeReferrals = referrals.filter(referral => 
    ['pending', 'submitted', 'reviewing', 'interviewing'].includes(referral.status)
  );

  const toggleExpanded = (referralId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(referralId)) {
      newExpanded.delete(referralId);
    } else {
      newExpanded.add(referralId);
    }
    setExpandedItems(newExpanded);
  };

  const getProgressPercentage = (stage: number): number => {
    return Math.min((stage / 9) * 100, 100);
  };

  const getProgressLabel = (stage: number): string => {
    const stages = [
      'Request Created',
      'Referrer Notified', 
      'Profile Reviewed',
      'Referral Submitted',
      'Application Review',
      'Phone Screening',
      'Interview Process',
      'Final Decision',
      'Placement Complete'
    ];
    return stages[Math.min(stage - 1, stages.length - 1)] || 'In Progress';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (activeReferrals.length === 0) {
    return (
      <PipelineContainer>
        <PipelineHeader>
          <HeaderLeft>
            <PipelineTitle>Referral Pipeline</PipelineTitle>
            <PipelineSubtitle>No active referrals</PipelineSubtitle>
          </HeaderLeft>
        </PipelineHeader>
        <EmptyState>
          <EmptyStateIcon>
            <MaterialIcons name="timeline" size={32} color="#4299E1" />
          </EmptyStateIcon>
          <EmptyStateTitle>No Active Referrals</EmptyStateTitle>
          <EmptyStateText>
            Your active referral pipeline will appear here once you start helping candidates get opportunities through your network.
          </EmptyStateText>
        </EmptyState>
      </PipelineContainer>
    );
  }

  return (
    <PipelineContainer>
      <PipelineHeader>
        <HeaderLeft>
          <PipelineTitle>Referral Pipeline</PipelineTitle>
          <PipelineSubtitle>{activeReferrals.length} active referrals</PipelineSubtitle>
        </HeaderLeft>
        <HeaderRight>
          <FilterButton onPress={() => console.log('Filter')}>
            <MaterialIcons name="filter-list" size={16} color="#4A5568" />
            <FilterText>Filter</FilterText>
          </FilterButton>
        </HeaderRight>
      </PipelineHeader>

      <PipelineContent showsVerticalScrollIndicator={false}>
        {filteredReferrals.map((referral) => {
          const isExpanded = expandedItems.has(referral.id);
          const progressPercentage = getProgressPercentage(referral.stage);
          const progressLabel = getProgressLabel(referral.stage);

          return (
            <ReferralCard
              key={referral.id}
              expanded={isExpanded}
              onPress={() => toggleExpanded(referral.id)}
              activeOpacity={0.7}
            >
              <CardHeader>
                <CardHeaderTop>
                  <CandidateInfo>
                    <CandidateName>{referral.candidateName}</CandidateName>
                    <JobTitle>{referral.jobTitle}</JobTitle>
                    <CompanyName>{referral.company}</CompanyName>
                  </CandidateInfo>
                  <StatusBadge status={referral.status}>
                    <StatusText status={referral.status}>
                      {referral.status}
                    </StatusText>
                  </StatusBadge>
                </CardHeaderTop>

                <ProgressContainer>
                  <ProgressStage>Stage {referral.stage}/9</ProgressStage>
                  <ProgressBar>
                    <ProgressFill progress={progressPercentage} />
                  </ProgressBar>
                  <ProgressStage>{progressLabel}</ProgressStage>
                </ProgressContainer>

                <CardMeta>
                  <MetaInfo>
                    <MetaItem>
                      <MaterialIcons name="schedule" size={14} color="#718096" />
                      <MetaText>Updated {formatDate(referral.lastUpdated)}</MetaText>
                    </MetaItem>
                    <MetaItem>
                      <MaterialIcons name="event" size={14} color="#718096" />
                      <MetaText>Submitted {formatDate(referral.submittedDate)}</MetaText>
                    </MetaItem>
                  </MetaInfo>
                  <RewardBadge>
                    <MaterialIcons name="card-giftcard" size={12} color="#1D4ED8" />
                    <RewardText>{formatCurrency(referral.reward)}</RewardText>
                  </RewardBadge>
                </CardMeta>
              </CardHeader>

              <ExpandedContent visible={isExpanded}>
                {referral.notes && (
                  <NotesSection>
                    <SectionTitle>Notes & Updates</SectionTitle>
                    <NotesText>{referral.notes}</NotesText>
                  </NotesSection>
                )}

                <ActionButtons>
                  <ActionButton 
                    variant="primary" 
                    onPress={() => onReferralAction(referral.id, 'view')}
                  >
                    <MaterialIcons name="visibility" size={16} color="#FFFFFF" />
                    <ActionButtonText variant="primary">View Details</ActionButtonText>
                  </ActionButton>
                  <ActionButton 
                    variant="secondary" 
                    onPress={() => onReferralAction(referral.id, 'message')}
                  >
                    <MaterialIcons name="message" size={16} color="#4A5568" />
                    <ActionButtonText variant="secondary">Message</ActionButtonText>
                  </ActionButton>
                  <ActionButton 
                    variant="secondary" 
                    onPress={() => onReferralAction(referral.id, 'follow_up')}
                  >
                    <MaterialIcons name="follow-the-signs" size={16} color="#4A5568" />
                    <ActionButtonText variant="secondary">Follow Up</ActionButtonText>
                  </ActionButton>
                </ActionButtons>
              </ExpandedContent>
            </ReferralCard>
          );
        })}
      </PipelineContent>
    </PipelineContainer>
  );
};

export default ReferralPipeline;
