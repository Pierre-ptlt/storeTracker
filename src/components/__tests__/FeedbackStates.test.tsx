import { fireEvent, render, screen } from '@testing-library/react-native';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ListFooter } from '@/components/feedback/ListFooter';
import { LoadingState } from '@/components/feedback/LoadingState';

describe('<ErrorState />', () => {
  it('renders the message as an alert and retries on press', async () => {
    const onRetry = jest.fn();
    await render(<ErrorState message="Pas de réseau" onRetry={onRetry} />);
    expect(screen.getByRole('alert')).toBeOnTheScreen();
    expect(screen.getByText('Pas de réseau')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('omits the retry button when no handler is given', async () => {
    await render(<ErrorState message="Erreur" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('<EmptyState />', () => {
  it('renders title, message and optional action', async () => {
    const onPress = jest.fn();
    await render(<EmptyState title="Rien" message="Aucun résultat" action={{ label: 'Effacer', onPress }} />);
    expect(screen.getByText('Rien')).toBeOnTheScreen();
    expect(screen.getByText('Aucun résultat')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Effacer' }));
    expect(onPress).toHaveBeenCalled();
  });
});

describe('<LoadingState />', () => {
  it('is announced as busy with a label', async () => {
    await render(<LoadingState label="Chargement des magasins" skeletonRows={3} />);
    const loader = screen.getByLabelText('Chargement des magasins');
    expect(loader).toBeBusy();
  });
});

describe('<ListFooter />', () => {
  const base = { loading: false, error: null, hasMore: true, count: 15, onRetry: jest.fn() };

  it('shows a spinner while loading the next page', async () => {
    await render(<ListFooter {...base} loading />);
    expect(screen.getByTestId('list-footer-loading')).toBeOnTheScreen();
  });

  it('shows an inline error with retry', async () => {
    const onRetry = jest.fn();
    await render(<ListFooter {...base} error="Échec" onRetry={onRetry} />);
    expect(screen.getByText('Échec')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Réessayer de charger la suite' }));
    expect(onRetry).toHaveBeenCalled();
  });

  it('shows an end-of-list marker', async () => {
    await render(<ListFooter {...base} hasMore={false} count={42} />);
    expect(screen.getByText('42 magasins · fin de la liste')).toBeOnTheScreen();
  });
});
