import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../../context/ThemeContext';
import DesktopNavigationHeader from './DesktopNavigationHeader';
import DesktopProfilePage from './DesktopProfilePage';

const Container = styled.View`
  flex: 1;
  background-color: #F8FAFC;
`;

const DesktopProfileDemo: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Container>
      <DesktopNavigationHeader 
        currentPage="profile"
        theme={theme}
      />
      <DesktopProfilePage 
        username="johndoe"
        isOwnProfile={true}
      />
    </Container>
  );
};

export default DesktopProfileDemo;
