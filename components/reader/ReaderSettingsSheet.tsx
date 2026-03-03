import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { READER_FONTS } from '@/features/reader/ui-mock';
import type { AppTokens, ReaderPreferences } from '@/features/reader/ui-mock';

import { BottomSheet } from './BottomSheet';

type ReaderSettingsSheetProps = {
  visible: boolean;
  tokens: AppTokens;
  preferences: ReaderPreferences;
  onClose: () => void;
  onSetTheme: (theme: ReaderPreferences['theme']) => void;
  onSetMode: (mode: ReaderPreferences['mode']) => void;
  onSetFontId: (fontId: ReaderPreferences['fontId']) => void;
  onSetFontSize: (fontSize: number) => void;
  onSetSlowRead: (value: boolean) => void;
  onSetWpm: (value: number) => void;
  onSetHapticEnabled: (value: boolean) => void;
  onSetAutoNightEnabled: (value: boolean) => void;
};

const WPM_OPTIONS = [120, 220, 380];

export function ReaderSettingsSheet({
  visible,
  tokens,
  preferences,
  onClose,
  onSetTheme,
  onSetMode,
  onSetFontId,
  onSetFontSize,
  onSetSlowRead,
  onSetWpm,
  onSetHapticEnabled,
  onSetAutoNightEnabled,
}: ReaderSettingsSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} dragCloseOffset={80} dragCloseVelocity={500}>
      <View style={[styles.root, { backgroundColor: tokens.surfaceRaised }]}>
        <View style={[styles.pill, { backgroundColor: tokens.divider }]} />

        <SectionLabel label="Mode" color={tokens.textMuted} />
        <View style={styles.row}>
          <Chip
            active={preferences.mode === 'vertical'}
            label="Scroll"
            tokens={tokens}
            onPress={() => onSetMode('vertical')}
          />
          <Chip
            active={preferences.mode === 'horizontal'}
            label="Cards"
            tokens={tokens}
            onPress={() => onSetMode('horizontal')}
          />
        </View>

        <SectionLabel label="Theme" color={tokens.textMuted} />
        <View style={styles.row}>
          {(['light', 'sepia', 'dark', 'immersive'] as const).map((themeOption) => (
            <Chip
              key={themeOption}
              active={preferences.theme === themeOption}
              label={themeOption}
              tokens={tokens}
              onPress={() => onSetTheme(themeOption)}
            />
          ))}
        </View>

        <SectionLabel label="Typeface" color={tokens.textMuted} />
        <View style={styles.row}>
          {READER_FONTS.map((font) => (
            <Chip
              key={font.id}
              active={preferences.fontId === font.id}
              label={font.name}
              tokens={tokens}
              onPress={() => onSetFontId(font.id)}
            />
          ))}
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: tokens.text }]}>Font size</Text>
          <View style={styles.inlineControls}>
            <CircleButton tokens={tokens} text="A-" onPress={() => onSetFontSize(Math.max(16, preferences.fontSize - 2))} />
            <Text style={[styles.valueText, { color: tokens.textMuted }]}>{preferences.fontSize}px</Text>
            <CircleButton tokens={tokens} text="A+" onPress={() => onSetFontSize(Math.min(32, preferences.fontSize + 2))} />
          </View>
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: tokens.text }]}>Slow read</Text>
          <Switch
            value={preferences.slowRead}
            onValueChange={onSetSlowRead}
            trackColor={{ false: tokens.toggleOff, true: tokens.toggleOn }}
          />
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: tokens.text }]}>WPM</Text>
          <View style={styles.inlineControls}>
            {WPM_OPTIONS.map((wpmOption) => (
              <Chip
                key={wpmOption}
                active={preferences.wpm === wpmOption}
                label={`${wpmOption}`}
                tokens={tokens}
                onPress={() => onSetWpm(wpmOption)}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: tokens.text }]}>Haptics</Text>
          <Switch
            value={preferences.hapticEnabled}
            onValueChange={onSetHapticEnabled}
            trackColor={{ false: tokens.toggleOff, true: tokens.toggleOn }}
          />
        </View>

        <View style={styles.controlRow}>
          <Text style={[styles.controlLabel, { color: tokens.text }]}>Auto night mode</Text>
          <Switch
            value={preferences.autoNightEnabled}
            onValueChange={onSetAutoNightEnabled}
            trackColor={{ false: tokens.toggleOff, true: tokens.toggleOn }}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <Text style={[styles.sectionLabel, { color }]}>{label}</Text>
  );
}

function Chip({
  active,
  label,
  tokens,
  onPress,
}: {
  active: boolean;
  label: string;
  tokens: AppTokens;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? tokens.chipActive : tokens.chipInactive,
        },
      ]}
    >
      <Text
        style={[
          styles.chipText,
          { color: active ? tokens.chipActiveText : tokens.chipInactiveText },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function CircleButton({ tokens, text, onPress }: { tokens: AppTokens; text: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.circleButton, { borderColor: tokens.border }]}>
      <Text style={[styles.circleButtonText, { color: tokens.text }]}>{text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  pill: {
    width: 40,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 12,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  inlineControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
