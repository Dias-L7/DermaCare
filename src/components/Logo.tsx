import { StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useLanguage } from '../context/LanguageContext';
import { getLogoXml } from '../illustrations/logo';
import { colors, fonts, spacing } from '../theme';

type Props = {
  tone?: 'light' | 'dark';
  size?: number;
};

export function Logo({ tone = 'dark', size = 96 }: Props) {
  const { t } = useLanguage();
  const light = tone === 'light';
  const mainColor = light ? colors.white : colors.primary;
  const cutColor = light ? colors.primary : colors.white;

  return (
    <View style={styles.container}>
      <SvgXml xml={getLogoXml(mainColor, cutColor)} width={size} height={size} />
      <Text style={[styles.name, { color: mainColor }]}>{t.app.name}</Text>
      <Text style={[styles.tagline, { color: mainColor }]}>{t.app.tagline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  name: {
    ...fonts.regular,
    fontSize: 32,
    letterSpacing: 1,
    marginTop: spacing.md,
  },
  tagline: {
    ...fonts.semiBold,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});
