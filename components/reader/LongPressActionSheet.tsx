import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { AppTokens } from '@/features/reader/ui-mock';

type LongPressActionSheetProps = {
  visible: boolean;
  excerpt: string;
  isSaved: boolean;
  tokens: AppTokens;
  onClose: () => void;
  onToggleSave: () => void;
  onShare: () => void;
};

export function LongPressActionSheet({
  visible,
  excerpt,
  isSaved,
  tokens,
  onClose,
  onToggleSave,
  onShare,
}: LongPressActionSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[styles.card, { backgroundColor: tokens.surfaceRaised, borderColor: tokens.border }]}
        >
          <Text style={[styles.quote, { color: tokens.text }]}>
            {'"'}
            {excerpt}
            {'"'}
          </Text>

          <View style={styles.actions}>
            <Pressable onPress={onToggleSave} style={[styles.actionBtn, { backgroundColor: tokens.searchBg }]}>
              <Text style={[styles.actionText, { color: tokens.text }]}>
                {isSaved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            <Pressable onPress={onShare} style={[styles.actionBtn, { backgroundColor: tokens.searchBg }]}>
              <Text style={[styles.actionText, { color: tokens.text }]}>Share</Text>
            </Pressable>
          </View>

          <Pressable onPress={onClose} style={[styles.cancelBtn, { borderColor: tokens.border }]}>
            <Text style={[styles.cancelText, { color: tokens.textMuted }]}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 22,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
  },
  quote: {
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  cancelBtn: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
});
