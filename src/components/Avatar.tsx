import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAvatarXml } from '../illustrations/avatars';

type Props = {
  preset: number;
  size?: number;
};

export function Avatar({ preset, size = 48 }: Props) {
  const xml = useMemo(() => getAvatarXml(preset), [preset]);

  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
  },
});
