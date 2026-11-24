import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { ThemedText } from '../ThemedText';
import { PrimaryButton } from './PrimaryButton';

export interface ErrorStateProps {
  readonly message: string;
  readonly onRetry?: () => void;
  readonly title?: string;
}

const ErrorStateComponent = ({ message, onRetry, title = 'Oups…' }: ErrorStateProps) => {
  const theme = useTheme();
  return (
    <View
      testID="error-state"
      style={styles.container}
      accessibilityLiveRegion="assertive">
      <Ionicons name="cloud-offline-outline" size={48} color={theme.danger} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
      <ThemedText variant="subtitle" style={styles.center}>
        {title}
      </ThemedText>
      <ThemedText color="textSecondary" style={styles.center} accessibilityRole="alert">
        {message}
      </ThemedText>
      {onRetry && (
        <PrimaryButton
          testID="retry-button"
          label="Réessayer"
          onPress={onRetry}
          accessibilityHint="Relance le chargement"
        />
      )}
    </View>
  );
};

export const ErrorState = memo(ErrorStateComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  center: { textAlign: 'center' },
});
