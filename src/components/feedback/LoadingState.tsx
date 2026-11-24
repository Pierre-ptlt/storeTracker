import { memo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { STORE_CARD_GAP, STORE_CARD_HEIGHT } from '../StoreCard';
import { ThemedText } from '../ThemedText';

export interface LoadingStateProps {
  readonly label?: string;
  readonly skeletonRows?: number;
}

const LoadingStateComponent = ({ label = 'Chargement…', skeletonRows = 0 }: LoadingStateProps) => {
  const theme = useTheme();

  return (
    <View
      testID="loading-state"
      style={styles.container}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}>
      {skeletonRows > 0 ? (
        Array.from({ length: skeletonRows }, (_, i) => (
          <View
            key={i}
            style={[styles.skeleton, { backgroundColor: theme.skeleton, opacity: 1 - i * 0.12 }]}
          />
        ))
      ) : (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText color="textSecondary">{label}</ThemedText>
        </View>
      )}
    </View>
  );
};

export const LoadingState = memo(LoadingStateComponent);

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  skeleton: {
    height: STORE_CARD_HEIGHT,
    marginBottom: STORE_CARD_GAP,
    borderRadius: Radius.md,
  },
});
