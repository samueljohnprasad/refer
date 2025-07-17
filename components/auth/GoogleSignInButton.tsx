import * as React from 'react';
import { Platform, ViewStyle } from 'react-native';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useAuth } from '@/context/AuthContext';
import { GoogleIcon } from '@/screens/auth/signin/assets/icons/google';
import { Spinner } from '@/components/ui/spinner';

interface GoogleSignInButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onPress,
  disabled = false,
  style,
}) => {
  const { signInWithGoogle, loading } = useAuth();

  const handlePress = async () => {
    try {
      await signInWithGoogle();
      onPress?.();
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  // For native platforms, use the official Google Sign-In button
  if (Platform.OS !== 'web') {
    return (
      <GoogleSigninButton
        style={[{ width: '100%', height: 50 }, style]}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={handlePress}
        disabled={disabled || loading}
      />
    );
  }

  // For web, use a custom button with Google styling
  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full bg-white border-gray-300 hover:bg-gray-50"
      onPress={handlePress}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <Spinner color="#4285F4" className="mr-2" />
      ) : (
        <ButtonIcon as={GoogleIcon} className="mr-2" />
      )}
      <ButtonText className="text-gray-700 font-medium">
        {loading ? 'Signing in...' : 'Continue with Google'}
      </ButtonText>
    </Button>
  );
};
