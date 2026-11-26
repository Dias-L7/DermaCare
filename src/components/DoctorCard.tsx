import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doctor } from '../api/types';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../theme';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

type Props = {
  doctor: Doctor;
  favorite: boolean;
  onToggleFavorite: () => void;
  onInfo: () => void;
};

export function DoctorCard({ doctor, favorite, onToggleFavorite, onInfo }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.card}>
      <Avatar preset={doctor.avatar} size={54} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {t.home.doctorPrefix} {doctor.name}
        </Text>
        <Text style={styles.specialty} numberOfLines={1}>
          {t.specialties[doctor.specialty]}
        </Text>
        <View style={styles.meta}>
          <View style={styles.stat}>
            <Icon name="star" color={colors.primary} size={12} filled />
            <Text style={styles.statText}>{doctor.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.stat}>
            <Icon name="comment" color={colors.primary} size={12} />
            <Text style={styles.statText}>{doctor.reviews}</Text>
          </View>
          <View style={styles.spacer} />
          <Pressable onPress={onInfo} hitSlop={8}>
            <Icon name="help" color={colors.primary} size={18} />
          </Pressable>
          <Pressable onPress={onToggleFavorite} hitSlop={8}>
            <Icon name="heart" color={colors.primary} size={18} filled={favorite} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  body: {
    flex: 1,
    marginLeft: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
  },
  name: {
    ...fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
  specialty: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.text,
    marginTop: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  statText: {
    ...fonts.medium,
    fontSize: 11,
    color: colors.primary,
  },
  spacer: {
    flex: 1,
  },
});
