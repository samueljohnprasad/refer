const { withUniwindConfig } = require('uniwind/metro');
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;

config.resolver.assetExts.push("lottie");
config.resolver.assetExts.push("riv");
config.resolver.assetExts = resolver.assetExts.filter((ext) => ext !== "svg");
config.resolver.sourceExts = [...resolver.sourceExts, "svg"];
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
  getTransformOptions: async () => ({
    transform: { inlineRequires: false, experimentalImportSupport: false },
  }),
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
  extraThemes: ['dark'],
});
