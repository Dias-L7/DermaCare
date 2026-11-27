import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Icon } from '../../components/Icon';
import { ScreenHeader } from '../../components/ScreenHeader';
import { useAppointments } from '../../context/AppointmentsContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { methodLabel, usePayment } from '../../context/PaymentContext';
import { formatPrice, visitPrice } from '../../data/appointments';
import { colors, fonts, radius, spacing } from '../../theme';

export default function PaymentScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { appointments, markPaid } = useAppointments();
    const { doctors } = useDoctors();
    const { cards, method } = usePayment();

    const appointment = appointments.find((item) => item.id === id);
    const doctor = doctors.find((item) => item.id === appointment?.doctorId);

    if (!appointment || !doctor) {
        return (
            <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingHorizontal: spacing.md }]}>
                <ScreenHeader title={t.payment.title} />
                <EmptyState icon="calendar" title={t.booking.notFound} text="" />
            </View>
        );
    }

    const date = new Date();
    date.setDate(date.getDate() + appointment.dayOffset);
    const dateText = `${date.getDate()} ${t.booking.monthsOf[date.getMonth()]} / ${appointment.hour}:00`;

    const pay = () => {
        markPaid(appointment.id);
        router.replace({ pathname: '/payment-success/[id]', params: { id: appointment.id } });
    };

    const back = () => (router.canGoBack() ? router.back() : router.replace('/home'));

    return (
        <View style={styles.screen}>
            <StatusBar style="light" />
            <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
                <View style={styles.headerRow}>
                    <Pressable onPress={back} hitSlop={10} style={styles.side}>
                        <Icon name="back" color={colors.white} size={24} />
                    </Pressable>
                    <Text style={styles.headerTitle}>{t.payment.title}</Text>
                    <View style={styles.side} />
                </View>
                <Text style={styles.price}>{formatPrice(visitPrice)}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.doctor}>
                    <Avatar preset={doctor.avatar} uri={doctor.photo} size={64} />
                    <View style={styles.flex}>
                        <Text style={styles.name}>
                            {t.home.doctorPrefix} {doctor.name}
                        </Text>
                        <Text style={styles.spec}>{t.specialties[doctor.specialty]}</Text>
                        <View style={styles.stats}>
                            <View style={styles.stat}>
                                <Icon name="star" color={colors.primary} size={11} filled />
                                <Text style={styles.statText}>{doctor.rating.toFixed(1)}</Text>
                            </View>
                            <View style={styles.stat}>
                                <Icon name="comment" color={colors.primary} size={11} />
                                <Text style={styles.statText}>{doctor.reviews}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.divider} />
                <Row label={t.payment.dateTime} value={dateText} />
                <Row label={t.payment.duration} value={t.payment.minutes} />
                <Row
                    label={t.payment.bookingFor}
                    value={appointment.patient?.forWhom === 'other' ? t.booking.anotherPerson : t.booking.yourself}
                />

                <View style={styles.divider} />
                <Row label={t.payment.amount} value={formatPrice(visitPrice)} />
                <Row label={t.payment.duration} value={t.payment.minutes} />
                <Row label={t.payment.total} value={formatPrice(visitPrice)} bold />

                <View style={styles.divider} />
                <View style={styles.methodRow}>
                    <Text style={styles.methodLabel}>{t.payment.method}</Text>
                    <Text style={styles.methodValue}>{methodLabel(method, cards, t.payment)}</Text>
                    <Pressable onPress={() => router.push('/payment-method')} hitSlop={8}>
                        <Text style={styles.change}>{t.payment.change}</Text>
                    </Pressable>
                </View>

                <View style={styles.button}>
                    {appointment.paid ? (
                        <Text style={styles.paid}>{t.payment.paid}</Text>
                    ) : (
                        <Button title={t.payment.payNow} onPress={pay} />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

function Row({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={[styles.rowValue, bold && styles.rowBold]}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl, backgroundColor: colors.primary },
    headerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
    side: { width: 32 },
    headerTitle: { flex: 1, ...fonts.semiBold, fontSize: 20, color: colors.white, textAlign: 'center' },
    price: { ...fonts.bold, fontSize: 36, color: colors.white, textAlign: 'center', marginTop: spacing.md },
    content: { padding: spacing.lg, paddingBottom: spacing.xl },
    flex: { flex: 1 },
    doctor: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    name: { ...fonts.bold, fontSize: 15, color: colors.primary },
    spec: { ...fonts.regular, fontSize: 12, color: colors.text, marginTop: 2 },
    stats: { flexDirection: 'row', gap: spacing.sm, marginTop: 6 },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    statText: { ...fonts.medium, fontSize: 11, color: colors.primary },
    divider: { height: 1, backgroundColor: colors.primary, opacity: 0.3, marginVertical: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
    rowLabel: { ...fonts.regular, fontSize: 13, color: colors.primary },
    rowValue: { ...fonts.semiBold, fontSize: 13, color: colors.text },
    rowBold: { ...fonts.bold, fontSize: 15 },
    methodRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    methodLabel: { flex: 1, ...fonts.regular, fontSize: 13, color: colors.primary },
    methodValue: { ...fonts.semiBold, fontSize: 13, color: colors.text },
    change: { ...fonts.semiBold, fontSize: 13, color: colors.primary, textDecorationLine: 'underline' },
    button: { marginTop: spacing.xl },
    paid: { ...fonts.bold, fontSize: 16, color: colors.primary, textAlign: 'center' },
});