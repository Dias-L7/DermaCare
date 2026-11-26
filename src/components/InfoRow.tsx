import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';

type Props = {
  label: string;
  value: string;
};

export function InfoRow({ label, value }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  label: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  value: {
    ...fonts.medium,
    fontSize: 15,
    color: colors.text,
    marginTop: 2,
  },
});
