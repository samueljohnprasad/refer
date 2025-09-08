const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = false;

// Add lottie extension to assetExts
config.resolver.assetExts.push('lottie');

module.exports = withNativeWind(config, { input: "./global.css" });
