import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';
import { Icon } from './Icon';

type Props = {
    title: string;
    onBack?: () => void;
};

export function ScreenHeader({ title, onBack }: Props) {
    const back = () => {
        if (onBack) return onBack();
        if (router.canGoBack()) router.back();
        else router.navigate('/home');
    };

    return (
        <View style={styles.row}>
            <Pressable onPress={back} hitSlop={10} style={styles.side}>
                <Icon name="back" color={colors.primary} size={24} />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>
                {title}
            </Text>
            <View style={styles.side} />
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.sm,
    },
    side: {
        width: 32,
    },
    title: {
        flex: 1,
        ...fonts.semiBold,
        fontSize: 20,
        color: colors.primary,
        textAlign: 'center',
    },
});