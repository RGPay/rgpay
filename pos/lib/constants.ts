// Theme constants based on frontend design system
export const COLORS = {
  // Primary colors
  primary: '#3070FF',
  primaryLight: '#5A8FFF',
  primaryDark: '#1A54E5',
  
  // Secondary colors
  secondary: '#00E5E0',
  secondaryLight: '#44FFFA',
  secondaryDark: '#00B3B0',
  
  // Status colors
  success: '#00D97E',
  successLight: '#33FFAA',
  successDark: '#00A562',
  
  error: '#f44336',
  errorLight: '#ff6b6b',
  errorDark: '#d32f2f',
  
  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',
  
  info: '#42A5F5',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray scale
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
};

export const THEME = {
  light: {
    colors: {
      // Background colors
      background: COLORS.gray50,
      backgroundPaper: COLORS.white,
      backgroundCard: 'rgba(255, 255, 255, 0.95)',
      
      // Text colors
      textPrimary: '#4A5568',
      textSecondary: COLORS.gray600,
      textDisabled: COLORS.gray400,
      
      // Border and divider colors
      border: 'rgba(0, 0, 0, 0.12)',
      divider: 'rgba(0, 0, 0, 0.08)',
      
      // Primary colors
      primary: COLORS.primary,
      primaryLight: COLORS.primaryLight,
      primaryDark: COLORS.primaryDark,
      onPrimary: COLORS.white,
      
      // Secondary colors
      secondary: COLORS.secondary,
      secondaryLight: COLORS.secondaryLight,
      secondaryDark: COLORS.secondaryDark,
      onSecondary: COLORS.black,
      
      // Status colors
      success: COLORS.success,
      successLight: COLORS.successLight,
      successDark: COLORS.successDark,
      onSuccess: COLORS.white,
      
      error: COLORS.error,
      errorLight: COLORS.errorLight,
      errorDark: COLORS.errorDark,
      onError: COLORS.white,
      
      warning: COLORS.warning,
      warningLight: COLORS.warningLight,
      warningDark: COLORS.warningDark,
      onWarning: COLORS.white,
      
      info: COLORS.info,
      infoLight: COLORS.infoLight,
      infoDark: COLORS.infoDark,
      onInfo: COLORS.white,
      
      // Surface colors
      surface: COLORS.white,
      surfaceVariant: COLORS.gray100,
      onSurface: '#4A5568',
      onSurfaceVariant: COLORS.gray600,
      
      // Interactive states
      hover: 'rgba(0, 0, 0, 0.05)',
      pressed: 'rgba(0, 0, 0, 0.1)',
      focus: 'rgba(48, 112, 255, 0.12)',
      selected: 'rgba(48, 112, 255, 0.15)',
      disabled: 'rgba(0, 0, 0, 0.26)',
      
      // Shadow colors
      shadow: 'rgba(0, 0, 0, 0.15)',
      shadowLight: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
    },
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    elevation: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0 4px 8px rgba(0, 0, 0, 0.12)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.15)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.18)',
      xxl: '0 16px 32px rgba(0, 0, 0, 0.2)',
    },
  },
  dark: {
    colors: {
      // Background colors
      background: '#111827',
      backgroundPaper: '#1F2937',
      backgroundCard: 'rgba(31, 41, 55, 0.9)',
      
      // Text colors
      textPrimary: COLORS.white,
      textSecondary: '#94A3B8',
      textDisabled: '#6B7280',
      
      // Border and divider colors
      border: 'rgba(255, 255, 255, 0.12)',
      divider: 'rgba(255, 255, 255, 0.05)',
      
      // Primary colors
      primary: COLORS.primary,
      primaryLight: COLORS.primaryLight,
      primaryDark: COLORS.primaryDark,
      onPrimary: COLORS.white,
      
      // Secondary colors
      secondary: COLORS.secondary,
      secondaryLight: COLORS.secondaryLight,
      secondaryDark: COLORS.secondaryDark,
      onSecondary: COLORS.black,
      
      // Status colors
      success: COLORS.success,
      successLight: COLORS.successLight,
      successDark: COLORS.successDark,
      onSuccess: COLORS.white,
      
      error: COLORS.error,
      errorLight: COLORS.errorLight,
      errorDark: COLORS.errorDark,
      onError: COLORS.white,
      
      warning: COLORS.warning,
      warningLight: COLORS.warningLight,
      warningDark: COLORS.warningDark,
      onWarning: COLORS.white,
      
      info: COLORS.info,
      infoLight: COLORS.infoLight,
      infoDark: COLORS.infoDark,
      onInfo: COLORS.white,
      
      // Surface colors
      surface: '#1F2937',
      surfaceVariant: '#374151',
      onSurface: COLORS.white,
      onSurfaceVariant: '#94A3B8',
      
      // Interactive states
      hover: 'rgba(255, 255, 255, 0.05)',
      pressed: 'rgba(255, 255, 255, 0.1)',
      focus: 'rgba(48, 112, 255, 0.24)',
      selected: 'rgba(48, 112, 255, 0.26)',
      disabled: 'rgba(255, 255, 255, 0.26)',
      
      // Shadow colors
      shadow: 'rgba(0, 0, 0, 0.3)',
      shadowLight: 'rgba(0, 0, 0, 0.2)',
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      xxxl: 64,
    },
    borderRadius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    elevation: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.2)',
      md: '0 4px 8px rgba(0, 0, 0, 0.25)',
      lg: '0 8px 16px rgba(0, 0, 0, 0.3)',
      xl: '0 12px 24px rgba(0, 0, 0, 0.35)',
      xxl: '0 16px 32px rgba(0, 0, 0, 0.4)',
    },
  },
};

// Legacy NAV_THEME for compatibility
export const NAV_THEME = {
  light: {
    background: THEME.light.colors.background,
    border: THEME.light.colors.border,
    card: THEME.light.colors.backgroundCard,
    notification: THEME.light.colors.error,
    primary: THEME.light.colors.primary,
    text: THEME.light.colors.textPrimary,
  },
  dark: {
    background: THEME.dark.colors.background,
    border: THEME.dark.colors.border,
    card: THEME.dark.colors.backgroundCard,
    notification: THEME.dark.colors.error,
    primary: THEME.dark.colors.primary,
    text: THEME.dark.colors.textPrimary,
  },
};

// Gradient presets
export const GRADIENTS = {
  primary: `linear-gradient(45deg, ${COLORS.primary} 30%, ${COLORS.primaryLight} 90%)`,
  secondary: `linear-gradient(45deg, ${COLORS.secondary} 30%, ${COLORS.secondaryLight} 90%)`,
  success: `linear-gradient(45deg, ${COLORS.success} 30%, ${COLORS.successLight} 90%)`,
  error: `linear-gradient(45deg, ${COLORS.error} 30%, ${COLORS.errorLight} 90%)`,
  warning: `linear-gradient(45deg, ${COLORS.warning} 30%, ${COLORS.warningLight} 90%)`,
  info: `linear-gradient(45deg, ${COLORS.info} 30%, ${COLORS.infoLight} 90%)`,
  rainbow: `linear-gradient(45deg, ${COLORS.primary} 0%, ${COLORS.secondary} 25%, ${COLORS.success} 50%, ${COLORS.warning} 75%, ${COLORS.error} 100%)`,
};

// Animation durations
export const ANIMATIONS = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// Breakpoints (matching frontend)
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Z-index values
export const Z_INDEX = {
  backdrop: 1000,
  modal: 1100,
  tooltip: 1200,
  toast: 1300,
  overlay: 1400,
};
