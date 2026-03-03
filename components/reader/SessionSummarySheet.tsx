import { Image } from 'expo-image';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTokens, Book } from '@/features/reader/ui-mock';

import { BottomSheet } from './BottomSheet';

type SessionSummarySheetProps = {
  visible: boolean;
  book: Book;
  chunksRead: number;
  featuredQuote: string;
  tokens: AppTokens;
  isDark: boolean;
  onClose: () => void;
};

export function SessionSummarySheet({
  visible,
  book,
  chunksRead,
  featuredQuote,
  tokens,
  isDark,
  onClose,
}: SessionSummarySheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightPercent={0.84}>
      <View style={[styles.root, { backgroundColor: isDark ? '#0D0D0D' : '#FAF8F4' }]}>
        <View style={[styles.pill, { backgroundColor: tokens.divider }]} />

        <Text style={[styles.kicker, { color: tokens.textMuted }]}>Session Complete</Text>

        <View style={styles.bookRow}>
          <View style={styles.coverWrap}>
            <Image source={{ uri: book.coverUrl }} style={styles.cover} contentFit="cover" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: tokens.text }]} numberOfLines={2}>
              {book.title}
            </Text>
            <Text style={[styles.author, { color: tokens.textMuted }]} numberOfLines={1}>
              by {book.author}
            </Text>
            <Text style={[styles.readCount, { color: tokens.text }]}>
              {chunksRead} {chunksRead === 1 ? 'passage' : 'passages'} read
            </Text>
          </View>
        </View>

        <Text style={[styles.quote, { color: tokens.textMuted }]}>
          {'"'}
          {featuredQuote}
          {'"'}
        </Text>

        <Pressable onPress={onClose} style={[styles.button, { backgroundColor: tokens.cta }]}>
          <Text style={[styles.buttonText, { color: tokens.ctaText }]}>Return to Library</Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  pill: {
    width: 40,
    height: 4,
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 16,
  },
  kicker: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  bookRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  coverWrap: {
    width: 56,
    height: 78,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  author: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  readCount: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
  },
  quote: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
});
