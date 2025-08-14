export interface SeasonalTheme {
  day: {
    gradient: readonly [string, string, string];
    particleDot: string;
    particleSparkle: string;
    accent: string;
    background: string;
    surface: string;
    highlight: string;
    // Button colors
    buttonPrimary: string;
    buttonSecondary: string;
    buttonDisabled: string;
    buttonText: string;
    // Card colors
    cardBackground: string;
    cardBorder: string;
    cardShadow: string;
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textLink: string;
  };
  night: {
    gradient: readonly [string, string, string];
    particleDot: string;
    particleSparkle: string;
    accent: string;
    background: string;
    surface: string;
    highlight: string;
    // Button colors
    buttonPrimary: string;
    buttonSecondary: string;
    buttonDisabled: string;
    buttonText: string;
    // Card colors
    cardBackground: string;
    cardBorder: string;
    cardShadow: string;
    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textLink: string;
  };
}

export const seasonalThemes: Record<number, SeasonalTheme> = {
  // January - Winter serenity
  0: {
    day: {
      gradient: ["#F0F8FF", "#E6F3FF", "#D6EAF8"] as const, // Soft winter blues
      particleDot: "#7FB3D3", // Gentle blue
      particleSparkle: "#AED6F1", // Light blue
      accent: "#5DADE2", // Crisp winter blue
      background: "#FBFCFC", // Pure winter white
      surface: "#EBF5FB", // Soft blue surface
      highlight: "#3498DB", // Bright winter accent
      // Button colors
      buttonPrimary: "#3498DB", // Winter primary button
      buttonSecondary: "#AED6F1", // Soft secondary button
      buttonDisabled: "#D5DBDB", // Muted disabled button
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FBFCFC", // Pure card background
      cardBorder: "#D6EAF8", // Subtle blue border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#2C3E50", // Deep winter text
      textSecondary: "#5D6D7E", // Muted winter text
      textMuted: "#85929E", // Light muted text
      textLink: "#3498DB", // Winter link blue
    },
    night: {
      gradient: ["#E8F4F8", "#D4E9F7", "#C5D9EA"] as const, // Softer winter night
      particleDot: "#87CEEB", // Sky blue
      particleSparkle: "#B0E0E6", // Powder blue
      accent: "#85C1E9", // Moonlight blue
      background: "#F4F6F7", // Night winter background
      surface: "#D5DBDB", // Cool surface
      highlight: "#5499C7", // Winter night highlight
      // Button colors
      buttonPrimary: "#5499C7", // Night primary button
      buttonSecondary: "#85C1E9", // Soft night secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F4F6F7", // Night card background
      cardBorder: "#C5D9EA", // Soft night border
      cardShadow: "#99A3A4", // Gentle night shadow
      // Text colors
      textPrimary: "#1B2631", // Deep night text
      textSecondary: "#566573", // Muted night text
      textMuted: "#7B7D7D", // Light night muted
      textLink: "#5499C7", // Night link blue
    },
  },
  // February - Late winter warmth
  1: {
    day: {
      gradient: ["#FDF2E9", "#FADBD8", "#F8C8C4"] as const, // Soft pinks
      particleDot: "#E8A4A0", // Gentle pink
      particleSparkle: "#F1948A", // Light pink
      accent: "#EC7063", // Valentine's pink
      background: "#FDEAEA", // Blush background
      surface: "#F9EBEA", // Rose surface
      highlight: "#E74C3C", // Warm heart red
      // Button colors
      buttonPrimary: "#E74C3C", // Valentine primary button
      buttonSecondary: "#F1948A", // Soft pink secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FDEAEA", // Romantic card background
      cardBorder: "#F8C8C4", // Soft pink border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#641E16", // Deep romantic text
      textSecondary: "#A93226", // Warm secondary text
      textMuted: "#CD6155", // Light muted pink
      textLink: "#E74C3C", // Valentine link color
    },
    night: {
      gradient: ["#F4E6F7", "#E8D5F0", "#DCC5E8"] as const, // Gentle lavender night
      particleDot: "#D8BFD8", // Thistle
      particleSparkle: "#E6E6FA", // Lavender
      accent: "#BB8FCE", // Romantic purple
      background: "#F8F9FA", // Soft night background
      surface: "#EAEDED", // Lavender surface
      highlight: "#8E44AD", // Deep purple highlight
      // Button colors
      buttonPrimary: "#8E44AD", // Purple primary button
      buttonSecondary: "#BB8FCE", // Soft purple secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F8F9FA", // Gentle night card
      cardBorder: "#DCC5E8", // Lavender border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#4A235A", // Deep purple text
      textSecondary: "#6C3483", // Purple secondary text
      textMuted: "#8E44AD", // Light purple muted
      textLink: "#BB8FCE", // Romantic night link
    },
  },
  // March - Early spring awakening
  2: {
    day: {
      gradient: ["#E8F8F5", "#D0F0C0", "#B8E6B8"] as const, // Fresh greens
      particleDot: "#7FB069", // Spring green
      particleSparkle: "#A3D977", // Light green
      accent: "#58D68D", // Fresh growth green
      background: "#F7FCF9", // New leaf background
      surface: "#EAFAF1", // Spring surface
      highlight: "#27AE60", // Vibrant spring highlight
      // Button colors
      buttonPrimary: "#27AE60", // Spring growth button
      buttonSecondary: "#58D68D", // Fresh green secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F7FCF9", // Fresh spring card
      cardBorder: "#B8E6B8", // Green border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#0E4B23", // Deep forest green
      textSecondary: "#186A3B", // Spring green text
      textMuted: "#52C882", // Light green muted
      textLink: "#27AE60", // Spring link green
    },
    night: {
      gradient: ["#E8F5E8", "#D4EDDA", "#C3E6CB"] as const, // Soft spring night
      particleDot: "#90EE90", // Light green
      particleSparkle: "#B2FFC7", // Mint green
      accent: "#82E0AA", // Evening spring green
      background: "#F8F9FA", // Cool spring night
      surface: "#E8F8F5", // Mint surface
      highlight: "#2ECC71", // Spring night highlight
      // Button colors
      buttonPrimary: "#2ECC71", // Spring night button
      buttonSecondary: "#82E0AA", // Soft mint secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F8F9FA", // Spring night card
      cardBorder: "#C3E6CB", // Mint border
      cardShadow: "#99A3A4", // Gentle night shadow
      // Text colors
      textPrimary: "#0B5345", // Deep mint text
      textSecondary: "#148F77", // Spring night text
      textMuted: "#48C9B0", // Light mint muted
      textLink: "#2ECC71", // Spring night link
    },
  },
  // April - Spring bloom
  3: {
    day: {
      gradient: ["#F0FFF0", "#E6FFE6", "#CCFFCC"] as const, // Bright spring
      particleDot: "#7BC97B", // Fresh green
      particleSparkle: "#9FDF9F", // Light green
      accent: "#52C882", // Bloom green
      background: "#F8FDF8", // Honeysuckle background
      surface: "#E8F6F3", // Fresh bloom surface
      highlight: "#1ABC9C", // Turquoise bloom highlight
      // Button colors
      buttonPrimary: "#1ABC9C", // Bloom primary button
      buttonSecondary: "#52C882", // Fresh bloom secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F8FDF8", // Fresh bloom card
      cardBorder: "#CCFFCC", // Bright bloom border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#0E6655", // Deep teal text
      textSecondary: "#138D75", // Spring bloom text
      textMuted: "#58D68D", // Light bloom muted
      textLink: "#1ABC9C", // Turquoise bloom link
    },
    night: {
      gradient: ["#F0FFF0", "#E6FFE6", "#D4EDDA"] as const, // Gentle spring night
      particleDot: "#98FB98", // Pale green
      particleSparkle: "#AFEEEE", // Pale turquoise
      accent: "#76D7C4", // Soft evening bloom
      background: "#F7FCF9", // Evening bloom background
      surface: "#D1F2EB", // Spring night surface
      highlight: "#48C9B0", // Gentle night highlight
      // Button colors
      buttonPrimary: "#48C9B0", // Evening bloom button
      buttonSecondary: "#76D7C4", // Soft night secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F7FCF9", // Evening bloom card
      cardBorder: "#D4EDDA", // Gentle bloom border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#0B5345", // Deep evening text
      textSecondary: "#17A2B8", // Spring night text
      textMuted: "#5DADE2", // Light evening muted
      textLink: "#48C9B0", // Evening bloom link
    },
  },
  // May - Late spring vitality
  4: {
    day: {
      gradient: ["#F0FFF0", "#E0FFE0", "#D0FFD0"] as const, // Vibrant greens
      particleDot: "#66BB6A", // Vibrant green
      particleSparkle: "#81C784", // Light green
      accent: "#4CAF50", // Lush vitality green
      background: "#F1F8E9", // Fresh growth background
      surface: "#DCEDC8", // Vibrant spring surface
      highlight: "#388E3C", // Deep spring highlight
      // Button colors
      buttonPrimary: "#388E3C", // Vitality primary button
      buttonSecondary: "#4CAF50", // Lush secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F1F8E9", // Vitality card background
      cardBorder: "#D0FFD0", // Vibrant border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#1B5E20", // Deep vitality text
      textSecondary: "#2E7D32", // Green vitality text
      textMuted: "#66BB6A", // Light vitality muted
      textLink: "#388E3C", // Vitality link green
    },
    night: {
      gradient: ["#F0FFF0", "#E0FFE0", "#D1F2EB"] as const, // Serene spring night
      particleDot: "#98FB98", // Pale green
      particleSparkle: "#B0FFC7", // Light mint
      accent: "#66BB6A", // Evening vitality
      background: "#E8F5E8", // Serene night background
      surface: "#C8E6C9", // Spring night surface
      highlight: "#43A047", // Gentle vitality highlight
      // Button colors
      buttonPrimary: "#43A047", // Serene vitality button
      buttonSecondary: "#66BB6A", // Evening green secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#E8F5E8", // Serene vitality card
      cardBorder: "#D1F2EB", // Spring night border
      cardShadow: "#99A3A4", // Gentle night shadow
      // Text colors
      textPrimary: "#0D4F3C", // Deep serene text
      textSecondary: "#186A3B", // Vitality night text
      textMuted: "#52C882", // Light serene muted
      textLink: "#43A047", // Serene vitality link
    },
  },
  // June - Early summer warmth
  5: {
    day: {
      gradient: ["#FFFACD", "#FFF8DC", "#F0E68C"] as const, // Warm yellows
      particleDot: "#DAA520", // Golden
      particleSparkle: "#F4C430", // Light gold
      accent: "#FFC107", // Sunshine yellow
      background: "#FFFDE7", // Golden hour background
      surface: "#FFF9C4", // Warm summer surface
      highlight: "#FF8F00", // Bright summer highlight
      // Button colors
      buttonPrimary: "#FF8F00", // Summer sunshine button
      buttonSecondary: "#FFC107", // Golden secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFFDE7", // Sunshine card background
      cardBorder: "#F0E68C", // Golden border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#E65100", // Deep amber text
      textSecondary: "#FF6F00", // Warm summer text
      textMuted: "#FFB300", // Light golden muted
      textLink: "#FF8F00", // Summer sunshine link
    },
    night: {
      gradient: ["#FFFACD", "#FFF8DC", "#F5F5DC"] as const, // Gentle summer night
      particleDot: "#F0E68C", // Khaki
      particleSparkle: "#FFFFE0", // Light yellow
      accent: "#FFD54F", // Moonlit gold
      background: "#FFF8E1", // Gentle evening background
      surface: "#F0F4C3", // Evening warmth surface
      highlight: "#FFB300", // Warm night highlight
      // Button colors
      buttonPrimary: "#FFB300", // Summer evening button
      buttonSecondary: "#FFD54F", // Moonlit secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFF8E1", // Evening warmth card
      cardBorder: "#F5F5DC", // Gentle summer border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#E65100", // Deep evening amber
      textSecondary: "#FF6F00", // Summer evening text
      textMuted: "#FFA726", // Light evening muted
      textLink: "#FFB300", // Summer evening link
    },
  },
  // July - Summer radiance
  6: {
    day: {
      gradient: ["#FFF8DC", "#FFEBCD", "#FFE4B5"] as const, // Bright summer
      particleDot: "#F4A460", // Sandy brown
      particleSparkle: "#FFDAB9", // Peach puff
      accent: "#FF9800", // Radiant orange
      background: "#FFF3E0", // Sunburst background
      surface: "#FFE0B2", // Radiant summer surface
      highlight: "#F57C00", // Intense summer highlight
      // Button colors
      buttonPrimary: "#F57C00", // Radiant primary button
      buttonSecondary: "#FF9800", // Bright orange secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFF3E0", // Radiant card background
      cardBorder: "#FFE4B5", // Bright summer border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#E65100", // Deep radiant text
      textSecondary: "#FF6F00", // Bright summer text
      textMuted: "#FF9800", // Light radiant muted
      textLink: "#F57C00", // Radiant summer link
    },
    night: {
      gradient: ["#FFF8DC", "#FFEBCD", "#F5DEB3"] as const, // Gentle summer night
      particleDot: "#DEB887", // Burlywood
      particleSparkle: "#F0E68C", // Khaki
      accent: "#FFAB40", // Sunset glow
      background: "#FFF8E1", // Summer evening background
      surface: "#FFCC80", // Gentle radiance surface
      highlight: "#FF6F00", // Warm radiance highlight
      // Button colors
      buttonPrimary: "#FF6F00", // Sunset primary button
      buttonSecondary: "#FFAB40", // Warm glow secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFF8E1", // Summer evening card
      cardBorder: "#F5DEB3", // Gentle radiance border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#BF360C", // Deep sunset text
      textSecondary: "#E65100", // Summer radiance text
      textMuted: "#FF8A65", // Light sunset muted
      textLink: "#FF6F00", // Radiant evening link
    },
  },
  // August - Late summer glow
  7: {
    day: {
      gradient: ["#FFEAA7", "#FDCB6E", "#F8D7A1"] as const, // Golden summer
      particleDot: "#DEB887", // Burlywood
      particleSparkle: "#F4A460", // Sandy brown
      accent: "#FFB74D", // Golden glow
      background: "#FFF8E1", // Late summer background
      surface: "#FFCC80", // Golden glow surface
      highlight: "#FF9800", // Intense glow highlight
      // Button colors
      buttonPrimary: "#FF9800", // Golden glow button
      buttonSecondary: "#FFB74D", // Late summer secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFF8E1", // Golden glow card
      cardBorder: "#F8D7A1", // Golden border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#E65100", // Deep golden text
      textSecondary: "#FF6F00", // Late summer text
      textMuted: "#FFB74D", // Light golden muted
      textLink: "#FF9800", // Golden glow link
    },
    night: {
      gradient: ["#FFF8DC", "#F5DEB3", "#F0E68C"] as const, // Soft summer night
      particleDot: "#D2B48C", // Tan
      particleSparkle: "#F4A460", // Sandy brown
      accent: "#FFAB91", // Evening summer glow
      background: "#FFF3E0", // Soft glow background
      surface: "#FFCC80", // Evening glow surface
      highlight: "#FF8A65", // Gentle glow highlight
      // Button colors
      buttonPrimary: "#FF8A65", // Gentle glow button
      buttonSecondary: "#FFAB91", // Soft evening secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FFF3E0", // Evening glow card
      cardBorder: "#F0E68C", // Soft glow border
      cardShadow: "#99A3A4", // Gentle night shadow
      // Text colors
      textPrimary: "#BF360C", // Deep evening text
      textSecondary: "#D84315", // Gentle glow text
      textMuted: "#FF7043", // Light evening muted
      textLink: "#FF8A65", // Gentle evening link
    },
  },
  // September - Early autumn
  8: {
    day: {
      gradient: ["#FFF5EE", "#FFEEDD", "#FFE4B5"] as const, // Autumn warmth
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
      accent: "#D68910", // Autumn gold
      background: "#FEF9E7", // Harvest background
      surface: "#F8C471", // Warm autumn surface
      highlight: "#B7950B", // Rich autumn highlight
      // Button colors
      buttonPrimary: "#B7950B", // Harvest gold button
      buttonSecondary: "#D68910", // Warm autumn secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FEF9E7", // Harvest card background
      cardBorder: "#FFE4B5", // Autumn border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#7D6608", // Deep harvest text
      textSecondary: "#B7950B", // Autumn warmth text
      textMuted: "#D68910", // Light autumn muted
      textLink: "#B7950B", // Harvest link gold
    },
    night: {
      gradient: ["#3B2F2F", "#5D4E37", "#8B4513"] as const, // Autumn night
      particleDot: "#D2691E", // Chocolate
      particleSparkle: "#F4A460", // Sandy brown
      accent: "#DC7633", // Autumn ember
      background: "#2C1810", // Deep autumn night
      surface: "#5D4037", // Rich wood surface
      highlight: "#E67E22", // Warm ember highlight
      // Button colors
      buttonPrimary: "#E67E22", // Ember primary button
      buttonSecondary: "#DC7633", // Warm ember secondary
      buttonDisabled: "#566573", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#2C1810", // Deep night card
      cardBorder: "#8B4513", // Rich wood border
      cardShadow: "#1C1C1C", // Deep night shadow
      // Text colors
      textPrimary: "#F8C471", // Warm ember text
      textSecondary: "#F39C12", // Autumn night text
      textMuted: "#DC7633", // Light ember muted
      textLink: "#E67E22", // Ember night link
    },
  },
  // October - Peak autumn
  9: {
    day: {
      gradient: ["#FFF8DC", "#FFEBCD", "#FFDAB9"] as const, // Rich autumn
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
      accent: "#E67E22", // Pumpkin orange
      background: "#FDEBD0", // Cozy autumn background
      surface: "#F5CBA7", // Peak autumn surface
      highlight: "#CA6F1E", // Vibrant autumn highlight
      // Button colors
      buttonPrimary: "#CA6F1E", // Peak autumn button
      buttonSecondary: "#E67E22", // Pumpkin secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#FDEBD0", // Cozy peak card
      cardBorder: "#FFDAB9", // Rich autumn border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#A04000", // Deep pumpkin text
      textSecondary: "#CA6F1E", // Peak autumn text
      textMuted: "#E67E22", // Light peak muted
      textLink: "#CA6F1E", // Peak autumn link
    },
    night: {
      gradient: ["#F5DEB3", "#DEB887", "#D2B48C"] as const, // Gentle autumn night
      particleDot: "#BC8F8F", // Rosy brown
      particleSparkle: "#F4A460", // Sandy brown
      accent: "#D68910", // Golden autumn night
      background: "#F4E4BC", // Warm autumn evening
      surface: "#E6B073", // Gentle autumn surface
      highlight: "#B7950B", // Soft autumn highlight
      // Button colors
      buttonPrimary: "#B7950B", // Gentle autumn button
      buttonSecondary: "#D68910", // Golden night secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F4E4BC", // Warm evening card
      cardBorder: "#D2B48C", // Gentle border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#7D6608", // Deep gentle text
      textSecondary: "#B7950B", // Autumn evening text
      textMuted: "#D68910", // Light evening muted
      textLink: "#B7950B", // Gentle evening link
    },
  },
  // November - Late autumn
  10: {
    day: {
      gradient: ["#F5DEB3", "#DEB887", "#D2B48C"] as const, // Muted autumn
      particleDot: "#A0522D", // Sienna
      particleSparkle: "#CD853F", // Peru
      accent: "#A04000", // Deep russet
      background: "#F7DC6F", // Late autumn background
      surface: "#D7BF47", // Muted autumn surface
      highlight: "#7D6608", // Deep autumn highlight
      // Button colors
      buttonPrimary: "#7D6608", // Deep russet button
      buttonSecondary: "#A04000", // Late autumn secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F7DC6F", // Late autumn card
      cardBorder: "#D2B48C", // Muted border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#6C4A00", // Deep muted text
      textSecondary: "#7D6608", // Late autumn text
      textMuted: "#A04000", // Light russet muted
      textLink: "#7D6608", // Late autumn link
    },
    night: {
      gradient: ["#F5DEB3", "#D2B48C", "#BC8F8F"] as const, // Warm autumn night
      particleDot: "#CD853F", // Peru
      particleSparkle: "#DEB887", // Burlywood
      accent: "#B7950B", // Warm late autumn
      background: "#F1C40F", // Golden autumn night
      surface: "#D4AC0D", // Rich autumn surface
      highlight: "#B7950B", // Warm autumn highlight
      // Button colors
      buttonPrimary: "#B7950B", // Warm autumn button
      buttonSecondary: "#D68910", // Golden night secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F1C40F", // Golden night card
      cardBorder: "#BC8F8F", // Warm night border
      cardShadow: "#99A3A4", // Gentle night shadow
      // Text colors
      textPrimary: "#7D6608", // Deep golden text
      textSecondary: "#B7950B", // Warm night text
      textMuted: "#D68910", // Light golden muted
      textLink: "#B7950B", // Warm night link
    },
  },
  // December - Winter celebration
  11: {
    day: {
      gradient: ["#F0F8FF", "#E0E6FF", "#D0D0FF"] as const, // Cool winter
      particleDot: "#4682B4", // Steel blue
      particleSparkle: "#6495ED", // Cornflower blue
      accent: "#2980B9", // Festive winter blue
      background: "#F8F9FA", // Snow white background
      surface: "#AED6F1", // Festive winter surface
      highlight: "#1B4F72", // Deep winter highlight
      // Button colors
      buttonPrimary: "#1B4F72", // Festive primary button
      buttonSecondary: "#2980B9", // Winter celebration secondary
      buttonDisabled: "#D5DBDB", // Muted disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#F8F9FA", // Festive card background
      cardBorder: "#D0D0FF", // Cool winter border
      cardShadow: "#BDC3C7", // Gentle shadow
      // Text colors
      textPrimary: "#0B2161", // Deep festive text
      textSecondary: "#1B4F72", // Winter celebration text
      textMuted: "#2980B9", // Light festive muted
      textLink: "#1B4F72", // Festive winter link
    },
    night: {
      gradient: ["#E6F3FF", "#D0E7FF", "#B8DDFF"] as const, // Gentle winter night
      particleDot: "#87CEEB", // Sky blue
      particleSparkle: "#B0E0E6", // Powder blue
      accent: "#5DADE2", // Winter celebration blue
      background: "#EBF5FB", // Snowy night background
      surface: "#85C1E9", // Celebration surface
      highlight: "#2E86C1", // Festive night highlight
      // Button colors
      buttonPrimary: "#2E86C1", // Festive night button
      buttonSecondary: "#5DADE2", // Winter night secondary
      buttonDisabled: "#AEB6BF", // Muted night disabled
      buttonText: "#FFFFFF", // Clean white text
      // Card colors
      cardBackground: "#EBF5FB", // Snowy night card
      cardBorder: "#B8DDFF", // Gentle celebration border
      cardShadow: "#99A3A4", // Soft night shadow
      // Text colors
      textPrimary: "#0B2161", // Deep celebration text
      textSecondary: "#1B4F72", // Winter night text
      textMuted: "#2980B9", // Light celebration muted
      textLink: "#2E86C1", // Festive night link
    },
  },
};

