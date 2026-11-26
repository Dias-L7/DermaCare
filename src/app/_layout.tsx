import { Stack } from 'expo-router';
import { DoctorsProvider } from '../context/DoctorsContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { LanguageProvider } from '../context/LanguageContext';
import { UserProvider } from '../context/UserContext';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <UserProvider>
        <FavoritesProvider>
          <DoctorsProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
              }}
            />
          </DoctorsProvider>
        </FavoritesProvider>
      </UserProvider>
    </LanguageProvider>
  );
}
