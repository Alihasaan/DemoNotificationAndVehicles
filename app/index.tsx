import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

export default function Index() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View
        style={colorScheme === 'dark' ? styles.containerDark : styles.container}
      >
        <Text style={colorScheme === 'dark' ? styles.textDark : styles.text}>
          Edit app/index.tsx to edit this screen.
        </Text>
        <Link
          href='/home'
          style={colorScheme === 'dark' ? styles.linkDark : styles.link}
        >
          Go to Home
        </Link>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  containerDark: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F2937',
  },
  text: {
    fontSize: 24, // equivalent to text-3xl
  },
  textDark: {
    fontSize: 24,
    color: '#FFFFFF', // equivalent to text-3xl
  },
  link: {
    color: 'blue',
  },
  linkDark: {
    color: '#03bafc',
  },
});
