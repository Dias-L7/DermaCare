import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '../../components/AuthScreen';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Field } from '../../components/Field';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import type { ErrorKey } from '../../i18n/types';
import { colors, fonts, spacing } from '../../theme';
import { validateConfirm, validatePassword } from '../../utils/validation';

type Errors = { password?: ErrorKey; confirm?: ErrorKey };

export default function SetPasswordScreen() {
  const { t } = useLanguage();
  const { resetPassword } = useUser();
  const params = useLocalSearchParams<{ identifier?: string }>();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState(false);

  const message = (key: keyof Errors) => {
    const code = errors[key];
    return code ? t.errors[code] : undefined;
  };

  const submit = () => {
    const next: Errors = {
      password: validatePassword(password) ?? undefined,
      confirm: validateConfirm(password, confirm) ?? undefined,
    };
    if (next.password || next.confirm) {
      setErrors(next);
      return;
    }
    const changed = resetPassword(params.identifier ?? '', password);
    if (!changed) {
      setErrors({ password: 'accountNotFound' });
      return;
    }
    setDone(true);
  };

  return (
    <AuthScreen title={t.auth.setPasswordTitle}>
      <Text style={styles.text}>{t.auth.setPasswordText}</Text>
      <Field
        label={t.auth.passwordLabel}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        placeholder={t.auth.passwordPlaceholder}
        secure
        error={message('password')}
      />
      <Field
        label={t.auth.confirmPassword}
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          setErrors((prev) => ({ ...prev, confirm: undefined }));
        }}
        placeholder={t.auth.passwordPlaceholder}
        secure
        error={message('confirm')}
      />
      <View style={styles.button}>
        <Button title={t.auth.createPassword} onPress={submit} />
      </View>
      <ConfirmModal
        visible={done}
        title={t.auth.passwordChanged}
        message={t.auth.passwordChangedText}
        confirmText={t.common.ok}
        onConfirm={() => {
          setDone(false);
          router.back();
        }}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  text: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
});
