import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';

interface DesktopJobListHeaderProps {
  jobCount: number;
  onSortChange: (sortType: string) => void;
  theme: EnhancedThemeInterface;
}

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
`;

const JobCountText = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #1F2937;
`;

const SortContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 8px 16px;
  min-width: 120px;
`;

const SortText = styled.Text`
  font-size: 16px;
  color: #6B7280;
  margin-right: 8px;
`;

const DesktopJobListHeader: React.FC<DesktopJobListHeaderProps> = ({
  jobCount,
  onSortChange,
  theme
}) => {
  const [sortBy, setSortBy] = useState('Relevance');

  const handleSortPress = () => {
    // In a real implementation, this would show a dropdown
    // For now, we'll just cycle through options
    const sortOptions = ['Relevance', 'Date Posted', 'Salary', 'Company'];
    const currentIndex = sortOptions.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    const nextSort = sortOptions[nextIndex];
    setSortBy(nextSort);
    onSortChange(nextSort);
  };

  return (
    <HeaderContainer>
      <JobCountText>{jobCount} Jobs Found</JobCountText>
      <SortContainer onPress={handleSortPress}>
        <SortText>Sort by</SortText>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#6B7280" />
      </SortContainer>
    </HeaderContainer>
  );
};

export default DesktopJobListHeader;
