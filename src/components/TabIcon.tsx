import { StyleSheet, View } from 'react-native';
import type { IconName } from '../illustrations/icons';
import { colors, radius } from '../theme';
import { Icon } from './Icon';

type Props = {
  name: IconName;
  focused: boolean;
};

export function TabIcon({ name, focused }: Props) {
  return (
    <View style={[styles.circle, focused && styles.circleActive]}>
      <Icon name={name} color={focused ? colors.primary : colors.white} size={22} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: colors.white,
  },
});
