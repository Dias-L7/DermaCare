import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { usePayment } from '../context/PaymentContext';
import { colors, fonts, radius, spacing } from '../theme';

function Radio({ active }: { active: boolean }) {
    return <View style={[styles.radio, active && styles.radioActive]}>{active ? <View style={styles.dot} /> : null}</View>;
}

export default function PaymentMethodScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { cards, method, setMethod } = usePayment();

    const others = [
        { key: 'apple', label: t.payment.apple, letter: 'A' },
        { key: 'paypal', label: t.payment.paypal, letter: 'P' },
        { key: 'google', label: t.payment.google, letter: 'G' },
    ];

    return (
        <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
            <StatusBar style="dark" />
            <ScreenHeader title={t.payment.methodTitle} />

            <Text style={styles.section}>{t.payment.cards}</Text>
            {cards.map((card) => (
                <Pressable key={card.id} onPress={() => setMethod(card.id)} style={styles.row}>
                    <Icon name="card" color={colors.primary} size={20} />
                    <Text style={styles.rowText}>
                        {card.holder} •••• {card.last4}
                    </Text>
                    <Radio active={method === card.id} />
                </Pressable>
            ))}
            <Pressable onPress={() => router.push('/add-card')} style={styles.row}>
                <Icon name="card" color={colors.primary} size={20} />
                <Text style={[styles.rowText, styles.addText]}>+ {t.payment.addCard}</Text>
                <Icon name="chevronRight" color={colors.primary} size={18} />
            </Pressable>

            <Text style={[styles.section, styles.sectionGap]}>{t.payment.more}</Text>
            {others.map((item) => (
                <Pressable key={item.key} onPress={() => setMethod(item.key)} style={styles.row}>
                    <View style={styles.letter}>
                        <Text style={styles.letterText}>{item.letter}</Text>
                    </View>
                    <Text style={styles.rowText}>{item.label}</Text>
                    <Radio active={method === item.key} />
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.sm },
    section: { ...fonts.bold, fontSize: 15, color: colors.text, marginTop: spacing.sm },
    sectionGap: { marginTop: spacing.lg },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    rowText: { flex: 1, ...fonts.medium, fontSize: 14, color: colors.text },
    addText: { color: colors.primary },
    letter: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    letterText: { ...fonts.bold, fontSize: 12, color: colors.white },
    radio: {
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: radius.pill,
    },
    radioActive: { backgroundColor: colors.white },
    dot: { width: 10, height: 10, backgroundColor: colors.primary, borderRadius: radius.pill },
});