import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchBar } from '@/components/SearchBar';
import { StoreList } from '@/components/StoreList';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListFooter } from '@/components/feedback/ListFooter';
import { LoadingState } from '@/components/feedback/LoadingState';
import { Spacing } from '@/constants/theme';
import { useFavorites } from '@/context/FavoritesContext';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useNow } from '@/hooks/useNow';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useStoreList } from '@/hooks/useStoreList';
import type { Store } from '@/types/store';
import { announceOnIOS } from '@/utils/announce';

export const SEARCH_DEBOUNCE_MS = 300;

export const StoreListScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { status, stores, total, hasMore, error, inlineError, loadMore, refresh, retry } =
    useStoreList(debouncedQuery);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const now = useNow();
  const { horizontalPadding } = useResponsiveLayout();

  const openStore = useCallback(
    (store: Store) => router.push({ pathname: '/store/[id]', params: { id: store.id } }),
    [router],
  );

  const isSearching = query !== debouncedQuery;

  useEffect(() => {
    if (status !== 'idle' || debouncedQuery === '') return;
    announceOnIOS(
      total === 0 ? 'Aucun magasin trouvé' : `${total} magasin${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`,
    );
  }, [status, total, debouncedQuery]);

  const footer = useMemo(
    () => (
      <ListFooter
        loading={status === 'loadingMore'}
        error={inlineError}
        hasMore={hasMore}
        count={stores.length}
        onRetry={retry}
      />
    ),
    [status, inlineError, hasMore, stores.length, retry],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        title="Aucun magasin trouvé"
        message={`Aucun résultat pour « ${debouncedQuery} ». Essayez un autre nom.`}
        action={{ label: 'Voir tous les magasins', onPress: () => setQuery('') }}
      />
    ),
    [debouncedQuery],
  );

  let content;
  if (status === 'loading') {
    content = (
      <View style={[styles.fill, { paddingHorizontal: horizontalPadding, paddingTop: Spacing.md }]}>
        <LoadingState label="Chargement des magasins" skeletonRows={6} />
      </View>
    );
  } else if (status === 'error' && stores.length === 0) {
    content = <ErrorState message={error ?? ''} onRetry={retry} />;
  } else {
    content = (
      <StoreList
        testID="store-list"
        stores={stores}
        favoriteIds={favoriteIds}
        now={now}
        onPressStore={openStore}
        onToggleFavorite={toggleFavorite}
        onEndReached={loadMore}
        refreshing={status === 'refreshing'}
        onRefresh={refresh}
        ListFooterComponent={footer}
        ListEmptyComponent={empty}
      />
    );
  }

  return (
    <ThemedView style={styles.fill}>
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <SearchBar value={query} onChangeText={setQuery} />
        <ThemedText
          variant="caption"
          color="textSecondary"
          accessibilityLiveRegion="polite"
          testID="result-count">
          {isSearching || status === 'loading'
            ? 'Recherche…'
            : `${total} magasin${total > 1 ? 's' : ''}${debouncedQuery ? ` pour « ${debouncedQuery} »` : ''}`}
        </ThemedText>
      </View>
      {content}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: { paddingTop: Spacing.md, gap: Spacing.sm },
});
