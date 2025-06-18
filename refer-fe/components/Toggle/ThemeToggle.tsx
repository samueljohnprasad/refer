import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemeInterface } from '../../constants/theme';

// Styled components for the toggle
const ToggleContainer = styled.View<{ theme: ThemeInterface }>`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm}px;
`;

const ToggleButton = styled.View<{ isDarkMode: boolean; theme: ThemeInterface }>`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  padding: 2px;
  background-color: ${({ isDarkMode, theme }) => 
    isDarkMode ? theme.colors.primary : theme.colors.border};
  justify-content: center;
`;

// Using regular styles for the thumb to avoid styled-components shadow property issues
const styles = StyleSheet.create({
  thumbStyle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Elevation for Android
    elevation: 1,
  }
});

const ToggleText = styled.Text<{ theme: ThemeInterface }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm}px;
  color: ${({ theme }) => theme.colors.text};
  margin-left: ${({ theme }) => theme.spacing.md}px;
`;

const ThemeToggle: React.FC<{
  showLabel?: boolean;
}> = ({ showLabel = true }) => {
  const { isDarkMode, toggleTheme, theme } = useTheme();
  
  return (
    <ToggleContainer>
      <Pressable
        onPress={toggleTheme}
        accessibilityRole="switch"
        accessibilityState={{ checked: isDarkMode }}
        accessibilityLabel={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        <ToggleButton isDarkMode={isDarkMode}>
          <Pressable 
            style={[
              styles.thumbStyle,
              { 
                backgroundColor: theme.colors.card,
                left: isDarkMode ? 24 : 4 
              }
            ]}
          />
          {Platform.OS === 'web' && (
            <Ionicons 
              name={isDarkMode ? "moon" : "sunny"} 
              size={16} 
              color={isDarkMode ? "#fff" : "#000"}
              style={{ 
                position: 'absolute', 
                left: isDarkMode ? 4 : 26, 
                top: 5
              }}
            />
          )}
        </ToggleButton>
      </Pressable>
      {showLabel && (
        <ToggleText>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</ToggleText>
      )}
    </ToggleContainer>
  );
};

export default ThemeToggle;
