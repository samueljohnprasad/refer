const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('lottie');
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: { inlineRequires: true, experimentalImportSupport: false },
  }),
};

module.exports = withNativeWind(config, { input: './global.css' });