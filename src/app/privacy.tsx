import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, spacing } from '../theme';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
    >
      <StatusBar style="dark" />
      <ScreenHeader title={t.account.privacyTitle} />
      <Text style={styles.updated}>{t.account.privacyUpdated}</Text>
      <Text style={styles.text}>{t.account.privacyIntro}</Text>
      <Text style={styles.heading}>{t.account.termsTitle}</Text>
      {t.account.terms.map((item, index) => (
        <View key={item} style={styles.item}>
          <Text style={styles.number}>{index + 1}.</Text>
          <Text style={[styles.text, styles.itemText]}>{item}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  updated: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  heading: {
    ...fonts.bold,
    fontSize: 17,
    color: colors.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
  item: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  number: {
    ...fonts.bold,
    fontSize: 13,
    lineHeight: 20,
    color: colors.primary,
  },
  itemText: {
    flex: 1,
  },
});
