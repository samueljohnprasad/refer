const { withNativeWind } = require('nativewind/metro');
const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

const config = getSentryExpoConfig(__dirname);
config.resolver.assetExts.push('lottie');
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: { inlineRequires: true, experimentalImportSupport: false },
  }),
};

module.exports = withNativeWind(config, { input: './global.css' });