import { StyleSheet, Text, type TextProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextVariant = 'title' | 'subtitle' | 'body' | 'bodyBold' | 'caption';

export type ThemedTextProps = TextProps & {
  variant?: ThemedTextVariant;
  color?: ThemeColor;
};

export const ThemedText = ({ style, variant = 'body', color = 'text', ...rest }: ThemedTextProps) => {
  const theme = useTheme();
  return (
    <Text
      maxFontSizeMultiplier={2}
      style={[{ color: theme[color] }, styles[variant], style]}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  subtitle: { fontSize: 18, lineHeight: 24, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  bodyBold: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
});
