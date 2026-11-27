import { Stack } from 'expo-router';
import { ChatProvider } from '../context/ChatContext';
import { DoctorsProvider } from '../context/DoctorsContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { LanguageProvider } from '../context/LanguageContext';
import { SettingsProvider } from '../context/SettingsContext';
import { UserProvider } from '../context/UserContext';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <UserProvider>
        <SettingsProvider>
          <FavoritesProvider>
            <DoctorsProvider>
              <ChatProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.background },
                  }}
                />
              </ChatProvider>
            </DoctorsProvider>
          </FavoritesProvider>
        </SettingsProvider>
      </UserProvider>
    </LanguageProvider>
  );
}