import { fireEvent, render, screen } from '@testing-library/react-native';

import { StoreCard } from '@/components/StoreCard';
import { makeStore } from '@/test/fixtures';

describe('<StoreCard />', () => {
  const store = makeStore();

  const setup = async (props: Partial<{ isFavorite: boolean; isOpen: boolean }> = {}) => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();
    await render(
      <StoreCard
        store={store}
        isFavorite={props.isFavorite ?? false}
        isOpen={props.isOpen ?? true}
        onPress={onPress}
        onToggleFavorite={onToggleFavorite}
      />,
    );
    return { onPress, onToggleFavorite };
  };

  it('displays the store name, category, city and rating', async () => {
    await setup();
    expect(screen.getByText('Librairie du Centre')).toBeOnTheScreen();
    expect(screen.getByText('Librairie · Lyon')).toBeOnTheScreen();
    expect(screen.getByText('4.5')).toBeOnTheScreen();
  });

  it('shows the open/closed status as text (not colour only)', async () => {
    await setup({ isOpen: false });
    expect(screen.getByText('Fermé')).toBeOnTheScreen();
  });

  it('exposes a descriptive accessibility label and calls onPress with the store', async () => {
    const { onPress } = await setup({ isOpen: true });
    const button = screen.getByRole('button', { name: /Librairie du Centre, Librairie, .*ouvert actuellement/ });
    await fireEvent.press(button);
    expect(onPress).toHaveBeenCalledWith(store);
  });

  it('toggles favourite without triggering navigation', async () => {
    const { onPress, onToggleFavorite } = await setup();
    await fireEvent.press(screen.getByRole('button', { name: 'Ajouter Librairie du Centre aux favoris' }));
    expect(onToggleFavorite).toHaveBeenCalledWith(store);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reflects favourite state in the heart button', async () => {
    await setup({ isFavorite: true });
    const heart = screen.getByRole('button', { name: 'Retirer Librairie du Centre des favoris' });
    expect(heart).toBeSelected();
  });
});
