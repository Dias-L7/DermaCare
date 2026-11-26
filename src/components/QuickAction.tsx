import { Pressable, StyleSheet, Text } from 'react-native';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
  icon: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
};

export function QuickAction({ icon, label, active, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Icon name={icon} color={active ? colors.primary : colors.text} size={22} filled={false} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 56,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  label: {
    ...fonts.medium,
    fontSize: 11,
    color: colors.text,
    marginTop: 2,
  },
  labelActive: {
    color: colors.primary,
  },
});
