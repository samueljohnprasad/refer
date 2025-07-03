import React, { useState } from 'react';
import { SafeAreaView, ScrollView, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';
import EnhancedJobSeekerPostForm from '../components/JobSeekerPostForm';
import { jobSeekerPostService, CreateJobSeekerPostData } from '../services/jobSeekerPost.service';

const PageContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ContentContainer = styled.View`
  padding: ${props => props.theme.spacing.md}px;
`;

export default function CreateJobPostScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSubmitting, setIsDraftSubmitting] = useState(false);

  const handleSubmit = async (formData: CreateJobSeekerPostData, isDraft: boolean = false) => {
    if (isDraft) {
      setIsDraftSubmitting(true);
    } else {
      setIsSubmitting(true);
    }

    try {
      if (isDraft) {
        await jobSeekerPostService.createDraftJobSeekerPost(formData);
        router.back();
        setTimeout(() => {
          Alert.alert(
            'Draft Saved',
            'Your job seeker post has been saved as a draft.'
          );
        }, 300);
      } else {
        await jobSeekerPostService.createJobSeekerPost(formData);
        router.back();
        setTimeout(() => {
          Alert.alert(
            'Success!',
            'Your job seeker post has been created successfully.'
          );
        }, 300);
      }
    } catch (error: any) {
      console.error('Error creating job seeker post:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create job seeker post. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
      setIsDraftSubmitting(false);
    }
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
            <EnhancedJobSeekerPostForm 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting}
              isDraftSubmitting={isDraftSubmitting}
            />
          </ContentContainer>
        </ScrollView>
      </SafeAreaView>
    </PageContainer>
  );
}
