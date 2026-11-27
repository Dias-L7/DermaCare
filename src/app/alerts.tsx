import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { useLanguage } from '../context/LanguageContext';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';

type Group = 'today' | 'yesterday' | 'earlier';

export default function AlertsScreen() {
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const items = t.alerts.items;
    // Изначально непрочитаны уведомления за сегодня
    const [readIds, setReadIds] = useState<string[]>(
        items.filter((item) => item.group !== 'today').map((item) => item.id)
    );

    const unread = items.filter((item) => !readIds.includes(item.id)).length;
    const groups: { key: Group; label: string }[] = [
        { key: 'today', label: t.alerts.today },
        { key: 'yesterday', label: t.alerts.yesterday },
        { key: 'earlier', label: t.alerts.earlier },
    ];

    const markRead = (id: string) => setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

    return (
        <View style={styles.screen}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.sm }]}>
                <View>
                    <ScreenHeader title={t.alerts.title} />
                    {unread > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {unread} {t.alerts.newCount}
                            </Text>
                        </View>
                    )}
                </View>

                {groups.map((group, index) => {
                    const list = items.filter((item) => item.group === group.key);
                    if (list.length === 0) return null;
                    return (
                        <View key={group.key} style={styles.group}>
                            <View style={styles.groupRow}>
                                <View style={styles.groupPill}>
                                    <Text style={styles.groupText}>{group.label}</Text>
                                </View>
                                {index === 0 && unread > 0 && (
                                    <Pressable onPress={() => setReadIds(items.map((item) => item.id))} hitSlop={8}>
                                        <Text style={styles.markAll}>{t.alerts.markAll}</Text>
                                    </Pressable>
                                )}
                            </View>
                            {list.map((item) => {
                                const isUnread = !readIds.includes(item.id);
                                return (
                                    <Pressable
                                        key={item.id}
                                        onPress={() => markRead(item.id)}
                                        style={[styles.item, isUnread && styles.itemUnread]}
                                    >
                                        <View style={styles.iconCircle}>
                                            <Icon name={item.icon as IconName} color={colors.white} size={20} />
                                        </View>
                                        <View style={styles.itemBody}>
                                            <Text style={styles.itemTitle}>{item.title}</Text>
                                            <Text style={styles.itemText}>{item.text}</Text>
                                        </View>
                                        <Text style={styles.time}>{item.time}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: spacing.lg },
    badge: {
        position: 'absolute',
        right: spacing.md,
        top: spacing.sm + 4,
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    badgeText: { ...fonts.semiBold, fontSize: 11, color: colors.primary },
    group: { marginTop: spacing.sm },
    groupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.xs,
    },
    groupPill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        backgroundColor: colors.surface,
        borderRadius: radius.pill,
    },
    groupText: { ...fonts.semiBold, fontSize: 12, color: colors.primary },
    markAll: { ...fonts.semiBold, fontSize: 12, color: colors.primary },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm + 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 4,
    },
    itemUnread: { backgroundColor: colors.surface },
    iconCircle: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
    },
    itemBody: { flex: 1 },
    itemTitle: { ...fonts.bold, fontSize: 15, color: colors.text },
    itemText: { ...fonts.regular, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 2 },
    time: { ...fonts.medium, fontSize: 11, color: colors.muted },
});