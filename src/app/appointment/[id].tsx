import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { BottomSheet } from '../../components/BottomSheet';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function AppointmentScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { appointments, cancel } = useAppointments();
    const { doctors } = useDoctors();
    const [cancelOpen, setCancelOpen] = useState(false);

    const appointment = appointments.find((item) => item.id === id);
    const doctor = doctors.find((item) => item.id === appointment?.doctorId);
    const goHome = () => router.replace('/home');

    if (!appointment || !doctor) {
        return (
            <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
                <ScreenHeader title={t.booking.detailsTitle} onBack={goHome} />
                <EmptyState icon="calendar" title={t.booking.notFound} text="" />
            </View>
        );
    }

    const date = new Date();
    date.setDate(date.getDate() + appointment.dayOffset);
    const patient = appointment.patient;
    const genderLabel = patient
        ? { male: t.booking.male, female: t.booking.female, other: t.booking.other }[patient.gender]
        : '—';

    const rows = [
        { label: t.booking.bookingFor, value: patient?.forWhom === 'other' ? t.booking.anotherPerson : t.booking.yourself },
        { label: t.booking.fullName, value: patient?.name ?? '—' },
        { label: t.booking.age, value: patient?.age ?? '—' },
        { label: t.booking.gender, value: genderLabel },
    ];

    const confirmCancel = () => {
        setCancelOpen(false);
        cancel(appointment.id);
        goHome();
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <ScreenHeader title={t.booking.detailsTitle} onBack={goHome} />

                <View style={styles.doctorCard}>
                    <Avatar preset={doctor.avatar} uri={doctor.photo} size={72} />
                    <View style={styles.flex}>
                        <View style={styles.whiteBox}>
                            <Text style={styles.doctorName} numberOfLines={1}>
                                {t.home.doctorPrefix} {doctor.name}
                            </Text>
                            <Text style={styles.doctorSpec} numberOfLines={1}>
                                {t.specialties[doctor.specialty]}
                            </Text>
                        </View>
                        <View style={styles.stats}>
                            <View style={styles.stat}>
                                <Icon name="star" color={colors.primary} size={11} filled />
                                <Text style={styles.statText}>{doctor.rating.toFixed(1)}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Icon name="comment" color={colors.primary} size={11} />
                                <Text style={styles.statText}>{doctor.reviews}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.dateRow}>
                    <View style={styles.flex}>
                        <View style={styles.datePill}>
                            <Text style={styles.dateText}>
                                {date.getDate()} {t.booking.monthsOf[date.getMonth()]} {date.getFullYear()}
                            </Text>
                        </View>
                        <Text style={styles.dateSub}>
                            {t.days.full[date.getDay()]}, {appointment.hour}:00
                        </Text>
                    </View>
                    <Pressable onPress={goHome} hitSlop={6} style={styles.roundButton} accessibilityLabel={t.booking.done}>
                        <Icon name="check" color={colors.white} size={16} />
                    </Pressable>
                    <Pressable
                        onPress={() => setCancelOpen(true)}
                        hitSlop={6}
                        style={styles.roundButton}
                        accessibilityLabel={t.booking.cancel}
                    >
                        <Text style={styles.cross}>✕</Text>
                    </Pressable>
                </View>

                <View style={styles.divider} />

                {rows.map((row) => (
                    <View key={row.label} style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{row.label}</Text>
                        <Text style={styles.infoValue}>{row.value}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <Text style={styles.infoLabel}>{t.booking.problem}</Text>
                <Text style={styles.problem}>{appointment.problem || t.booking.noProblem}</Text>
            </ScrollView>

            <BottomSheet
                visible={cancelOpen}
                title={t.booking.cancelQuestion}
                message={t.booking.cancelText}
                cancelText={t.common.cancel}
                confirmText={t.booking.cancelYes}
                onCancel={() => setCancelOpen(false)}
                onConfirm={confirmCancel}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    flex: { flex: 1 },
    doctorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        padding: spacing.sm + 2,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
    },
    whiteBox: { padding: spacing.sm, backgroundColor: colors.white, borderRadius: radius.md },
    doctorName: { ...fonts.bold, fontSize: 14, color: colors.primary },
    doctorSpec: { ...fonts.regular, fontSize: 12, color: colors.text },
    stats: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    statText: { ...fonts.medium, fontSize: 11, color: colors.primary },
    divider: { height: 1, backgroundColor: colors.surface, marginVertical: spacing.md },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    datePill: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    dateText: { ...fonts.bold, fontSize: 14, color: colors.white },
    dateSub: { ...fonts.semiBold, fontSize: 12, color: colors.primary, marginTop: 4, marginLeft: spacing.sm },
    roundButton: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    cross: { ...fonts.bold, fontSize: 14, color: colors.white },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    infoLabel: { ...fonts.regular, fontSize: 13, color: colors.text },
    infoValue: { ...fonts.bold, fontSize: 13, color: colors.text },
    problem: { ...fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text, marginTop: 6 },
});