import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { YStack, XStack, Text, Input, Button, Spinner, useTheme } from 'tamagui'

// Placeholder for logo
const Logo: React.FC = () => {
  const theme = useTheme()
  return (
    <YStack mb="$6" style={{ alignItems: 'center' }}>
      <Text fontSize={36} fontWeight="bold" color="$color12">
        Refer
      </Text>
    </YStack>
  )
}

const roles = ['Job Seeker', 'Referrer', 'Both'] as const

type TabType = 'login' | 'signup'

const AuthScreen: React.FC = () => {
  const [tab, setTab] = useState<TabType>('login')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [role, setRole] = useState<string>(roles[0])
  const [loading] = useState<boolean>(false)
  const [localError] = useState<string>('')
  const theme = useTheme()

  const isLoginForm: boolean = tab === 'login'
  const isFormValid: boolean = isLoginForm
    ? !!email && !!password
    : !!email && !!password && !!firstName && !!lastName

  return (
    <YStack flex={1} bg="$background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 24, minHeight: '100%', paddingTop: '7%' }} keyboardShouldPersistTaps="handled">
        <Logo />
        {/* Tabs */}
        <XStack bg="$background" mb="$6" style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Button
            variant={tab === 'login' ? 'outlined' : undefined}
            borderBottomWidth={2}
            borderBottomColor={tab === 'login' ? '$color12' : 'transparent'}
            onPress={() => setTab('login')}
            px="$6"
            py="$3"
            chromeless={tab !== 'login'}
          >
            <Text fontWeight={tab === 'login' ? '700' : '600'} color={tab === 'login' ? '$color12' : '$color7'}>
              Login
            </Text>
          </Button>
          <Button
            variant={tab === 'signup' ? 'outlined' : undefined}
            borderBottomWidth={2}
            borderBottomColor={tab === 'signup' ? '$color12' : 'transparent'}
            onPress={() => setTab('signup')}
            px="$6"
            py="$3"
            chromeless={tab !== 'signup'}
          >
            <Text fontWeight={tab === 'signup' ? '700' : '600'} color={tab === 'signup' ? '$color12' : '$color7'}>
              Sign Up
            </Text>
          </Button>
        </XStack>

        {/* Form */}
        <YStack width="100%" bg="$background" p="$6" mb="$4" style={{ maxWidth: 400, alignSelf: 'center', borderRadius: 16 }}>
          <Text fontSize={22} fontWeight="700" mb="$4">
            {isLoginForm ? 'Welcome Back' : 'Create Account'}
          </Text>
          {!isLoginForm && (
            <>
              <Input
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                editable={!loading}
                width="100%"
                mb="$3"
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                editable={!loading}
                width="100%"
                mb="$3"
              />
            </>
          )}
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            width="100%"
            mb="$3"
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            width="100%"
            mb="$3"
          />

          {(localError) ? (
            <Text color="$red10" mb="$2" style={{ textAlign: 'center' }}>{localError}</Text>
          ) : null}

          <Button
            variant="outlined"
            disabled={loading || !isFormValid}
            width="100%"
            mb="$3"
          >
            {isLoginForm ? 'Login' : 'Sign Up'}
          </Button>

          <Button
            variant="outlined"
            width="100%"
            mb="$2"
          >
            Continue with WhatsApp
          </Button>

          <Button
            variant="outlined"
            width="100%"
            mb="$2"
          >
            Continue with Phone
          </Button>

          {tab === 'login' && (
            <Button
              chromeless
              width="100%"
              mt="$2"
            >
              <Text color="$color12" fontWeight="bold">
                Forgot password?
              </Text>
            </Button>
          )}
        </YStack>
        <Text mt="$4" color="$color7" fontSize={14} style={{ textAlign: 'center' }}>
          By continuing, you agree to our <Text color="$color12" style={{ textDecorationLine: 'underline' }}>Terms</Text> and <Text color="$color12" style={{ textDecorationLine: 'underline' }}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
    </YStack>
  )
}

export default AuthScreen
