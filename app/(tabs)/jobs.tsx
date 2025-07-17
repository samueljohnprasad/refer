import * as React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Button, ButtonText } from '@/components/ui/button';

export default function JobsScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Jobs!</Text>
      {user && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ marginBottom: 10 }}>Signed in as: {user.email}</Text>
          <Button onPress={signOut}>
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}
