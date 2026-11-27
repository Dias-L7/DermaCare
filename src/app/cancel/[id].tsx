import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../../components/Button';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function CancelScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { cancel } = useAppointments();
    const reasons = t.myAppointments.reasons;
    const [reason, setReason] = useState(0);
    const [comment, setComment] = useState('');

    const submit = () => {
        const text = comment.trim() ? `${reasons[reason]}: ${comment.trim()}` : reasons[reason];
        cancel(id, text);
        router.replace('/appointments');
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
            >
                <ScreenHeader title={t.myAppointments.cancelTitle} />
                <Text style={styles.intro}>{t.myAppointments.cancelIntro}</Text>

                {reasons.map((item, index) => {
                    const active = index === reason;
                    return (
                        <Pressable key={item} onPress={() => setReason(index)} style={[styles.option, active && styles.optionActive]}>
                            <View style={[styles.radio, active && styles.radioActive]}>
                                {active ? <View style={styles.radioDot} /> : null}
                            </View>
                            <Text style={styles.optionText}>{item}</Text>
                        </Pressable>
                    );
                })}

                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder={t.myAppointments.reasonPlaceholder}
                    placeholderTextColor={colors.muted}
                    multiline
                    textAlignVertical="top"
                    style={styles.input}
                />

                <View style={styles.button}>
                    <Button title={t.myAppointments.cancelButton} onPress={submit} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
    intro: { ...fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text, marginBottom: spacing.sm },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
    },
    optionActive: { backgroundColor: colors.surface },
    radio: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.pill,
    },
    radioActive: { backgroundColor: colors.white },
    radioDot: { width: 10, height: 10, backgroundColor: colors.primary, borderRadius: radius.pill },
    optionText: { ...fonts.medium, fontSize: 14, color: colors.text },
    input: {
        height: 130,
        marginTop: spacing.sm,
        padding: spacing.md,
        ...fonts.regular,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
    },
    button: { marginTop: spacing.lg },
});