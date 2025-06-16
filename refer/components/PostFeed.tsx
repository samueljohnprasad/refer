import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import PostCard from './PostCard';

// Dummy data for demonstration
const posts = [
  {
    id: '1',
    type: 'Job Seeker',
    user: 'Alice',
    resume: 'https://example.com/resume1.pdf',
    interest: 'Looking for frontend roles',
    privacy: 'Public',
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
  },
  {
    id: '2',
    type: 'Referrer',
    user: 'Bob',
    company: 'TechCorp',
    status: 'Accepted',
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 15, // 15 days
  },
];

export default function PostFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts Feed</Text>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
});
