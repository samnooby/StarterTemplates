import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Counter } from './Counter.tsx';

describe('Counter', () => {
  it('shows the initial count', () => {
    render(<Counter initialCount={3} />);

    expect(screen.getByText('Count: 3')).toBeInTheDocument();
  });

  it('increments when the increment button is pressed', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={0} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('returns to the initial count on reset', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={2} />);

    await user.click(screen.getByRole('button', { name: 'Increment' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });
});
