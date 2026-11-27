import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Toggle } from '../components/Toggle';
import { useLanguage } from '../context/LanguageContext';
import { useSettings, type NotificationKey } from '../context/SettingsContext';
import { colors, fonts, spacing } from '../theme';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { notifications, toggleNotification } = useSettings();

  const rows: { key: NotificationKey; label: string }[] = [
    { key: 'general', label: t.account.notifyGeneral },
    { key: 'sound', label: t.account.notifySound },
    { key: 'soundCall', label: t.account.notifySoundCall },
    { key: 'vibrate', label: t.account.notifyVibrate },
    { key: 'offers', label: t.account.notifyOffers },
    { key: 'payments', label: t.account.notifyPayments },
    { key: 'promo', label: t.account.notifyPromo },
    { key: 'cashback', label: t.account.notifyCashback },
  ];

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
    >
      <StatusBar style="dark" />
      <ScreenHeader title={t.account.notificationsTitle} />
      {rows.map((row) => (
        <View key={row.key} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Toggle value={notifications[row.key]} onChange={() => toggleNotification(row.key)} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 4,
  },
  label: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
