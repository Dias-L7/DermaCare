import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, spacing } from '../theme';
import { CircleButton } from './CircleButton';
import { ConfirmModal } from './ConfirmModal';
import { Icon } from './Icon';

export function SocialRow() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const show = () => setOpen(true);

  return (
    <View style={styles.container}>
      <Text style={styles.caption}>{t.auth.orSignUpWith}</Text>
      <View style={styles.row}>
        <CircleButton onPress={show}>
          <Text style={styles.letter}>G</Text>
        </CircleButton>
        <CircleButton onPress={show}>
          <Text style={styles.letter}>f</Text>
        </CircleButton>
        <CircleButton onPress={show}>
          <Icon name="fingerprint" color={colors.primary} size={20} />
        </CircleButton>
      </View>
      <ConfirmModal
        visible={open}
        title={t.common.imitationTitle}
        message={t.common.imitationText}
        confirmText={t.common.ok}
        onConfirm={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  caption: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  letter: {
    ...fonts.bold,
    fontSize: 16,
    color: colors.primary,
  },
});
