import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';
import type { SortMode } from '../utils/sort';
import { Icon } from './Icon';

type Props = {
    value: SortMode;
    onChange: (mode: SortMode) => void;
};

const iconModes: { mode: SortMode; icon: IconName }[] = [
    { mode: 'rating', icon: 'star' },
    { mode: 'favorites', icon: 'heart' },
    { mode: 'female', icon: 'female' },
    { mode: 'male', icon: 'male' },
];

export function SortBar({ value, onChange }: Props) {
    const { t } = useLanguage();

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{t.doctors.sortBy}</Text>
            <Pressable
                onPress={() => onChange('az')}
                style={[styles.chip, styles.textChip, value === 'az' && styles.active]}
            >
                <Text style={[styles.chipText, value === 'az' && styles.activeText]}>A → Z</Text>
            </Pressable>
            {iconModes.map(({ mode, icon }) => {
                const active = value === mode;
                return (
                    <Pressable
                        key={mode}
                        onPress={() => onChange(mode)}
                        style={[styles.chip, active && styles.active]}
                    >
                        <Icon name={icon} size={14} color={active ? colors.white : colors.primary} filled={active && mode !== 'female' && mode !== 'male'} />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    label: {
        ...fonts.regular,
        fontSize: 12,
        color: colors.text,
    },
    chip: {
        minWidth: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.pill,
        backgroundColor: colors.surface,
    },
    textChip: {
        paddingHorizontal: spacing.sm + 2,
    },
    active: {
        backgroundColor: colors.primary,
    },
    chipText: {
        ...fonts.semiBold,
        fontSize: 12,
        color: colors.primary,
    },
    activeText: {
        color: colors.white,
    },
});