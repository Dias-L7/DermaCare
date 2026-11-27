import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { useAppointments } from '../../context/AppointmentsContext';
import { useDoctors } from '../../context/DoctorsContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors, fonts, radius, spacing } from '../../theme';

export default function PaymentSuccessScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { appointments } = useAppointments();
    const { doctors } = useDoctors();
    const appointment = appointments.find((item) => item.id === id);
    const doctor = doctors.find((item) => item.id === appointment?.doctorId);

    const date = new Date();
    date.setDate(date.getDate() + (appointment?.dayOffset ?? 0));

    return (
        <View style={[styles.screen, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg }]}>
            <StatusBar style="light" />
            <Pressable onPress={() => router.replace('/home')} hitSlop={10} style={styles.back}>
                <Icon name="back" color={colors.white} size={24} />
            </Pressable>

            <View style={styles.center}>
                <View style={styles.circle}>
                    <Icon name="check" color={colors.white} size={64} />
                </View>
                <Text style={styles.title}>{t.payment.successTitle}</Text>
                <Text style={styles.text}>{t.payment.successText}</Text>

                {appointment && doctor ? (
                    <View style={styles.box}>
                        <Text style={styles.boxInfo}>{t.payment.successInfo}</Text>
                        <Text style={styles.boxName}>
                            {t.home.doctorPrefix} {doctor.name}
                        </Text>
                        <View style={styles.boxRow}>
                            <View style={styles.boxItem}>
                                <Icon name="calendar" color={colors.white} size={14} />
                                <Text style={styles.boxText}>
                                    {date.getDate()} {t.booking.monthsOf[date.getMonth()]}
                                </Text>
                            </View>
                            <View style={styles.boxItem}>
                                <Icon name="clock" color={colors.white} size={14} />
                                <Text style={styles.boxText}>{appointment.hour}:00</Text>
                            </View>
                        </View>
                    </View>
                ) : null}

                {appointment ? (
                    <Pressable
                        onPress={() => router.replace({ pathname: '/appointment/[id]', params: { id: appointment.id } })}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>{t.payment.toAppointment}</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, paddingHorizontal: spacing.lg, backgroundColor: colors.primary },
    back: { width: 32, paddingVertical: spacing.sm },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    circle: {
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 6,
        borderColor: colors.white,
        borderRadius: 65,
    },
    title: { ...fonts.bold, fontSize: 26, color: colors.white, marginTop: spacing.lg },
    text: { ...fonts.medium, fontSize: 15, color: colors.white, marginTop: 4 },
    box: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: spacing.md,
        marginTop: spacing.xl,
        borderWidth: 1,
        borderColor: colors.white,
        borderRadius: radius.lg,
    },
    boxInfo: { ...fonts.regular, fontSize: 12, color: colors.white, textAlign: 'center', opacity: 0.9 },
    boxName: { ...fonts.bold, fontSize: 16, color: colors.white, marginTop: spacing.sm },
    boxRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.sm },
    boxItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    boxText: { ...fonts.medium, fontSize: 13, color: colors.white },
    button: {
        alignSelf: 'stretch',
        alignItems: 'center',
        paddingVertical: spacing.sm + 6,
        marginTop: spacing.lg,
        backgroundColor: colors.white,
        borderRadius: radius.pill,
    },
    buttonText: { ...fonts.bold, fontSize: 15, color: colors.primary },
});