// Design System Theme based on Job Search Interface Analysis
// This theme can be used with styled-components for consistent design

export const theme = {
  // Color Palette
  colors: {
    // Primary Colors
    primary: {
      blue: '#0066CC',      // Primary blue for buttons and links
      darkBlue: '#003D7A',  // Darker blue for hover states
      lightBlue: '#E6F3FF', // Light blue for backgrounds
    },
    
    // Secondary Colors
    secondary: {
      green: '#00A86B',     // Success/positive actions
      orange: '#FF6B35',    // Warning/urgent items
      purple: '#6B46C1',    // Accent color
      yellow: '#F59E0B',    // Highlights/badges
    },
    
    // Neutral Colors
    neutral: {
      white: '#FFFFFF',
      lightGray: '#F8F9FA',   // Card backgrounds
      gray100: '#F3F4F6',
      gray200: '#E5E7EB',     // Borders
      gray300: '#D1D5DB',
      gray400: '#9CA3AF',     // Secondary text
      gray500: '#6B7280',
      gray600: '#4B5563',     // Primary text
      gray700: '#374151',
      gray800: '#1F2937',
      gray900: '#111827',
      black: '#000000',
    },
    
    // Status Colors
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      urgent: '#DC2626',
    },
    
    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F8F9FA',
      tertiary: '#F3F4F6',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
  },

  // Typography
  typography: {
    fontFamily: {
      primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      secondary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing (padding and margins)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
    '5xl': '3rem',    // 48px
    '6xl': '4rem',    // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Component Styles
  components: {
    // Card Styles
    card: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      hover: {
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transform: 'translateY(-1px)',
      },
    },

    // Button Styles
    button: {
      primary: {
        background: '#0066CC',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        hover: {
          background: '#003D7A',
        },
        active: {
          background: '#002952',
        },
      },
      secondary: {
        background: '#FFFFFF',
        color: '#374151',
        border: '1px solid #D1D5DB',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        hover: {
          background: '#F9FAFB',
          borderColor: '#9CA3AF',
        },
      },
      ghost: {
        background: 'transparent',
        color: '#6B7280',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem',
        fontSize: '0.875rem',
        fontWeight: '400',
        hover: {
          background: '#F3F4F6',
          color: '#374151',
        },
      },
    },

    // Badge/Tag Styles
    badge: {
      primary: {
        background: '#0066CC',
        color: '#FFFFFF',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
      success: {
        background: '#10B981',
        color: '#FFFFFF',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
      warning: {
        background: '#F59E0B',
        color: '#FFFFFF',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
      urgent: {
        background: '#DC2626',
        color: '#FFFFFF',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
      neutral: {
        background: '#F3F4F6',
        color: '#6B7280',
        borderRadius: '0.25rem',
        padding: '0.25rem 0.5rem',
        fontSize: '0.75rem',
        fontWeight: '500',
      },
    },

    // Input Styles
    input: {
      base: {
        background: '#FFFFFF',
        border: '1px solid #D1D5DB',
        borderRadius: '0.375rem',
        padding: '0.5rem 0.75rem',
        fontSize: '0.875rem',
        color: '#374151',
        placeholder: '#9CA3AF',
        focus: {
          borderColor: '#0066CC',
          outline: '2px solid rgba(0, 102, 204, 0.2)',
        },
      },
      search: {
        background: '#FFFFFF',
        border: '1px solid #D1D5DB',
        borderRadius: '0.375rem',
        padding: '0.75rem 1rem',
        fontSize: '0.875rem',
        color: '#374151',
        placeholder: '#9CA3AF',
        icon: '#6B7280',
      },
    },

    // Filter Styles
    filter: {
      background: '#FFFFFF',
      border: '1px solid #D1D5DB',
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      color: '#374151',
      active: {
        background: '#0066CC',
        color: '#FFFFFF',
        borderColor: '#0066CC',
      },
    },

    // Avatar/Logo Styles
    avatar: {
      small: {
        width: '2rem',
        height: '2rem',
        borderRadius: '0.25rem',
      },
      medium: {
        width: '3rem',
        height: '3rem',
        borderRadius: '0.375rem',
      },
      large: {
        width: '4rem',
        height: '4rem',
        borderRadius: '0.5rem',
      },
    },
  },

  // Breakpoints for responsive design
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Z-index values
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    base: '200ms ease-in-out',
    slow: '300ms ease-in-out',
    slower: '500ms ease-in-out',
  },
} as const;

// Type definitions for TypeScript support
export type Theme = typeof theme;

// Helper functions for theme usage
export const getColor = (colorPath: string): string => {
  const paths = colorPath.split('.');
  let result: any = theme.colors;
  
  for (const path of paths) {
    result = result?.[path];
  }
  
  return result || '#000000';
};

export const getSpacing = (size: keyof typeof theme.spacing): string => {
  return theme.spacing[size];
};

export const getFontSize = (size: keyof typeof theme.typography.fontSize): string => {
  return theme.typography.fontSize[size];
};

// Default export
export default theme;
