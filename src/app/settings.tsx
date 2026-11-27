import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheet } from '../components/BottomSheet';
import { MenuRow } from '../components/MenuRow';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { colors, spacing } from '../theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { deleteAccount } = useUser();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const remove = () => {
    setDeleteOpen(false);
    deleteAccount();
    router.replace('/welcome');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
    >
      <StatusBar style="dark" />
      <ScreenHeader title={t.account.settingsTitle} />
      <MenuRow icon="bell" label={t.account.notificationSetting} onPress={() => router.push('/notifications')} />
      <MenuRow icon="key" label={t.account.passwordManager} onPress={() => router.push('/password')} />
      <MenuRow icon="trash" label={t.account.deleteAccount} onPress={() => setDeleteOpen(true)} />
      <BottomSheet
        visible={deleteOpen}
        title={t.account.deleteQuestion}
        message={t.account.deleteText}
        cancelText={t.common.cancel}
        confirmText={t.account.deleteYes}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={remove}
      />
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
});
