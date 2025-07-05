import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { Heading } from "../ui/heading";
import { usePathname } from "expo-router";
import { Divider } from "../ui/divider";
import {
  Icon,
  InfoIcon,
  BellIcon,
  StarIcon,
  CalendarDaysIcon,
  MessageCircleIcon,
  SettingsIcon,
  GlobeIcon,
  SearchIcon,
} from "../ui/icon";

type ContentItem = {
  title: string;
  icon: React.ElementType;
  items: string[];
  stats: Array<{ label: string; value: string }>;
  tags: string[];
};

type RouteContent = {
  [key: string]: ContentItem;
};

// Define different content for each route
const routeContent: RouteContent = {
  home: {
    title: "Home Updates",
    icon: CalendarDaysIcon,
    items: [
      "Welcome to your personalized dashboard",
      "5 new job opportunities match your profile",
      "Your network has grown by 12% this month",
      "Complete your profile to improve visibility",
    ],
    stats: [
      { label: "Profile Views", value: "124" },
      { label: "Connection Requests", value: "8" },
    ],
    tags: ["Dashboard", "Career", "Networking", "Jobs"],
  },
  jobs: {
    title: "Job Insights",
    icon: GlobeIcon,
    items: [
      "Top skills in demand for your field",
      "15 new job postings in your area",
      "Salary trends in your industry",
      "Companies actively hiring this month",
    ],
    stats: [
      { label: "New Jobs Today", value: "32" },
      { label: "Applied", value: "5" },
    ],
    tags: ["Remote", "Tech", "Engineering", "Design"],
  },
  referrals: {
    title: "Referral Tips",
    icon: StarIcon,
    items: [
      "How to ask for a referral effectively",
      "Building relationships with potential referrers",
      "Following up after a referral",
      "Thanking your network for support",
    ],
    stats: [
      { label: "Active Referrals", value: "3" },
      { label: "Success Rate", value: "78%" },
    ],
    tags: ["Networking", "Connections", "Career Growth", "Interviews"],
  },
  messages: {
    title: "Communication Tips",
    icon: MessageCircleIcon,
    items: [
      "Crafting effective networking messages",
      "Best times to reach out to connections",
      "Templates for follow-up messages",
      "Maintaining professional relationships",
    ],
    stats: [
      { label: "Unread Messages", value: "4" },
      { label: "Response Rate", value: "92%" },
    ],
    tags: ["Networking", "Communication", "Follow-up", "Connections"],
  },
  notifications: {
    title: "Stay Updated",
    icon: BellIcon,
    items: [
      "Customize your notification preferences",
      "Important alerts you might have missed",
      "Weekly digest of your network activity",
      "Set up custom alert filters",
    ],
    stats: [
      { label: "New Notifications", value: "12" },
      { label: "Read Today", value: "8" },
    ],
    tags: ["Alerts", "Updates", "Activity", "Preferences"],
  },
  network: {
    title: "Networking Insights",
    icon: SearchIcon,
    items: [
      "Expand your professional circle",
      "Industry events happening this month",
      "Connect with alumni from your school",
      "Join relevant professional groups",
    ],
    stats: [
      { label: "Total Connections", value: "256" },
      { label: "Growth Rate", value: "+15%" },
    ],
    tags: ["Connections", "Events", "Industry", "Alumni"],
  },
  settings: {
    title: "Optimization Tips",
    icon: SettingsIcon,
    items: [
      "Secure your account with 2FA",
      "Update your privacy preferences",
      "Sync with your calendar for better scheduling",
      "Connect your other professional accounts",
    ],
    stats: [
      { label: "Account Health", value: "92%" },
      { label: "Last Updated", value: "Today" },
    ],
    tags: ["Security", "Privacy", "Customization", "Integration"],
  },
};

const SideNews: React.FC = () => {
  const pathname = usePathname();

  // Determine which content to show based on the current route
  const currentPath = pathname === "/" ? "home" : pathname.split("/")[1];
  const content = routeContent[currentPath] || routeContent.home;

  return (
    <Box className="p-4">
      <Box className="flex-row items-center mb-4">
        <Icon as={content.icon} size="md" color="black" className="mr-2" />
        <Heading size="md" className="text-primary-700">
          {content.title}
        </Heading>
      </Box>

      <Box className="space-y-3 mb-6">
        {content.items.map((item: string, index: number) => (
          <Box
            key={index}
            className="p-3 bg-background-50 rounded-md border border-primaryBorder"
          >
            <Text className="text-sm text-typography-700">{item}</Text>
          </Box>
        ))}
      </Box>

      <Divider className="my-4" />

      <Box className="mb-6">
        <Text className="text-sm font-medium text-typography-600 mb-3">
          Quick Stats
        </Text>
        <Box className="flex-row justify-between">
          {content.stats.map(
            (stat: { label: string; value: string }, index: number) => (
              <Box
                key={index}
                className="bg-primary-50 rounded-md p-3 flex-1 mx-1"
              >
                <Text className="text-xs text-typography-500">
                  {stat.label}
                </Text>
                <Text className="text-lg font-bold text-primary-700">
                  {stat.value}
                </Text>
              </Box>
            )
          )}
        </Box>
      </Box>

      <Box className="mt-4">
        <Text className="text-xs text-typography-500 mb-2">
          Trending Topics
        </Text>
        <Box className="flex-row flex-wrap gap-2">
          {content.tags.map((tag: string, index: number) => (
            <Box key={index} className="px-2 py-1 bg-primary-50 rounded-full">
              <Text className="text-xs text-primary-700">#{tag}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default SideNews;
