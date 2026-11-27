import { useMemo, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { getAvatarXml } from '../illustrations/avatars';

type Props = {
  preset: number;
  size?: number;
  /** Ссылка на фото. Если её нет или фото не загрузилось — показывается SVG-аватар. */
  uri?: string;
};

export function Avatar({ preset, size = 48, uri }: Props) {
  const xml = useMemo(() => getAvatarXml(preset), [preset]);
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size, borderRadius: size / 2 };

  return (
    <View style={[styles.circle, box]}>
      {uri && !failed ? (
        <Image source={{ uri }} style={box} resizeMode="cover" onError={() => setFailed(true)} />
      ) : (
        <SvgXml xml={xml} width={size} height={size} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    overflow: 'hidden',
    backgroundColor: '#E4E9FF',
  },
});
