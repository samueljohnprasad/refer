import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';
import EnhancedJobSeekerPostForm from '../components/JobSeekerPostForm';

const PageContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentContainer = styled.View`
  padding: ${props => props.theme.spacing.md}px;
`;

export default function CreateJobPostScreen() {
  const { theme } = useTheme();

  const handleSubmit = (formData: any) => {
    // In a real implementation, this would submit the data to the backend
    console.log('Form submitted:', formData);
    // Navigation would happen here
  };

  return (
    <PageContainer>
      <Stack.Screen
        options={{
          title: 'Create Job Seeker Post',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <ContentContainer>
            <EnhancedJobSeekerPostForm onSubmit={handleSubmit} />
          </ContentContainer>
        </ScrollView>
      </SafeAreaView>
    </PageContainer>
  );
}
