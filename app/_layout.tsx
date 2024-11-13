import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <PaperProvider>
          <Stack>
            <Stack.Screen name='(auth)' options={{ headerShown: false }} />
            <Stack.Screen name='(tabs)' options={{ header: () => null }} />
          </Stack>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
