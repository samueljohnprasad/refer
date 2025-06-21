import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useTheme } from '../../context/ThemeContext';

type PrivacyOption = 'Public' | 'Private' | 'Anonymous';

interface PrivacySelectorProps {
  selectedOption: PrivacyOption;
  onOptionSelected: (option: PrivacyOption) => void;
}

const Container = styled.View`
  margin-top: 16px;
  margin-bottom: 24px;
`;

const Label = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-weight: 500;
`;

const Description = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.6;
  margin-bottom: 16px;
`;

const OptionsContainer = styled.View`
  border-radius: 12px;
  overflow: hidden;
`;

const OptionItem = styled.TouchableOpacity<{ isSelected: boolean }>`
  flex-direction: row;
  padding: 16px;
  background-color: ${props => 
    props.isSelected ? props.theme.colors.primary + '20' : props.theme.colors.background};
  border-width: 1px;
  border-color: ${props => 
    props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  margin-bottom: 8px;
  border-radius: 8px;
`;

const IconContainer = styled.View<{ option: PrivacyOption }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background-color: ${props => {
    switch(props.option) {
      case 'Public': return props.theme.colors.primary + '20';
      case 'Private': return props.theme.colors.secondary + '20';
      case 'Anonymous': return props.theme.colors.text + '20';
    }
  }};
`;

const OptionContent = styled.View`
  flex: 1;
`;

const OptionTitle = styled.Text<{ isSelected: boolean }>`
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.isSelected ? 'bold' : 'normal'};
  margin-bottom: 4px;
`;

const OptionDescription = styled.Text`
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.text};
  opacity: 0.7;
`;

const RadioButton = styled.View<{ isSelected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

const RadioButtonInner = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.theme.colors.primary};
`;

export default function PrivacySelector({ selectedOption, onOptionSelected }: PrivacySelectorProps) {
  const { theme } = useTheme();
  
  const privacyOptions: { 
    option: PrivacyOption; 
    icon: string;
    description: string;
  }[] = [
    {
      option: 'Public',
      icon: 'globe',
      description: 'Your post and profile are visible to everyone'
    },
    {
      option: 'Private',
      icon: 'lock',
      description: 'Only visible to registered users and referrers'
    },
    {
      option: 'Anonymous',
      icon: 'user-secret',
      description: 'Your identity is hidden, but post is visible'
    }
  ];

  return (
    <Container>
      <Label>Privacy Settings*</Label>
      <Description>
        Choose who can see your job seeking post
      </Description>

      <OptionsContainer>
        {privacyOptions.map(item => (
          <OptionItem 
            key={item.option}
            isSelected={selectedOption === item.option}
            onPress={() => onOptionSelected(item.option)}
          >
            <IconContainer option={item.option}>
              <FontAwesome 
                name={item.icon as any} 
                size={18} 
                color={theme.colors.text} 
              />
            </IconContainer>
            
            <OptionContent>
              <OptionTitle isSelected={selectedOption === item.option}>
                {item.option}
              </OptionTitle>
              <OptionDescription>
                {item.description}
              </OptionDescription>
            </OptionContent>
            
            <RadioButton isSelected={selectedOption === item.option}>
              {selectedOption === item.option && <RadioButtonInner />}
            </RadioButton>
          </OptionItem>
        ))}
      </OptionsContainer>
    </Container>
  );
}
