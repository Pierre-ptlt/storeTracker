import { AccessibilityInfo, Platform } from 'react-native';

export const announce = (message: string): void => {
  AccessibilityInfo.announceForAccessibility(message);
};

export const announceOnIOS = (message: string): void => {
  if (Platform.OS === 'ios') announce(message);
};
