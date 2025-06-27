import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../context/ThemeContext';

export type SortOption = 'newest' | 'popular' | 'expiring';
export type FilterConfig = {
  query: string;
  sortBy: SortOption;
  categories: string[];
  skills: string[];
  experienceLevel?: string;
  workType?: string;
  showExpired?: boolean;
};

interface FilterBarProps {
  availableCategories?: string[];
  availableSkills?: string[];
  onFilterChange: (config: FilterConfig) => void;
  initialConfig?: FilterConfig;
}

const Container = styled.View`
  margin: 8px 16px;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  overflow: hidden;
`;

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  padding: 8px;
`;

const FilterButton = styled.TouchableOpacity`
  padding: 8px;
`;

const FilterIndicator = styled.View<{active: boolean}>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  position: absolute;
  top: 6px;
  right: 6px;
`;

const SortContainer = styled.View`
  flex-direction: row;
  padding: 8px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SortOption = styled.TouchableOpacity<{selected: boolean}>`
  padding: 6px 12px;
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.background};
  border-radius: 16px;
  margin-right: 8px;
  flex-direction: row;
  align-items: center;
`;

const SortText = styled.Text<{selected: boolean}>`
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  font-size: 14px;
  margin-left: 4px;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.card};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ApplyButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 8px;
`;

const ApplyText = styled.Text`
  color: white;
  font-weight: bold;
`;

const FilterSection = styled.View`
  padding: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const ChipsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Chip = styled.TouchableOpacity<{selected: boolean}>`
  background-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.card};
  padding: 8px 12px;
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${props => props.selected ? props.theme.colors.primary : props.theme.colors.border};
`;

const ChipText = styled.Text<{selected: boolean}>`
  color: ${props => props.selected ? 'white' : props.theme.colors.text};
  font-size: 14px;
`;

const Suggestions = styled.View`
  position: absolute;
  top: 56px;
  left: 16px;
  right: 16px;
  max-height: 200px;
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  z-index: 100;
`;

const SuggestionItem = styled.TouchableOpacity`
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SuggestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 14px;
`;

const HighlightText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

