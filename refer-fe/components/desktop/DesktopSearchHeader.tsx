import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeInterface } from '../../constants/theme';

interface DesktopSearchHeaderProps {
  searchQuery: string;
  locationQuery: string;
  onSearchChange: (query: string) => void;
  onLocationChange: (location: string) => void;
  theme: ThemeInterface;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

const SearchSection = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 6px;
  border-width: 1px;
  border-color: #D1D5DB;
  padding: 8px 12px;
  min-height: 48px;
`;

const SearchIcon = styled.View`
  margin-right: 8px;
`;

const SearchInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #111827;
  margin-right: 8px;
`;

const SearchTag = styled.View`
  background-color: #0066CC;
  border-radius: 4px;
  padding: 4px 8px;
  flex-direction: row;
  align-items: center;
  margin-right: 6px;
`;

const SearchTagText = styled.Text`
  color: white;
  font-size: 14px;
  margin-right: 4px;
`;

const RemoveTagButton = styled.TouchableOpacity`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.3);
  justify-content: center;
  align-items: center;
`;

const LocationSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: #FFFFFF;
  border-radius: 6px;
  border-width: 1px;
  border-color: #D1D5DB;
  padding: 8px 12px;
  min-height: 48px;
`;

const LocationIcon = styled.View`
  margin-right: 8px;
`;

const LocationInput = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #111827;
`;

const SearchButton = styled.TouchableOpacity`
  background-color: #0066CC;
  border-radius: 6px;
  padding: 12px 20px;
  min-height: 48px;
  justify-content: center;
  align-items: center;
  min-width: 100px;
`;

const SearchButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const DesktopSearchHeader: React.FC<DesktopSearchHeaderProps> = ({
  searchQuery,
  locationQuery,
  onSearchChange,
  onLocationChange,
  theme
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState<string>(searchQuery);
  const [localLocationQuery, setLocalLocationQuery] = useState<string>(locationQuery);
  const [searchTags, setSearchTags] = useState<string[]>(['Designer']);

  const handleSearchSubmit = (): void => {
    onSearchChange(localSearchQuery);
  };

  const handleLocationSubmit = (): void => {
    onLocationChange(localLocationQuery);
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setSearchTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSearchInputSubmit = (): void => {
    handleSearchSubmit();
  };

  const handleLocationInputSubmit = (): void => {
    handleLocationSubmit();
  };

  return (
    <Container theme={theme}>
      <SearchSection theme={theme}>
        <SearchIcon theme={theme}>
          <FontAwesome 
            name="search" 
            size={18} 
            color={theme.colors.textSecondary} 
          />
        </SearchIcon>
        
        {searchTags.map((tag, index) => (
          <SearchTag key={index} theme={theme}>
            <SearchTagText theme={theme}>{tag}</SearchTagText>
            <RemoveTagButton onPress={() => handleRemoveTag(tag)}>
              <FontAwesome 
                name="times" 
                size={10} 
                color="white" 
              />
            </RemoveTagButton>
          </SearchTag>
        ))}
        
        <SearchInput
          theme={theme}
          value={localSearchQuery}
          onChangeText={setLocalSearchQuery}
          placeholder="Job title, keywords, or company"
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleSearchInputSubmit}
          returnKeyType="search"
        />
      </SearchSection>

      <LocationSection theme={theme}>
        <LocationIcon theme={theme}>
          <FontAwesome 
            name="map-marker" 
            size={18} 
            color={theme.colors.textSecondary} 
          />
        </LocationIcon>
        
        <LocationInput
          theme={theme}
          value={localLocationQuery}
          onChangeText={setLocalLocationQuery}
          placeholder="City, state or zip code"
          placeholderTextColor={theme.colors.textSecondary}
          onSubmitEditing={handleLocationInputSubmit}
          returnKeyType="search"
        />
      </LocationSection>

      <SearchButton theme={theme} onPress={handleSearchSubmit}>
        <SearchButtonText theme={theme}>Search</SearchButtonText>
      </SearchButton>
    </Container>
  );
};

export default DesktopSearchHeader;
