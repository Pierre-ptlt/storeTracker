import { memo, useCallback, type ReactElement } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
  type ListRenderItem,
} from 'react-native';

import { Spacing } from '@/constants/theme';
import { useResponsiveLayout } from '@/hooks/useResponsiveLayout';
import { useTheme } from '@/hooks/useTheme';
import type { Store } from '@/types/store';
import { isOpenAt } from '@/utils/openingHours';

import { STORE_CARD_GAP, StoreCard, useStoreRowHeight } from './StoreCard';

export interface StoreListProps {
  readonly stores: readonly Store[];
  readonly favoriteIds: ReadonlySet<string>;
  readonly now: Date;
  readonly onPressStore: (store: Store) => void;
  readonly onToggleFavorite: (store: Store) => void;
  readonly onEndReached?: () => void;
  readonly refreshing?: boolean;
  readonly onRefresh?: () => void;
  readonly ListHeaderComponent?: ReactElement;
  readonly ListFooterComponent?: ReactElement;
  readonly ListEmptyComponent?: ReactElement;
  readonly testID?: string;
}

const keyExtractor = (store: Store): string => store.id;

const StoreListComponent = ({
  stores,
  favoriteIds,
  now,
  onPressStore,
  onToggleFavorite,
  onEndReached,
  refreshing,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  testID,
}: StoreListProps) => {
  const theme = useTheme();
  const { columns, horizontalPadding } = useResponsiveLayout();
  const rowHeight = useStoreRowHeight();

  const getItemLayout = useCallback(
    (_: ArrayLike<Store> | null | undefined, index: number) => ({
      length: rowHeight,
      offset: rowHeight * index,
      index,
    }),
    [rowHeight],
  );

  const renderItem = useCallback<ListRenderItem<Store>>(
    ({ item }) => (
      <View style={columns === 2 ? styles.halfColumn : styles.fullColumn}>
        <StoreCard
          store={item}
          isFavorite={favoriteIds.has(item.id)}
          isOpen={isOpenAt(item.openingHours, now)}
          rowHeight={rowHeight}
          onPress={onPressStore}
          onToggleFavorite={onToggleFavorite}
        />
      </View>
    ),
    [columns, favoriteIds, now, rowHeight, onPressStore, onToggleFavorite],
  );

  return (
    <FlatList
      key={`columns-${columns}`}
      testID={testID}
      data={stores}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      numColumns={columns}
      columnWrapperStyle={columns === 2 ? styles.columnWrapper : undefined}
      extraData={favoriteIds}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews={Platform.OS === 'android'}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing ?? false}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        ) : undefined
      }
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ListEmptyComponent={ListEmptyComponent}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
        stores.length === 0 && styles.emptyContent,
      ]}
      style={{ backgroundColor: theme.background }}
    />
  );
};

export const StoreList = memo(StoreListComponent);

const styles = StyleSheet.create({
  content: { paddingTop: Spacing.md, paddingBottom: Spacing.xl },
  emptyContent: { flexGrow: 1 },
  fullColumn: { marginBottom: STORE_CARD_GAP },
  halfColumn: { width: '50%', paddingHorizontal: STORE_CARD_GAP / 2, marginBottom: STORE_CARD_GAP },
  columnWrapper: { marginHorizontal: -STORE_CARD_GAP / 2 },
});
