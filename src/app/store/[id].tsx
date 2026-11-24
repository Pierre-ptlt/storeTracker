import { useLocalSearchParams } from 'expo-router';

import { StoreDetailScreen } from '@/screens/StoreDetailScreen';

const StoreDetailRoute = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <StoreDetailScreen key={id} id={id} />;
};

export default StoreDetailRoute;
