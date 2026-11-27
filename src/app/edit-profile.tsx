import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { Field } from '../components/Field';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { userAvatarIndex } from '../illustrations/avatars';
import { colors, radius, spacing } from '../theme';
import { formatDateInput, formatPhoneInput } from '../utils/format';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user, updateProfile } = useUser();
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [birth, setBirth] = useState(user?.birthDate ?? '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateProfile({
      name: name.trim() || user?.name || '',
      phone: phone || user?.phone || '',
      email: email.trim() || user?.email || '',
      birthDate: birth || user?.birthDate || '',
    });
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      >
        <ScreenHeader title={t.account.editTitle} />
        <View style={styles.head}>
          <View>
            <Avatar preset={userAvatarIndex} size={96} />
            <View style={styles.editBadge}>
              <Icon name="pencil" color={colors.white} size={13} />
            </View>
          </View>
        </View>

        <Field label={t.account.fullName} value={name} onChangeText={setName} placeholder={t.auth.namePlaceholder} />
        <Field
          label={t.account.phone}
          value={phone}
          onChangeText={(value) => setPhone(formatPhoneInput(value))}
          placeholder="+7 (7XX) XXX-XX-XX"
          keyboardType="phone-pad"
        />
        <Field
          label={t.account.email}
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          keyboardType="email-address"
        />
        <Field
          label={t.account.birth}
          value={birth}
          onChangeText={(value) => setBirth(formatDateInput(value))}
          placeholder={t.account.birthPlaceholder}
          keyboardType="number-pad"
          maxLength={10}
        />

        <View style={styles.button}>
          <Button title={t.account.updateProfile} onPress={save} />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={saved}
        title={t.account.profileSaved}
        message={t.account.profileSavedText}
        confirmText={t.common.ok}
        onConfirm={() => setSaved(false)}
      />
    </KeyboardAvoidingView>
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
    marginVertical: spacing.md,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.white,
  },
  button: {
    marginTop: spacing.md,
  },
});
