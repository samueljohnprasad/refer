import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerThunk, loginThunk } from '@/store/authThunks';

// Placeholder for logo
const Logo = () => (
  <View style={{ alignItems: 'center', marginBottom: 24 }}>
    <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Refer</Text>
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

  // Reset form on successful auth
  React.useEffect(() => {
    if (user) {
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setRole(roles[0]);
      setLocalError('');
    }
  }, [user]);

  // Error handling
  React.useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const isLoginForm = tab === 'login';

  const handleAuth = () => {
    setLocalError('');
    
    if (tab === 'login') {
      if (!email || !password) {
        setLocalError('Please enter both email and password');
        return;
      }
      dispatch(loginThunk({ email, password }));
    } else {
      // Signup logic
      if (!email || !password || !firstName || !lastName) {
        setLocalError('Please fill all fields');
        return;
      }
      dispatch(registerThunk({ email, password, firstName, lastName }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.activeTab]}
            onPress={() => setTab('login')}
            accessibilityLabel="Login Tab"
          >
            <Text style={[styles.tabText, tab === 'login' && styles.activeTabText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'signup' && styles.activeTab]}
            onPress={() => setTab('signup')}
            accessibilityLabel="Sign Up Tab"
          >
            <Text style={[styles.tabText, tab === 'signup' && styles.activeTabText]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>
            {isLoginForm ? 'Welcome Back' : 'Create Account'}
          </Text>
          {!isLoginForm && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!loading}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
              />
            </>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />
          {(localError || error) ? <Text style={styles.error}>{localError || error}</Text> : null}
          <TouchableOpacity
            style={[styles.button, (loading || !email || !password || (!isLoginForm && (!firstName || !lastName))) && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading || !email || !password || (!isLoginForm && (!firstName || !lastName))}
            accessibilityLabel={tab === 'login' ? 'Login Button' : 'Sign Up Button'}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isLoginForm ? 'Login' : 'Sign Up'}
              </Text>
            )}
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    minHeight: '100%',
    paddingTop: "7%",
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  tab: {
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
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
