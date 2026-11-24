import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { ThemedText } from '../ThemedText';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  readonly title: string;
  readonly message?: string;
  readonly icon?: ComponentProps<typeof Ionicons>['name'];
  readonly action?: { readonly label: string; readonly onPress: () => void };
}

const EmptyStateComponent = ({ title, message, icon = 'search-outline', action }: EmptyStateProps) => {
  const theme = useTheme();
  return (
    <View testID="empty-state" style={styles.container} accessible={!action} accessibilityLiveRegion="polite">
      <Ionicons name={icon} size={48} color={theme.textSecondary} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
      <ThemedText variant="subtitle" style={styles.center}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText color="textSecondary" style={styles.center}>
          {message}
        </ThemedText>
      ) : null}
      {action && <PrimaryButton label={action.label} onPress={action.onPress} testID="empty-action" />}
    </View>
  );
};

export const EmptyState = memo(EmptyStateComponent);

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
