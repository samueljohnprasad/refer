import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styled from 'styled-components/native';
import { useTheme } from '../context/ThemeContext';

const HeaderTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.text};
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NotificationBadge = styled.View`
  position: absolute;
  right: -5px;
  top: -5px;
  background-color: ${props => props.theme.colors.error};
  border-radius: 12px;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border: 2px solid ${props => props.theme.colors.card};
`;

const BadgeText = styled.Text`
  color: white;
  font-size: 10px;
  font-weight: bold;
`;

type ReferNetHeaderProps = {
  onBell: () => void;
  onInfo: () => void;
  unreadCount: number;
}
export default function ReferNetHeader({ onBell, onInfo, unreadCount }: ReferNetHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <LeftSection>
        <FontAwesome name="rss" size={28} color={theme.colors.primary} style={{ marginRight: 10 }} />
        <HeaderTitle>ReferNet Feed</HeaderTitle>
      </LeftSection>
      <TouchableOpacity onPress={onBell} style={{ marginLeft: 16 }}>
        <FontAwesome name="bell" size={24} color={theme.colors.text} />
        {unreadCount > 0 && (
          <NotificationBadge>
            <BadgeText>{unreadCount}</BadgeText>
          </NotificationBadge>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={onInfo} style={{ marginLeft: 16 }}>
        <FontAwesome name="info" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
} 