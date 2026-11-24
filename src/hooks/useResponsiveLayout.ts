import { useWindowDimensions } from 'react-native';

import { MAX_CONTENT_WIDTH, Spacing, TABLET_BREAKPOINT } from '@/constants/theme';

export interface ResponsiveLayout {
  readonly columns: 1 | 2;
  readonly horizontalPadding: number;
  readonly width: number;
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const { width } = useWindowDimensions();
  const columns = width >= TABLET_BREAKPOINT ? 2 : 1;
  const maxWidth = MAX_CONTENT_WIDTH * columns;
  const horizontalPadding = Math.max(Spacing.lg, (width - maxWidth) / 2);
  return { columns, horizontalPadding, width };
};
