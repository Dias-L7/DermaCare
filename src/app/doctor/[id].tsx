import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { MonthCalendar } from '../../components/MonthCalendar';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useDoctors } from '../../context/DoctorsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';
import { bookingDays } from '../../data/appointments';
import { doctorBios } from '../../data/doctorBios';
import { colors, fonts, radius, spacing } from '../../theme';

export default function DoctorInfoScreen() {
    const insets = useSafeAreaInsets();
    const { t, language } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { doctors } = useDoctors();
    const { favoriteIds, toggleFavorite } = useFavorites();
    const doctor = doctors.find((item) => item.id === id);

    if (!doctor) {
        return (
            <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
                <ScreenHeader title={t.doctors.infoTitle} />
                <EmptyState icon="doctors" title={t.doctors.notFound} text="" />
            </View>
        );
    }

    const favorite = favoriteIds.includes(doctor.id);
    const bio = doctorBios[doctor.id]?.[language];
    const book = (day?: number) =>
        router.push({ pathname: '/book/[id]', params: { id: doctor.id, day: String(day ?? 0) } });
    const sections = [
        { title: t.doctors.profile, text: bio?.profile ?? t.doctors.profileText },
        { title: t.doctors.career, text: bio?.career ?? t.doctors.careerText },
        { title: t.doctors.highlights, text: bio?.highlights ?? t.doctors.highlightsText },
    ];

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <ScreenHeader title={t.doctors.infoTitle} />

                <View style={styles.card}>
                    <View style={styles.top}>
                        <Avatar preset={doctor.avatar} uri={doctor.photo} size={110} />
                        <View style={styles.topRight}>
                            <View style={styles.expBadge}>
                                <Icon name="check" color={colors.white} size={14} />
                                <Text style={styles.expText}>
                                    {doctor.experience} {t.doctors.yearsExperience}
                                </Text>
                            </View>
                            <View style={styles.focusBox}>
                                <Text style={styles.focusText}>
                                    <Text style={styles.focusLabel}>{t.doctors.focus}: </Text>
                                    {bio?.focus ?? t.doctors.focusText}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.nameBox}>
                        <Text style={styles.name}>
                            {t.home.doctorPrefix} {doctor.name}
                        </Text>
                        <Text style={styles.specialty}>{t.specialties[doctor.specialty]}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Icon name="star" color={colors.primary} size={12} filled />
                            <Text style={styles.statText}>{doctor.rating.toFixed(1)}</Text>
                        </View>
                        <View style={styles.stat}>
                            <Icon name="comment" color={colors.primary} size={12} />
                            <Text style={styles.statText}>{doctor.reviews}</Text>
                        </View>
                        <View style={[styles.stat, styles.flex]}>
                            <Icon name="clock" color={colors.primary} size={12} />
                            <Text style={styles.statText} numberOfLines={1}>{bio?.workHours ?? t.doctors.workHours}</Text>
                        </View>
                    </View>

                    <View style={styles.actionsRow}>
                        <Pressable onPress={() => book()} style={styles.scheduleButton}>
                            <Icon name="calendar" color={colors.white} size={14} />
                            <Text style={styles.scheduleText}>{t.doctors.schedule}</Text>
                        </Pressable>
                        <View style={styles.flex} />
                        <Pressable
                            onPress={() => router.push({ pathname: '/conversation/[id]', params: { id: doctor.id } })}
                            hitSlop={6}
                            style={[styles.iconButton, styles.chatButton]}
                        >
                            <Icon name="chat" color={colors.primary} size={16} />
                        </Pressable>
                        <Pressable onPress={() => toggleFavorite(doctor.id)} hitSlop={6} style={styles.iconButton}>
                            <Icon name="heart" color={colors.primary} size={16} filled={favorite} />
                        </Pressable>
                    </View>
                </View>

                {sections.map((section) => (
                    <View key={section.title}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionText}>{section.text}</Text>
                    </View>
                ))}
                <Text style={styles.sectionTitle}>{t.booking.bookCalendar}</Text>
                <MonthCalendar maxDays={bookingDays} onSelect={book} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.md },
    flex: { flex: 1 },
    card: { padding: spacing.md, gap: spacing.sm + 2, backgroundColor: colors.surface, borderRadius: radius.lg },
    top: { flexDirection: 'row', gap: spacing.sm + 4 },
    topRight: { flex: 1, gap: spacing.sm },
    expBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm + 2,
        paddingVertical: 4,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    expText: { ...fonts.semiBold, fontSize: 11, color: colors.white },
    focusBox: { flex: 1, padding: spacing.sm + 2, backgroundColor: colors.primary, borderRadius: radius.md },
    focusLabel: { ...fonts.bold },
    focusText: { ...fonts.regular, fontSize: 11, lineHeight: 15, color: colors.white },
    nameBox: { alignItems: 'center', paddingVertical: spacing.sm, backgroundColor: colors.white, borderRadius: radius.md },
    name: { ...fonts.bold, fontSize: 15, color: colors.primary },
    specialty: { ...fonts.regular, fontSize: 12, color: colors.text, marginTop: 2 },
    statsRow: { flexDirection: 'row', gap: spacing.sm },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    statText: { ...fonts.medium, fontSize: 11, color: colors.primary },
    actionsRow: { flexDirection: 'row', alignItems: 'center' },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    scheduleText: { ...fonts.semiBold, fontSize: 12, color: colors.white },
    iconButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    chatButton: { marginRight: spacing.sm },
    sectionTitle: { ...fonts.bold, fontSize: 15, color: colors.primary, marginBottom: 4 },
    sectionText: { ...fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text },
});