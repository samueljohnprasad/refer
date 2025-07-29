import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

// Styled Components
const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #fff7f2;
  padding: 16px;
`;

const Header = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 22px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  shadow-offset: 0px 4px;
  elevation: 5;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-family: Inter-Medium;
  color: #333333;
`;

const ModeTag = styled.View`
  height: 32px;
  flex-direction: row;
  align-items: center;
  padding: 0 12px;
  background-color: rgba(107, 78, 22, 0.1);
  border-radius: 16px;
  margin-vertical: 12px;
  align-self: flex-start;
`;

const ModeTagText = styled.Text`
  font-size: 14px;
  font-family: Inter-Medium;
  color: #6b4e16;
  margin-left: 8px;
`;

const PromptText = styled.Text`
  font-size: 22px;
  line-height: 28px;
  font-family: PlayfairDisplay-Regular;
  color: #333333;
  text-align: center;
  margin-vertical: 24px;
`;

const WaveformContainer = styled.View`
  height: 64px;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 8px;
  align-items: flex-end;
  margin-vertical: 32px;
`;

const ControlsRow = styled.View`
  height: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 32px;
`;

const RecordButtonContainer = styled(LinearGradient).attrs({
  colors: ['#8cd7c5', '#6bbfa5'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 15px;
  shadow-offset: 0px 6px;
  elevation: 8;
`;

const TimerText = styled.Text`
  font-size: 16px;
  font-family: Inter-Medium;
  color: #333333;
  text-align: center;
  margin-top: 16px;
`;

const AnimatedView = styled.View``;

// Waveform Bar Component
const WaveformBar: React.FC<{ index: number }> = ({ index }) => {
  const height = useSharedValue(16);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const randomDelay = Math.random() * 2000;
    const randomDuration = 600 + Math.random() * 600;

    setTimeout(() => {
      height.value = withRepeat(
        withTiming(16 + Math.random() * 32, {
          duration: randomDuration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );

      opacity.value = withRepeat(
        withTiming(0.3 + Math.random() * 0.7, {
          duration: randomDuration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    }, randomDelay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    backgroundColor: `rgba(107, 78, 22, ${opacity.value})`,
  }));

  return (
    <AnimatedView
      style={[
        {
          width: 4,
          borderRadius: 2,
          backgroundColor: 'rgba(107, 78, 22, 0.3)',
        },
        animatedStyle,
      ]}
    />
  );
};

const AudioJournalScreen: React.FC = () => {
  // Animation values
  const screenOpacity = useSharedValue(0);
  const screenTranslateY = useSharedValue(20);
  const modeTagTranslateX = useSharedValue(0);
  const recordButtonScale = useSharedValue(1);
  const isRecording = useSharedValue(false);

  useEffect(() => {
    // Screen entry animation
    screenOpacity.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });
    screenTranslateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.exp),
    });

    // Mode tag breathing animation
    modeTagTranslateX.value = withRepeat(
      withTiming(4, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [{ translateY: screenTranslateY.value }],
  }));

  const modeTagAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: modeTagTranslateX.value }],
  }));

  const recordButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordButtonScale.value }],
  }));

  const handleRecordPress = () => {
    isRecording.value = !isRecording.value;
    
    if (isRecording.value) {
      recordButtonScale.value = withRepeat(
        withTiming(1.2, { duration: 800 }),
        -1,
        true
      );
    } else {
      recordButtonScale.value = withTiming(1, { duration: 300 });
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#FFF7F2" />
      <Container>
        <AnimatedView style={screenAnimatedStyle}>
          <Header>
            <HeaderButton>
              <Icon name="chevron-back" size={24} color="#333333" />
            </HeaderButton>
            <HeaderTitle>Add Audio Journal</HeaderTitle>
            <HeaderButton>
              <Icon name="notifications-outline" size={24} color="#333333" />
            </HeaderButton>
          </Header>

          <AnimatedView style={modeTagAnimatedStyle}>
            <ModeTag>
              <Icon name="mic-outline" size={16} color="#6B4E16" />
              <ModeTagText>Audio Journal</ModeTagText>
            </ModeTag>
          </AnimatedView>

          <PromptText>Say anything that's on your mind!</PromptText>

          <WaveformContainer>
            {Array.from({ length: 30 }, (_, index) => (
              <WaveformBar key={index} index={index} />
            ))}
          </WaveformContainer>

          <ControlsRow>
            <TouchableOpacity>
              <Icon name="close-circle-outline" size={48} color="#CAB6A0" />
            </TouchableOpacity>

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={handleRecordPress}>
                <AnimatedView style={recordButtonAnimatedStyle}>
                  <RecordButtonContainer
                      colors={['#8cd7c5', '#6bbfa5']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                    <LottieView
                      source={require('./glow-animation.json')} // Placeholder for Lottie file
                      autoPlay
                      loop
                      style={{
                        position: 'absolute',
                        width: 100,
                        height: 100,
                      }}
                    />
                    <Icon 
                      name={isRecording.value ? "square" : "mic"} 
                      size={32} 
                      color="white" 
                    />
                  </RecordButtonContainer>
                </AnimatedView>
              </TouchableOpacity>
              <TimerText>Ready?</TimerText>
            </View>

            <TouchableOpacity>
              <Icon name="checkmark-circle-outline" size={48} color="#A9CDA8" />
            </TouchableOpacity>
          </ControlsRow>
        </AnimatedView>
      </Container>
    </>
  );
};

export default AudioJournalScreen;