import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage, type Language } from '../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../theme';

const options: { code: Language; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'kk', label: 'ҚАЗ' },
];

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = option.code === language;
        return (
          <Pressable
            key={option.code}
            onPress={() => setLanguage(option.code)}
            style={[styles.item, active && styles.itemActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
  },
  item: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm - 2,
    borderRadius: radius.pill,
  },
  itemActive: {
    backgroundColor: colors.primary,
  },
  label: {
    ...fonts.semiBold,
    fontSize: 13,
    color: colors.primary,
  },
  labelActive: {
    color: colors.white,
  },
});
