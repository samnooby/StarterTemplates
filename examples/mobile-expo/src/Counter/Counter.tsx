import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';
import { useCounter } from './useCounter';

interface CounterProps {
  initialCount: number;
}

export function Counter({ initialCount }: CounterProps) {
  const { count, increment, reset } = useCounter(initialCount);

  return (
    <View style={styles.counter} accessibilityLabel="counter">
      <Text style={styles.count} testID="count">
        Count: {count}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increment"
          style={styles.button}
          onPress={increment}
        >
          <Text style={styles.buttonText}>Increment</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reset"
          style={styles.button}
          onPress={reset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  counter: {
    gap: spacing.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  count: {
    fontSize: 32,
    color: colors.foreground,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius,
    backgroundColor: colors.accent,
  },
  buttonText: {
    color: colors.accentForeground,
  },
});
