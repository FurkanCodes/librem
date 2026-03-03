import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { clamp } from '@/constants/layout';

type QuoteShareCardProps = {
  text: string;
  bookTitle: string;
  author: string;
  variant: 'parchment' | 'night';
};

const VARIANT_COLORS = {
  parchment: {
    cardBg: '#F5E8CE',
    text: '#1E1208',
    muted: 'rgba(30,18,8,0.5)',
    border: 'rgba(30,18,8,0.13)',
  },
  night: {
    cardBg: '#1C130D',
    text: '#EDD9B0',
    muted: 'rgba(237,217,176,0.55)',
    border: 'rgba(237,217,176,0.2)',
  },
} as const;

export function QuoteShareCard({ text, bookTitle, author, variant }: QuoteShareCardProps) {
  const colors = VARIANT_COLORS[variant];
  const previewText = text.length > 250 ? `${text.substring(0, 247)}...` : text;
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width - 40, 340);
  const cardMinHeight = clamp(Math.round(cardWidth * 1.05), 240, 320);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          width: cardWidth,
          minHeight: cardMinHeight,
        },
      ]}
    >
      <Text style={[styles.quote, { color: colors.text }]}>
        {'"'}
        {previewText}
        {'"'}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.bookTitle, { color: colors.muted }]} numberOfLines={1}>
        {bookTitle}
      </Text>
      <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>
        {author}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 22,
    justifyContent: 'space-between',
  },
  quote: {
    fontSize: 19,
    lineHeight: 29,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  bookTitle: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  author: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
