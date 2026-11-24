import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { MIN_TOUCH_TARGET, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export interface SearchBarProps {
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly placeholder?: string;
}

const SearchBarComponent = ({
  value,
  onChangeText,
  placeholder = 'Rechercher un magasin',
}: SearchBarProps) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.card, borderColor: theme.borderStrong }]}
      accessibilityRole="search">
      <Ionicons name="search" size={20} color={theme.textSecondary} accessibilityElementsHidden importantForAccessibility="no" />
      <TextInput
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel="Rechercher un magasin par nom"
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        maxFontSizeMultiplier={2}
        style={[styles.input, { color: theme.text }]}
      />
      {value.length > 0 && (
        <Pressable
          testID="search-clear"
          onPress={() => onChangeText('')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
          style={styles.clear}>
          <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: MIN_TOUCH_TARGET + 4,
    paddingLeft: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.sm,
  },
  clear: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
