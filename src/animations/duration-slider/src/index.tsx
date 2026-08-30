import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useFont } from '@shopify/react-native-skia';
import { APP_FONT_ASSETS } from '@/src/theme/typography';

import { CircularSlider } from './components/circular-slider';

const App = () => {
  const { width: windowWidth } = useWindowDimensions();
  const size = windowWidth * 0.8;

  const font = useFont(APP_FONT_ASSETS.bold, 100);

  return (
    <View style={styles.container}>
      {font && (
        <CircularSlider
          minVal={1}
          maxVal={12}
          onValueChange={value => {
            console.log({ value });
          }}
          width={size}
          height={size}
          font={font}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { App };
