import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { announce } from '@/utils/announce';

import { ThemedText } from './ThemedText';

export interface FavoriteButtonProps {
  readonly isFavorite: boolean;
  readonly onToggle: () => void;
  readonly storeName: string;
  readonly variant?: 'icon' | 'full';
  readonly testID?: string;
}

const FavoriteButtonComponent = ({
  isFavorite,
  onToggle,
  storeName,
  variant = 'icon',
  testID,
}: FavoriteButtonProps) => {
  const theme = useTheme();
  const iconName = isFavorite ? 'heart' : 'heart-outline';
  const iconColor = isFavorite ? theme.favorite : theme.textSecondary;
  const label = isFavorite
    ? `Retirer ${storeName} des favoris`
    : `Ajouter ${storeName} aux favoris`;

  const handlePress = useCallback(() => {
    onToggle();
    announce(isFavorite ? `${storeName} retiré des favoris` : `${storeName} ajouté aux favoris`);
  }, [onToggle, isFavorite, storeName]);

  if (variant === 'full') {
    return (
      <Pressable
        testID={testID}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected: isFavorite }}
        style={({ pressed }) => [
          styles.full,
          {
            borderColor: isFavorite ? theme.favorite : theme.border,
            backgroundColor: theme.card,
            opacity: pressed ? 0.7 : 1,
          },
        ]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
        <ThemedText variant="bodyBold">
          {isFavorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
        </ThemedText>
      </Pressable>
    );
  }

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFavorite }}
      style={({ pressed }) => [styles.icon, { opacity: pressed ? 0.5 : 1 }]}>
      <Ionicons name={iconName} size={24} color={iconColor} />
    </Pressable>
  );
};

export const FavoriteButton = memo(FavoriteButtonComponent);

const styles = StyleSheet.create({
  icon: {
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  full: {
    minHeight: MIN_TOUCH_TARGET + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
});
