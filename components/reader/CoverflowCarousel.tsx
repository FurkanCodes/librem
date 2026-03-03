import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

import type { Book } from '@/features/reader/ui-mock';

type CoverflowCarouselProps = {
  books: Book[];
  selectedIndex: number;
  onSelectIndex: (nextIndex: number) => void;
  onOpenBook: (book: Book) => void;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  isDark?: boolean;
};

const BOOK_W = 148;
const BOOK_H = 222;
const SCREEN_W = Dimensions.get('window').width;

const SPRING_CONFIG = { stiffness: 320, damping: 32, mass: 0.9 };

function getBookMotionProps(offset: number) {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  const rotateY = abs === 0 ? 0 : sign * 56;
  const x = abs === 0 ? 0 : sign * (106 + (abs - 1) * 26);
  const z = -abs * 80;
  const scale = Math.max(1 - abs * 0.11, 0.6);
  const opacity = abs > 3 ? 0 : Math.max(0.3, 1 - abs * 0.25);
  const zIndex = Math.round(20 - abs * 3);
  return { rotateY, x, z, scale, opacity, zIndex };
}

/* ── Single Book Card ─────────────────────────────────────────────── */
function BookCard({
  book,
  index,
  selectedIndex,
  onPress,
}: {
  book: Book;
  index: number;
  selectedIndex: number;
  onPress: () => void;
}) {
  const offset = index - selectedIndex;
  const { rotateY, x, scale, opacity, zIndex } = getBookMotionProps(offset);
  const isCenter = offset === 0;

  const animStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(x, SPRING_CONFIG) },
        { perspective: 1100 },
        { rotateY: withSpring(`${rotateY}deg`, SPRING_CONFIG) },
        { scale: withSpring(scale, SPRING_CONFIG) },
      ],
      opacity: withSpring(opacity, SPRING_CONFIG),
      zIndex,
    };
  }, [x, rotateY, scale, opacity, zIndex]);

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: SCREEN_W / 2 - BOOK_W / 2,
          top: 0,
          width: BOOK_W,
          height: BOOK_H,
        },
        animStyle,
      ]}
    >
      <Pressable onPress={onPress} style={{ flex: 1 }}>
        {/* Main cover */}
        <View
          style={[
            styles.coverWrap,
            isCenter
              ? styles.centerShadow
              : styles.sideShadow,
          ]}
        >
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.cover}
            contentFit="cover"
          />
          {/* Side darkening overlay */}
          {!isCenter && (
            <LinearGradient
              colors={
                rotateY > 0
                  ? ['rgba(0,0,0,0.45)', 'transparent']
                  : ['transparent', 'rgba(0,0,0,0.45)']
              }
              start={rotateY > 0 ? { x: 0, y: 0.5 } : { x: 0, y: 0.5 }}
              end={rotateY > 0 ? { x: 0.6, y: 0.5 } : { x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          {/* Center specular highlight */}
          {isCenter && (
            <LinearGradient
              colors={[
                'rgba(255,255,255,0.15)',
                'transparent',
                'rgba(0,0,0,0.1)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
          )}
        </View>

        {/* Reflection */}
        <View style={styles.reflectionContainer}>
          <Image
            source={{ uri: book.coverUrl }}
            style={styles.reflectionImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,1)']}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ── Main Carousel ────────────────────────────────────────────────── */
export function CoverflowCarousel({
  books,
  selectedIndex,
  onSelectIndex,
  onOpenBook,
  textColor,
  mutedTextColor,
  isDark = false,
}: CoverflowCarouselProps) {
  const startX = useSharedValue(0);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(idx, books.length - 1));
      onSelectIndex(clamped);
    },
    [books.length, onSelectIndex]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = 0;
    })
    .onUpdate((e) => {
      startX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 44) {
        if (e.translationX < 0) {
          runOnJS(goTo)(selectedIndex + 1);
        } else {
          runOnJS(goTo)(selectedIndex - 1);
        }
      }
      startX.value = 0;
    });

  const containerH = BOOK_H + BOOK_H * 0.36 + 20;

  return (
    <View style={{ height: containerH + 40 }}>
      {/* Carousel area */}
      <GestureDetector gesture={panGesture}>
        <View style={[styles.carouselContainer, { height: containerH }]}>
          {/* Shelf glow */}
          <View
            style={[
              styles.shelfGlow,
              {
                backgroundColor: isDark
                  ? 'rgba(200,169,110,0.25)'
                  : 'rgba(160,140,110,0.35)',
              },
            ]}
          />

          {books.map((book, i) => (
            <BookCard
              key={book.id}
              book={book}
              index={i}
              selectedIndex={selectedIndex}
              onPress={() => {
                if (i === selectedIndex) onOpenBook(book);
                else goTo(i);
              }}
            />
          ))}

          {/* Nav arrows */}
          {selectedIndex > 0 && (
            <Pressable
              onPress={() => goTo(selectedIndex - 1)}
              style={[
                styles.navArrow,
                styles.navLeft,
                {
                  backgroundColor: isDark
                    ? 'rgba(237,217,176,0.10)'
                    : 'rgba(255,255,255,0.70)',
                },
              ]}
            >
              <Animated.Text style={[styles.arrowText, { color: textColor }]}>
                ‹
              </Animated.Text>
            </Pressable>
          )}
          {selectedIndex < books.length - 1 && (
            <Pressable
              onPress={() => goTo(selectedIndex + 1)}
              style={[
                styles.navArrow,
                styles.navRight,
                {
                  backgroundColor: isDark
                    ? 'rgba(237,217,176,0.10)'
                    : 'rgba(255,255,255,0.70)',
                },
              ]}
            >
              <Animated.Text style={[styles.arrowText, { color: textColor }]}>
                ›
              </Animated.Text>
            </Pressable>
          )}
        </View>
      </GestureDetector>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {books.map((_, i) => {
          const active = i === selectedIndex;
          return (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[
                styles.dot,
                {
                  backgroundColor: active ? textColor : mutedTextColor,
                  width: active ? 20 : 6,
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

export const COVERFLOW_SIZE = {
  width: BOOK_W,
  height: BOOK_H,
};

const styles = StyleSheet.create({
  carouselContainer: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  coverWrap: {
    width: BOOK_W,
    height: BOOK_H,
    borderRadius: 8,
    overflow: 'hidden',
  },
  centerShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 20 },
    elevation: 20,
  },
  sideShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  reflectionContainer: {
    position: 'absolute',
    top: BOOK_H + 3,
    left: 0,
    width: BOOK_W,
    height: BOOK_H * 0.36,
    overflow: 'hidden',
    transform: [{ scaleY: -1 }],
    opacity: 0.22,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  reflectionImage: {
    width: '100%',
    height: BOOK_H,
  },
  shelfGlow: {
    position: 'absolute',
    bottom: BOOK_H * 0.36 + 10,
    left: '15%',
    right: '15%',
    height: 2,
    borderRadius: 1,
  },
  navArrow: {
    position: 'absolute',
    top: BOOK_H / 2 - 18,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  navLeft: {
    left: 12,
  },
  navRight: {
    right: 12,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  dot: {
    height: 6,
    borderRadius: 999,
  },
});
