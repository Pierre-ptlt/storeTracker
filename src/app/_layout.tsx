import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';

import { Colors } from '@/constants/theme';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { useColorScheme } from '@/hooks/useColorScheme';

const RootLayout = () => {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const navigationTheme = useMemo<Theme>(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const palette = Colors[scheme];
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        card: palette.card,
        text: palette.text,
        border: palette.border,
      },
    };
  }, [scheme]);

  return (
    <ThemeProvider value={navigationTheme}>
      <FavoritesProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Magasins' }} />
          <Stack.Screen name="store/[id]" options={{ title: 'Magasin' }} />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
