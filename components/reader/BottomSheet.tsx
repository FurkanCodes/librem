import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightPercent?: number;
  dragCloseOffset?: number;
  dragCloseVelocity?: number;
};

export function BottomSheet({
  visible,
  onClose,
  children,
  maxHeightPercent = 0.9,
  dragCloseOffset = 80,
  // Velocity is in points/second (RNGH).
  dragCloseVelocity = 500,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeightPx } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [dismissed, setDismissed] = useState(false);
  const prevIsOpenRef = useRef(false);

  // If parent re-opens the sheet, clear any internal "dismissed" state.
  useEffect(() => {
    if (visible) setDismissed(false);
  }, [visible]);

  const windowHeightSv = useSharedValue(windowHeightPx);
  const translateY = useSharedValue(0);
  const isOpen = useMemo(() => visible && !dismissed, [dismissed, visible]);

  const requestClose = useCallback(() => {
    setDismissed(true);
    onClose();
  }, [onClose]);

  useEffect(() => {
    windowHeightSv.value = windowHeightPx;
  }, [windowHeightPx, windowHeightSv]);

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current;

    if (isOpen && !wasOpen) {
      // Start off-screen, then spring into place.
      translateY.value = windowHeightPx;
      if (!mounted) setMounted(true);
      translateY.value = withSpring(0, { damping: 32, stiffness: 320, overshootClamping: true });
    }

    if (!isOpen && wasOpen) {
      translateY.value = withTiming(windowHeightPx, { duration: 180 }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }

    prevIsOpenRef.current = isOpen;
  }, [isOpen, mounted, translateY, windowHeightPx]);

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .activeOffsetY([-8, 8])
      .failOffsetX([-18, 18])
      .onUpdate((e) => {
        const next = Math.max(0, e.translationY);
        translateY.value = next;
      })
      .onEnd((e) => {
        const shouldClose = translateY.value > dragCloseOffset || e.velocityY > dragCloseVelocity;
        if (shouldClose) {
          runOnJS(requestClose)();
          return;
        }
        translateY.value = withSpring(0, { damping: 32, stiffness: 320, overshootClamping: true });
      });
  }, [dragCloseOffset, dragCloseVelocity, requestClose, translateY]);

  const backdropStyle = useAnimatedStyle(() => {
    // Fade backdrop out as the sheet is dragged down.
    const opacity = interpolate(
      translateY.value,
      [0, (windowHeightSv.value || 1000) * 0.75],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { opacity };
  }, []);

  const sheetStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: translateY.value }] };
  }, []);

  const maxHeight = windowHeightPx * maxHeightPercent;

  if (!mounted) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={requestClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={styles.backdropPressable} onPress={requestClose} />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              {
                maxHeight,
                paddingBottom: Math.max(insets.bottom, 14),
              },
              sheetStyle,
            ]}
          >
            {children}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.56)',
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
});
