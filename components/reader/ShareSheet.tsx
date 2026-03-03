import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTokens } from '@/features/reader/ui-mock';

import { BottomSheet } from './BottomSheet';
import { QuoteShareCard } from './QuoteShareCard';

type ShareSheetProps = {
  visible: boolean;
  tokens: AppTokens;
  excerpt: string;
  bookTitle: string;
  author: string;
  onClose: () => void;
};

export function ShareSheet({ visible, tokens, excerpt, bookTitle, author, onClose }: ShareSheetProps) {
  const [variant, setVariant] = useState<'parchment' | 'night'>('parchment');

  const onMockAction = (label: string) => {
    Alert.alert('UI phase action', `${label} action is intentionally mocked in UI-first phase.`);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightPercent={0.92}>
      <View style={[styles.root, { backgroundColor: tokens.surfaceRaised }]}>
        <View style={[styles.pill, { backgroundColor: tokens.divider }]} />
        <Text style={[styles.header, { color: tokens.text }]}>Share Excerpt</Text>
        <Text style={[styles.subheader, { color: tokens.textMuted }]} numberOfLines={1}>
          {bookTitle}
        </Text>

        <View style={styles.preview}>
          <QuoteShareCard text={excerpt} bookTitle={bookTitle} author={author} variant={variant} />
        </View>

        <View style={styles.variantRow}>
          <Chip
            active={variant === 'parchment'}
            label="Parchment"
            tokens={tokens}
            onPress={() => setVariant('parchment')}
          />
          <Chip active={variant === 'night'} label="Night" tokens={tokens} onPress={() => setVariant('night')} />
        </View>

        <View style={styles.actionRow}>
          <ActionButton label="Share" tokens={tokens} onPress={() => onMockAction('Share')} />
          <ActionButton label="Copy Image" tokens={tokens} onPress={() => onMockAction('Copy Image')} />
          <ActionButton label="Copy Text" tokens={tokens} onPress={() => onMockAction('Copy Text')} />
        </View>
      </View>
    </BottomSheet>
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
      <Text style={[styles.chipText, { color: active ? tokens.chipActiveText : tokens.chipInactiveText }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function ActionButton({
  label,
  tokens,
  onPress,
}: {
  label: string;
  tokens: AppTokens;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.actionButton, { backgroundColor: tokens.searchBg }]}>
      <Text style={[styles.actionButtonText, { color: tokens.text }]}>{label}</Text>
    </Pressable>
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
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  subheader: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 14,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 14,
  },
  variantRow: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
});

