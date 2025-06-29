import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { router } from 'expo-router';

interface DesktopNavigationHeaderProps {
  currentPage: 'feed' | 'profile' | 'messages' | 'notifications';
  theme: EnhancedThemeInterface;
  onNavigate?: (page: string) => void;
}

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Logo = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #1D4ED8;
  margin-right: 32px;
`;

const NavigationTabs = styled.View`
  flex-direction: row;
  gap: 24px;
`;

const NavTab = styled.TouchableOpacity<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${props => props.isActive ? '#EFF6FF' : 'transparent'};
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const NavTabText = styled.Text<{ isActive: boolean }>`
  font-size: 16px;
  font-weight: ${props => props.isActive ? '600' : '500'};
  color: ${props => props.isActive ? '#1D4ED8' : '#6B7280'};
`;

const RightSection = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 8px;
  background-color: #F3F4F6;
`;

const ProfileButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1D4ED8;
  align-items: center;
  justify-content: center;
`;

const ProfileText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
`;

const DesktopNavigationHeader: React.FC<DesktopNavigationHeaderProps> = ({
  currentPage,
  theme,
  onNavigate
}) => {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      // Default navigation using expo-router
      switch (page) {
        case 'feed':
          router.push('/(tabs)/desktop');
          break;
        case 'profile':
          router.push('/(tabs)/profile');
          break;
        default:
          console.log(`Navigate to ${page}`);
      }
    }
  };

  const navigationItems = [
    { key: 'feed', label: 'Jobs', icon: 'work' },
    { key: 'messages', label: 'Messages', icon: 'message' },
    { key: 'notifications', label: 'Notifications', icon: 'notifications' },
    { key: 'network', label: 'Network', icon: 'people' }
  ];

  return (
    <HeaderContainer>
      <LeftSection>
        <Logo>ReferNet</Logo>
        <NavigationTabs>
          {navigationItems.map((item) => (
            <NavTab
              key={item.key}
              isActive={currentPage === item.key}
              onPress={() => handleNavigation(item.key)}
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={20} 
                color={currentPage === item.key ? '#1D4ED8' : '#6B7280'} 
              />
              <NavTabText isActive={currentPage === item.key}>
                {item.label}
              </NavTabText>
            </NavTab>
          ))}
        </NavigationTabs>
      </LeftSection>

      <RightSection>
        <IconButton>
          <MaterialIcons name="search" size={20} color="#6B7280" />
        </IconButton>
        <ProfileButton onPress={() => handleNavigation('profile')}>
          <ProfileText>JA</ProfileText>
        </ProfileButton>
      </RightSection>
    </HeaderContainer>
  );
};

export default DesktopNavigationHeader;
