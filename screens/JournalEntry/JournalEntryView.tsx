import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import type { BadgeItem, MoodOption, Recommendation } from '@/hooks/useJournalEntry';

// Animated helpers
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const GENTLE = Easing.bezier(0.25, 0.46, 0.45, 0.94);

type MoodOptionItemProps = { item: MoodOption; selected: boolean; onPress: () => void };
const MoodOptionItem: React.FC<MoodOptionItemProps> = ({ item, selected, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <AnimatedTouchable
      onPressIn={() =>
        Animated.timing(scale, {
          toValue: 0.98,
          duration: 140,
          easing: GENTLE,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.timing(scale, {
          toValue: 1,
          duration: 220,
          easing: GENTLE,
          useNativeDriver: true,
        }).start()
      }
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Select mood ${item.label}`}
      activeOpacity={0.9}
      style={[
        styles.moodChip,
        selected && styles.moodChipSelected,
        { transform: [{ scale }] },
      ]}
    >
      <Text style={styles.moodEmoji}>{item.emoji}</Text>
      <Text style={styles.moodLabel}>{item.label}</Text>
    </AnimatedTouchable>
  );
};

const { width } = Dimensions.get('window');

export interface JournalEntryViewProps {
  moods: MoodOption[];
  selectedMood: string;
  setSelectedMood: (emoji: string) => void;
  currentPrompt: string;
  shufflePrompt: () => void;
  currentRecommendation: Recommendation;
  badges: BadgeItem[];
}

const JournalEntryView: React.FC<JournalEntryViewProps> = ({
  moods,
  selectedMood,
  setSelectedMood,
  currentPrompt,
  shufflePrompt,
  currentRecommendation,
  badges,
}) => {
  // Mount animations
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslateY = useRef(new Animated.Value(8)).current;
  const sectionAnims = useRef(
    Array.from({ length: 6 }).map(() => ({
      o: new Animated.Value(0),
      y: new Animated.Value(6),
    }))
  ).current;

  useEffect(() => {
    // Hero gentle fade + slide
    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 1000,
        easing: GENTLE,
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 1000,
        easing: GENTLE,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Stagger sections
      const seq = sectionAnims.map(({ o, y }) =>
        Animated.parallel([
          Animated.timing(o, {
            toValue: 1,
            duration: 900,
            easing: GENTLE,
            useNativeDriver: true,
          }),
          Animated.timing(y, {
            toValue: 0,
            duration: 900,
            easing: GENTLE,
            useNativeDriver: true,
          }),
        ])
      );
      Animated.stagger(250, seq).start();
    });
  }, [heroOpacity, heroTranslateY, sectionAnims]);

  const sectionStyle = (i: number) => ({
    opacity: sectionAnims[i].o,
    transform: [{ translateY: sectionAnims[i].y }],
  });

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.mainCard}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi, friend</Text>
              <Text style={styles.title}>Let's continue journaling!</Text>
            </View>
            <TouchableOpacity style={styles.editButton} activeOpacity={0.8}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Progress Card */}
          <Animated.View
            style={[
              styles.heroCard,
              { opacity: heroOpacity, transform: [{ translateY: heroTranslateY }] },
            ]}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Today's Reflection</Text>
              <Text style={styles.heroSubtitle} numberOfLines={2}>
                {currentPrompt}
              </Text>
              
              {/* Progress indicator */}
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.progressText}>3 of 7</Text>
              </View>

              <TouchableOpacity
                onPress={shufflePrompt}
                style={styles.heroButton}
                activeOpacity={0.9}
              >
                <Text style={styles.heroButtonText}>Let's go!</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.heroIcon}>
              <Text style={styles.heroEmoji}>🧠</Text>
            </View>
          </Animated.View>

          {/* My Level Progress */}
          <Animated.View style={sectionStyle(0)}>
            <View style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <Text style={styles.levelTitle}>My Level Progress</Text>
                <Text style={styles.levelXP}>323 XP</Text>
              </View>
              <View style={styles.levelProgress}>
                <View style={styles.levelProgressFill} />
              </View>
              <Text style={styles.levelText}>Gold • 34%</Text>
            </View>
          </Animated.View>

          {/* Mood Selection */}
          <Animated.View style={sectionStyle(1)}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How are you feeling?</Text>
              <FlatList
                horizontal
                data={moods}
                keyExtractor={(item) => item.label}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <MoodOptionItem
                    item={item}
                    selected={selectedMood === item.emoji}
                    onPress={() => setSelectedMood(item.emoji)}
                  />
                )}
              />
            </View>
          </Animated.View>

          {/* Recommendations */}
          <Animated.View style={sectionStyle(2)}>
            <View style={styles.recommendationCard}>
              <Text style={styles.cardTitle}>Today's Recommendation</Text>
              <Text style={styles.recommendationText}>✨ {currentRecommendation.activity}</Text>
              <Text style={styles.quoteText}>"{currentRecommendation.quote}"</Text>
            </View>
          </Animated.View>

          {/* My Badges */}
          <Animated.View style={sectionStyle(3)}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Badges</Text>
                <Text style={styles.seeAll}>See All</Text>
              </View>
              <FlatList
                horizontal
                data={badges.slice(0, 4)}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={[styles.badgeItem, !item.achieved && styles.badgeItemLocked]}>
                    <Text style={styles.badgeEmoji}>{item.icon}</Text>
                    <Text style={[styles.badgeTitle, !item.achieved && styles.badgeTitleLocked]}>
                      {item.title}
                    </Text>
                  </View>
                )}
              />
            </View>
          </Animated.View>

          {/* Journal Entry */}
          <Animated.View style={sectionStyle(4)}>
            <View style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryMood}>
                  <Text style={styles.entryMoodEmoji}>{selectedMood}</Text>
                </View>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryDate}>Sept 3, 2025 • 10:42 AM</Text>
                  <Text style={styles.entryTitle}>Today's Entry</Text>
                </View>
              </View>
              <Text style={styles.entryContent}>
                Today was a wonderful day! I spent the afternoon volunteering at the local shelter, 
                helping and organizing donations. Later, filled with joy, I met up with friends. 
                We laughed so much! I'm truly optimistic about the future.
              </Text>
              <View style={styles.entryTags}>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Gratitude</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Joy</Text>
                </View>
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Hope</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* AI Insights */}
          <Animated.View style={sectionStyle(5)}>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <View style={styles.insightIcon}>
                  <Text style={styles.insightEmoji}>🔮</Text>
                </View>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>AI Insights</Text>
                  <Text style={styles.insightText}>
                    Positive sentiment with strong themes of joy and connection
                  </Text>
                </View>
                <TouchableOpacity style={styles.chevron}>
                  <Text style={styles.chevronText}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Design system styles following quiz UI patterns
const styles = StyleSheet.create({
  // Base layout
  screen: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  container: { 
    paddingHorizontal: 20, 
    paddingVertical: 24 
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 34,
  },
  editButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  // Hero card (yellow like quiz card)
  heroCard: {
    backgroundColor: '#FFD93D',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  heroContent: {
    flex: 1,
    paddingRight: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    width: '43%',
    backgroundColor: '#1E293B',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  heroButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 24,
  },

  // Level progress card (purple like leaderboard)
  levelCard: {
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  levelXP: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD93D',
  },
  levelProgress: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    marginBottom: 8,
  },
  levelProgressFill: {
    height: '100%',
    width: '34%',
    backgroundColor: '#FFD93D',
    borderRadius: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },

  // Sections
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },

  // Mood chips
  moodChip: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  moodChipSelected: {
    backgroundColor: '#FFD93D',
    borderColor: '#1E293B',
  },
  moodEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },

  // Recommendation card (blue like quiz categories)
  recommendationCard: {
    backgroundColor: '#60A5FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 6,
    fontWeight: '500',
  },
  quoteText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
    lineHeight: 20,
  },

  // Badge items
  badgeItem: {
    width: 70,
    height: 80,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  badgeItemLocked: {
    opacity: 0.5,
  },
  badgeEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  badgeTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  badgeTitleLocked: {
    color: '#94A3B8',
  },

  // Entry card
  entryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryMood: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD93D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  entryMoodEmoji: {
    fontSize: 18,
  },
  entryInfo: {
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#475569',
    marginBottom: 12,
  },
  entryTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Tags
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  // Insight card
  insightCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightEmoji: {
    fontSize: 18,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  chevron: {
    padding: 8,
  },
  chevronText: {
    fontSize: 16,
    color: '#94A3B8',
  },
});

export default JournalEntryView;
