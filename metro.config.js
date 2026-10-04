const { withUniwindConfig } = require('uniwind/metro');
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
const { transformer, resolver } = config;
// The Remotion project shares this repo but is build-time only — keep Metro from
// crawling or resolving it. Anchored to this directory so node_modules/remotion
// (which Remotion's own tooling needs) is untouched.
const escapeForRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
config.resolver.blockList = [
  ...[].concat(config.resolver.blockList ?? []).filter(Boolean),
  new RegExp(`^${escapeForRegExp(__dirname)}/remotion/.*`),
];

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
