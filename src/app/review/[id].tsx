import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Icon } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ReviewScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { doctors } = useDoctors();
    const { reviews, addReview } = useAppointments();
    const doctor = doctors.find((item) => item.id === id);
    const existing = reviews[id];
    const [rating, setRating] = useState(existing?.rating ?? 5);
    const [text, setText] = useState(existing?.text ?? '');
    const [done, setDone] = useState(false);

    const submit = () => {
        addReview(id, { rating, text: text.trim() });
        setDone(true);
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
            >
                <ScreenHeader title={t.myAppointments.reviewTitle} />
                <Text style={styles.intro}>{t.myAppointments.reviewIntro}</Text>

                {doctor ? (
                    <View style={styles.doctor}>
                        <Avatar preset={doctor.avatar} uri={doctor.photo} size={120} />
                        <Text style={styles.name}>
                            {t.home.doctorPrefix} {doctor.name}
                        </Text>
                        <Text style={styles.spec}>{t.specialties[doctor.specialty]}</Text>
                    </View>
                ) : null}

                <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Pressable key={star} onPress={() => setRating(star)} hitSlop={6} accessibilityLabel={`${star}`}>
                            <Icon name="star" color={colors.primary} size={30} filled={star <= rating} />
                        </Pressable>
                    ))}
                </View>

                <TextInput
                    value={text}
                    onChangeText={setText}
                    placeholder={t.myAppointments.reviewPlaceholder}
                    placeholderTextColor={colors.muted}
                    multiline
                    textAlignVertical="top"
                    style={styles.input}
                />

                <View style={styles.button}>
                    <Button title={t.myAppointments.reviewButton} onPress={submit} />
                </View>
            </ScrollView>
            <ConfirmModal
                visible={done}
                title={t.myAppointments.reviewThanks}
                message={t.myAppointments.reviewThanksText}
                confirmText={t.common.ok}
                onConfirm={() => {
                    setDone(false);
                    router.back();
                }}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    intro: { ...fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text },
    doctor: { alignItems: 'center', marginTop: spacing.lg },
    name: { ...fonts.bold, fontSize: 18, color: colors.primary, marginTop: spacing.sm },
    spec: { ...fonts.regular, fontSize: 13, color: colors.text, marginTop: 2 },
    stars: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginVertical: spacing.md },
    input: {
        height: 120,
        padding: spacing.md,
        ...fonts.regular,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
    },
    button: { marginTop: spacing.lg },
});