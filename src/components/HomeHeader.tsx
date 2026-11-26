import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { userAvatarIndex } from '../illustrations/avatars';
import { colors, fonts, spacing } from '../theme';
import { Avatar } from './Avatar';
import { CircleButton } from './CircleButton';
import { Icon } from './Icon';

type Props = {
  name: string;
  onBell: () => void;
  onSettings: () => void;
};

export function HomeHeader({ name, onBell, onSettings }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.row}>
      <Avatar preset={userAvatarIndex} size={46} />
      <View style={styles.texts}>
        <Text style={styles.greeting}>{t.home.greeting}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <View style={styles.buttons}>
        <CircleButton onPress={onBell} size={34}>
          <Icon name="bell" color={colors.primary} size={18} />
        </CircleButton>
        <CircleButton onPress={onSettings} size={34}>
          <Icon name="settings" color={colors.primary} size={18} />
        </CircleButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texts: {
    flex: 1,
    marginLeft: spacing.sm + 2,
  },
  greeting: {
    ...fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  name: {
    ...fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
