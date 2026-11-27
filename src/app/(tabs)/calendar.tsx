import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Schedule } from '../../components/Schedule';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <StatusBar style="dark" />
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t.calendar.title}</Text>
        <Pressable onPress={() => router.push('/appointments')} style={styles.allButton}>
          <Icon name="calendar" color={colors.white} size={14} />
          <Text style={styles.allText}>{t.myAppointments.open}</Text>
        </Pressable>
      </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.text,
  },
  allButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  allText: {
    ...fonts.semiBold,
    fontSize: 12,
    color: colors.white,
  },
});