import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated as RNAnimated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { LongPressActionSheet } from '@/components/reader/LongPressActionSheet';
import { ReaderSettingsSheet } from '@/components/reader/ReaderSettingsSheet';
import { SessionSummarySheet } from '@/components/reader/SessionSummarySheet';
import { ShareSheet } from '@/components/reader/ShareSheet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useReaderUIState } from '@/features/reader/ui-mock';
import type { ReaderFontId } from '@/features/reader/ui-mock';

type TapHeart = {
  show: boolean;
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getFontFamily(fontId: ReaderFontId): string {
  switch (fontId) {
    case 'playfair':
      return 'serif';
    case 'garamond':
      return 'serif';
    case 'spectral':
      return 'serif';
    case 'lora':
    default:
      return 'serif';
  }
}

function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const seconds = Math.round((words / 200) * 60);
  if (seconds < 60) return `~${seconds}s`;
  return `~${Math.ceil(seconds / 60)} min`;
}

function shouldSkipDropCap(text: string) {
  const trimmed = text.trim();
  return trimmed.length < 40 || /^["'\d\[(]/.test(trimmed);
}

function SlowReadText({
  text,
  fontSize,
  textColor,
  fontFamily,
  active,
  wpm,
}: {
  text: string;
  fontSize: number;
  textColor: string;
  fontFamily: string;
  active: boolean;
  wpm: number;
}) {
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean), [text]);
  const [revealed, setRevealed] = useState(words.length);
  const millisecondsPerWord = Math.max(80, Math.round(60000 / Math.max(80, wpm)));

  useEffect(() => {
    if (!active) {
      setRevealed(words.length);
      return;
    }
    setRevealed(0);
    const timer = setInterval(() => {
      setRevealed((previousValue) => {
        if (previousValue >= words.length) return previousValue;
        return previousValue + 1;
      });
    }, millisecondsPerWord);

    return () => clearInterval(timer);
  }, [active, millisecondsPerWord, words.length]);

  return (
    <Text
      style={[
        styles.passageText,
        {
          fontSize,
          lineHeight: Math.round(fontSize * 1.65),
          color: textColor,
          fontFamily,
        },
      ]}
    >
      {words.map((word, index) => (
        <Text key={`${word}-${index}`} style={{ opacity: index < revealed ? 1 : 0.08 }}>
          {word}
          {index < words.length - 1 ? ' ' : ''}
        </Text>
      ))}
    </Text>
  );
}

