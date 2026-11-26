import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoctorRow } from '../../components/DoctorRow';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { SortBar } from '../../components/SortBar';
import { useDoctors } from '../../context/DoctorsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';
import type { SpecialtyKey } from '../../i18n/types';
import { colors, fonts, radius, spacing } from '../../theme';
import { sortDoctors, type SortMode } from '../../utils/sort';

type Tab = 'doctors' | 'services';

export default function FavoritesScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { doctors } = useDoctors();
    const { favoriteIds, toggleFavorite, favoriteServices, toggleService } = useFavorites();
    const [tab, setTab] = useState<Tab>('doctors');
    const [open, setOpen] = useState<SpecialtyKey | null>(null);

    const favoriteDoctors = sortDoctors(doctors, 'favorites', favoriteIds);
    const services = Object.keys(t.specialties) as SpecialtyKey[];

    const changeSort = (mode: SortMode) => {
        if (mode === 'favorites') return;
        router.replace({ pathname: '/doctors', params: { sort: mode } });
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <ScreenHeader title={t.doctors.favoriteTitle} />
                <SortBar value="favorites" onChange={changeSort} />

                <View style={styles.tabs}>
                    {(['doctors', 'services'] as Tab[]).map((key) => (
                        <Pressable
                            key={key}
                            onPress={() => setTab(key)}
                            style={[styles.tab, tab === key && styles.tabActive]}
                        >
                            <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                                {key === 'doctors' ? t.doctors.tabDoctors : t.doctors.tabServices}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {tab === 'doctors' &&
                    (favoriteDoctors.length === 0 ? (
                        <EmptyState icon="heart" title={t.home.emptyFavoritesTitle} text={t.home.emptyFavoritesText} />
                    ) : (
                        favoriteDoctors.map((doctor) => (
                            <DoctorRow
                                key={doctor.id}
                                doctor={doctor}
                                variant="favorite"
                                favorite
                                onInfo={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })}
                                onToggleFavorite={() => toggleFavorite(doctor.id)}
                                onAppointment={() => router.navigate('/calendar')}
                            />
                        ))
                    ))}

                {tab === 'services' &&
                    services.map((key) => {
                        const expanded = open === key;
                        return (
                            <View key={key} style={styles.service}>
                                <Pressable onPress={() => setOpen(expanded ? null : key)} style={styles.serviceHead}>
                                    <Pressable onPress={() => toggleService(key)} hitSlop={8}>
                                        <Icon name="heart" color={colors.white} size={18} filled={favoriteServices.includes(key)} />
                                    </Pressable>
                                    <Text style={styles.serviceTitle} numberOfLines={1}>
                                        {t.specialties[key]}
                                    </Text>
                                    <View style={[styles.chevron, expanded && styles.chevronOpen]}>
                                        <Icon name="chevronDown" color={colors.primary} size={16} />
                                    </View>
                                </Pressable>
                                {expanded && (
                                    <>
                                        <View style={styles.serviceBody}>
                                            <Text style={styles.serviceText}>{t.doctors.services[key]}</Text>
                                        </View>
                                        <Pressable onPress={() => router.push('/doctors')} style={styles.looking}>
                                            <Text style={styles.lookingText}>{t.doctors.lookingDoctors}</Text>
                                        </Pressable>
                                    </>
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
    content: { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm + 4 },
    tabs: { flexDirection: 'row', gap: spacing.sm },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    tabActive: { backgroundColor: colors.primary },
    tabText: { ...fonts.semiBold, fontSize: 14, color: colors.primary },
    tabTextActive: { color: colors.white },
    service: { gap: spacing.sm },
    serviceHead: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    serviceTitle: { flex: 1, ...fonts.semiBold, fontSize: 13, color: colors.white },
    chevron: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    chevronOpen: { transform: [{ rotate: '180deg' }] },
    serviceBody: { padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md },
    serviceText: { ...fonts.regular, fontSize: 12, lineHeight: 18, color: colors.text, textAlign: 'center' },
    looking: {
        alignItems: 'center',
        paddingVertical: spacing.sm + 2,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    lookingText: { ...fonts.semiBold, fontSize: 15, color: colors.primary },
});