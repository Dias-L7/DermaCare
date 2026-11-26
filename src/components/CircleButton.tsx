import type { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme';

type Props = {
  onPress: () => void;
  children: ReactNode;
  size?: number;
};

export function CircleButton({ onPress, children, size = 38 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: radius.pill },
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