export default function ReaderScreen() {
  const { bookId, chunk } = useLocalSearchParams<{ bookId: string; chunk?: string }>();
  const {
    state,
    appTokens,
    readerTokens,
    getBook,
    getHighlightForChunk,
    toggleHighlight,
    setBookProgress,
    setSession,
    setReaderTheme,
    setReaderMode,
    setFontId,
    setFontSize,
    setSlowRead,
    setWpm,
    setHapticEnabled,
    setAutoNightEnabled,
  } = useReaderUIState();
  const book = getBook(bookId) ?? state.books[0];

  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [uiVisible, setUiVisible] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showLongPress, setShowLongPress] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareText, setShareText] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(null);
  const [tapHeart, setTapHeart] = useState<TapHeart>({ show: false, x: 0, y: 0 });
  const [coverVisible, setCoverVisible] = useState(true);

  const lastTapTimestampRef = useRef(0);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visitedChunkIndicesRef = useRef<Set<number>>(new Set());
  const horizontalPanX = useSharedValue(0);

  useEffect(() => {
    const initialChunk = Number(chunk ?? 0);
    const bookChunkCount = book?.chunks.length ?? 1;
    setCurrentChunkIndex(clamp(Number.isFinite(initialChunk) ? initialChunk : 0, 0, bookChunkCount - 1));
  }, [book?.chunks.length, chunk]);

  useEffect(() => {
    const timer = setTimeout(() => setCoverVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!book) return;
    visitedChunkIndicesRef.current.add(currentChunkIndex);
    setBookProgress(book.id, currentChunkIndex);
    setSession({
      currentBookId: book.id,
      currentChunkIndex,
      visitedChunkIndices: Array.from(visitedChunkIndicesRef.current),
    });
  }, [book, currentChunkIndex, setBookProgress, setSession]);

  const showUiAndResetTimer = () => {
    setUiVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setUiVisible(false);
    }, 3000);
  };

  useEffect(() => {
    showUiAndResetTimer();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const chunks = book.chunks;
  const currentChunkText = chunks[currentChunkIndex] ?? '';
  const currentHighlight = getHighlightForChunk(book.id, currentChunkIndex);
  const progressPercent = Math.round(((currentChunkIndex + 1) / chunks.length) * 100);
  const fontFamily = getFontFamily(state.preferences.fontId);

  const onToggleHighlight = async (chunkIndex: number) => {
    const chunkText = chunks[chunkIndex];
    toggleHighlight(book.id, chunkIndex, chunkText);
    if (state.preferences.hapticEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const onPassageTap = async (chunkIndex: number, pageX: number, pageY: number) => {
    const timestamp = Date.now();
    if (timestamp - lastTapTimestampRef.current < 300) {
      await onToggleHighlight(chunkIndex);
      setTapHeart({ show: true, x: pageX, y: pageY });
      setTimeout(() => setTapHeart((previousValue) => ({ ...previousValue, show: false })), 800);
    }
    lastTapTimestampRef.current = timestamp;
    showUiAndResetTimer();
  };

  const onExitReader = () => {
    if (visitedChunkIndicesRef.current.size >= 1) {
      setShowSummary(true);
      return;
    }
    router.back();
  };

  const openActionSheet = (chunkIndex: number) => {
    setActiveActionIndex(chunkIndex);
    setShowLongPress(true);
    showUiAndResetTimer();
  };

  const goNext = useCallback(
    () => setCurrentChunkIndex((previousValue) => clamp(previousValue + 1, 0, chunks.length - 1)),
    [chunks.length]
  );
  const goPrev = useCallback(
    () => setCurrentChunkIndex((previousValue) => clamp(previousValue - 1, 0, chunks.length - 1)),
    [chunks.length]
  );

  const horizontalCardStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: horizontalPanX.value }] };
  }, []);

  const horizontalPanGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetX([-6, 6])
      .failOffsetY([-12, 12])
      .onUpdate((e) => {
        horizontalPanX.value = e.translationX;
      })
      .onEnd((e) => {
        if (e.translationX < -50) runOnJS(goNext)();
        else if (e.translationX > 50) runOnJS(goPrev)();

        horizontalPanX.value = withSpring(0, { damping: 24, stiffness: 240 });
      });
  }, [goNext, goPrev, horizontalPanX]);

  const featuredQuote = useMemo(() => {
    const candidate = state.highlights
      .filter((highlight) => highlight.bookId === book.id)
      .sort((firstItem, secondItem) => secondItem.createdAt.localeCompare(firstItem.createdAt))[0]?.text;
    if (!candidate) return currentChunkText.substring(0, 150);
    return candidate.length > 150 ? `${candidate.substring(0, 147)}...` : candidate;
  }, [book.id, currentChunkText, state.highlights]);

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: readerTokens.pageBg }]} edges={['top']}>
      {state.preferences.theme === 'immersive' ? (
        <>
          <Image source={{ uri: book.coverUrl }} style={StyleSheet.absoluteFillObject} blurRadius={42} contentFit="cover" />
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#000000CC' }]} />
        </>
      ) : null}

      <View style={styles.progressTrackTop}>
        <View style={[styles.progressFillTop, { width: `${progressPercent}%`, backgroundColor: readerTokens.progressFill }]} />
      </View>

      {uiVisible ? (
        <View style={styles.topBar}>
          <Pressable onPress={onExitReader} style={[styles.controlBtn, { backgroundColor: readerTokens.controlBg }]}>
            <IconSymbol name="chevron.right" size={20} color={readerTokens.controlText} style={{ transform: [{ rotate: '180deg' }] }} />
          </Pressable>
          <View style={styles.topTitle}>
            <Text style={[styles.topTitleText, { color: readerTokens.textMuted }]} numberOfLines={1}>
              {book.title}
            </Text>
          </View>
          <Pressable onPress={() => setShowSettings(true)} style={[styles.controlBtn, { backgroundColor: readerTokens.controlBg }]}>
            <IconSymbol name="gearshape" size={18} color={readerTokens.controlText} />
          </Pressable>
        </View>
      ) : null}

      {state.preferences.mode === 'vertical' ? (
        <RNAnimated.FlatList
          data={chunks}
          keyExtractor={(_, index) => `chunk-${index}`}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const pageHeight = event.nativeEvent.layoutMeasurement.height;
            const nextIndex = Math.round(event.nativeEvent.contentOffset.y / pageHeight);
            setCurrentChunkIndex(clamp(nextIndex, 0, chunks.length - 1));
          }}
          renderItem={({ item, index }) => {
            const highlighted = Boolean(getHighlightForChunk(book.id, index));
            return (
              <Pressable
                onPress={(event) => onPassageTap(index, event.nativeEvent.pageX, event.nativeEvent.pageY)}
                onLongPress={() => openActionSheet(index)}
                delayLongPress={600}
                style={styles.page}
              >
                <View style={[styles.pageCard, { backgroundColor: readerTokens.cardBg, borderColor: readerTokens.border }]}>
                  {highlighted ? <View style={styles.dogEar} /> : null}

                  {state.preferences.slowRead && index === currentChunkIndex ? (
                    <SlowReadText
                      text={item}
                      fontSize={state.preferences.fontSize}
                      textColor={readerTokens.text}
                      fontFamily={fontFamily}
                      active
                      wpm={state.preferences.wpm}
                    />
                  ) : shouldSkipDropCap(item) ? (
                    <Text
                      style={[
                        styles.passageText,
                        {
                          fontSize: state.preferences.fontSize,
                          lineHeight: Math.round(state.preferences.fontSize * 1.65),
                          color: readerTokens.text,
                          fontFamily,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.passageText,
                        {
                          fontSize: state.preferences.fontSize,
                          lineHeight: Math.round(state.preferences.fontSize * 1.65),
                          color: readerTokens.text,
                          fontFamily,
                        },
                      ]}
                    >
                      <Text style={[styles.dropCap, { color: readerTokens.dropCap }]}>{item.trim()[0]}</Text>
                      {item.trim().substring(1)}
                    </Text>
                  )}

                  <Text style={[styles.metaText, { color: readerTokens.textMuted }]}>
                    {index + 1} / {chunks.length}  {estimateReadTime(item)}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      ) : (
        <View style={styles.horizontalRoot}>
          <Pressable style={styles.edgeTapLeft} onPress={goPrev} />
          <Pressable style={styles.edgeTapRight} onPress={goNext} />

          <GestureDetector gesture={horizontalPanGesture}>
            <Animated.View style={[styles.horizontalCardWrap, horizontalCardStyle]}>
              <Pressable
                onPress={(event) => onPassageTap(currentChunkIndex, event.nativeEvent.pageX, event.nativeEvent.pageY)}
                onLongPress={() => openActionSheet(currentChunkIndex)}
                delayLongPress={600}
                style={[styles.horizontalCard, { backgroundColor: readerTokens.cardBg, borderColor: readerTokens.border }]}
              >
                {currentHighlight ? <View style={styles.dogEar} /> : null}
                {state.preferences.slowRead ? (
                  <SlowReadText
                    text={currentChunkText}
                    fontSize={state.preferences.fontSize}
                    textColor={readerTokens.text}
                    fontFamily={fontFamily}
                    active
                    wpm={state.preferences.wpm}
                  />
                ) : (
                  <Text
                    style={[
                      styles.passageText,
                      {
                        fontSize: state.preferences.fontSize,
                        lineHeight: Math.round(state.preferences.fontSize * 1.65),
                        color: readerTokens.text,
                        fontFamily,
                      },
                    ]}
                  >
                    {currentChunkText}
                  </Text>
                )}

                <Text style={[styles.metaText, { color: readerTokens.textMuted }]}>
                  {currentChunkIndex + 1} / {chunks.length}  {estimateReadTime(currentChunkText)}
                </Text>
              </Pressable>
            </Animated.View>
          </GestureDetector>

          <View style={[styles.horizontalProgressTrack, { backgroundColor: readerTokens.progressTrack }]}>
            <View
              style={[
                styles.horizontalProgressFill,
                { backgroundColor: readerTokens.progressFill, width: `${progressPercent}%` },
              ]}
            />
          </View>
        </View>
      )}

      {coverVisible ? (
        <View style={styles.coverReveal}>
          <Image source={{ uri: book.coverUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <View style={styles.coverOverlay} />
          <View style={styles.coverTextWrap}>
            <Text style={styles.coverAuthor}>{book.author}</Text>
            <Text style={styles.coverTitle}>{book.title}</Text>
          </View>
        </View>
      ) : null}

      {tapHeart.show ? (
        <View style={[styles.heartBurst, { left: tapHeart.x - 40, top: tapHeart.y - 40 }]}>
          <Text style={styles.heartIcon}>❤</Text>
        </View>
      ) : null}

      <ReaderSettingsSheet
        visible={showSettings}
        tokens={appTokens}
        preferences={state.preferences}
        onClose={() => setShowSettings(false)}
        onSetTheme={setReaderTheme}
        onSetMode={setReaderMode}
        onSetFontId={setFontId}
        onSetFontSize={setFontSize}
        onSetSlowRead={setSlowRead}
        onSetWpm={setWpm}
        onSetHapticEnabled={setHapticEnabled}
        onSetAutoNightEnabled={setAutoNightEnabled}
      />

      <LongPressActionSheet
        visible={showLongPress}
        excerpt={activeActionIndex !== null ? chunks[activeActionIndex] : ''}
        isSaved={activeActionIndex !== null ? Boolean(getHighlightForChunk(book.id, activeActionIndex)) : false}
        tokens={appTokens}
        onClose={() => setShowLongPress(false)}
        onToggleSave={async () => {
          if (activeActionIndex === null) return;
          await onToggleHighlight(activeActionIndex);
          setShowLongPress(false);
        }}
        onShare={() => {
          if (activeActionIndex === null) return;
          setShareText(chunks[activeActionIndex]);
          setShowLongPress(false);
          setShowShare(true);
        }}
      />

      <ShareSheet
        visible={showShare}
        tokens={appTokens}
        excerpt={shareText}
        bookTitle={book.title}
        author={book.author}
        onClose={() => setShowShare(false)}
      />

      <SessionSummarySheet
        visible={showSummary}
        book={book}
        chunksRead={visitedChunkIndicesRef.current.size}
        featuredQuote={featuredQuote}
        tokens={appTokens}
        isDark={state.appTheme === 'dark'}
        onClose={() => {
          setShowSummary(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  progressTrackTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    zIndex: 30,
    backgroundColor: 'transparent',
  },
  progressFillTop: {
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 4,
    left: 12,
    right: 12,
    zIndex: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  topTitleText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    width: '100%',
    minHeight: 720,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 70,
  },
  pageCard: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 26,
    minHeight: 420,
    justifyContent: 'space-between',
  },
  passageText: {
    textAlign: 'left',
    fontWeight: '500',
  },
  dropCap: {
    fontSize: 64,
    lineHeight: 60,
    fontWeight: '500',
  },
  metaText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: 18,
  },
  horizontalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  edgeTapLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '15%',
    zIndex: 5,
  },
  edgeTapRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '15%',
    zIndex: 5,
  },
  horizontalCardWrap: {
    width: '100%',
    maxWidth: 440,
    zIndex: 8,
  },
  horizontalCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 24,
    minHeight: 520,
    justifyContent: 'space-between',
  },
  horizontalProgressTrack: {
    height: 4,
    borderRadius: 999,
    overflow: 'hidden',
    width: '80%',
    marginTop: 12,
  },
  horizontalProgressFill: {
    height: '100%',
    borderRadius: 999,
  },
  dogEar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 34,
    borderBottomWidth: 34,
    borderLeftColor: 'transparent',
    borderBottomColor: '#c8a87e',
  },
  coverReveal: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 80,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  coverTextWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '30%',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  coverAuthor: {
    color: 'rgba(255,255,255,0.66)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  coverTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
  heartBurst: {
    position: 'absolute',
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 70,
  },
  heartIcon: {
    fontSize: 64,
    color: '#ef4444',
  },
});
