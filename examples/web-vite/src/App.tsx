import { Counter } from './Counter/Counter.tsx';

export function App() {
  return (
    <main>
      <h1>Counter</h1>
      <Counter initialCount={0} />
    </main>
  );
}
