import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { BottomSheet } from '../../components/BottomSheet';
import { Icon } from '../../components/Icon';
import { LanguageSwitch } from '../../components/LanguageSwitch';
import { MenuRow } from '../../components/MenuRow';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { userAvatarIndex } from '../../illustrations/avatars';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const exit = () => {
    setLogoutOpen(false);
    logout();
    router.replace('/welcome');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
        <ScreenHeader title={t.account.myProfile} onBack={() => router.navigate('/home')} />

        <View style={styles.head}>
          <View>
            <Avatar preset={userAvatarIndex} size={104} />
            <View style={styles.editBadge}>
              <Icon name="pencil" color={colors.white} size={14} />
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
        </View>

        <MenuRow icon="user" label={t.account.menuProfile} onPress={() => router.push('/edit-profile')} />
        <MenuRow icon="heart" label={t.account.menuFavorite} onPress={() => router.push('/favorites')} />
        <MenuRow icon="calendar" label={t.myAppointments.title} onPress={() => router.push('/appointments')} />
        <MenuRow icon="card" label={t.account.menuPayment} onPress={() => router.push('/payment-method')} />        <MenuRow icon="lock" label={t.account.menuPrivacy} onPress={() => router.push('/privacy')} />
        <MenuRow icon="settings" label={t.account.menuSettings} onPress={() => router.push('/settings')} />
        <MenuRow icon="help" label={t.account.menuHelp} onPress={() => router.push('/help')} />
        <MenuRow icon="logout" label={t.account.menuLogout} onPress={() => setLogoutOpen(true)} arrow={false} />

        <View style={styles.language}>
          <Text style={styles.languageLabel}>{t.profile.language}</Text>
          <LanguageSwitch />
        </View>
      </ScrollView>

      <BottomSheet
        visible={logoutOpen}
        title={t.account.menuLogout}
        message={t.account.logoutQuestion}
        cancelText={t.common.cancel}
        confirmText={t.account.logoutYes}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={exit}
      />
    </View>
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
  head: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  editBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.white,
  },
  name: {
    ...fonts.bold,
    fontSize: 20,
    color: colors.text,
    marginTop: spacing.sm,
  },
  language: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  languageLabel: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
