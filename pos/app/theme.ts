import { createTheme } from '@shopify/restyle';

const palette = {
  // Primary colors (based on frontend theme)
  primary: '#3070FF',
  primaryLight: '#5A8FFF',
  primaryDark: '#1E40AF',
  
  // Secondary colors
  secondary: '#00E5E0',
  secondaryLight: '#4ADEDB',
  secondaryDark: '#0891B2',
  
  // Success, error, warning
  success: '#00D97E',
  error: '#F44336',
  warning: '#FF9800',
  
  // Neutral colors
  black: '#0B0B0B',
  white: '#F0F2F3',
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
  
  // Background colors
  backgroundLight: '#FAFAFA',
  backgroundDark: '#111827',
  paperLight: '#FFFFFF',
  paperDark: '#1F2937',
};

const theme = createTheme({
  colors: {
    // Main backgrounds
    mainBackground: palette.backgroundLight,
    mainBackgroundDark: palette.backgroundDark,
    cardPrimaryBackground: palette.primary,
    cardSecondaryBackground: palette.secondary,
    
    // Paper/surface colors
    surface: palette.paperLight,
    surfaceDark: palette.paperDark,
    
    // Text colors
    textPrimary: palette.gray900,
    textSecondary: palette.gray600,
    textPrimaryDark: palette.white,
    textSecondaryDark: palette.gray300,
    
    // Brand colors
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,
    secondary: palette.secondary,
    secondaryLight: palette.secondaryLight,
    secondaryDark: palette.secondaryDark,
    
    // Status colors
    success: palette.success,
    error: palette.error,
    warning: palette.warning,
    
    // Border colors
    border: palette.gray300,
    borderDark: palette.gray600,
    
    // Neutral shades
    white: palette.white,
    black: palette.black,
    transparent: 'transparent',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    xxl: 24,
    round: 50,
  },
  textVariants: {
    header: {
      fontWeight: 'bold',
      fontSize: 32,
      lineHeight: 40,
      color: 'textPrimary',
    },
    title: {
      fontWeight: '600',
      fontSize: 24,
      lineHeight: 32,
      color: 'textPrimary',
    },
    subtitle: {
      fontWeight: '600',
      fontSize: 18,
      lineHeight: 24,
      color: 'textPrimary',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: 'textPrimary',
    },
    bodySecondary: {
      fontSize: 16,
      lineHeight: 24,
      color: 'textSecondary',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      color: 'textSecondary',
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24,
      color: 'white',
    },
    defaults: {
      fontSize: 16,
      lineHeight: 24,
      color: 'textPrimary',
    },
  },
  cardVariants: {
    defaults: {
      backgroundColor: 'surface',
      borderRadius: 'm',
      padding: 'm',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    elevated: {
      backgroundColor: 'surface',
      borderRadius: 'l',
      padding: 'l',
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  buttonVariants: {
    defaults: {
      backgroundColor: 'primary',
      borderRadius: 'm',
      paddingVertical: 'm',
      paddingHorizontal: 'l',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: 'primary',
    },
    secondary: {
      backgroundColor: 'secondary',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'primary',
    },
  },
});

export type Theme = typeof theme;
export default theme;