export const defaultTheme: SeasonalTheme = {
  day: {
    gradient: ["#FFF8E1", "#FFF3E0", "#FFECB3"] as const,
    particleDot: "#FFB74D",
    particleSparkle: "#FFCC80",
    accent: "#FF9800", // Warm default accent
    background: "#FFFDE7", // Neutral warm background
    surface: "#FFF9C4", // Soft default surface
    highlight: "#F57C00", // Bright default highlight
    // Button colors
    buttonPrimary: "#F57C00", // Default primary button
    buttonSecondary: "#FF9800", // Warm secondary
    buttonDisabled: "#D5DBDB", // Muted disabled
    buttonText: "#FFFFFF", // Clean white text
    // Card colors
    cardBackground: "#FFFDE7", // Default card background
    cardBorder: "#FFECB3", // Neutral border
    cardShadow: "#BDC3C7", // Gentle shadow
    // Text colors
    textPrimary: "#E65100", // Deep default text
    textSecondary: "#FF6F00", // Warm default text
    textMuted: "#FFB74D", // Light default muted
    textLink: "#F57C00", // Default link orange
  },
  night: {
    gradient: ["#E3F2FD", "#E8EAF6", "#F3E5F5"] as const,
    particleDot: "#7986CB",
    particleSparkle: "#9FA8DA",
    accent: "#5C6BC0", // Cool night accent
    background: "#F3E5F5", // Gentle night background
    surface: "#C5CAE9", // Soft night surface
    highlight: "#3F51B5", // Deep night highlight
    // Button colors
    buttonPrimary: "#3F51B5", // Default night button
    buttonSecondary: "#5C6BC0", // Cool night secondary
    buttonDisabled: "#AEB6BF", // Muted night disabled
    buttonText: "#FFFFFF", // Clean white text
    // Card colors
    cardBackground: "#F3E5F5", // Default night card
    cardBorder: "#E8EAF6", // Gentle night border
    cardShadow: "#99A3A4", // Soft night shadow
    // Text colors
    textPrimary: "#1A237E", // Deep night text
    textSecondary: "#283593", // Default night text
    textMuted: "#5C6BC0", // Light night muted
    textLink: "#3F51B5", // Default night link
  },
};
