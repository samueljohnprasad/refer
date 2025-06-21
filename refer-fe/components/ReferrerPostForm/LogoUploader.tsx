import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

interface LogoUploaderProps {
  onImageSelected: (uri: string) => void;
  currentImage?: string;
}

const Container = styled.View`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const Description = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  margin-bottom: 12px;
`;

const UploadArea = styled.TouchableOpacity`
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
  border-style: dashed;
  border-radius: 8px;
  padding: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.background};
`;

const UploadText = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
  margin-top: 8px;
`;

const ImagePreview = styled.View`
  border-radius: 8px;
  overflow: hidden;
  margin-top: 16px;
  align-items: center;
`;

const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

export default function LogoUploader({ onImageSelected, currentImage }: LogoUploaderProps) {
  const { theme } = useTheme();
  const [image, setImage] = useState<string | undefined>(currentImage);
  const [loading, setLoading] = useState(false);

  // This is a mock implementation since we don't have expo-image-picker installed
  // In a real app, this would use the device's image picker
  const pickImage = () => {
    setLoading(true);
    
    // Simulate a delay
    setTimeout(() => {
      // Mock URLs for demonstration
      const mockImageUrls = [
        'https://placehold.co/600x400/png?text=Company+Logo',
        'https://placehold.co/400x400/png?text=Sample+Logo',
        'https://placehold.co/500x500/png?text=Mock+Logo'
      ];
      
      // Randomly select a mock image
      const selectedImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      
      setImage(selectedImage);
      onImageSelected(selectedImage);
      setLoading(false);
      
      Alert.alert(
        'Mock Image Selected', 
        'In a real implementation, this would open your device\'s image picker. For this demo, a placeholder image has been used.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const removeImage = () => {
    setImage(undefined);
    onImageSelected('');
  };

  return (
    <Container>
      <Label>Company Logo</Label>
      <Description>
        Upload a logo to make your company instantly recognizable (PNG or JPG, max 2MB)
      </Description>

      {!image ? (
        <UploadArea onPress={pickImage}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <>
              <FontAwesome name="cloud-upload" size={36} color={theme.colors.primary} />
              <UploadText>Click to upload company logo</UploadText>
            </>
          )}
        </UploadArea>
      ) : (
        <ImagePreview>
          <Image
            source={{ uri: image }}
            style={{ 
              width: '100%', 
              height: 200,
              borderRadius: 8,
              resizeMode: 'contain',
              backgroundColor: theme.colors.background 
            }}
          />
          <RemoveButton onPress={removeImage}>
            <FontAwesome name="times" size={16} color="white" />
          </RemoveButton>
        </ImagePreview>
      )}
    </Container>
  );
}
