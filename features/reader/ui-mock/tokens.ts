import type { AppTheme, ReaderTheme } from './types';

export type AppTokens = {
  bg: string;
  bgHeader: string;
  surface: string;
  surfaceRaised: string;
  text: string;
  textMuted: string;
  textFaint: string;
  border: string;
  divider: string;
  tabBar: string;
  tabBorder: string;
  searchBg: string;
  progressTrack: string;
  progressFill: string;
  stamp: string;
  cta: string;
  ctaText: string;
  badge: string;
  chipActive: string;
  chipActiveText: string;
  chipInactive: string;
  chipInactiveText: string;
  toggleOn: string;
  toggleOff: string;
  sliderFg: string;
  sliderBg: string;
  accentStar: string;
};

export type ReaderThemeTokens = {
  pageBg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  border: string;
  progressTrack: string;
  progressFill: string;
  dropCap: string;
  controlBg: string;
  controlText: string;
};

export const APP_TOKENS: Record<AppTheme, AppTokens> = {
  light: {
    bg: '#FAF9F6',
    bgHeader: 'rgba(250,249,246,0.92)',
    surface: '#FDFCF9',
    surfaceRaised: '#FFFFFF',
    text: '#1c1917',
    textMuted: 'rgba(28,25,23,0.40)',
    textFaint: 'rgba(28,25,23,0.25)',
    border: 'rgba(30,18,8,0.07)',
    divider: 'rgba(30,18,8,0.06)',
    tabBar: 'rgba(255,255,255,0.90)',
    tabBorder: '#e7e5e4',
    searchBg: 'rgba(231,229,228,0.55)',
    progressTrack: '#e7e5e4',
    progressFill: '#292524',
    stamp: '#1E1208',
    cta: '#1E1208',
    ctaText: '#F5E8CE',
    badge: '#44403c',
    chipActive: '#1E1208',
    chipActiveText: '#F5E8CE',
    chipInactive: '#f5f5f4',
    chipInactiveText: '#78716c',
    toggleOn: '#1E1208',
    toggleOff: '#d6d3d1',
    sliderFg: '#1E1208',
    sliderBg: '#e7e5e4',
    accentStar: 'rgba(30,18,8,0.04)',
  },
  dark: {
    bg: '#000000',
    bgHeader: 'rgba(0,0,0,0.97)',
    surface: '#0D0D0D',
    surfaceRaised: '#161616',
    text: '#F2F2F2',
    textMuted: 'rgba(242,242,242,0.40)',
    textFaint: 'rgba(242,242,242,0.20)',
    border: 'rgba(255,255,255,0.08)',
    divider: 'rgba(255,255,255,0.06)',
    tabBar: 'rgba(0,0,0,0.98)',
    tabBorder: 'rgba(255,255,255,0.08)',
    searchBg: 'rgba(255,255,255,0.07)',
    progressTrack: 'rgba(255,255,255,0.10)',
    progressFill: '#F2F2F2',
    stamp: '#F2F2F2',
    cta: '#F2F2F2',
    ctaText: '#000000',
    badge: '#F2F2F2',
    chipActive: '#F2F2F2',
    chipActiveText: '#000000',
    chipInactive: 'rgba(255,255,255,0.07)',
    chipInactiveText: 'rgba(255,255,255,0.38)',
    toggleOn: '#F2F2F2',
    toggleOff: 'rgba(255,255,255,0.14)',
    sliderFg: '#F2F2F2',
    sliderBg: 'rgba(255,255,255,0.10)',
    accentStar: 'rgba(255,255,255,0.03)',
  },
};

export const READER_TOKENS: Record<ReaderTheme, ReaderThemeTokens> = {
  light: {
    pageBg: '#FAF9F6',
    cardBg: '#FFFFFF',
    text: '#1E1208',
    textMuted: 'rgba(30,18,8,0.40)',
    border: 'rgba(30,18,8,0.08)',
    progressTrack: '#e7e5e4',
    progressFill: '#292524',
    dropCap: '#1a1a1a',
    controlBg: 'rgba(255,255,255,0.62)',
    controlText: '#1E1208',
  },
  sepia: {
    pageBg: '#F4ECD8',
    cardBg: '#F4ECD8',
    text: '#433422',
    textMuted: 'rgba(67,52,34,0.50)',
    border: 'rgba(30,18,8,0.10)',
    progressTrack: 'rgba(30,18,8,0.15)',
    progressFill: '#1E1208',
    dropCap: '#6b4c2a',
    controlBg: 'rgba(255,255,255,0.48)',
    controlText: '#1E1208',
  },
  dark: {
    pageBg: '#000000',
    cardBg: '#0D0D0D',
    text: '#E8E8E8',
    textMuted: 'rgba(242,242,242,0.45)',
    border: 'rgba(255,255,255,0.09)',
    progressTrack: 'rgba(255,255,255,0.12)',
    progressFill: '#F2F2F2',
    dropCap: '#a1a1aa',
    controlBg: 'rgba(0,0,0,0.50)',
    controlText: '#F2F2F2',
  },
  immersive: {
    pageBg: '#000000',
    cardBg: 'rgba(0,0,0,0.72)',
    text: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.55)',
    border: 'rgba(255,255,255,0.10)',
    progressTrack: 'rgba(255,255,255,0.18)',
    progressFill: 'rgba(255,255,255,0.75)',
    dropCap: 'rgba(255,255,255,0.85)',
    controlBg: 'rgba(0,0,0,0.45)',
    controlText: '#FFFFFF',
  },
};

