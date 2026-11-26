import { StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';
import { Button } from './Button';
import { Icon } from './Icon';

type Props = {
  icon: IconName;
  title: string;
  text: string;
  actionTitle?: string;
  onAction?: () => void;
};

export function EmptyState({ icon, title, text, actionTitle, onAction }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={icon} color={colors.primary} size={28} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
      {actionTitle && onAction ? (
        <View style={styles.action}>
          <Button title={actionTitle} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...fonts.bold,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  action: {
    marginTop: spacing.md,
  },
});
