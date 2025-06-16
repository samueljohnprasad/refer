import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import AuthScreen from '@/components/AuthScreen';
import JobPostForm from '@/components/JobPostForm';
import ReferrerPostForm from '@/components/ReferrerPostForm';
import PostFeed from '@/components/PostFeed';
import PostDetail from '@/components/PostDetail';

// Dummy post for PostDetail demo
const demoPost = {
  id: '1',
  type: 'Job Seeker',
  user: 'Alice',
  resume: 'https://example.com/resume1.pdf',
  interest: 'Looking for frontend roles',
  privacy: 'Public',
  expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
};

const pages = [
  { key: 'auth', label: 'AuthScreen' },
  { key: 'job', label: 'JobPostForm' },
  { key: 'ref', label: 'ReferrerPostForm' },
  { key: 'feed', label: 'PostFeed' },
  { key: 'detail', label: 'PostDetail' },
];

export default function TabTwoScreen() {
  const [page, setPage] = useState('feed');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonRow}>
        {pages.map(p => (
          <TouchableOpacity
            key={p.key}
            style={[styles.button, page === p.key && styles.buttonActive]}
            onPress={() => setPage(p.key)}
          >
            <Text style={page === p.key ? styles.buttonTextActive : styles.buttonText}>{p.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.pageContent}>
        {page === 'auth' && <AuthScreen />}
        {page === 'job' && <JobPostForm />}
        {page === 'ref' && <ReferrerPostForm />}
        {page === 'feed' && <PostFeed />}
        {page === 'detail' && <PostDetail post={demoPost} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 4,
    marginBottom: 4,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  pageContent: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
});

