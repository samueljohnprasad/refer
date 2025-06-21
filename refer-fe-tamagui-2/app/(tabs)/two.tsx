import AuthPage from 'app/auth'
import { Text, View } from 'tamagui'

export default function TabTwoScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
     <AuthPage/>
    </View>
  )
}
