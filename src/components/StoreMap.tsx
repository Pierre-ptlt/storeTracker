import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';

import { Radius } from '@/constants/theme';
import type { Coordinates } from '@/types/store';

export interface StoreMapProps {
  readonly coordinates: Coordinates;
  readonly title: string;
  readonly description?: string;
  readonly height: number;
}

const DELTA = 0.01;

const StoreMapComponent = ({ coordinates, title, description, height }: StoreMapProps) => {
  const region = useMemo<Region>(
    () => ({ ...coordinates, latitudeDelta: DELTA, longitudeDelta: DELTA }),
    [coordinates],
  );

  return (
    <View
      testID="store-map"
      style={[styles.container, { height }]}
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Carte indiquant l'emplacement de ${title}${description ? `, ${description}` : ''}`}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        importantForAccessibility="no-hide-descendants">
        <Marker coordinate={coordinates} title={title} description={description} />
      </MapView>
    </View>
  );
};

export const StoreMap = memo(StoreMapComponent);

const styles = StyleSheet.create({
  container: { borderRadius: Radius.md, overflow: 'hidden' },
});
