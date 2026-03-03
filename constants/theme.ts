import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export type SerifFontFamily = Readonly<{
  regular: string;
  italic: string;
  medium: string;
  bold: string;
}>;

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Serif font families loaded via @expo-google-fonts.
 * Maps each reader font ID to its loaded family names.
 */
export const SerifFonts = {
  lora: {
    regular: 'Lora_400Regular',
    italic: 'Lora_400Regular_Italic',
    medium: 'Lora_500Medium',
    bold: 'Lora_700Bold',
  },
  playfair: {
    regular: 'PlayfairDisplay_400Regular',
    italic: 'PlayfairDisplay_400Regular_Italic',
    medium: 'PlayfairDisplay_500Medium',
    bold: 'PlayfairDisplay_500Medium',
  },
  garamond: {
    regular: 'EBGaramond_400Regular',
    italic: 'EBGaramond_400Regular_Italic',
    medium: 'EBGaramond_500Medium',
    bold: 'EBGaramond_500Medium',
  },
  spectral: {
    regular: 'Spectral_400Regular',
    italic: 'Spectral_400Regular_Italic',
    medium: 'Spectral_500Medium',
    bold: 'Spectral_500Medium',
  },
} as const;

/** Primary serif font used throughout the app UI (titles, book names, etc.) */
export const AppSerifFont: SerifFontFamily =
  Platform.select<SerifFontFamily>({
    ios: {
      regular: 'Georgia',
      italic: 'Georgia-Italic',
      // Georgia doesn't ship a "Medium" face; use Regular for "Medium" slots in the UI.
      medium: 'Georgia',
      bold: 'Georgia-Bold',
    },
    // Android doesn't include Georgia; fall back to the bundled serif (Lora) until a licensed Georgia is added.
    default: SerifFonts.lora,
    web: SerifFonts.lora,
  }) ?? SerifFonts.lora;
