import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { OpeningHours, Weekday } from '@/types/store';
import {
  WEEK_DISPLAY_ORDER,
  WEEKDAY_LABELS,
  formatRanges,
  formatRangesForA11y,
} from '@/utils/openingHours';

import { ThemedText } from './ThemedText';

export interface OpeningHoursListProps {
  readonly hours: OpeningHours;
  readonly today: Weekday;
}

const OpeningHoursListComponent = ({ hours, today }: OpeningHoursListProps) => {
  const theme = useTheme();

  return (
    <View accessibilityRole="list" accessibilityLabel="Horaires d'ouverture">
      {WEEK_DISPLAY_ORDER.map((day) => {
        const isToday = day === today;
        const ranges = hours[day];
        const closed = ranges.length === 0;
        return (
          <View
            key={day}
            testID={`hours-row-${day}`}
            accessible
            accessibilityLabel={`${WEEKDAY_LABELS[day]}${isToday ? ", aujourd'hui" : ''} : ${formatRangesForA11y(ranges)}`}
            style={[styles.row, isToday && { backgroundColor: theme.background }]}>
            <ThemedText variant={isToday ? 'bodyBold' : 'body'} style={styles.day}>
              {WEEKDAY_LABELS[day]}
            </ThemedText>
            <ThemedText
              variant={isToday ? 'bodyBold' : 'body'}
              color={closed ? 'danger' : 'text'}
              style={styles.ranges}>
              {formatRanges(ranges)}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
};

export const OpeningHoursList = memo(OpeningHoursListComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.sm,
    columnGap: Spacing.md,
  },
  day: { minWidth: 96 },
  ranges: { flexShrink: 1, textAlign: 'right' },
});
