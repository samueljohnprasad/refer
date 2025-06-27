import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme, ThemeInterface } from '../constants/theme';

type ThemeContextType = {
  theme: ThemeInterface;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const THEME_PREFERENCE_KEY = '@ReferNet:theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');
  
  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemePreference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedThemePreference !== null) {
          setIsDarkMode(savedThemePreference === 'dark');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, isDarkMode ? 'dark' : 'light');
      } catch (error) {
        console.log('Error saving theme preference:', error);
      }
    };
    
    saveThemePreference();
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };
  
  // Get the base theme
  const baseTheme = isDarkMode ? darkTheme : lightTheme;
  
  // Adapt theme to match what styled-components expects by adding backward compatibility properties
  const adaptedTheme = {
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily: {
        ...baseTheme.typography.fontFamily,
        // Add these aliases for backward compatibility with styled-components DefaultTheme
        regular: baseTheme.typography.fontFamily.primary,
        medium: baseTheme.typography.fontFamily.primary,
        bold: baseTheme.typography.fontFamily.primary
      },
      fontSize: {
        ...baseTheme.typography.fontSize,
        // Add missing properties that DefaultTheme expects
        md: baseTheme.typography.fontSize.base, // Map 'base' to 'md'
        xxl: baseTheme.typography.fontSize['2xl'] // Map '2xl' to 'xxl'
      }
    }
  };
  
  return (
    <ThemeContext.Provider value={{ theme: baseTheme, isDarkMode, toggleTheme }}>
      <StyledThemeProvider theme={adaptedTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
