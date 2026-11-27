import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
  icon: IconName;
  label: string;
  onPress: () => void;
  /** Показать стрелку справа (по умолчанию да) */
  arrow?: boolean;
};

export function MenuRow({ icon, label, onPress, arrow = true }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.iconBox}>
        <Icon name={icon} color={colors.primary} size={20} />
      </View>
      <Text style={styles.label}>{label}</Text>
      {arrow ? <Icon name="chevronRight" color={colors.primary} size={18} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  pressed: {
    opacity: 0.6,
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  label: {
    flex: 1,
    ...fonts.medium,
    fontSize: 15,
    color: colors.text,
  },
});
