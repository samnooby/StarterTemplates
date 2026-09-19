import { useState } from 'react';

export interface CounterState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export function useCounter(initialCount: number): CounterState {
  const [count, setCount] = useState(initialCount);

  function increment(): void {
    setCount((current) => current + 1);
  }

  function reset(): void {
    setCount(initialCount);
  }

  return { count, increment, reset };
}
