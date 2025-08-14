import { StyleSheet } from 'react-native';

// Couleurs inspirées de Tailwind CSS
export const colors = {
  // Couleurs principales
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  white: '#ffffff',
  black: '#000000',
};

// Espacements inspirés de Tailwind CSS
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

// Tailles de police
export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Poids de police
export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Rayons de bordure
export const borderRadius = {
  none: 0,
  sm: 2,
  base: 4,
  md: 6,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 24,
  full: 9999,
};

// Ombres
export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  base: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
};

// Styles utilitaires communs
export const commonStyles = StyleSheet.create({
  // Layout
  flex: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  flexCol: { flexDirection: 'column' },
  itemsCenter: { alignItems: 'center' },
  itemsStart: { alignItems: 'flex-start' },
  itemsEnd: { alignItems: 'flex-end' },
  justifyCenter: { justifyContent: 'center' },
  justifyBetween: { justifyContent: 'space-between' },
  justifyAround: { justifyContent: 'space-around' },
  justifyEvenly: { justifyContent: 'space-evenly' },
  justifyStart: { justifyContent: 'flex-start' },
  justifyEnd: { justifyContent: 'flex-end' },
  
  // Padding
  p0: { padding: spacing[0] },
  p1: { padding: spacing[1] },
  p2: { padding: spacing[2] },
  p3: { padding: spacing[3] },
  p4: { padding: spacing[4] },
  p5: { padding: spacing[5] },
  p6: { padding: spacing[6] },
  p8: { padding: spacing[8] },
  
  px0: { paddingHorizontal: spacing[0] },
  px1: { paddingHorizontal: spacing[1] },
  px2: { paddingHorizontal: spacing[2] },
  px3: { paddingHorizontal: spacing[3] },
  px4: { paddingHorizontal: spacing[4] },
  px5: { paddingHorizontal: spacing[5] },
  px6: { paddingHorizontal: spacing[6] },
  px8: { paddingHorizontal: spacing[8] },
  
  py0: { paddingVertical: spacing[0] },
  py1: { paddingVertical: spacing[1] },
  py2: { paddingVertical: spacing[2] },
  py3: { paddingVertical: spacing[3] },
  py4: { paddingVertical: spacing[4] },
  py5: { paddingVertical: spacing[5] },
  py6: { paddingVertical: spacing[6] },
  py8: { paddingVertical: spacing[8] },
  
  // Margin
  m0: { margin: spacing[0] },
  m1: { margin: spacing[1] },
  m2: { margin: spacing[2] },
  m3: { margin: spacing[3] },
  m4: { margin: spacing[4] },
  m5: { margin: spacing[5] },
  m6: { margin: spacing[6] },
  m8: { margin: spacing[8] },
  
  mx0: { marginHorizontal: spacing[0] },
  mx1: { marginHorizontal: spacing[1] },
  mx2: { marginHorizontal: spacing[2] },
  mx3: { marginHorizontal: spacing[3] },
  mx4: { marginHorizontal: spacing[4] },
  mx5: { marginHorizontal: spacing[5] },
  mx6: { marginHorizontal: spacing[6] },
  mx8: { marginHorizontal: spacing[8] },
  
  my0: { marginVertical: spacing[0] },
  my1: { marginVertical: spacing[1] },
  my2: { marginVertical: spacing[2] },
  my3: { marginVertical: spacing[3] },
  my4: { marginVertical: spacing[4] },
  my5: { marginVertical: spacing[5] },
  my6: { marginVertical: spacing[6] },
  my8: { marginVertical: spacing[8] },
  
  // Text
  textXs: { fontSize: fontSizes.xs },
  textSm: { fontSize: fontSizes.sm },
  textBase: { fontSize: fontSizes.base },
  textLg: { fontSize: fontSizes.lg },
  textXl: { fontSize: fontSizes.xl },
  text2xl: { fontSize: fontSizes['2xl'] },
  text3xl: { fontSize: fontSizes['3xl'] },
  text4xl: { fontSize: fontSizes['4xl'] },
  
  fontNormal: { fontWeight: fontWeights.normal },
  fontMedium: { fontWeight: fontWeights.medium },
  fontSemibold: { fontWeight: fontWeights.semibold },
  fontBold: { fontWeight: fontWeights.bold },
  fontExtrabold: { fontWeight: fontWeights.extrabold },
  
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  // Colors
  textPrimary: { color: colors.primary[600] },
  textSecondary: { color: colors.secondary[600] },
  textSuccess: { color: colors.success[600] },
  textWarning: { color: colors.warning[600] },
  textDanger: { color: colors.danger[600] },
  textGray: { color: colors.gray[600] },
  textWhite: { color: colors.white },
  textBlack: { color: colors.black },
  
  bgPrimary: { backgroundColor: colors.primary[600] },
  bgSecondary: { backgroundColor: colors.secondary[100] },
  bgSuccess: { backgroundColor: colors.success[600] },
  bgWarning: { backgroundColor: colors.warning[600] },
  bgDanger: { backgroundColor: colors.danger[600] },
  bgGray: { backgroundColor: colors.gray[100] },
  bgWhite: { backgroundColor: colors.white },
  bgBlack: { backgroundColor: colors.black },
  
  // Borders
  border: { borderWidth: 1 },
  border0: { borderWidth: 0 },
  border2: { borderWidth: 2 },
  border4: { borderWidth: 4 },
  
  borderPrimary: { borderColor: colors.primary[600] },
  borderSecondary: { borderColor: colors.secondary[300] },
  borderSuccess: { borderColor: colors.success[600] },
  borderWarning: { borderColor: colors.warning[600] },
  borderDanger: { borderColor: colors.danger[600] },
  borderGray: { borderColor: colors.gray[300] },
  
  rounded: { borderRadius: borderRadius.base },
  roundedSm: { borderRadius: borderRadius.sm },
  roundedMd: { borderRadius: borderRadius.md },
  roundedLg: { borderRadius: borderRadius.lg },
  roundedXl: { borderRadius: borderRadius.xl },
  rounded2xl: { borderRadius: borderRadius['2xl'] },
  rounded3xl: { borderRadius: borderRadius['3xl'] },
  roundedFull: { borderRadius: borderRadius.full },
  
  // Shadows
  shadowSm: shadows.sm,
  shadow: shadows.base,
  shadowMd: shadows.md,
  shadowLg: shadows.lg,
  
  // Position
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Z-index
  z0: { zIndex: 0 },
  z10: { zIndex: 10 },
  z20: { zIndex: 20 },
  z30: { zIndex: 30 },
  z40: { zIndex: 40 },
  z50: { zIndex: 50 },
});

// Fonction utilitaire pour combiner les styles
export const combineStyles = (...styles: any[]) => {
  return styles.filter(Boolean);
};