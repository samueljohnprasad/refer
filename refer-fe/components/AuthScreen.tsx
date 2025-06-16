import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerThunk } from '@/store/authThunks';

// Placeholder for logo
const Logo = () => (
  <View style={{ alignItems: 'center', marginBottom: 24 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold' }}>ReferNet</Text>
  </View>
);

const roles = ['Job Seeker', 'Referrer', 'Both'];

export default function AuthScreen() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(roles[0]);
  // Redux state
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, user } = useSelector((state: RootState) => state.auth);

  const [localError, setLocalError] = useState('');

  // After successful registration, reset form and tab
  React.useEffect(() => {
    if (user) {
      setTab('login');
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole(roles[0]);
      setLocalError('');
    }
  }, [user]);

  const handleAuth = () => {
    setLocalError('');
    if (tab === 'signup') {
      if (!email || !password || !firstName || !lastName) {
        setLocalError('Please fill all fields');
        return;
      }
      dispatch(registerThunk({ email, password, firstName, lastName }));
      // Success will be handled by navigator (user state)
    } else {
      // Placeholder login logic
      setLocalError('Login not implemented');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => setTab('login')}
            accessibilityLabel="Login Tab"
          >
            <Text style={tab === 'login' ? styles.tabTextActive : styles.tabText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'signup' && styles.tabActive]}
            onPress={() => setTab('signup')}
            accessibilityLabel="Sign Up Tab"
          >
            <Text style={tab === 'signup' ? styles.tabTextActive : styles.tabText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            accessibilityLabel="Email Input"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            accessibilityLabel="Password Input"
          />
          {tab === 'signup' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                accessibilityLabel="First Name Input"
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                accessibilityLabel="Last Name Input"
              />
              <View style={styles.roleContainer}>
                <Text style={styles.label}>Select Role:</Text>
                <View style={styles.roleRow}>
                  {roles.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleButton, role === r && styles.roleButtonActive]}
                      onPress={() => setRole(r)}
                      accessibilityLabel={`Select ${r}`}
                    >
                      <Text style={role === r ? styles.roleTextActive : styles.roleText}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}
          {(localError || error) ? <Text style={styles.error}>{localError || error}</Text> : null}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleAuth}
            accessibilityLabel={tab === 'login' ? 'Login Button' : 'Sign Up Button'}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{tab === 'login' ? 'Login' : 'Sign Up'}</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} accessibilityLabel="Continue with WhatsApp">
            <Text style={styles.secondaryText}>Continue with WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} accessibilityLabel="Continue with Phone">
            <Text style={styles.secondaryText}>Continue with Phone</Text>
          </TouchableOpacity>
          {tab === 'login' && (
            <TouchableOpacity style={{ marginTop: 12 }} accessibilityLabel="Forgot Password">
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.legal}>
          By continuing, you agree to our <Text style={styles.link}>Terms</Text> and <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  tabActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 16,
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
  roleContainer: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  roleButtonActive: {
    backgroundColor: '#007AFF',
  },
  roleText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  roleTextActive: {
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
    marginBottom: 10,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotText: {
    color: '#007AFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  legal: {
    marginTop: 16,
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
