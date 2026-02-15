/**
 * @file lib/design/theme.ts
 * @description Material Design 3 theme system with full color palette
 * Enhanced design system for Merath calculator app
 */

import { useColorScheme } from 'react-native';
import { createContext, useContext } from 'react';

// ============================================================================
// COLOR PALETTE - Material Design 3
// ============================================================================

export const Colors = {
  // Primary - Islamic Blue
  primary: '#1F71BA',
  primaryLight: '#42A5F5',
  primaryDark: '#1565C0',
  
  // Secondary - Professional Slate
  secondary: '#546E7A',
  secondaryLight: '#78909C',
  secondaryDark: '#37474F',
  
  // Accent - Gold (Islamic aesthetic)
  accent: '#D4AF37',
  accentLight: '#FFD54F',
  accentDark: '#FBC02D',
  
  // Neutral Colors
  background: {
    light: '#FAFAFA',
    dark: '#121212',
  },
  surface: {
    light: '#FFFFFF',
    dark: '#1E1E1E',
  },
  
  // Text Colors
  text: {
    primary_light: '#1C1C1C',
    primary_dark: '#FFFFFF',
    secondary_light: '#686868',
    secondary_dark: '#BDBDBD',
    tertiary_light: '#9E9E9E',
    tertiary_dark: '#9E9E9E',
  },
  
  // Status Colors
  status: {
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  
  // Semantic
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme = {
  colors: Colors,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 999,
  },
  
  typography: {
    headline: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 34,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      lineHeight: 28,
    },
    subtitle: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
    },
    body: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Background & Surface colors
  background: Colors.background.light,
  surface: Colors.surface.light,
  primaryText: Colors.text.primary_light,
  secondaryText: Colors.text.secondary_light,
  tertiaryText: Colors.text.tertiary_light,
};

// ============================================================================
// DARK THEME
// ============================================================================

export const darkTheme = {
  ...lightTheme,
  
  // Override colors for dark mode
  colors: {
    ...Colors,
    background: Colors.background.dark,
    surface: Colors.surface.dark,
  },
  
  background: Colors.background.dark,
  surface: Colors.surface.dark,
  primaryText: Colors.text.primary_dark,
  secondaryText: Colors.text.secondary_dark,
  tertiaryText: Colors.text.tertiary_dark,
};

// ============================================================================
// THEME HOOK
// ============================================================================

export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;
  
  return {
    theme,
    isDark,
    colors: theme.colors,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    typography: theme.typography,
    shadows: theme.shadows,
  };
}

// ============================================================================
// PREDEFINED STYLES
// ============================================================================

export const commonStyles = {
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  input: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  
  card: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  
  section: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
};
