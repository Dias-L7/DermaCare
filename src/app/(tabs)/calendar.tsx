import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Schedule } from '../../components/Schedule';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, spacing } from '../../theme';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <StatusBar style="dark" />
      <Text style={styles.title}>{t.calendar.title}</Text>
      <Schedule />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  title: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.text,
  },
});
