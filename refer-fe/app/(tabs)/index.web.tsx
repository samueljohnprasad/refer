import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { useTheme } from '../../context/ThemeContext';
import { JobSeekerPost } from '../../types/posts';
import DesktopFeedContainer from '../../components/desktop/DesktopFeedContainer';
import ReferralModal from '../../components/ReferralModal';
import { useNotifications } from '../../hooks/useNotifications';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const DesktopHomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { width: screenWidth } = Dimensions.get('window');
  // For web version, we always want to show desktop UI
  const isDesktop = true; // Force desktop mode for web
  
  const [selectedPost, setSelectedPost] = useState<JobSeekerPost | null>(null);
  const [isReferralModalVisible, setIsReferralModalVisible] = useState<boolean>(false);

  // Setup notifications
  useNotifications();

  const handleOpenReferralModal = (post: JobSeekerPost): void => {
    setSelectedPost(post);
    setIsReferralModalVisible(true);
  };

  const handleCloseReferralModal = (): void => {
    setIsReferralModalVisible(false);
    setSelectedPost(null);
  };

  // If not desktop, redirect to mobile version
  if (!isDesktop) {
    return null; // Mobile version will be handled by index.tsx
  }

  return (
    <Container theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <DesktopFeedContainer onRefer={handleOpenReferralModal} />
        
        {/* Referral Modal */}
        {selectedPost && (
          <ReferralModal
            visible={isReferralModalVisible}
            post={selectedPost}
            onClose={handleCloseReferralModal}
          />
        )}
      </SafeAreaView>
    </Container>
  );
};

export default DesktopHomeScreen;
