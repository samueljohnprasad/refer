import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useWindowDimensions } from 'react-native';
import DesktopProfileContainer from './DesktopProfileContainer';

interface DesktopProfilePageProps {
  username?: string;
  isOwnProfile?: boolean;
}

const DesktopProfilePage: React.FC<DesktopProfilePageProps> = ({
  username,
  isOwnProfile = false
}) => {
  const { theme } = useTheme();
  const dimensions = useWindowDimensions();
  const isDesktop = dimensions.width >= 1024;

  return (
    <DesktopProfileContainer
      theme={theme}
      isDesktop={isDesktop}
      username={username}
      isOwnProfile={isOwnProfile}
    />
  );
};

export default DesktopProfilePage;
