import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { useUser } from '../../context/UserContext';
import { bookingDays, bookingHours, isDoctorBusy, type Patient } from '../../data/appointments';
import { colors, fonts, radius, spacing } from '../../theme';
import { getDays } from '../../utils/schedule';

type Gender = Patient['gender'];

export default function BookScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { user } = useUser();
    const { doctors } = useDoctors();
    const { appointments, add } = useAppointments();
    const params = useLocalSearchParams<{ id: string; day?: string }>();
    const doctor = doctors.find((item) => item.id === params.id);

    const days = useMemo(() => getDays(bookingDays), []);
    const startDay = Math.min(Math.max(Number(params.day) || 0, 0), bookingDays - 1);
    const [day, setDay] = useState(startDay);
    const [hour, setHour] = useState<number | null>(null);
    const [forWhom, setForWhom] = useState<Patient['forWhom']>('self');
    const [name, setName] = useState(user?.name ?? '');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<Gender>('female');
    const [problem, setProblem] = useState('');

    if (!doctor) {
        return (
            <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
                <ScreenHeader title={t.booking.title} />
                <EmptyState icon="doctors" title={t.doctors.notFound} text="" />
            </View>
        );
    }

    // Час занят, если врач «занят» или у вас уже есть запись на это время
    const isBusy = (h: number) =>
        isDoctorBusy(doctor.id, day, h) || appointments.some((item) => item.status === 'upcoming' && item.dayOffset === day && item.hour === h)
    const free = bookingHours.filter((h) => !isBusy(h));
    const chosenHour = hour !== null && free.includes(hour) ? hour : free[0];

    const changeWho = (value: Patient['forWhom']) => {
        setForWhom(value);
        setName(value === 'self' ? (user?.name ?? '') : '');
    };

    const submit = () => {
        if (chosenHour === undefined) return;
        const id = add({
            dayOffset: day,
            hour: chosenHour,
            doctorId: doctor.id,
            topic: 'consultation',
            patient: {
                forWhom,
                name: name.trim() || (forWhom === 'self' ? user?.name : '') || '—',
                age: age.trim() || '—',
                gender,
            },
            problem: problem.trim(),
        });
        router.replace({ pathname: '/payment/[id]', params: { id } });
    };

    const genders: { key: Gender; label: string }[] = [
        { key: 'male', label: t.booking.male },
        { key: 'female', label: t.booking.female },
        { key: 'other', label: t.booking.other },
    ];
    const selectedDate = days[day].date;

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
            >
                <ScreenHeader title={t.booking.title} />

                <View style={styles.doctorChip}>
                    <Avatar preset={doctor.avatar} uri={doctor.photo} size={36} />
                    <View style={styles.flex}>
                        <Text style={styles.doctorName} numberOfLines={1}>
                            {t.home.doctorPrefix} {doctor.name}
                        </Text>
                        <Text style={styles.doctorSpec} numberOfLines={1}>
                            {t.specialties[doctor.specialty]}
                        </Text>
                    </View>
                </View>

                <View style={styles.daysBox}>
                    <Text style={styles.monthLabel}>
                        {t.booking.months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
                        {days.map((item) => {
                            const active = item.offset === day;
                            return (
                                <Pressable
                                    key={item.offset}
                                    onPress={() => {
                                        setDay(item.offset);
                                        setHour(null);
                                    }}
                                    style={[styles.dayChip, active && styles.dayChipActive]}
                                >
                                    <Text style={[styles.dayNumber, active && styles.textWhite]}>{item.date.getDate()}</Text>
                                    <Text style={[styles.dayName, active && styles.textWhite]}>
                                        {t.days.short[item.date.getDay()]}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                <Text style={styles.section}>{t.booking.availableTime}</Text>
                {free.length === 0 ? <Text style={styles.muted}>{t.booking.noTime}</Text> : null}
                <View style={styles.timeGrid}>
                    {bookingHours.map((h) => {
                        const busy = isBusy(h);
                        const active = h === chosenHour;
                        return (
                            <Pressable
                                key={h}
                                disabled={busy}
                                onPress={() => setHour(h)}
                                style={[styles.timeChip, active && styles.timeChipActive, busy && styles.timeChipBusy]}
                            >
                                <Text style={[styles.timeText, active && styles.textWhite, busy && styles.timeTextBusy]}>
                                    {h}:00
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                <View style={styles.divider} />

                <Text style={styles.section}>{t.booking.patientDetails}</Text>
                <View style={styles.chips}>
                    {(['self', 'other'] as const).map((key) => (
                        <Pressable
                            key={key}
                            onPress={() => changeWho(key)}
                            style={[styles.chip, forWhom === key && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, forWhom === key && styles.textWhite]}>
                                {key === 'self' ? t.booking.yourself : t.booking.anotherPerson}
                            </Text>
                        </Pressable>
                    ))}
                </View>

                <Text style={styles.label}>{t.booking.fullName}</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder={t.auth.namePlaceholder}
                    placeholderTextColor={colors.muted}
                    style={styles.input}
                />
                <Text style={styles.label}>{t.booking.age}</Text>
                <TextInput
                    value={age}
                    onChangeText={(value) => setAge(value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="30"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    style={styles.input}
                />
                <Text style={styles.label}>{t.booking.gender}</Text>
                <View style={styles.chips}>
                    {genders.map((item) => (
                        <Pressable
                            key={item.key}
                            onPress={() => setGender(item.key)}
                            style={[styles.chip, gender === item.key && styles.chipActive]}
                        >
                            <Text style={[styles.chipText, gender === item.key && styles.textWhite]}>{item.label}</Text>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.divider} />

                <Text style={styles.label}>{t.booking.problem}</Text>
                <TextInput
                    value={problem}
                    onChangeText={setProblem}
                    placeholder={t.booking.problemPlaceholder}
                    placeholderTextColor={colors.muted}
                    multiline
                    textAlignVertical="top"
                    style={[styles.input, styles.textArea]}
                />

                <View style={styles.button}>
                    <Button title={t.booking.book} onPress={submit} disabled={free.length === 0} />
                </View>
                <View style={styles.hint}>
                    <Icon name="clock" color={colors.muted} size={14} />
                    <Text style={styles.muted}>
                        {t.days.full[selectedDate.getDay()]}, {selectedDate.getDate()}{' '}
                        {t.booking.monthsOf[selectedDate.getMonth()]}
                        {chosenHour !== undefined ? ` · ${chosenHour}:00` : ''}
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
    flex: { flex: 1 },
    textWhite: { color: colors.white },
    doctorChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.sm,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    doctorName: { ...fonts.bold, fontSize: 14, color: colors.primary },
    doctorSpec: { ...fonts.regular, fontSize: 12, color: colors.text },
    daysBox: {
        paddingVertical: spacing.sm,
        marginHorizontal: -spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
    },
    monthLabel: {
        ...fonts.bold,
        fontSize: 14,
        color: colors.primary,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    daysRow: { gap: spacing.sm, paddingHorizontal: spacing.md },
    dayChip: {
        width: 50,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        borderRadius: radius.md,
    },
    dayChipActive: { backgroundColor: colors.primary },
    dayNumber: { ...fonts.bold, fontSize: 18, color: colors.text },
    dayName: { ...fonts.medium, fontSize: 11, color: colors.muted, marginTop: 2 },
    section: { ...fonts.bold, fontSize: 15, color: colors.primary, marginBottom: spacing.sm },
    muted: { ...fonts.regular, fontSize: 12, color: colors.muted },
    timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    timeChip: {
        width: '30%',
        flexGrow: 1,
        alignItems: 'center',
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    timeChipActive: { backgroundColor: colors.primary },
    timeChipBusy: { backgroundColor: colors.surfaceSoft },
    timeText: { ...fonts.semiBold, fontSize: 13, color: colors.primary },
    timeTextBusy: { color: colors.muted, opacity: 0.5, textDecorationLine: 'line-through' },
    divider: { height: 1, backgroundColor: colors.surface, marginVertical: spacing.md },
    chips: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.pill,
    },
    chipActive: { backgroundColor: colors.primary },
    chipText: { ...fonts.semiBold, fontSize: 12, color: colors.primary },
    label: { ...fonts.semiBold, fontSize: 13, color: colors.text, marginTop: spacing.sm, marginBottom: 6 },
    input: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        ...fonts.regular,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.surface,
        borderRadius: radius.md,
    },
    textArea: { height: 110 },
    button: { marginTop: spacing.lg },
    hint: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: spacing.sm },
});