import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppSerifFont } from '@/constants/theme';
import type { AppTokens, Book } from '@/features/reader/ui-mock';

import { BottomSheet } from './BottomSheet';

type SynopsisSheetProps = {
  visible: boolean;
  book: Book | null;
  tokens: AppTokens;
  isDark: boolean;
  onClose: () => void;
  onRead: () => void;
};

function estimateBookTime(totalChunks: number, progress: number): string {
  const remainingChunks = Math.max(0, totalChunks - progress);
  const totalWords = remainingChunks * 65;
  const minutes = Math.round(totalWords / 200);
  if (minutes < 1) return '< 1 min left';
  if (minutes < 60) return `~${minutes} min left`;
  const hours = Math.floor(minutes / 60);
  const minutesRemainder = minutes % 60;
  return minutesRemainder > 0 ? `~${hours}h ${minutesRemainder}m left` : `~${hours}h left`;
}

export function SynopsisSheet({ visible, book, tokens, isDark, onClose, onRead }: SynopsisSheetProps) {
  if (!book) return null;
  const progressValue = book.totalChunks > 0 ? Math.round((book.progress / book.totalChunks) * 100) : 0;

  return (
    <BottomSheet visible={visible} onClose={onClose} dragCloseOffset={80} dragCloseVelocity={500}>
      <View style={[styles.root, { backgroundColor: isDark ? '#0D0D0D' : '#FDFAF5' }]}>
        <View
          style={[
            styles.pill,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' },
          ]}
        />

        <View style={styles.header}>
          <View style={styles.coverWrap}>
            <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: tokens.text, fontFamily: AppSerifFont.medium }]} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={[styles.author, { color: tokens.textMuted }]} numberOfLines={1}>
              {book.author}
            </Text>
          </View>
        </View>

        <Text style={[styles.synopsis, { color: tokens.text, fontFamily: AppSerifFont.regular }]}>
          {book.synopsis}
        </Text>

        <View style={[styles.stats, { borderColor: tokens.divider }]}>
          <Stat label="Progress" value={`${progressValue}%`} mutedColor={tokens.textMuted} textColor={tokens.text} />
          <Stat label="Passages" value={`${book.totalChunks}`} mutedColor={tokens.textMuted} textColor={tokens.text} />
          <Stat
            label="Left"
            value={estimateBookTime(book.totalChunks, book.progress)}
            mutedColor={tokens.textMuted}
            textColor={tokens.text}
          />
        </View>

        <Pressable onPress={onRead} style={[styles.readButton, { backgroundColor: tokens.cta }]}>
          <Text style={[styles.readButtonText, { color: tokens.ctaText }]}>
            {book.progress > 0 ? 'Continue Reading' : 'Start Reading'}
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

function Stat({
  label,
  value,
  mutedColor,
  textColor,
}: {
  label: string;
  value: string;
  mutedColor: string;
  textColor: string;
}) {
  return (
    <View style={styles.statColumn}>
      <Text style={[styles.statLabel, { color: mutedColor }]}>{label}</Text>
      <Text style={[styles.statValue, { color: textColor, fontFamily: AppSerifFont.regular }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  pill: {
    width: 40,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  coverWrap: {
    width: 56,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  author: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  synopsis: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  stats: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  readButton: {
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  readButtonText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
