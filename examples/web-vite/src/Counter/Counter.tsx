import styles from './Counter.module.css';
import { useCounter } from './useCounter.ts';

interface CounterProps {
  initialCount: number;
}

export function Counter({ initialCount }: CounterProps) {
  const { count, increment, reset } = useCounter(initialCount);

  return (
    <section className={styles.counter} aria-label="counter">
      <p className={styles.count}>Count: {count}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={increment}>
          Increment
        </button>
        <button type="button" className={styles.button} onClick={reset}>
          Reset
        </button>
      </div>
    </section>
  );
}
