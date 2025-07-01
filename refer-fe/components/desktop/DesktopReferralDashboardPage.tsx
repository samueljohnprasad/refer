import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import DesktopReferrerDashboard from './DesktopReferrerDashboard';
import DesktopSeekerDashboard from './DesktopSeekerDashboard';
import { EnhancedThemeInterface } from '../../constants/enhancedTheme';
import { enhancedLightTheme } from '../../constants/enhancedTheme';

interface DesktopReferralDashboardPageProps {
  theme?: EnhancedThemeInterface;
}

const PageContainer = styled.View`
  flex: 1;
  background-color: #FAFBFC;
  min-height: 100vh;
`;

const RoleSwitcher = styled.View`
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
  background-color: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const RoleButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 12px 16px;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  background-color: ${props => props.active ? '#4299E1' : '#FFFFFF'};
  border-bottom-width: 1px;
  border-bottom-color: #E5E7EB;
`;

const RoleButtonText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#FFFFFF' : '#4A5568'};
`;

const DesktopReferralDashboardPage: React.FC<DesktopReferralDashboardPageProps> = ({
  theme = enhancedLightTheme
}) => {
  const [userRole, setUserRole] = useState<'referrer' | 'seeker'>('referrer');

  return (
    <PageContainer>
      <RoleSwitcher>
        <RoleButton 
          active={userRole === 'referrer'}
          onPress={() => setUserRole('referrer')}
        >
          <MaterialIcons 
            name="group-work" 
            size={16} 
            color={userRole === 'referrer' ? '#FFFFFF' : '#4A5568'} 
          />
          <RoleButtonText active={userRole === 'referrer'}>
            I Give Referrals
          </RoleButtonText>
        </RoleButton>
        
        <RoleButton 
          active={userRole === 'seeker'}
          onPress={() => setUserRole('seeker')}
          style={{ borderBottomWidth: 0 }}
        >
          <MaterialIcons 
            name="send" 
            size={16} 
            color={userRole === 'seeker' ? '#FFFFFF' : '#4A5568'} 
          />
          <RoleButtonText active={userRole === 'seeker'}>
            I Need Referrals
          </RoleButtonText>
        </RoleButton>
      </RoleSwitcher>

      {userRole === 'referrer' ? (
        <DesktopReferrerDashboard theme={theme} />
      ) : (
        <DesktopSeekerDashboard theme={theme} />
      )}
    </PageContainer>
  );
};

export default DesktopReferralDashboardPage;
