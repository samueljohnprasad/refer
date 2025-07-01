import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import DesktopNavigationHeader from '../components/desktop/DesktopNavigationHeader';
import DesktopReferralDashboardPage from '../components/desktop/DesktopReferralDashboardPage';
import { enhancedLightTheme } from '../constants/enhancedTheme';

const Container = styled.View`
  flex: 1;
  background-color: #FAFBFC;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

export default function ReferralDashboardDemo() {
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
