import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, spacing } from '../theme';

type Props = {
  text: string;
  linkText: string;
  onPress: () => void;
};

export function LinkRow({ text, linkText, onPress }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.text}>{text} </Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={styles.link}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  text: {
    ...fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  link: {
    ...fonts.bold,
    fontSize: 13,
    color: colors.primary,
  },
});