export default function FilterBar({
  availableCategories,
  availableSkills,
  onFilterChange,
  initialConfig = { query: '', sortBy: 'newest', categories: [], skills: [] }
}: FilterBarProps) {
  const { theme } = useTheme();
  const [query, setQuery] = useState(initialConfig.query);
  const [sortBy, setSortBy] = useState<SortOption>(initialConfig.sortBy);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialConfig.categories);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialConfig.skills);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Check if any filters are active
  const hasActiveFilters = selectedCategories.length > 0 || selectedSkills.length > 0;

  // Search suggestions based on query
  const updateSuggestions = (text: string) => {
    setQuery(text);
    
    if (text.length > 1) {
      // Generate suggestions from skills and categories
      const skillSuggestions = (availableSkills || []).filter(skill => 
        skill.toLowerCase().includes(text.toLowerCase())
      );
      
      const categorySuggestions = (availableCategories || []).filter(category => 
        category.toLowerCase().includes(text.toLowerCase())
      );
      
      const allSuggestions = [...skillSuggestions, ...categorySuggestions];
      
      // Limit to top 5 suggestions
      setSuggestions(Array.from(new Set(allSuggestions)).slice(0, 5));
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    
    // Apply the filter change
    onFilterChange({
      query: suggestion,
      sortBy,
      categories: selectedCategories,
      skills: selectedSkills
    });
  };

  // Toggle a category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Toggle a skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(s => s !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Apply filters from modal
  const applyFilters = () => {
    setShowFilterModal(false);
    onFilterChange({
      query,
      sortBy,
      categories: selectedCategories,
      skills: selectedSkills
    });
  };

  // Change sort option
  const changeSortOption = (option: SortOption) => {
    setSortBy(option);
    onFilterChange({
      query,
      sortBy: option,
      categories: selectedCategories,
      skills: selectedSkills
    });
  };

  // Filter modal content
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showFilterModal}
      onRequestClose={() => setShowFilterModal(false)}
    >
      <ModalContainer>
        <ModalHeader>
          <CloseButton onPress={() => setShowFilterModal(false)}>
            <FontAwesome name="arrow-left" size={20} color={theme.colors.text} />
          </CloseButton>
          <HeaderTitle>Filters</HeaderTitle>
          <ApplyButton onPress={applyFilters}>
            <ApplyText>Apply</ApplyText>
          </ApplyButton>
        </ModalHeader>
        
        <ScrollView>
          <FilterSection>
            <SectionTitle>Categories</SectionTitle>
            <ChipsContainer>
              {(availableCategories || []).map(category => (
                <Chip 
                  key={category} 
                  selected={selectedCategories.includes(category)}
                  onPress={() => toggleCategory(category)}
                >
                  <ChipText selected={selectedCategories.includes(category)}>
                    {category}
                  </ChipText>
                </Chip>
              ))}
            </ChipsContainer>
          </FilterSection>
          
          <FilterSection>
            <SectionTitle>Skills</SectionTitle>
            <ChipsContainer>
              {(availableSkills || []).map(skill => (
                <Chip 
                  key={skill} 
                  selected={selectedSkills.includes(skill)}
                  onPress={() => toggleSkill(skill)}
                >
                  <ChipText selected={selectedSkills.includes(skill)}>
                    {skill}
                  </ChipText>
                </Chip>
              ))}
            </ChipsContainer>
          </FilterSection>
        </ScrollView>
      </ModalContainer>
    </Modal>
  );

  // Render suggestion item with highlight
  const renderSuggestionItem = (suggestion: string) => {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseSuggestion = suggestion.toLowerCase();
    const index = lowerCaseSuggestion.indexOf(lowerCaseQuery);
    
    if (index === -1) return <SuggestionText>{suggestion}</SuggestionText>;
    
    return (
      <SuggestionText>
        {suggestion.substring(0, index)}
        <HighlightText>
          {suggestion.substring(index, index + query.length)}
        </HighlightText>
        {suggestion.substring(index + query.length)}
      </SuggestionText>
    );
  };

  return (
    <>
      <Container>
        <SearchContainer>
          <SearchInput
            placeholder="Search posts..."
            value={query}
            onChangeText={updateSuggestions}
            placeholderTextColor={`${theme.colors.text}80`}
            onSubmitEditing={() => {
              setShowSuggestions(false);
              onFilterChange({
                query,
                sortBy,
                categories: selectedCategories,
                skills: selectedSkills
              });
            }}
            onBlur={() => {
              // Delay hiding suggestions to allow for tap
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            onFocus={() => {
              if (query.length > 1) {
                setShowSuggestions(suggestions.length > 0);
              }
            }}
          />
          <FilterButton onPress={() => setShowFilterModal(true)}>
            <FontAwesome name="sliders" size={18} color={theme.colors.text} />
            <FilterIndicator active={hasActiveFilters} />
          </FilterButton>
        </SearchContainer>
        
        <SortContainer>
          <SortOption 
            selected={sortBy === 'newest'}
            onPress={() => changeSortOption('newest')}
          >
            <FontAwesome name="clock-o" size={12} color={sortBy === 'newest' ? 'white' : theme.colors.text} />
            <SortText selected={sortBy === 'newest'}>Newest</SortText>
          </SortOption>
          <SortOption 
            selected={sortBy === 'popular'}
            onPress={() => changeSortOption('popular')}
          >
            <FontAwesome name="fire" size={12} color={sortBy === 'popular' ? 'white' : theme.colors.text} />
            <SortText selected={sortBy === 'popular'}>Popular</SortText>
          </SortOption>
          <SortOption 
            selected={sortBy === 'expiring'}
            onPress={() => changeSortOption('expiring')}
          >
            <FontAwesome name="calendar" size={12} color={sortBy === 'expiring' ? 'white' : theme.colors.text} />
            <SortText selected={sortBy === 'expiring'}>Expiring Soon</SortText>
          </SortOption>
        </SortContainer>
      </Container>
      
      {renderFilterModal()}
      
      {showSuggestions && (
        <Suggestions style={{ 
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
          elevation: 5
        }}>
          {suggestions.map(suggestion => (
            <SuggestionItem 
              key={suggestion} 
              onPress={() => handleSelectSuggestion(suggestion)}
            >
              {renderSuggestionItem(suggestion)}
            </SuggestionItem>
          ))}
        </Suggestions>
      )}
    </>
  );
}
