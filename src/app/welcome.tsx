import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { Logo } from '../components/Logo';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, spacing } from '../theme';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View
      style={[
        styles.screen,
        { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <StatusBar style="dark" />
      <View style={styles.topRow}>
        <LanguageSwitch />
      </View>
      <View style={styles.center}>
        <Logo tone="dark" size={104} />
      </View>
      <Text style={styles.description}>{t.welcome.description}</Text>
      <View style={styles.buttons}>
        <Button title={t.welcome.login} onPress={() => router.push('/login')} />
        <Button title={t.welcome.register} onPress={() => router.push('/register')} variant="soft" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  topRow: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  buttons: {
    gap: spacing.sm + 2,
  },
});
