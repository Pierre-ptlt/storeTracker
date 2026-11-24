import { fireEvent, render, screen } from '@testing-library/react-native';

import { SearchBar } from '@/components/SearchBar';

describe('<SearchBar />', () => {
  it('forwards typed text', async () => {
    const onChangeText = jest.fn();
    await render(<SearchBar value="" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('Rechercher un magasin par nom'), 'lib');
    expect(onChangeText).toHaveBeenCalledWith('lib');
  });

  it('hides the clear button when empty', async () => {
    await render(<SearchBar value="" onChangeText={jest.fn()} />);
    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).toBeNull();
  });

  it('clears the query with the clear button', async () => {
    const onChangeText = jest.fn();
    await render(<SearchBar value="lib" onChangeText={onChangeText} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Effacer la recherche' }));
    expect(onChangeText).toHaveBeenCalledWith('');
  });
});
