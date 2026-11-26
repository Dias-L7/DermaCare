import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Doctor } from '../api/types';
import { useLanguage } from '../context/LanguageContext';
import { colors, spacing } from '../theme';
import { DoctorCard } from './DoctorCard';
import { EmptyState } from './EmptyState';

type Props = {
  status: 'loading' | 'ready' | 'error';
  doctors: Doctor[];
  hasQuery: boolean;
  onlyFavorites: boolean;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  onInfo: (doctor: Doctor) => void;
  onRetry: () => void;
};

export function DoctorList({
  status,
  doctors,
  hasQuery,
  onlyFavorites,
  favoriteIds,
  onToggleFavorite,
  onInfo,
  onRetry,
}: Props) {
  const { t } = useLanguage();

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        icon="doctors"
        title={t.home.loadErrorTitle}
        text={t.home.loadErrorText}
        actionTitle={t.common.retry}
        onAction={onRetry}
      />
    );
  }

  if (doctors.length === 0) {
    if (hasQuery) {
      return <EmptyState icon="search" title={t.home.emptySearchTitle} text={t.home.emptySearchText} />;
    }
    if (onlyFavorites) {
      return <EmptyState icon="heart" title={t.home.emptyFavoritesTitle} text={t.home.emptyFavoritesText} />;
    }
    return <EmptyState icon="doctors" title={t.home.emptyDoctorsTitle} text={t.home.emptyDoctorsText} />;
  }

  return (
    <View style={styles.list}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          favorite={favoriteIds.includes(doctor.id)}
          onToggleFavorite={() => onToggleFavorite(doctor.id)}
          onInfo={() => onInfo(doctor)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  list: {
    gap: spacing.sm + 2,
  },
});
