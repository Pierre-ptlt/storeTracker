import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { StoreList } from '@/components/StoreList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useNow } from '@/hooks/useNow';
import type { Store } from '@/types/store';

export const FavoritesScreen = () => {
  const router = useRouter();
  const { status, favorites, favoriteIds, toggleFavorite } = useFavorites();
  const now = useNow();

  const openStore = useCallback(
    (store: Store) => router.push({ pathname: '/store/[id]', params: { id: store.id } }),
    [router],
  );

  const header = useMemo(
    () =>
      status === 'error' ? (
        <View style={styles.banner}>
          <ThemedText variant="caption" color="danger" accessibilityRole="alert">
            Vos favoris enregistrés n’ont pas pu être relus. Les nouveaux favoris seront sauvegardés.
          </ThemedText>
        </View>
      ) : undefined,
    [status],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        icon="heart-outline"
        title="Aucun favori pour l'instant"
        message="Touchez le cœur d'un magasin pour le retrouver ici, même hors ligne."
        action={{ label: 'Parcourir les magasins', onPress: () => router.navigate('/') }}
      />
    ),
    [router],
  );

  if (status === 'loading') {
    return (
      <ThemedView style={styles.fill}>
        <LoadingState label="Chargement des favoris" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <StoreList
        testID="favorites-list"
        stores={favorites}
        favoriteIds={favoriteIds}
        now={now}
        onPressStore={openStore}
        onToggleFavorite={toggleFavorite}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  banner: { paddingBottom: Spacing.md },
});
