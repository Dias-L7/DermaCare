import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    type ScrollViewInstance,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Icon } from '../../components/Icon';
import { useChat } from '../../context/ChatContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ConversationScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { doctors } = useDoctors();
    const { messages, typing, send } = useChat();
    const [text, setText] = useState('');
    const scroll = useRef<ScrollViewInstance>(null);

    const doctor = doctors.find((item) => item.id === id);
    const list = messages[id] ?? [];
    const isTyping = typing.includes(id);

    const back = () => (router.canGoBack() ? router.back() : router.navigate('/chat'));

    const submit = () => {
        const value = text.trim();
        if (!value || !doctor) return;
        const answered = list.filter((message) => message.from === 'doctor').length;
        send(doctor.id, value, t.chat.replies[answered % t.chat.replies.length]);
        setText('');
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="light" />
            <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                <Pressable onPress={back} hitSlop={10}>
                    <Icon name="back" color={colors.white} size={24} />
                </Pressable>
                {doctor ? <Avatar preset={doctor.avatar} uri={doctor.photo} size={38} /> : null}
                <View style={styles.headerText}>
                    <Text style={styles.headerName} numberOfLines={1}>
                        {doctor ? `${t.home.doctorPrefix} ${doctor.name}` : ''}
                    </Text>
                    <Text style={styles.headerStatus}>{isTyping ? t.chat.typing : t.chat.online}</Text>
                </View>
            </View>

            <ScrollView
                ref={scroll}
                contentContainerStyle={styles.messages}
                onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
            >
                <View style={[styles.bubble, styles.doctorBubble]}>
                    <Text style={styles.bubbleText}>{t.chat.greeting}</Text>
                </View>
                {list.map((message) => {
                    const mine = message.from === 'me';
                    return (
                        <View key={message.id} style={mine ? styles.rightWrap : styles.leftWrap}>
                            <View style={[styles.bubble, mine ? styles.myBubble : styles.doctorBubble]}>
                                <Text style={styles.bubbleText}>{message.text}</Text>
                            </View>
                            <Text style={[styles.time, mine && styles.timeRight]}>{message.time}</Text>
                        </View>
                    );
                })}
                {isTyping && doctor ? (
                    <Text style={styles.typing}>
                        {t.home.doctorPrefix} {doctor.name} {t.chat.typing}
                    </Text>
                ) : null}
            </ScrollView>

            <View style={[styles.inputBar, { paddingBottom: insets.bottom + spacing.sm }]}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={t.chat.placeholder}
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                    onSubmitEditing={submit}
                    returnKeyType="send"
                />
                <Pressable onPress={submit} style={[styles.sendButton, !text.trim() && styles.sendDisabled]}>
                    <Icon name="send" color={colors.white} size={18} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        backgroundColor: colors.primary,
    },
    headerText: { flex: 1 },
    headerName: { ...fonts.bold, fontSize: 16, color: colors.white },
    headerStatus: { ...fonts.regular, fontSize: 12, color: colors.white, opacity: 0.85 },
    messages: { padding: spacing.md, gap: spacing.sm },
    leftWrap: { alignItems: 'flex-start' },
    rightWrap: { alignItems: 'flex-end' },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.lg,
    },
    doctorBubble: { alignSelf: 'flex-start', backgroundColor: colors.surfaceSoft, borderTopLeftRadius: 4 },
    myBubble: { backgroundColor: colors.surface, borderTopRightRadius: 4 },
    bubbleText: { ...fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
    time: { ...fonts.regular, fontSize: 10, color: colors.primary, marginTop: 2, marginLeft: 4 },
    timeRight: { marginLeft: 0, marginRight: 4 },
    typing: { ...fonts.medium, fontSize: 12, color: colors.primary },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.sm,
        backgroundColor: colors.surface,
    },
    input: {
        flex: 1,
        height: 42,
        paddingHorizontal: spacing.md,
        ...fonts.regular,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    sendButton: {
        width: 42,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    sendDisabled: { opacity: 0.5 },
});