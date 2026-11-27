import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Doctor } from '../../api/types';
import { ConfirmModal } from '../../components/ConfirmModal';
import { DoctorList } from '../../components/DoctorList';
import { HomeHeader } from '../../components/HomeHeader';
import { QuickAction } from '../../components/QuickAction';
import { Schedule } from '../../components/Schedule';
import { SearchBar } from '../../components/SearchBar';
import { useDoctors } from '../../context/DoctorsContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { colors, spacing } from '../../theme';
import { filterDoctors } from '../../utils/filters';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const { user } = useUser();
  const { doctors, status, reload } = useDoctors();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [onlyFavorites] = useState(false);
  const [info, setInfo] = useState<Doctor | null>(null);
  const [bellOpen, setBellOpen] = useState(false);

  const visible = filterDoctors(doctors, query, onlyFavorites, favoriteIds, t.specialties);

  const infoText = info
    ? `${t.specialties[info.specialty]}\n${t.home.rating}: ${info.rating.toFixed(1)}\n${t.home.reviews}: ${info.reviews}\n${t.home.experience}: ${info.experience} ${t.home.experienceYears}`
    : '';

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.md }]}
      >
        <HomeHeader
          name={user?.name ?? ''}
          onBell={() => router.push('/alerts')}
          onSettings={() => router.navigate('/profile')}
        />
        <View style={styles.searchRow}>
          <QuickAction
            icon="doctors"
            label={t.home.doctors}
            active={!onlyFavorites}
            onPress={() => router.push('/doctors')}
          />
          <QuickAction
            icon="heart"
            label={t.home.favorites}
            active={onlyFavorites}
            onPress={() => router.push('/favorites')}
          />
          <SearchBar value={query} onChangeText={setQuery} placeholder={t.home.searchPlaceholder} />
        </View>
        <Schedule />
        <DoctorList
          status={status}
          doctors={visible}
          hasQuery={query.trim().length > 0}
          onlyFavorites={onlyFavorites}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onInfo={setInfo}
          onRetry={reload}
        />
      </ScrollView>
      <ConfirmModal
        visible={info !== null}
        title={info ? `${t.home.doctorPrefix} ${info.name}` : ''}
        message={infoText}
        confirmText={t.common.close}
        onConfirm={() => setInfo(null)}
      />
      <ConfirmModal
        visible={bellOpen}
        title={t.home.notificationsTitle}
        message={t.home.noNotifications}
        confirmText={t.common.close}
        onConfirm={() => setBellOpen(false)}
      />
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
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
