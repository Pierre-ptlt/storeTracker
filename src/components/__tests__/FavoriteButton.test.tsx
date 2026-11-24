import { fireEvent, render, screen } from '@testing-library/react-native';

import { FavoriteButton } from '@/components/FavoriteButton';

describe('<FavoriteButton />', () => {
  it('announces the "add" action when not favourite', async () => {
    await render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} storeName="Tech Hub" />);
    const button = screen.getByRole('button', { name: 'Ajouter Tech Hub aux favoris' });
    expect(button).not.toBeSelected();
  });

  it('announces the "remove" action and selected state when favourite', async () => {
    await render(<FavoriteButton isFavorite onToggle={jest.fn()} storeName="Tech Hub" />);
    expect(screen.getByRole('button', { name: 'Retirer Tech Hub des favoris' })).toBeSelected();
  });

  it('calls onToggle when pressed', async () => {
    const onToggle = jest.fn();
    await render(<FavoriteButton isFavorite={false} onToggle={onToggle} storeName="Tech Hub" />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('renders a visible label in the "full" variant', async () => {
    const { rerender } = await render(
      <FavoriteButton variant="full" isFavorite={false} onToggle={jest.fn()} storeName="Tech Hub" />,
    );
    expect(screen.getByText('Ajouter aux favoris')).toBeOnTheScreen();

    await rerender(<FavoriteButton variant="full" isFavorite onToggle={jest.fn()} storeName="Tech Hub" />);
    expect(screen.getByText('Dans vos favoris')).toBeOnTheScreen();
  });
});

describe('<FavoriteButton /> screen reader feedback', () => {
  it('announces the result of the toggle', async () => {
    const { AccessibilityInfo } = jest.requireActual<typeof import('react-native')>('react-native');
    const spy = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);

    const { rerender } = await render(<FavoriteButton isFavorite={false} onToggle={jest.fn()} storeName="Tech Hub" />);
    await fireEvent.press(screen.getByRole('button'));
    expect(spy).toHaveBeenLastCalledWith('Tech Hub ajouté aux favoris');

    await rerender(<FavoriteButton isFavorite onToggle={jest.fn()} storeName="Tech Hub" />);
    await fireEvent.press(screen.getByRole('button'));
    expect(spy).toHaveBeenLastCalledWith('Tech Hub retiré des favoris');
    spy.mockRestore();
  });
});
