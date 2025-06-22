import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../context/ThemeContext';

interface ProfileStatsProps {
  connections: number;
  referrals: number;
  endorsements: number;
  completionPercentage: number;
  onStatsPress?: (statsType: string) => void;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  connections,
  referrals,
  endorsements,
  completionPercentage,
  onStatsPress
}) => {
  const { theme } = useTheme();

  return (
    <Container>
      <StatsRow>
        <StatItem onPress={() => onStatsPress?.('connections')}>
          <StatValue>{connections}</StatValue>
          <StatLabel>Connections</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem onPress={() => onStatsPress?.('referrals')}>
          <StatValue>{referrals}</StatValue>
          <StatLabel>Referrals</StatLabel>
        </StatItem>
        <StatDivider />
        <StatItem onPress={() => onStatsPress?.('endorsements')}>
          <StatValue>{endorsements}</StatValue>
          <StatLabel>Endorsements</StatLabel>
        </StatItem>
      </StatsRow>

      <CompletionSection>
        <CompletionHeader>
          <CompletionTitle>Profile Completion</CompletionTitle>
          <CompletionPercentage>{completionPercentage}%</CompletionPercentage>
        </CompletionHeader>
        <ProgressBarContainer>
          <ProgressBar width={completionPercentage} />
        </ProgressBarContainer>
        {completionPercentage < 100 && (
          <CompletionMessage>Complete your profile to increase visibility</CompletionMessage>
        )}
      </CompletionSection>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin: 16px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
`;

const StatItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 4px;
`;

const StatDivider = styled.View`
  width: 1px;
  height: 24px;
  background-color: ${props => props.theme.colors.border};
`;

const CompletionSection = styled.View`
  margin-top: 8px;
  padding-top: 16px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const CompletionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CompletionTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CompletionPercentage = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

const ProgressBarContainer = styled.View`
  height: 6px;
  background-color: ${props => props.theme.colors.background};
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressBar = styled.View<{ width: number }>`
  height: 100%;
  width: ${props => props.width}%;
  background-color: ${props => props.theme.colors.primary};
`;

const CompletionMessage = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 8px;
`;

export default ProfileStats;
