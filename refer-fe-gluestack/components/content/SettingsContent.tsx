import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Divider } from "../ui/divider";
import { Switch } from "../ui/switch";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from "../ui/form-control";

const SettingsContent = () => {
  const [notifications, setNotifications] = React.useState(true);
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);

  const settingSections = [
    {
      id: "notifications",
      title: "Notifications",
      settings: [
        {
          id: "push",
          label: "Push Notifications",
          description: "Receive push notifications for important updates",
          value: notifications,
          onChange: () => setNotifications(!notifications),
        },
        {
          id: "email",
          label: "Email Alerts",
          description: "Receive email notifications for important updates",
          value: emailAlerts,
          onChange: () => setEmailAlerts(!emailAlerts),
        },
      ],
    },
    {
      id: "appearance",
      title: "Appearance",
      settings: [
        {
          id: "dark",
          label: "Dark Mode",
          description: "Enable dark mode for the app",
          value: darkMode,
          onChange: () => setDarkMode(!darkMode),
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      settings: [
        {
          id: "2fa",
          label: "Two-Factor Authentication",
          description: "Add an extra layer of security to your account",
          value: twoFactor,
          onChange: () => setTwoFactor(!twoFactor),
        },
      ],
    },
  ];

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Settings
      </Heading>
      <Text className="text-typography-600 mb-6">
        Customize your app preferences and account settings.
      </Text>

      <FlatList
        data={settingSections}
        renderItem={({ item }) => (
          <Box className="mb-6">
            <Heading size="md" className="mb-3">
              {item.title}
            </Heading>
            {item.settings.map((setting) => (
              <Box key={setting.id} className="mb-4">
                <FormControl>
                  <Box className="flex-row justify-between items-center">
                    <Box>
                      <FormControlLabel>
                        <FormControlLabelText>
                          {setting.label}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <FormControlHelper>
                        <FormControlHelperText>
                          {setting.description}
                        </FormControlHelperText>
                      </FormControlHelper>
                    </Box>
                    <Switch
                      value={setting.value}
                      onValueChange={setting.onChange}
                    />
                  </Box>
                </FormControl>
              </Box>
            ))}
            <Divider className="my-2" />
          </Box>
        )}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
};

export default SettingsContent;
