import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AchievementBadge } from "@/src/components/AchievementBadge";
import {
  useAchievementsWithProgress,
  useAchievementStats,
  useClaimAchievement,
} from "@/hooks/data/useAchievements";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function AchievementsScreen() {
  const router = useRouter();
  const { data: achievements, isLoading } = useAchievementsWithProgress();
  const stats = useAchievementStats();
  const claimMutation = useClaimAchievement();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  const categories = [
    { id: "all", label: "All", icon: "grid" },
    { id: "streak", label: "Streaks", icon: "zap" },
    { id: "entries", label: "Entries", icon: "edit-3" },
    { id: "consistency", label: "Consistency", icon: "calendar" },
    { id: "special", label: "Special", icon: "star" },
  ];

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements?.filter((a) => a.category === selectedCategory);

  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0;

  const handleAchievementPress = (achievement: any) => {
    setSelectedAchievement(achievement);
    if (achievement.unlocked && !achievement.is_claimed) {
      claimMutation.mutate(achievement.id);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "Achievements",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient
        colors={["#7B61FF", "#9C7CFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.percentage}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${stats.percentage}%` }]}
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
          >
            <Feather
              name={category.icon as any}
              size={16}
              color={selectedCategory === category.id ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.achievementsList}
        contentContainerStyle={styles.achievementsContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading achievements...</Text>
          </View>
        ) : filteredAchievements && filteredAchievements.length > 0 ? (
          filteredAchievements.map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              unlocked={achievement.unlocked}
              progress={achievement.progress}
              progressPercentage={achievement.progress_percentage}
              badgeColor={achievement.badge_color}
              onPress={() => handleAchievementPress(achievement)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>No achievements yet</Text>
            <Text style={styles.emptySubtext}>
              Start journaling to unlock achievements!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Achievement Detail Modal */}
      <Modal
        visible={!!selectedAchievement}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAchievement(null)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.modalContent}
          >
            {selectedAchievement && (
              <>
                <Text style={styles.modalIcon}>{selectedAchievement.icon}</Text>
                <Text style={styles.modalTitle}>{selectedAchievement.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedAchievement.description}
                </Text>
                
                {selectedAchievement.unlocked ? (
                  <View style={styles.unlockedBadge}>
                    <Feather name="check-circle" size={20} color="#10B981" />
                    <Text style={styles.unlockedText}>Unlocked!</Text>
                  </View>
                ) : (
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressInfoText}>
                      Progress: {selectedAchievement.progress} /{" "}
                      {selectedAchievement.requirement_value}
                    </Text>
                    <View style={styles.modalProgressBar}>
                      <View
                        style={[
                          styles.modalProgressFill,
                          {
                            width: `${selectedAchievement.progress_percentage}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  onPress={() => setSelectedAchievement(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingTop: 100,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  progressBarContainer: {
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
  },
  categoriesScroll: {
    maxHeight: 50,
    marginVertical: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#7B61FF",
    borderColor: "#7B61FF",
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 6,
  },
  categoryLabelActive: {
    color: "#fff",
  },
  achievementsList: {
    flex: 1,
  },
  achievementsContent: {
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    width: width - 40,
    maxWidth: 400,
    alignItems: "center",
  },
  modalIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  unlockedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: 8,
  },
  progressInfo: {
    width: "100%",
    marginBottom: 24,
  },
  progressInfoText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
    textAlign: "center",
  },
  modalProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  modalProgressFill: {
    height: "100%",
    backgroundColor: "#7B61FF",
    borderRadius: 4,
  },
  closeButton: {
    backgroundColor: "#7B61FF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
