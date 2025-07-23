export interface SeasonalTheme {
  day: {
    gradient: readonly [string, string, string];
    particleDot: string;
    particleSparkle: string;
  };
  night: {
    gradient: readonly [string, string, string];
    particleDot: string;
    particleSparkle: string;
  };
}

export const seasonalThemes: Record<number, SeasonalTheme> = {
  // January - Winter serenity
  0: {
    day: {
      gradient: ["#F0F8FF", "#E6F3FF", "#D6EAF8"] as const, // Soft winter blues
      particleDot: "#7FB3D3", // Gentle blue
      particleSparkle: "#AED6F1", // Light blue
    },
    night: {
      gradient: ["#E8F4F8", "#D4E9F7", "#C5D9EA"] as const, // Softer winter night
      particleDot: "#87CEEB", // Sky blue
      particleSparkle: "#B0E0E6", // Powder blue
    },
  },
  // February - Late winter warmth
  1: {
    day: {
      gradient: ["#FDF2E9", "#FADBD8", "#F8C8C4"] as const, // Soft pinks
      particleDot: "#E8A4A0", // Gentle pink
      particleSparkle: "#F1948A", // Light pink
    },
    night: {
      gradient: ["#F4E6F7", "#E8D5F0", "#DCC5E8"] as const, // Gentle lavender night
      particleDot: "#D8BFD8", // Thistle
      particleSparkle: "#E6E6FA", // Lavender
    },
  },
  // March - Early spring awakening
  2: {
    day: {
      gradient: ["#E8F8F5", "#D0F0C0", "#B8E6B8"] as const, // Fresh greens
      particleDot: "#7FB069", // Spring green
      particleSparkle: "#A3D977", // Light green
    },
    night: {
      gradient: ["#E8F5E8", "#D4EDDA", "#C3E6CB"] as const, // Soft spring night
      particleDot: "#90EE90", // Light green
      particleSparkle: "#B2FFC7", // Mint green
    },
  },
  // April - Spring bloom
  3: {
    day: {
      gradient: ["#F0FFF0", "#E6FFE6", "#CCFFCC"] as const, // Bright spring
      particleDot: "#7BC97B", // Fresh green
      particleSparkle: "#9FDF9F", // Light green
    },
    night: {
      gradient: ["#F0FFF0", "#E6FFE6", "#D4EDDA"] as const, // Gentle spring night
      particleDot: "#98FB98", // Pale green
      particleSparkle: "#AFEEEE", // Pale turquoise
    },
  },
  // May - Late spring vitality
  4: {
    day: {
      gradient: ["#F0FFF0", "#E0FFE0", "#D0FFD0"] as const, // Vibrant greens
      particleDot: "#66BB6A", // Vibrant green
      particleSparkle: "#81C784", // Light green
    },
    night: {
      gradient: ["#F0FFF0", "#E0FFE0", "#D1F2EB"] as const, // Serene spring night
      particleDot: "#98FB98", // Pale green
      particleSparkle: "#B0FFC7", // Light mint
    },
  },
  // June - Early summer warmth
  5: {
    day: {
      gradient: ["#FFFACD", "#FFF8DC", "#F0E68C"] as const, // Warm yellows
      particleDot: "#DAA520", // Golden
      particleSparkle: "#F4C430", // Light gold
    },
    night: {
      gradient: ["#FFFACD", "#FFF8DC", "#F5F5DC"] as const, // Gentle summer night
      particleDot: "#F0E68C", // Khaki
      particleSparkle: "#FFFFE0", // Light yellow
    },
  },
  // July - Summer radiance
  6: {
    day: {
      gradient: ["#FFF8DC", "#FFEBCD", "#FFE4B5"] as const, // Bright summer
      particleDot: "#F4A460", // Sandy brown
      particleSparkle: "#FFDAB9", // Peach puff
    },
    night: {
      gradient: ["#FFF8DC", "#FFEBCD", "#F5DEB3"] as const, // Gentle summer night
      particleDot: "#DEB887", // Burlywood
      particleSparkle: "#F0E68C", // Khaki
    },
  },
  // August - Late summer glow
  7: {
    day: {
      gradient: ["#FFEAA7", "#FDCB6E", "#F8D7A1"] as const, // Golden summer
      particleDot: "#DEB887", // Burlywood
      particleSparkle: "#F4A460", // Sandy brown
    },
    night: {
      gradient: ["#FFF8DC", "#F5DEB3", "#F0E68C"] as const, // Soft summer night
      particleDot: "#D2B48C", // Tan
      particleSparkle: "#F4A460", // Sandy brown
    },
  },
  // September - Early autumn
  8: {
    day: {
      gradient: ["#FFF5EE", "#FFEEDD", "#FFE4B5"] as const, // Autumn warmth
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
    },
    night: {
      gradient: ["#3B2F2F", "#5D4E37", "#8B4513"] as const, // Autumn night
      particleDot: "#D2691E", // Chocolate
      particleSparkle: "#F4A460", // Sandy brown
    },
  },
  // October - Peak autumn
  9: {
    day: {
      gradient: ["#FFF8DC", "#FFEBCD", "#FFDAB9"] as const, // Rich autumn
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
    },
    night: {
      gradient: ["#F5DEB3", "#DEB887", "#D2B48C"] as const, // Gentle autumn night
      particleDot: "#BC8F8F", // Rosy brown
      particleSparkle: "#F4A460", // Sandy brown
    },
  },
  // November - Late autumn
  10: {
    day: {
      gradient: ["#F5DEB3", "#DEB887", "#D2B48C"] as const, // Muted autumn
      particleDot: "#A0522D", // Sienna
      particleSparkle: "#CD853F", // Peru
    },
    night: {
      gradient: ["#F5DEB3", "#D2B48C", "#BC8F8F"] as const, // Warm autumn night
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
    },
  },
  // December - Winter celebration
  11: {
    day: {
      gradient: ["#F0F8FF", "#E0E6FF", "#D0D0FF"] as const, // Cool winter
      particleDot: "#4682B4", // Steel blue
      particleSparkle: "#6495ED", // Cornflower blue
    },
    night: {
      gradient: ["#E6F3FF", "#D0E7FF", "#B8DDFF"] as const, // Gentle winter night
      particleDot: "#87CEEB", // Sky blue
      particleSparkle: "#B0E0E6", // Powder blue
    },
  },
};

export const defaultTheme: SeasonalTheme = {
  day: {
    gradient: ["#FFF8E1", "#FFF3E0", "#FFECB3"] as const,
    particleDot: "#FFB74D",
    particleSparkle: "#FFCC80",
  },
  night: {
    gradient: ["#E3F2FD", "#E8EAF6", "#F3E5F5"] as const,
    particleDot: "#7986CB",
    particleSparkle: "#9FA8DA",
  },
};
