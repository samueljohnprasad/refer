import React, { useState, useEffect } from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Pressable } from "../ui/pressable";
import {
  Icon,
  SettingsIcon,
  MailIcon,
  BellIcon,
  MessageCircleIcon,
  GlobeIcon,
  CalendarDaysIcon,
  RepeatIcon,
} from "@/components/ui/icon";
import { useRouter, usePathname } from "expo-router";
// import Rocket from "@/assets/Icons/Rocket";

type NavItem = {
  key: string;
  label: string;
  icon: React.ElementType;
  path: string;
};

const navItems: NavItem[] = [
  { key: "home", label: "Home", icon: CalendarDaysIcon, path: "/" },
  { key: "jobs", label: "Jobs", icon: GlobeIcon, path: "/jobs" },
  {
    key: "referrals",
    label: "Referrals",
    icon: RepeatIcon,
    path: "/referrals",
  },
  { key: "messages", label: "Messages", icon: MailIcon, path: "/messages" },
  {
    key: "notifications",
    label: "Notifications",
    icon: BellIcon,
    path: "/notifications",
  },
  {
    key: "network",
    label: "Network",
    icon: MessageCircleIcon,
    path: "/network",
  },
  { key: "settings", label: "Settings", icon: SettingsIcon, path: "/settings" },
];

const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState("home");

  // Update active item based on current route
  useEffect(() => {
    // Find the matching nav item based on the current path
    const currentPath = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
    const matchingItem = navItems.find((item) => item.path === currentPath);

    if (matchingItem) {
      setActiveItem(matchingItem.key);
    } else {
      setActiveItem("home"); // Default to home if no match
    }
  }, [pathname]);

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item.key);
    router.push(item.path as any);
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
          <Pressable key={item.key} onPress={() => handleItemClick(item)}>
            <Box
              className={` flex-row items-center px-4 py-3 mx-2 rounded-lg mb-1 ${
                activeItem === item.key ? "bg-primary-100" : "hover:bg-gray-100"
              }`}
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
