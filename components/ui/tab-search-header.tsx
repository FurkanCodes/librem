import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';

type TabSearchHeaderProps = {
  value: string;
  onChangeText: (text: string) => void;
  backgroundColor: string;
  borderBottomColor: string;
  searchBackgroundColor: string;
  inputColor: string;
  iconColor: string;
  placeholder?: string;
  placeholderTextColor?: string;
};

export function TabSearchHeader({
  value,
  onChangeText,
  backgroundColor,
  borderBottomColor,
  searchBackgroundColor,
  inputColor,
  iconColor,
  placeholder = 'Search your library…',
  placeholderTextColor = 'rgba(28,25,23,0.5)',
}: TabSearchHeaderProps) {
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor,
          borderBottomColor,
        },
      ]}
    >
      <View style={[styles.search, { backgroundColor: searchBackgroundColor }]}>
        <IconSymbol name="magnifyingglass" size={15} color={iconColor} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[styles.searchInput, { color: inputColor }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 80,
    borderBottomWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  search: {
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
});
