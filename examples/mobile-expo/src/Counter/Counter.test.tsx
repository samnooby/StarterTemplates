import { fireEvent, render, screen } from '@testing-library/react-native';
import { Counter } from './Counter';

describe('Counter', () => {
  it('shows the initial count', () => {
    render(<Counter initialCount={3} />);

    expect(screen.getByText('Count: 3')).toBeTruthy();
  });

  it('increments when the increment button is pressed', () => {
    render(<Counter initialCount={0} />);

    fireEvent.press(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByText('Count: 1')).toBeTruthy();
  });

  it('returns to the initial count on reset', () => {
    render(<Counter initialCount={2} />);

    fireEvent.press(screen.getByRole('button', { name: 'Increment' }));
    fireEvent.press(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByText('Count: 2')).toBeTruthy();
  });
});
