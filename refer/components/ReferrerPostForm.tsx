import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReferrerPostForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [company, setCompany] = useState('');
  const [resumeApproval, setResumeApproval] = useState<'Approve' | 'Reject'>('Approve');
  const [status, setStatus] = useState<'Applied' | 'Accepted' | 'Pending'>('Pending');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!company) {
      setError('Company tag is required.');
      return;
    }
    setError('');
    onSubmit?.({ company, resumeApproval, status });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Referrer Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={company}
        onChangeText={setCompany}
        accessibilityLabel="Company Input"
      />
      <View style={styles.row}>
        <Text style={styles.label}>Resume:</Text>
        {['Approve', 'Reject'].map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.toggle, resumeApproval === option && styles.toggleActive]}
            onPress={() => setResumeApproval(option as any)}
            accessibilityLabel={`Resume ${option}`}
          >
            <Text style={resumeApproval === option ? styles.toggleTextActive : styles.toggleText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        {['Applied', 'Accepted', 'Pending'].map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.toggle, status === option && styles.toggleActive]}
            onPress={() => setStatus(option as any)}
            accessibilityLabel={`Set status to ${option}`}
          >
            <Text style={status === option ? styles.toggleTextActive : styles.toggleText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} accessibilityLabel="Submit Referrer Post">
        <Text style={styles.submitText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  toggle: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
