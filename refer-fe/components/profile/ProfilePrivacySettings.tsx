import React from 'react';
import { View, Switch } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface PrivacySettings {
  isProfilePublic: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showResume: boolean;
  allowMessages: boolean;
  showActivity: boolean;
}

interface ProfilePrivacySettingsProps {
  settings: PrivacySettings;
  onSettingChange: (setting: keyof PrivacySettings, value: boolean) => void;
}

const ProfilePrivacySettings: React.FC<ProfilePrivacySettingsProps> = ({
  settings,
  onSettingChange
}) => {
  const { theme } = useTheme();

  const handleToggle = (setting: keyof PrivacySettings) => {
    onSettingChange(setting, !settings[setting]);
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Privacy & Settings</SectionTitle>
      </SectionHeader>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="globe-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Public Profile</SettingTitle>
            <SettingDescription>Allow anyone to view your full profile</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80`
          }}
          thumbColor={settings.isProfilePublic ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('isProfilePublic')}
          value={settings.isProfilePublic}
        />
      </SettingItem>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="mail-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Show Email</SettingTitle>
            <SettingDescription>Allow your email to be visible to connections</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={settings.showEmail ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('showEmail')}
          value={settings.showEmail}
        />
      </SettingItem>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="call-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Show Phone Number</SettingTitle>
            <SettingDescription>Allow your phone number to be visible to connections</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={settings.showPhone ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('showPhone')}
          value={settings.showPhone}
        />
      </SettingItem>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="document-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Show Resume</SettingTitle>
            <SettingDescription>Allow your resume to be viewed by referrers</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={settings.showResume ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('showResume')}
          value={settings.showResume}
        />
      </SettingItem>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="chatbox-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Direct Messages</SettingTitle>
            <SettingDescription>Allow users to send you direct messages</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={settings.allowMessages ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('allowMessages')}
          value={settings.allowMessages}
        />
      </SettingItem>

      <SettingItem>
        <SettingInfo>
          <SettingIcon>
            <Ionicons name="footsteps-outline" size={20} color={theme.colors.text} />
          </SettingIcon>
          <SettingTextGroup>
            <SettingTitle>Activity Status</SettingTitle>
            <SettingDescription>Show when you're active on the platform</SettingDescription>
          </SettingTextGroup>
        </SettingInfo>
        <StyledSwitch
          trackColor={{ 
            false: theme.colors.border, 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={settings.showActivity ? theme.colors.primary : '#f4f3f4'}
          onValueChange={() => handleToggle('showActivity')}
          value={settings.showActivity}
        />
      </SettingItem>

      <PrivacyNote>
        Your privacy settings help control who can see your information. Learn more about our 
        <PrivacyLink> Privacy Policy</PrivacyLink>.
      </PrivacyNote>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin: 0 16px 16px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 2;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const SettingItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SettingInfo = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const SettingIcon = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const SettingTextGroup = styled.View`
  flex: 1;
`;

const SettingTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const SettingDescription = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 2px;
`;

const StyledSwitch = styled(Switch)`
  margin-left: 8px;
`;

const PrivacyNote = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 16px;
  line-height: 16px;
`;

const PrivacyLink = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

export default ProfilePrivacySettings;
