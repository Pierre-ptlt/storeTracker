import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { ThemedText } from '../ThemedText';

export interface PrimaryButtonProps {
  readonly label: string;
  readonly onPress: () => void;
  readonly accessibilityHint?: string;
  readonly testID?: string;
}

const PrimaryButtonComponent = ({ label, onPress, accessibilityHint, testID }: PrimaryButtonProps) => {
  const theme = useTheme();
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.primary, opacity: pressed ? 0.75 : 1 },
      ]}>
      <ThemedText variant="bodyBold" style={{ color: theme.onPrimary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
};

export const PrimaryButton = memo(PrimaryButtonComponent);

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
