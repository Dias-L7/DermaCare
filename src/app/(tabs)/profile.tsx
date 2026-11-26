import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { InfoRow } from '../../components/InfoRow';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { userAvatarIndex } from '../../illustrations/avatars';
import { colors, fonts, spacing } from '../../theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const exit = () => {
    setConfirmOpen(false);
    logout();
    router.replace('/welcome');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
    >
      <StatusBar style="dark" />
      <Text style={styles.title}>{t.profile.title}</Text>
      <View style={styles.avatar}>
        <Avatar preset={userAvatarIndex} size={96} />
        <Text style={styles.name}>{user?.name}</Text>
      </View>
      <InfoRow label={t.profile.email} value={user?.email ?? ''} />
      <InfoRow label={t.profile.phone} value={user?.phone ?? ''} />
      <InfoRow label={t.profile.birth} value={user?.birthDate ?? ''} />
      <View style={styles.language}>
        <Text style={styles.languageLabel}>{t.profile.language}</Text>
        <LanguageSwitch />
      </View>
      <Button title={t.profile.logout} onPress={() => setConfirmOpen(true)} variant="soft" />
      <ConfirmModal
        visible={confirmOpen}
        title={t.profile.logoutTitle}
        message={t.profile.logoutText}
        confirmText={t.profile.logout}
        cancelText={t.common.cancel}
        onConfirm={exit}
        onCancel={() => setConfirmOpen(false)}
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.text,
  },
  avatar: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  name: {
    ...fonts.bold,
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.sm,
  },
  language: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  languageLabel: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
