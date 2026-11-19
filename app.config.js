module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins || []), "expo-video"],
  extra: {
    ...config.extra,
    posthogProjectToken:
      process.env.POSTHOG_PROJECT_TOKEN ||
      "phc_BojwmboNhq7cfCBxCXaTTtNxHuvbCm5zHDp56STTA3rc",
    posthogHost: process.env.POSTHOG_HOST || "https://eu.i.posthog.com",
  },
});
