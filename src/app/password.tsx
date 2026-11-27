import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { ConfirmModal } from '../components/ConfirmModal';
import { Field } from '../components/Field';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { colors, fonts, spacing } from '../theme';

type Errors = { current?: string; next?: string; confirm?: string };

export default function PasswordScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user, changePassword } = useUser();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const submit = () => {
    const found: Errors = {};
    if (next.length < 6) found.next = t.errors.passwordShort;
    if (next !== confirm) found.confirm = t.errors.passwordMismatch;
    if (found.next || found.confirm) {
      setErrors(found);
      return;
    }
    if (!changePassword(current, next)) {
      setErrors({ current: t.account.wrongCurrent });
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    setDone(true);
  };

  const forgot = () => {
    router.push({ pathname: '/set-password', params: { identifier: user?.email ?? '' } });
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
      >
        <ScreenHeader title={t.account.passwordTitle} />
        <Field
          label={t.account.currentPassword}
          value={current}
          onChangeText={(value) => {
            setCurrent(value);
            setErrors((prev) => ({ ...prev, current: undefined }));
          }}
          placeholder={t.auth.passwordPlaceholder}
          secure
          error={errors.current}
        />
        <Pressable onPress={forgot} style={styles.forgot}>
          <Text style={styles.forgotText}>{t.account.forgotPassword}</Text>
        </Pressable>
        <Field
          label={t.account.newPassword}
          value={next}
          onChangeText={(value) => {
            setNext(value);
            setErrors((prev) => ({ ...prev, next: undefined }));
          }}
          placeholder={t.auth.passwordPlaceholder}
          secure
          error={errors.next}
        />
        <Field
          label={t.account.confirmPassword}
          value={confirm}
          onChangeText={(value) => {
            setConfirm(value);
            setErrors((prev) => ({ ...prev, confirm: undefined }));
          }}
          placeholder={t.auth.passwordPlaceholder}
          secure
          error={errors.confirm}
        />
        <View style={styles.button}>
          <Button title={t.account.changePassword} onPress={submit} />
        </View>
      </ScrollView>
      <ConfirmModal
        visible={done}
        title={t.account.passwordChanged}
        message={t.account.passwordChangedText}
        confirmText={t.common.ok}
        onConfirm={() => {
          setDone(false);
          router.back();
        }}
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
  forgot: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  forgotText: {
    ...fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
  },
  button: {
    marginTop: spacing.xl,
  },
});
