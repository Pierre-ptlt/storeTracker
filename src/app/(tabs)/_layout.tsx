import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { useFavorites } from '@/context/FavoritesContext';

const toIconColor = (color: unknown): string | undefined => (typeof color === 'string' ? color : undefined);

const TabsLayout = () => {
  const { favorites } = useFavorites();
  const count = favorites.length;

  return (
    <Tabs screenOptions={{ tabBarLabelStyle: { fontSize: 12, fontWeight: '600' } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Magasins',
          tabBarAccessibilityLabel: 'Liste des magasins',
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'storefront' : 'storefront-outline'} color={toIconColor(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarAccessibilityLabel: `Favoris, ${count} magasin${count > 1 ? 's' : ''}`,
          tabBarBadge: count > 0 ? count : undefined,
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons name={focused ? 'heart' : 'heart-outline'} color={toIconColor(color)} size={size} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
