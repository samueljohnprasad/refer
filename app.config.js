const appConfig = require("./app.json");

module.exports = () => ({
  ...appConfig.expo,
  plugins: [...(appConfig.expo.plugins || []), "expo-video"],
  extra: {
    ...appConfig.expo.extra,
    posthogProjectToken:
      process.env.POSTHOG_PROJECT_TOKEN ||
      "phc_BojwmboNhq7cfCBxCXaTTtNxHuvbCm5zHDp56STTA3rc",
    posthogHost: process.env.POSTHOG_HOST || "https://eu.i.posthog.com",
  },
});
