import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { ButtonText } from "@/components/ui/button";

const home = () => {
  const { user, session, loading, signOut } = useAuth();
  return (
    <View className="flex-1 items-center justify-center">
      <Text>home</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default home;
