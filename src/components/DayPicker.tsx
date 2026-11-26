import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

export type DayPickerItem = {
  offset: number;
  weekday: string;
  number: number;
  marked: boolean;
};

type Props = {
  days: DayPickerItem[];
  selected: number;
  onSelect: (offset: number) => void;
};

export function DayPicker({ days, selected, onSelect }: Props) {
  return (
    <View style={styles.row}>
      {days.map((day) => {
        const isSelected = day.offset === selected;
        return (
          <Pressable
            key={day.offset}
            onPress={() => onSelect(day.offset)}
            style={[
              styles.pill,
              day.marked ? styles.pillMarked : styles.pillPlain,
              isSelected && styles.pillSelected,
            ]}
          >
            <Text style={[styles.weekday, day.marked && styles.textMarked]}>{day.weekday}</Text>
            <Text style={[styles.number, day.marked && styles.textMarked]}>{day.number}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  pillPlain: {
    backgroundColor: colors.white,
  },
  pillMarked: {
    backgroundColor: colors.primary,
  },
  pillSelected: {
    borderColor: colors.text,
  },
  weekday: {
    ...fonts.regular,
    fontSize: 10,
    color: colors.muted,
  },
  number: {
    ...fonts.bold,
    fontSize: 17,
    color: colors.text,
  },
  textMarked: {
    color: colors.white,
  },
});
