import { Stack, useRouter } from 'expo-router';

import { ThemedView } from '@/components/ThemedView';
import { EmptyState } from '@/components/feedback/EmptyState';

const NotFoundScreen = () => {
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <EmptyState
        icon="compass-outline"
        title="Cette page n'existe pas"
        action={{ label: "Retour à l'accueil", onPress: () => router.replace('/') }}
      />
    </ThemedView>
  );
};

export default NotFoundScreen;
