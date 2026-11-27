import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Doctor } from '../api/types';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../theme';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

type Props = {
    doctor: Doctor;
    favorite: boolean;
    /** list — обычный список, rating — с рейтингом, favorite — карточка избранного */
    variant?: 'list' | 'rating' | 'favorite';
    onInfo: () => void;
    onToggleFavorite: () => void;
    onAppointment: () => void;
};

export function DoctorRow({
    doctor,
    favorite,
    variant = 'list',
    onInfo,
    onToggleFavorite,
    onAppointment,
}: Props) {
    const { t } = useLanguage();
    const name = `${t.home.doctorPrefix} ${doctor.name}`;
    const specialty = t.specialties[doctor.specialty];

    if (variant === 'favorite') {
        return (
            <View style={styles.card}>
                <Avatar preset={doctor.avatar} uri={doctor.photo} size={64} />
                <View style={styles.right}>
                    <Badge text={t.doctors.professional} />
                    <View style={styles.whiteBox}>
                        <View style={styles.flex}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
                        </View>
                        <Pressable onPress={onToggleFavorite} hitSlop={8}>
                            <Icon name="heart" color={colors.primary} size={22} filled={favorite} />
                        </Pressable>
                    </View>
                    <Pressable onPress={onAppointment} style={styles.wideButton}>
                        <Text style={styles.wideButtonText}>{t.doctors.makeAppointment}</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    const actions = (
        <View style={styles.actions}>
            <Pressable onPress={onInfo} style={styles.infoButton}>
                <Text style={styles.infoText}>{t.doctors.info}</Text>
            </Pressable>
            <View style={styles.flex} />
            <IconButton icon="calendar" onPress={onAppointment} />
            <IconButton icon="help" onPress={onInfo} />
            <IconButton icon="heart" onPress={onToggleFavorite} filled={favorite} />
        </View>
    );

    if (variant === 'rating') {
        return (
            <View style={styles.card}>
                <Avatar preset={doctor.avatar} uri={doctor.photo} size={64} />
                <View style={styles.right}>
                    <View style={styles.badgeRow}>
                        <Badge text={t.doctors.professional} />
                        <View style={styles.ratingPill}>
                            <Icon name="star" color={colors.primary} size={11} filled />
                            <Text style={styles.ratingText}>{doctor.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                    <View style={styles.whiteBox}>
                        <View style={styles.flex}>
                            <Text style={styles.name} numberOfLines={1}>{name}</Text>
                            <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
                        </View>
                    </View>
                    {actions}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Avatar preset={doctor.avatar} uri={doctor.photo} size={84} />
            <View style={styles.right}>
                <Text style={styles.name} numberOfLines={2}>{name}</Text>
                <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
                {actions}
            </View>
        </View>
    );
}

function Badge({ text }: { text: string }) {
    return (
        <View style={styles.badge}>
            <Icon name="check" color={colors.primary} size={11} />
            <Text style={styles.badgeText}>{text}</Text>
        </View>
    );
}

function IconButton({
    icon,
    onPress,
    filled = false,
}: {
    icon: 'calendar' | 'help' | 'heart';
    onPress: () => void;
    filled?: boolean;
}) {
    return (
        <Pressable onPress={onPress} hitSlop={6} style={styles.iconButton}>
            <Icon name={icon} color={colors.primary} size={14} filled={filled} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm + 2,
        gap: spacing.sm + 2,
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
    },
    right: {
        flex: 1,
        gap: spacing.xs + 2,
    },
    flex: {
        flex: 1,
    },
    name: {
        ...fonts.bold,
        fontSize: 14,
        color: colors.primary,
    },
    specialty: {
        ...fonts.regular,
        fontSize: 12,
        color: colors.text,
    },
    whiteBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs + 2,
        backgroundColor: colors.white,
        borderRadius: radius.md,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs + 2,
        marginTop: spacing.xs,
    },
    infoButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    infoText: {
        ...fonts.semiBold,
        fontSize: 12,
        color: colors.white,
    },
    iconButton: {
        width: 26,
        height: 26,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    badgeText: {
        ...fonts.medium,
        fontSize: 10,
        color: colors.primary,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    ratingText: {
        ...fonts.semiBold,
        fontSize: 11,
        color: colors.primary,
    },
    wideButton: {
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    wideButtonText: {
        ...fonts.semiBold,
        fontSize: 11,
        color: colors.white,
    },
});