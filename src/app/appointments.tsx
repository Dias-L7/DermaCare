import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../components/Avatar';
import { EmptyState } from '../components/EmptyState';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppointments } from '../context/AppointmentsContext';
import { useDoctors } from '../context/DoctorsContext';
import { useLanguage } from '../context/LanguageContext';
import type { AppointmentStatus } from '../data/appointments';
import { colors, fonts, radius, spacing } from '../theme';

export default function AppointmentsScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { appointments, reviews } = useAppointments();
    const { doctors } = useDoctors();
    const [tab, setTab] = useState<AppointmentStatus>('upcoming');

    const tabs: { key: AppointmentStatus; label: string }[] = [
        { key: 'completed', label: t.myAppointments.complete },
        { key: 'upcoming', label: t.myAppointments.upcoming },
        { key: 'cancelled', label: t.myAppointments.cancelled },
    ];

    const list = appointments
        .filter((item) => item.status === tab)
        .sort((a, b) => (tab === 'upcoming' ? a.dayOffset - b.dayOffset : b.dayOffset - a.dayOffset));

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <ScreenHeader title={t.myAppointments.title} />

                <View style={styles.tabs}>
                    {tabs.map((item) => (
                        <Pressable
                            key={item.key}
                            onPress={() => setTab(item.key)}
                            style={[styles.tab, tab === item.key && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, tab === item.key && styles.textWhite]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                {list.length === 0 ? <EmptyState icon="calendar" title={t.myAppointments.empty} text="" /> : null}

                {list.map((item) => {
                    const doctor = doctors.find((candidate) => candidate.id === item.doctorId);
                    if (!doctor) return null;
                    const date = new Date();
                    date.setDate(date.getDate() + item.dayOffset);
                    const review = reviews[doctor.id];

                    return (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.top}>
                                <Avatar preset={doctor.avatar} uri={doctor.photo} size={58} />
                                <View style={styles.flex}>
                                    <Text style={styles.name} numberOfLines={1}>
                                        {t.home.doctorPrefix} {doctor.name}
                                    </Text>
                                    <Text style={styles.spec} numberOfLines={1}>
                                        {t.specialties[doctor.specialty]}
                                    </Text>
                                    {tab === 'completed' && review ? (
                                        <View style={styles.stars}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Icon key={star} name="star" color={colors.primary} size={11} filled={star <= review.rating} />
                                            ))}
                                        </View>
                                    ) : null}
                                    {tab === 'cancelled' && item.cancelReason ? (
                                        <Text style={styles.reason} numberOfLines={1}>
                                            {t.myAppointments.cancelledReason}: {item.cancelReason}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>

                            {tab === 'upcoming' ? (
                                <>
                                    <View style={styles.metaRow}>
                                        <View style={styles.meta}>
                                            <Icon name="calendar" color={colors.primary} size={12} />
                                            <Text style={styles.metaText}>
                                                {t.days.short[date.getDay()]}, {date.getDate()} {t.booking.monthsOf[date.getMonth()]}
                                            </Text>
                                        </View>
                                        <View style={styles.meta}>
                                            <Icon name="clock" color={colors.primary} size={12} />
                                            <Text style={styles.metaText}>
                                                {item.hour}:00 – {item.hour}:30
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.actions}>
                                        <Pressable
                                            onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: item.id } })}
                                            style={[styles.button, styles.flex]}
                                        >
                                            <Text style={styles.buttonText}>{t.myAppointments.details}</Text>
                                        </Pressable>
                                        <Pressable
                                            onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: item.id } })}
                                            style={styles.round}
                                            accessibilityLabel={t.myAppointments.details}
                                        >
                                            <Icon name="check" color={colors.primary} size={14} />
                                        </Pressable>
                                        <Pressable
                                            onPress={() => router.push({ pathname: '/cancel/[id]', params: { id: item.id } })}
                                            style={styles.round}
                                            accessibilityLabel={t.myAppointments.cancelButton}
                                        >
                                            <Text style={styles.cross}>✕</Text>
                                        </Pressable>
                                    </View>
                                </>
                            ) : (
                                <View style={styles.actions}>
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/book/[id]', params: { id: doctor.id } })}
                                        style={[styles.button, styles.buttonSoft, styles.flex]}
                                    >
                                        <Text style={[styles.buttonText, styles.buttonSoftText]}>{t.myAppointments.rebook}</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => router.push({ pathname: '/review/[id]', params: { id: doctor.id } })}
                                        style={[styles.button, styles.flex]}
                                    >
                                        <Text style={styles.buttonText}>{t.myAppointments.addReview}</Text>
                                    </Pressable>
                                </View>
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, gap: spacing.sm + 4 },
    flex: { flex: 1 },
    textWhite: { color: colors.white },
    tabs: { flexDirection: 'row', gap: spacing.sm },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 7,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    tabActive: { backgroundColor: colors.primary },
    tabText: { ...fonts.semiBold, fontSize: 12, color: colors.primary },
    card: { padding: spacing.sm + 4, gap: spacing.sm + 2, backgroundColor: colors.surface, borderRadius: radius.lg },
    top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm + 4 },
    name: { ...fonts.bold, fontSize: 14, color: colors.primary },
    spec: { ...fonts.regular, fontSize: 12, color: colors.text, marginTop: 2 },
    stars: { flexDirection: 'row', gap: 2, marginTop: 4 },
    reason: { ...fonts.regular, fontSize: 11, color: colors.muted, marginTop: 4 },
    metaRow: { flexDirection: 'row', gap: spacing.sm },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    metaText: { ...fonts.medium, fontSize: 11, color: colors.primary },
    actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    button: { alignItems: 'center', paddingVertical: 7, backgroundColor: colors.primary, borderRadius: radius.pill },
    buttonText: { ...fonts.semiBold, fontSize: 13, color: colors.white },
    buttonSoft: { backgroundColor: colors.white },
    buttonSoftText: { color: colors.primary },
    round: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    cross: { ...fonts.bold, fontSize: 13, color: colors.primary },
});