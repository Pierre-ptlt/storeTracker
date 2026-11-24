import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type ThemedViewProps = ViewProps & {
  background?: ThemeColor;
};

export const ThemedView = ({ style, background = 'background', ...rest }: ThemedViewProps) => {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[background] }, style]} {...rest} />;
};
