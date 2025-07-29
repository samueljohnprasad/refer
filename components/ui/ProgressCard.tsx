import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { ProgressCardProps } from '@/types/journal';

export const ProgressCard: React.FC<ProgressCardProps> = ({
  icon,
  value,
  label,
  accent,
}) => {
  // Therapeutic color palette - soft, calming gradients
  const getTherapeuticColors = (accent: string): [string, string, string] => {
    const colorMap: { [key: string]: [string, string, string] } = {
      // Soft sage green for growth/progress
      '#10B981': ['#F0FDF4', '#DCFCE7', '#BBF7D0'],
      // Warm lavender for mindfulness
      '#8B5CF6': ['#FAF5FF', '#F3E8FF', '#E9D5FF'],
      // Soft coral for energy
      '#F59E0B': ['#FFFBEB', '#FEF3C7', '#FDE68A'],
      default: ['#F8FAFC', '#F1F5F9', '#E2E8F0']
    };
    return colorMap[accent] || colorMap.default;
  };

  const therapeuticColors = getTherapeuticColors(accent);

  return (
    <Box style={styles.cardWrapper}>
      <LinearGradient
        colors={therapeuticColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardContainer}
      >
        <VStack space="sm" style={styles.cardContent}>
          {/* Soft icon container */}
          <Box style={[styles.iconContainer, { backgroundColor: `${accent}10` }]}>
            <Text style={[styles.iconText, { color: accent }]}>{icon}</Text>
          </Box>
          
          {/* Gentle stats presentation */}
          <VStack space="xs" style={styles.statsContainer}>
            <Text style={[styles.valueText, { color: accent }]}>
              {value}
            </Text>
            <Text style={styles.labelText}>{label}</Text>
          </VStack>
        </VStack>
      </LinearGradient>
    </Box>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginHorizontal: 6,
    // Soft, therapeutic shadow
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardContainer: {
    flex: 1,
    height: 110,
    borderRadius: 24,
    padding: 20,
    // Subtle border for therapeutic feel
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    // Very soft shadow for depth
    shadowColor: '#64748B',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '500',
  },
  statsContainer: {
    alignItems: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 2,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    opacity: 0.7,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
