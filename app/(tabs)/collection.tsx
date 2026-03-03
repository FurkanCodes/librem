import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { clamp, getScale } from '@/constants/layout';
import { AppSerifFont } from '@/constants/theme';
import { useReaderUIState } from '@/features/reader/ui-mock';

export default function CollectionScreen() {
  const { state, appTokens, getBook } = useReaderUIState();
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { scale } = getScale(width, height);
  const gutter = clamp(Math.round(20 * scale), 16, 22);
  const topPad = clamp(Math.round(8 * scale), 6, 10);
  const sortedHighlights = [...state.highlights].sort((firstItem, secondItem) =>
    secondItem.createdAt.localeCompare(firstItem.createdAt)
  );

  return (
    <SafeAreaView
      style={[
        styles.root,
        {
          backgroundColor: appTokens.bg,
          paddingHorizontal: gutter,
          paddingTop: topPad,
          paddingBottom: Math.max(insets.bottom, 0),
        },
      ]}
      edges={['top']}
    >
      <Text style={[styles.title, { color: appTokens.text, fontFamily: AppSerifFont.medium }]}>
        Collection
      </Text>
      <Text style={[styles.subtitle, { color: appTokens.textMuted }]}>Saved passages</Text>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sortedHighlights.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              { backgroundColor: appTokens.surface, borderColor: appTokens.border },
            ]}
          >
            <IconSymbolPlaceholder size={48} color={appTokens.textMuted} style={{ marginBottom: 16, opacity: 0.45 }} />
            <Text style={[styles.emptyTitle, { color: appTokens.text }]}>No highlights yet</Text>
            <Text style={[styles.emptyBody, { color: appTokens.textMuted }]}>
              Double tap or long press passages while reading to collect quotes.
            </Text>
          </View>
        ) : (
          sortedHighlights.map((highlight) => {
            const sourceBook = getBook(highlight.bookId);
            return (
              <Pressable
                key={highlight.id}
                onPress={() =>
                  router.push({
                    pathname: '/reader/[bookId]',
                    params: {
                      bookId: highlight.bookId,
                      chunk: String(highlight.chunkIndex),
                    },
                  } as any)
                }
                style={[
                  styles.quoteCard,
                  { backgroundColor: appTokens.surface, borderColor: appTokens.border },
                ]}
              >
                <View style={styles.bgIconWrap}>
                  <IconSymbol name="heart.fill" size={16} color="#ef4444" />
                </View>

                <Text
                  style={[
                    styles.quoteText,
                    { color: appTokens.text, fontFamily: AppSerifFont.regular },
                  ]}
                >
                  {'"'}
                  {highlight.text}
                  {'"'}
                </Text>

                <View style={styles.sourceRow}>
                  <View style={[styles.coverWrap, { backgroundColor: appTokens.progressTrack }]}>
                    {sourceBook ? (
                      <Image
                        source={{ uri: sourceBook.coverUrl }}
                        style={styles.cover}
                        contentFit="cover"
                      />
                    ) : null}
                  </View>
                  <Text
                    style={[styles.sourceText, { color: appTokens.textMuted }]}
                    numberOfLines={1}
                  >
                    {sourceBook?.title ?? 'Unknown source'}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/** Simple placeholder for empty-state icon (avoids importing a full icon lib here) */
function IconSymbolPlaceholder({
  size,
  color,
  style,
}: {
  size: number;
  color: string;
  style?: any;
}) {
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.6, color }}>♡</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    marginBottom: 10,
  },
  content: {
    paddingBottom: 42,
    gap: 10,
  },
  emptyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  bgIconWrap: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.2,
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 12,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coverWrap: {
    width: 24,
    height: 24,
    borderRadius: 6,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  sourceText: {
    flex: 1,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
