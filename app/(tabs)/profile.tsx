import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppSerifFont } from '@/constants/theme';
import { useReaderUIState } from '@/features/reader/ui-mock';

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

  const appThemeLabel = useMemo(() => (state.appTheme === 'dark' ? 'Dark' : 'Light'), [state.appTheme]);

  if (showSettings) {
    return (
      <SafeAreaView style={[styles.root, { backgroundColor: appTokens.bg }]} edges={['top']}>
        <View style={styles.settingsHeader}>
          <Pressable
            onPress={() => setShowSettings(false)}
            style={[styles.backBtn, { borderColor: appTokens.border }]}
          >
            <Text style={[styles.backText, { color: appTokens.text }]}>{'‹'}</Text>
          </Pressable>
          <Text
            style={[styles.settingsTitle, { color: appTokens.text, fontFamily: AppSerifFont.medium }]}
          >
            Settings
          </Text>
        </View>

        <View
          style={[
            styles.settingsCard,
            { backgroundColor: appTokens.surface, borderColor: appTokens.border },
          ]}
        >
          <SettingRow label="Dark mode" tokens={appTokens}>
            <Switch
              value={state.appTheme === 'dark'}
              onValueChange={(value) => setAppTheme(value ? 'dark' : 'light')}
              trackColor={{ false: appTokens.toggleOff, true: appTokens.toggleOn }}
            />
          </SettingRow>

          <Divider color={appTokens.divider} />

          <SettingRow label="Auto night mode" tokens={appTokens}>
            <Switch
              value={state.preferences.autoNightEnabled}
              onValueChange={setAutoNightEnabled}
              trackColor={{ false: appTokens.toggleOff, true: appTokens.toggleOn }}
            />
          </SettingRow>

          <Divider color={appTokens.divider} />

          <SettingRow label="Haptics" tokens={appTokens}>
            <Switch
              value={state.preferences.hapticEnabled}
              onValueChange={setHapticEnabled}
              trackColor={{ false: appTokens.toggleOff, true: appTokens.toggleOn }}
            />
          </SettingRow>

          <Divider color={appTokens.divider} />

          <View style={styles.wpmRow}>
            <Text style={[styles.settingLabel, { color: appTokens.text }]}>Reading speed</Text>
            <View style={styles.wpmButtons}>
              {[120, 220, 380].map((wpm) => {
                const active = state.preferences.wpm === wpm;
                return (
                  <Pressable
                    key={wpm}
                    onPress={() => setWpm(wpm)}
                    style={[
                      styles.wpmChip,
                      { backgroundColor: active ? appTokens.chipActive : appTokens.chipInactive },
                    ]}
                  >
                    <Text
                      style={[
                        styles.wpmChipText,
                        { color: active ? appTokens.chipActiveText : appTokens.chipInactiveText },
                      ]}
                    >
                      {wpm}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: appTokens.bg }]} edges={['top']}>
      <Text style={[styles.title, { color: appTokens.text, fontFamily: AppSerifFont.medium }]}>
        Profile
      </Text>
      <Text style={[styles.subtitle, { color: appTokens.text, fontFamily: AppSerifFont.italic }]}>
        A Devoted Reader
      </Text>

      {/* Decorative rule */}
      <View style={styles.decorativeRule}>
        <View style={[styles.ruleLine, { backgroundColor: appTokens.divider }]} />
        <Text style={[styles.ruleDiamond, { color: appTokens.textFaint }]}>◆</Text>
        <View style={[styles.ruleLine, { backgroundColor: appTokens.divider }]} />
      </View>

      {/* Ex Libris stamp */}
      <View style={styles.stampWrap}>
        <View style={[styles.stampOuter, { borderColor: appTokens.stamp }]}>
          <View style={[styles.stampInner, { borderColor: appTokens.stamp }]}>
            <Text style={[styles.stampText, { color: appTokens.stamp }]}>EX LIBRIS</Text>
          </View>
        </View>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatCard
          value={state.streak.streak}
          label="day streak"
          color={appTokens.text}
          muted={appTokens.textMuted}
          accent={state.streak.streak > 0}
          accentBg={appTokens.accentStar}
          surfaceBg={appTokens.surface}
          borderColor={appTokens.border}
        />
        <StatCard
          value={state.highlights.length}
          label="saved quotes"
          color={appTokens.text}
          muted={appTokens.textMuted}
          surfaceBg={appTokens.surface}
          borderColor={appTokens.border}
        />
        <StatCard
          value={state.books.length}
          label="in library"
          color={appTokens.text}
          muted={appTokens.textMuted}
          surfaceBg={appTokens.surface}
          borderColor={appTokens.border}
        />
        <StatCard
          value={appThemeLabel}
          label="theme"
          color={appTokens.text}
          muted={appTokens.textMuted}
          surfaceBg={appTokens.surface}
          borderColor={appTokens.border}
        />
      </View>

      {/* Settings entry */}
      <Pressable
        onPress={() => setShowSettings(true)}
        style={[
          styles.settingsEntry,
          { backgroundColor: appTokens.surface, borderColor: appTokens.border },
        ]}
      >
        <Text style={[styles.settingsEntryText, { color: appTokens.text }]}>Reading Settings</Text>
        <Text style={[styles.settingsEntryArrow, { color: appTokens.textMuted }]}>›</Text>
      </Pressable>

      {/* Footer */}
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
    </SafeAreaView>
  );
}

function StatCard({
  value,
  label,
  color,
  muted,
  accent,
  accentBg,
  surfaceBg,
  borderColor,
}: {
  value: string | number;
  label: string;
  color: string;
  muted: string;
  accent?: boolean;
  accentBg?: string;
  surfaceBg: string;
  borderColor: string;
}) {
  return (
    <View
      style={[
        styles.statCard,
        {
          borderColor,
          backgroundColor: accent && accentBg ? accentBg : surfaceBg,
        },
      ]}
    >
      <Text style={[styles.statValue, { color, fontFamily: AppSerifFont.regular }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: muted }]}>{label}</Text>
    </View>
  );
}

function SettingRow({
  label,
  children,
  tokens,
}: {
  label: string;
  children: React.ReactNode;
  tokens: { text: string };
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={[styles.settingLabel, { color: tokens.text }]}>{label}</Text>
      {children}
    </View>
  );
}

function Divider({ color }: { color: string }) {
  return <View style={[styles.divider, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    fontSize: 26,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 15,
    marginBottom: 0,
  },
  decorativeRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
    marginTop: 16,
    marginBottom: 16,
  },
  ruleLine: {
    flex: 1,
    height: 1,
  },
  ruleDiamond: {
    fontSize: 8,
    letterSpacing: 3,
  },
  stampWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stampOuter: {
    width: 120,
    height: 120,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampInner: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: '47%',
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 26,
    lineHeight: 26,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  settingsEntry: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsEntryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsEntryArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    opacity: 0.25,
    gap: 4,
  },
  footerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLine: {
    height: 1,
    width: 32,
  },
  footerLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  footerTagline: {
    fontSize: 9,
  },
  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 20,
    fontWeight: '300',
    marginTop: -1,
  },
  settingsTitle: {
    fontSize: 22,
  },
  settingsCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  wpmRow: {
    gap: 10,
  },
  wpmButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  wpmChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  wpmChipText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
