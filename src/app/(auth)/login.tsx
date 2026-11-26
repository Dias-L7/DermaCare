import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { AuthScreen } from '../../components/AuthScreen';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { LinkRow } from '../../components/LinkRow';
import { SocialRow } from '../../components/SocialRow';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import type { ErrorKey } from '../../i18n/types';
import { colors, fonts, spacing } from '../../theme';
import { validateIdentifier } from '../../utils/validation';

type Errors = { identifier?: ErrorKey; password?: ErrorKey };

export default function LoginScreen() {
  const { t } = useLanguage();
  const { login, hasAccount } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const message = (key: keyof Errors) => {
    const code = errors[key];
    return code ? t.errors[code] : undefined;
  };

  const submit = () => {
    // Проверка полей отключена — вход срабатывает даже с пустыми полями.
    const failure = login(identifier, password);
    if (failure) {
      setErrors({ password: failure });
      return;
    }
    router.dismissAll();
    router.replace('/home');
  };

  const forgot = () => {
    const problem = validateIdentifier(identifier);
    if (problem) {
      setErrors({ identifier: problem });
      return;
    }
    if (!hasAccount(identifier)) {
      setErrors({ identifier: 'accountNotFound' });
      return;
    }
    router.push({ pathname: '/set-password', params: { identifier } });
  };

  return (
    <AuthScreen title={t.auth.loginTitle}>
      <Text style={styles.heading}>{t.auth.welcomeTitle}</Text>
      <Text style={styles.text}>{t.auth.welcomeText}</Text>
      <Field
        label={t.auth.identifierLabel}
        value={identifier}
        onChangeText={(value) => {
          setIdentifier(value);
          setErrors((prev) => ({ ...prev, identifier: undefined }));
        }}
        placeholder={t.auth.identifierPlaceholder}
        keyboardType="email-address"
        error={message('identifier')}
      />
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
      <Pressable onPress={forgot} style={styles.forgot}>
        <Text style={styles.forgotText}>{t.auth.forgot}</Text>
      </Pressable>
      <View style={styles.button}>
        <Button title={t.auth.loginButton} onPress={submit} />
      </View>
      <SocialRow />
      <LinkRow
        text={t.auth.noAccount}
        linkText={t.auth.signUpLink}
        onPress={() => router.replace('/register')}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...fonts.bold,
    fontSize: 20,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  text: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    marginBottom: spacing.lg,
  },
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotText: {
    ...fonts.bold,
    fontSize: 12,
    color: colors.primary,
  },
  button: {
    marginTop: spacing.xs,
  },
});
