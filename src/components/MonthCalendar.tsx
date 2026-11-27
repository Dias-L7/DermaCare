import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
    /** Сколько дней от сегодня можно выбрать */
    maxDays: number;
    /** Номер выбранного дня от сегодня (0 — сегодня) */
    selected?: number;
    onSelect: (dayOffset: number) => void;
};

const DAY = 24 * 60 * 60 * 1000;

function startOfToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
}

export function MonthCalendar({ maxDays, selected, onSelect }: Props) {
    const { t } = useLanguage();
    const today = startOfToday();
    const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    // Неделя с понедельника: Пн, Вт, ... Вс
    const weekdays = [1, 2, 3, 4, 5, 6, 0].map((index) => t.days.short[index]);
    const firstWeekday = (month.getDay() + 6) % 7;
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (number | null)[] = [
        ...Array.from({ length: firstWeekday }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];

    const lastMonth = new Date(today.getTime() + (maxDays - 1) * DAY);
    const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
    const canNext = month < new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);

    const shift = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Pressable onPress={() => shift(-1)} disabled={!canPrev} hitSlop={8} style={!canPrev && styles.hidden}>
                    <Icon name="back" color={colors.primary} size={18} />
                </Pressable>
                <Text style={styles.monthTitle}>
                    {t.booking.months[month.getMonth()]} {month.getFullYear()}
                </Text>
                <Pressable onPress={() => shift(1)} disabled={!canNext} hitSlop={8} style={!canNext && styles.hidden}>
                    <Icon name="chevronRight" color={colors.primary} size={18} />
                </Pressable>
            </View>

            <View style={styles.row}>
                {weekdays.map((day) => (
                    <View key={day} style={styles.cell}>
                        <View style={styles.weekday}>
                            <Text style={styles.weekdayText}>{day}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.grid}>
                {cells.map((day, index) => {
                    if (day === null) return <View key={`e${index}`} style={styles.cell} />;
                    const date = new Date(month.getFullYear(), month.getMonth(), day);
                    const offset = Math.round((date.getTime() - today.getTime()) / DAY);
                    const enabled = offset >= 0 && offset < maxDays;
                    const active = offset === selected;
                    return (
                        <View key={day} style={styles.cell}>
                            <Pressable
                                onPress={() => onSelect(offset)}
                                disabled={!enabled}
                                style={[styles.day, active && styles.dayActive]}
                            >
                                <Text style={[styles.dayText, !enabled && styles.dayDisabled, active && styles.dayTextActive]}>
                                    {day}
                                </Text>
                            </Pressable>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        marginBottom: spacing.sm,
    },
    hidden: { opacity: 0 },
    monthTitle: { ...fonts.bold, fontSize: 15, color: colors.primary, minWidth: 140, textAlign: 'center' },
    row: { flexDirection: 'row' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: spacing.xs,
        marginTop: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: radius.md,
    },
    cell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 3 },
    weekday: { paddingHorizontal: 6, paddingVertical: 2, backgroundColor: colors.primary, borderRadius: radius.pill },
    weekdayText: { ...fonts.semiBold, fontSize: 10, color: colors.white },
    day: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
    dayActive: { backgroundColor: colors.primary },
    dayText: { ...fonts.medium, fontSize: 13, color: colors.text },
    dayDisabled: { color: colors.muted, opacity: 0.5 },
    dayTextActive: { color: colors.white },
});