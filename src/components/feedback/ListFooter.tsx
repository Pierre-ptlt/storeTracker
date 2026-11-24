import { memo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { MIN_TOUCH_TARGET, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { ThemedText } from '../ThemedText';

export interface ListFooterProps {
  readonly loading: boolean;
  readonly error: string | null;
  readonly hasMore: boolean;
  readonly count: number;
  readonly onRetry: () => void;
}

const ListFooterComponent = ({ loading, error, hasMore, count, onRetry }: ListFooterProps) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View
        style={styles.container}
        testID="list-footer-loading"
        accessible
        accessibilityLabel="Chargement de la suite"
        accessibilityState={{ busy: true }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container} testID="list-footer-error">
        <ThemedText color="danger" variant="caption" style={styles.center} accessibilityRole="alert">
          {error}
        </ThemedText>
        <Pressable
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Réessayer de charger la suite"
          style={styles.retry}>
          <ThemedText variant="bodyBold" style={{ color: theme.primary }}>
            Réessayer
          </ThemedText>
        </Pressable>
      </View>
    );
  }

  if (!hasMore && count > 0) {
    return (
      <View style={styles.container}>
        <ThemedText variant="caption" color="textSecondary">
          {count} magasin{count > 1 ? 's' : ''} · fin de la liste
        </ThemedText>
      </View>
    );
  }

  return <View style={styles.container} />;
};

export const ListFooter = memo(ListFooterComponent);

const styles = StyleSheet.create({
  container: { minHeight: 64, alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.md },
  center: { textAlign: 'center' },
  retry: { minHeight: MIN_TOUCH_TARGET, justifyContent: 'center', paddingHorizontal: Spacing.lg },
});
