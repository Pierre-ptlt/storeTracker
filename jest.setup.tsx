import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-maps', () => {
  const { View } = jest.requireActual<typeof import('react-native')>('react-native');
  const MockMapView = (props: object) => <View {...props} />;
  const MockMarker = (props: object) => <View {...props} />;
  return { __esModule: true, default: MockMapView, Marker: MockMarker };
});
