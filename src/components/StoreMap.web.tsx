import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

import type { StoreMapProps } from './StoreMap';
import { ThemedText } from './ThemedText';

const StoreMapWeb = ({ coordinates, title, height }: StoreMapProps) => {
  const theme = useTheme();
  return (
    <View
      testID="store-map"
      style={[styles.container, { height, backgroundColor: theme.skeleton }]}
      accessible
      accessibilityLabel={`Position de ${title}`}>
      <Ionicons name="map-outline" size={40} color={theme.textSecondary} />
      <ThemedText color="textSecondary" variant="caption">
        Carte disponible sur iOS et Android
      </ThemedText>
      <ThemedText color="textSecondary" variant="caption">
        {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
      </ThemedText>
    </View>
  );
};

export const StoreMap = memo(StoreMapWeb);

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
});
