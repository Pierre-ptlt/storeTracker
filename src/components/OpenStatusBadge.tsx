import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import { ThemedText } from './ThemedText';

const OpenStatusBadgeComponent = ({ isOpen }: { readonly isOpen: boolean }) => {
  const theme = useTheme();
  const color = isOpen ? theme.success : theme.danger;

  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText variant="caption" style={{ color, fontWeight: '600' }}>
        {isOpen ? 'Ouvert' : 'Fermé'}
      </ThemedText>
    </View>
  );
};

export const OpenStatusBadge = memo(OpenStatusBadgeComponent);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
