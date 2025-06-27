import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeInterface } from '../../constants/theme';
import { FilterConfig } from '../FilterBar';

interface DesktopFilterBarProps {
  filterConfig: FilterConfig;
  availableCategories: string[];
  availableSkills: string[];
  onFilterChange: (config: FilterConfig) => void;
  theme: ThemeInterface;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${props => props.theme.spacing.sm}px;
  flex-wrap: wrap;
`;

const FilterButton = styled.TouchableOpacity<{ isActive?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  background-color: ${props => props.isActive ? props.theme.colors.primaryLight : props.theme.colors.card};
  min-height: 36px;
`;

const FilterButtonText = styled.Text<{ isActive?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.xs}px;
`;

const FilterIcon = styled.View`
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.lg}px;
  padding: ${props => props.theme.spacing.lg}px;
  width: 90%;
  max-width: 400px;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md}px;
  padding-bottom: ${props => props.theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ModalTitle = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.sm}px;
`;

const OptionItem = styled.TouchableOpacity<{ isSelected?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin-bottom: ${props => props.theme.spacing.xs}px;
  background-color: ${props => props.isSelected ? props.theme.colors.primaryLight : 'transparent'};
`;

const OptionText = styled.Text<{ isSelected?: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.base}px;
  color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.text};
  flex: 1;
`;

const CheckIcon = styled.View`
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
`;

const AppliedJobsButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  margin-left: auto;
`;

const AppliedJobsText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.xs}px;
`;

const ReferredJobsButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const ReferredJobsText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.xs}px;
`;

const SavedSearchButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const SavedSearchText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-right: ${props => props.theme.spacing.xs}px;
`;

const DesktopFilterBar: React.FC<DesktopFilterBarProps> = ({
  filterConfig,
  availableCategories,
  availableSkills,
  onFilterChange,
  theme
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const workTypeOptions = [
    { key: 'all', label: 'All' },
    { key: 'full-time', label: 'Full-time' },
    { key: 'part-time', label: 'Part-time' },
    { key: 'contract', label: 'Contract' },
    { key: 'remote', label: 'Remote' },
    { key: 'hybrid', label: 'Hybrid' }
  ];

  const experienceLevelOptions = [
    { key: 'all', label: 'All' },
    { key: 'entry', label: 'Entry Level' },
    { key: 'mid', label: 'Mid-Senior Level' },
    { key: 'senior', label: 'Senior Level' },
    { key: 'executive', label: 'Executive' }
  ];

  const educationOptions = [
    { key: 'all', label: 'All' },
    { key: 'high-school', label: 'High School' },
    { key: 'associate', label: 'Associate Degree' },
    { key: 'bachelor', label: 'Bachelor\'s Degree' },
    { key: 'master', label: 'Master\'s Degree' },
    { key: 'phd', label: 'PhD' }
  ];

  const handleFilterPress = (filterType: string): void => {
    setActiveModal(filterType);
  };

  const handleCloseModal = (): void => {
    setActiveModal(null);
  };

  const handleWorkTypeSelect = (workType: string): void => {
    onFilterChange({
      ...filterConfig,
      workType
    });
    handleCloseModal();
  };

  const handleExperienceLevelSelect = (experienceLevel: string): void => {
    onFilterChange({
      ...filterConfig,
      experienceLevel
    });
    handleCloseModal();
  };

  const handleSkillToggle = (skill: string): void => {
    const newSkills = filterConfig.skills.includes(skill)
      ? filterConfig.skills.filter(s => s !== skill)
      : [...filterConfig.skills, skill];
    
    onFilterChange({
      ...filterConfig,
      skills: newSkills
    });
  };

  const getWorkTypeLabel = (): string => {
    const option = workTypeOptions.find(opt => opt.key === filterConfig.workType);
    return option?.label || 'All';
  };

  const getExperienceLevelLabel = (): string => {
    const option = experienceLevelOptions.find(opt => opt.key === filterConfig.experienceLevel);
    return option?.label || 'All';
  };

  const renderModal = (): React.ReactElement | null => {
    if (!activeModal) return null;

    let title = '';
    let options: { key: string; label: string }[] = [];
    let onSelect: (key: string) => void = () => {};
    let selectedKey = '';

    switch (activeModal) {
      case 'workType':
        title = 'Work Type';
        options = workTypeOptions;
        onSelect = handleWorkTypeSelect;
        selectedKey = filterConfig.workType || 'all';
        break;
      case 'experienceLevel':
        title = 'Experience Level';
        options = experienceLevelOptions;
        onSelect = handleExperienceLevelSelect;
        selectedKey = filterConfig.experienceLevel || 'all';
        break;
      case 'skills':
        return (
          <Modal
            visible={true}
            transparent
            animationType="fade"
            onRequestClose={handleCloseModal}
          >
            <ModalOverlay>
              <ModalContent theme={theme}>
                <ModalHeader theme={theme}>
                  <ModalTitle theme={theme}>Skills</ModalTitle>
                  <CloseButton onPress={handleCloseModal}>
                    <FontAwesome name="times" size={18} color={theme.colors.textSecondary} />
                  </CloseButton>
                </ModalHeader>
                
                <FlatList
                  data={availableSkills}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <OptionItem
                      theme={theme}
                      isSelected={filterConfig.skills.includes(item)}
                      onPress={() => handleSkillToggle(item)}
                    >
                      <OptionText
                        theme={theme}
                        isSelected={filterConfig.skills.includes(item)}
                      >
                        {item}
                      </OptionText>
                      <CheckIcon>
                        {filterConfig.skills.includes(item) && (
                          <FontAwesome
                            name="check"
                            size={14}
                            color={theme.colors.primary}
                          />
                        )}
                      </CheckIcon>
                    </OptionItem>
                  )}
                />
              </ModalContent>
            </ModalOverlay>
          </Modal>
        );
    }

    return (
      <Modal
        visible={true}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader theme={theme}>
              <ModalTitle theme={theme}>{title}</ModalTitle>
              <CloseButton onPress={handleCloseModal}>
                <FontAwesome name="times" size={18} color={theme.colors.textSecondary} />
              </CloseButton>
            </ModalHeader>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.key}
              renderItem={({ item }) => (
                <OptionItem
                  theme={theme}
                  isSelected={selectedKey === item.key}
                  onPress={() => onSelect(item.key)}
                >
                  <OptionText
                    theme={theme}
                    isSelected={selectedKey === item.key}
                  >
                    {item.label}
                  </OptionText>
                  <CheckIcon>
                    {selectedKey === item.key && (
                      <FontAwesome
                        name="check"
                        size={14}
                        color={theme.colors.primary}
                      />
                    )}
                  </CheckIcon>
                </OptionItem>
              )}
            />
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  };

  return (
    <Container theme={theme}>
      <FilterButton theme={theme} onPress={() => handleFilterPress('workType')}>
        <FilterButtonText theme={theme}>{getWorkTypeLabel()}</FilterButtonText>
        <FilterIcon theme={theme}>
          <FontAwesome name="chevron-down" size={12} color={theme.colors.textSecondary} />
        </FilterIcon>
      </FilterButton>

      <FilterButton theme={theme} onPress={() => handleFilterPress('experienceLevel')}>
        <FilterButtonText theme={theme}>{getExperienceLevelLabel()}</FilterButtonText>
        <FilterIcon theme={theme}>
          <FontAwesome name="chevron-down" size={12} color={theme.colors.textSecondary} />
        </FilterIcon>
      </FilterButton>

      <FilterButton 
        theme={theme} 
        isActive={filterConfig.skills.length > 0}
        onPress={() => handleFilterPress('skills')}
      >
        <FilterButtonText 
          theme={theme} 
          isActive={filterConfig.skills.length > 0}
        >
          Skills{filterConfig.skills.length > 0 ? ` (${filterConfig.skills.length})` : ''}
        </FilterButtonText>
        <FilterIcon theme={theme}>
          <FontAwesome 
            name="chevron-down" 
            size={12} 
            color={filterConfig.skills.length > 0 ? theme.colors.primary : theme.colors.textSecondary} 
          />
        </FilterIcon>
      </FilterButton>

      <AppliedJobsButton theme={theme}>
        <AppliedJobsText theme={theme}>Applied Jobs</AppliedJobsText>
      </AppliedJobsButton>

      <ReferredJobsButton theme={theme}>
        <ReferredJobsText theme={theme}>Referred Jobs</ReferredJobsText>
      </ReferredJobsButton>

      <SavedSearchButton theme={theme}>
        <FontAwesome name="bookmark" size={14} color={theme.colors.textSecondary} />
        <SavedSearchText theme={theme}>Saved Searches</SavedSearchText>
      </SavedSearchButton>

      {renderModal()}
    </Container>
  );
};

export default DesktopFilterBar;
