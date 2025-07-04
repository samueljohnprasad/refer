import React, { useState } from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import {
  Icon,
  SettingsIcon,
  MailIcon,
  RepeatIcon,
  BellIcon,
  MessageCircleIcon,
  GlobeIcon,
  CalendarDaysIcon,
} from "@/components/ui/icon";
import Logo from "@/assets/Icons/Logo";

const navItems = [
  { key: "home", label: "Home", icon: CalendarDaysIcon },
  { key: "jobs", label: "Jobs", icon: GlobeIcon },
  { key: "referrals", label: "Referrals", icon: RepeatIcon },
  { key: "messages", label: "Messages", icon: MailIcon },
  { key: "notifications", label: "Notifications", icon: BellIcon },
  { key: "network", label: "Network", icon: MessageCircleIcon },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const SideNav = () => {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (key: string) => {
    setActiveItem(key);
  };

  return (
    <Box className="h-screen flex flex-col">
      {/* Logo Section */}
      <Box className="h-14 border-b border-primaryBorder flex items-center px-4 justify-center">
        <Text className="text-xl font-bold text-primary-700 ml-2">
          ReferNet
        </Text>
      </Box>

      {/* Navigation Items */}
      <Box className="flex-1 py-4 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => (
          <Pressable key={item.key} onPress={() => handleItemClick(item.key)}>
            <Box
              className={` flex-row items-center px-4 py-3 mx-2 rounded-lg mb-1`}
            >
              <Box className="mr-3">
                <Icon as={item.icon} size="md" />
              </Box>
              <Box className="group">
                <Text
                  className={`lg:group-hover:translate-x-1 lg:group-hover:text-primary-700 font-medium transition-all duration-150 ease-in-out ${
                    activeItem === item.key
                      ? "text-primary-700"
                      : "text-typography-600"
                  }`}
                >
                  {item.label}
                </Text>
              </Box>
            </Box>
          </Pressable>
        ))}
      </Box>
    </Box>
  );
};

export default SideNav;
