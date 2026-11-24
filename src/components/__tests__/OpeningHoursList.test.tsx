import { render, screen, within } from '@testing-library/react-native';

import { OpeningHoursList } from '@/components/OpeningHoursList';
import { WEEKDAY_HOURS } from '@/test/fixtures';

describe('<OpeningHoursList />', () => {
  it('lists the 7 days starting on Monday', async () => {
    await render(<OpeningHoursList hours={WEEKDAY_HOURS} today={3} />);
    const labels = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    labels.forEach((label) => expect(screen.getByText(label)).toBeOnTheScreen());
  });

  it('formats split ranges and closed days', async () => {
    await render(<OpeningHoursList hours={WEEKDAY_HOURS} today={1} />);
    expect(within(screen.getByTestId('hours-row-3')).getByText('9h – 12h30, 14h – 19h')).toBeOnTheScreen();
    expect(within(screen.getByTestId('hours-row-0')).getByText('Fermé')).toBeOnTheScreen();
  });

  it('gives each row a spoken label and flags today', async () => {
    await render(<OpeningHoursList hours={WEEKDAY_HOURS} today={3} />);
    expect(
      screen.getByLabelText("Mercredi, aujourd'hui : de 9h à 12h30, puis de 14h à 19h"),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText('Dimanche : fermé')).toBeOnTheScreen();
  });
});
