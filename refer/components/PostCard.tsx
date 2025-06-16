import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PostCard({ post }: { post: any }) {
  // Calculate days left for expiration
  const daysLeft = post.expiresAt ? Math.ceil((post.expiresAt - Date.now()) / (1000 * 60 * 60 * 24)) : null;
  return (
    <View style={styles.card}>
      <Text style={styles.type}>{post.type || 'Post'}</Text>
      <Text style={styles.user}>{post.user || post.company}</Text>
      {post.resume && <Text style={styles.resume}>Resume: {post.resume}</Text>}
      {post.interest && <Text style={styles.interest}>{post.interest}</Text>}
      {post.privacy && <Text style={styles.privacy}>Privacy: {post.privacy}</Text>}
      {post.status && <Text style={styles.status}>Status: {post.status}</Text>}
      {daysLeft !== null && (
        <Text style={daysLeft <= 7 ? styles.expiringSoon : styles.expiry}>
          Expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  type: {
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  user: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resume: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  interest: {
    fontSize: 12,
    color: '#555',
    marginBottom: 2,
  },
  privacy: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  expiry: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  expiringSoon: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    fontWeight: 'bold',
  },
});
