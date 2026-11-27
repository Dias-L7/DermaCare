import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  value: boolean;
  onChange: () => void;
};

export function Toggle({ value, onChange }: Props) {
  return (
    <Pressable
      onPress={onChange}
      hitSlop={8}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    padding: 3,
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  trackOn: {
    backgroundColor: colors.primary,
  },
  trackOff: {
    backgroundColor: colors.surface,
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});
