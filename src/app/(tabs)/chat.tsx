import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../../components/EmptyState';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, spacing } from '../../theme';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + spacing.md }]}>
      <StatusBar style="dark" />
      <Text style={styles.title}>{t.chat.title}</Text>
      <View style={styles.center}>
        <EmptyState icon="chat" title={t.chat.emptyTitle} text={t.chat.emptyText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    ...fonts.bold,
    fontSize: 22,
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
  },
});
