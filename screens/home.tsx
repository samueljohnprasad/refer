import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { VStack } from "@/components/ui/vstack";
import { router } from "expo-router";
import RosePetalParticles from "@/components/ui/RosePetalParticles";
import FirefliesParticles from "@/components/ui/FirefliesParticles";
import ButterflyRelease from "@/components/ui/ButterflyRelease";
import MindfulBackground from "@/components/ui/MindfulBackground";

const HomeScreen = () => {
  const { signOut } = useAuth();
  const [showButterflies, setShowButterflies] = useState(true);

  // Reset butterfly animation every 6 seconds for demo
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setShowButterflies(false);
  //     setTimeout(() => setShowButterflies(true), 100);
  //   }, 6000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F8FF' }}>
      {/* Debug: Simple colored background to see butterflies against */}
      <View style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(240, 248, 255, 0.3)' 
      }} />
      
      {/* Butterfly overlay - positioned absolutely over everything */}
      <ButterflyRelease
        isActive={true}
        speed={0.8}
        butterflyCount={18}
        onComplete={() => {
          console.log("Butterflies completed!");
          // Reset after a short delay to make it more visible
          // setTimeout(() => setShowButterflies(true), 1000);
        }}
      />
      
      {/* Debug indicator */}
      <View style={{
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        padding: 8,
        borderRadius: 4,
        zIndex: 100
      }}>
        <Text style={{ color: 'white', fontSize: 12 }}>
          Butterflies: {showButterflies ? 'ACTIVE' : 'INACTIVE'}
        </Text>
      </View>

      <VStack
        space="3xl"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
      >
        <Heading size="3xl" className="text-center">
          Welcome to Home
        </Heading>
        <Button
          variant="solid"
          action="primary"
          size="xl"
          className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
        >
          <ButtonText onPress={signOut}>Sign out</ButtonText>
        </Button>
        <Button
          variant="solid"
          action="primary"
          size="xl"
          className="flex items-center font-semibold border w-full rounded-full py-2 drop-shadow-sm shadow-primary-500 hover:shadow-primary-500 hover:scale-95 transition-all duration-300"
        >
          <ButtonText
            onPress={() => {
              router.navigate("/voice-recorder");
            }}
          >
            voice
          </ButtonText>
        </Button>
      </VStack>
    </View>
  );
};

export default HomeScreen;
