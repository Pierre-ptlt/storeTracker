import { Colors, type Palette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';

export const useTheme = (): Palette => {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
};
