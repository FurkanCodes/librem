import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppSerifFont } from '@/constants/theme';
import { useReaderUIState } from '@/features/reader/ui-mock';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabSearchHeader } from '@/components/ui/tab-search-header';

export default function ProfileScreen() {
  const {
    state,
    appTokens,
    setAppTheme,
    setWpm,
    setAutoNightEnabled,
    setHapticEnabled,
  } = useReaderUIState();
  const [showSettings, setShowSettings] = useState(false);
  const [query, setQuery] = useState('');
  const [speedTrackWidth, setSpeedTrackWidth] = useState(0);
  const insets = useSafeAreaInsets();

  if (showSettings) {
    const WPM_MIN = 120;
    const WPM_MAX = 380;
    const speedPresets = [
      { label: 'DELIBERATE', value: 120 },
      { label: 'FLOWING', value: 220 },
      { label: 'RAPID', value: 380 },
    ] as const;
    const activePresetValue =
      state.preferences.wpm <= 180 ? 120 : state.preferences.wpm <= 300 ? 220 : 380;
    const speedRatio = Math.max(
      0,
      Math.min(1, (state.preferences.wpm - WPM_MIN) / (WPM_MAX - WPM_MIN))
    );

    const updateWpmFromTrackX = (x: number) => {
      if (speedTrackWidth <= 0) return;
      const ratio = Math.max(0, Math.min(1, x / speedTrackWidth));
      const nextWpm = Math.round(WPM_MIN + ratio * (WPM_MAX - WPM_MIN));
      setWpm(nextWpm);
    };

    return (
      <SafeAreaView
        style={[styles.root, { backgroundColor: appTokens.bg }]}
        edges={['top']}
      >
        <TabSearchHeader
          value={query}
          onChangeText={setQuery}
          backgroundColor={appTokens.bgHeader}
          borderBottomColor={appTokens.divider}
          searchBackgroundColor={appTokens.searchBg}
          inputColor={appTokens.text}
          iconColor={appTokens.textMuted}
        />

        <ScrollView
          style={styles.settingsScroll}
          contentContainerStyle={[styles.settingsBody, { paddingBottom: Math.max(16, insets.bottom + 8) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.settingsTopBar, { borderBottomColor: appTokens.divider }]}>
            <Pressable onPress={() => setShowSettings(false)} style={styles.settingsBackIconWrap}>
              <IconSymbol name="chevron.left" size={22} color={appTokens.text} />
            </Pressable>
            <Text style={[styles.settingsTitle, { color: appTokens.text, fontFamily: AppSerifFont.regular }]}>
              Settings
            </Text>
          </View>

          <SectionLabel label="Appearance" color={appTokens.textFaint} />
          <View style={[styles.settingsCard, { backgroundColor: appTokens.surface, borderColor: appTokens.border }]}>
            <View style={styles.settingItemRow}>
              <IconSymbol name="sun" size={17} color={appTokens.textMuted} />
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingItemTitle, { color: appTokens.text }]}>Dark Mode</Text>
                <Text style={[styles.settingItemBody, { color: appTokens.textMuted }]}>Classic parchment</Text>
              </View>
              <TogglePill
                active={state.appTheme === 'dark'}
                onPress={() => setAppTheme(state.appTheme === 'dark' ? 'light' : 'dark')}
                inactiveTrack={appTokens.toggleOff}
                activeTrack={appTokens.cta}
                showSunOnKnob={!state.appTheme || state.appTheme === 'light'}
              />
            </View>

            <View style={[styles.settingsDivider, { backgroundColor: appTokens.divider }]} />

            <View style={styles.settingItemRow}>
              <IconSymbol name="moon" size={17} color={appTokens.textMuted} />
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingItemTitle, { color: appTokens.text }]}>Auto Night Mode</Text>
                <Text style={[styles.settingItemBody, { color: appTokens.textMuted }]}>
                  Switch to Dark theme after sunset
                </Text>
              </View>
              <TogglePill
                active={state.preferences.autoNightEnabled}
                onPress={() => setAutoNightEnabled(!state.preferences.autoNightEnabled)}
                inactiveTrack={appTokens.toggleOff}
                activeTrack={appTokens.cta}
              />
            </View>
          </View>

          <SectionLabel label="Reading" color={appTokens.textFaint} />
          <View style={[styles.settingsCardReading, { backgroundColor: appTokens.surface, borderColor: appTokens.border }]}>
            <View style={styles.readingTopRow}>
              <IconSymbol name="feather" size={17} color={appTokens.textMuted} />
              <View style={styles.readingTextGroup}>
                <Text style={[styles.settingItemTitle, { color: appTokens.text }]}>Slow Read Speed</Text>
                <Text style={[styles.settingItemBody, { color: appTokens.textMuted }]}>
                  How fast words appear in Slow{'\n'}Read mode
                </Text>
              </View>
              <View style={[styles.wpmBadge, { backgroundColor: 'rgba(30,18,8,0.04)' }]}>
                <Text style={[styles.wpmValue, { color: appTokens.text, fontFamily: AppSerifFont.regular }]}>
                  {state.preferences.wpm}
                </Text>
                <Text style={[styles.wpmUnit, { color: appTokens.textMuted }]}>WPM</Text>
              </View>
            </View>

            <View style={styles.readingPresetRow}>
              {speedPresets.map((preset) => {
                const active = activePresetValue === preset.value;
                return (
                  <Pressable
                    key={preset.value}
                    onPress={() => setWpm(preset.value)}
                    style={[
                      styles.readingPresetChip,
                      { backgroundColor: active ? appTokens.cta : appTokens.chipInactive },
                    ]}
                  >
                    <Text
                      style={[
                        styles.readingPresetText,
                        { color: active ? appTokens.ctaText : appTokens.chipInactiveText },
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.speedBarWrap}>
              <View
                style={[styles.speedBarTrack, { backgroundColor: appTokens.sliderBg }]}
                onLayout={(event) => setSpeedTrackWidth(event.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onMoveShouldSetResponder={() => true}
                onResponderGrant={(event) => updateWpmFromTrackX(event.nativeEvent.locationX)}
                onResponderMove={(event) => updateWpmFromTrackX(event.nativeEvent.locationX)}
              >
                <View
                  style={[
                    styles.speedBarFill,
                    {
                      backgroundColor: appTokens.sliderFg,
                      width: `${speedRatio * 100}%`,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.speedThumb,
                    {
                      backgroundColor: appTokens.sliderFg,
                      left: `${speedRatio * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.speedLabelsRow}>
                <Text style={[styles.speedLabel, { color: appTokens.textFaint }]}>SLOW</Text>
                <Text style={[styles.speedLabel, { color: appTokens.textFaint }]}>FAST</Text>
              </View>
              <Text style={[styles.speedCaption, { color: appTokens.textMuted, fontFamily: AppSerifFont.italic }]}>
                Comfortable reading pace
              </Text>
            </View>
          </View>

          <SectionLabel label="Feedback" color={appTokens.textFaint} />
          <View style={[styles.settingsCardFeedback, { backgroundColor: appTokens.surface, borderColor: appTokens.border }]}>
            <View style={styles.settingItemRow}>
              <IconSymbol name="vibrate" size={17} color={appTokens.textMuted} />
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingItemTitle, { color: appTokens.text }]}>Haptic on Save</Text>
                <Text style={[styles.settingItemBody, { color: appTokens.textMuted }]}>
                  Subtle vibration when collecting a quote
                </Text>
              </View>
              <TogglePill
                active={state.preferences.hapticEnabled}
                onPress={() => setHapticEnabled(!state.preferences.hapticEnabled)}
                inactiveTrack={appTokens.toggleOff}
                activeTrack={appTokens.cta}
              />
            </View>
          </View>

          <SectionLabel label="About" color={appTokens.textFaint} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: appTokens.bg }]} edges={['top']}>
      <TabSearchHeader
        value={query}
        onChangeText={setQuery}
        backgroundColor={appTokens.bgHeader}
        borderBottomColor={appTokens.divider}
        searchBackgroundColor={appTokens.searchBg}
        inputColor={appTokens.text}
        iconColor={appTokens.textMuted}
      />

      <View style={styles.main}>
        <View style={styles.hero}>
          <View style={[styles.crestOuter, { borderColor: 'rgba(30,18,8,0.45)' }]}>
            <View style={[styles.crestInner, { borderColor: 'rgba(30,18,8,0.65)' }]}>
              <IconSymbol name="feather" size={18} color="#5a4b39" />
            </View>
          </View>
          <Text style={[styles.heroTitle, { color: appTokens.text, fontFamily: AppSerifFont.italic }]}>
            A Devoted Reader
          </Text>
          <Text style={[styles.heroMeta, { color: appTokens.textMuted }]}>EST. MARCH 2026</Text>
        </View>

        <View style={styles.decorativeRule}>
          <View style={[styles.ruleLine, { backgroundColor: appTokens.divider }]} />
          <Text style={[styles.ruleDiamond, { color: appTokens.textFaint }]}>◆</Text>
          <View style={[styles.ruleLine, { backgroundColor: appTokens.divider }]} />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            icon="flame"
            value={state.streak.streak}
            label="DAY STREAK"
            color={appTokens.text}
            muted={appTokens.textMuted}
            borderColor={appTokens.border}
            surfaceBg={appTokens.surface}
          />
          <StatCard
            icon="heart"
            value={state.highlights.length}
            label="SAVED QUOTES"
            color={appTokens.text}
            muted={appTokens.textMuted}
            borderColor={appTokens.border}
            surfaceBg={appTokens.surface}
          />
          <StatCard
            icon="book"
            value={state.books.length}
            label="IN LIBRARY"
            color={appTokens.text}
            muted={appTokens.textMuted}
            borderColor={appTokens.border}
            surfaceBg={appTokens.surface}
          />
          <StatCard
            icon="feather"
            value="—"
            label="PASSAGES READ"
            color={appTokens.text}
            muted={appTokens.textMuted}
            borderColor={appTokens.border}
            surfaceBg={appTokens.surface}
          />
        </View>

        <View style={[styles.panel, { backgroundColor: appTokens.surface, borderColor: appTokens.border }]}>
          <Pressable style={styles.panelRow} onPress={() => setShowSettings(true)}>
            <IconSymbol name="radio" size={18} color={appTokens.textMuted} />
            <View style={styles.panelText}>
              <Text style={[styles.panelTitle, { color: appTokens.text }]}>Reading Settings</Text>
              <Text style={[styles.panelSub, { color: appTokens.textMuted }]}>Speed, themes, typography</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={appTokens.textMuted} />
          </Pressable>

          <View style={[styles.panelDivider, { backgroundColor: appTokens.divider }]} />

          <View style={[styles.panelRow, { opacity: 0.38 }]}>
            <IconSymbol name="info.circle" size={18} color={appTokens.textMuted} />
            <View style={styles.panelText}>
              <Text style={[styles.panelTitle, { color: appTokens.text }]}>About Lector</Text>
              <Text style={[styles.panelSub, { color: appTokens.textMuted }]}>v1.0 · Ex Libris</Text>
            </View>
            <IconSymbol name="chevron.right" size={16} color={appTokens.textMuted} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerInner}>
            <View style={[styles.footerLine, { backgroundColor: appTokens.text }]} />
            <Text style={[styles.footerLabel, { color: appTokens.text }]}>Lector</Text>
            <View style={[styles.footerLine, { backgroundColor: appTokens.text }]} />
          </View>
          <Text style={[styles.footerTagline, { color: appTokens.text, fontFamily: AppSerifFont.italic }]}>
            For those who read between the lines.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  muted,
  borderColor,
  surfaceBg,
}: {
  icon: 'flame' | 'heart' | 'book' | 'feather';
  value: string | number;
  label: string;
  color: string;
  muted: string;
  borderColor: string;
  surfaceBg: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor, backgroundColor: surfaceBg }]}>
      <IconSymbol name={icon} size={18} color={muted} />
      <Text style={[styles.statValue, { color, fontFamily: AppSerifFont.regular }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
    </View>
  );
}

function SectionLabel({ label, color }: { label: string; color: string }) {
  return <Text style={[styles.sectionLabel, { color }]}>{label}</Text>;
}

function TogglePill({
  active,
  onPress,
  inactiveTrack,
  activeTrack,
  showSunOnKnob = false,
}: {
  active: boolean;
  onPress: () => void;
  inactiveTrack: string;
  activeTrack: string;
  showSunOnKnob?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.toggleTrack,
        {
          backgroundColor: active ? activeTrack : inactiveTrack,
          alignItems: active ? 'flex-end' : 'flex-start',
        },
      ]}
    >
      <View style={styles.toggleKnob}>
        {showSunOnKnob ? <IconSymbol name="sun" size={7} color="#d2aa5f" /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  crestOuter: {
    width: 120,
    height: 120,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  crestInner: {
    width: 104,
    height: 104,
    borderRadius: 999,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 37 / 2.2,
    lineHeight: 25,
  },
  heroMeta: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.9,
  },
  decorativeRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  ruleLine: {
    flex: 1,
    height: 1,
  },
  ruleDiamond: {
    fontSize: 8,
    letterSpacing: 2.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48.2%',
    borderWidth: 1,
    borderRadius: 16,
    height: 102,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 40 / 1.56,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.06,
  },
  panel: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 22,
  },
  panelRow: {
    height: 70.5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  panelText: {
    flex: 1,
    gap: 2,
  },
  panelTitle: {
    fontSize: 29 / 2.07,
    fontWeight: '500',
    lineHeight: 20,
  },
  panelSub: {
    fontSize: 11,
    lineHeight: 16.5,
  },
  panelDivider: {
    height: 1,
    marginHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    opacity: 0.25,
    gap: 4,
    marginTop: 'auto',
    marginBottom: 6,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLine: {
    width: 32,
    height: 1,
  },
  footerLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 2.6,
    textTransform: 'uppercase',
  },
  footerTagline: {
    fontSize: 9,
    lineHeight: 13.5,
    letterSpacing: 0.17,
  },
  settingsScroll: {
    flex: 1,
  },
  settingsBody: {
    paddingHorizontal: 20,
    paddingTop: 0,
  },
  settingsTopBar: {
    height: 66.6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  settingsBackIconWrap: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
  sectionLabel: {
    marginTop: 6,
    marginBottom: 8,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2.14,
    textTransform: 'uppercase',
  },
  settingsCard: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  settingItemRow: {
    height: 70.5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTextGroup: {
    flex: 1,
    gap: 2,
    paddingRight: 8,
  },
  settingItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  settingItemBody: {
    fontSize: 11,
    lineHeight: 16.5,
  },
  settingsDivider: {
    height: 1,
    marginHorizontal: 20,
  },
  toggleTrack: {
    width: 40,
    height: 22,
    borderRadius: 999,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  settingsCardReading: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    padding: 20,
  },
  readingTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  readingTextGroup: {
    flex: 1,
    gap: 2,
  },
  wpmBadge: {
    width: 50.5,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  wpmValue: {
    fontSize: 28.2 / 1.6,
    lineHeight: 18,
  },
  wpmUnit: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.61,
    textTransform: 'uppercase',
  },
  readingPresetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  readingPresetChip: {
    flex: 1,
    height: 32.5,
    borderRadius: 16.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingPresetText: {
    fontSize: 11,
    lineHeight: 16.5,
    fontWeight: '700',
    letterSpacing: 0.34,
  },
  speedBarWrap: {
    marginTop: 4,
  },
  speedBarTrack: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  speedBarFill: {
    height: '100%',
  },
  speedThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 999,
    marginLeft: -7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  speedLabelsRow: {
    marginTop: 13.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  speedLabel: {
    fontSize: 9,
    lineHeight: 13.5,
    fontWeight: '700',
    letterSpacing: 0.62,
  },
  speedCaption: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 11,
    lineHeight: 16.5,
  },
  settingsCardFeedback: {
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
});
