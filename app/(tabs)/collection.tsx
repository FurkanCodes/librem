import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { TabSearchHeader } from '@/components/ui/tab-search-header';
import { AppSerifFont } from '@/constants/theme';
import { useReaderUIState } from '@/features/reader/ui-mock';

export default function CollectionScreen() {
  const { state, appTokens, getBook } = useReaderUIState();
  const [query, setQuery] = useState('');

  const sortedHighlights = useMemo(
    () =>
      [...state.highlights].sort((firstItem, secondItem) =>
        secondItem.createdAt.localeCompare(firstItem.createdAt)
      ),
    [state.highlights]
  );

  const filteredHighlights = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return sortedHighlights;
    return sortedHighlights.filter((highlight) => {
      const sourceBook = getBook(highlight.bookId);
      return `${highlight.text} ${sourceBook?.title ?? ''}`.toLowerCase().includes(normalized);
    });
  }, [getBook, query, sortedHighlights]);

  const isEmpty = filteredHighlights.length === 0;

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
        <Text style={[styles.title, { color: appTokens.text, fontFamily: AppSerifFont.regular }]}>
          Collection
        </Text>

        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyContent}>
              <IconSymbol name="bookmark" size={48} color={appTokens.text} style={{ opacity: 0.45 }} />
              <Text style={[styles.emptyTitle, { color: appTokens.text, opacity: 0.65 }]}>
                No highlights yet.
              </Text>
              <Text style={[styles.emptyBody, { color: appTokens.textMuted }]}>
                Double-tap text while reading to collect wisdom.
              </Text>
            </View>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {filteredHighlights.map((highlight) => {
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
                    } as never)
                  }
                  style={[
                    styles.quoteCard,
                    { backgroundColor: appTokens.surface, borderColor: appTokens.border },
                  ]}
                >
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
                        <Image source={{ uri: sourceBook.coverUrl }} style={styles.cover} contentFit="cover" />
                      ) : null}
                    </View>
                    <Text style={[styles.sourceText, { color: appTokens.textMuted }]} numberOfLines={1}>
                      {sourceBook?.title ?? 'Unknown source'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 20,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
  },
  emptyContent: {
    width: '100%',
    marginTop: 80,
    alignItems: 'center',
    opacity: 0.45,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  emptyBody: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  content: {
    paddingBottom: 42,
    gap: 10,
  },
  quoteCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
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
