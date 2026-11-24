import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

import type { StoreCategory } from '@/types/store';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface CategoryMeta {
  readonly label: string;
  readonly icon: IoniconName;
}

export const CATEGORY_META: Readonly<Record<StoreCategory, CategoryMeta>> = {
  grocery: { label: 'Alimentation', icon: 'basket-outline' },
  electronics: { label: 'High-tech', icon: 'hardware-chip-outline' },
  fashion: { label: 'Mode', icon: 'shirt-outline' },
  books: { label: 'Librairie', icon: 'book-outline' },
  sports: { label: 'Sport', icon: 'bicycle-outline' },
  home: { label: 'Maison', icon: 'home-outline' },
};
