import React, { useState, useEffect } from 'react';
import { View, useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import DesktopNavigationHeader from '../../components/desktop/DesktopNavigationHeader';
import DesktopReferralDashboardPage from '../../components/desktop/DesktopReferralDashboardPage';
import { enhancedLightTheme } from '../../constants/enhancedTheme';

const Container = styled.View`
  flex: 1;
  background-color: #FAFBFC;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const MobilePlaceholder = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #FAFBFC;
`;

const PlaceholderTitle = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
  text-align: center;
  margin-bottom: 16px;
`;

const PlaceholderText = styled.Text`
  font-size: 16px;
  color: #718096;
  text-align: center;
  line-height: 24px;
`;

export default function ReferralsTab() {
  const { width } = useWindowDimensions();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(width >= 1024);
  }, [width]);

  if (!isDesktop) {
    return (
      <Container>
        <MobilePlaceholder>
          <PlaceholderTitle>Referral Dashboard</PlaceholderTitle>
          <PlaceholderText>
            The advanced referral dashboard is optimized for desktop experience.
            {'\n\n'}
            Please use a desktop browser (1024px+ width) to access the full referral management features.
          </PlaceholderText>
        </MobilePlaceholder>
      </Container>
    );
  }

  return (
    <Container>
      <DesktopNavigationHeader 
        theme={enhancedLightTheme}
        currentPage="referrals"
      />
      <ContentContainer>
        <DesktopReferralDashboardPage theme={enhancedLightTheme} />
      </ContentContainer>
    </Container>
  );
}
