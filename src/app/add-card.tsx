import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import { usePayment } from '../context/PaymentContext';
import { colors, fonts, radius, spacing } from '../theme';

function formatNumber(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function AddCardScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { addCard } = usePayment();
    const [holder, setHolder] = useState('');
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState(false);

    const save = () => {
        const digits = number.replace(/\D/g, '');
        if (digits.length !== 16 || expiry.length !== 5) {
            setError(true);
            return;
        }
        addCard({ holder: holder.trim().toUpperCase() || 'CARD HOLDER', last4: digits.slice(-4), expiry });
        router.back();
    };

    return (
        <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}
            >
                <ScreenHeader title={t.payment.addCardTitle} />

                <View style={styles.card}>
                    <View style={styles.cardShape} />
                    <View style={styles.chip} />
                    <Text style={styles.cardNumber}>{number || '0000 0000 0000 0000'}</Text>
                    <View style={styles.cardBottom}>
                        <View>
                            <Text style={styles.cardLabel}>{t.payment.holder}</Text>
                            <Text style={styles.cardValue}>{holder.toUpperCase() || t.payment.holderPlaceholder}</Text>
                        </View>
                        <View>
                            <Text style={styles.cardLabel}>{t.payment.expiry}</Text>
                            <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.label}>{t.payment.holder}</Text>
                <TextInput
                    value={holder}
                    onChangeText={setHolder}
                    placeholder={t.payment.holderPlaceholder}
                    placeholderTextColor={colors.muted}
                    autoCapitalize="characters"
                    style={styles.input}
                />
                <Text style={styles.label}>{t.payment.number}</Text>
                <TextInput
                    value={number}
                    onChangeText={(value) => {
                        setNumber(formatNumber(value));
                        setError(false);
                    }}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor={colors.muted}
                    keyboardType="number-pad"
                    style={styles.input}
                />
                <View style={styles.row}>
                    <View style={styles.flex}>
                        <Text style={styles.label}>{t.payment.expiry}</Text>
                        <TextInput
                            value={expiry}
                            onChangeText={(value) => {
                                setExpiry(formatExpiry(value));
                                setError(false);
                            }}
                            placeholder="04/28"
                            placeholderTextColor={colors.muted}
                            keyboardType="number-pad"
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.flex}>
                        <Text style={styles.label}>{t.payment.cvv}</Text>
                        <TextInput
                            value={cvv}
                            onChangeText={(value) => setCvv(value.replace(/\D/g, '').slice(0, 3))}
                            placeholder="000"
                            placeholderTextColor={colors.muted}
                            keyboardType="number-pad"
                            secureTextEntry
                            style={styles.input}
                        />
                    </View>
                </View>
                {error ? <Text style={styles.error}>{t.payment.cardError}</Text> : null}

                <View style={styles.button}>
                    <Button title={t.payment.saveCard} onPress={save} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
    flex: { flex: 1 },
    card: {
        height: 180,
        padding: spacing.lg,
        justifyContent: 'flex-end',
        overflow: 'hidden',
        backgroundColor: colors.primary,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
    },
    cardShape: {
        position: 'absolute',
        right: -60,
        top: -40,
        width: 220,
        height: 220,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 110,
    },
    chip: {
        position: 'absolute',
        right: spacing.lg,
        top: spacing.lg,
        width: 44,
        height: 12,
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: radius.pill,
    },
    cardNumber: { ...fonts.bold, fontSize: 20, color: colors.white, letterSpacing: 1, marginBottom: spacing.md },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
    cardLabel: { ...fonts.regular, fontSize: 10, color: colors.white, opacity: 0.8 },
    cardValue: { ...fonts.semiBold, fontSize: 13, color: colors.white, marginTop: 2 },
    label: { ...fonts.semiBold, fontSize: 14, color: colors.text, marginTop: spacing.md, marginBottom: 6 },
    input: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
        ...fonts.regular,
        fontSize: 14,
        color: colors.text,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    row: { flexDirection: 'row', gap: spacing.md },
    error: { ...fonts.medium, fontSize: 12, color: colors.error, marginTop: spacing.sm },
    button: { marginTop: spacing.xl },
});