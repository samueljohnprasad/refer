import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostDetail({ post, onApply }: { post: any; onApply?: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.type} Post Detail</Text>
      <Text style={styles.user}>{post.user || post.company}</Text>
      {post.resume && <Text style={styles.resume}>Resume: {post.resume}</Text>}
      {post.interest && <Text style={styles.interest}>{post.interest}</Text>}
      {post.privacy && <Text style={styles.privacy}>Privacy: {post.privacy}</Text>}
      {post.status && <Text style={styles.status}>Status: {post.status}</Text>}
      <TouchableOpacity style={styles.applyButton} onPress={onApply} accessibilityLabel="Apply/Request Referral">
        <Text style={styles.applyText}>Apply / Request Referral</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
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
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
