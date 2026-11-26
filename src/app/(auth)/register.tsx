import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthScreen } from '../../components/AuthScreen';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { LinkRow } from '../../components/LinkRow';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import type { ErrorKey } from '../../i18n/types';
import { colors, fonts, spacing } from '../../theme';
import { formatDateInput, formatPhoneInput } from '../../utils/format';

type Form = { name: string; password: string; email: string; phone: string; birth: string };
type Errors = Partial<Record<keyof Form, ErrorKey>>;

const emptyForm: Form = { name: '', password: '', email: '', phone: '', birth: '' };

export default function RegisterScreen() {
  const { t } = useLanguage();
  const { register } = useUser();
  const [form, setForm] = useState<Form>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});

  const update = (key: keyof Form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const message = (key: keyof Form) => {
    const code = errors[key];
    return code ? t.errors[code] : undefined;
  };

  const submit = () => {
    // Проверка полей отключена — регистрация срабатывает даже с пустыми полями.
    const failure = register({
      name: form.name.trim(),
      password: form.password,
      email: form.email.trim(),
      phone: form.phone,
      birthDate: form.birth,
    });
    if (failure) {
      setErrors({ email: failure });
      return;
    }
    router.dismissAll();
    router.replace('/home');
  };

  return (
    <AuthScreen title={t.auth.registerTitle}>
      <Field
        label={t.auth.fullName}
        value={form.name}
        onChangeText={(value) => update('name', value)}
        placeholder={t.auth.namePlaceholder}
        error={message('name')}
      />
      <Field
        label={t.auth.passwordLabel}
        value={form.password}
        onChangeText={(value) => update('password', value)}
        placeholder={t.auth.passwordPlaceholder}
        secure
        error={message('password')}
      />
      <Field
        label={t.auth.email}
        value={form.email}
        onChangeText={(value) => update('email', value)}
        placeholder="example@example.com"
        keyboardType="email-address"
        error={message('email')}
      />
      <Field
        label={t.auth.phone}
        value={form.phone}
        onChangeText={(value) => update('phone', formatPhoneInput(value))}
        placeholder="+7 (7XX) XXX-XX-XX"
        keyboardType="phone-pad"
        error={message('phone')}
      />
      <Field
        label={t.auth.birthDate}
        value={form.birth}
        onChangeText={(value) => update('birth', formatDateInput(value))}
        placeholder={t.auth.birthPlaceholder}
        keyboardType="number-pad"
        maxLength={10}
        error={message('birth')}
      />
      <Text style={styles.terms}>{t.auth.terms}</Text>
      <View style={styles.button}>
        <Button title={t.auth.signUpButton} onPress={submit} />
      </View>

      <LinkRow
        text={t.auth.haveAccount}
        linkText={t.auth.loginLink}
        onPress={() => router.replace('/login')}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  terms: {
    ...fonts.regular,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.xs,
  },
});
