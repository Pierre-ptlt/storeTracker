import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { Store } from '@/types/store';
import { CATEGORY_META } from '@/utils/categories';

import { FavoriteButton } from './FavoriteButton';
import { OpenStatusBadge } from './OpenStatusBadge';
import { ThemedText } from './ThemedText';

export const STORE_CARD_HEIGHT = 112;
export const STORE_CARD_GAP = Spacing.md;
export const STORE_ROW_HEIGHT = STORE_CARD_HEIGHT + STORE_CARD_GAP;
export const MAX_CARD_FONT_SCALE = 2;
const TEXT_BLOCK_HEIGHT = 66;

export const rowHeightForFontScale = (fontScale: number): number => {
  const scale = Math.min(Math.max(fontScale, 1), MAX_CARD_FONT_SCALE);
  return STORE_ROW_HEIGHT + Math.ceil(TEXT_BLOCK_HEIGHT * (scale - 1));
};

export const useStoreRowHeight = (): number => {
  return rowHeightForFontScale(useWindowDimensions().fontScale);
};

export interface StoreCardProps {
  readonly store: Store;
  readonly isFavorite: boolean;
  readonly isOpen: boolean;
  readonly rowHeight?: number;
  readonly onPress: (store: Store) => void;
  readonly onToggleFavorite: (store: Store) => void;
}

const StoreCardComponent = ({
  store,
  isFavorite,
  isOpen,
  rowHeight = STORE_ROW_HEIGHT,
  onPress,
  onToggleFavorite,
}: StoreCardProps) => {
  const theme = useTheme();
  const category = CATEGORY_META[store.category];

  const handlePress = useCallback(() => onPress(store), [onPress, store]);
  const handleToggle = useCallback(() => onToggleFavorite(store), [onToggleFavorite, store]);

  const a11yLabel = [
    store.name,
    category.label,
    `${store.address}, ${store.city}`,
    isOpen ? 'ouvert actuellement' : 'fermé actuellement',
    `note ${store.rating.toString().replace('.', ',')} sur 5`,
    isFavorite ? 'dans vos favoris' : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <View
      testID={`store-card-${store.id}`}
      style={[
        styles.card,
        { height: rowHeight - STORE_CARD_GAP, backgroundColor: theme.card, borderColor: theme.border },
      ]}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityHint="Ouvre la fiche détaillée du magasin"
        android_ripple={{ color: theme.border }}
        style={({ pressed }) => [styles.main, { opacity: pressed ? 0.6 : 1 }]}>
        <View style={[styles.iconWrap, { backgroundColor: theme.background }]}>
          <Ionicons name={category.icon} size={24} color={theme.primary} />
        </View>
        <View style={styles.texts}>
          <ThemedText variant="bodyBold" numberOfLines={1} maxFontSizeMultiplier={MAX_CARD_FONT_SCALE}>
            {store.name}
          </ThemedText>
          <ThemedText variant="caption" color="textSecondary" numberOfLines={1} maxFontSizeMultiplier={MAX_CARD_FONT_SCALE}>
            {category.label} · {store.city}
          </ThemedText>
          <View style={styles.meta}>
            <OpenStatusBadge isOpen={isOpen} />
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={theme.textSecondary} />
              <ThemedText variant="caption" color="textSecondary" maxFontSizeMultiplier={MAX_CARD_FONT_SCALE}>
                {store.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        </View>
      </Pressable>
      <FavoriteButton
        testID={`favorite-toggle-${store.id}`}
        isFavorite={isFavorite}
        onToggle={handleToggle}
        storeName={store.name}
      />
    </View>
  );
};

export const StoreCard = memo(StoreCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    paddingRight: Spacing.xs,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.lg,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: { flex: 1, gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.xs },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
