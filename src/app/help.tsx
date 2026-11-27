import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../components/Icon';
import { useLanguage } from '../context/LanguageContext';
import type { IconName } from '../illustrations/icons';
import { colors, fonts, radius, spacing } from '../theme';

type Tab = 'faq' | 'contact';
type Group = 'popular' | 'general' | 'services';

const contactIcons: Record<string, IconName> = {
  support: 'headset',
  website: 'globe',
  whatsapp: 'chat',
  facebook: 'facebook',
  instagram: 'instagram',
};

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('faq');
  const [group, setGroup] = useState<Group>('popular');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const text = query.trim().toLowerCase();
  const faq = t.account.faqItems.filter((item) =>
    text ? `${item.q} ${item.a}`.toLowerCase().includes(text) : item.group === group
  );
  const contacts = t.account.contacts.filter((item) =>
    text ? `${item.title} ${item.value}`.toLowerCase().includes(text) : true
  );

  const groups: { key: Group; label: string }[] = [
    { key: 'popular', label: t.account.faqPopular },
    { key: 'general', label: t.account.faqGeneral },
    { key: 'services', label: t.account.faqServices },
  ];

  const toggle = (key: string) => setOpen((prev) => (prev === key ? null : key));

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.titleRow}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/profile'))}
            hitSlop={10}
            style={styles.side}
          >
            <Icon name="back" color={colors.white} size={24} />
          </Pressable>
          <Text style={styles.title}>{t.account.helpTitle}</Text>
          <View style={styles.side} />
        </View>
        <Text style={styles.subtitle}>{t.account.helpSubtitle}</Text>
        <View style={styles.search}>
          <Icon name="search" color={colors.primary} size={18} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t.account.helpSearch}
            placeholderTextColor={colors.muted}
            style={styles.searchInput}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.tabs}>
          {(['faq', 'contact'] as Tab[]).map((key) => (
            <Pressable
              key={key}
              onPress={() => {
                setTab(key);
                setOpen(null);
              }}
              style={[styles.tab, tab === key && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === key && styles.tabTextActive]}>
                {key === 'faq' ? t.account.faq : t.account.contactUs}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'faq' && (
          <>
            {!text && (
              <View style={styles.groups}>
                {groups.map((item) => (
                  <Pressable
                    key={item.key}
                    onPress={() => {
                      setGroup(item.key);
                      setOpen(null);
                    }}
                    style={[styles.group, group === item.key && styles.groupActive]}
                  >
                    <Text style={[styles.groupText, group === item.key && styles.groupTextActive]}>
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {faq.length === 0 && <Text style={styles.empty}>{t.account.faqEmpty}</Text>}
            {faq.map((item) => {
              const expanded = open === item.q;
              return (
                <View key={item.q} style={styles.item}>
                  <Pressable onPress={() => toggle(item.q)} style={styles.itemHead}>
                    <Text style={styles.itemTitle}>{item.q}</Text>
                    <View style={expanded && styles.rotated}>
                      <Icon name="chevronDown" color={colors.primary} size={18} />
                    </View>
                  </Pressable>
                  {expanded && <Text style={styles.answer}>{item.a}</Text>}
                </View>
              );
            })}
          </>
        )}

        {tab === 'contact' &&
          contacts.map((item) => {
            const expanded = open === item.key;
            return (
              <View key={item.key} style={styles.contact}>
                <Pressable onPress={() => toggle(item.key)} style={styles.contactHead}>
                  <View style={styles.contactIcon}>
                    <Icon name={contactIcons[item.key] ?? 'help'} color={colors.primary} size={18} />
                  </View>
                  <Text style={styles.contactTitle}>{item.title}</Text>
                  <View style={expanded && styles.rotated}>
                    <Icon name="chevronDown" color={colors.primary} size={18} />
                  </View>
                </Pressable>
                {expanded && <Text style={styles.contactValue}>{item.value}</Text>}
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  side: {
    width: 32,
  },
  title: {
    flex: 1,
    ...fonts.semiBold,
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
  },
  searchInput: {
    flex: 1,
    ...fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.sm + 2,
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...fonts.semiBold,
    fontSize: 14,
    color: colors.primary,
  },
  tabTextActive: {
    color: colors.white,
  },
  groups: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  group: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  groupActive: {
    backgroundColor: colors.primary,
  },
  groupText: {
    ...fonts.medium,
    fontSize: 12,
    color: colors.primary,
  },
  groupTextActive: {
    color: colors.white,
  },
  empty: {
    ...fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  itemHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
  },
  itemTitle: {
    flex: 1,
    ...fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  answer: {
    ...fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
  },
  rotated: {
    transform: [{ rotate: '180deg' }],
  },
  contact: {
    paddingVertical: spacing.xs,
  },
  contactHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  contactIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
  },
  contactTitle: {
    flex: 1,
    ...fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  contactValue: {
    ...fonts.medium,
    fontSize: 14,
    color: colors.primary,
    marginLeft: 52,
    marginTop: spacing.xs,
  },
});
