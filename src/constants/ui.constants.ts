// UI Constants for Typewriter Studio
// Use these constants to maintain design consistency across the app

export const COLORS = {
  // Primary palette
  paper: '#f4f1e8',
  darkGradientStart: '#2a2a2a',
  darkGradientEnd: '#1a1a1a',
  textDark: '#1a1a1a',
  textLight: '#f4f1e8',
  
  // Borders and overlays
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderMedium: 'rgba(255, 255, 255, 0.2)',
  borderDark: 'rgba(139, 119, 101, 0.2)',
  borderDarkHover: 'rgba(139, 119, 101, 0.4)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
  
  // Interactive states
  hoverLight: 'rgba(255, 255, 255, 0.1)',
  hoverDark: 'rgba(255, 255, 255, 0.05)',
  focusShadow: 'rgba(139, 119, 101, 0.1)',
  
  // Semantic colors
  error: 'rgba(239, 68, 68, 0.9)',
  success: 'rgba(34, 197, 94, 0.9)',
  warning: 'rgba(251, 191, 36, 0.9)',
};

export const TYPOGRAPHY = {
  fontFamily: "'Courier Prime', monospace",
  fontSize: {
    small: '12px',
    body: '14px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const SPACING = {
  xs: '5px',
  sm: '10px',
  md: '15px',
  lg: '20px',
  xl: '30px',
  xxl: '40px',
};

export const ANIMATION = {
  // Durations
  duration: {
    fast: '0.2s',
    normal: '0.3s',
    slow: '0.5s',
  },
  // Easings
  easing: {
    standard: 'ease',
    smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  // Standard animations
  hover: {
    scale: 1.05,
    translateY: '-1px',
    rotation: '90deg',
  },
};

export const BORDERS = {
  radius: {
    small: '4px',
    medium: '6px',
    large: '8px',
    round: '50%',
  },
  width: '1px',
  style: 'solid',
};

export const SHADOWS = {
  small: '0 2px 4px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.3)',
  large: '0 20px 60px rgba(0, 0, 0, 0.3)',
  inset: 'inset 0 0 30px rgba(139, 119, 101, 0.1)',
};

export const Z_INDEX = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 998,
  modal: 999,
  tooltip: 1000,
  notification: 1100,
};

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

// Component-specific styles
export const CLOSE_BUTTON_STYLES = {
  position: 'absolute' as const,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  padding: SPACING.xs,
  borderRadius: BORDERS.radius.small,
  transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.standard}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const MODAL_STYLES = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: COLORS.overlayDark,
    zIndex: Z_INDEX.overlay,
    animation: `fadeIn ${ANIMATION.duration.normal} ${ANIMATION.easing.standard}`,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  content: {
    background: COLORS.paper,
    borderRadius: BORDERS.radius.large,
    padding: SPACING.xxl,
    boxShadow: SHADOWS.large,
    position: 'relative' as const,
  },
};

export const BUTTON_STYLES = {
  base: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.fontSize.body,
    borderRadius: BORDERS.radius.medium,
    cursor: 'pointer',
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.standard}`,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  sizes: {
    small: {
      padding: `${SPACING.sm} ${SPACING.md}`,
      fontSize: TYPOGRAPHY.fontSize.small,
    },
    medium: {
      padding: `${SPACING.md} ${SPACING.lg}`,
      fontSize: TYPOGRAPHY.fontSize.body,
    },
    large: {
      padding: `${SPACING.lg} ${SPACING.xl}`,
      fontSize: TYPOGRAPHY.fontSize.medium,
    },
  },
};

// Toast notification settings
export const TOAST_CONFIG = {
  position: 'top-right' as const,
  duration: 3000,
  style: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.fontSize.body,
  },
};

// Icon sizes
export const ICON_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 32,
};