import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoverflowCarousel } from '@/components/reader/CoverflowCarousel';
import { SynopsisSheet } from '@/components/reader/SynopsisSheet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getLibraryMetrics } from '@/constants/layout';
import { AppSerifFont } from '@/constants/theme';
import { useReaderUIState } from '@/features/reader/ui-mock';

function estimateBookTime(totalChunks: number, progress: number, avgChunkWords: number = 65) {
  const remaining = Math.max(0, totalChunks - progress);
  const totalWords = remaining * avgChunkWords;
  const minutes = Math.round(totalWords / 200);
  if (minutes < 1) return '< 1 min left';
  if (minutes < 60) return `~${minutes} min left`;
  const hours = Math.floor(minutes / 60);
  const minutesRemainder = minutes % 60;
  return minutesRemainder > 0 ? `~${hours}h ${minutesRemainder}m left` : `~${hours}h left`;
}

export default function LibraryScreen() {
  const { books, appTokens, state, setSession } = useReaderUIState();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [synopsisVisible, setSynopsisVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isDark = state.appTheme === 'dark';

  const metrics = useMemo(
    () =>
      getLibraryMetrics({
        width,
        height,
        insetsTop: insets.top,
        insetsBottom: insets.bottom,
      }),
    [height, insets.bottom, insets.top, width]
  );

  const synopsisLines = height < 700 ? 8 : 15;

  const filteredBooks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return books;
    return books.filter((bookItem) =>
      `${bookItem.title} ${bookItem.author}`.toLowerCase().includes(normalized)
    );
  }, [books, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const selectedBook = filteredBooks[selectedIndex] ?? null;

  const openReader = (bookId: string) => {
    setSession({ currentBookId: bookId, currentChunkIndex: 0, visitedChunkIndices: [] });
    router.push({ pathname: '/reader/[bookId]', params: { bookId } } as any);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: appTokens.bg }]} edges={['top']}>
      {selectedBook ? (
        <View
          style={[StyleSheet.absoluteFillObject, { opacity: isDark ? 0.25 : 0.18 }]}
        >
          <Image
            source={{ uri: selectedBook.coverUrl }}
            style={[StyleSheet.absoluteFillObject, { transform: [{ scale: 1.25 }] }]}
            blurRadius={60}
            contentFit="cover"
          />
        </View>
      ) : null}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: appTokens.bg, opacity: 0.82 }]} />

      <View style={styles.content}>
        {/* Search header */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor: appTokens.divider,
              backgroundColor: appTokens.bgHeader,
              paddingHorizontal: metrics.gutter,
              paddingVertical: metrics.headerPadY,
            },
          ]}
        >
          <View
            style={[
              styles.search,
              {
                backgroundColor: appTokens.searchBg,
                paddingHorizontal: metrics.searchPadX,
                paddingVertical: metrics.searchPadY,
              },
            ]}
          >
            <IconSymbol name="magnifyingglass" size={15} color={appTokens.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search your library…"
              placeholderTextColor={appTokens.textFaint}
              style={[styles.searchInput, { color: appTokens.text }]}
            />
          </View>
        </View>

        {/* Section label */}
        <View style={[styles.heading, { paddingHorizontal: metrics.gutter }]}>
          <Text
            style={[
              styles.title,
              { color: appTokens.text, fontFamily: AppSerifFont.medium, fontSize: metrics.titleSize },
            ]}
          >
            My Library
          </Text>
          <Text style={[styles.subtitle, { color: appTokens.textMuted, fontSize: metrics.subtitleSize }]}>
            {filteredBooks.length} books collected
          </Text>
        </View>

        {/* 3D Coverflow Carousel */}
        <View style={styles.carouselWrapper}>
          <CoverflowCarousel
            books={filteredBooks}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            onOpenBook={(bookItem) => openReader(bookItem.id)}
            textColor={appTokens.text}
            mutedTextColor={appTokens.textMuted}
            borderColor={appTokens.border}
            isDark={isDark}
            bookWidth={metrics.bookWidth}
            bookHeight={metrics.bookHeight}
          />
        </View>

        {/* Info panel */}
        {selectedBook ? (
          <View
            style={[
              styles.infoPanel,
              { paddingHorizontal: metrics.gutter, paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            {/* Title + Author */}
            <View style={styles.titleBlock}>
              <Text
                style={[styles.bookTitle, { color: appTokens.text, fontFamily: AppSerifFont.medium }]}
                numberOfLines={2}
              >
                {selectedBook.title}
              </Text>
              <Text style={[styles.bookAuthor, { color: appTokens.textMuted }]} numberOfLines={1}>
                by {selectedBook.author}
              </Text>
            </View>

            {/* Synopsis teaser */}
            {selectedBook.synopsis ? (
              <Pressable onPress={() => setSynopsisVisible(true)} style={styles.synopsisPressable}>
                <Text
                  style={[styles.synopsisPreview, { color: appTokens.textMuted, fontFamily: AppSerifFont.italic }]}
                  numberOfLines={synopsisLines}
                >
                  {selectedBook.synopsis}
                </Text>
                <Text style={[styles.readMore, { color: appTokens.textFaint }]}>read more ›</Text>
              </Pressable>
            ) : null}

            {/* Hairline divider */}
            <View
              style={[
                styles.hairline,
                {
                  backgroundColor: isDark
                    ? 'rgba(237,217,176,0.08)'
                    : 'rgba(30,18,8,0.07)',
                },
              ]}
            />

            {/* Progress bar */}
            <View style={styles.progressSection}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: appTokens.textMuted }]}>Progress</Text>
                <View style={styles.infoRight}>
                  <Text style={[styles.infoEstimate, { color: appTokens.textMuted }]}>
                    {estimateBookTime(selectedBook.totalChunks, selectedBook.progress)}
                  </Text>
                  <Text style={[styles.infoPercent, { color: appTokens.textMuted }]}>
                    {selectedBook.totalChunks > 0
                      ? `${Math.round((selectedBook.progress / selectedBook.totalChunks) * 100)}%`
                      : '0%'}
                  </Text>
                </View>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: appTokens.progressTrack }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: appTokens.progressFill,
                      width: `${selectedBook.totalChunks > 0 ? (selectedBook.progress / selectedBook.totalChunks) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Action buttons */}
            <View style={[styles.actions, { height: metrics.actionSize }]}>
              <Pressable
                onPress={() => openReader(selectedBook.id)}
                style={[styles.readBtn, { backgroundColor: appTokens.cta }]}
              >
                <IconSymbol name="book.fill" size={17} color={appTokens.ctaText} />
                <Text style={[styles.readBtnText, { color: appTokens.ctaText }]}>
                  {selectedBook.progress > 0 ? 'Continue Reading' : 'Start Reading'}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => router.push('/modal')}
                style={[
                  styles.plusBtn,
                  {
                    width: metrics.actionSize,
                    height: metrics.actionSize,
                    borderColor: appTokens.border,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  },
                ]}
              >
                <IconSymbol name="plus" size={20} color={appTokens.textMuted} />
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: appTokens.textMuted }]}>No books found.</Text>
          </View>
        )}
      </View>

      <SynopsisSheet
        visible={synopsisVisible}
        book={selectedBook}
        tokens={appTokens}
        isDark={isDark}
        onClose={() => setSynopsisVisible(false)}
        onRead={() => {
          if (!selectedBook) return;
          setSynopsisVisible(false);
          openReader(selectedBook.id);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
  },
  search: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  heading: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  title: {
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
  },
  carouselWrapper: {
    marginTop: 16,
  },
  infoPanel: {
    paddingBottom: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  titleBlock: {
    alignItems: 'center',
  },
  bookTitle: {
    textAlign: 'center',
    fontSize: 21,
    lineHeight: 26,
    paddingHorizontal: 8,
  },
  bookAuthor: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 14,
  },
  synopsisPressable: {
    marginTop: 8,
    minHeight: 40,
    alignItems: 'center',
  },
  synopsisPreview: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
  },
  readMore: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  hairline: {
    height: 1,
    marginHorizontal: 8,
    marginTop: 12,
    marginBottom: 12,
  },
  progressSection: {
    paddingHorizontal: 8,
    height: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoEstimate: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  infoPercent: {
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  readBtn: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  readBtnText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  plusBtn: {
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
