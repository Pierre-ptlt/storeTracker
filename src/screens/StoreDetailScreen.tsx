import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useCallback, useState, type ComponentProps, type ReactNode } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FavoriteButton } from '@/components/FavoriteButton';
import { OpenStatusBadge } from '@/components/OpenStatusBadge';
import { OpeningHoursList } from '@/components/OpeningHoursList';
import { StoreMap } from '@/components/StoreMap';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { MAX_CONTENT_WIDTH, MIN_TOUCH_TARGET, Radius, Spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useNow } from '@/hooks/useNow';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useStoreDetails } from '@/hooks/useStoreDetails';
import { useTheme } from '@/hooks/useTheme';
import { storeCache } from '@/services/storeCache';
import type { Store } from '@/types/store';
import { CATEGORY_META } from '@/utils/categories';
import { isOpenAt, toWeekday } from '@/utils/openingHours';

const directionsUrl = ({ coordinates: { latitude, longitude }, name }: Store): string => {
  const label = encodeURIComponent(name);
  return Platform.select({
    ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
    android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
  });
};

export const StoreDetailScreen = ({ id }: { readonly id: string }) => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [fallback] = useState(() => storeCache.get(id) ?? favorites.find((s) => s.id === id) ?? null);
  const details = useStoreDetails(id, fallback);
  const { store } = details;
  const now = useNow();
  const { width } = useResponsiveLayout();

  const onToggleFavorite = useCallback(() => {
    if (store) toggleFavorite(store);
  }, [store, toggleFavorite]);

  if (!store) {
    return (
      <ThemedView style={styles.fill}>
        <Stack.Screen options={{ title: 'Magasin' }} />
        {details.status === 'error' ? (
          <ErrorState message={details.error} onRetry={details.retry} />
        ) : (
          <LoadingState label="Chargement du magasin" />
        )}
      </ThemedView>
    );
  }

  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const mapHeight = Math.round(Math.min(320, Math.max(200, contentWidth * 0.55)));
  const category = CATEGORY_META[store.category];
  const fullAddress = `${store.address}, ${store.postalCode} ${store.city}`;

  return (
    <ThemedView style={styles.fill}>
      <Stack.Screen options={{ title: store.name }} />
      <ScrollView
        testID="store-detail"
        contentContainerStyle={[styles.content, { maxWidth: MAX_CONTENT_WIDTH }]}>
        {details.status === 'error' && (
          <ThemedText variant="caption" color="danger" accessibilityRole="alert">
            Données possiblement obsolètes : {details.error}
          </ThemedText>
        )}

        <StoreMap coordinates={store.coordinates} title={store.name} description={fullAddress} height={mapHeight} />

        <View style={styles.section}>
          <ThemedText variant="title" accessibilityRole="header">
            {store.name}
          </ThemedText>
          <View style={styles.row}>
            <ThemedText color="textSecondary">{category.label}</ThemedText>
            <OpenStatusBadge isOpen={isOpenAt(store.openingHours, now)} />
            <ThemedText color="textSecondary" accessibilityLabel={`Note ${store.rating} sur 5`}>
              ★ {store.rating.toFixed(1)}
            </ThemedText>
          </View>
        </View>

        <FavoriteButton
          testID="detail-favorite-button"
          variant="full"
          isFavorite={isFavorite(store.id)}
          onToggle={onToggleFavorite}
          storeName={store.name}
        />

        <View style={styles.actions}>
          <ActionButton
            icon="call-outline"
            label="Appeler"
            a11yLabel={`Appeler le ${store.phone}`}
            onPress={() => void Linking.openURL(`tel:${store.phone.replace(/\s/g, '')}`)}
          />
          <ActionButton
            icon="navigate-outline"
            label="Itinéraire"
            a11yLabel={`Itinéraire vers ${store.name}`}
            onPress={() => void Linking.openURL(directionsUrl(store))}
          />
        </View>

        <Section title="Adresse">
          <ThemedText selectable>{fullAddress}</ThemedText>
          <ThemedText color="textSecondary" selectable>
            {store.phone}
          </ThemedText>
        </Section>

        <Section title="Horaires">
          <OpeningHoursList hours={store.openingHours} today={toWeekday(now)} />
        </Section>
      </ScrollView>
    </ThemedView>
  );
};

const Section = ({ title, children }: { readonly title: string; readonly children: ReactNode }) => {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <ThemedText variant="subtitle" accessibilityRole="header">
        {title}
      </ThemedText>
      {children}
    </View>
  );
};

interface ActionButtonProps {
  readonly icon: ComponentProps<typeof Ionicons>['name'];
  readonly label: string;
  readonly a11yLabel: string;
  readonly onPress: () => void;
}

const ActionButton = ({ icon, label, a11yLabel, onPress }: ActionButtonProps) => {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      style={({ pressed }) => [
        styles.action,
        { backgroundColor: theme.card, borderColor: theme.border, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Ionicons name={icon} size={20} color={theme.primary} />
      <ThemedText variant="bodyBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    width: '100%',
    alignSelf: 'center',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: { gap: Spacing.xs },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: Spacing.md },
  actions: { flexDirection: 'row', gap: Spacing.md },
  action: {
    flex: 1,
    minHeight: MIN_TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
});
