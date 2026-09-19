import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Counter } from './src/Counter/Counter';
import { colors } from './src/theme';

export function App() {
  return (
    <View style={styles.screen}>
      <Counter initialCount={0} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
