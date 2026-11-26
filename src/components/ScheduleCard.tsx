import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

export type ScheduleEntry = {
  hour: number;
  title: string;
  subtitle: string;
};

type Props = {
  heading: string;
  hours: number[];
  entries: ScheduleEntry[];
  emptyText: string;
};

export function ScheduleCard({ heading, hours, entries, emptyText }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.heading}>{heading}</Text>
      {entries.length === 0 ? <Text style={styles.empty}>{emptyText}</Text> : null}
      {hours.map((hour) => {
        const entry = entries.find((item) => item.hour === hour);
        return (
          <View key={hour} style={styles.row}>
            <Text style={styles.time}>{hour}:00</Text>
            <View style={styles.slot}>
              {entry ? (
                <View style={styles.bubble}>
                  <View style={styles.bubbleText}>
                    <Text style={styles.title} numberOfLines={1}>
                      {entry.title}
                    </Text>
                    <Text style={styles.subtitle} numberOfLines={2}>
                      {entry.subtitle}
                    </Text>
                  </View>
                  <View style={styles.check}>
                    <Icon name="check" color={colors.white} size={12} />
                  </View>
                </View>
              ) : (
                <View style={styles.line} />
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  heading: {
    ...fonts.semiBold,
    fontSize: 12,
    color: colors.primary,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  empty: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
  },
  time: {
    ...fonts.regular,
    width: 44,
    fontSize: 11,
    color: colors.muted,
  },
  slot: {
    flex: 1,
    justifyContent: 'center',
  },
  line: {
    height: 1,
    backgroundColor: colors.white,
  },
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginVertical: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.md,
  },
  bubbleText: {
    flex: 1,
  },
  title: {
    ...fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
  subtitle: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  check: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});
