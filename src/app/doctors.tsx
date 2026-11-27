import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoctorRow } from '../components/DoctorRow';
import { EmptyState } from '../components/EmptyState';
import { ScreenHeader } from '../components/ScreenHeader';
import { SortBar } from '../components/SortBar';
import { useDoctors } from '../context/DoctorsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing } from '../theme';
import { isSortMode, sortDoctors, type SortMode } from '../utils/sort';

export default function DoctorsScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const params = useLocalSearchParams<{ sort?: string }>();
    const { doctors, status, reload } = useDoctors();
    const { favoriteIds, toggleFavorite } = useFavorites();
    const [mode, setMode] = useState<SortMode>(isSortMode(params.sort) ? params.sort : 'az');

    const changeMode = (next: SortMode) => {
        if (next === 'favorites') {
            router.push('/favorites');
            return;
        }
        setMode(next);
    };

    const titles: Record<SortMode, string> = {
        az: t.doctors.title,
        rating: t.doctors.ratingTitle,
        favorites: t.doctors.favoriteTitle,
        female: t.doctors.femaleTitle,
        male: t.doctors.maleTitle,
    };

    const list = sortDoctors(doctors, mode, favoriteIds);

    const content = () => {
        if (status === 'loading') {
            return <ActivityIndicator color={colors.primary} style={styles.loader} />;
        }
        if (status === 'error') {
            return (
                <EmptyState
                    icon="doctors"
                    title={t.home.loadErrorTitle}
                    text={t.home.loadErrorText}
                    actionTitle={t.common.retry}
                    onAction={reload}
                />
            );
        }
        if (list.length === 0) {
            const title = mode === 'female' ? t.doctors.emptyFemale : mode === 'male' ? t.doctors.emptyMale : t.home.emptyDoctorsTitle;
            return <EmptyState icon="doctors" title={title} text={t.home.emptyDoctorsText} />;
        }
        return list.map((doctor) => (
            <DoctorRow
                key={doctor.id}
                doctor={doctor}
                variant={mode === 'rating' ? 'rating' : 'list'}
                favorite={favoriteIds.includes(doctor.id)}
                onInfo={() => router.push({ pathname: '/doctor/[id]', params: { id: doctor.id } })}
                onToggleFavorite={() => toggleFavorite(doctor.id)}
                onAppointment={() => router.push({ pathname: '/book/[id]', params: { id: doctor.id } })}
            />
        ));
    };

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <ScreenHeader title={titles[mode]} />
                <SortBar value={mode} onChange={changeMode} />
                {content()}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.lg,
        gap: spacing.sm + 4,
    },
    loader: {
        marginTop: spacing.xl,
    },
});