import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerThunk, loginThunk } from '@/store/authThunks';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';
import { Button } from '../styles/components/Button';
import { Input } from '../styles/components/Input';
import { Typography, Heading3 } from '../styles/components/Typography';
import { Card } from '../styles/components/Card';
import { getShadow } from '../styles/utils/styleUtils';
import { ThemeInterface } from '../constants/theme';

// Styled components
const LogoContainer = styled.View<{ theme: ThemeInterface }>`
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const LogoText = styled.Text<{ theme: ThemeInterface }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl + 8}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const StyledSafeAreaView = styled(SafeAreaView)<{ theme: ThemeInterface }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const FormContainer = styled.View<{ theme: ThemeInterface }>`
  width: 100%;
  max-width: 400px;
  align-self: center;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => theme.colors.card};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const TabsContainer = styled.View<{ theme: ThemeInterface }>`
  flex-direction: row;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
  background-color: ${({ theme }) => 
    theme.mode === 'dark' ? theme.colors.card : '#f2f2f2'};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  overflow: hidden;
`;

const Tab = styled.TouchableOpacity<{ active: boolean; theme: ThemeInterface }>`
  padding: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
`;

const TabText = styled.Text<{ active: boolean; theme: ThemeInterface }>`
  font-size: ${({ theme }) => theme.typography.fontSize.md}px;
  font-weight: ${({ active }) => (active ? '700' : '600')};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.mode === 'dark' ? '#BBBBBB' : '#666'};
`;

const ErrorText = styled.Text<{ theme: ThemeInterface }>`
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
  text-align: center;
`;

const ActionButton = styled(Button)<{ fullWidth?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

const ForgotPasswordLink = styled.TouchableOpacity<{ theme: ThemeInterface }>`
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const LegalText = styled(Typography)<{ theme: ThemeInterface }>`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.mode === 'dark' ? '#BBBBBB' : '#888'};
  font-size: ${({ theme }) => theme.typography.fontSize.xs}px;
  text-align: center;
`;

const LinkText = styled.Text<{ theme: ThemeInterface }>`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration-line: underline;
`;

// Placeholder for logo
const Logo = () => {
  const { theme } = useTheme();
  return (
    <LogoContainer>
      <LogoText>Refer</LogoText>
    </LogoContainer>
  );
};

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

  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background,
      minHeight: '100%',
      paddingTop: '7%',
    }
  });
  
  const isFormValid = isLoginForm 
    ? !!email && !!password 
    : !!email && !!password && !!firstName && !!lastName;
    
  return (
    <StyledSafeAreaView>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />
        
        {/* Tabs */}
        <TabsContainer>
          <Tab
            active={tab === 'login'}
            onPress={() => setTab('login')}
            accessibilityLabel="Login Tab"
          >
            <TabText active={tab === 'login'}>
              Login
            </TabText>
          </Tab>
          <Tab
            active={tab === 'signup'}
            onPress={() => setTab('signup')}
            accessibilityLabel="Sign Up Tab"
          >
            <TabText active={tab === 'signup'}>
              Sign Up
            </TabText>
          </Tab>
        </TabsContainer>

        {/* Form */}
        <FormContainer>
          <Heading3 style={{ marginBottom: theme.spacing.md }}>
            {isLoginForm ? 'Welcome Back' : 'Create Account'}
          </Heading3>
          
          {!isLoginForm && (
            <>
              <Input
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!loading}
                isFullWidth
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
                isFullWidth
              />
            </>
          )}
          
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
            isFullWidth
          />
          
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            isFullWidth
          />
          
          {(localError || error) ? <ErrorText>{localError || error}</ErrorText> : null}
          
          <ActionButton
            variant="primary"
            onPress={handleAuth}
            disabled={loading || !isFormValid}
            isLoading={loading}
            isFullWidth
            accessibilityLabel={tab === 'login' ? 'Login Button' : 'Sign Up Button'}
          >
            {isLoginForm ? 'Login' : 'Sign Up'}
          </ActionButton>
          
          <ActionButton
            variant="outline"
            isFullWidth
            accessibilityLabel="Continue with WhatsApp"
          >
            Continue with WhatsApp
          </ActionButton>
          
          <ActionButton
            variant="outline"
            isFullWidth
            accessibilityLabel="Continue with Phone"
          >
            Continue with Phone
          </ActionButton>
          
          {tab === 'login' && (
            <ForgotPasswordLink accessibilityLabel="Forgot Password">
              <Typography color={theme.colors.primary} weight="bold">
                Forgot password?
              </Typography>
            </ForgotPasswordLink>
          )}
        </FormContainer>
        
        <LegalText>
          By continuing, you agree to our <LinkText>Terms</LinkText> and <LinkText>Privacy Policy</LinkText>.
        </LegalText>
      </ScrollView>
    </StyledSafeAreaView>
  );
}


