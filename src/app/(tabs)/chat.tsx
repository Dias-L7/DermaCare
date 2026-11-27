import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { useChat } from '../../context/ChatContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ChatListScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { doctors } = useDoctors();
  const { messages, typing } = useChat();

  // Сначала врачи, с которыми уже есть переписка
  const sorted = [...doctors].sort(
    (a, b) => (messages[b.id]?.length ?? 0) - (messages[a.id]?.length ?? 0)
  );

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>{t.chat.title}</Text>
        <Text style={styles.subtitle}>{t.chat.subtitle}</Text>
        {sorted.map((doctor) => {
          const list = messages[doctor.id] ?? [];
          const last = list[list.length - 1];
          const isTyping = typing.includes(doctor.id);
          const preview = isTyping
            ? t.chat.typing
            : last
              ? `${last.from === 'me' ? `${t.chat.you}: ` : ''}${last.text}`
              : t.specialties[doctor.specialty];
          return (
            <Pressable
              key={doctor.id}
              onPress={() => router.push({ pathname: '/conversation/[id]', params: { id: doctor.id } })}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <Avatar preset={doctor.avatar} uri={doctor.photo} size={52} />
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1}>
                  {t.home.doctorPrefix} {doctor.name}
                </Text>
                <Text style={[styles.preview, (isTyping || !!last) && styles.previewActive]} numberOfLines={1}>
                  {preview}
                </Text>
              </View>
              {last ? <Text style={styles.time}>{last.time}</Text> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
  title: { ...fonts.bold, fontSize: 22, color: colors.text },
  subtitle: { ...fonts.regular, fontSize: 13, color: colors.muted, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 4,
    padding: spacing.sm + 2,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
  },
  pressed: { opacity: 0.7 },
  body: { flex: 1 },
  name: { ...fonts.bold, fontSize: 15, color: colors.primary },
  preview: { ...fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  previewActive: { color: colors.text },
  time: { ...fonts.medium, fontSize: 11, color: colors.muted },
});