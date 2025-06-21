import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, StyleSheet, Animated, Easing, PanResponder } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { registerThunk, loginThunk } from '@/store/authThunks';
import { useTheme } from '../context/ThemeContext';
import styled from 'styled-components/native';
import { Button } from '../styles/components/Button';
import { Input } from '../styles/components/Input';
import { Typography, Heading3 } from '../styles/components/Typography';
import { ThemeInterface } from '../constants/theme';
import { LogoContainer, LogoText, StyledSafeAreaView, TabsContainer, Tab, TabText, FormContainer, ErrorText, ForgotPasswordLink, LegalText, LinkText } from './styles/AuthScreen.styles';
import { AuthTab, UserRole } from './constants/User';



// Placeholder for logo
const Logo = () => {
  const { theme } = useTheme();
  return (
    <LogoContainer>
      <LogoText>Refer</LogoText>
    </LogoContainer>
  );
};


const ActionButton = styled(Button)<{ fullWidth?: boolean; theme: ThemeInterface }>`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

export default function AuthScreen() {
  const [tab, setTab] = useState<AuthTab>(AuthTab.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.JobSeeker);
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
      setRole(UserRole.JobSeeker);
      setLocalError('');
    }
  }, [user]);

  // Error handling
  React.useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const isLoginForm = tab === AuthTab.Login;

  const handleAuth = () => {
    setLocalError('');
    
    if (tab === AuthTab.Login) {
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
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: '#007AFF', // Your active color
    }
  });
  
  const isFormValid = isLoginForm 
    ? !!email && !!password 
    : !!email && !!password && !!firstName && !!lastName;
    
  const [fadeAnim] = useState(new Animated.Value(1));
  const [indicatorAnim] = useState(new Animated.Value(tab === AuthTab.Login ? 0 : 1));
  const [tabWidth, setTabWidth] = useState(0);

  const handleTabChange = (newTab: AuthTab) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(indicatorAnim, {
        toValue: newTab === AuthTab.Login ? 0 : 1,
        useNativeDriver: true,
      }).start();
      setTab(newTab);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <StyledSafeAreaView>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Logo />
        
        {/* Tabs */}
        <TabsContainer>
          <Tab
            active={tab === AuthTab.Login}
            onPress={() => handleTabChange(AuthTab.Login)}
            accessibilityLabel="Login Tab"
            onLayout={e => setTabWidth(e.nativeEvent.layout.width)}
          >
            <TabText active={tab === AuthTab.Login}>
              Login
            </TabText>
          </Tab>
          <Tab
            active={tab === AuthTab.Signup}
            onPress={() => handleTabChange(AuthTab.Signup)}
            accessibilityLabel="Sign Up Tab"
          >
            <TabText active={tab === AuthTab.Signup}>
              Sign Up
            </TabText>
          </Tab>
          <Animated.View 
            style={[ 
              styles.tabIndicator,
              {
                width: tabWidth,
                transform: [{
                  translateX: indicatorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, tabWidth]
                  })
                }]
              }
            ]} 
          />
        </TabsContainer>

        {/* Form */}
        <Animated.View style={{ opacity: fadeAnim, width: '100%' }}>
          <FormContainer>
            <Heading3 style={{ marginBottom: theme.spacing.md }}>
              {tab === AuthTab.Login ? 'Welcome Back' : 'Create Account'}
            </Heading3>
            
            {tab !== AuthTab.Login && (
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
              accessibilityLabel={tab === AuthTab.Login ? 'Login Button' : 'Sign Up Button'}
            >
              {tab === AuthTab.Login ? 'Login' : 'Sign Up'}
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
            
            {tab === AuthTab.Login && (
              <ForgotPasswordLink accessibilityLabel="Forgot Password">
                <Typography color={theme.colors.primary} weight="bold">
                  Forgot password?
                </Typography>
              </ForgotPasswordLink>
            )}
          </FormContainer>
        </Animated.View>
        
        <LegalText>
          By continuing, you agree to our <LinkText>Terms</LinkText> and <LinkText>Privacy Policy</LinkText>.
        </LegalText>
      </ScrollView>
    </StyledSafeAreaView>
  );
}
