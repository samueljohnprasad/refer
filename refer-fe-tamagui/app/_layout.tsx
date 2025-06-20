import '../tamagui-web.css'

import { Suspense, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { Provider } from './Provider'
import { Text, useTheme, Spinner } from 'tamagui'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })
  const [hydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    // Hydration logic: set hydrated to true after mount (client-side)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if ((interLoaded || interError) && hydrated) {
      // Hide the splash screen after the fonts and hydration are ready
      SplashScreen.hideAsync()
    }
  }, [interLoaded, interError, hydrated])

  if ((!interLoaded && !interError) || !hydrated) {
    // Show a loader while waiting for fonts or hydration
    return (
      <Providers>
        <Spinner size="large" color="$blue10" />
      </Providers>
    )
  }

  return (
    <Providers>
      <Suspense fallback={<Spinner size="large" color="$blue10" />}>
        <RootLayoutNav />
      </Suspense>
    </Providers>
  )
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()
  const theme = useTheme()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="modal"
          options={{
            title: 'Tamagui + Expo',
            presentation: 'modal',
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            contentStyle: {
              backgroundColor: theme.background.val,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  )
}
