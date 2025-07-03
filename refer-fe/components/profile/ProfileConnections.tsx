import React, { useState } from 'react';
import { TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface Connection {
  id: string;
  name: string;
  image: string;
  title?: string;
  company?: string;
  mutualConnections: number;
  isConnected: boolean;
}

interface ProfileConnectionsProps {
  connections: Connection[];
  onViewAllConnections?: () => void;
  onConnect?: (userId: string) => void;
  onViewProfile?: (userId: string) => void;
}

const ProfileConnections: React.FC<ProfileConnectionsProps> = ({
  connections,
  onViewAllConnections,
  onConnect,
  onViewProfile
}) => {
  const { theme } = useTheme();
  const [connectionsModalVisible, setConnectionsModalVisible] = useState(false);
  
  // Only show up to 6 connections in the preview
  const visibleConnections = connections.slice(0, 6);
  
  const handleConnectPress = (connection: Connection) => {
    if (!connection.isConnected) {
      onConnect?.(connection.id);
    }
  };

  return (
    <Container>
      <SectionHeader>
        <SectionTitle>Network</SectionTitle>
        <ConnectionCount>{connections.length} Connections</ConnectionCount>
      </SectionHeader>

      {connections.length > 0 ? (
        <>
          <ConnectionsGrid>
            {visibleConnections.map(connection => (
              <ConnectionItem 
                key={connection.id}
                onPress={() => onViewProfile?.(connection.id)}
              >
                <ConnectionImageContainer>
                  <ConnectionImage source={{ uri: connection.image }} />
                  {connection.isConnected && (
                    <ConnectionBadge>
                      <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
                    </ConnectionBadge>
                  )}
                </ConnectionImageContainer>
                <ConnectionName numberOfLines={1}>{connection.name}</ConnectionName>
                {(connection.title || connection.company) && (
                  <ConnectionTitle numberOfLines={1}>
                    {connection.title}{connection.company ? ` at ${connection.company}` : ''}
                  </ConnectionTitle>
                )}
                
                {connection.mutualConnections > 0 && (
                  <MutualConnectionsText>
                    {connection.mutualConnections} mutual
                  </MutualConnectionsText>
                )}

                <ConnectionButton 
                  isConnected={connection.isConnected}
                  onPress={() => handleConnectPress(connection)}
                >
                  <ConnectionButtonText isConnected={connection.isConnected}>
                    {connection.isConnected ? 'Connected' : 'Connect'}
                  </ConnectionButtonText>
                </ConnectionButton>
              </ConnectionItem>
            ))}
          </ConnectionsGrid>

          {connections.length > 6 && (
            <ViewAllButton onPress={() => setConnectionsModalVisible(true)}>
              <ViewAllText>View all {connections.length} connections</ViewAllText>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
            </ViewAllButton>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <Ionicons name="people-outline" size={32} color={theme.colors.secondary} />
          </EmptyIcon>
          <EmptyText>No connections yet</EmptyText>
          <EmptyDescription>
            Connect with professionals in your industry to grow your network
          </EmptyDescription>
        </EmptyState>
      )}

      {/* All Connections Modal */}
      <Modal
        visible={connectionsModalVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setConnectionsModalVisible(false)}
      >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>My Connections</ModalTitle>
            <CloseButton onPress={() => setConnectionsModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </CloseButton>
          </ModalHeader>
          
          <FlatList
            data={connections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ConnectionListItem>
                <ConnectionRowLeft>
                  <ConnectionListImage source={{ uri: item.image }} />
                  <ConnectionInfo>
                    <ConnectionListName>{item.name}</ConnectionListName>
                    {(item.title || item.company) && (
                      <ConnectionListTitle>
                        {item.title}{item.company ? ` at ${item.company}` : ''}
                      </ConnectionListTitle>
                    )}
                    {item.mutualConnections > 0 && (
                      <ConnectionListMutual>
                        {item.mutualConnections} mutual connections
                      </ConnectionListMutual>
                    )}
                  </ConnectionInfo>
                </ConnectionRowLeft>
                
                <ConnectionListButton 
                  isConnected={item.isConnected}
                  onPress={() => handleConnectPress(item)}
                >
                  <ConnectionListButtonText isConnected={item.isConnected}>
                    {item.isConnected ? 'Connected' : 'Connect'}
                  </ConnectionListButtonText>
                </ConnectionListButton>
              </ConnectionListItem>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </ModalContainer>
      </Modal>

      {/* Connection Activity Section */}
      <ActivitySection>
        <ActivityHeader>
          <ActivityTitle>Network Activity</ActivityTitle>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </ActivityHeader>

        <ActivityItem>
          <ActivityIconContainer>
            <Ionicons name="briefcase-outline" size={24} color="white" />
          </ActivityIconContainer>
          <ActivityContent>
            <ActivityText>
              <ActivityName>Sarah Chen</ActivityName> started a new position as Senior Product Manager at Google
            </ActivityText>
            <ActivityTime>2 days ago</ActivityTime>
          </ActivityContent>
        </ActivityItem>

        <ActivityItem>
          <ActivityIconContainer style={{ backgroundColor: '#FF5722' }}>
            <Ionicons name="share-social-outline" size={24} color="white" />
          </ActivityIconContainer>
          <ActivityContent>
            <ActivityText>
              <ActivityName>Michael Wilson</ActivityName> is looking for React Native developers to join their team
            </ActivityText>
            <ActivityTime>1 week ago</ActivityTime>
          </ActivityContent>
        </ActivityItem>

        <TouchableOpacity>
          <ViewMoreActivity>View more activity</ViewMoreActivity>
        </TouchableOpacity>
      </ActivitySection>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius?.md || 8}px;
  margin: 0 16px 16px;
  padding: 16px;
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

const ConnectionCount = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
`;

const ConnectionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ConnectionItem = styled.TouchableOpacity`
  width: 31%;
  margin-bottom: 16px;
`;

const ConnectionImageContainer = styled.View`
  position: relative;
  margin-bottom: 8px;
`;

const ConnectionImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
`;

const ConnectionBadge = styled.View`
  position: absolute;
  bottom: -5px;
  right: -5px;
  background-color: ${props => props.theme.colors.card};
  border-radius: 10px;
  padding: 2px;
`;

const ConnectionName = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ConnectionTitle = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 4px;
`;

const MutualConnectionsText = styled.Text`
  font-size: 11px;
  color: ${props => props.theme.colors.secondary};
  margin-bottom: 6px;
`;

interface ConnectionButtonProps {
  isConnected: boolean;
}

const ConnectionButton = styled.TouchableOpacity<ConnectionButtonProps>`
  background-color: ${props => 
    props.isConnected ? props.theme.colors.background : props.theme.colors.primary};
  padding: 4px 0;
  border-radius: 4px;
  align-items: center;
`;

const ConnectionButtonText = styled.Text<ConnectionButtonProps>`
  color: ${props => 
    props.isConnected ? props.theme.colors.primary : 'white'};
  font-size: 12px;
  font-weight: 500;
`;

const ViewAllButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 12px;
  margin-top: 4px;
`;

const ViewAllText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  margin-right: 4px;
`;

const EmptyState = styled.View`
  align-items: center;
  padding: 24px 0;
`;

const EmptyIcon = styled.View`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const EmptyText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const EmptyDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
  text-align: center;
  padding: 0 24px;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ModalTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const CloseButton = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.theme.colors.card};
  justify-content: center;
  align-items: center;
`;

const ConnectionListItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ConnectionRowLeft = styled.View`
  flex-direction: row;
  flex: 1;
`;

const ConnectionListImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`;

const ConnectionInfo = styled.View`
  flex: 1;
`;

const ConnectionListName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const ConnectionListTitle = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.secondary};
`;

const ConnectionListMutual = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 2px;
`;

const ConnectionListButton = styled.TouchableOpacity<ConnectionButtonProps>`
  background-color: ${props => 
    props.isConnected ? props.theme.colors.background : props.theme.colors.primary};
  padding: 8px 16px;
  border-radius: 20px;
  align-items: center;
  border-width: ${props => props.isConnected ? 1 : 0}px;
  border-color: ${props => props.theme.colors.border};
`;

const ConnectionListButtonText = styled.Text<ConnectionButtonProps>`
  color: ${props => 
    props.isConnected ? props.theme.colors.primary : 'white'};
  font-size: 14px;
  font-weight: 500;
`;

// Activity Section
const ActivitySection = styled.View`
  margin-top: 20px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  padding-top: 16px;
`;

const ActivityHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ActivityTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ActivityItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const ActivityIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const ActivityContent = styled.View`
  flex: 1;
`;

const ActivityText = styled.Text`
  font-size: 14px;
  line-height: 20px;
  color: ${props => props.theme.colors.text};
`;

const ActivityName = styled.Text`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const ActivityTime = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.secondary};
  margin-top: 4px;
`;

const ViewMoreActivity = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-top: 16px;
  font-weight: 500;
`;

export default ProfileConnections;
